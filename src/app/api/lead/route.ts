import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/leads/rate-limit";
import { validateLead } from "@/lib/leads/schema";
import { storeLead } from "@/lib/leads/store";

export async function POST(request: Request) {
  const limit = rateLimit(clientIp(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, errors: { form: "Too many requests from this network. Wait a few minutes and try again." } },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } },
    );
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "The request could not be read." } }, { status: 400 });
  }
  if (text.length > 8000) {
    return NextResponse.json({ ok: false, errors: { form: "The request is too large." } }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json({ ok: false, errors: { form: "Send a JSON request." } }, { status: 400 });
  }

  const parsed = validateLead(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });
  }
  if ("spam" in parsed) {
    return NextResponse.json({ ok: true });
  }

  const ipHash = createHash("sha256").update(clientIp(request)).digest("hex").slice(0, 16);
  try {
    await storeLead({ ...parsed.lead, receivedAt: new Date().toISOString(), ipHash });
  } catch (error) {
    console.error("Lead store failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { ok: false, errors: { form: "The request could not be saved. Try again shortly." } },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
