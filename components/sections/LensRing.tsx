"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Item } from "@/lib/content";

/**
 * The seven lenses of a sector note, arranged on a 3D ring (CSS 3D — crisp text, no WebGL).
 * Scrolling turns the ring so each lens faces you in turn; the pointer tilts it.
 * The same lenses are listed in plain text beside it, so the ring itself is decorative (aria-hidden).
 */
export function LensRing({ items }: { items: Item[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const n = items.length;
  const [dim, setDim] = useState({ w: 300, h: 220, r: 360 });

  useEffect(() => {
    const size = () => {
      const w = window.innerWidth < 768 ? 220 : 300;
      const h = window.innerWidth < 768 ? 180 : 220;
      setDim({ w, h, r: Math.round(w / 2 / Math.tan(Math.PI / n)) + 40 });
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, [n]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ring.current,
          { rotationY: 0 },
          { rotationY: (-360 * (n - 1)) / n, ease: "none", scrollTrigger: { trigger: stage.current, start: "top 80%", end: "bottom 20%", scrub: 0.8 } },
        );
      });
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const rx = gsap.quickTo(stage.current, "rotationX", { duration: 1, ease: "power3.out" });
        const move = (e: PointerEvent) => rx(-8 + (e.clientY / window.innerHeight - 0.5) * -8);
        gsap.set(stage.current, { rotationX: -8 });
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  return (
    <div aria-hidden className="relative h-[380px] [perspective:1400px] md:h-[460px]">
      <div ref={stage} className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
        <div ref={ring} className="relative [transform-style:preserve-3d]" style={{ width: dim.w, height: dim.h }}>
          {items.map((it, i) => (
            <div
              key={it.title}
              className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-bone/10 bg-[linear-gradient(150deg,rgba(20,38,74,.92)_0%,rgba(10,18,34,.96)_60%)] p-6 shadow-[0_30px_60px_-24px_rgba(0,0,0,.9)] [backface-visibility:hidden]"
              style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(${dim.r}px)` }}
            >
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.22em]">
                <span className="text-amber">Lens</span>
                <span className="tabular-nums text-bone/40">
                  {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                </span>
              </div>
              <div>
                <p className="font-display text-[1.9rem] font-light leading-none text-bone md:text-[2.3rem]">{it.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-bone/60">{it.body}</p>
              </div>
              <span className="h-px w-full bg-gradient-to-r from-ember/70 via-amber/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
