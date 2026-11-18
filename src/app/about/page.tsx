import Link from "next/link";
import { InfoLayout } from "@/components/info-layout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { infoPages } from "@/lib/tools";

const page = infoPages.find((item) => item.href === "/about")!;

export async function generateMetadata() {
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    siteUrl: await getSiteUrl(),
  });
}

export default function AboutPage() {
  return (
    <InfoLayout title="About these calculators" lede={page.description}>
      <p>
        {siteConfig.name} is a set of screening calculators for people replacing heating, cooling, or water heating
        equipment in a US house. The point is to show the arithmetic before a contractor visit, and to make a quote
        request that says what you think you need.
      </p>
      <p>
        Heat pump and mini-split sizes start from the common rule of thumb of about one ton of cooling per 400 to 750
        square feet, adjusted for climate, insulation, ceiling height, glass, and where the ducts sit. A kitchen gets
        an extra 4,000 BTU/h on the cooling side, which is a worksheet allowance, not a lab result. Nominal tons are
        12,000 BTU/h. The suggestion is the nearest common half-ton at or above the larger of the heating and cooling
        screens.
      </p>
      <p>
        Airflow uses three published relationships: CFM per ton, the sea-level sensible equation BTU/h = 1.08 × CFM ×
        ΔT, and ACH = (CFM × 60) / volume. Whole-dwelling outdoor air is shown two ways. ASHRAE 62.2, 2013 and later,
        uses 0.03 CFM per square foot plus 7.5 CFM per assumed person. Recent International Residential Code editions
        use 0.01 CFM per square foot with the same people term. Your city adopts one of them, sometimes with
        amendments. This site does not apply a blower-door infiltration credit.
      </p>
      <p>
        Duct diameter solves a power-law fit of the ASHRAE friction chart for smooth round metal: friction ≈ 0.109136 ×
        CFM^1.9 / diameter^5.02. Rectangular sizes use the Huebner equivalent-diameter approximation. Velocity ranges
        are comfort screens, not code limits. Flexible duct is a different product.
      </p>
      <p>
        Storage water heaters are sized by first hour rating using the AHRI peak-hour worksheet gallons. The low-flow
        column is labeled as this site’s allowance and is not substituted silently. Tankless sizing adds simultaneous
        fixture flow and a temperature rise. The default inlet is 50°F and the default delivery temperature is 120°F,
        the assumptions in the Department of Energy’s sizing guidance unless you know better.
      </p>
      <p>
        The replacement cost calculator does not publish a price study. Every dollar figure is a planning band in the
        form, and the result is the sum after multipliers you can see. Change the bands if you have a local number.
        The quote form stores a request for the site operator and, when configured, forwards it. It does not reserve
        equipment or a price.
      </p>
      <p>
        None of this is Manual J, Manual S, Manual D, a plumbing design, or a bid. Those belong to a licensed
        contractor who can see the house. Questions about the site itself go through the{" "}
        <Link href="/contact" className="text-pine underline">
          contact page
        </Link>
        . The brand name and the contact address both live in <code>src/config/site.ts</code>.
      </p>
    </InfoLayout>
  );
}
