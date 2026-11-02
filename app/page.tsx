import Link from "next/link";
import { HeroFilm } from "@/components/scrolly/HeroFilm";
import { getSequenceData } from "@/lib/sequence";
import { capital, freeTopics, heroChapters, learn, newsletter, person, positioning, sectorLenses, videos } from "@/lib/content";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { ClipReveal } from "@/components/motion/ClipReveal";
import { Still } from "@/components/ui/Still";
import { Photo } from "@/components/ui/Photo";
import { Container, Eyebrow, SectionHead, SectionTitle, TextLink } from "@/components/ui/Blocks";
import { ConfigLink } from "@/components/ui/Config";
import { LiteYouTube } from "@/components/ui/LiteYouTube";
import { CardStack } from "@/components/sections/CardStack";
import { LensRing } from "@/components/sections/LensRing";
import { SectorNotes } from "@/components/sections/SectorNotes";
import { AccelBand } from "@/components/sections/AccelBand";

const paths = [
  { who: "Founders", what: "Raising capital, sharpening strategy and fundraising presentations, or navigating compliance.", href: "/contact#founders", cta: "Founder enquiry" },
  { who: "Investors", what: "Investor connections, deal sourcing and investment facilitation — including AccelRevenue.", href: "/contact#investors", cta: "Investor enquiry" },
  { who: "Students", what: "Courses and CFA preparation resources. Reach out from the courses section.", href: "/courses#enquire", cta: "Go to courses" },
];

