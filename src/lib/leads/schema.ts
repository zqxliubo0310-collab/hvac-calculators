export const JOB_TYPES = [
  { id: "heat-pump", label: "Heat pump replacement" },
  { id: "central-ac", label: "Central air conditioner" },
  { id: "furnace", label: "Furnace" },
  { id: "mini-split", label: "Mini-split" },
  { id: "ductwork", label: "Ductwork" },
  { id: "water-heater", label: "Water heater" },
  { id: "not-sure", label: "Not sure yet" },
] as const;

export type JobTypeId = (typeof JOB_TYPES)[number]["id"];

export type LeadErrors = Partial<
  Record<"name" | "zip" | "contact" | "jobType" | "consent" | "form", string>
>;

export type CleanLead = {
  name: string;
  zip: string;
  phone: string;
  email: string;
  jobType: JobTypeId;
  consent: true;
  sourcePath: string;
  context: string;
};

const NAME_PATTERN = /^[\p{L}][\p{L}\s.'-]{1,79}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isJobType(value: string): value is JobTypeId {
  return JOB_TYPES.some((job) => job.id === value);
}

export function validateLead(body: unknown):
  | { ok: true; lead: CleanLead }
  | { ok: true; spam: true }
  | { ok: false; errors: LeadErrors } {
  if (body == null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, errors: { form: "The request could not be read." } };
  }

  const record = body as Record<string, unknown>;
  const honeypot = typeof record.company_url === "string" ? record.company_url.trim() : "";
  if (honeypot) return { ok: true, spam: true };

  const errors: LeadErrors = {};
  const name = typeof record.name === "string" ? record.name.trim() : "";
  const zip = typeof record.zip === "string" ? record.zip.trim() : "";
  const phone = typeof record.phone === "string" ? record.phone.trim() : "";
  const email = typeof record.email === "string" ? record.email.trim() : "";
  const jobType = typeof record.jobType === "string" ? record.jobType : "";
  const consent = record.consent === true;
  const sourcePath = typeof record.sourcePath === "string" ? record.sourcePath.trim() : "";
  const context = typeof record.context === "string" ? record.context.trim() : "";

  if (!NAME_PATTERN.test(name)) {
    errors.name = "Enter your name using letters, spaces, hyphens, or apostrophes.";
  }
  if (!/^\d{5}$/.test(zip) || zip === "00000") {
    errors.zip = "Enter a 5-digit US ZIP code.";
  }

  const phoneDigits = phone.replace(/\D/g, "");
  const phoneOk =
    phone.length === 0 ||
    phoneDigits.length === 10 ||
    (phoneDigits.length === 11 && phoneDigits.startsWith("1"));
  const emailOk = email.length === 0 || (email.length <= 120 && EMAIL_PATTERN.test(email));
  if (!phoneOk) errors.contact = "Enter a 10-digit US phone number.";
  if (!emailOk) errors.contact = "Enter a valid email address.";
  if (phone.length === 0 && email.length === 0) {
    errors.contact = "Enter a phone number or an email address.";
  }
  if (!isJobType(jobType)) errors.jobType = "Choose the kind of work you need.";
  if (!consent) {
    errors.consent = "Check the box if you agree to be contacted about this request.";
  }
  if (sourcePath && !/^\/[a-z0-9/-]{0,80}$/.test(sourcePath)) {
    errors.form = "The page address on this request was not valid.";
  }
  if (context.length > 400) {
    errors.form = "The project note is too long.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    lead: {
      name,
      zip,
      phone,
      email,
      jobType: jobType as JobTypeId,
      consent: true,
      sourcePath: sourcePath || "/",
      context,
    },
  };
}
