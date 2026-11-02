import type { Metadata } from "next";
import Link from "next/link";
import { capital } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Eyebrow, SectionTitle, ServiceList } from "@/components/ui/Blocks";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Photo } from "@/components/ui/Photo";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "Capital & Advisory",
  description: "Capital raising, investment banking, strategic advisory, compliance navigation and investor connections for businesses, startups and founders.",
};

const audiences = [
  { who: "Businesses & startups", what: "Exploring fundraising opportunities and connecting with potential investors." },
  { who: "Founders", what: "Refining business strategy, positioning and fundraising presentations." },
  { who: "Teams preparing to raise", what: "Understanding fundraising-related compliance and documentation requirements." },
];

export default function CapitalAdvisory() {
  return (
    <>
      <PageHero
        still="turn"
        position="42% 40%"
        eyebrow="Capital & Advisory"
        title="Capital,"
        titleEm="with context."
        intro="Capital raising, investment banking, strategic advisory, compliance navigation and investor connections — for businesses and startups exploring fundraising."
      />

      <section className="bg-ink py-24 md:py-36">
        <Container className="grid gap-14 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Eyebrow index="01">For founders &amp; investors</Eyebrow>
              <Parallax amount={6} className="mt-10 aspect-[4/5] max-w-xs rounded-sm max-md:hidden">
                <Photo name="portrait-desk" position="55% 25%" decorative />
              </Parallax>
            </div>
          </div>
          <div className="md:col-span-8">
            <ServiceList items={capital} large />
          </div>
        </Container>
      </section>

      <section aria-labelledby="for" className="bg-deep py-24 md:py-36">
        <Container>
          <Eyebrow index="02">Who it is for</Eyebrow>
          <SectionTitle className="mt-6 max-w-3xl">
            <span id="for">
              Built around <em className="italic text-sand">the founder&rsquo;s raise.</em>
            </span>
          </SectionTitle>
          <Reveal stagger className="mt-14 grid gap-px overflow-hidden rounded-sm border border-bone/10 bg-bone/10 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.who} className="bg-deep p-8 md:p-10">
                <h3 className="font-display text-2xl font-light text-bone md:text-3xl">{a.who}</h3>
                <p className="mt-4 leading-relaxed text-bone/65">{a.what}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-14">
            <Link href="/contact#founders" className="btn-primary">Make a founder enquiry</Link>
          </div>
        </Container>
      </section>

      <NextChapter current="/capital-advisory" />
    </>
  );
}
