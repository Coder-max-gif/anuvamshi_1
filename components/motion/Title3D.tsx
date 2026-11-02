"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Heading whose words hinge up out of the page in 3D (rotateX from below, inside line masks).
 * Text stays real, selectable and readable by screen readers (SplitText adds aria handling).
 */
export function Title3D({ children, as: Tag = "h2", className, id }: { children: ReactNode; as?: "h1" | "h2" | "h3"; className?: string; id?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, {
              rotationX: -88,
              yPercent: 70,
              z: -60,
              opacity: 0,
              transformOrigin: "50% 100% -30px",
              transformPerspective: 700,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.045,
              scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
            }),
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}
