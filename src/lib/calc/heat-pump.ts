/**
 * Screening factors for a residential heat pump.
 *
 * Cooling starts from the common "square feet per ton" range of about 400 to 750,
 * converted to BTU/h per square foot (one ton = 12,000 BTU/h). Heating uses a
 * BTU/h per square foot screen in the familiar 20–60 band. These are this
 * calculator's factors, not an ACCA Manual J result.
 */

export const CLIMATES = [
  {
    id: "hot-humid",
    label: "Hot-humid",
    regions: "Gulf Coast, Florida, Hawaii",
    sqftPerCoolingTon: 450,
    heatingBtuPerSqft: 20,
  },
  {
    id: "hot-dry",
    label: "Hot-dry",
    regions: "Desert Southwest",
    sqftPerCoolingTon: 400,
    heatingBtuPerSqft: 25,
  },
  {
    id: "mixed",
    label: "Mixed",
    regions: "Mid-Atlantic, upper South, southern Midwest",
    sqftPerCoolingTon: 550,
    heatingBtuPerSqft: 32,
  },
  {
    id: "cold",
    label: "Cold",
    regions: "Northeast, Upper Midwest, Mountain West",
    sqftPerCoolingTon: 650,
    heatingBtuPerSqft: 45,
  },
  {
    id: "very-cold",
    label: "Very cold",
    regions: "Northern Plains, northern New England, Alaska",
    sqftPerCoolingTon: 750,
    heatingBtuPerSqft: 58,
  },
] as const;

export type ClimateId = (typeof CLIMATES)[number]["id"];

export const INSULATION = {
  poor: {
    label: "Poor",
    factor: 1.18,
    note: "Little insulation, original single-pane windows, noticeable drafts",
  },
  average: {
    label: "Average",
    factor: 1,
    note: "Some attic insulation and mixed windows, typical of many 1980s–2000s houses",
  },
  good: {
    label: "Good",
    factor: 0.86,
    note: "Attic and walls near current code, double-pane windows",
  },
  excellent: {
    label: "Excellent",
    factor: 0.75,
    note: "Deep retrofit or a new high-performance envelope",
  },
} as const;

export type InsulationId = keyof typeof INSULATION;

export const GLASS = {
  shaded: { label: "Shaded or few windows", factor: 0.95 },
  typical: { label: "Typical window area", factor: 1 },
  large: { label: "Large or west-facing glass", factor: 1.12 },
} as const;

export type GlassId = keyof typeof GLASS;

export const DUCT_LOCATIONS = {
  conditioned: {
    label: "Ducted, ducts inside the conditioned space",
    cooling: 1,
    heating: 1,
  },
  attic: {
    label: "Ducted, ducts in an attic or crawlspace",
    cooling: 1.15,
    heating: 1.1,
  },
  ductless: {
    label: "Ductless, or no ducts",
    cooling: 1,
    heating: 1,
  },
} as const;

export type DuctLocationId = keyof typeof DUCT_LOCATIONS;

export const NOMINAL_TONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6] as const;

export type HeatPumpInput = {
  areaSqft: number;
  ceilingFt: number;
  climate: ClimateId;
  insulation: InsulationId;
  glass: GlassId;
  ducts: DuctLocationId;
};

export type HeatPumpResult = {
  climateLabel: string;
  coolingBtuPerSqft: number;
  heatingBtuPerSqft: number;
  insulationFactor: number;
  ceilingFactor: number;
  glassFactor: number;
  ductCooling: number;
  ductHeating: number;
  coolingBtu: number;
  heatingBtu: number;
  coolingTons: number;
  heatingTons: number;
  governing: "cooling" | "heating";
  governingBtu: number;
  governingTons: number;
  suggestedTons: number;
  aboveFiveTons: boolean;
};

export function coolingBtuPerSqft(sqftPerTon: number): number {
  return 12000 / sqftPerTon;
}

export function suggestNominalTons(rawTons: number): number {
  const match = NOMINAL_TONS.find((step) => step >= rawTons - 0.02);
  if (match) return match;
  return Math.ceil(rawTons * 2) / 2;
}

export function sizeHeatPump(input: HeatPumpInput): HeatPumpResult {
  const climate = CLIMATES.find((item) => item.id === input.climate) ?? CLIMATES[2];
  const insulation = INSULATION[input.insulation];
  const glass = GLASS[input.glass];
  const ducts = DUCT_LOCATIONS[input.ducts];
  const ceilingFactor = input.ceilingFt / 8;
  const baseCooling = coolingBtuPerSqft(climate.sqftPerCoolingTon);
  const coolingBtu =
    input.areaSqft * baseCooling * insulation.factor * ceilingFactor * glass.factor * ducts.cooling;
  const heatingBtu =
    input.areaSqft *
    climate.heatingBtuPerSqft *
    insulation.factor *
    ceilingFactor *
    ducts.heating;
  const governing = heatingBtu > coolingBtu ? "heating" : "cooling";
  const governingBtu = Math.max(coolingBtu, heatingBtu);
  const governingTons = governingBtu / 12000;
  const suggestedTons = suggestNominalTons(governingTons);

  return {
    climateLabel: climate.label,
    coolingBtuPerSqft: baseCooling,
    heatingBtuPerSqft: climate.heatingBtuPerSqft,
    insulationFactor: insulation.factor,
    ceilingFactor,
    glassFactor: glass.factor,
    ductCooling: ducts.cooling,
    ductHeating: ducts.heating,
    coolingBtu,
    heatingBtu,
    coolingTons: coolingBtu / 12000,
    heatingTons: heatingBtu / 12000,
    governing,
    governingBtu,
    governingTons,
    suggestedTons,
    aboveFiveTons: suggestedTons > 5,
  };
}
