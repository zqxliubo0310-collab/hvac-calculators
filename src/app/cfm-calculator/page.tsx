import { CfmCalculator } from "@/components/calculators/cfm-calculator";
import { GuideSection } from "@/components/guide-section";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "cfm-calculator";

export async function generateMetadata() {
  const tool = getTool(slug)!;
  return pageMetadata({
    title: tool.title,
    description: tool.description,
    path: tool.href,
    siteUrl: await getSiteUrl(),
  });
}

export default async function Page() {
  const tool = getTool(slug)!;
  const guide = guides[slug];
  return (
    <ToolShell
      slug={tool.slug}
      href={tool.href}
      title={tool.title}
      description={tool.description}
      siteUrl={await getSiteUrl()}
      faqs={guide.faqs}
      jobType={tool.jobType}
      disclaimer="400 CFM per ton and the 1.08 sensible-heat factor are sea-level screening equations. They are not a measurement of your blower."
    >
      <CfmCalculator />
      <GuideSection paragraphs={guide.paragraphs} />
    </ToolShell>
  );
}
