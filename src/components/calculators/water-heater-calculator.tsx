"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AHRI_EXAMPLE_COUNTS,
  DOE_ASSUMED_INLET_F,
  DOE_ASSUMED_SETPOINT_F,
  TANKLESS_FIXTURES,
  WATER_USES,
  peakHourGallons,
  simultaneousGpm,
  temperatureRise,
  type TanklessFixtureId,
  type WaterUseId,
} from "@/lib/calc/water-heater";
import { formatFixed, formatInt } from "@/lib/format";
import { Formula, NumberField, ResultCard, Stat, inRange, parseNumber } from "@/components/fields";

function gallonMap(kind: "ahri" | "low"): Record<WaterUseId, number> {
  return Object.fromEntries(
    WATER_USES.map((use) => [use.id, kind === "ahri" ? use.ahriGallons : use.lowFlowGallons]),
  ) as Record<WaterUseId, number>;
}

function countMap(counts?: Record<WaterUseId, number>): Record<WaterUseId, string> {
  return Object.fromEntries(
    WATER_USES.map((use) => [use.id, String(counts?.[use.id] ?? 0)]),
  ) as Record<WaterUseId, string>;
}

export function WaterHeaterCalculator() {
  const [counts, setCounts] = useState<Record<WaterUseId, string>>(countMap());
  const [gallons, setGallons] = useState<Record<WaterUseId, string>>(
    Object.fromEntries(WATER_USES.map((use) => [use.id, String(use.ahriGallons)])) as Record<WaterUseId, string>,
  );
  const [enabled, setEnabled] = useState<Record<TanklessFixtureId, boolean>>(
    Object.fromEntries(TANKLESS_FIXTURES.map((fixture) => [fixture.id, fixture.defaultOn])) as Record<
      TanklessFixtureId,
      boolean
    >,
  );
  const [flows, setFlows] = useState<Record<TanklessFixtureId, string>>(
    Object.fromEntries(TANKLESS_FIXTURES.map((fixture) => [fixture.id, String(fixture.defaultGpm)])) as Record<
      TanklessFixtureId,
      string
    >,
  );
  const [inlet, setInlet] = useState(String(DOE_ASSUMED_INLET_F));
  const [setpoint, setSetpoint] = useState(String(DOE_ASSUMED_SETPOINT_F));

  const countNumbers = {} as Record<WaterUseId, number>;
  const gallonNumbers = {} as Record<WaterUseId, number>;
  let storageValid = true;
  for (const use of WATER_USES) {
    const count = parseNumber(counts[use.id]);
    const gallon = parseNumber(gallons[use.id]);
    if (!inRange(count, 0, 20) || !inRange(gallon, 0, 80)) storageValid = false;
    else {
      countNumbers[use.id] = count;
      gallonNumbers[use.id] = gallon;
    }
  }
  const peak = storageValid ? peakHourGallons(countNumbers, gallonNumbers) : null;

  const flowNumbers = {} as Record<TanklessFixtureId, number>;
  let flowValid = true;
  for (const fixture of TANKLESS_FIXTURES) {
    const flow = parseNumber(flows[fixture.id]);
    if (!inRange(flow, 0, 10)) flowValid = false;
    else flowNumbers[fixture.id] = flow;
  }
  const inletN = parseNumber(inlet);
  const setpointN = parseNumber(setpoint);
  const tempsValid = inRange(inletN, 32, 80) && inRange(setpointN, 100, 140) && setpointN > inletN;
  const gpm = flowValid ? simultaneousGpm(enabled, flowNumbers) : null;
  const rise = tempsValid ? temperatureRise(setpointN, inletN) : null;

  return (
    <div className="grid gap-10">
      <section aria-labelledby="storage-heading" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="storage-heading" className="text-2xl">
            Storage heater, peak hour
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10"
              onClick={() => {
                setCounts(countMap(AHRI_EXAMPLE_COUNTS));
                setGallons(
                  Object.fromEntries(WATER_USES.map((use) => [use.id, String(gallonMap("ahri")[use.id])])) as Record<
                    WaterUseId,
                    string
                  >,
                );
              }}
            >
              Load the 70-gallon example
            </Button>
            <Button type="button" variant="outline" className="h-10" onClick={() => setGallons(stringMap(gallonMap("ahri")))}>
              AHRI gallons
            </Button>
            <Button type="button" variant="outline" className="h-10" onClick={() => setGallons(stringMap(gallonMap("low")))}>
              Low-flow allowances
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th scope="col" className="py-2 pr-3 font-medium">Use during the busiest hour</th>
                <th scope="col" className="py-2 pr-3 font-medium">Times</th>
                <th scope="col" className="py-2 font-medium">Gallons each</th>
              </tr>
            </thead>
            <tbody>
              {WATER_USES.map((use) => (
                <tr key={use.id} className="border-b">
                  <th scope="row" className="py-2 pr-3 text-left font-normal">
                    {use.label}
                    <span className="mt-1 block text-xs text-muted-foreground">AHRI worksheet: {use.ahriGallons} gal</span>
                  </th>
                  <td className="py-2 pr-3 align-top">
                    <label className="sr-only" htmlFor={`count-${use.id}`}>
                      Times {use.label} is used
                    </label>
                    <input
                      id={`count-${use.id}`}
                      inputMode="numeric"
                      min={0}
                      max={20}
                      value={counts[use.id]}
                      onChange={(event) => setCounts((current) => ({ ...current, [use.id]: event.target.value }))}
                      className="h-11 w-20 rounded-lg border border-input bg-card px-2"
                    />
                  </td>
                  <td className="py-2 align-top">
                    <label className="sr-only" htmlFor={`gal-${use.id}`}>
                      Gallons per {use.label}
                    </label>
                    <input
                      id={`gal-${use.id}`}
                      inputMode="decimal"
                      min={0}
                      max={80}
                      value={gallons[use.id]}
                      onChange={(event) => setGallons((current) => ({ ...current, [use.id]: event.target.value }))}
                      className="h-11 w-24 rounded-lg border border-input bg-card px-2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ResultCard>
          {peak != null ? (
            <>
              <Stat
                label="Peak hour demand"
                value={`${formatInt(peak)} gallons`}
                detail={
                  peak === 0
                    ? "Enter the uses that happen in the same hour."
                    : `Look for a first hour rating within about 2 gallons of this peak, roughly ${formatInt(Math.max(0, peak - 2))} to ${formatInt(peak + 2)}.`
                }
              />
              <Formula
                title="Worksheet total"
                text={WATER_USES.filter((use) => countNumbers[use.id] > 0)
                  .map((use) => `${countNumbers[use.id]} × ${gallonNumbers[use.id]} ${use.label.toLowerCase()} = ${countNumbers[use.id] * gallonNumbers[use.id]}`)
                  .concat(`Total = ${formatInt(peak)} gallons`)
                  .join("\n")}
              />
            </>
          ) : (
            <p>Use counts from 0 to 20 and gallons from 0 to 80.</p>
          )}
        </ResultCard>
      </section>

      <section aria-labelledby="tankless-heading" className="grid gap-4">
        <h2 id="tankless-heading" className="text-2xl">
          Tankless heater, simultaneous flow
        </h2>
        <ul className="grid gap-3">
          {TANKLESS_FIXTURES.map((fixture) => (
            <li key={fixture.id} className="grid gap-3 rounded-xl border bg-card p-3 sm:grid-cols-[1fr_8rem] sm:items-center">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`fix-${fixture.id}`}
                  checked={enabled[fixture.id]}
                  onCheckedChange={(checked) => setEnabled((current) => ({ ...current, [fixture.id]: checked }))}
                  className="mt-1"
                />
                <Label htmlFor={`fix-${fixture.id}`} className="items-start font-normal">
                  <span>
                    {fixture.label}
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">{fixture.note}</span>
                  </span>
                </Label>
              </div>
              <NumberField
                id={`gpm-${fixture.id}`}
                label="Flow"
                suffix="gpm"
                value={flows[fixture.id]}
                onChange={(value) => setFlows((current) => ({ ...current, [fixture.id]: value }))}
                min={0}
                max={10}
                step={0.1}
              />
            </li>
          ))}
        </ul>
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="wh-inlet" label="Inlet water temperature" suffix="°F" hint="DOE says to assume 50°F unless you know the real inlet. Northern winter mains are often colder." value={inlet} onChange={setInlet} min={32} max={80} />
          <NumberField id="wh-set" label="Delivery temperature" suffix="°F" hint="120°F is the DOE figure for most household uses." value={setpoint} onChange={setSetpoint} min={100} max={140} />
        </div>
        <ResultCard>
          {gpm != null && rise != null ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Stat label="Simultaneous flow" value={`${formatFixed(gpm, 2)} gpm`} detail="Only the fixtures you checked." />
                <Stat label="Temperature rise" value={`${formatInt(rise)}°F`} detail={`${setpoint}°F delivery minus ${inlet}°F inlet.`} />
              </div>
              <Formula
                title="Formula with your numbers"
                text={[
                  `Flow = ${TANKLESS_FIXTURES.filter((fixture) => enabled[fixture.id]).map((fixture) => `${flowNumbers[fixture.id]} ${fixture.label.toLowerCase()}`).join(" + ") || "0"} = ${formatFixed(gpm, 2)} gpm`,
                  `Rise = ${setpoint} − ${inlet} = ${formatInt(rise)}°F`,
                ].join("\n")}
              />
              <p className="text-sm leading-6">
                DOE’s sizing guide says a 70°F rise is typically available at about 5 gpm on gas demand heaters and about 2 gpm on electric ones. That is an illustration, not your model. Read the manufacturer’s chart at a {formatInt(rise)}°F rise.
              </p>
            </>
          ) : (
            <p>Check the fixtures you will run together, keep each flow from 0 to 10 gpm, and keep delivery temperature above the inlet.</p>
          )}
        </ResultCard>
      </section>
    </div>
  );
}

function stringMap(values: Record<WaterUseId, number>): Record<WaterUseId, string> {
  return Object.fromEntries(WATER_USES.map((use) => [use.id, String(values[use.id])])) as Record<WaterUseId, string>;
}
