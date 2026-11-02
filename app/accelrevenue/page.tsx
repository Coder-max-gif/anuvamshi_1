import type { Metadata } from "next";
import Link from "next/link";
import { accel } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Eyebrow } from "@/components/ui/Blocks";
import { Reveal } from "@/components/motion/Reveal";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "AccelRevenue",
  description: "AccelRevenue — an initiative founded by Anuvamshi Shetty, focused on connecting women entrepreneurs with investors.",
};

const sides = [
  { id: "entrepreneurs", who: "Women entrepreneurs", what: "Looking to connect with investors.", cta: "Enquire as a founder", href: "/contact#founders" },
  { id: "investors", who: "Investors", what: "Interested in connecting with women entrepreneurs.", cta: "Enquire as an investor", href: "/contact#investors" },
];

export default function AccelRevenue() {
  return (
    <>
      <PageHero
        still="closeup"
        position="50% 28%"
        eyebrow="An initiative founded by Anuvamshi Shetty"
        title="Accel"
        titleEm="Revenue"
        joined
        intro="An initiative focused on connecting women entrepreneurs with investors."
      />

      <section className="dusk-band py-28 md:py-44">
        <Container>
          <Reveal stagger className="mx-auto max-w-4xl text-center">
            <Eyebrow className="justify-center">The focus</Eyebrow>
            <p className="mt-8 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[1.05] text-bone">
              One clear purpose: <em className="italic text-sand">connecting women entrepreneurs with investors.</em>
            </p>
            <p className="sr-only">{accel.body}</p>
          </Reveal>
        </Container>
      </section>

      <section aria-label="Who AccelRevenue connects" className="bg-ink py-24 md:py-36">
        <Container>
          <Reveal stagger className="grid gap-px overflow-hidden rounded-sm border border-bone/10 bg-bone/10 md:grid-cols-2">
            {sides.map((s, i) => (
              <div key={s.id} className="flex flex-col bg-ink p-8 md:p-14">
                <span className="text-xs tabular-nums tracking-[0.2em] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-6 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-light leading-tight text-bone">{s.who}</h2>
                <p className="mt-4 leading-relaxed text-bone/65">{s.what}</p>
                <div className="mt-auto pt-10">
                  <Link href={s.href} className="btn-ghost">{s.cta}</Link>
                </div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <NextChapter current="/accelrevenue" />
    </>
  );
}
