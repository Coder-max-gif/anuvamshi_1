# Anuvamshi Shetty — Video-First Website (Master Rules)

Every agent and every session follows this file. The prompt pack (`00_READ_FIRST.txt`, `01_MASTER_PROMPT.md`, `02`–`07`) is the brief; this file is the operational summary. If they conflict, the brief wins.

## Purpose
A premium, cinematic, editorial personal-brand site for **Anuvamshi Shetty** — finance professional, entrepreneur and founder. The supplied film is the visual foundation; content is organised around it.

## The video (primary asset — never replace)
- Source: `public/source/founder-film.mp4` (identical copy of `Woman_cinematic_hero_reveal_film_c6a4a900_1080p.mp4`). **Never modify.**
- 1920×1080, H.264, 24 fps, 9.96 s, 239 frames. **1080p — never describe as 4K.**
- Three acts: **Studio** (0–2.2 s: dark podcast studio, desk, mic, beige sweater) → **Turn** (2.2–4 s: profile, cross-dissolve) → **Dusk close-up** (4–10 s: navy→ember gradient, looking up, then to camera, smile).
- Pipeline: `npm run frames` (`scripts/extract-frames.mjs`) → `public/sequence/{desktop,mobile,portrait}/f####.webp` + `manifest.json`, stills in `public/stills/`, `public/og.jpg`, contact sheets in `docs/`.
- Sets: `desktop` native 1920×1080 every frame · `mobile` 1280×720 every 2nd · `portrait` 720×1080 centre crop every frame. Mild unsharp only; never upscaled.
- **Motion curve** (`manifest.curve`): scroll distance is allotted by measured frame-to-frame motion, so the near-static close-up (5–10 s) doesn't feel stuck. Re-run `npm run frames` after any source change.
- `public/reel/r01–r14.webp`: 14 evenly spaced frames for the 3D reel and service cards.

## Client brief update (Nov 2026) — overrides the original 8-tab list
- The site leans towards **private markets / sector analysis**. Lead tab: **Private Markets** = "Private Market Sectors": one sector at a time, a newsletter edition **every three days to a week**. Editions live in `sectorNotes` (empty until real ones exist — never invent a sector or analysis). Subscribe link: `NEXT_PUBLIC_NEWSLETTER_URL`.
- **Free Resources** (`/free-resources`): free YouTube content; the channel is restarting. Videos go in `videos` (click-to-play embeds).
- **Courses** (`/courses`): for students — CFA preparation + WhatsApp community; students reach out here. Course listings in `courses` (empty until supplied).
- **Contact**: founders and investors first; students routed to Courses.
- Nav: Home · Private Markets · Free Resources · Courses · Capital & Advisory · AccelRevenue · About · Contact. `/insights` and `/watch-and-learn` redirect.
- Client photos (root `*.jpeg` → `public/photos/`): `stage` (TEDx), `portrait-warm`, `portrait-desk`. Used after the hero; the hero film stays as is.
- The generator badge in the source film is removed in the pipeline (`delogo`, see `CLEAN` in scripts/extract-frames.mjs); the source file itself is never modified.

## Visual direction (derived from the footage — do not reinvent)
- Palette (`tailwind.config.ts`): `ink #06080c` studio black · `deep #0a1222` · `navy #14264a` dusk · `ember #d9703c` horizon · `amber #f0a45d` lamp · `sand #d8c4a8` sweater · `bone #efe7da` text.
- Type: **Cormorant Garamond** (display, light weights, italic for emphasis) + **Manrope** (body/UI). Labels: Manrope uppercase, wide tracking, small.
- Dark, restrained, editorial. Generous whitespace. Thin hairline rules (`border-bone/10`). No glassmorphism stacks, no gradients unrelated to the dusk backdrop, no emoji, no stock imagery.
- Never place text over the subject's face. Text goes in the left third (desktop) or bottom scrim (mobile).

