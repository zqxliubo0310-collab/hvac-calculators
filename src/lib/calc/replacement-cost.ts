/**
 * Planning bands for a budgeting conversation. They are round figures chosen
 * so the arithmetic is visible. They are not a national price survey, not
 * RSMeans, and not a contractor quote.
 */
export type MoneyBand = { low: number; high: number };

export const COST_DEFAULTS = {
  centralAcPerTon: { low: 1800, high: 3200 },
  furnaceStandard: { low: 3200, high: 5800 },
  furnaceCondensing: { low: 4500, high: 8200 },
  heatPumpPerTon: { low: 2500, high: 4500 },
  miniSplitFirst: { low: 3500, high: 7000 },
  miniSplitAdded: { low: 1800, high: 3500 },
  permit: { low: 150, high: 500 },
  electrical: { low: 800, high: 3000 },
} as const;

export const SYSTEMS = [
  { id: "central-ac", label: "Central air conditioner (indoor coil and outdoor unit)" },
  { id: "gas-furnace", label: "Gas furnace" },
  { id: "ac-and-furnace", label: "Central air conditioner and gas furnace" },
  { id: "ducted-heat-pump", label: "Ducted heat pump" },
  { id: "ductless", label: "Ductless mini-split" },
] as const;

export type SystemId = (typeof SYSTEMS)[number]["id"];

export type CostLine = {
  label: string;
  low: number;
  high: number;
  detail: string;
};

export type CostInput = {
  system: SystemId;
  tons: number;
  zones: number;
  furnace: "standard" | "condensing";
  centralAcPerTon: MoneyBand;
  furnaceStandard: MoneyBand;
  furnaceCondensing: MoneyBand;
  heatPumpPerTon: MoneyBand;
  miniSplitFirst: MoneyBand;
  miniSplitAdded: MoneyBand;
  efficiencyMultiplier: number;
  ductMultiplier: number;
  laborMultiplier: number;
  includePermit: boolean;
  permit: MoneyBand;
  includeElectrical: boolean;
  electrical: MoneyBand;
};

export type CostResult = {
  lines: CostLine[];
  low: number;
  high: number;
};

function scale(band: MoneyBand, factor: number): MoneyBand {
  return { low: band.low * factor, high: band.high * factor };
}

function add(a: MoneyBand, b: MoneyBand): MoneyBand {
  return { low: a.low + b.low, high: a.high + b.high };
}

export function estimateReplacementCost(input: CostInput): CostResult {
  const lines: CostLine[] = [];
  const installFactor = input.laborMultiplier;

  if (input.system === "central-ac" || input.system === "ac-and-furnace") {
    const raw = scale(input.centralAcPerTon, input.tons);
    const adjusted = scale(raw, input.efficiencyMultiplier * input.ductMultiplier * installFactor);
    lines.push({
      label: "Central air conditioner",
      low: adjusted.low,
      high: adjusted.high,
      detail: `${input.tons} tons × ${moneyPair(input.centralAcPerTon)} per ton × ${input.efficiencyMultiplier} efficiency × ${input.ductMultiplier} ducts × ${input.laborMultiplier} labor`,
    });
  }

  if (input.system === "gas-furnace" || input.system === "ac-and-furnace") {
    const band = input.furnace === "condensing" ? input.furnaceCondensing : input.furnaceStandard;
    const adjusted = scale(band, input.ductMultiplier * installFactor);
    lines.push({
      label: input.furnace === "condensing" ? "Condensing gas furnace" : "Standard gas furnace",
      low: adjusted.low,
      high: adjusted.high,
      detail: `${moneyPair(band)} installed band × ${input.ductMultiplier} ducts × ${input.laborMultiplier} labor. The furnace band already stands in for efficiency, so the efficiency multiplier is not applied again.`,
    });
  }

  if (input.system === "ducted-heat-pump") {
    const raw = scale(input.heatPumpPerTon, input.tons);
    const adjusted = scale(raw, input.efficiencyMultiplier * input.ductMultiplier * installFactor);
    lines.push({
      label: "Ducted heat pump",
      low: adjusted.low,
      high: adjusted.high,
      detail: `${input.tons} tons × ${moneyPair(input.heatPumpPerTon)} per ton × ${input.efficiencyMultiplier} efficiency × ${input.ductMultiplier} ducts × ${input.laborMultiplier} labor`,
    });
  }

  if (input.system === "ductless") {
    const zones = Math.max(1, input.zones);
    const raw = add(input.miniSplitFirst, scale(input.miniSplitAdded, zones - 1));
    const adjusted = scale(raw, input.efficiencyMultiplier * installFactor);
    lines.push({
      label: zones === 1 ? "Single-zone mini-split" : `${zones}-zone mini-split`,
      low: adjusted.low,
      high: adjusted.high,
      detail: `${moneyPair(input.miniSplitFirst)} for the first indoor unit${zones > 1 ? ` + ${zones - 1} × ${moneyPair(input.miniSplitAdded)}` : ""} × ${input.efficiencyMultiplier} efficiency × ${input.laborMultiplier} labor. Duct condition is not applied.`,
    });
  }

  if (input.includePermit) {
    lines.push({
      label: "Permit allowance",
      low: input.permit.low,
      high: input.permit.high,
      detail: "Added after the install multipliers.",
    });
  }

  if (input.includeElectrical) {
    lines.push({
      label: "Electrical upgrade allowance",
      low: input.electrical.low,
      high: input.electrical.high,
      detail: "A separate planning band for a new circuit or panel work. Added after the install multipliers.",
    });
  }

  const low = lines.reduce((sum, line) => sum + line.low, 0);
  const high = lines.reduce((sum, line) => sum + line.high, 0);
  return { lines, low, high };
}

function moneyPair(band: MoneyBand): string {
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  return `${format(band.low)}–${format(band.high)}`;
}

export { moneyPair };
