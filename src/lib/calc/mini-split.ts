import {
  CLIMATES,
  DUCT_LOCATIONS,
  GLASS,
  INSULATION,
  coolingBtuPerSqft,
  type ClimateId,
  type GlassId,
  type InsulationId,
} from "./heat-pump";

/** Common single-zone and multi-zone indoor unit nameplates, in BTU/h. */
export const HEAD_SIZES = [6000, 9000, 12000, 15000, 18000, 24000, 30000, 36000] as const;

/**
 * Cooking allowance used on many manufacturer room worksheets.
 * Applied to the cooling screen only.
 */
export const KITCHEN_COOLING_ADDER_BTU = 4000;

export const ROOM_USES = {
  bedroom: { label: "Bedroom", coolingAdder: 0, glass: null },
  living: { label: "Living room", coolingAdder: 0, glass: null },
  office: { label: "Office or den", coolingAdder: 0, glass: null },
  kitchen: { label: "Kitchen", coolingAdder: KITCHEN_COOLING_ADDER_BTU, glass: null },
  sunroom: { label: "Sunroom", coolingAdder: 0, glass: "large" as const },
} as const;

export type RoomUseId = keyof typeof ROOM_USES;

export type MiniSplitRoomInput = {
  name: string;
  areaSqft: number;
  ceilingFt: number;
  use: RoomUseId;
  insulation: InsulationId;
  glass: GlassId;
};

export type MiniSplitInput = {
  climate: ClimateId;
  rooms: MiniSplitRoomInput[];
};

export type RoomSizing = {
  name: string;
  coolingBtu: number;
  heatingBtu: number;
  governing: "cooling" | "heating";
  governingBtu: number;
  headBtu: number | null;
  oversizeRatio: number | null;
  needsTwoHeads: boolean;
  coolingAdder: number;
  glassFactor: number;
  baseCoolingBtu: number;
};

export type MiniSplitResult = {
  rooms: RoomSizing[];
  connectedBtu: number | null;
  incomplete: boolean;
};

export function selectHead(governingBtu: number): {
  headBtu: number | null;
  oversizeRatio: number | null;
  needsTwoHeads: boolean;
} {
  if (governingBtu > HEAD_SIZES[HEAD_SIZES.length - 1]) {
    return { headBtu: null, oversizeRatio: null, needsTwoHeads: true };
  }
  const headBtu = HEAD_SIZES.find((size) => size >= governingBtu) ?? null;
  if (headBtu == null) {
    return { headBtu: null, oversizeRatio: null, needsTwoHeads: true };
  }
  return {
    headBtu,
    oversizeRatio: (headBtu - governingBtu) / governingBtu,
    needsTwoHeads: false,
  };
}

export function sizeMiniSplit(input: MiniSplitInput): MiniSplitResult {
  const climate = CLIMATES.find((item) => item.id === input.climate) ?? CLIMATES[2];
  const baseCooling = coolingBtuPerSqft(climate.sqftPerCoolingTon);
  const rooms = input.rooms.map((room) => {
    const use = ROOM_USES[room.use];
    const glassId = use.glass ?? room.glass;
    const glassFactor = GLASS[glassId].factor;
    const insulationFactor = INSULATION[room.insulation].factor;
    const ceilingFactor = room.ceilingFt / 8;
    const baseCoolingBtu = room.areaSqft * baseCooling * insulationFactor * ceilingFactor * glassFactor;
    const coolingBtu = baseCoolingBtu + use.coolingAdder;
    const heatingBtu =
      room.areaSqft * climate.heatingBtuPerSqft * insulationFactor * ceilingFactor;
    const governing = heatingBtu > coolingBtu ? "heating" : "cooling";
    const governingBtu = Math.max(coolingBtu, heatingBtu);
    const head = selectHead(governingBtu);
    return {
      name: room.name.trim() || "Room",
      coolingBtu,
      heatingBtu,
      governing,
      governingBtu,
      headBtu: head.headBtu,
      oversizeRatio: head.oversizeRatio,
      needsTwoHeads: head.needsTwoHeads,
      coolingAdder: use.coolingAdder,
      glassFactor,
      baseCoolingBtu,
    } satisfies RoomSizing;
  });

  const incomplete = rooms.some((room) => room.headBtu == null);
  const connectedBtu = incomplete ? null : rooms.reduce((sum, room) => sum + (room.headBtu ?? 0), 0);

  return { rooms, connectedBtu, incomplete };
}

export const DUCTLESS_NOTE = DUCT_LOCATIONS.ductless.label;
