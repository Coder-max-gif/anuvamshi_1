import { envName, links } from "@/lib/config";

type Key = keyof typeof links;
const isDev = process.env.NODE_ENV !== "production";

function hrefFor(key: Key, subject?: string) {
  const v = links[key];
  if (!v) return "";
  if (key === "email") return `mailto:${v}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  return v;
}

export function isConfigured(key: Key) {
  return Boolean(links[key]);
}

/**
 * A real link when the env var is set; otherwise a clearly-marked, non-interactive
 * "Coming soon" state (the env var name is shown in development only). Never a fake URL.
 */
export function ConfigLink({ k, children, subject, variant = "ghost" }: { k: Key; children: React.ReactNode; subject?: string; variant?: "primary" | "ghost" }) {
  const href = hrefFor(k, subject);
  const cls = variant === "primary" ? "btn-primary" : "btn-ghost";
  if (href) {
    const external = k !== "email";
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dashed border-bone/20 px-5 text-sm text-bone/45" aria-disabled="true">
      {children}
      <span className="text-[0.62rem] uppercase tracking-[0.18em] text-amber/70">Coming soon</span>
      {isDev && <code className="text-[0.62rem] text-bone/35">{envName[k]}</code>}
    </span>
  );
}

export function ConfigNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div role="note" className="rounded-sm border border-dashed border-amber/30 bg-amber/[0.04] p-6">
      <p className="eyebrow text-amber">{title}</p>
      <div className="mt-3 text-sm leading-relaxed text-bone/65">{children}</div>
    </div>
  );
}
