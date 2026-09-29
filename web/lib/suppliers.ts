// Keep in sync with SUPPLIER_CATEGORIES in backend/src/routes/suppliers.ts.
export const SUPPLIER_CATEGORIES = [
  { id: "robotic-mowers",           label: "Robotic mowers" },
  { id: "smart-irrigation",         label: "Smart irrigation controllers" },
  { id: "sprinkler-hardware",       label: "Sprinkler heads & valves" },
  { id: "outdoor-lighting",         label: "Smart outdoor lighting" },
  { id: "sensors-weather",          label: "Soil, rain & weather sensors" },
  { id: "gate-garage-automation",   label: "Gate & garage automation" },
  { id: "outdoor-cameras-security", label: "Outdoor cameras & security" },
  { id: "power-batteries-solar",    label: "Batteries, chargers & solar" },
  { id: "accessories-parts",        label: "Accessories & replacement parts" },
] as const;

export type SupplierCategory = (typeof SUPPLIER_CATEGORIES)[number]["id"];
