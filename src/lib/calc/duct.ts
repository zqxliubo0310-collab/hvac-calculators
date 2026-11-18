/**
 * Power-law fit of the ASHRAE friction chart for smooth round metal duct
 * at standard air density:
 *   friction (in. w.g. per 100 ft) ≈ 0.109136 × CFM^1.9 / diameter^5.02
 * Diameter is in inches. This is a chart fit, not a measurement of a duct.
 */
export const FRICTION_COEFFICIENT = 0.109136;

export const STANDARD_ROUND_INCHES = [4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24] as const;

export const DUCT_ROLES = {
  "supply-trunk": { label: "Supply trunk", minFpm: 700, maxFpm: 900 },
  "supply-branch": { label: "Supply branch", minFpm: 500, maxFpm: 700 },
  "return-trunk": { label: "Return trunk", minFpm: 500, maxFpm: 700 },
  "return-branch": { label: "Return branch", minFpm: 400, maxFpm: 600 },
} as const;

export type DuctRoleId = keyof typeof DUCT_ROLES;

const RECT_STEPS = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 30];

export function theoreticalRoundInches(cfm: number, frictionPer100Ft: number): number {
  return Math.pow((FRICTION_COEFFICIENT * Math.pow(cfm, 1.9)) / frictionPer100Ft, 1 / 5.02);
}

export function roundDuctAreaSqFt(diameterInches: number): number {
  const radiusFt = diameterInches / 24;
  return Math.PI * radiusFt * radiusFt;
}

export function velocityFpm(cfm: number, diameterInches: number): number {
  return cfm / roundDuctAreaSqFt(diameterInches);
}

/** Huebner approximation. Dimensions in inches, result in inches. */
export function equivalentRoundInches(widthIn: number, heightIn: number): number {
  return (1.3 * Math.pow(widthIn * heightIn, 0.625)) / Math.pow(widthIn + heightIn, 0.25);
}

export function nextStandardRound(diameterInches: number): number | null {
  return STANDARD_ROUND_INCHES.find((size) => size >= diameterInches - 0.001) ?? null;
}

export type RectOption = {
  width: number;
  height: number;
  equivalent: number;
};

export function rectangularOptions(minEquivalentInches: number): RectOption[] {
  const found: RectOption[] = [];
  for (const width of RECT_STEPS) {
    for (const height of RECT_STEPS) {
      if (height > width) continue;
      if (width / height > 4) continue;
      const equivalent = equivalentRoundInches(width, height);
      if (equivalent + 0.05 >= minEquivalentInches) {
        found.push({ width, height, equivalent });
      }
    }
  }
  found.sort((a, b) => a.width * a.height - b.width * b.height || a.equivalent - b.equivalent);
  const unique: RectOption[] = [];
  for (const option of found) {
    if (unique.some((item) => item.width === option.width && item.height === option.height)) continue;
    unique.push(option);
    if (unique.length === 3) break;
  }
  return unique;
}

export type DuctResult = {
  theoreticalInches: number;
  standardInches: number | null;
  velocity: number | null;
  velocityStatus: "inside" | "low" | "high" | "oversized-run";
  rectangles: RectOption[];
  roleLabel: string;
  minFpm: number;
  maxFpm: number;
};

export function sizeDuct(cfm: number, frictionPer100Ft: number, role: DuctRoleId): DuctResult {
  const spec = DUCT_ROLES[role];
  const theoreticalInches = theoreticalRoundInches(cfm, frictionPer100Ft);
  const standardInches = nextStandardRound(theoreticalInches);
  if (standardInches == null) {
    return {
      theoreticalInches,
      standardInches: null,
      velocity: null,
      velocityStatus: "oversized-run",
      rectangles: [],
      roleLabel: spec.label,
      minFpm: spec.minFpm,
      maxFpm: spec.maxFpm,
    };
  }
  const velocity = velocityFpm(cfm, standardInches);
  const velocityStatus = velocity < spec.minFpm ? "low" : velocity > spec.maxFpm ? "high" : "inside";
  return {
    theoreticalInches,
    standardInches,
    velocity,
    velocityStatus,
    rectangles: rectangularOptions(standardInches),
    roleLabel: spec.label,
    minFpm: spec.minFpm,
    maxFpm: spec.maxFpm,
  };
}
