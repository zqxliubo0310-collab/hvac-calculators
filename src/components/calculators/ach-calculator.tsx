"use client";

import { useState } from "react";
import { achFromCfm, cfmFromAch, wholeDwellingVentilation } from "@/lib/calc/airflow";
import { formatFixed, formatInt } from "@/lib/format";
import { Formula, NumberField, ResultCard, Stat, inRange, parseNumber } from "@/components/fields";

type Mode = "ach" | "cfm" | "ventilation";

export function AchCalculator() {
  const [mode, setMode] = useState<Mode>("ach");
  const [length, setLength] = useState("20");
  const [width, setWidth] = useState("15");
  const [height, setHeight] = useState("8");
  const [cfm, setCfm] = useState("200");
  const [ach, setAch] = useState("0.5");
  const [floor, setFloor] = useState("2000");
  const [bedrooms, setBedrooms] = useState("3");
  const [ventHeight, setVentHeight] = useState("8");

  const lengthN = parseNumber(length);
  const widthN = parseNumber(width);
  const heightN = parseNumber(height);
  const cfmN = parseNumber(cfm);
  const achN = parseNumber(ach);
  const floorN = parseNumber(floor);
  const bedroomsN = parseNumber(bedrooms);
  const ventHeightN = parseNumber(ventHeight);

  const roomOk = inRange(lengthN, 2, 200) && inRange(widthN, 2, 200) && inRange(heightN, 6, 30);
  const ventOk = inRange(floorN, 200, 20000) && inRange(bedroomsN, 0, 12) && inRange(ventHeightN, 6, 30);

  return (
    <div className="grid gap-6">
      <fieldset>
        <legend className="text-sm font-medium">What do you want?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(
            [
              ["ach", "ACH from a known CFM"],
              ["cfm", "CFM for a target ACH"],
              ["ventilation", "Whole-dwelling outdoor air"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-sm">
              <input type="radio" name="ach-mode" checked={mode === value} onChange={() => setMode(value)} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
      {mode === "ventilation" ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField id="ach-floor" label="Conditioned floor area" suffix="ft²" value={floor} onChange={setFloor} min={200} max={20000} />
          <NumberField id="ach-beds" label="Bedrooms" hint="Use 0 for a studio. The formula will not go below 1." value={bedrooms} onChange={setBedrooms} min={0} max={12} step={1} />
          <NumberField id="ach-vheight" label="Average ceiling height" suffix="ft" hint="Used only to express the rates as ACH." value={ventHeight} onChange={setVentHeight} min={6} max={30} step={0.5} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField id="ach-l" label="Length" suffix="ft" value={length} onChange={setLength} min={2} max={200} />
          <NumberField id="ach-w" label="Width" suffix="ft" value={width} onChange={setWidth} min={2} max={200} />
          <NumberField id="ach-h" label="Height" suffix="ft" value={height} onChange={setHeight} min={6} max={30} step={0.5} />
          {mode === "ach" ? (
            <NumberField id="ach-cfm" label="Airflow" suffix="CFM" value={cfm} onChange={setCfm} min={1} max={20000} />
          ) : (
            <NumberField id="ach-target" label="Target ACH" value={ach} onChange={setAch} min={0.05} max={30} step={0.05} />
          )}
        </div>
      )}
      <ResultCard>
        {mode === "ventilation" &&
        inRange(floorN, 200, 20000) &&
        inRange(bedroomsN, 0, 12) &&
        inRange(ventHeightN, 6, 30) ? (
          <VentilationResult floor={floorN} bedrooms={bedroomsN} height={ventHeightN} />
        ) : null}
        {mode === "ach" && roomOk && inRange(cfmN, 1, 20000) && inRange(lengthN, 2, 200) && inRange(widthN, 2, 200) && inRange(heightN, 6, 30) ? (
          <AchFromCfm length={lengthN} width={widthN} height={heightN} cfm={cfmN} />
        ) : null}
        {mode === "cfm" && roomOk && inRange(achN, 0.05, 30) && inRange(lengthN, 2, 200) && inRange(widthN, 2, 200) && inRange(heightN, 6, 30) ? (
          <CfmFromAch length={lengthN} width={widthN} height={heightN} ach={achN} />
        ) : null}
        {mode === "ventilation" && !ventOk ? <p>Enter floor area, bedrooms, and ceiling height inside the labeled limits.</p> : null}
        {mode === "ach" && !(roomOk && inRange(cfmN, 1, 20000)) ? <p>Enter room dimensions and a CFM inside the labeled limits.</p> : null}
        {mode === "cfm" && !(roomOk && inRange(achN, 0.05, 30)) ? <p>Enter room dimensions and a target ACH inside the labeled limits.</p> : null}
      </ResultCard>
    </div>
  );
}

function AchFromCfm({ length, width, height, cfm }: { length: number; width: number; height: number; cfm: number }) {
  const result = achFromCfm(cfm, length, width, height);
  return (
    <>
      <Stat label="Air changes per hour" value={formatFixed(result.ach, 2)} detail={`${formatInt(result.volume)} ft³ of room.`} />
      <Formula title="Formula with your numbers" text={`ACH = (${formatInt(cfm)} CFM × 60) / (${length} × ${width} × ${height}) = ${formatFixed(result.ach, 2)}`} />
      <p className="text-sm leading-6">This is a turnover of whatever air the CFM describes. Outdoor-air ventilation and recirculated supply air are different jobs.</p>
    </>
  );
}

function CfmFromAch({ length, width, height, ach }: { length: number; width: number; height: number; ach: number }) {
  const result = cfmFromAch(ach, length, width, height);
  return (
    <>
      <Stat label="Required airflow" value={`${formatInt(result.cfm)} CFM`} detail={`${formatInt(result.volume)} ft³ at ${formatFixed(ach, 2)} ACH.`} />
      <Formula title="Formula with your numbers" text={`CFM = (${formatFixed(ach, 2)} × ${length} × ${width} × ${height}) / 60 = ${formatInt(result.cfm)}`} />
    </>
  );
}

function VentilationResult({ floor, bedrooms, height }: { floor: number; bedrooms: number; height: number }) {
  const rates = wholeDwellingVentilation(floor, bedrooms);
  const volume = floor * height;
  const ashraeAch = (rates.ashraeCfm * 60) / volume;
  const ircAch = (rates.ircCfm * 60) / volume;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="ASHRAE 62.2 total" value={`${formatInt(rates.ashraeCfm)} CFM`} detail={`${formatFixed(ashraeAch, 2)} ACH at this ceiling height, before any infiltration credit.`} />
        <Stat label="IRC-style rate" value={`${formatInt(rates.ircCfm)} CFM`} detail={`${formatFixed(ircAch, 2)} ACH. Confirm the code edition adopted locally.`} />
      </div>
      <Formula
        title="Formula with your numbers"
        text={[
          `Bedrooms used = ${rates.bedroomsUsed}. Assumed people = ${rates.occupantsAssumed}.`,
          `ASHRAE Qtot = 0.03 × ${formatInt(floor)} + 7.5 × ${rates.occupantsAssumed} = ${formatFixed(rates.ashraeFloorCfm, 1)} + ${formatFixed(rates.ashraePeopleCfm, 1)} = ${formatFixed(rates.ashraeCfm, 1)} CFM`,
          `IRC-style = 0.01 × ${formatInt(floor)} + 7.5 × ${rates.occupantsAssumed} = ${formatFixed(rates.ircFloorCfm, 1)} + ${formatFixed(rates.ashraePeopleCfm, 1)} = ${formatFixed(rates.ircCfm, 1)} CFM`,
        ].join("\n")}
      />
    </>
  );
}
