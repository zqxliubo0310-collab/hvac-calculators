import type { Faq } from "@/lib/json-ld";

export function FaqList({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="text-2xl">
        Questions homeowners ask
      </h2>
      <div className="mt-3 divide-y border-y">
        {faqs.map((faq) => (
          <details key={faq.question} className="group py-1">
            <summary className="cursor-pointer py-3 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              {faq.question}
            </summary>
            <p className="pb-4 leading-7 text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
