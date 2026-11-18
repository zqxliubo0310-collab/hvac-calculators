"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CLIMATES, GLASS, INSULATION, type ClimateId, type GlassId, type InsulationId } from "@/lib/calc/heat-pump";
import { ROOM_USES, sizeMiniSplit, type RoomUseId } from "@/lib/calc/mini-split";
import { formatInt, formatPercent } from "@/lib/format";
import { Formula, NumberField, ResultCard, SelectField, Stat, inRange, parseNumber } from "@/components/fields";

type RoomDraft = {
  key: string;
  name: string;
  area: string;
  ceiling: string;
  use: RoomUseId;
  insulation: InsulationId;
  glass: GlassId;
};

function blankRoom(key: string, name: string): RoomDraft {
  return { key, name, area: "250", ceiling: "8", use: "bedroom", insulation: "average", glass: "typical" };
}

export function MiniSplitCalculator() {
  const [climate, setClimate] = useState<ClimateId>("mixed");
  const [rooms, setRooms] = useState<RoomDraft[]>([blankRoom("room-1", "Primary bedroom")]);

  function update(key: string, patch: Partial<RoomDraft>) {
    setRooms((current) => current.map((room) => (room.key === key ? { ...room, ...patch } : room)));
  }

  const parsed = rooms.map((room) => {
    const area = parseNumber(room.area);
    const ceiling = parseNumber(room.ceiling);
    return { room, area, ceiling, valid: inRange(area, 40, 2000) && inRange(ceiling, 7, 14) };
  });
  const valid = parsed.every((item) => item.valid);
  const result = valid
    ? sizeMiniSplit({
        climate,
        rooms: parsed.map((item) => ({
          name: item.room.name,
          areaSqft: item.area as number,
          ceilingFt: item.ceiling as number,
          use: item.room.use,
          insulation: item.room.insulation,
          glass: item.room.glass,
        })),
      })
    : null;

  return (
    <div className="grid gap-6">
      <SelectField
        id="ms-climate"
        label="Climate for every room"
        value={climate}
        onChange={(value) => setClimate(value as ClimateId)}
        options={CLIMATES.map((item) => ({ value: item.id, label: `${item.label} — ${item.regions}` }))}
      />
      {rooms.map((room, index) => (
        <fieldset key={room.key} className="grid gap-4 rounded-2xl border p-4 sm:grid-cols-2">
          <legend className="px-1 font-medium">Room {index + 1}</legend>
          <div className="grid gap-1.5 sm:col-span-2">
            <label htmlFor={`${room.key}-name`} className="text-sm font-medium">
              Name
            </label>
            <input
              id={`${room.key}-name`}
              value={room.name}
              onChange={(event) => update(room.key, { name: event.target.value })}
              className="h-11 rounded-lg border border-input bg-card px-3"
            />
          </div>
          <NumberField id={`${room.key}-area`} label="Floor area" suffix="ft²" value={room.area} onChange={(value) => update(room.key, { area: value })} min={40} max={2000} />
          <NumberField id={`${room.key}-ceiling`} label="Ceiling height" suffix="ft" value={room.ceiling} onChange={(value) => update(room.key, { ceiling: value })} min={7} max={14} step={0.5} />
          <SelectField
            id={`${room.key}-use`}
            label="How the room is used"
            value={room.use}
            onChange={(value) => update(room.key, { use: value as RoomUseId })}
            options={Object.entries(ROOM_USES).map(([value, item]) => ({ value, label: item.label }))}
          />
          <SelectField
            id={`${room.key}-insulation`}
            label="Insulation"
            value={room.insulation}
            onChange={(value) => update(room.key, { insulation: value as InsulationId })}
            options={Object.entries(INSULATION).map(([value, item]) => ({ value, label: item.label }))}
          />
          <SelectField
            id={`${room.key}-glass`}
            label="Windows"
            hint={room.use === "sunroom" ? "A sunroom is treated as large glass either way." : undefined}
            value={room.glass}
            onChange={(value) => update(room.key, { glass: value as GlassId })}
            options={Object.entries(GLASS).map(([value, item]) => ({ value, label: item.label }))}
          />
          {rooms.length > 1 ? (
            <div className="sm:col-span-2">
              <Button type="button" variant="outline" className="h-10" onClick={() => setRooms((current) => current.filter((item) => item.key !== room.key))}>
                Remove room
              </Button>
            </div>
          ) : null}
        </fieldset>
      ))}
      {rooms.length < 6 ? (
        <Button
          type="button"
          variant="outline"
          className="h-11 w-fit"
          onClick={() => setRooms((current) => [...current, blankRoom(`room-${current.length + 1}-${current[current.length - 1]?.key ?? "x"}`, `Room ${current.length + 1}`)])}
        >
          Add a room
        </Button>
      ) : null}
      <ResultCard>
        {result ? (
          <>
            <Stat
              label="Outdoor connected capacity"
              value={result.connectedBtu == null ? "See rooms" : `${formatInt(result.connectedBtu)} BTU/h`}
              detail="Sum of the indoor nameplates. No diversity credit is applied."
            />
            <ul className="grid gap-3">
              {result.rooms.map((room) => (
                <li key={room.name} className="rounded-xl bg-muted p-3 text-sm leading-6">
                  <span className="font-medium">{room.name}</span>
                  {room.needsTwoHeads || room.headBtu == null ? (
                    <p>The screen is {formatInt(room.governingBtu)} BTU/h, above a single 36,000 BTU/h head. Use two heads or a ducted system.</p>
                  ) : (
                    <p>
                      Screen {formatInt(room.governingBtu)} BTU/h ({room.governing}). Suggested head {formatInt(room.headBtu)} BTU/h
                      {room.oversizeRatio != null ? `, ${formatPercent(room.oversizeRatio)} above the screen` : ""}.
                      {room.oversizeRatio != null && room.oversizeRatio > 0.25
                        ? " That is a catalog step, not proof the room needs the full nameplate. Ask for the unit’s minimum capacity."
                        : ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
            <Formula
              title="Formula"
              text={[
                "Cooling BTU/h = area × (12,000 / ft² per ton) × insulation × (ceiling / 8) × glass + kitchen adder",
                "Heating BTU/h = area × heating BTU/ft² × insulation × (ceiling / 8)",
                "Head = smallest catalog size at or above the larger of those two.",
                result.rooms
                  .map((room) => {
                    const adder = room.coolingAdder ? ` + ${formatInt(room.coolingAdder)}` : "";
                    return `${room.name}: cooling ${formatInt(room.baseCoolingBtu)}${adder} = ${formatInt(room.coolingBtu)}; heating ${formatInt(room.heatingBtu)}`;
                  })
                  .join("\n"),
              ].join("\n")}
            />
          </>
        ) : (
          <p>Each room needs 40 to 2,000 ft² and a ceiling from 7 to 14 ft.</p>
        )}
      </ResultCard>
    </div>
  );
}
