import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/site-url";

function titleText(title: Metadata["title"]): string {
  if (typeof title === "string") return title;
  if (title && typeof title === "object" && "absolute" in title && typeof title.absolute === "string") {
    return title.absolute;
  }
  return siteConfig.name;
}

export function pageMetadata(input: {
  title: Metadata["title"];
  description: string;
  path: string;
  siteUrl: string;
}): Metadata {
  const url = absoluteUrl(input.siteUrl, input.path);
  const plainTitle = titleText(input.title);
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: plainTitle,
      description: input.description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary",
      title: plainTitle,
      description: input.description,
    },
  };
}
