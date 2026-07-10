// Barrel export for the attractor-react npm package
// Usage:
//   import { AttractorCanvas, AttractorPanel, getSystem, systems } from "attractor-react";
//   // or (CJS): const { AttractorCanvas, AttractorPanel } = require("attractor-react");

export { AttractorCanvas } from "./components/AttractorCanvas";
export { AttractorPanel } from "./components/AttractorPanel";
export { getSystem, systems } from "./systems";
export type {
  AttractorLimits,
  AttractorParams,
  AttractorSystem,
  EqFn,
  Vector3,
} from "./systems";
