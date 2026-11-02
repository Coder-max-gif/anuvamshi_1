import Link from "next/link";
import { nav } from "@/lib/config";

/** End-of-page link to the next tab, so the inner pages read as one continuous story. */
export function NextChapter({ current }: { current: string }) {
  const i = nav.findIndex((n) => n.href === current);
  const next = nav[(i + 1) % nav.length];
  return (
    <Link href={next.href} className="group block border-t border-bone/10 bg-ink">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-6 py-16 md:px-12 md:py-24">
        <div>
          <p className="eyebrow text-bone/40">Next</p>
          <p className="mt-4 font-display text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-none text-bone transition-colors duration-500 group-hover:text-amber">
            {next.label === "Home" ? "Back to the film" : next.label}
          </p>
        </div>
        <span aria-hidden className="mb-2 text-3xl text-bone/50 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-amber">→</span>
      </div>
    </Link>
  );
}
