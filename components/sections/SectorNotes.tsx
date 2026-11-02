import { newsletter, sectorNotes } from "@/lib/content";
import { ConfigLink } from "@/components/ui/Config";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The sector-note library. Renders real editions from `sectorNotes` (newest first).
 * With no editions yet, it shows Edition 01 as "in preparation" — no sector name or analysis is invented.
 */
export function SectorNotes({ limit }: { limit?: number }) {
  const notes = [...sectorNotes].sort((a, b) => b.edition - a.edition).slice(0, limit);

  return (
    <div>
      {notes.length ? (
        <Reveal as="ol" stagger className="grid gap-px overflow-hidden rounded-2xl border border-bone/10 bg-bone/10 md:grid-cols-2">
          {notes.map((n) => (
            <li key={n.edition} className="bg-ink p-8">
              <p className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.22em] text-bone/45">
                <span>Edition {String(n.edition).padStart(2, "0")}</span>
                <span>{n.date}</span>
              </p>
              <h3 className="mt-5 font-display text-3xl font-light text-bone">
                {n.href ? (
                  <a href={n.href} className="transition-colors hover:text-amber" target="_blank" rel="noopener noreferrer">
                    {n.sector}
                  </a>
                ) : (
                  n.sector
                )}
              </h3>
              <p className="mt-3 leading-relaxed text-bone/65">{n.summary}</p>
            </li>
          ))}
        </Reveal>
      ) : (
        <Reveal className="relative overflow-hidden rounded-2xl border border-bone/10 bg-[linear-gradient(140deg,#0e1a31_0%,#06080c_80%)] p-8 md:p-10">
          <div className="flex items-center justify-between text-[0.68rem] uppercase tracking-[0.22em]">
            <span className="text-amber">Edition 01</span>
            <span className="flex items-center gap-2 text-bone/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber/60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
              </span>
              In preparation
            </span>
          </div>
          <p className="mt-8 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-tight text-bone">
            The first sector note <em className="italic text-sand">is being written.</em>
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-bone/60">
            {newsletter.cadence}. Subscribe to get each edition as it is published.
          </p>
          <div className="mt-8">
            <ConfigLink k="newsletter" variant="primary">Subscribe to the notes</ConfigLink>
          </div>
        </Reveal>
      )}
    </div>
  );
}
