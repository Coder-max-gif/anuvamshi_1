// Single source of truth for the supplied business content. Do not add claims here.
// Everything below is either the supplied wording or a concise edit of it — no new facts.

export type Item = { title: string; body: string };

export const person = {
  name: "Anuvamshi Shetty",
  role: "Finance professional, entrepreneur and founder",
};

export const positioning =
  "Anuvamshi works at the intersection of investment banking, fundraising, private-market research, business advisory, investor networking and financial education.";

export const capital: Item[] = [
  { title: "Capital Raising", body: "Helps businesses and startups connect with potential investors and explore fundraising opportunities." },
  { title: "Investment Banking", body: "Provides capital-related guidance, deal sourcing and investment facilitation." },
  { title: "Strategic Advisory", body: "Helps founders refine business strategy, positioning and fundraising presentations." },
  { title: "Compliance Navigation", body: "Helps businesses understand fundraising-related compliance and documentation requirements." },
  { title: "Investor Connections", body: "Connects founders with investors, industry professionals and relevant business networks." },
];

export const markets: Item[] = [
  { title: "Private Markets Research", body: "Explores private markets and studies different industries, business models, investment trends and opportunities." },
  { title: "Equity Research & Financial Analysis", body: "Analyses companies, financial performance, industries and market developments." },
];

/** Research focus areas, taken word-for-word from the two `markets` descriptions above. */
export const researchAreas = [
  "Industries",
  "Business models",
  "Investment trends",
  "Opportunities",
  "Companies",
  "Financial performance",
  "Market developments",
];

export const learn: Item[] = [
  { title: "Financial Education", body: "Creates educational finance content through YouTube, covering financial markets and investment-related topics." },
  { title: "CFA Education", body: "Shares CFA preparation resources and learning material with students through a WhatsApp community." },
];

export const accel: Item = { title: "AccelRevenue", body: "Founded an initiative focused on connecting women entrepreneurs with investors." };

// ---------------------------------------------------------------------------------------------
// Private Market Sectors — the site's lead offering (client brief, Nov 2026):
// sector-by-sector analysis, published as a newsletter every three days to a week.
// ---------------------------------------------------------------------------------------------

export const newsletter = {
  name: "Private Market Sectors",
  cadence: "A new sector note every three days to a week",
  pitch: "Sector-by-sector analysis of private markets — one sector at a time, building into a library.",
};

/** The lenses every sector note is read through (from the supplied research description). */
export const sectorLenses: Item[] = [
  { title: "Industries", body: "The shape of the sector and its sub-segments." },
  { title: "Business models", body: "How companies in the sector make money." },
  { title: "Investment trends", body: "Where capital is flowing, and why." },
  { title: "Opportunities", body: "Openings worth a closer look." },
  { title: "Companies", body: "The businesses defining the space." },
  { title: "Financial performance", body: "What the numbers say." },
  { title: "Market developments", body: "Shifts and events to watch." },
];

/**
 * Published sector notes. Intentionally empty until real editions exist — nothing is invented.
 * Add one entry per edition; the home page and /private-markets render them automatically (newest first).
 */
export type SectorNote = { edition: number; sector: string; date: string; summary: string; href?: string };
export const sectorNotes: SectorNote[] = [];

// ---------------------------------------------------------------------------------------------
// Free resources — YouTube (the channel is restarting) and other free content.
// ---------------------------------------------------------------------------------------------

/** Free YouTube videos. Add { title, youtubeId } as videos go live; they render as click-to-play embeds. */
export type Video = { title: string; youtubeId: string; topic?: string };
export const videos: Video[] = [];

export const freeTopics = ["Financial markets", "Investment-related topics"];

// ---------------------------------------------------------------------------------------------
// Courses — for students. CFA preparation is the supplied offering; students reach out here.
// ---------------------------------------------------------------------------------------------

/** Courses. Empty until real course details are provided. */
export type Course = { title: string; summary: string; href?: string };
export const courses: Course[] = [];

/** Hero film overlays. `at` = [start, end] as fractions of the scroll-scrubbed film. */
export type Chapter = { id: string; at: [number, number]; eyebrow: string; title: string; titleEm?: string; body?: string };
export const heroChapters: Chapter[] = [
  { id: "intro", at: [0, 0.14], eyebrow: person.role, title: "Anuvamshi", titleEm: "Shetty" },
  {
    id: "sectors",
    at: [0.18, 0.34],
    eyebrow: "Private Market Sectors",
    title: "Private markets,",
    titleEm: "sector by sector.",
    body: "Sector analysis across private markets — industries, business models, investment trends and opportunities. A new note every three days to a week.",
  },
  {
    id: "free",
    at: [0.4, 0.56],
    eyebrow: "Free Resources",
    title: "Finance, explained",
    titleEm: "for free.",
    body: "Free YouTube content on financial markets and investment topics, and CFA preparation resources for students.",
  },
  {
    id: "capital",
    at: [0.62, 0.77],
    eyebrow: "For founders & investors",
    title: "Connecting founders",
    titleEm: "with investors.",
    body: "Capital raising, investment banking, strategic advisory, compliance navigation and investor connections.",
  },
  {
    id: "accel",
    at: [0.83, 1],
    eyebrow: "Founder of AccelRevenue",
    title: "Connecting women entrepreneurs",
    titleEm: "with investors.",
  },
];

/** Enquiry routes for the Contact page. These describe who should get in touch about what — mapped from the supplied services. */
export const enquiryRoutes = [
  {
    id: "founders",
    audience: "Founders & businesses",
    about: "Capital raising, strategic advisory, fundraising presentations and compliance navigation.",
    subject: "Founder enquiry",
  },
  {
    id: "investors",
    audience: "Investors",
    about: "Investor connections, deal sourcing and investment facilitation — including AccelRevenue.",
    subject: "Investor enquiry",
  },
  {
    id: "students",
    audience: "Students",
    about: "Courses, CFA preparation resources and the WhatsApp learning community.",
    subject: "Student enquiry",
  },
  {
    id: "general",
    audience: "General enquiries",
    about: "Anything else — the sector notes, free resources or the work in general.",
    subject: "General enquiry",
  },
];
