import type { Metadata } from "next";
import { courses, learn } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, SectionHead } from "@/components/ui/Blocks";
import { ConfigLink, ConfigNotice } from "@/components/ui/Config";
import { Reveal } from "@/components/motion/Reveal";
import { Tilt } from "@/components/motion/Tilt";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "Courses",
  description: "Courses and CFA preparation resources for students. Students can reach out directly from this page.",
};

export default function Courses() {
  return (
    <>
      <PageHero photo="stage" position="52% 62%" eyebrow="Courses · For students" title="Learn finance" titleEm="with Anuvamshi." intro={`${learn[1].body} Students can reach out about courses directly from this page.`}>
        <a href="#enquire" className="btn-primary">Reach out as a student</a>
      </PageHero>

      <section aria-labelledby="cfa-title" className="bg-ink py-24 md:py-36">
        <Container>
          <SectionHead index="01" eyebrow="CFA preparation" id="cfa-title" title={<>Resources <em className="italic text-sand">and a community.</em></>} />
          <Reveal stagger className="mt-14 grid gap-6 [perspective:1400px] md:grid-cols-2">
            <Tilt className="rounded-[22px]">
              <article className="flex h-full flex-col rounded-[22px] border border-bone/10 bg-[linear-gradient(160deg,#0e1a31_0%,#06080c_75%)] p-8 md:p-10">
                <span data-depth="30" className="text-[0.68rem] uppercase tracking-[0.22em] text-amber">Learning material</span>
                <h3 data-depth="50" className="mt-6 font-display text-[clamp(1.8rem,2.8vw,2.6rem)] font-light leading-tight text-bone">CFA preparation resources</h3>
                <p data-depth="40" className="mt-4 leading-relaxed text-bone/65">Preparation resources and learning material, shared with students.</p>
              </article>
            </Tilt>
            <Tilt className="rounded-[22px]">
              <article className="flex h-full flex-col rounded-[22px] border border-bone/10 bg-[linear-gradient(160deg,#0e1a31_0%,#06080c_75%)] p-8 md:p-10">
                <span data-depth="30" className="text-[0.68rem] uppercase tracking-[0.22em] text-amber">Community</span>
                <h3 data-depth="50" className="mt-6 font-display text-[clamp(1.8rem,2.8vw,2.6rem)] font-light leading-tight text-bone">WhatsApp learning community</h3>
                <p data-depth="40" className="mt-4 leading-relaxed text-bone/65">Where the CFA resources are shared with students.</p>
                <div data-depth="40" className="mt-auto pt-8">
                  <ConfigLink k="whatsapp">Join the community</ConfigLink>
                </div>
              </article>
            </Tilt>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="courses-title" className="bg-deep py-24 md:py-36">
        <Container>
          <SectionHead index="02" eyebrow="Courses" id="courses-title" title={<>Current <em className="italic text-sand">courses.</em></>} />
          <div className="mt-14">
            {courses.length ? (
              <Reveal as="ul" stagger className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:grid-cols-2">
                {courses.map((c) => (
                  <li key={c.title} className="bg-deep p-8">
                    <h3 className="font-display text-3xl font-light text-bone">{c.href ? <a href={c.href} className="hover:text-amber">{c.title}</a> : c.title}</h3>
                    <p className="mt-3 leading-relaxed text-bone/65">{c.summary}</p>
                  </li>
                ))}
              </Reveal>
            ) : (
              <div className="max-w-2xl">
                <ConfigNotice title="Course details to be announced">
                  Course listings will appear here once they are published. In the meantime, students can reach out below.
                </ConfigNotice>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section id="enquire" aria-labelledby="enquire-title" className="scroll-mt-24 bg-ink py-24 md:py-36">
        <Container className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-7">
            <SectionHead index="03" eyebrow="Students" id="enquire-title" title={<>Questions about <em className="italic text-sand">a course?</em></>} />
            <p className="mt-6 max-w-xl leading-relaxed text-bone/70">Reach out about courses, CFA preparation or the learning community.</p>
          </div>
          <div className="flex items-end md:col-span-4 md:col-start-9">
            <ConfigLink k="email" subject="Course enquiry" variant="primary">Email a course enquiry</ConfigLink>
          </div>
        </Container>
      </section>

      <NextChapter current="/courses" />
    </>
  );
}
