import type { Metadata } from "next";
import { markets, newsletter, sectorLenses } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, SectionHead, ServiceList } from "@/components/ui/Blocks";
import { ConfigLink } from "@/components/ui/Config";
import { Reveal } from "@/components/motion/Reveal";
import { LensRing } from "@/components/sections/LensRing";
import { SectorNotes } from "@/components/sections/SectorNotes";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "Private Markets",
  description: `${newsletter.name}: ${newsletter.pitch} ${newsletter.cadence}.`,
};

export default function PrivateMarkets() {
  return (
    <>
      <PageHero
        still="dusk"
        position="50% 30%"
        eyebrow={newsletter.name}
        title="Private markets,"
        titleEm="sector by sector."
        intro={`${newsletter.pitch} ${newsletter.cadence}.`}
      >
        <ConfigLink k="newsletter" variant="primary">Subscribe to the notes</ConfigLink>
      </PageHero>

      {/* The library */}
      <section id="notes" aria-labelledby="notes-title" className="scroll-mt-24 bg-ink py-24 md:py-36">
        <Container>
          <SectionHead index="01" eyebrow="The library" id="notes-title" title={<>Sector notes, <em className="italic text-sand">newest first.</em></>} aside={<p className="leading-relaxed text-bone/65">Each edition covers one sector. Over time the notes build into a library of the sectors that make up private markets.</p>} />
          <div className="mt-14">
            <SectorNotes />
          </div>
        </Container>
      </section>

      {/* The method */}
      <section aria-labelledby="method-title" className="overflow-hidden bg-deep py-24 md:py-36">
        <Container>
          <SectionHead index="02" eyebrow="The method" id="method-title" title={<>Seven lenses <em className="italic text-sand">on every sector.</em></>} />
          <div className="mt-12 grid items-center gap-12 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7 md:order-2">
              <LensRing items={sectorLenses} />
            </div>
            <Reveal as="ol" stagger className="border-t border-bone/10 md:order-1 md:col-span-5">
              {sectorLenses.map((l, i) => (
                <li key={l.title} className="grid grid-cols-[2.5rem_1fr] gap-x-3 border-b border-bone/10 py-4">
                  <span className="pt-1 text-xs tabular-nums tracking-[0.2em] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-xl text-bone">{l.title}</span>
                    <span className="mt-1 block text-sm text-bone/60">{l.body}</span>
                  </span>
                </li>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* The disciplines behind it */}
      <section aria-labelledby="disc-title" className="bg-ink py-24 md:py-36">
        <Container className="grid gap-14 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <SectionHead index="03" eyebrow="Behind the notes" id="disc-title" title={<>Research <em className="italic text-sand">and analysis.</em></>} />
          </div>
          <div className="md:col-span-7">
            <ServiceList items={markets} large />
          </div>
        </Container>
      </section>

      <NextChapter current="/private-markets" />
    </>
  );
}
