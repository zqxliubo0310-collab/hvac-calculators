"use client";

import { useState } from "react";
import { DUCT_ROLES, sizeDuct, type DuctRoleId } from "@/lib/calc/duct";
import { formatFixed, formatInt } from "@/lib/format";
import { Formula, NumberField, ResultCard, SelectField, Stat, inRange, parseNumber } from "@/components/fields";

export function DuctCalculator() {
  const [cfm, setCfm] = useState("400");
  const [friction, setFriction] = useState("0.08");
  const [role, setRole] = useState<DuctRoleId>("supply-branch");
  const cfmN = parseNumber(cfm);
  const frictionN = parseNumber(friction);
  const result =
    inRange(cfmN, 20, 4000) && inRange(frictionN, 0.02, 0.2) ? sizeDuct(cfmN, frictionN, role) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,26rem)]">
      <div className="grid gap-4">
        <NumberField id="duct-cfm" label="Airflow" suffix="CFM" value={cfm} onChange={setCfm} min={20} max={4000} />
        <NumberField
          id="duct-friction"
          label="Design friction rate"
          suffix="in. w.g."
          hint="Inches of water per 100 feet. 0.08 is a common residential starting assumption, not a measurement."
          value={friction}
          onChange={setFriction}
          min={0.02}
          max={0.2}
          step={0.01}
        />
        <SelectField
          id="duct-role"
          label="What this run is"
          hint="Used only to judge velocity. It does not change the diameter."
          value={role}
          onChange={(value) => setRole(value as DuctRoleId)}
          options={Object.entries(DUCT_ROLES).map(([value, item]) => ({ value, label: item.label }))}
        />
      </div>
      <ResultCard>
        {result ? (
          <>
            <Stat
              label="Round metal size"
              value={result.standardInches == null ? "Split the run" : `${result.standardInches} in`}
              detail={
                result.standardInches == null
                  ? `The chart diameter is ${formatFixed(result.theoreticalInches, 1)} inches, past a single 24-inch round.`
                  : `Chart diameter ${formatFixed(result.theoreticalInches, 2)} inches, rounded up to the next standard size.`
              }
            />
            {result.velocity != null ? (
              <Stat
                label="Velocity at that size"
                value={`${formatInt(result.velocity)} fpm`}
                detail={
                  result.velocityStatus === "inside"
                    ? `Inside the ${result.minFpm}–${result.maxFpm} fpm screen for a ${result.roleLabel.toLowerCase()}.`
                    : result.velocityStatus === "low"
                      ? `Under the ${result.minFpm} fpm screen for a ${result.roleLabel.toLowerCase()}. Quiet, and possibly more metal than you need.`
                      : `Over the ${result.maxFpm} fpm screen for a ${result.roleLabel.toLowerCase()}. Expect more noise and friction. Step up a size or move less air.`
                }
              />
            ) : null}
            {result.rectangles.length > 0 ? (
              <div>
                <h3 className="text-base">Rectangular equivalents</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {result.rectangles.map((rect) => (
                    <li key={`${rect.width}x${rect.height}`}>
                      {rect.width} × {rect.height} in, equivalent round {formatFixed(rect.equivalent, 1)} in
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <Formula
              title="Formula with your numbers"
              text={[
                `Diameter = (0.109136 × ${cfmN}^1.9 / ${frictionN}) ^ (1 / 5.02) = ${formatFixed(result.theoreticalInches, 2)} in`,
                result.standardInches
                  ? `Velocity = ${cfmN} / (π × (${result.standardInches} / 24)²) = ${formatInt(result.velocity ?? 0)} fpm`
                  : "No single standard round size covers this airflow at that friction rate.",
              ].join("\n")}
            />
            <p className="text-sm leading-6">Smooth round metal only. Flexible duct needs the manufacturer’s friction data and is usually larger.</p>
          </>
        ) : (
          <p>Enter 20 to 4,000 CFM and a friction rate from 0.02 to 0.20 inches of water per 100 feet.</p>
        )}
      </ResultCard>
    </div>
  );
}
