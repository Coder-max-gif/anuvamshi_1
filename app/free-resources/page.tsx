import type { Metadata } from "next";
import Link from "next/link";
import { freeTopics, learn, videos } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, SectionHead } from "@/components/ui/Blocks";
import { ConfigLink, ConfigNotice } from "@/components/ui/Config";
import { LiteYouTube } from "@/components/ui/LiteYouTube";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { Photo } from "@/components/ui/Photo";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "Free Resources",
  description: "Free finance content on YouTube — financial markets and investment-related topics.",
};

export default function FreeResources() {
  return (
    <>
      <PageHero still="studio" position="50% 45%" eyebrow="Free Resources" title="Finance," titleEm="free for everyone." intro={`${learn[0].body} New videos appear here as the channel restarts.`}>
        <ConfigLink k="youtube" variant="primary">Watch on YouTube</ConfigLink>
      </PageHero>

      <section aria-labelledby="videos-title" className="bg-ink py-24 md:py-36">
        <Container>
          <SectionHead
            index="01"
            eyebrow="Videos"
            id="videos-title"
            title={<>Latest <em className="italic text-sand">from the channel.</em></>}
            aside={
              <ul className="flex flex-wrap gap-2">
                {freeTopics.map((t) => (
                  <li key={t} className="rounded-full border border-bone/15 px-4 py-2 text-sm text-bone/75">{t}</li>
                ))}
              </ul>
            }
          />
          <div className="mt-14">
            {videos.length ? (
              <Reveal stagger className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((v) => (
                  <article key={v.youtubeId}>
                    <LiteYouTube video={v} />
                    {v.topic && <p className="mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-amber">{v.topic}</p>}
                    <h3 className="mt-2 font-display text-2xl font-light text-bone">{v.title}</h3>
                  </article>
                ))}
              </Reveal>
            ) : (
              <div className="max-w-2xl">
                <ConfigNotice title="Videos coming soon">
                  The channel is restarting. Each new video is added here as a free, click-to-play embed as soon as it is published.
                </ConfigNotice>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section aria-labelledby="students-title" className="bg-deep py-24 md:py-36">
        <Container className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="[perspective:1400px] md:col-span-5">
            <Tilt max={5} className="rounded-[22px]">
              <div className="aspect-[4/3] overflow-hidden rounded-[22px] border border-bone/10">
                <Photo name="stage" position="52% 55%" />
              </div>
            </Tilt>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <SectionHead index="02" eyebrow="For students" id="students-title" title={<>Going deeper? <em className="italic text-sand">See the courses.</em></>} />
            <p className="mt-6 max-w-xl leading-relaxed text-bone/70">{learn[1].body}</p>
            <div className="mt-10">
              <Link href="/courses" className="btn-primary">Explore courses</Link>
            </div>
          </div>
        </Container>
      </section>

      <NextChapter current="/free-resources" />
    </>
  );
}
