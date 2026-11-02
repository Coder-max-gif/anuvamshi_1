"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Image that opens like a shutter (clip-path) while settling from a slight 3D lean and over-scale. */
export function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const inner = outer.current!.firstElementChild as HTMLElement;
        gsap
          .timeline({ scrollTrigger: { trigger: outer.current, start: "top 90%", end: "top 25%", scrub: 0.8 } })
          .fromTo(outer.current, { clipPath: "inset(18% 22% 18% 22% round 24px)", rotationY: -10, transformPerspective: 1400 }, { clipPath: "inset(0% 0% 0% 0% round 4px)", rotationY: 0, ease: "power2.out" }, 0)
          .fromTo(inner, { scale: 1.35 }, { scale: 1, ease: "power2.out" }, 0);
      });
      return () => mm.revert();
    },
    { scope: outer },
  );

  return (
    <div ref={outer} className={`relative overflow-hidden will-change-transform ${className ?? ""}`}>
      <div className="absolute inset-0 will-change-transform">{children}</div>
    </div>
  );
}
