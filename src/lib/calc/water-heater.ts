/**
 * Storage-tank peak hour demand uses the AHRI / historical DOE worksheet
 * gallons (the column published as "average gallons of hot water per usage"
 * with the note that it assumes no water conservation).
 *
 * Low-flow gallons are this calculator's planning allowances, not AHRI figures.
 * Each one is explained in `lowFlowNote`.
 */
export const WATER_USES = [
  {
    id: "shower",
    label: "Shower",
    ahriGallons: 20,
    lowFlowGallons: 10,
    lowFlowNote:
      "Ten gallons is a short low-flow shower allowance (about eight minutes at 2.0 gpm of mixed water, with only part of the mix coming from the tank). The AHRI worksheet uses 20.",
  },
  {
    id: "bath",
    label: "Bath",
    ahriGallons: 20,
    lowFlowGallons: 20,
    lowFlowNote: "A tub fill does not shrink because the showerhead is efficient. Left at the AHRI value.",
  },
  {
    id: "shave",
    label: "Shaving",
    ahriGallons: 2,
    lowFlowGallons: 2,
    lowFlowNote: "Unchanged from the AHRI worksheet.",
  },
  {
    id: "hands",
    label: "Hands and face washing",
    ahriGallons: 4,
    lowFlowGallons: 2,
    lowFlowNote: "Cut in half as a planning allowance for a low-flow lavatory. Not an AHRI figure.",
  },
  {
    id: "shampoo",
    label: "Hair shampoo",
    ahriGallons: 4,
    lowFlowGallons: 4,
    lowFlowNote: "Unchanged from the AHRI worksheet.",
  },
  {
    id: "hand-dish",
    label: "Hand dishwashing",
    ahriGallons: 4,
    lowFlowGallons: 4,
    lowFlowNote: "Unchanged from the AHRI worksheet.",
  },
  {
    id: "dishwasher",
    label: "Automatic dishwasher",
    ahriGallons: 14,
    lowFlowGallons: 6,
    lowFlowNote:
      "Fourteen gallons matches older machines on the AHRI worksheet. Six is a planning allowance for a modern dishwasher.",
  },
  {
    id: "food",
    label: "Food preparation",
    ahriGallons: 5,
    lowFlowGallons: 5,
    lowFlowNote: "Unchanged from the AHRI worksheet.",
  },
  {
    id: "wringer",
    label: "Wringer clothes washer",
    ahriGallons: 26,
    lowFlowGallons: 26,
    lowFlowNote: "Kept so the worksheet matches the published AHRI row. Most homes can leave the count at zero.",
  },
  {
    id: "washer",
    label: "Automatic clothes washer",
    ahriGallons: 32,
    lowFlowGallons: 14,
    lowFlowNote:
      "Thirty-two gallons is the AHRI value and fits older top-loaders. Fourteen is a planning allowance for a modern washer on a warm cycle.",
  },
] as const;

export type WaterUseId = (typeof WATER_USES)[number]["id"];

export const AHRI_EXAMPLE_COUNTS: Record<WaterUseId, number> = {
  shower: 3,
  bath: 0,
  shave: 1,
  hands: 0,
  shampoo: 1,
  "hand-dish": 1,
  dishwasher: 0,
  food: 0,
  wringer: 0,
  washer: 0,
};

export function peakHourGallons(counts: Record<WaterUseId, number>, gallons: Record<WaterUseId, number>): number {
  return WATER_USES.reduce((sum, use) => sum + counts[use.id] * gallons[use.id], 0);
}

/**
 * DOE's demand-heater example uses 2.5 gpm for a shower and 0.75 gpm for a
 * faucet, inlet 50°F unless you know otherwise, and 120°F for most uses.
 * Kitchen, dishwasher, and washer flows are planning allowances you can edit.
 */
export const TANKLESS_FIXTURES = [
  {
    id: "shower",
    label: "Shower",
    defaultGpm: 2.5,
    defaultOn: true,
    note: "2.5 gpm is the federal showerhead maximum and the flow in the DOE sizing example. WaterSense showerheads are 2.0 gpm or less.",
  },
  {
    id: "lavatory",
    label: "Bathroom faucet",
    defaultGpm: 0.75,
    defaultOn: true,
    note: "0.75 gpm is the faucet flow in the DOE sizing example.",
  },
  {
    id: "kitchen",
    label: "Kitchen faucet",
    defaultGpm: 1.8,
    defaultOn: false,
    note: "A planning allowance near a modern kitchen faucet. The federal maximum is 2.2 gpm at 60 psi.",
  },
  {
    id: "dishwasher",
    label: "Dishwasher",
    defaultGpm: 1.5,
    defaultOn: false,
    note: "A planning allowance while the machine fills. Check the model if it is part of the peak.",
  },
  {
    id: "washer",
    label: "Clothes washer",
    defaultGpm: 2,
    defaultOn: false,
    note: "A planning allowance while the machine fills.",
  },
] as const;

export type TanklessFixtureId = (typeof TANKLESS_FIXTURES)[number]["id"];

export const DOE_ASSUMED_INLET_F = 50;
export const DOE_ASSUMED_SETPOINT_F = 120;

export function temperatureRise(setpointF: number, inletF: number): number {
  return setpointF - inletF;
}

export function simultaneousGpm(
  enabled: Record<TanklessFixtureId, boolean>,
  gpm: Record<TanklessFixtureId, number>,
): number {
  return TANKLESS_FIXTURES.reduce((sum, fixture) => sum + (enabled[fixture.id] ? gpm[fixture.id] : 0), 0);
}
