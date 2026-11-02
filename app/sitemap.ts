import type { MetadataRoute } from "next";
import { nav, siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return nav.map((n) => ({ url: new URL(n.href, siteUrl).toString(), changeFrequency: "monthly", priority: n.href === "/" ? 1 : 0.7 }));
}
