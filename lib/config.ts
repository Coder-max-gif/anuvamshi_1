// Real values are supplied via env vars. Nothing here is invented.
export const links = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  newsletter: process.env.NEXT_PUBLIC_NEWSLETTER_URL || "",
};

export const envName: Record<keyof typeof links, string> = {
  email: "NEXT_PUBLIC_CONTACT_EMAIL",
  youtube: "NEXT_PUBLIC_YOUTUBE_URL",
  whatsapp: "NEXT_PUBLIC_WHATSAPP_URL",
  linkedin: "NEXT_PUBLIC_LINKEDIN_URL",
  newsletter: "NEXT_PUBLIC_NEWSLETTER_URL",
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Order follows the client brief: private-market sectors first, then free resources, then courses.
export const nav = [
  { label: "Home", href: "/" },
  { label: "Private Markets", href: "/private-markets" },
  { label: "Free Resources", href: "/free-resources" },
  { label: "Courses", href: "/courses" },
  { label: "Capital & Advisory", href: "/capital-advisory" },
  { label: "AccelRevenue", href: "/accelrevenue" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
