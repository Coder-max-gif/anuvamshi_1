import Link from "next/link";
import type { Item } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";
import { Title3D } from "@/components/motion/Title3D";

export function Eyebrow({ children, index, className }: { children: React.ReactNode; index?: string; className?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 text-amber ${className ?? ""}`}>
      {index && <span className="tabular-nums text-bone/40">{index}</span>}
      {index && <span aria-hidden className="h-px w-8 bg-bone/20" />}
      {children}
    </p>
  );
}

export function SectionTitle({ children, as: Tag = "h2", className, id }: { children: React.ReactNode; as?: "h1" | "h2"; className?: string; id?: string }) {
  return (
    <Title3D as={Tag} id={id} className={`font-display text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.02] tracking-[-0.015em] text-bone ${className ?? ""}`}>
      {children}
    </Title3D>
  );
}

/**
 * Standard section header on the shared 12-column grid: eyebrow + 3D title in columns 1–7,
 * optional aside (intro / link) in columns 9–12, bottom-aligned. Keeps every section's left edge identical.
 */
export function SectionHead({ index, eyebrow, title, id, aside }: { index?: string; eyebrow: string; title: React.ReactNode; id?: string; aside?: React.ReactNode }) {
  return (
    <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
      <div className="md:col-span-7">
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
        <SectionTitle id={id} className="mt-6">{title}</SectionTitle>
      </div>
      {aside && <div className="md:col-span-4 md:col-start-9">{aside}</div>}
    </div>
  );
}

/** Numbered editorial list for the supplied service descriptions. */
export function ServiceList({ items, start = 1, large = false }: { items: Item[]; start?: number; large?: boolean }) {
  return (
    <Reveal as="ol" stagger className="border-t border-bone/10">
      {items.map((it, i) => (
        <li key={it.title} className="group grid grid-cols-[3rem_1fr] gap-x-4 border-b border-bone/10 py-7 md:grid-cols-[4rem_1fr_1.2fr] md:gap-x-8 md:py-9">
          <span className="pt-1 text-xs tabular-nums tracking-[0.2em] text-bone/35 transition-colors duration-300 group-hover:text-amber">
            {String(start + i).padStart(2, "0")}
          </span>
          <h3 className={`font-display font-light leading-tight text-bone ${large ? "text-[clamp(1.7rem,2.6vw,2.4rem)]" : "text-[clamp(1.5rem,2.2vw,2rem)]"}`}>
            {it.title}
          </h3>
          <p className="col-start-2 mt-3 max-w-[46ch] leading-relaxed text-bone/65 md:col-start-3 md:mt-1">{it.body}</p>
        </li>
      ))}
    </Reveal>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      {children}
      <span aria-hidden className="link-arrow__icon">→</span>
    </Link>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1440px] px-6 md:px-12 ${className ?? ""}`}>{children}</div>;
}
