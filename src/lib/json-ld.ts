import { siteConfig } from "@/config/site";

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type Faq = { question: string; answer: string };

export function graphJsonLd(siteUrl: string, path: string, name: string, description: string, faqs: Faq[]) {
  const url = new URL(path, siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
  const home = new URL("/", siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        name,
        description,
        url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        inLanguage: "en-US",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: home,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: home },
          { "@type": "ListItem", position: 2, name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
