import type { ReactNode } from "react";

export function GuideSection({
  paragraphs,
  children,
}: {
  paragraphs: readonly string[];
  children?: ReactNode;
}) {
  return (
    <section className="mt-12 max-w-3xl" aria-labelledby="guide-heading">
      <h2 id="guide-heading" className="text-2xl">
        How this estimate works
      </h2>
      <div className="mt-4 space-y-4 text-[1.05rem] leading-7">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      {children ? <div className="mt-6 grid gap-4">{children}</div> : null}
    </section>
  );
}
