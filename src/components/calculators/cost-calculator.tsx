"use client";

import { useMemo, useState } from "react";
import { LeadForm } from "@/components/lead-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  COST_DEFAULTS,
  SYSTEMS,
  estimateReplacementCost,
  type MoneyBand,
  type SystemId,
} from "@/lib/calc/replacement-cost";
import { formatMoney } from "@/lib/format";
import { Formula, NumberField, ResultCard, SelectField, Stat, inRange, parseNumber } from "@/components/fields";

type BandKey =
  | "centralAcPerTon"
  | "furnaceStandard"
  | "furnaceCondensing"
  | "heatPumpPerTon"
  | "miniSplitFirst"
  | "miniSplitAdded"
  | "permit"
  | "electrical";

const BAND_LABELS: Record<BandKey, string> = {
  centralAcPerTon: "Central air, per ton",
  furnaceStandard: "Standard furnace, installed",
  furnaceCondensing: "Condensing furnace, installed",
  heatPumpPerTon: "Ducted heat pump, per ton",
  miniSplitFirst: "Mini-split, first zone",
  miniSplitAdded: "Mini-split, each added zone",
  permit: "Permit",
  electrical: "Electrical upgrade",
};

function bandState(band: MoneyBand): { low: string; high: string } {
  return { low: String(band.low), high: String(band.high) };
}

