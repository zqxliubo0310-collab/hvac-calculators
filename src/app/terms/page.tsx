import Link from "next/link";
import { InfoLayout } from "@/components/info-layout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { infoPages } from "@/lib/tools";

const page = infoPages.find((item) => item.href === "/terms")!;

export async function generateMetadata() {
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    siteUrl: await getSiteUrl(),
  });
}

export default function TermsPage() {
  return (
    <InfoLayout title="Terms" lede="The calculators are free screening tools. They are not a design, a bid, or a contract to do the work.">
      <p>
        {siteConfig.name} provides estimates for US houses. Heat pump, mini-split, airflow, duct, and water heater
        results are approximations from the formulas and factors shown on each page. They are not an ACCA Manual J load
        calculation, Manual S equipment selection, Manual D duct design, a plumbing design, or a code review. Do not
        buy equipment from these numbers alone.
      </p>
      <p>
        Cost ranges are planning estimates built from bands displayed in the form. They are not a survey of contractor
        prices, not an offer, and not a warranty that any contractor will match them. A price exists only when a
        contractor gives you one after looking at the job.
      </p>
      <p>
        The quote form is a request for contact. Checking the consent box means you agree that {siteConfig.name} and
        heating, cooling, and plumbing contractors it works with may contact you by phone, text, or email about that
        request, including with automated technology. Consent is not a condition of using the calculators or of buying
        anything. You can ask a contractor who contacts you to stop.
      </p>
      <p>
        The tools are provided as-is, without a warranty of accuracy, fitness for a particular house, or uninterrupted
        availability. To the extent the law allows, the operator is not liable for equipment you buy, for work a
        contractor performs, or for decisions you make from a screening result. Local code, utility rules, and
        manufacturer instructions control the installation.
      </p>
      <p>
        How requests are stored is described in the{" "}
        <Link href="/privacy" className="text-pine underline">
          privacy
        </Link>{" "}
        page. The contact address on the{" "}
        <Link href="/contact" className="text-pine underline">
          contact
        </Link>{" "}
        page is how you reach the operator.
      </p>
    </InfoLayout>
  );
}
