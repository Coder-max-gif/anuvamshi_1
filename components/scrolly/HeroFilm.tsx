"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Chapter } from "@/lib/content";
import type { SequenceData, SequenceSet } from "@/lib/sequence";
import { prefersReducedMotion, shouldEnhance } from "@/lib/capabilities";
import { ScrollyCanvas, type ScrollyCanvasHandle } from "./ScrollyCanvas";
import type { FilmState } from "@/components/webgl/FilmFinish";

const FilmFinish = dynamic(() => import("@/components/webgl/FilmFinish"), { ssr: false });

/** Acts of the source film, by source-time in seconds (see CLAUDE.md). */
const ACTS = [
  { from: 0, label: "I — Studio" },
  { from: 2.2, label: "II — Turn" },
  { from: 4, label: "III — Dusk" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function HeroFilm({ data, chapters }: { data: SequenceData; chapters: Chapter[] }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<ScrollyCanvasHandle>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const actRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const film = useRef<FilmState>({ progress: 0, pointer: [0.5, 0.45], active: true });
  const [motion, setMotion] = useState(true);
  const [failed, setFailed] = useState(false);
  const [enhance, setEnhance] = useState(false);

  useEffect(() => {
    setMotion(!prefersReducedMotion());
    setEnhance(shouldEnhance());
  }, []);

  // Pointer position feeds the optional WebGL light (normalised 0..1).
  useEffect(() => {
    if (!enhance) return;
    const onMove = (e: PointerEvent) => {
      film.current.pointer = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight];
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enhance]);

  const onFrame = (i: number, set: SequenceSet) => {
    const t = (i * set.step) / set.fps;
    const secs = Math.floor(t);
    const frames = Math.round((t - secs) * set.fps);
    if (tcRef.current) tcRef.current.textContent = `00:${pad(secs)}:${pad(frames)}`;
    if (actRef.current) actRef.current.textContent = [...ACTS].reverse().find((a) => t >= a.from)!.label;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add(MOTION_OK, () => {

        // 1) Scroll position → film playhead. Standalone trigger, native scroll, no pinning.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            canvas.current?.setProgress(self.progress);
            film.current.progress = self.progress;
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
          },
          onToggle: (self) => {
            canvas.current?.setActive(self.isActive);
            film.current.active = self.isActive;
          },
        });

        // 2) Chapter overlays, timed in film-progress units (timeline duration = 1).
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.set({}, {}, 1);
        const fade = 0.045;
        chapters.forEach((c, idx) => {
          const el = q(`[data-chapter="${c.id}"]`)[0];
          if (!el) return;
          const lines = el.querySelectorAll("[data-line]");
          const [a, b] = c.at;
          if (idx > 0) {
            tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: fade }, a);
            tl.fromTo(lines, { y: 32 }, { y: 0, duration: fade * 1.6, stagger: 0.008, ease: "power2.out" }, a);
          }
          if (b < 1) {
            tl.to(el, { autoAlpha: 0, duration: fade }, b - fade);
            tl.to(lines, { y: -24, duration: fade, stagger: 0.004 }, b - fade);
          }
        });
        tl.to(q("[data-cue]"), { autoAlpha: 0, duration: 0.03 }, 0.01);

        // 3) Restrained push-in across the whole film (imagery only).
        tl.fromTo(q("[data-media]"), { scale: 1 }, { scale: 1.06, duration: 1 }, 0);

        // 4) Exit: as the film section scrolls away, the frame tilts back into depth and dims —
        //    the film "becomes" a card receding behind the content that follows.
        gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "bottom bottom", end: "bottom top", scrub: true },
        })
          .fromTo(
            q("[data-stage]"),
            { rotationX: 0, scale: 1, borderRadius: 0, transformPerspective: 1400, transformOrigin: "50% 0%" },
            { rotationX: 16, scale: 0.84, borderRadius: 28, ease: "power1.in" },
            0,
          )
          .fromTo(q("[data-exit-shade]"), { opacity: 0 }, { opacity: 0.65, ease: "none" }, 0);
      });

      // 5) Pointer camera: a gentle 3D drift of the frame on fine-pointer devices, so even
      //    the near-static close-up keeps a sense of depth. Imagery only; text stays put.
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const tilt = q("[data-tilt]")[0];
        gsap.set(tilt, { transformPerspective: 1600, scale: 1.05 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1.2, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1.2, ease: "power3.out" });
        const tx = gsap.quickTo(tilt, "x", { duration: 1.2, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 4);
          rx(-ny * 3);
          tx(-nx * 18);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [chapters] },
  );

  return (
    <section
      ref={root}
      id="film"
      aria-label="Introduction film"
      className="relative h-[400vh] md:h-[470vh] motion-reduce:h-[100svh]"
    >
      <div data-stage className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink will-change-transform">
        <div data-tilt className="absolute inset-0 will-change-transform">
        <div data-media className="absolute inset-0 will-change-transform">
          {/* Poster = first frame of the film; stays until the canvas paints (no blank flash). */}
          <picture>
            <source media="(orientation: portrait)" srcSet="/sequence/poster-portrait.jpg" />
            <img
              src="/sequence/poster.jpg"
              alt=""
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%] motion-reduce:hidden"
            />
          </picture>
          {/* Reduced motion: a single still from the final act instead of scrubbing. */}
          <picture>
            <source media="(orientation: portrait)" srcSet="/stills/closeup-portrait.webp" />
            <img
              src="/stills/closeup.webp"
              alt="Anuvamshi Shetty, seated, looking towards the camera against a dusk-coloured backdrop"
              className="absolute inset-0 hidden h-full w-full object-cover object-[50%_35%] motion-reduce:block"
            />
          </picture>
          {motion && !failed && (
            <ScrollyCanvas
              ref={canvas}
              data={data}
              focalY={0.38}
              onFrame={onFrame}
              onFailed={() => setFailed(true)}
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
        </div>

        {enhance && motion && <FilmFinish state={film} />}

        <div data-exit-shade aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
        {/* Legibility scrims — darken the left column and the foot of the frame, never the face. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,12,.78)_0%,rgba(6,8,12,.35)_32%,rgba(6,8,12,0)_52%)] max-md:hidden" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-[linear-gradient(0deg,rgba(6,8,12,.92)_0%,rgba(6,8,12,.55)_45%,rgba(6,8,12,0)_100%)] md:h-[35%]" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/70 to-transparent" />

        {/* Chapters */}
        <div className="absolute inset-0 mx-auto max-w-[1440px]">
          {chapters.map((c, idx) => (
            <div
              key={c.id}
              data-chapter={c.id}
              className={`absolute inset-x-6 bottom-[12svh] md:inset-x-auto md:bottom-[16vh] md:left-12 md:max-w-[min(34rem,31vw)] ${
                idx === 0 ? "" : "invisible opacity-0 motion-reduce:hidden"
              }`}
            >
              <p data-line className="eyebrow text-amber">{c.eyebrow}</p>
              {idx === 0 ? (
                <h1 data-line className="mt-5 font-display text-[clamp(3.2rem,13vw,4.75rem)] md:text-[clamp(4rem,6.2vw,6.75rem)] font-light leading-[0.88] tracking-[-0.02em] text-bone">
                  {c.title}
                  <br />
                  <em className="font-normal italic text-sand">{c.titleEm}</em>
                </h1>
              ) : (
                <h2 data-line className="mt-4 font-display text-[clamp(2.2rem,4.6vw,4.4rem)] font-light leading-[1] tracking-[-0.01em] text-bone">
                  {c.title} <em className="italic text-sand">{c.titleEm}</em>
                </h2>
              )}
              {c.body && (
                <p data-line className="mt-5 max-w-md text-[0.98rem] leading-relaxed text-bone/75">
                  {c.body}
                </p>
              )}
              {idx === chapters.length - 1 && (
                <div data-line className="mt-7 flex flex-wrap gap-3">
                  <Link href="/accelrevenue" className="btn-primary">About AccelRevenue</Link>
                  <Link href="/contact" className="btn-ghost">Get in touch</Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Film HUD: real timecode of the painted source frame + progress */}
        <div aria-hidden className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-4 text-[0.68rem] uppercase tracking-[0.22em] text-bone/55 md:right-[max(3rem,calc((100%-1440px)/2+3rem))] md:flex motion-reduce:hidden">
          <span ref={actRef}>I — Studio</span>
          <span className="relative block h-px w-24 overflow-hidden bg-bone/15">
            <span ref={barRef} className="absolute inset-0 origin-left scale-x-0 bg-amber" />
          </span>
          <span ref={tcRef} className="tabular-nums">00:00:00</span>
        </div>

        <div data-cue aria-hidden className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-bone/60 motion-reduce:hidden">
          <span>Scroll to play</span>
          <span className="scroll-line" />
        </div>
      </div>
    </section>
  );
}
