import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { infoPages, tools } from "@/lib/tools";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();
  const entries: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    ...tools.map((tool) => ({
      path: tool.href,
      priority: tool.slug === "hvac-replacement-cost-calculator" ? 0.9 : 0.8,
    })),
    ...infoPages.map((page) => ({
      path: page.href,
      priority: page.href === "/privacy" || page.href === "/terms" ? 0.2 : 0.4,
    })),
  ];

  return entries.map((entry) => ({
    url: absoluteUrl(siteUrl, entry.path),
    changeFrequency: entry.path === "/" ? "weekly" : "monthly",
    priority: entry.priority,
  }));
}
