import manifest from "@/public/sequence/manifest.json";

/** Compact description of one extracted frame set. Frame i lives at `${base}/f${pad4(i+1)}.webp`. */
export type SequenceSet = {
  id: "desktop" | "mobile" | "portrait";
  base: string;
  width: number;
  height: number;
  count: number;
  /** source frames per extracted frame */
  step: number;
  fps: number;
  bytes: number;
};

export type SequenceData = {
  sets: Record<SequenceSet["id"], SequenceSet>;
  /** curve[f] = scroll progress (0..1) at which source frame f is shown; motion-weighted, monotonic. */
  curve: number[];
};

type RawSet = { width: number; height: number; count: number; bytes: number; step: number };

/** Server-side: reduce the manifest to what the client needs. */
export function getSequenceData(): SequenceData {
  const fps = Number(manifest.source.fps);
  const sets = manifest.sets as unknown as Record<SequenceSet["id"], RawSet>;
  const make = (id: SequenceSet["id"]): SequenceSet => {
    const s = sets[id];
    return { id, base: `/sequence/${id}`, width: s.width, height: s.height, count: s.count, bytes: s.bytes, fps, step: s.step };
  };
  return { sets: { desktop: make("desktop"), mobile: make("mobile"), portrait: make("portrait") }, curve: manifest.curve as number[] };
}

export const frameSrc = (set: SequenceSet, i: number) => `${set.base}/f${String(i + 1).padStart(4, "0")}.webp`;

/** Inverse of the motion curve: scroll progress → fractional source frame. */
export function progressToSourceFrame(curve: number[], p: number): number {
  const last = curve.length - 1;
  if (p <= 0) return 0;
  if (p >= 1) return last;
  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (curve[mid] < p) lo = mid;
    else hi = mid;
  }
  const span = curve[hi] - curve[lo] || 1;
  return lo + (p - curve[lo]) / span;
}

type NavigatorHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

export function isLowPower(): boolean {
  if (typeof navigator === "undefined") return false;
  const n = navigator as NavigatorHints;
  return Boolean(n.connection?.saveData) || (n.deviceMemory !== undefined && n.deviceMemory <= 4) || (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 4);
}

/** Client-side: choose the set that best matches the viewport and device. */
export function selectSet(sets: SequenceData["sets"]): SequenceSet {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (h > w * 1.1) return sets.portrait;
  if (w < 900 || isLowPower()) return sets.mobile;
  return sets.desktop;
}
