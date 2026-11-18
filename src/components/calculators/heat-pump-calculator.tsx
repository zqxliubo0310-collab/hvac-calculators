"use client";

import { useState } from "react";
import {
  CLIMATES,
  DUCT_LOCATIONS,
  GLASS,
  INSULATION,
  sizeHeatPump,
  type ClimateId,
  type DuctLocationId,
  type GlassId,
  type InsulationId,
} from "@/lib/calc/heat-pump";
import { formatFixed, formatInt, formatTons } from "@/lib/format";
import { Formula, NumberField, ResultCard, SelectField, Stat, inRange, parseNumber } from "@/components/fields";

export function HeatPumpCalculator() {
  const [area, setArea] = useState("1800");
  const [ceiling, setCeiling] = useState("8");
  const [climate, setClimate] = useState<ClimateId>("mixed");
  const [insulation, setInsulation] = useState<InsulationId>("average");
  const [glass, setGlass] = useState<GlassId>("typical");
  const [ducts, setDucts] = useState<DuctLocationId>("conditioned");

  const areaN = parseNumber(area);
  const ceilingN = parseNumber(ceiling);
  const result =
    inRange(areaN, 200, 20000) && inRange(ceilingN, 7, 14)
      ? sizeHeatPump({
          areaSqft: areaN,
          ceilingFt: ceilingN,
          climate,
          insulation,
          glass,
          ducts,
        })
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField id="hp-area" label="Conditioned floor area" suffix="ft²" value={area} onChange={setArea} min={200} max={20000} />
        <NumberField id="hp-ceiling" label="Ceiling height" suffix="ft" value={ceiling} onChange={setCeiling} min={7} max={14} step={0.5} />
        <SelectField
          id="hp-climate"
          label="Climate"
          value={climate}
          onChange={(value) => setClimate(value as ClimateId)}
          options={CLIMATES.map((item) => ({ value: item.id, label: `${item.label} — ${item.regions}` }))}
        />
        <SelectField
          id="hp-insulation"
          label="Insulation"
          value={insulation}
          onChange={(value) => setInsulation(value as InsulationId)}
          options={Object.entries(INSULATION).map(([value, item]) => ({ value, label: item.label }))}
        />
        <SelectField
          id="hp-glass"
          label="Windows"
          value={glass}
          onChange={(value) => setGlass(value as GlassId)}
          options={Object.entries(GLASS).map(([value, item]) => ({ value, label: item.label }))}
        />
        <SelectField
          id="hp-ducts"
          label="Ducts"
          value={ducts}
          onChange={(value) => setDucts(value as DuctLocationId)}
          options={Object.entries(DUCT_LOCATIONS).map(([value, item]) => ({ value, label: item.label }))}
        />
      </div>
      <ResultCard>
        {result ? (
          <>
            <Stat
              label="Suggested nominal size"
              value={`${result.suggestedTons.toFixed(1)} tons`}
              detail={`${result.governing === "heating" ? "Heating" : "Cooling"} governs at ${formatInt(result.governingBtu)} BTU/h.`}
            />
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Cooling" value={`${formatTons(result.coolingTons)} tons`} detail={`${formatInt(result.coolingBtu)} BTU/h`} />
              <Stat label="Heating" value={`${formatTons(result.heatingTons)} tons`} detail={`${formatInt(result.heatingBtu)} BTU/h`} />
            </div>
            <p className="text-sm leading-6">
              For a heat pump, the suggestion follows the larger load. For air conditioning only, use the cooling result. This is a screening estimate, not an ACCA Manual J load calculation.
            </p>
            {result.aboveFiveTons ? (
              <p className="text-sm leading-6">
                Above 5 tons is a signal to improve the envelope or split the house into two systems, then confirm with Manual J. It is not an order quantity.
              </p>
            ) : null}
            <Formula
              title="Formula with your numbers"
              text={[
                `Cooling = ${areaN} × ${formatFixed(result.coolingBtuPerSqft, 2)} × ${result.insulationFactor} × ${formatFixed(result.ceilingFactor, 3)} × ${result.glassFactor} × ${result.ductCooling} = ${formatInt(result.coolingBtu)} BTU/h`,
                `Heating = ${areaN} × ${result.heatingBtuPerSqft} × ${result.insulationFactor} × ${formatFixed(result.ceilingFactor, 3)} × ${result.ductHeating} = ${formatInt(result.heatingBtu)} BTU/h`,
                `Tons = BTU/h ÷ 12,000. Suggestion = smallest half-ton at or above the larger tons.`,
              ].join("\n")}
            />
          </>
        ) : (
          <p>Enter a floor area from 200 to 20,000 ft² and a ceiling height from 7 to 14 ft.</p>
        )}
      </ResultCard>
    </div>
  );
}
