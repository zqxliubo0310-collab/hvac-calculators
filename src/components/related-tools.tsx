import Link from "next/link";
import { relatedTools } from "@/lib/tools";

export function RelatedTools({ slug }: { slug: string }) {
  const related = relatedTools(slug);
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-2xl">
        Related calculators
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.map((tool) => (
          <li key={tool.href}>
            <Link href={tool.href} className="block h-full rounded-xl border bg-card p-4 hover:border-pine">
              <span className="font-mono text-xs tracking-wide text-pine uppercase">{tool.unit}</span>
              <span className="mt-1 block font-medium">{tool.shortTitle}</span>
              <span className="mt-1 block text-sm leading-5 text-muted-foreground">{tool.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