export default function Home() {
  const data = getSequenceData();
  return (
    <>
      {/* The film — unchanged hero */}
      <HeroFilm data={data} chapters={heroChapters} />

      {/* 01 — Positioning */}
      <section aria-label="Positioning" className="relative bg-ink py-28 md:py-44">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-navy/30 blur-[120px]" />
        <Container className="relative">
          <Eyebrow index="01">The intersection</Eyebrow>
          <SplitReveal
            text={positioning}
            emphasis={["private-market", "research,", "fundraising", "education"]}
            className="mt-10 max-w-[24ch] font-display text-[clamp(2.1rem,4.8vw,4.8rem)] font-light leading-[1.08] tracking-[-0.01em] text-bone [perspective:900px]"
          />
        </Container>
      </section>

      {/* 02 — Private Market Sectors (lead offering) */}
      <section id="sectors" aria-labelledby="sectors-title" className="relative overflow-hidden border-t border-bone/[0.07] bg-deep py-28 md:py-40">
        <Container>
          <SectionHead
            index="02"
            eyebrow={newsletter.name}
            id="sectors-title"
            title={<>Private markets, <em className="italic text-sand">one sector at a time.</em></>}
            aside={
              <>
                <p className="leading-relaxed text-bone/70">{newsletter.pitch}</p>
                <p className="mt-3 text-sm text-amber/90">{newsletter.cadence}.</p>
              </>
            }
          />
          <div className="mt-16 grid items-center gap-12 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7 md:order-2">
              <LensRing items={sectorLenses} />
            </div>
            <div className="md:col-span-5 md:order-1">
              <p className="eyebrow text-bone/45">Every note reads a sector through seven lenses</p>
              <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.95rem] text-bone/80">
                {sectorLenses.map((l, i) => (
                  <li key={l.title} className="flex items-baseline gap-3 border-b border-bone/[0.07] pb-3">
                    <span className="text-[0.65rem] tabular-nums text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                    {l.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div id="notes" className="mt-16 grid gap-8 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-7">
              <SectorNotes limit={4} />
            </div>
            <div className="flex flex-col justify-end gap-4 md:col-span-4 md:col-start-9">
              <TextLink href="/private-markets">Open the sector library</TextLink>
            </div>
          </div>
        </Container>
      </section>

      {/* 03 — Free Resources (YouTube) */}
      <section id="free" aria-labelledby="free-title" className="relative bg-ink py-28 md:py-40">
        <Container>
          <SectionHead
            index="03"
            eyebrow="Free Resources"
            id="free-title"
            title={<>Finance on YouTube, <em className="italic text-sand">free for everyone.</em></>}
            aside={<p className="leading-relaxed text-bone/70">{learn[0].body} New videos appear here as the channel restarts.</p>}
          />
          {videos.length ? (
            <Reveal stagger className="mt-16 grid gap-6 md:grid-cols-3">
              {videos.slice(0, 3).map((v) => (
                <div key={v.youtubeId}>
                  <LiteYouTube video={v} />
                  <p className="mt-4 font-display text-xl text-bone">{v.title}</p>
                </div>
              ))}
            </Reveal>
          ) : (
            <div className="mt-16 grid items-center gap-10 md:grid-cols-12 md:gap-6">
              <div className="[perspective:1400px] md:col-span-7">
                <Tilt max={6} className="rounded-[22px]">
                  <div className="relative aspect-video overflow-hidden rounded-[22px] border border-bone/10">
                    <Still name="studio" position="50% 45%" decorative />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
                    <span data-depth="70" className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-bone/90 text-ink shadow-[0_20px_50px_-10px_rgba(0,0,0,.8)]">
                        <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8" aria-hidden><path fill="currentColor" d="M8 5v14l11-7z" /></svg>
                      </span>
                    </span>
                    <span data-depth="40" className="absolute bottom-6 left-6 text-[0.68rem] uppercase tracking-[0.22em] text-bone/80">From the studio · YouTube</span>
                  </div>
                </Tilt>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <p className="eyebrow text-bone/45">Topics</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {freeTopics.map((t) => (
                    <li key={t} className="rounded-full border border-bone/15 px-4 py-2 text-sm text-bone/75">{t}</li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col items-start gap-4">
                  <ConfigLink k="youtube" variant="primary">Watch on YouTube</ConfigLink>
                  <TextLink href="/free-resources">All free resources</TextLink>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 04 — Courses (students) */}
      <section id="courses" aria-labelledby="courses-title" className="relative border-t border-bone/[0.07] bg-ink py-28 md:py-40">
        <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="[perspective:1400px] md:col-span-6">
            <Tilt max={4} className="rounded-[22px]">
              <ClipReveal className="aspect-[4/3] rounded-[22px]">
                <Photo name="stage" position="52% 55%" />
              </ClipReveal>
            </Tilt>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <Eyebrow index="04">Courses · For students</Eyebrow>
            <SectionTitle id="courses-title" className="mt-6">
              Learn finance <em className="italic text-sand">with Anuvamshi.</em>
            </SectionTitle>
            <Reveal>
              <p className="mt-6 leading-relaxed text-bone/70">{learn[1].body} Students can reach out about courses directly.</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href="/courses" className="btn-primary">Explore courses</Link>
                <ConfigLink k="whatsapp">Join the CFA community</ConfigLink>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 05 — Capital & Advisory (founders & investors) */}
      <section id="capital" aria-labelledby="capital-title" className="relative bg-deep py-28 md:py-40">
        <Container className="grid gap-14 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <div className="md:sticky md:top-28">
              <Eyebrow index="05">Capital &amp; Advisory</Eyebrow>
              <SectionTitle id="capital-title" className="mt-6">
                For founders <em className="italic text-sand">and investors.</em>
              </SectionTitle>
              <div className="mt-10 max-w-sm [perspective:1200px] max-md:hidden">
                <Tilt max={6} className="rounded-[22px]">
                  <div className="aspect-[4/5] overflow-hidden rounded-[22px] border border-bone/10">
                    <Photo name="portrait-desk" position="55% 25%" />
                  </div>
                </Tilt>
              </div>
              <div className="mt-8">
                <TextLink href="/capital-advisory">Explore Capital &amp; Advisory</TextLink>
              </div>
            </div>
          </div>
          <div className="[perspective:1400px] md:col-span-7">
            <CardStack items={capital} />
          </div>
        </Container>
      </section>

      {/* 06 — AccelRevenue */}
      <AccelBand index="06" />

      {/* 07 — About */}
      <section id="about" aria-labelledby="about-title" className="relative bg-ink py-28 md:py-40">
        <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="[perspective:1400px] md:col-span-5">
            <Tilt max={5} className="rounded-[22px]">
              <ClipReveal className="aspect-[4/5] rounded-[22px]">
                <Photo name="portrait-warm" position="50% 30%" />
              </ClipReveal>
            </Tilt>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Eyebrow index="07">About</Eyebrow>
            <SectionTitle id="about-title" className="mt-6">
              {person.role.split(",")[0]}, <em className="italic text-sand">entrepreneur and founder.</em>
            </SectionTitle>
            <Reveal>
              <p className="mt-6 max-w-xl leading-relaxed text-bone/70">{positioning}</p>
              <div className="mt-10">
                <Link href="/about" className="btn-ghost">More about Anuvamshi</Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 08 — Who are you? Contact paths */}
      <section aria-labelledby="paths-title" className="relative border-t border-bone/[0.07] bg-ink py-28 md:py-40">
        <Container>
          <SectionHead index="08" eyebrow="Get in touch" id="paths-title" title={<>Who&rsquo;s <em className="italic text-sand">reaching out?</em></>} />
          <Reveal stagger className="mt-16 grid gap-6 [perspective:1400px] md:grid-cols-3">
            {paths.map((p, i) => (
              <Tilt key={p.who} className="rounded-[22px]">
                <Link href={p.href} className="group relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[22px] border border-bone/10 bg-[linear-gradient(160deg,#0e1a31_0%,#06080c_75%)] p-8 transition-colors hover:border-amber/40 md:p-10">
                  <span data-depth="30" className="text-xs tabular-nums tracking-[0.2em] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                  <span data-depth="50">
                    <span className="block font-display text-[clamp(2.2rem,3.4vw,3.2rem)] font-light leading-none text-bone">{p.who}</span>
                    <span className="mt-4 block leading-relaxed text-bone/65">{p.what}</span>
                    <span className="link-arrow mt-6">
                      {p.cta}
                      <span aria-hidden className="link-arrow__icon">→</span>
                    </span>
                  </span>
                </Link>
              </Tilt>
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
