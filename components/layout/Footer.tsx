import Link from "next/link";
import { links, nav } from "@/lib/config";
import { person, positioning } from "@/lib/content";

const social = [
  { key: "youtube", label: "YouTube" },
  { key: "whatsapp", label: "WhatsApp community" },
  { key: "linkedin", label: "LinkedIn" },
] as const;

export function Footer() {
  const configured = social.filter((s) => links[s.key]);
  return (
    <footer className="relative border-t border-bone/[0.07] bg-ink">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-6 py-20 md:grid-cols-12 md:px-12 md:py-24">
        <div className="md:col-span-6">
          <p className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-light leading-none text-bone">
            Anuvamshi <em className="italic text-sand">Shetty</em>
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-bone/55">{positioning}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow text-bone/40">Explore</p>
          <ul className="mt-5 space-y-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-[36px] items-center text-sm text-bone/70 transition-colors hover:text-amber">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-3">
          <p className="eyebrow text-bone/40">Elsewhere</p>
          {configured.length ? (
            <ul className="mt-5 space-y-1">
              {configured.map((s) => (
                <li key={s.key}>
                  <a href={links[s.key]} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[36px] items-center text-sm text-bone/70 hover:text-amber">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm leading-relaxed text-bone/40">YouTube, community and social links are coming soon.</p>
          )}
          <Link href="/contact" className="btn-ghost mt-8">Get in touch</Link>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-bone/[0.07] px-6 py-6 text-xs text-bone/35 md:flex-row md:justify-between md:px-12">
        <p>© {new Date().getFullYear()} {person.name}</p>
        <p>Private Market Sectors · Free Resources · Courses</p>
      </div>
    </footer>
  );
}
