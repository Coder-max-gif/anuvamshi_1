import { frameSrc, progressToSourceFrame, type SequenceSet } from "@/lib/sequence";

/**
 * Framework-agnostic canvas frame-sequence engine.
 *
 * Smoothness:
 *  - Scroll progress is mapped through a motion-weighted curve (see scripts/extract-frames.mjs), so
 *    scroll distance follows visible motion — static stretches pass quickly instead of feeling stuck.
 *  - The decode window is direction-aware: it decodes further AHEAD of the playhead than behind it,
 *    so forward and reverse scrubbing both find their next frames ready.
 *
 * Memory (desktop would need ~1.9 GB fully decoded):
 *  - Every frame is fetched once as a compressed Blob and kept (~12 MB desktop).
 *  - Only a window of ImageBitmaps around the playhead is decoded; the rest are closed.
 *  - Bitmaps are decoded at the size they are drawn (never larger than the source).
 *  - Loading order: frame 0, then coarse strides (16, 8, 4, 2, 1) so any scroll position has a near frame early.
 *  - The last painted frame stays on the canvas until a better one is ready: no blank flashes.
 */

type Decoded = ImageBitmap | HTMLImageElement;

export type FrameEngineOptions = {
  /** frames decoded ahead of the playhead (in the direction of travel) */
  ahead?: number;
  /** frames kept behind the playhead */
  behind?: number;
  maxDpr?: number;
  focalX?: number;
  focalY?: number;
  /** 0..1 easing toward the target frame per animation frame (1 = no smoothing) */
  smoothing?: number;
  onFirstPaint?: () => void;
  onError?: (err: unknown) => void;
  onFrame?: (index: number) => void;
};

const HYSTERESIS = 4;
const FETCH_CONCURRENCY = 8;
const DECODE_CONCURRENCY = 6;

function loadOrder(count: number): number[] {
  const seen = new Set<number>([0]);
  const order = [0];
  for (const stride of [16, 8, 4, 2, 1]) {
    for (let i = 0; i < count; i += stride) if (!seen.has(i)) (seen.add(i), order.push(i));
  }
  if (!seen.has(count - 1)) order.push(count - 1);
  return order;
}

export class FrameEngine {
  private ctx: CanvasRenderingContext2D;
  private blobs: (Blob | null)[];
  private decoded = new Map<number, Decoded>();
  private decoding = new Set<number>();
  private failed = new Set<number>();
  private queue: number[];
  private inflight = 0;
  private abort = new AbortController();
  private target = 0;
  private current = 0;
  private dir: 1 | -1 = 1;
  private painted = -1;
  private raf = 0;
  private destroyed = false;
  private active = true;
  private decodeW = 0;
  private decodeH = 0;
  private o: Required<Omit<FrameEngineOptions, "onFirstPaint" | "onError" | "onFrame">> & FrameEngineOptions;

  constructor(private canvas: HTMLCanvasElement, private set: SequenceSet, private curve: number[], options: FrameEngineOptions = {}) {
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.o = { ahead: 18, behind: 6, maxDpr: 2, focalX: 0.5, focalY: 0.4, smoothing: 0.3, ...options };
    this.blobs = new Array(set.count).fill(null);
    this.queue = loadOrder(set.count);
  }

  start() {
    this.resize();
    this.pump();
    this.kick();
  }

  /** p in [0,1] — scroll progress through the film section */
  setProgress(p: number) {
    const src = progressToSourceFrame(this.curve, Math.min(1, Math.max(0, p)));
    const next = Math.min(this.set.count - 1, src / this.set.step);
    if (next !== this.target) this.dir = next > this.target ? 1 : -1;
    this.target = next;
    this.prioritise(Math.round(next));
    this.ensureWindow();
    this.kick();
  }

