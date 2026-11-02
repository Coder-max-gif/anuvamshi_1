import type { Metadata } from "next";
import Link from "next/link";
import { enquiryRoutes } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Eyebrow } from "@/components/ui/Blocks";
import { ConfigLink, ConfigNotice, isConfigured } from "@/components/ui/Config";
import { Reveal } from "@/components/motion/Reveal";
import { NextChapter } from "@/components/ui/NextChapter";

export const metadata: Metadata = {
  title: "Contact",
  description: "Enquiries from founders, investors, students and everyone else.",
};

export default function Contact() {
  const emailReady = isConfigured("email");
  return (
    <>
      <PageHero photo="portrait-desk" position="55% 25%" eyebrow="Contact" title="Start a" titleEm="conversation." intro="Founders and investors can reach out directly. Students — the courses section is the place to start." />

      <section className="bg-ink py-24 md:py-36">
        <Container>
          {!emailReady && (
            <div className="mb-14 max-w-2xl">
              <ConfigNotice title="Email enquiries opening soon">
                The enquiry address is being set up. Each route below becomes a direct email link as soon as it is live.
                {process.env.NODE_ENV !== "production" && (
                  <span className="mt-2 block text-bone/45">
                    Dev note: set <code className="text-bone/80">NEXT_PUBLIC_CONTACT_EMAIL</code> in .env.local.
                  </span>
                )}
              </ConfigNotice>
            </div>
          )}
          <Reveal as="ul" stagger className="grid gap-px overflow-hidden rounded-sm border border-bone/10 bg-bone/10 md:grid-cols-2">
            {enquiryRoutes.map((r, i) => (
              <li key={r.id} id={r.id} className="flex scroll-mt-28 flex-col bg-ink p-8 md:p-12">
                <Eyebrow index={String(i + 1).padStart(2, "0")}>{r.subject}</Eyebrow>
                <h2 className="mt-6 font-display text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-tight text-bone">{r.audience}</h2>
                <p className="mt-4 max-w-[44ch] leading-relaxed text-bone/65">{r.about}</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-10">
                  <ConfigLink k="email" subject={r.subject} variant={i < 2 ? "primary" : "ghost"}>
                    Email about this
                  </ConfigLink>
                  {r.id === "students" && (
                    <Link href="/courses" className="btn-ghost">Go to courses</Link>
                  )}
                </div>
              </li>
            ))}
          </Reveal>

          <div className="mt-20 grid gap-8 border-t border-bone/10 pt-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <Eyebrow>Elsewhere</Eyebrow>
            </div>
            <div className="flex flex-wrap gap-3 md:col-span-8">
              <ConfigLink k="youtube">YouTube</ConfigLink>
              <ConfigLink k="whatsapp">WhatsApp community</ConfigLink>
              <ConfigLink k="linkedin">LinkedIn</ConfigLink>
            </div>
          </div>
        </Container>
      </section>

      <NextChapter current="/contact" />
    </>
  );
}
