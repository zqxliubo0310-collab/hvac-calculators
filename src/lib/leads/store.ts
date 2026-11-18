import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { CleanLead } from "./schema";

export type StoredLead = CleanLead & {
  receivedAt: string;
  ipHash: string;
};

export async function storeLead(lead: StoredLead): Promise<void> {
  const line = `${JSON.stringify(lead)}\n`;
  console.log(`LEAD ${line.trim()}`);

  const directories = [path.join(process.cwd(), "data"), path.join("/tmp", "hvac-sizing-tools")];
  for (const directory of directories) {
    try {
      await mkdir(directory, { recursive: true });
      await appendFile(path.join(directory, "leads.jsonl"), line, "utf8");
      break;
    } catch (error) {
      console.error("Lead file write failed", directory, error instanceof Error ? error.message : "unknown error");
    }
  }

  const webhook = process.env.LEAD_WEBHOOK_URL?.trim();
  if (!webhook) return;

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) {
      console.error("Lead webhook returned", response.status);
    }
  } catch (error) {
    console.error("Lead webhook failed", error instanceof Error ? error.message : "unknown error");
  }
}
