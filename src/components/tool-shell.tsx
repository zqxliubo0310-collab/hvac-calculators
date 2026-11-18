import type { ReactNode } from "react";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { FaqList } from "@/components/faq-list";
import { JsonLd } from "@/components/json-ld";
import { LeadForm } from "@/components/lead-form";
import { RelatedTools } from "@/components/related-tools";
import type { Faq } from "@/lib/json-ld";
import { graphJsonLd } from "@/lib/json-ld";
import type { JobTypeId } from "@/lib/leads/schema";

export function ToolShell({
  slug,
  href,
  title,
  description,
  siteUrl,
  faqs,
  disclaimer,
  jobType,
  showLead = true,
  children,
}: {
  slug: string;
  href: string;
  title: string;
  description: string;
  siteUrl: string;
  faqs: readonly Faq[];
  disclaimer: string;
  jobType: JobTypeId;
  showLead?: boolean;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <JsonLd data={graphJsonLd(siteUrl, href, title, description, [...faqs])} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-pine">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{title}</li>
        </ol>
      </nav>
      <header className="mt-4 max-w-3xl">
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg leading-8">{description}</p>
        <p className="mt-4 rounded-xl border border-copper/30 bg-card px-4 py-3 text-sm leading-6">{disclaimer}</p>
      </header>
      <div className="mt-8">{children}</div>
      <AdSlot />
      {showLead ? (
        <div className="mt-12 max-w-xl">
          <LeadForm defaultJobType={jobType} context={`Sent from ${title}.`} />
        </div>
      ) : null}
      <FaqList faqs={faqs} />
      <RelatedTools slug={slug} />
    </article>
  );
}
