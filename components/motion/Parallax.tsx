"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** Restrained image parallax (imagery only, never text). `amount` is yPercent each way (≤12). */
export function Parallax({ children, amount = 8, className }: { children: ReactNode; amount?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          inner.current,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: outer },
  );

  return (
    <div ref={outer} className={`relative overflow-hidden ${className ?? ""}`}>
      <div ref={inner} className="absolute inset-[-14%_0] will-change-transform">
        {children}
      </div>
    </div>
  );
}
