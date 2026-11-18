import type { JobTypeId } from "./leads/schema";

export type Tool = {
  slug: string;
  href: string;
  title: string;
  shortTitle: string;
  description: string;
  unit: string;
  jobType: JobTypeId;
  related: readonly string[];
};

export const tools = [
  {
    slug: "heat-pump-size-calculator",
    href: "/heat-pump-size-calculator",
    title: "HVAC Sizing Calculator",
    shortTitle: "HVAC sizing",
    description:
      "Screening estimate of residential heating and cooling in BTU/h and nominal tons, where one ton is 12,000 BTU/h. The suggested size is for a heat pump and follows the larger load. For air conditioning only, use the cooling result. Not an ACCA Manual J load calculation.",
    unit: "Tons",
    jobType: "heat-pump",
    related: ["mini-split-size-calculator", "cfm-calculator", "hvac-replacement-cost-calculator"],
  },
  {
    slug: "mini-split-size-calculator",
    href: "/mini-split-size-calculator",
    title: "Mini-Split BTU Calculator",
    shortTitle: "Mini-split BTU",
    description:
      "Estimate mini-split BTU/h for each room, then match a standard nameplate from 6,000 to 36,000. A screening size, not a Manual J.",
    unit: "BTU/h",
    jobType: "mini-split",
    related: ["heat-pump-size-calculator", "cfm-calculator", "hvac-replacement-cost-calculator"],
  },
  {
    slug: "air-changes-per-hour-calculator",
    href: "/air-changes-per-hour-calculator",
    title: "Air Changes per Hour Calculator",
    shortTitle: "Air changes per hour",
    description:
      "Convert room airflow and volume to ACH, or estimate whole-dwelling outdoor air with the ASHRAE 62.2 and IRC formulas.",
    unit: "ACH",
    jobType: "ductwork",
    related: ["cfm-calculator", "duct-size-calculator", "heat-pump-size-calculator"],
  },
  {
    slug: "duct-size-calculator",
    href: "/duct-size-calculator",
    title: "Duct Size Calculator",
    shortTitle: "Duct size",
    description:
      "Find a round metal duct diameter from airflow and friction rate, then check velocity and a few rectangular equivalents.",
    unit: "Inches",
    jobType: "ductwork",
    related: ["cfm-calculator", "air-changes-per-hour-calculator", "heat-pump-size-calculator"],
  },
  {
    slug: "cfm-calculator",
    href: "/cfm-calculator",
    title: "CFM Calculator",
    shortTitle: "CFM",
    description:
      "Estimate airflow from tons, from sensible heat and temperature difference, or from a target air-change rate.",
    unit: "CFM",
    jobType: "ductwork",
    related: ["duct-size-calculator", "air-changes-per-hour-calculator", "heat-pump-size-calculator"],
  },
  {
    slug: "water-heater-size-calculator",
    href: "/water-heater-size-calculator",
    title: "Water Heater Size Calculator",
    shortTitle: "Water heater size",
    description:
      "Add up peak-hour hot water for a storage heater’s first hour rating, and the simultaneous flow and temperature rise for a tankless heater.",
    unit: "Gallons",
    jobType: "water-heater",
    related: ["hvac-replacement-cost-calculator", "heat-pump-size-calculator"],
  },
  {
    slug: "hvac-replacement-cost-calculator",
    href: "/hvac-replacement-cost-calculator",
    title: "HVAC Replacement Cost Calculator",
    shortTitle: "HVAC replacement cost",
    description:
      "US residential planning range for replacing a central air conditioner, gas furnace, ducted heat pump, or ductless mini-split. The default reuses existing ducts. Replacing main trunks is a higher duct multiplier, not a full new duct installation. The ZIP is for the quote request only. It does not change the math or list local contractors.",
    unit: "Range",
    jobType: "not-sure",
    related: ["heat-pump-size-calculator", "mini-split-size-calculator", "water-heater-size-calculator"],
  },
] as const satisfies readonly Tool[];

export type ToolSlug = (typeof tools)[number]["slug"];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function relatedTools(slug: string): Tool[] {
  const tool = getTool(slug);
  if (!tool) return [];
  return tool.related.map((related) => getTool(related)).filter((item): item is Tool => item != null);
}

export const infoPages = [
  { href: "/about", title: "About", description: "What these HVAC and water heater calculators estimate, and what they leave to a contractor." },
  { href: "/contact", title: "Contact", description: "How to reach the operator of this site. Quote requests use the form, not email." },
  { href: "/privacy", title: "Privacy", description: "What the quote form collects, where a lead is stored, and how consent works." },
  { href: "/terms", title: "Terms", description: "Estimates are not a load calculation, a quote, or professional advice." },
] as const;
