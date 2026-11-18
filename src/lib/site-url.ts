/**
 * Absolute site origin for canonical URLs, Open Graph, sitemap, and robots.
 *
 * 1. NEXT_PUBLIC_SITE_URL when it is set (stable canonicals, pages can prerender).
 * 2. Otherwise the host that served the request, so a *.vercel.app deploy works
 *    before a custom domain exists.
 * 3. Otherwise Vercel’s production or deployment host, then localhost.
 *
 * Request-host lookup lives in a separate module so a configured URL never
 * pulls `headers()` into the page.
 */
export function configuredSiteUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return null;
  try {
    return originFrom(raw);
  } catch {
    return null;
  }
}

export function deploymentFallbackUrl(): string {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production}`;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export function originFrom(raw: string): string {
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return new URL(withProtocol).origin;
}

export async function getSiteUrl(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) {
    try {
      return originFrom(configured.trim());
    } catch {
      return deploymentFallbackUrl();
    }
  }

  // Kept in the else branch so a configured NEXT_PUBLIC_SITE_URL can prerender
  // without pulling headers() into the page.
  const { requestSiteUrl } = await import("./site-url-request");
  const fromRequest = await requestSiteUrl();
  if (fromRequest) return fromRequest;
  return deploymentFallbackUrl();
}

export function absoluteUrl(siteUrl: string, path: string): string {
  const base = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}
