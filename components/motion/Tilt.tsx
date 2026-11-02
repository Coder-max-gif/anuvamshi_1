"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Pointer-driven 3D tilt with a soft light sheen. Children marked `data-depth="40"` float
 * forward on the Z axis (preserve-3d), giving cards real parallax depth.
 * Fine pointers only; static on touch and under reduced motion.
 */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const el = ref.current!;
        const sheen = el.querySelector<HTMLElement>("[data-sheen]");
        gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
        const depth = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
        depth.forEach((d) => gsap.set(d, { z: Number(d.dataset.depth) || 30 }));

        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          ry(nx * max * 2);
          rx(-ny * max * 2);
          if (sheen) gsap.to(sheen, { opacity: 1, "--sx": `${(nx + 0.5) * 100}%`, "--sy": `${(ny + 0.5) * 100}%`, duration: 0.4, overwrite: "auto" });
        };
        const leave = () => {
          rx(0);
          ry(0);
          if (sheen) gsap.to(sheen, { opacity: 0, duration: 0.6 });
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative will-change-transform [transform-style:preserve-3d] ${className ?? ""}`}>
      {children}
      <span
        data-sheen
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 [background:radial-gradient(600px_circle_at_var(--sx,50%)_var(--sy,50%),rgba(240,164,93,.16),transparent_45%)]"
      />
    </div>
  );
}