export function CostCalculator() {
  const [system, setSystem] = useState<SystemId>("ducted-heat-pump");
  const [tons, setTons] = useState("3");
  const [zones, setZones] = useState("2");
  const [furnace, setFurnace] = useState<"standard" | "condensing">("condensing");
  const [efficiency, setEfficiency] = useState("1");
  const [ducts, setDucts] = useState("1");
  const [labor, setLabor] = useState("1");
  const [permitOn, setPermitOn] = useState(false);
  const [electricalOn, setElectricalOn] = useState(false);
  const [bands, setBands] = useState<Record<BandKey, { low: string; high: string }>>({
    centralAcPerTon: bandState(COST_DEFAULTS.centralAcPerTon),
    furnaceStandard: bandState(COST_DEFAULTS.furnaceStandard),
    furnaceCondensing: bandState(COST_DEFAULTS.furnaceCondensing),
    heatPumpPerTon: bandState(COST_DEFAULTS.heatPumpPerTon),
    miniSplitFirst: bandState(COST_DEFAULTS.miniSplitFirst),
    miniSplitAdded: bandState(COST_DEFAULTS.miniSplitAdded),
    permit: bandState(COST_DEFAULTS.permit),
    electrical: bandState(COST_DEFAULTS.electrical),
  });

  const parsedBands = useMemo(() => {
    const output = {} as Record<BandKey, MoneyBand | null>;
    for (const key of Object.keys(bands) as BandKey[]) {
      const low = parseNumber(bands[key].low);
      const high = parseNumber(bands[key].high);
      output[key] = inRange(low, 0, 100000) && inRange(high, 0, 100000) && low <= high ? { low, high } : null;
    }
    return output;
  }, [bands]);

  const tonsN = parseNumber(tons);
  const zonesN = parseNumber(zones);
  const efficiencyN = parseNumber(efficiency);
  const ductsN = parseNumber(ducts);
  const laborN = parseNumber(labor);
  const bandsOk = Object.values(parsedBands).every((band) => band != null);
  const numbersOk =
    inRange(tonsN, 1, 7.5) &&
    inRange(zonesN, 1, 8) &&
    inRange(efficiencyN, 1, 1.3) &&
    inRange(ductsN, 1, 1.3) &&
    inRange(laborN, 0.7, 1.6);

  const result =
    bandsOk && numbersOk
      ? estimateReplacementCost({
          system,
          tons: tonsN as number,
          zones: zonesN as number,
          furnace,
          centralAcPerTon: parsedBands.centralAcPerTon as MoneyBand,
          furnaceStandard: parsedBands.furnaceStandard as MoneyBand,
          furnaceCondensing: parsedBands.furnaceCondensing as MoneyBand,
          heatPumpPerTon: parsedBands.heatPumpPerTon as MoneyBand,
          miniSplitFirst: parsedBands.miniSplitFirst as MoneyBand,
          miniSplitAdded: parsedBands.miniSplitAdded as MoneyBand,
          efficiencyMultiplier: efficiencyN as number,
          ductMultiplier: system === "ductless" ? 1 : (ductsN as number),
          laborMultiplier: laborN as number,
          includePermit: permitOn,
          permit: parsedBands.permit as MoneyBand,
          includeElectrical: electricalOn,
          electrical: parsedBands.electrical as MoneyBand,
        })
      : null;

  const systemLabel = SYSTEMS.find((item) => item.id === system)?.label ?? "Replacement";
  const context = result
    ? `${systemLabel}. Planning range ${formatMoney(result.low)} to ${formatMoney(result.high)}. Assumptions were edited on the calculator.`
    : `${systemLabel}. Planning range not calculated.`;

  const jobType =
    system === "central-ac" ? "central-ac" : system === "gas-furnace" ? "furnace" : system === "ductless" ? "mini-split" : system === "ac-and-furnace" ? "not-sure" : "heat-pump";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="grid gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            id="cost-system"
            label="Equipment"
            value={system}
            onChange={(value) => setSystem(value as SystemId)}
            options={SYSTEMS.map((item) => ({ value: item.id, label: item.label }))}
          />
          {system === "ductless" ? (
            <NumberField id="cost-zones" label="Indoor units" value={zones} onChange={setZones} min={1} max={8} step={1} />
          ) : system === "gas-furnace" ? (
            <SelectField
              id="cost-furnace"
              label="Furnace type"
              value={furnace}
              onChange={(value) => setFurnace(value as "standard" | "condensing")}
              options={[
                { value: "standard", label: "Standard, about 80% AFUE" },
                { value: "condensing", label: "Condensing, about 95% AFUE or higher" },
              ]}
            />
          ) : (
            <NumberField id="cost-tons" label="Nominal size" suffix="tons" value={tons} onChange={setTons} min={1} max={7.5} step={0.5} />
          )}
          {system === "ac-and-furnace" ? (
            <SelectField
              id="cost-furnace-2"
              label="Furnace type"
              value={furnace}
              onChange={(value) => setFurnace(value as "standard" | "condensing")}
              options={[
                { value: "standard", label: "Standard, about 80% AFUE" },
                { value: "condensing", label: "Condensing, about 95% AFUE or higher" },
              ]}
            />
          ) : null}
          <SelectField
            id="cost-eff"
            label="Efficiency multiplier"
            hint="Applied to air conditioners, heat pumps, and mini-splits. Not applied again to the furnace band. These planning multipliers are not SEER2 ratings."
            value={efficiency}
            onChange={setEfficiency}
            options={[
              { value: "1", label: "1.00 standard" },
              { value: "1.15", label: "1.15 higher efficiency" },
              { value: "1.3", label: "1.30 premium or cold-climate" },
            ]}
          />
          {system === "ductless" ? null : (
            <SelectField
              id="cost-ducts"
              label="Duct multiplier"
              hint="1.00 reuses existing ducts. 1.30 replaces main trunks and is not a full new duct installation."
              value={ducts}
              onChange={setDucts}
              options={[
                { value: "1", label: "1.00 reuse the ducts" },
                { value: "1.1", label: "1.10 minor repairs" },
                { value: "1.3", label: "1.30 replace main trunks" },
              ]}
            />
          )}
          <NumberField
            id="cost-labor"
            label="Labor multiplier"
            hint="1.00 unless you already know your market runs higher or lower. This is not a regional index."
            value={labor}
            onChange={setLabor}
            min={0.7}
            max={1.6}
            step={0.05}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <Checkbox checked={permitOn} onCheckedChange={setPermitOn} className="mt-1" id="cost-permit" />
            <Label htmlFor="cost-permit" className="font-normal">
              Add the permit allowance
            </Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox checked={electricalOn} onCheckedChange={setElectricalOn} className="mt-1" id="cost-electrical" />
            <Label htmlFor="cost-electrical" className="font-normal">
              Add an electrical upgrade allowance
            </Label>
          </div>
        </div>
        <details className="rounded-xl border bg-card p-4">
          <summary className="cursor-pointer font-medium">Edit the planning bands</summary>
          <div className="mt-4 grid gap-4">
            {(Object.keys(BAND_LABELS) as BandKey[]).map((key) => (
              <div key={key} className="grid gap-3 sm:grid-cols-[1fr_8rem_8rem] sm:items-end">
                <p className="text-sm font-medium">{BAND_LABELS[key]}</p>
                <NumberField
                  id={`${key}-low`}
                  label="Low"
                  value={bands[key].low}
                  onChange={(value) => setBands((current) => ({ ...current, [key]: { ...current[key], low: value } }))}
                  min={0}
                  max={100000}
                />
                <NumberField
                  id={`${key}-high`}
                  label="High"
                  value={bands[key].high}
                  onChange={(value) => setBands((current) => ({ ...current, [key]: { ...current[key], high: value } }))}
                  min={0}
                  max={100000}
                />
              </div>
            ))}
          </div>
        </details>
        <ResultCard>
          {result ? (
            <>
              <Stat
                label="Planning range"
                value={`${formatMoney(result.low)} – ${formatMoney(result.high)}`}
                detail="Typical estimate built from the bands and multipliers above. Not a quote."
              />
              <ul className="grid gap-2 text-sm leading-6">
                {result.lines.map((line) => (
                  <li key={line.label}>
                    <span className="font-medium">
                      {line.label}: {formatMoney(line.low)} – {formatMoney(line.high)}
                    </span>
                    <span className="mt-1 block text-muted-foreground">{line.detail}</span>
                  </li>
                ))}
              </ul>
              <Formula
                title="How the total is built"
                text="Install lines are band × capacity (when the band is per ton or per added zone) × the multipliers that apply. Permit and electrical bands are added afterward, and only if checked."
              />
              <div className="grid gap-3 text-sm leading-6">
                <p>
                  The default duct multiplier of 1.00 is a replacement that reuses existing ducts. 1.10 is minor repairs. 1.30 replaces main trunks and is not a full new duct installation. A mini-split does not use the duct multiplier. Permit and electrical allowances are included only if checked. Line sets beyond a simple install, cranes, pads, condensate pumps, flue changes, asbestos, and drywall are not separate lines.
                </p>
                <p>
                  Efficiency choices of 1.00, 1.15, and 1.30 are planning multipliers, not SEER2 ratings. The ZIP on the quote form does not change this range and does not list local contractors.
                </p>
                <p>
                  Do not subtract the federal{" "}
                  <a
                    href="https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit"
                    className="text-pine underline"
                  >
                    energy efficient home improvement credit
                  </a>{" "}
                  (IRC §25C) from this range.{" "}
                  <a
                    href="https://www.irs.gov/newsroom/faqs-for-modification-of-sections-25c-25d-25e-30c-30d-45l-45w-and-179d-under-public-law-119-21-139-stat-72-july-4-2025-commonly-known-as-the-one-big-beautiful-bill-obbb"
                    className="text-pine underline"
                  >
                    IRS FS-2025-05
                  </a>{" "}
                  says that credit is not allowed for property placed in service after December 31, 2025, so do not deduct it from a 2026 installation cost. Earlier eligibility is not automatic. State and utility incentives are not estimated here and are not ruled out.
                </p>
              </div>
            </>
          ) : (
            <p>Check the tons, zones, labor multiplier, and bands. Each low value has to be less than or equal to its high value.</p>
          )}
        </ResultCard>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-sm leading-6 text-muted-foreground">
          The ZIP is for this quote request only. It does not change the planning range, and this page does not list local contractors.
        </p>
        <LeadForm defaultJobType={jobType} context={context} />
      </div>
    </div>
  );
}
