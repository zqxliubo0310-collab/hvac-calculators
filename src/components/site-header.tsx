import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { tools } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
        <Link href="/" className="font-heading text-xl text-pine">
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-md px-1 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              Tools
            </summary>
            <div className="z-40 mt-2 grid gap-1 rounded-xl border bg-card p-2 shadow-sm sm:absolute sm:right-0 sm:w-72">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-lg px-2 py-1.5 hover:bg-accent"
                >
                  {tool.shortTitle}
                </Link>
              ))}
            </div>
          </details>
          <Link href="/about" className="hover:text-pine">
            About
          </Link>
          <Link href="/contact" className="hover:text-pine">
            Contact
          </Link>
          <Link
            href="/hvac-replacement-cost-calculator#quote"
            className={cn(buttonVariants(), "h-10 px-3")}
          >
            Get quotes
          </Link>
        </nav>
      </div>
    </header>
  );
}
