"use client";

import { useState } from "react";
import { SENSIBLE_AIR_FACTOR, cfmFromAch, cfmFromSensibleHeat, cfmFromTons } from "@/lib/calc/airflow";
import { formatFixed, formatInt } from "@/lib/format";
import { Formula, NumberField, ResultCard, Stat, inRange, parseNumber } from "@/components/fields";

type Mode = "tons" | "sensible" | "ach";

export function CfmCalculator() {
  const [mode, setMode] = useState<Mode>("tons");
  const [tons, setTons] = useState("3");
  const [perTon, setPerTon] = useState("400");
  const [btu, setBtu] = useState("24000");
  const [delta, setDelta] = useState("20");
  const [ach, setAch] = useState("6");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("8");

  const tonsN = parseNumber(tons);
  const perTonN = parseNumber(perTon);
  const btuN = parseNumber(btu);
  const deltaN = parseNumber(delta);
  const achN = parseNumber(ach);
  const lengthN = parseNumber(length);
  const widthN = parseNumber(width);
  const heightN = parseNumber(height);

  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="text-sm font-medium">Start from</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["tons", "Equipment tons"],
              ["sensible", "Sensible heat"],
              ["ach", "Air changes and room size"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
              <input type="radio" name="cfm-mode" checked={mode === value} onChange={() => setMode(value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {mode === "tons" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="cfm-tons" label="Cooling capacity" suffix="tons" value={tons} onChange={setTons} min={0.5} max={10} step={0.5} />
          <NumberField id="cfm-per" label="Airflow per ton" suffix="CFM" hint="400 is the usual starting point. The common band is 350 to 450." value={perTon} onChange={setPerTon} min={250} max={550} />
        </div>
      ) : null}
      {mode === "sensible" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField id="cfm-btu" label="Sensible load" suffix="BTU/h" hint="Temperature-changing load only. Do not enter total load if part of it is moisture." value={btu} onChange={setBtu} min={1000} max={200000} />
          <NumberField id="cfm-delta" label="Supply-to-room temperature difference" suffix="°F" hint="Cooling is often 18–20°F. Heat-pump heating is often lower. Use the furnace’s listed rise for a gas furnace." value={delta} onChange={setDelta} min={5} max={80} />
        </div>
      ) : null}
      {mode === "ach" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="cfm-ach" label="Target ACH" value={ach} onChange={setAch} min={0.05} max={30} step={0.05} />
          <NumberField id="cfm-l" label="Length" suffix="ft" value={length} onChange={setLength} min={2} max={200} />
          <NumberField id="cfm-w" label="Width" suffix="ft" value={width} onChange={setWidth} min={2} max={200} />
          <NumberField id="cfm-h" label="Height" suffix="ft" value={height} onChange={setHeight} min={6} max={30} step={0.5} />
        </div>
      ) : null}
      <ResultCard>
        {mode === "tons" && inRange(tonsN, 0.5, 10) && inRange(perTonN, 250, 550) ? (
          <TonsResult tons={tonsN} perTon={perTonN} />
        ) : null}
        {mode === "sensible" && inRange(btuN, 1000, 200000) && inRange(deltaN, 5, 80) ? (
          <SensibleResult btu={btuN} delta={deltaN} />
        ) : null}
        {mode === "ach" && inRange(achN, 0.05, 30) && inRange(lengthN, 2, 200) && inRange(widthN, 2, 200) && inRange(heightN, 6, 30) ? (
          <AchResult ach={achN} length={lengthN} width={widthN} height={heightN} />
        ) : null}
        {mode === "tons" && !(inRange(tonsN, 0.5, 10) && inRange(perTonN, 250, 550)) ? <p>Enter tons from 0.5 to 10 and 250 to 550 CFM per ton.</p> : null}
        {mode === "sensible" && !(inRange(btuN, 1000, 200000) && inRange(deltaN, 5, 80)) ? <p>Enter a sensible load and a temperature difference inside the labeled limits.</p> : null}
        {mode === "ach" && !(inRange(achN, 0.05, 30) && inRange(lengthN, 2, 200) && inRange(widthN, 2, 200) && inRange(heightN, 6, 30)) ? (
          <p>Enter a target ACH and room dimensions inside the labeled limits.</p>
        ) : null}
      </ResultCard>
    </div>
  );
}

function TonsResult({ tons, perTon }: { tons: number; perTon: number }) {
  const cfm = cfmFromTons(tons, perTon);
  return (
    <>
      <Stat label="Equipment airflow" value={`${formatInt(cfm)} CFM`} detail="Check this against the blower table at the duct system’s external static pressure." />
      <Formula title="Formula with your numbers" text={`CFM = ${tons} tons × ${perTon} CFM/ton = ${formatInt(cfm)}`} />
    </>
  );
}

function SensibleResult({ btu, delta }: { btu: number; delta: number }) {
  const cfm = cfmFromSensibleHeat(btu, delta);
  return (
    <>
      <Stat label="Sensible airflow" value={`${formatInt(cfm)} CFM`} detail="Sea-level standard air. At altitude this is a low estimate." />
      <Formula title="Formula with your numbers" text={`CFM = ${formatInt(btu)} / (${SENSIBLE_AIR_FACTOR} × ${delta}°F) = ${formatInt(cfm)}`} />
    </>
  );
}

function AchResult({ ach, length, width, height }: { ach: number; length: number; width: number; height: number }) {
  const result = cfmFromAch(ach, length, width, height);
  return (
    <>
      <Stat label="Airflow for that air-change rate" value={`${formatInt(result.cfm)} CFM`} detail={`${formatInt(result.volume)} ft³. Use a low ACH only if you mean outdoor air.`} />
      <Formula title="Formula with your numbers" text={`CFM = (${formatFixed(ach, 2)} × ${length} × ${width} × ${height}) / 60 = ${formatInt(result.cfm)}`} />
    </>
  );
}
