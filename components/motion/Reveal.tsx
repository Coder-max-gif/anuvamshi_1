"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** animate direct children one after another instead of the wrapper */
  stagger?: boolean;
  delay?: number;
  id?: string;
};

/** Fade/rise into view once. Transform + opacity only; instant under reduced motion. */
export function Reveal({ children, as: Tag = "div", className, stagger = false, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current;
        if (!el) return;
        const targets = stagger ? Array.from(el.children) : el;
        gsap.from(targets, {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          delay,
          ease: "expo.out",
          stagger: stagger ? 0.09 : 0,
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
