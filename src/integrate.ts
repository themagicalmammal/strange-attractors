import type { Vector3 } from "./systems";
import type { AttractorSystem } from "./systems";

type EqFn = (state: Vector3, params: number[]) => Vector3;

/**
 * Runge-Kutta 4th-order integrator.
 * Advances a single state vector by one step of size dt.
 */
function rk4Step(
  eq: EqFn,
  state: Vector3,
  params: number[],
  dt: number,
): Vector3 {
  const k1 = eq(state, params);
  const k1s: Vector3 = [k1[0] * dt, k1[1] * dt, k1[2] * dt];

  const state2: Vector3 = [
    state[0] + k1s[0] / 2,
    state[1] + k1s[1] / 2,
    state[2] + k1s[2] / 2,
  ];
  const k2 = eq(state2, params);
  const k2s: Vector3 = [k2[0] * dt, k2[1] * dt, k2[2] * dt];

  const state3: Vector3 = [
    state[0] + k2s[0] / 2,
    state[1] + k2s[1] / 2,
    state[2] + k2s[2] / 2,
  ];
  const k3 = eq(state3, params);
  const k3s: Vector3 = [k3[0] * dt, k3[1] * dt, k3[2] * dt];

  const state4: Vector3 = [
    state[0] + k3s[0],
    state[1] + k3s[1],
    state[2] + k3s[2],
  ];
  const k4 = eq(state4, params);
  const k4s: Vector3 = [k4[0] * dt, k4[1] * dt, k4[2] * dt];

  return [
    state[0] + (k1s[0] + 2 * k2s[0] + 2 * k3s[0] + k4s[0]) / 6,
    state[1] + (k1s[1] + 2 * k2s[1] + 2 * k3s[1] + k4s[1]) / 6,
    state[2] + (k1s[2] + 2 * k2s[2] + 2 * k3s[2] + k4s[2]) / 6,
  ];
}

/**
 * Integrate from `initCoord` for `steps` steps of size `dt`.
 * Returns a flat Float32Array of [x0,y0,z0, x1,y1,z1, ...].
 */
export function integrate(
  system: AttractorSystem,
  steps: number,
  dt: number,
  paramsOverride?: number[],
): Float32Array {
  const data = new Float32Array(steps * 3);
  let state: Vector3 = [...system.initCoord] as Vector3;
  const eq = system.equation;
  const params = paramsOverride ?? system.params.defaults;

  for (let i = 0; i < steps; i++) {
    state = rk4Step(eq, state, params, dt);
    const idx = i * 3;
    data[idx] = state[0];
    data[idx + 1] = state[1];
    data[idx + 2] = state[2];
  }
  return data;
}

/**
 * Continues a trajectory from existing data.
 * If `paramsOverride` is provided, uses it instead of system.params.defaults.
 * Returns the new points appended as a Float32Array.
 */
export function continueIntegrate(
  system: AttractorSystem,
  lastState: Vector3,
  steps: number,
  dt: number,
  paramsOverride?: number[],
): { data: Float32Array; lastState: Vector3 } {
  const data = new Float32Array(steps * 3);
  let state: Vector3 = [...lastState];
  const eq = system.equation;
  const params = paramsOverride ?? system.params.defaults;

  for (let i = 0; i < steps; i++) {
    state = rk4Step(eq, state, params, dt);
    const idx = i * 3;
    data[idx] = state[0];
    data[idx + 1] = state[1];
    data[idx + 2] = state[2];
  }
  return { data, lastState: state };
}
