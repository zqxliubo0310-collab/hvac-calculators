import Link from "next/link";
import { InfoLayout } from "@/components/info-layout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { infoPages } from "@/lib/tools";

const page = infoPages.find((item) => item.href === "/privacy")!;

export async function generateMetadata() {
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    siteUrl: await getSiteUrl(),
  });
}

export default function PrivacyPage() {
  return (
    <InfoLayout title="Privacy" lede="What the quote form collects, where it goes, and what the calculators do not collect.">
      <p>
        The calculators run in your browser. Floor area, climate, duct inputs, and water-heater counts are not sent to
        the server unless you include a short project note by submitting the quote form. That note is the planning
        range or the page name, not a copy of every field.
      </p>
      <p>The quote form collects:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Name</li>
        <li>US ZIP code</li>
        <li>Phone number, email address, or both</li>
        <li>Job type</li>
        <li>Your consent to be contacted</li>
        <li>The page you submitted from, and an optional project note</li>
      </ul>
      <p>
        A hidden field is there to catch automated submissions. Leave it blank. The server checks the form, limits how
        often one network address can submit, and stores the request. Storage is a line in the server log and, when the
        disk allows it, a JSON lines file on the server. If the environment variable <code>LEAD_WEBHOOK_URL</code> is
        set, the same JSON is also sent to that address. The raw network address is not written into the lead. A short
        hash of it is, so the operator can spot repeats.
      </p>
      <p>
        Submitting the form is a request to be contacted by {siteConfig.name} and by heating, cooling, and plumbing
        contractors it works with, by phone, text, or email, including with automated technology. The calculators
        themselves do not require that consent. Do not submit the form if you do not want that contact. Message and
        data rates may apply to texts from a contractor.
      </p>
      <p>
        Hosting logs may also keep request metadata, which is normal for the platform the site runs on. There is no
        account and no separate marketing list. There is no self-serve delete button. To ask for a deletion or a copy
        of what was stored, email{" "}
        <a className="text-pine underline" href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
      <p>
        Advertising loads only if an AdSense client id is configured. Until then, no ad script is added. If ads are
        turned on later, the ad network’s own policy describes what it collects. This site is not directed at children.
      </p>
      <p>
        Quote requests are also described on the{" "}
        <Link href="/terms" className="text-pine underline">
          terms
        </Link>{" "}
        page.
      </p>
    </InfoLayout>
  );
}
