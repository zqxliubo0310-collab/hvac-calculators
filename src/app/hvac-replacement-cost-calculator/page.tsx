import Link from "next/link";
import { CostCalculator } from "@/components/calculators/cost-calculator";
import { GuideSection } from "@/components/guide-section";
import { CostDefaultTable } from "@/components/reference-tables";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "hvac-replacement-cost-calculator";
const documentTitle = "HVAC Replacement Cost Calculator | AC, Furnace & Heat Pump";

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
      showLead={false}
      disclaimer="These are typical planning estimates from the bands in the form. They are not a national price survey, not a bid, and not a promise that a contractor will match the range."
    >
      <CostCalculator />
      <GuideSection paragraphs={guide.paragraphs}>
        <CostDefaultTable />
      </GuideSection>
      <section aria-labelledby="near-me-heading" className="mt-12 max-w-3xl space-y-4 text-[1.05rem] leading-7">
        <h2 id="near-me-heading" className="text-2xl">
          Cost of AC replacement, and “near me”
        </h2>
        <p>
          The cost of AC replacement and “AC replacement near me” are the same decision for most homeowners: what a new
          central air conditioner might cost at this house. Choose “Central air conditioner” and a tonnage. At the
          default band, 3 tons, standard efficiency, ducts reused, and labor left at 1.00, the line is $5,400 to $9,600
          before any permit or electrical allowance you turn on. A furnace, ducted heat pump, or mini-split uses the
          other bands on the same form. The math does not change with the ZIP.
        </p>
        <p>
          This page is not a directory and not a local price list. It does not name contractors, show who serves a city,
          or publish a different range for each ZIP. Labor is a multiplier you set, not an index of your market. The
          quote form asks for a ZIP so the operator can pass the request to heating and cooling contractors they work
          with. Sending it does not mean a contractor covers that ZIP, and it does not reserve a price. If you already
          have a bid, type those figures into the planning bands and compare the scope.
        </p>
        <p>
          Size the job before you price it. The{" "}
          <Link href="/heat-pump-size-calculator" className="text-pine underline">
            HVAC sizing calculator
          </Link>{" "}
          screens tons for a ducted system. The{" "}
          <Link href="/mini-split-size-calculator" className="text-pine underline">
            mini-split BTU calculator
          </Link>{" "}
          screens room nameplates when the equipment is ductless. The quote form is on this page.
        </p>
      </section>
    </ToolShell>
  );
}
