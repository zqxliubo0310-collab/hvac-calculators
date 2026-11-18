import { WaterHeaterCalculator } from "@/components/calculators/water-heater-calculator";
import { GuideSection } from "@/components/guide-section";
import { WaterUseTable } from "@/components/reference-tables";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "water-heater-size-calculator";

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
      disclaimer="Storage sizing uses the AHRI peak-hour worksheet. Low-flow gallons are this calculator’s allowances, marked separately from the AHRI column. Tankless flow is not a manufacturer chart."
    >
      <WaterHeaterCalculator />
      <GuideSection paragraphs={guide.paragraphs}>
        <WaterUseTable />
      </GuideSection>
    </ToolShell>
  );
}
