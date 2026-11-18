"use client";

import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { controlClass } from "@/components/fields";
import { JOB_TYPES, validateLead, type JobTypeId, type LeadErrors } from "@/lib/leads/schema";

export function LeadForm({
  defaultJobType = "not-sure",
  context = "",
  id = "quote",
}: {
  defaultJobType?: JobTypeId;
  context?: string;
  id?: string;
}) {
  const pathname = usePathname();
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [jobType, setJobType] = useState<JobTypeId>(defaultJobType);
  const [jobTouched, setJobTouched] = useState(false);
  const selectedJob = jobTouched ? jobType : defaultJobType;
  const [consent, setConsent] = useState(false);
  const [companyUrl, setCompanyUrl] = useState("");
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = {
      name,
      zip,
      phone,
      email,
      jobType: selectedJob,
      consent,
      company_url: companyUrl,
      sourcePath: pathname,
      context,
    };
    const checked = validateLead(payload);
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus("idle");
      return;
    }
    if ("spam" in checked) {
      setStatus("done");
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json()) as { ok?: boolean; errors?: LeadErrors };
      if (!response.ok || !body.ok) {
        setErrors(body.errors ?? { form: "The request could not be saved. Try again in a few minutes." });
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setErrors({ form: "The request could not be saved. Check your connection and try again." });
      setStatus("idle");
    }
  }

  if (status === "done") {
    return (
      <div id={id} className="rounded-2xl border bg-card p-5" role="status">
        <h2 className="text-2xl">Request received</h2>
        <p className="mt-2 leading-7">
          Your quote request is recorded. A heating, cooling, or plumbing contractor working with {siteConfig.name}{" "}
          may call, text, or email the contact you gave. The calculators stay available either way.
        </p>
      </div>
    );
  }

  return (
    <form id={id} data-lead-form className="no-print grid gap-4 rounded-2xl border bg-card p-5" onSubmit={onSubmit} noValidate>
      <div>
        <h2 className="text-2xl">Request local quotes</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Name, ZIP, and a phone or email. This does not reserve a price.
        </p>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-name`}>Name</Label>
        <Input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className={controlClass}
          aria-invalid={errors.name ? true : undefined}
          required
        />
        {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-zip`}>ZIP code</Label>
        <Input
          id={`${id}-zip`}
          name="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          value={zip}
          onChange={(event) => setZip(event.target.value)}
          className={controlClass}
          aria-invalid={errors.zip ? true : undefined}
          required
        />
        {errors.zip ? <p className="text-sm text-destructive">{errors.zip}</p> : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-phone`}>Phone</Label>
          <Input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className={controlClass}
            aria-invalid={errors.contact ? true : undefined}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={`${id}-email`}>Email</Label>
          <Input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={controlClass}
            aria-invalid={errors.contact ? true : undefined}
          />
        </div>
      </div>
      {errors.contact ? <p className="text-sm text-destructive">{errors.contact}</p> : (
        <p className="text-sm text-muted-foreground">Enter a phone number, an email, or both.</p>
      )}
      <div className="grid gap-1.5">
        <Label htmlFor={`${id}-job`}>Job type</Label>
        <select
          id={`${id}-job`}
          name="jobType"
          value={selectedJob}
          onChange={(event) => {
            setJobTouched(true);
            setJobType(event.target.value as JobTypeId);
          }}
          className={controlClass}
          aria-invalid={errors.jobType ? true : undefined}
        >
          {JOB_TYPES.map((job) => (
            <option key={job.id} value={job.id}>
              {job.label}
            </option>
          ))}
        </select>
        {errors.jobType ? <p className="text-sm text-destructive">{errors.jobType}</p> : null}
      </div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={`${id}-consent`}
          checked={consent}
          onCheckedChange={setConsent}
          aria-invalid={errors.consent ? true : undefined}
          className="mt-1"
        />
        <Label htmlFor={`${id}-consent`} className="items-start text-sm leading-6 font-normal">
          I agree that {siteConfig.name} and heating, cooling, and plumbing contractors it works with may contact me
          by phone, text, or email about this quote request, including with automated technology. Consent is not a
          condition of any purchase. Message and data rates may apply.
        </Label>
      </div>
      {errors.consent ? <p className="text-sm text-destructive">{errors.consent}</p> : null}
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label>
          Company website
          <input
            tabIndex={-1}
            autoComplete="off"
            value={companyUrl}
            onChange={(event) => setCompanyUrl(event.target.value)}
          />
        </label>
      </div>
      {errors.form ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.form}
        </p>
      ) : null}
      <Button type="submit" className="h-11" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Request quotes"}
      </Button>
    </form>
  );
}
