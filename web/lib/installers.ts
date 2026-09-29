// Keep in sync with INSTALLER_SERVICES and US_STATES in backend/src/routes/installers.ts.
export const INSTALLER_SERVICES = [
  { id: "robotic-mower-setup",           label: "Robotic mower setup & boundary wire" },
  { id: "irrigation-controller-install", label: "Smart irrigation controllers" },
  { id: "sprinkler-install-repair",      label: "Sprinkler install & repair" },
  { id: "outdoor-lighting-install",      label: "Low-voltage outdoor lighting" },
  { id: "gate-garage-automation",        label: "Gate & garage automation" },
  { id: "security-camera-install",       label: "Outdoor cameras & security" },
  { id: "solar-battery-install",         label: "Solar & battery systems" },
  { id: "smart-home-integration",        label: "Smart home / Wi-Fi integration" },
  { id: "seasonal-maintenance",          label: "Seasonal maintenance & winterizing" },
] as const;

export type InstallerService = (typeof INSTALLER_SERVICES)[number]["id"];

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export type UsState = (typeof US_STATES)[number];