## Business content (only source: `lib/content.ts`)
Use ONLY the supplied content. Do not invent testimonials, clients, deals, numbers, credentials, qualifications, employers, awards, regulatory status, investor names, reports, market data or links. Copy may be edited for concision without changing meaning.
- Contact details/links come only from env vars (`.env.example`, read via `lib/config.ts`). When unset, show the `ConfigNotice` "awaiting configuration" state — never a fake link or fake working form.

## Stack
Next.js 14 App Router · TypeScript (strict) · Tailwind 3 · GSAP 3 + ScrollTrigger + `@gsap/react` · Framer Motion 11 · HTML Canvas · three + @react-three/fiber 8 (optional enhancement only).

## Architecture
```
app/                     routes: / private-markets free-resources courses capital-advisory accelrevenue about contact
components/layout/       Header (desktop + mobile menu), Footer, PageShell
components/scrolly/      FrameEngine (vanilla TS loader/renderer), ScrollyCanvas (React canvas), HeroFilm (sticky section + overlays)
components/webgl/        FilmFinish (hero grading shader), DuskField (AccelRevenue dusk-light shader) — lazy, optional
components/sections/     CardStack (sticky 3D service deck), FilmReel (CSS-3D ring of real film frames), AccelBand
components/motion/       Reveal, SplitReveal (3D word hinge), Title3D (SplitText 3D headings), Tilt (pointer 3D), ClipReveal, Parallax
components/ui/           Eyebrow, ServiceList, ConfigLink/ConfigNotice, Still, CTA
lib/                     content.ts (copy), config.ts (nav + env links), sequence.ts (manifest types/selection)
```

## Animation standards — one owner per job
- **GSAP ScrollTrigger owns everything scroll-linked** (hero frame scrub, overlay chapters, reveals, parallax). Use `useGSAP` with a `scope`; never raw `useEffect` without `ctx.revert()`.
- **Framer Motion owns component state transitions** only (mobile menu, hover/tap, presence). Never use Framer `useScroll` — that would be a second scroll system.
- Native scrolling always. No scroll-jacking, no smooth-scroll libraries, no GSAP `pin` (use CSS `position: sticky`).
- Parallax only on imagery, delta ≤ 12%. Never parallax body text.
- 3D language: hinge-up word reveals, depth-stacked cards, the hero film tilting back on exit, pointer tilt on imagery. 3D is applied to the site's own content and film frames only — never invented objects.
- Reveals: 0.6–1.0 s, `power3.out`/`expo.out`, small y offsets (≤ 32px). Animate transform/opacity only.
- `prefers-reduced-motion`: no scrubbing; show stills, reveals become instant.

## Performance standards
- Canvas: DPR capped (2 desktop / 1.5 mobile); sliding window of decoded `ImageBitmap`s (≈±12 frames), compressed blobs cached, priority loading (frame 0 → coarse stride → fill). Never decode all frames at once.
- Set selection: portrait viewport → `portrait`; small/low-power/`saveData` → `mobile`; else `desktop`.
- WebGL loaded with `next/dynamic` `ssr:false`, skipped on reduced motion, no WebGL, or low-power devices. Canvas works without it.
- Fonts via `next/font` (no layout shift). Images via `next/image` or fixed-aspect containers. CLS < 0.1.

## Responsive
Mobile-first. Test 360×800, 390×844, 768×1024, 1280×800, 1920×1080. Touch targets ≥ 44px. No horizontal scroll.

## Coding conventions
Typed props, small components, no `any`. Server components by default; `"use client"` only where needed. Content lives in `lib/content.ts`, never hard-coded in components. Tailwind tokens, not raw hex, in components. Accessible: landmarks, skip link, focus-visible, `aria-current` on nav, alt text on stills.

## Prohibited
New concept/brand/visual identity · replacing or regenerating the video · unrelated 3D objects (spheres, coins, charts, particles) · fake dashboards/metrics/testimonials · excessive glass · scroll hijacking · TODO/lorem/placeholder copy · dead buttons.

## Verify before claiming done
`npm run typecheck && npm run lint && npm run build`, then browser-test routes, scrub forward/back, resize, mobile viewport, console errors.
