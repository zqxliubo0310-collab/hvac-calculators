import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { jsonLdScript } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/site-url";
import { tools } from "@/lib/tools";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const siteUrl = await getSiteUrl();
  return pageMetadata({
    title: { absolute: `${siteConfig.name}: heat pump, duct, and water heater calculators` },
    description: siteConfig.description,
    path: "/",
    siteUrl,
  });
}

export default async function HomePage() {
  const siteUrl = await getSiteUrl();
  const home = absoluteUrl(siteUrl, "/");
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        url: home,
        description: siteConfig.description,
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        name: siteConfig.name,
        url: home,
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(structured) }} />
      <section className="max-w-3xl">
        <p className="font-mono text-xs tracking-[0.16em] text-pine uppercase">US homeowner screens</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Size the equipment before you ask for the quote.</h1>
        <p className="mt-5 text-lg leading-8">
          {siteConfig.tagline} Each calculator shows the formula with your numbers. The results are estimates for a
          conversation with a contractor, not a Manual J, a duct design, or a price guarantee.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/hvac-replacement-cost-calculator#quote" className={cn(buttonVariants(), "h-11 px-4")}>
            Request local quotes
          </Link>
          <Link href="/heat-pump-size-calculator" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-4")}>
            Start with heat pump size
          </Link>
        </div>
      </section>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <li key={tool.href}>
            <Link
              href={tool.href}
              className="flex h-full flex-col rounded-2xl border bg-card p-5 hover:border-pine"
            >
              <span className="font-mono text-xs tracking-wide text-pine uppercase">{tool.unit}</span>
              <span className="mt-2 font-heading text-2xl">{tool.shortTitle}</span>
              <span className="mt-2 leading-6 text-muted-foreground">{tool.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section className="mt-14 max-w-3xl space-y-4 leading-7">
        <h2 className="text-2xl">What you can trust these numbers to do</h2>
        <p>
          The heat pump and mini-split tools start from the familiar square-feet-per-ton screen, then apply insulation,
          ceiling height, glass, and ducts. Air changes and CFM use the standard volume and sensible-heat equations,
          including ASHRAE 62.2’s whole-dwelling ventilation rate. Duct diameter is a fit of the round-metal friction
          chart. Water heater storage size follows the AHRI peak-hour worksheet. The cost page adds only the planning
          bands you can see and edit.
        </p>
        <p>
          Bring a result to a licensed contractor. They still have to count the real walls, the blower, the electrical
          service, and the price of the job in your ZIP. The quote form is on the{" "}
          <Link href="/hvac-replacement-cost-calculator" className="text-pine underline">
            replacement cost calculator
          </Link>{" "}
          and at the bottom of every other tool.
        </p>
      </section>
    </div>
  );
}
