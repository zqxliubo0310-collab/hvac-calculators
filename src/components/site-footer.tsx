import Link from "next/link";
import { siteConfig } from "@/config/site";
import { infoPages, tools } from "@/lib/tools";

export function SiteFooter() {
  return (
    <footer className="no-print mt-16 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-heading text-lg text-pine">{siteConfig.name}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Screening math for US houses. Not a Manual J, Manual D, or a licensed contractor’s design.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Calculators</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {tools.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="hover:text-pine">
                  {tool.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Site</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {infoPages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hover:text-pine">
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-xs leading-5 text-muted-foreground">
        Estimates only. Confirm sizing, duct design, water heater selection, and price with a licensed contractor
        who can see the house.
      </p>
    </footer>
  );
}
