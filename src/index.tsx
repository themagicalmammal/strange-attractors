// Barrel export for the attractor-react npm package
// Usage:
//   import { AttractorCanvas, AttractorPanel, getSystem, systems } from "attractor-react";
//   // or (CJS): const { AttractorCanvas, AttractorPanel } = require("attractor-react");

export { AttractorCanvas } from "./lib/components/AttractorCanvas";
export { AttractorPanel } from "./lib/components/AttractorPanel";
export { getSystem, systems } from "./lib/systems";
export type {
  AttractorLimits,
  AttractorParams,
  AttractorSystem,
  EqFn,
  Vector3,
} from "./lib/systems";
