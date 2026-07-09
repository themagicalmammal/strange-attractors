// Barrel export for the attractor-react npm package
// Usage:
//   import { AttractorCanvas, AttractorPanel, getSystem, systems } from "attractor-react";
//   // or (CJS): const { AttractorCanvas, AttractorPanel } = require("attractor-react");

export { AttractorCanvas } from "./components/AttractorCanvas";
export { AttractorPanel } from "./components/AttractorPanel";
export { getSystem, systems } from "./systems";
export type { AttractorSystem, AttractorParams, AttractorLimits, Vector3, EqFn } from "./systems";
