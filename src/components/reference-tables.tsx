import { CLIMATES, GLASS, INSULATION } from "@/lib/calc/heat-pump";
import { DUCT_ROLES } from "@/lib/calc/duct";
import { COST_DEFAULTS } from "@/lib/calc/replacement-cost";
import { WATER_USES } from "@/lib/calc/water-heater";
import { formatInt } from "@/lib/format";

export function DataTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <caption className="border-b bg-muted px-3 py-2 text-left font-medium">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col" className="px-3 py-2 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-t">
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="px-3 py-2 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HeatPumpTables() {
  return (
    <div className="grid gap-4">
      <DataTable
        caption="Screening factors used by the heat pump and mini-split calculators"
        headers={["Climate", "Where it roughly fits", "ft² per cooling ton", "Heating BTU/h per ft²"]}
        rows={CLIMATES.map((climate) => [
          climate.label,
          climate.regions,
          String(climate.sqftPerCoolingTon),
          String(climate.heatingBtuPerSqft),
        ])}
      />
      <DataTable
        caption="Insulation, glass, and what they multiply"
        headers={["Input", "Factor", "Meaning"]}
        rows={[
          ...Object.values(INSULATION).map((item) => [`Insulation: ${item.label}`, String(item.factor), item.note]),
          ...Object.values(GLASS).map((item) => [`Glass: ${item.label}`, String(item.factor), "Applied to cooling only"]),
          ["Ducts inside conditioned space", "1.00 / 1.00", "Cooling factor / heating factor"],
          ["Ducts in an attic or crawlspace", "1.15 / 1.10", "Flat uplift, not a measured duct loss"],
          ["Ductless", "1.00 / 1.00", "No duct uplift"],
          ["Ceiling height", "height / 8", "Eight feet is the baseline the rules of thumb assume"],
        ]}
      />
    </div>
  );
}

export function DuctRoleTable() {
  return (
    <DataTable
      caption="Velocity ranges used to flag a result, in feet per minute"
      headers={["Role", "Common low", "Common high"]}
      rows={Object.values(DUCT_ROLES).map((role) => [role.label, String(role.minFpm), String(role.maxFpm)])}
    />
  );
}

export function WaterUseTable() {
  return (
    <DataTable
      caption="Gallons per use: AHRI worksheet versus this calculator’s low-flow allowances"
      headers={["Use", "AHRI gallons", "Low-flow allowance"]}
      rows={WATER_USES.map((use) => [use.label, String(use.ahriGallons), String(use.lowFlowGallons)])}
    />
  );
}

export function CostDefaultTable() {
  const money = (value: number) => `$${formatInt(value)}`;
  const rows: string[][] = [
    ["Central air conditioner", `${money(COST_DEFAULTS.centralAcPerTon.low)}–${money(COST_DEFAULTS.centralAcPerTon.high)} per ton`],
    ["Ducted heat pump", `${money(COST_DEFAULTS.heatPumpPerTon.low)}–${money(COST_DEFAULTS.heatPumpPerTon.high)} per ton`],
    ["Standard gas furnace", `${money(COST_DEFAULTS.furnaceStandard.low)}–${money(COST_DEFAULTS.furnaceStandard.high)} installed`],
    ["Condensing gas furnace", `${money(COST_DEFAULTS.furnaceCondensing.low)}–${money(COST_DEFAULTS.furnaceCondensing.high)} installed`],
    ["Mini-split, first indoor unit", `${money(COST_DEFAULTS.miniSplitFirst.low)}–${money(COST_DEFAULTS.miniSplitFirst.high)}`],
    ["Mini-split, each added unit", `${money(COST_DEFAULTS.miniSplitAdded.low)}–${money(COST_DEFAULTS.miniSplitAdded.high)}`],
    ["Permit, if checked", `${money(COST_DEFAULTS.permit.low)}–${money(COST_DEFAULTS.permit.high)}`],
    ["Electrical upgrade, if checked", `${money(COST_DEFAULTS.electrical.low)}–${money(COST_DEFAULTS.electrical.high)}`],
  ];
  return (
    <DataTable
      caption="Default planning bands. Edit them in the calculator. They are not a price survey."
      headers={["Scope", "Default band"]}
      rows={rows}
    />
  );
}
