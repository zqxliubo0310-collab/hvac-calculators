import { InfoLayout } from "@/components/info-layout";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site-url";
import { infoPages } from "@/lib/tools";

const page = infoPages.find((item) => item.href === "/contact")!;

export async function generateMetadata() {
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: page.href,
    siteUrl: await getSiteUrl(),
  });
}

export default function ContactPage() {
  const subject = encodeURIComponent(`${siteConfig.name} inquiry`);
  return (
    <InfoLayout title="Contact" lede="Site questions go by email. Quote requests use the form, not this address.">
      <p>
        <a className="text-pine underline" href={`mailto:${siteConfig.contactEmail}?subject=${subject}`}>
          {siteConfig.contactEmail}
        </a>
      </p>
      <p>
        Use that address for corrections, privacy requests, and questions about how a calculator works. Do not send a
        quote request there. The quote form is on the replacement cost calculator and at the bottom of the other tools.
        It asks for a name, ZIP, phone or email, job type, and consent to be contacted.
      </p>
      <p>
        This site does not offer emergency heating or plumbing service. If a system has failed, call a local contractor
        or your utility’s emergency line.
      </p>
    </InfoLayout>
  );
}
