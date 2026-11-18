import Script from "next/script";

/**
 * Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT is set and a slot id is
 * available (prop or NEXT_PUBLIC_ADSENSE_SLOT). The loader script is added
 * from the root layout only when the client id is set.
 */
export function AdSlot({ slot, className }: { slot?: string; className?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const slotId = slot?.trim() || process.env.NEXT_PUBLIC_ADSENSE_SLOT?.trim();
  if (!client || !slotId) return null;

  return (
    <aside aria-label="Advertisement" className={className ?? "my-8"}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <Script id={`adsense-${slotId}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}
