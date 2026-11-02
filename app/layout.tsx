import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { person, positioning } from "@/lib/content";
import { siteUrl } from "@/lib/config";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${person.name} — ${person.role}`, template: `%s — ${person.name}` },
  description: positioning,
  openGraph: {
    type: "website",
    title: person.name,
    description: positioning,
    images: [{ url: "/og.jpg", width: 1200, height: 675, alt: person.name }],
  },
  twitter: { card: "summary_large_image", title: person.name, description: positioning, images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#06080c", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
