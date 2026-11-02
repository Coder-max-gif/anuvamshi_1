"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { nav } from "@/lib/config";
import { person } from "@/lib/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change.
  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, Escape to close, keep focus inside.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const els = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a,button"));
      els.unshift(buttonRef.current!);
      const i = els.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) (e.preventDefault(), els[els.length - 1].focus());
      else if (!e.shiftKey && i === els.length - 1) (e.preventDefault(), els[0].focus());
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const solid = scrolled || open;

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bone focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-bone/[0.07] bg-ink/80 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-6 md:h-[72px] md:px-12">
          <Link href="/" className="group flex items-baseline gap-2 font-display text-[1.35rem] leading-none tracking-[-0.01em] text-bone" aria-label={`${person.name} — home`}>
            <span>Anuvamshi</span>
            <em className="italic text-sand transition-colors duration-300 group-hover:text-amber">Shetty</em>
          </Link>

          <nav aria-label="Primary" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) =>
                item.href === "/contact" ? (
                  <li key={item.href} className="ml-3">
                    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="btn-primary !min-h-[38px] !px-4 !text-[0.8rem]">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} className="nav-link">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className="relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className="relative block h-3 w-6">
              <span className={`absolute left-0 h-px w-6 bg-bone transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-6 bg-bone transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink/[0.97] backdrop-blur-sm xl:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: 0.35, ease } }}
            transition={{ duration: 0.6, ease }}
          >
            <nav aria-label="Mobile" className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center overflow-y-auto px-6 pb-10 pt-24 md:px-12">
              <ul>
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.12 + i * 0.045, duration: 0.6, ease }}
                    className="border-b border-bone/[0.08]"
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className="group flex min-h-[56px] items-baseline gap-5 py-3 font-display text-[clamp(1.9rem,6vw,3rem)] font-light leading-tight text-bone/85 transition-colors hover:text-bone aria-[current=page]:text-amber"
                    >
                      <span className="w-7 font-sans text-[0.68rem] tabular-nums tracking-[0.2em] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                      <span className="transition-transform duration-500 group-hover:translate-x-2">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-10 max-w-sm text-sm leading-relaxed text-bone/45">{person.role}.</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
