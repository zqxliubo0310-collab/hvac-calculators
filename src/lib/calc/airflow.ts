/** ACH = (CFM × 60) / volume, with volume in cubic feet. */
export function volumeCuFt(lengthFt: number, widthFt: number, heightFt: number): number {
  return lengthFt * widthFt * heightFt;
}

export function achFromCfm(cfm: number, lengthFt: number, widthFt: number, heightFt: number): {
  volume: number;
  ach: number;
} {
  const volume = volumeCuFt(lengthFt, widthFt, heightFt);
  return { volume, ach: (cfm * 60) / volume };
}

export function cfmFromAch(ach: number, lengthFt: number, widthFt: number, heightFt: number): {
  volume: number;
  cfm: number;
} {
  const volume = volumeCuFt(lengthFt, widthFt, heightFt);
  return { volume, cfm: (ach * volume) / 60 };
}

/**
 * ASHRAE 62.2 total ventilation rate, equation 4.1a (2013 and later editions):
 * Qtot = 0.03 × Afloor + 7.5 × (Nbr + 1). Bedroom count is not taken below 1.
 * This is the total rate before any infiltration credit.
 *
 * Recent IRC whole-dwelling rates use the same occupancy term with 0.01 × floor
 * area (see IRC M1505.4.3). Confirm the edition adopted locally.
 */
export function wholeDwellingVentilation(floorSqft: number, bedrooms: number): {
  bedroomsUsed: number;
  occupantsAssumed: number;
  ashraeCfm: number;
  ashraeFloorCfm: number;
  ashraePeopleCfm: number;
  ircCfm: number;
  ircFloorCfm: number;
} {
  const bedroomsUsed = Math.max(1, Math.round(bedrooms));
  const occupantsAssumed = bedroomsUsed + 1;
  const ashraeFloorCfm = 0.03 * floorSqft;
  const ashraePeopleCfm = 7.5 * occupantsAssumed;
  const ircFloorCfm = 0.01 * floorSqft;
  return {
    bedroomsUsed,
    occupantsAssumed,
    ashraeCfm: ashraeFloorCfm + ashraePeopleCfm,
    ashraeFloorCfm,
    ashraePeopleCfm,
    ircCfm: ircFloorCfm + ashraePeopleCfm,
    ircFloorCfm,
  };
}

/** Sea-level standard-air sensible heat: BTU/h = 1.08 × CFM × ΔT. */
export const SENSIBLE_AIR_FACTOR = 1.08;

export function cfmFromSensibleHeat(sensibleBtu: number, deltaF: number): number {
  return sensibleBtu / (SENSIBLE_AIR_FACTOR * deltaF);
}

export function cfmFromTons(tons: number, cfmPerTon: number): number {
  return tons * cfmPerTon;
}
