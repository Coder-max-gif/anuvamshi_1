import type { Metadata } from "next";
import Link from "next/link";
import { accel, capital, learn, markets, person, positioning } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Blocks";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { NextChapter } from "@/components/ui/NextChapter";
import { Photo } from "@/components/ui/Photo";
import { Tilt } from "@/components/motion/Tilt";

export const metadata: Metadata = {
  title: "About",
  description: `${person.name} — ${person.role}. ${positioning}`,
};

const areas = [
  ...capital.map((c) => ({ ...c, href: "/capital-advisory" })),
  ...markets.map((c) => ({ ...c, href: "/private-markets" })),
  { ...accel, href: "/accelrevenue" },
  { ...learn[0], href: "/free-resources" },
  { ...learn[1], href: "/courses" },
];

export default function About() {
  return (
    <>
      <PageHero photo="portrait-warm" position="50% 30%" eyebrow="About" title="Anuvamshi" titleEm="Shetty" intro={`${person.role}.`} />

      <section className="bg-ink py-28 md:py-40">
        <Container>
          <SplitReveal
            text={positioning}
            emphasis={["fundraising", "education"]}
            className="max-w-[24ch] font-display text-[clamp(2rem,4.2vw,4.2rem)] font-light leading-[1.1] text-bone"
          />
        </Container>
      </section>

      <section aria-labelledby="areas" className="bg-deep py-24 md:py-36">
        <Container>
          <Eyebrow>Areas of work</Eyebrow>
          <SectionTitle className="mt-6">
            <span id="areas">
              Ten threads, <em className="italic text-sand">one practice.</em>
            </span>
          </SectionTitle>
          <Reveal as="ol" stagger className="mt-14 grid border-t border-bone/10 md:grid-cols-2 md:gap-x-12">
            {areas.map((a, i) => (
              <li key={a.title} className="border-b border-bone/10">
                <Link href={a.href} className="group grid grid-cols-[2.5rem_1fr] gap-x-4 py-6">
                  <span className="pt-1 text-xs tabular-nums tracking-[0.2em] text-bone/35 group-hover:text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-2xl font-light text-bone transition-colors group-hover:text-amber">{a.title}</span>
                    <span className="mt-2 block text-[0.95rem] leading-relaxed text-bone/60">{a.body}</span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      <section aria-label="Photographs" className="bg-ink py-24 md:py-32">
        <Container>
          <Reveal stagger className="grid gap-6 [perspective:1400px] md:grid-cols-12">
            <Tilt max={4} className="rounded-[22px] md:col-span-7">
              <figure className="aspect-[3/2] overflow-hidden rounded-[22px] border border-bone/10">
                <Photo name="stage" position="52% 55%" />
              </figure>
            </Tilt>
            <Tilt max={4} className="rounded-[22px] md:col-span-5">
              <figure className="aspect-[3/2] overflow-hidden rounded-[22px] border border-bone/10 md:aspect-auto md:h-full">
                <Photo name="portrait-desk" position="55% 25%" />
              </figure>
            </Tilt>
          </Reveal>
        </Container>
      </section>

      <NextChapter current="/about" />
    </>
  );
}
