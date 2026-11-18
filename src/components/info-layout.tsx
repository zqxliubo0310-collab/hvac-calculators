import type { ReactNode } from "react";
import Link from "next/link";

export function InfoLayout({ title, lede, children }: { title: string; lede: string; children: ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href="/" className="hover:text-pine">
          Home
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{title}</span>
      </nav>
      <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg leading-8">{lede}</p>
      <div className="mt-8 space-y-4 text-[1.05rem] leading-7">{children}</div>
    </article>
  );
}
