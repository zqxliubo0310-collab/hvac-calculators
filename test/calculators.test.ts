import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guides } from "../src/content/guides";
import { achFromCfm, cfmFromSensibleHeat, wholeDwellingVentilation } from "../src/lib/calc/airflow";
import { sizeDuct } from "../src/lib/calc/duct";
import { sizeHeatPump } from "../src/lib/calc/heat-pump";
import { selectHead } from "../src/lib/calc/mini-split";
import { COST_DEFAULTS, estimateReplacementCost } from "../src/lib/calc/replacement-cost";
import { AHRI_EXAMPLE_COUNTS, WATER_USES, peakHourGallons } from "../src/lib/calc/water-heater";
import { rateLimit } from "../src/lib/leads/rate-limit";
import { validateLead } from "../src/lib/leads/schema";

describe("guides", () => {
  for (const [slug, guide] of Object.entries(guides)) {
    it(`${slug} is 300 to 600 words`, () => {
      const words = guide.paragraphs.join(" ").trim().split(/\s+/).length;
      assert.ok(words >= 300 && words <= 600, `${slug} has ${words} words`);
      assert.ok(guide.faqs.length >= 4);
    });
  }
});

describe("heat pump screen", () => {
  it("matches the worked mixed-climate example", () => {
    const result = sizeHeatPump({
      areaSqft: 1800,
      ceilingFt: 8,
      climate: "mixed",
      insulation: "average",
      glass: "typical",
      ducts: "conditioned",
    });
    assert.equal(result.heatingBtu, 1800 * 32);
    assert.ok(Math.abs(result.coolingTons - 1800 / 550) < 0.001);
    assert.equal(result.governing, "heating");
    assert.equal(result.suggestedTons, 5);
  });
});

describe("airflow", () => {
  it("converts 200 CFM in a 20×15×8 room to 5 ACH", () => {
    const result = achFromCfm(200, 20, 15, 8);
    assert.equal(result.volume, 2400);
    assert.equal(result.ach, 5);
  });

  it("uses the ASHRAE 62.2 equation", () => {
    const rates = wholeDwellingVentilation(2000, 3);
    assert.equal(rates.ashraeCfm, 90);
    assert.equal(rates.ircCfm, 50);
  });

  it("uses the 1.08 sensible factor", () => {
    const cfm = cfmFromSensibleHeat(12000, 20);
    assert.ok(Math.abs(cfm - 12000 / 1.08 / 20) < 0.001);
  });
});

describe("ducts", () => {
  it("puts 400 CFM near a 10-inch round at 0.1 in. w.g.", () => {
    const result = sizeDuct(400, 0.1, "supply-trunk");
    assert.ok(result.theoreticalInches > 9 && result.theoreticalInches < 11);
    assert.equal(result.standardInches, 10);
  });
});

describe("mini-split heads", () => {
  it("steps to the next catalog size", () => {
    const head = selectHead(10000);
    assert.equal(head.headBtu, 12000);
    assert.equal(head.needsTwoHeads, false);
  });
});

describe("water heater worksheet", () => {
  it("reproduces the 70-gallon AHRI example", () => {
    const gallons = Object.fromEntries(WATER_USES.map((use) => [use.id, use.ahriGallons])) as Record<
      (typeof WATER_USES)[number]["id"],
      number
    >;
    assert.equal(peakHourGallons(AHRI_EXAMPLE_COUNTS, gallons), 70);
  });
});

describe("replacement cost", () => {
  it("multiplies the default air-conditioner band by tons", () => {
    const result = estimateReplacementCost({
      system: "central-ac",
      tons: 3,
      zones: 1,
      furnace: "standard",
      centralAcPerTon: COST_DEFAULTS.centralAcPerTon,
      furnaceStandard: COST_DEFAULTS.furnaceStandard,
      furnaceCondensing: COST_DEFAULTS.furnaceCondensing,
      heatPumpPerTon: COST_DEFAULTS.heatPumpPerTon,
      miniSplitFirst: COST_DEFAULTS.miniSplitFirst,
      miniSplitAdded: COST_DEFAULTS.miniSplitAdded,
      efficiencyMultiplier: 1,
      ductMultiplier: 1,
      laborMultiplier: 1,
      includePermit: false,
      permit: COST_DEFAULTS.permit,
      includeElectrical: false,
      electrical: COST_DEFAULTS.electrical,
    });
    assert.equal(result.low, 5400);
    assert.equal(result.high, 9600);
  });
});

describe("leads", () => {
  it("requires consent and a way to reply", () => {
    const missing = validateLead({
      name: "Ada Lovelace",
      zip: "02139",
      phone: "",
      email: "",
      jobType: "heat-pump",
      consent: false,
    });
    assert.equal(missing.ok, false);

    const ok = validateLead({
      name: "Ada Lovelace",
      zip: "02139",
      phone: "(617) 555-0100",
      email: "",
      jobType: "heat-pump",
      consent: true,
      sourcePath: "/heat-pump-size-calculator",
    });
    assert.equal(ok.ok, true);
  });

  it("limits repeated submissions", () => {
    const key = `test-${Date.now()}`;
    for (let i = 0; i < 5; i += 1) assert.equal(rateLimit(key, 1_000 + i).ok, true);
    assert.equal(rateLimit(key, 1_010).ok, false);
  });
});
