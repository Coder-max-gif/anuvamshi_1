"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Statement text scrubbed word-by-word with scroll. Each word swings up from a 3D hinge
 * (rotateX + depth) while brightening, so the sentence assembles itself as you read.
 * Screen readers get the plain sentence; the per-word spans are presentational.
 */
export function SplitReveal({ text, className, emphasis = [] }: { text: string; className?: string; emphasis?: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current!.querySelectorAll("[data-w]"),
          { opacity: 0.08, rotationX: -75, z: -90, yPercent: 35, transformOrigin: "50% 100% -20px", transformPerspective: 800 },
          {
            opacity: 1,
            rotationX: 0,
            z: 0,
            yPercent: 0,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom 50%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const clean = w.replace(/[^\p{L}-]/gu, "").toLowerCase();
        const em = emphasis.some((e) => e.toLowerCase() === clean);
        return (
          <span key={i} aria-hidden>
            <span data-w className={`inline-block will-change-transform ${em ? "italic text-sand" : ""}`}>
              {w}
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
