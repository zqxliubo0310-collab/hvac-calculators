import Link from "next/link";
import { MiniSplitCalculator } from "@/components/calculators/mini-split-calculator";
import { GuideSection } from "@/components/guide-section";
import { HeatPumpTables } from "@/components/reference-tables";
import { ToolShell } from "@/components/tool-shell";
import { guides } from "@/content/guides";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { getTool } from "@/lib/tools";

const slug = "mini-split-size-calculator";

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
      disclaimer="Room screens use the same climate factors as the whole-house heat pump tool, plus a 4,000 BTU/h kitchen allowance on cooling. This is not a Manual J."
    >
      <MiniSplitCalculator />
      <GuideSection paragraphs={guide.paragraphs}>
        <HeatPumpTables />
      </GuideSection>
      <section aria-labelledby="btu-heading" className="mt-12 max-w-3xl space-y-4 text-[1.05rem] leading-7">
        <h2 id="btu-heading" className="text-2xl">
          How the mini-split BTU result is chosen
        </h2>
        <p>
          A ductless head is sold by BTU per hour. One ton is 12,000 BTU/h. This page estimates a cooling screen and a
          heating screen for each room, then selects the smallest common nameplate that covers the larger of the two:
          6,000, 9,000, 12,000, 15,000, 18,000, 24,000, 30,000, or 36,000. A screen of about 10,000 BTU/h becomes a
          12,000 BTU/h head. That step is a catalog size, not extra load you measured.
        </p>
        <p>
          The number is a screening estimate, not a Manual J and not a certified BTU. It does not count each wall or
          the direction of each window. Use it to see whether a bedroom is in the 6,000 or 9,000 range, and whether a
          large room needs two heads. For a planning range on the installed cost, the{" "}
          <Link href="/hvac-replacement-cost-calculator" className="text-pine underline">
            AC replacement cost calculator
          </Link>{" "}
          has a ductless band you can edit. That range is not a quote, and it does not list installers near you. A
          whole-house ducted comparison starts on the{" "}
          <Link href="/heat-pump-size-calculator" className="text-pine underline">
            heat pump size calculator
          </Link>
          .
        </p>
      </section>
    </ToolShell>
  );
}