  /** Pause rendering and release decoded frames while the section is off-screen. */
  setActive(active: boolean) {
    if (this.active === active) return;
    this.active = active;
    if (!active) {
      // Park on the exact target frame (e.g. the last frame after a fast scroll past the end)
      // instead of freezing wherever the easing happened to be.
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      this.current = this.target;
      this.paint(Math.round(this.target), true);
      this.ensureWindow();
    } else {
      this.ensureWindow();
      this.kick();
    }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, this.o.maxDpr);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    // Decode size = cover-drawn size, capped at source size (never upscale during decode).
    const scale = Math.min(1, Math.max(w / this.set.width, h / this.set.height));
    this.decodeW = Math.round(this.set.width * scale);
    this.decodeH = Math.round(this.set.height * scale);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.ctx.imageSmoothingEnabled = true;
      this.ctx.imageSmoothingQuality = "high";
      this.ctx.fillStyle = "#06080c";
      this.ctx.fillRect(0, 0, w, h);
      const p = this.painted;
      this.painted = -1;
      if (p >= 0) this.paint(p, true);
    }
  }

  destroy() {
    this.destroyed = true;
    this.abort.abort();
    cancelAnimationFrame(this.raf);
    for (const [i, bmp] of this.decoded) this.release(i, bmp);
    this.decoded.clear();
    this.blobs = [];
  }

  // ---------- loading ----------

  private windowRange(center: number): [number, number] {
    const a = this.dir > 0 ? this.o.behind : this.o.ahead;
    const b = this.dir > 0 ? this.o.ahead : this.o.behind;
    return [Math.max(0, center - a), Math.min(this.set.count - 1, center + b)];
  }

  /** indices in window order: playhead first, then alternating, biased in the direction of travel */
  private windowOrder(center: number): number[] {
    const [lo, hi] = this.windowRange(center);
    const out = [center];
    for (let d = 1; center + d <= hi || center - d >= lo; d++) {
      const fwd = center + d * this.dir;
      const back = center - d * this.dir;
      if (fwd >= lo && fwd <= hi) out.push(fwd);
      if (d % 3 === 0 && back >= lo && back <= hi) out.push(back); // ~1 behind per 3 ahead
    }
    for (let i = lo; i <= hi; i++) if (!out.includes(i)) out.push(i);
    return out;
  }

  private prioritise(center: number) {
    const near = this.windowOrder(center).filter((i) => !this.blobs[i] && !this.failed.has(i));
    if (!near.length) return;
    const nearSet = new Set(near);
    this.queue = near.concat(this.queue.filter((i) => !nearSet.has(i)));
    this.pump();
  }

  private pump() {
    while (!this.destroyed && this.inflight < FETCH_CONCURRENCY && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.blobs[i] || this.failed.has(i)) continue;
      this.inflight++;
      fetch(frameSrc(this.set, i), { signal: this.abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.blob();
        })
        .then((blob) => {
          if (this.destroyed) return;
          this.blobs[i] = blob;
          this.ensureWindow();
        })
        .catch((err) => {
          if (this.destroyed) return;
          this.failed.add(i);
          if (i === 0) this.o.onError?.(err);
        })
        .finally(() => {
          this.inflight--;
          this.pump();
        });
    }
  }

  // ---------- decoding window ----------

  private ensureWindow() {
    if (this.destroyed) return;
    const center = Math.round(this.target);

    if (!this.active) {
      // Off-screen: keep only the parked frame; make sure the exact target frame gets decoded and painted.
      for (const [i, bmp] of this.decoded) if (i !== this.painted && i !== center) this.release(i, bmp);
      const blob = this.blobs[center];
      if (this.painted !== center && blob && !this.decoded.has(center) && !this.decoding.has(center)) this.decode(center, blob);
      return;
    }

    const [lo, hi] = this.windowRange(center);
    for (const [i, bmp] of this.decoded) {
      if ((i < lo - HYSTERESIS || i > hi + HYSTERESIS) && i !== this.painted) this.release(i, bmp);
    }

    // Also keep the frames between the eased playhead and the target decoded.
    const cur = Math.round(this.current);
    const order = cur === center ? this.windowOrder(center) : [cur, ...this.windowOrder(center)];
    for (const i of order) {
      if (this.decoding.size >= DECODE_CONCURRENCY) break;
      const blob = this.blobs[i];
      if (!blob || this.decoded.has(i) || this.decoding.has(i)) continue;
      this.decode(i, blob);
    }
  }

  private decode(i: number, blob: Blob) {
    this.decoding.add(i);
    const done = (img: Decoded | null) => {
      this.decoding.delete(i);
      if (this.destroyed) {
        if (img && "close" in img) img.close();
        return;
      }
      if (img) {
        this.decoded.set(i, img);
        if (!this.active && i === Math.round(this.target)) this.paint(i, true);
        else if (Math.abs(i - this.current) < 1.5 || this.painted < 0) this.kick(true);
      } else this.failed.add(i);
      this.ensureWindow();
    };

    if (typeof createImageBitmap === "function") {
      const resize = this.decodeW && this.decodeW < this.set.width;
      const p = resize
        ? createImageBitmap(blob, { resizeWidth: this.decodeW, resizeHeight: this.decodeH, resizeQuality: "high" })
        : createImageBitmap(blob);
      p.then(done, () => done(null));
    } else {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.src = url;
      img.decode().then(
        () => (URL.revokeObjectURL(url), done(img)),
        () => (URL.revokeObjectURL(url), done(null)),
      );
    }
  }

  private release(i: number, bmp: Decoded) {
    if ("close" in bmp) bmp.close();
    this.decoded.delete(i);
  }

  // ---------- rendering ----------

  private needsPaint = false;

  private kick(repaint = false) {
    if (repaint) this.needsPaint = true;
    if (!this.raf && this.active && !this.destroyed) this.raf = requestAnimationFrame(this.tick);
  }

  private tick = () => {
    this.raf = 0;
    if (this.destroyed || !this.active) return;
    const diff = this.target - this.current;
    this.current = Math.abs(diff) < 0.05 ? this.target : this.current + diff * this.o.smoothing;
    this.paint(Math.round(this.current), this.needsPaint);
    this.needsPaint = false;
    if (this.current !== this.target) this.raf = requestAnimationFrame(this.tick);
  };

  /** Paint frame `idx`, or the nearest decoded frame (preferring frames already passed) if it isn't ready. */
  private paint(idx: number, force = false) {
    let use = -1;
    if (this.decoded.has(idx)) use = idx;
    else {
      for (let d = 1; d < this.set.count; d++) {
        const back = idx - d * this.dir;
        const fwd = idx + d * this.dir;
        if (this.decoded.has(back)) { use = back; break; }
        if (this.decoded.has(fwd)) { use = fwd; break; }
      }
    }
    if (use < 0 || (use === this.painted && !force)) return;

    const img = this.decoded.get(use)!;
    const { width: cw, height: ch } = this.canvas;
    const iw = img.width;
    const ih = img.height;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    this.ctx.drawImage(img, (cw - dw) * this.o.focalX, (ch - dh) * this.o.focalY, dw, dh);

    const first = this.painted < 0;
    this.painted = use;
    if (first) this.o.onFirstPaint?.();
    this.o.onFrame?.(use);
  }
}
