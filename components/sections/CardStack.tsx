"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { Item } from "@/lib/content";

/**
 * A deck of service cards that stack in 3D as you scroll: each card swings up from below,
 * locks (CSS sticky — native scroll, no pinning) and is pushed back into depth by the next.
 * Each card carries a real frame from the founder film.
 */
export function CardStack({ items, frames = [], label = "Capital & Advisory" }: { items: Item[]; frames?: string[]; label?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root.current);
        cards.forEach((card, i) => {
          const inner = card.querySelector<HTMLElement>("[data-inner]")!;
          const img = card.querySelector<HTMLElement>("[data-img]");
          const shade = card.querySelector<HTMLElement>("[data-shade]");

          // arrive: hinge up from below
          gsap.fromTo(
            inner,
            { rotationX: -28, y: 140, opacity: 0.2, transformPerspective: 1400, transformOrigin: "50% 100%" },
            { rotationX: 0, y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: 0.6 } },
          );
          if (img) gsap.fromTo(img, { yPercent: -10, scale: 1.15 }, { yPercent: 10, scale: 1.05, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });

          // recede: pushed back by the next card
          const next = cards[i + 1];
          if (!next) return;
          gsap
            .timeline({ scrollTrigger: { trigger: next, start: "top 85%", end: "top 25%", scrub: 0.6 } })
            .to(inner, { scale: 0.9 - (cards.length - i) * 0.008, rotationX: 10, y: -30, transformOrigin: "50% 0%", ease: "none" }, 0)
            .to(shade, { opacity: 0.55, ease: "none" }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      {items.map((it, i) => (
        <div key={it.title} data-card className="sticky pb-6" style={{ top: `calc(14vh + ${i * 18}px)` }}>
          <article
            data-inner
            className={`relative grid overflow-hidden rounded-[22px] border border-bone/10 bg-[linear-gradient(140deg,#0e1a31_0%,#0a1222_45%,#06080c_100%)] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] will-change-transform ${frames.length ? "md:min-h-[58vh] md:grid-cols-[1.05fr_1fr]" : "md:min-h-[44vh]"}`}
          >
            <div className="relative z-10 flex flex-col justify-between gap-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-amber">{label}</span>
                <span className="font-display text-5xl font-light italic text-bone/15 md:text-8xl">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <h3 className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-light leading-[1] text-bone">{it.title}</h3>
                <p className="mt-5 max-w-[40ch] leading-relaxed text-bone/70">{it.body}</p>
              </div>
            </div>
            {frames.length > 0 && (
            <div className="relative h-56 overflow-hidden md:h-auto">
              <div data-img className="absolute inset-0 will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frames[i % frames.length]} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,#0a1222_0%,rgba(10,18,34,.35)_35%,rgba(10,18,34,0)_70%)] max-md:bg-[linear-gradient(0deg,#0a1222_0%,rgba(10,18,34,0)_60%)]" />
            </div>
            )}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent" />
            <div data-shade aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />
          </article>
        </div>
      ))}
    </div>
  );
}
