import { HeatPumpCalculator } from "@/components/calculators/heat-pump-calculator";
import { GuideSection } from "@/components/guide-section";
import { HeatPumpTables } from "@/components/reference-tables";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "heat-pump-size-calculator";
const documentTitle = "HVAC Sizing Calculator | Heat Pump & AC Tonnage";

export async function generateMetadata() {
  const tool = getTool(slug)!;
  return pageMetadata({
    title: { absolute: documentTitle },
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
      disclaimer="This is a screening estimate for a US house. It is not an ACCA Manual J load calculation or a substitute for a licensed contractor."
    >
      <HeatPumpCalculator />
      <GuideSection paragraphs={guide.paragraphs}>
        <HeatPumpTables />
      </GuideSection>
    </ToolShell>
  );
}
