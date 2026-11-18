import { AchCalculator } from "@/components/calculators/ach-calculator";
import { GuideSection } from "@/components/guide-section";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "air-changes-per-hour-calculator";

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
      disclaimer="ACH from a fan is only as good as the CFM you entered. The ventilation rates are the published ASHRAE 62.2 and IRC-style formulas, before any local amendment or infiltration credit."
    >
      <AchCalculator />
      <GuideSection paragraphs={guide.paragraphs} />
    </ToolShell>
  );
}
