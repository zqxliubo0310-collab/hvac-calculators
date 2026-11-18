import { headers } from "next/headers";
import { originFrom } from "./site-url";

export async function requestSiteUrl(): Promise<string | null> {
  try {
    const headerList = await headers();
    const hostHeader = headerList.get("x-forwarded-host") ?? headerList.get("host");
    if (!hostHeader) return null;
    const host = hostHeader.split(",")[0]?.trim();
    if (!host) return null;
    const forwarded = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const proto =
      forwarded ||
      (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return originFrom(`${proto}://${host}`);
  } catch {
    return null;
  }
}
