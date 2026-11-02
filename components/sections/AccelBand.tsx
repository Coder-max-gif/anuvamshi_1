"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { canUseWebGL, prefersReducedMotion } from "@/lib/capabilities";
import { isLowPower } from "@/lib/sequence";
import { accel, person } from "@/lib/content";

const DuskField = dynamic(() => import("@/components/webgl/DuskField"), { ssr: false });

/** AccelRevenue: the film's dusk backdrop carried into the page as live light, with a 3D letter reveal. */
export function AccelBand({ index = "04" }: { index?: string }) {
  const root = useRef<HTMLElement>(null);
  const [gl, setGl] = useState(false);

  useEffect(() => setGl(!prefersReducedMotion() && !isLowPower() && canUseWebGL()), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(q("[data-accel-title]")[0], {
          type: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              rotationY: -100,
              rotationX: 25,
              z: -200,
              opacity: 0,
              transformOrigin: "50% 50% -40px",
              transformPerspective: 900,
              duration: 1.4,
              ease: "expo.out",
              stagger: { each: 0.05, from: "center" },
              scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
            }),
        });
        gsap.fromTo(q("[data-accel-inner]"), { rotationX: 18, y: 80, transformPerspective: 1200 }, {
          rotationX: -6, y: -40, ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
        return () => split.revert();
      });
      mm.add(`${MOTION_OK} and (pointer: fine)`, () => {
        const inner = q("[data-accel-title]")[0];
        const ry = gsap.quickTo(inner, "rotationY", { duration: 1, ease: "power3.out" });
        const move = (e: PointerEvent) => ry((e.clientX / window.innerWidth - 0.5) * 14);
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="accelrevenue" aria-labelledby="accel-title" className="dusk-band relative isolate overflow-hidden py-36 md:py-56">
      {gl && <DuskField />}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-deep to-transparent" />
      <div className="relative mx-auto w-full max-w-[1440px] px-6 [perspective:1200px] md:px-12">
        <div data-accel-inner className="mx-auto max-w-5xl text-center [transform-style:preserve-3d]">
          <p className="eyebrow flex items-center justify-center gap-3 text-amber">
            <span className="tabular-nums text-bone/50">{index}</span>
            <span aria-hidden className="h-px w-8 bg-bone/30" />
            An initiative founded by {person.name.split(" ")[0]}
          </p>
          <h2 id="accel-title" data-accel-title className="mt-8 font-display text-[clamp(3.6rem,12vw,11rem)] font-light leading-[0.9] tracking-[-0.02em] text-bone [transform-style:preserve-3d]">
            Accel<em className="italic text-sand">Revenue</em>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-light leading-snug text-bone/90">
            Connecting women entrepreneurs with investors.
          </p>
          <p className="sr-only">{accel.body}</p>
          <div className="mt-12 flex justify-center">
            <Link href="/accelrevenue" className="btn-primary">Discover AccelRevenue</Link>
          </div>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}
