# strange-attractorz

An interactive 3D visualization of **28 strange chaotic attractor systems** — a reusable React component library built with Three.js and TypeScript. Also serves as the reference application for the original Python port [vdesdm/attractors](https://github.com/vdesdm/attractors).

[![npm version](https://img.shields.io/npm/v/strange-attractorz.svg)](https://www.npmjs.com/package/strange-attractorz)
![npm](https://img.shields.io/npm/dw/strange-attractorz)
![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Three.js r175](https://img.shields.io/badge/Three.js-r175-6e40e9?logo=threejs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## Table of Contents

- [strange-attractorz](#strange-attractorz)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [As an npm package](#as-an-npm-package)
    - [As a local project](#as-a-local-project)
    - [Production build](#production-build)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Basic setup](#basic-setup)
    - [Full control example](#full-control example)
    - [Custom background color](#custom-background-color)
    - [Capturing a screenshot / wallpaper](#capturing-a-screenshot--wallpaper)
    - [Navigating the interface](#navigating-the-interface)
    - [Interacting with the 3D scene](#interacting-with-the-3d-scene)
  - [What is a strange attractor?](#what-is-a-strange-attractor)
  - [Features](#features)
  - [The 28 Attractor Systems](#the-28-attractor-systems)
    - [Classic / Foundational](#classic--foundational)
    - [Physical / Thermodynamic](#physical--thermodynamic)
    - [Engineering / Electronics](#engineering--electronics)
    - [Mathematical Curiosities](#mathematical-curiosities)
    - [Economic / Financial](#economic--financial)
    - [Four-Wing / Multi-Wing Attractors](#four-wing--multi-wing-attractors)
    - [Parameter Space Surprises](#parameter-space-surprises)
  - [System Equations Reference](#system-equations-reference)
  - [Parameters \& Ranges](#parameters--ranges)
  - [API Reference](#api-reference)
    - [`<AttractorCanvas>`](#attractorcanvas)
    - [`<AttractorPanel>`](#attractordrpanel)
    - [Utility Exports](#utility-exports)
    - [`AttractorSystem` Type](#attractorsystem-type)
  - [Extending: Adding Your Own Attractor](#extending-adding-your-own-attractor)
  - [Architecture](#architecture)
    - [Data layer: `src/systems.ts`](#data-layer-srctemsts)
    - [Integration engine: `src/integrate.ts`](#integration-enginesrcintegratedts)
    - [Rendering pipeline: `src/components/AttractorCanvas.tsx`](#rendering-pipeline-srccomponentsattractorcanvastx)
    - [UI layer: `src/components/AttractorPanel.tsx`](#ui-layer-srccomponentsattractorpaneltsx)
  - [Performance](#performance)
    - [Tuning for performance](#tuning-for-performance)
    - [Hardware recommendations](#hardware-recommendations)
  - [Technical Decisions](#technical-decisions)
  - [Acknowledgements](#acknowledgements)

---

## Installation

### As an npm package

```bash
npm install strange-attractorz react react-dom
# or
pnpm add strange-attractorz react react-dom
# or
yarn add strange-attractorz react react-dom
```

Requires **React 19** as a peer dependency.

```tsx
import { AttractorCanvas, AttractorPanel, getSystem, systems } from "strange-attractorz";
import "strange-attractorz/styles.css";
import { useState } from "react";

export default function App() {
  const [params, setParams] = useState([10, 28, 8 / 3]);

  return (
    <>
      <AttractorCanvas
        system={getSystem("lorenz")}
        params={params}
      />
      <AttractorPanel
        system={getSystem("lorenz")}
        selectedId="lorenz"
        systems={systems}
        params={params}
        onParamChange={(i, v) => { const p = [...params]; p[i] = v; setParams(p); }}
        onReset={() => { /* handle reset */ }}
      />
    </>
  );
}
```

### As a local project

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/strange-attractors.git
cd strange-attractors

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

The dev server starts on `http://localhost:5173` by default. It hot-reloads on every file save — edit a system equation, save, and the browser updates instantly.

### Production build

```bash
pnpm build
```

Outputs to `dist/`. Serve with any static file server:

```bash
pnpm preview   # uses Vite's built-in production server
# or:
npx serve dist
```

---

## Quick Start

1. Open `http://localhost:5173`
2. You see a **Lorenz attractor** rendering — two intertwined spiral lobes, colored in a rainbow gradient
3. The attractor is **already being integrated** — new points are added every frame
4. The panel on the left shows controls

### First launch

| Step | Action | Result |
| --- | --- | --- |
| 1 | Select a system from the dropdown | Camera reframes, trajectory resets |
| 2 | Drag a parameter slider | Trajectory morphs smoothly to new shape |
| 3 | Toggle auto-rotate | Camera orbits the attractor |
| 4 | Click Reset | Clears point cloud, restarts from initial conditions |

### Navigating the interface

**System selector (top of panel):**
The dropdown lists all 28 systems alphabetically. Selecting a different system resets the trajectory, reframes the camera to the new system's axis limits, and clears the old point cloud.

**Parameter sliders — one per ODE parameter:**
Each slider corresponds to a parameter in the ODE. The label shows the parameter name (e.g., "σ (sigma)"). Dragging a slider:
- Changes the ODE coefficients _immediately_
- The trajectory smoothly morphs from its current shape to the new one
- No discontinuity — the trajectory continues from its current point

**Display controls:**
- **Color speed** — How fast the rainbow cycles through the color wheel. Low = subtle shifts; High = vivid, rapidly-changing gradients.
- **Point size** — Adjusts the rendered size of each point. Larger = fuller but may obscure fine structure. Smaller = more detail but may look sparse.
- **Steps per frame** — How many integration steps are computed per animation frame. Low (1–50) = smooth but builds slowly. High (200–1000) = fills fast but may stutter on slow hardware.

**Reset button:**
Clears the point cloud and restarts the simulation from the system's initial coordinates with the current parameter values.

### Interacting with the 3D scene

| Gesture | Action |
| --- | --- |
| Left-click + drag | Rotate the camera |
| Scroll wheel | Zoom in / out |
| Right-click + drag | Pan the camera |

The camera uses **damped orbit controls** — when you release the mouse, the rotation smoothly decelerates rather than stopping instantly.

### Adjusting parameters in real time

The parameter adjustment is the core interactive feature:

1. **You drag a slider** — e.g., the Lorenz `ρ (rho)` parameter from 28 to 10
2. **React state updates** — `setParams` is called with the new array
3. **Config object is updated** — A `useEffect` writes the new params into the shared `config` object that the animation loop reads from
4. **Next animation frame** — The `continueIntegrate()` call picks up the new parameter values
5. **New trajectory branches** — The ODE solver continues from the _current_ trajectory point with the new equations — the result is a smooth morphing, not an abrupt jump
6. **Visual feedback** — Newly added points trace the new attractor shape while old points retain their original colors

**Try this experiment:**

1. Select Lorenz, let the attractor build up to ~200K points
2. Slowly increase `ρ (rho)` from 28 to 30
3. Watch the butterfly wings spread apart
4. Slowly decrease `σ (sigma)` from 10 to 5
5. Watch the trajectory transition from chaotic to convergent
6. Click Reset to return to the canonical Lorenz shape

---

## What is a strange attractor?

A **strange attractor** is a set of values (a _trajectory_) toward which a dynamical system evolves, in a state space whose geometry is _fractal_. The systems studied here are defined by **ordinary differential equations (ODEs)** — systems of first-order equations of the form:

```
dx/dt = f(x, y, z, params)
dy/dt = g(x, y, z, params)
dz/dt = h(x, y, z, params)
```

where `x, y, z` are the three state variables (coordinates in 3D phase space) and `params` is a vector of real-valued constants specific to each system.

When you start a simulation from a point near the attractor, the trajectory spirals and folds in a way that never repeats and never settles — it _chaotically_ wanders within a bounded region. The result is a shape that looks like a cosmic sculpture.

The best-known example is the **Lorenz attractor**, discovered by Edward Lorenz in 1963 while studying atmospheric convection. It is the system that popularized the term "butterfly effect."

## Features

| Feature | Details |
| --- | --- |
| **28 systems** | Lorenz, Rössler, Chen, Thomas, Halvorsen, Nose-Hoover, Sakarya, Burke-Shaw, Rucklidge, Moore-Spiegel, Dequan Li, Langford, Dadras, Hadley, Chen-Lee, Shimizu-Morioka, Chen-Lu, Yu-Wang, Wang-Sun, Finance, Lotka-Volterra, Bouali Type 1/2/3, Newton-Leipnik, Rikitake, Rabinovich-Fabrikant, Three-Cell-CNN |
| **Real-time RK4 integration** | Fourth-order Runge-Kutta with O(dt⁵) local error |
| **Custom GLSL shaders** | Soft-edged circular points, per-point size attenuation, additive blending, HSL color mapping |
| **Orbit camera** | Mouse drag to rotate, scroll to zoom, right-drag to pan — Three.js `OrbitControls` |
| **Auto-rotate** | Toggle smooth 360° camera orbiting |
| **26+ parameter sliders** | Every attractor exposes its parameters as sliders with min/max bounds; changing a slider immediately changes the trajectory |
| **Configurable rendering** | Steps per frame (speed vs. smoothness tradeoff), color speed (rainbow cycle rate), point size |
| **Reset** | Instantly restarts the trajectory from the system's initial conditions |
| **Fully typed** | Zero `any` — TypeScript enforces correctness across the entire codebase |
| **No build-time framework overhead** | Vite + React (no Next.js, no R3F) — lean bundle, instant dev server |

---

## The 28 Attractor Systems

Each system is a tuple `(name, equations, parameters, initial state)` — and they fall into several families:

### Classic / Foundational

| System | Year | Equations (default params) | Visual Character |
| --- | --- | --- | --- |
| **Lorenz** | 1963 | `dx = σ(y-x)`, `dy = x(ρ-z)-y`, `dz = xy-βz` | Two-lobed "butterfly" |
| **Rössler** | 1976 | `dx = -(y+z)`, `dy = x+ay`, `dz = b+z(x-c)` | Single-loop tapestry |
| **Chen** | 1999 | `dx = a(y-x)`, `dy = (c-a)x-xz+cy`, `dz = xy-bz` | Twin-scroll, like Lorenz but topologically different |
| **Thomas** | 1999 | `dx = sin(y)-bx`, `dy = sin(z)-by`, `dz = sin(x)-bz` | Symmetric toroidal knot |

### Physical / Thermodynamic

| System | Year | Equations (default params) | Visual Character |
| --- | --- | --- | --- |
| **Halvorsen** | 2002 | `dx = -ax-4y-4z-y²`, `dy = -ay-4z-4x-z²`, `dz = -az-4x-4y-x²` | Spherical symmetric cluster |
| **Nose-Hoover** | 1989 | `dx = ay`, `dy = -x+yz`, `dz = 1-y²` | Curving double-wing |

### Engineering / Electronics

| System | Year | Equations (default params) | Visual Character |
| --- | --- | --- | --- |
| **Burke-Shaw** | 1981 | `dx = -s(x+y)`, `dy = -y-sxz`, `dz = sxy+v` | Compact double-scroll |
| **Sakarya** | 2008 | `dx = -x+y+yz`, `dy = -x-y+axy`, `dz = z-bxy` | Twisted loop |
| **Moore-Spiegel** | 1978 | `dx = y`, `dy = z`, `dz = -z-(t-r(1-x²))z-tx` | Chaotic oscillator |
| **Rikitake** | 1958 | `dx = -αx-zy+βz²`, `dy = -βz²`, `dz = y-ξz` | Dynamo model |
| **Three-Cell-CNN** | 2003 | `dx = a(y-h(x))`, `dy = x-y+z`, `dz = -by-cx+d(x+2y-x(z))` | Cellular network chaos |

### Mathematical Curiosities

| System | Year | Equations (default params) | Visual Character |
| --- | --- | --- | --- |
| **Rucklidge** | 1992 | `dx = -kx+αy-yz`, `dy = x`, `dz = -z+y²` | Double convection model; four-wing patterns at k=2, α=6.7 |
| **Langford** | 1979 | `dx = (z-β)x-ωy`, `dy = ωx+(z-β)y`, `dz = λ+αz-z³/3-(x²+y²)(1+ρz)+εzx³` | Complex multi-wing |
| **Dequan Li** | 2008 | `dx = a(y-x)+dxz`, `dy = kx+fy-xz`, `dz = cz+xy-ex²` | Six-scroll chaotic attractor; six parameters |
| **Shimizu-Morioka** | 1980 | `dx = y`, `dy = x-ax-xz`, `dz = -βz+x²` | Bifurcation of symmetric limit cycle |

### Economic / Financial

| System | Year | Equations (default params) | Visual Character |
| --- | --- | --- | --- |
| **Finance** | 2007 | `dx = (1/β-α)xy+z`, `dy = -by-x²`, `dz = -x-cz` | Financial chaos model |
| **Lotka-Volterra** | 1999 | `dx = x-xy+cx²-azx²`, `dy = -y+xy`, `dz = -bz+azx²` | Predator-prey extension |

### Four-Wing / Multi-Wing Attractors

| System | Year | Notes |
| --- | --- | --- |
| **Yu-Wang** | 2012 | "Fully qualified four-wing type"; uses `exp(x·y)` nonlinearity |
| **Wang-Sun** | 2009 | Three-dimensional four-wing attractor |

### Parameter Space Surprises

| System | Year | Notes |
| --- | --- | --- |
| **Dadras** | 2009 | `dx = y-ax+byz`, `dy = cy-xz+z`, `dz = dxy-hz` — generates two, three, and four-scroll attractors depending on parameters |
| **Hadley** | 2013 | `dx = -y²-z²-a(x-f)`, `dy = xy-bxz-y+g`, `dz = bxy+(x-1)z` — multi-wing convection |
| **Chen-Lee** | 2004 | `dx = ax-yz`, `dy = by+xz`, `dz = cz+xy/3` — anti-control of chaos in rigid body motion |
| **Chen-Lu** | 2002 | `dx = a(y-x)`, `dy = -xz+cy`, `dz = xy-bz` — a "new" chaotic attractor between Lorenz and Chen |
| **Bouali Type 1/2/3** | 2013 | Circuit-based chaotic oscillators with different feedback configurations |
| **Newton-Leipnik** | 1988 | `dx = (ay-ux)/(1-y²)`, `dy = (ax+uy)/(1-y²)` — double-scroll oscillator |
| **Rabinovich-Fabrikant** | 1979 | Classic model of nonlinear waves in active media |

---

## System Equations Reference

Below are the complete ODEs for every system. Each equation is `dx/dt = ...`, `dy/dt = ...`, `dz/dt = ...`.

**Lorenz**:

```
dx/dt = σ · (y - x)
dy/dt = x · (ρ - z) - y
dz/dt = x · y - β · z
```

**Rössler**:

```
dx/dt = -(y + z)
dy/dt = x + a · y
dz/dt = b + z · (x - c)
```

**Chen**:

```
dx/dt = a · (y - x)
dy/dt = (c - a) · x - x · z + c · y
dz/dt = x · y - b · z
```

**Thomas**:

```
dx/dt = sin(y) - b · x
dy/dt = sin(z) - b · y
dz/dt = sin(x) - b · z
```

**Halvorsen**:

```
dx/dt = -a · x - 4y - 4z - y²
dy/dt = -a · y - 4z - 4x - z²
dz/dt = -a · z - 4x - 4y - x²
```

**Nose-Hoover**:

```
dx/dt = a · y
dy/dt = -x + y · z
dz/dt = 1 - y²
```

**Sakarya**:

```
dx/dt = -x + y + y · z
dy/dt = -x - y + a · x · z
dz/dt = z - b · x · y
```

**Burke-Shaw**:

```
dx/dt = -s · (x + y)
dy/dt = -y - s · x · z
dz/dt = s · x · y + v
```

**Rucklidge**:

```
dx/dt = -k · x + α · y - y · z
dy/dt = x
dz/dt = -z + y²
```

**Moore-Spiegel**:

```
dx/dt = y
dy/dt = z
dz/dt = -z - (t - r · (1 - x²)) · y - t · x
```

**Dequan Li**:

```
dx/dt = a · (y - x) + d · x · z
dy/dt = k · x + f · y - x · z
dz/dt = c · z + x · y - e · x²
```

**Langford**:

```
dx/dt = (z - β) · x - ω · y
dy/dt = ω · x + (z - β) · y
dz/dt = λ + α · z - z³/3 - (x² + y²) · (1 + ρ · z) + ε · z · x³
```

**Dadras**:

```
dx/dt = y - a · x + b · y · z
dy/dt = c · y - x · z + z
dz/dt = d · x · y - h · z
```

**Hadley**:

```
dx/dt = -y² - z² - a · (x - f)
dy/dt = x · y - b · x · z - y + g
dz/dt = b · x · y + z · (x - 1)
```

**Chen-Lee**:

```
dx/dt = a · x - y · z
dy/dt = b · y + x · z
dz/dt = c · z + x · y / 3
```

**Shimizu-Morioka**:

```
dx/dt = y
dy/dt = x - a · y - x · z
dz/dt = -B · z + x²
```

**Chen-Lu**:

```
dx/dt = a · (y - x)
dy/dt = -x · z + b · y
dz/dt = x · y - c · z
```

**Yu-Wang**:

```
dx/dt = a · (y - x)
dy/dt = b · x - c · x · z
dz/dt = exp(x · y) - d · z
```

**Wang-Sun**:

```
dx/dt = a · x + c · y · z
dy/dt = b · x + d · y - x · z
dz/dt = e · z + f · x · y
```

**Finance**:

```
dx/dt = (1/b - a) · x + x · y + z
dy/dt = -b · y - x²
dz/dt = -x - c · z
```

**Lotka-Volterra**:

```
dx/dt = x - x·y + c·x² - a·z·x²
dy/dt = -y + x·y
dz/dt = -b·z + a·z·x²
```

**Bouali Type 1**:

```
dx/dt = -a · x + a · (y - z)
dy/dt = -x - y + d · y · z
dz/dt = -b · z + x · y
```

**Bouali Type 2**:

```
dx/dt = a · (y - x)
dy/dt = c · x - x · z
dz/dt = x · y - b · z
```

**Bouali Type 3**:

```
dx/dt = -a · x + y - z
dy/dt = x + b · y - z
dz/dt = -y - c · z
```

**Newton-Leipnik**:

```
dx/dt = (a · y - u · x) / (1 - y²)
dy/dt = (a · x + u · y) / (1 - y²)
```

**Rabitnovich-Fabrikant**:

```
dx/dt = y · (z - 1 + x²) + γ · z
dy/dt = z · (bx - y + z)
dz/dt = x · (y - xz - 1)
```

**Three-Cell-CNN**:

```
dx/dt = a · (y - h(x))
dy/dt = x - y + z
dz/dt = -b · y - c · x + d · (x + 2y - x(z))
```

---

## Parameters & Ranges

| System | Parameters | Default Values | Min | Max |
| --- | --- | --- | --- | --- |
| **Lorenz** | σ, ρ, β | 10, 28, 8/3 | 0–50 | 0–100 |
| **Rössler** | a, b, c | 0.2, 0.2, 5.7 | -10–10 | -10–10 |
| **Chen** | a, b, c | 35, 3, 28 | 0–50 | 0–50 |
| **Thomas** | b | 0.2081 | 0 | 2 |
| **Halvorsen** | a | 0.2 | 0 | 5 |
| **Nose-Hoover** | a | 0.5 | 0 | 10 |
| **Burke-Shaw** | s, v | 20, 10 | 0–50 | 0–50 |
| **Rucklidge** | k, α | 2, 6.7 | 0–10 | 0–10 |
| **Sakarya** | a, b | 2, 2 | 0–10 | 0–10 |
| **Moore-Spiegel** | r, t | 1.5, 0.6 | 0–5 | 0–5 |
| **Dequan Li** | a, d, k, f, c, e | 1, 1.2, 0.3, 1.8, 1.2, 0.5 | -20–20 | -20–20 |
| **Langford** | β, ω, λ, α, ρ, ε | 0.5, 0.8, 1.8, 0.2, 0, 0.02 | Vary by param | Vary by param |
| **Dadras** | a, b, c, d, h | 1.6, 1.6, 2.7, 2.7, 1.45 | 0–10 | 0–10 |
| **Hadley** | a, b, f, g | 2, 2, 10, 10 | 0–20 | 0–20 |
| **Chen-Lee** | a, b, c | 1, 3, -3.1 | -10–10 | -10–10 |
| **Shimizu-Morioka** | a, B | 1, 14 | 0–20 | 0–20 |
| **Chen-Lu** | a, b, c | 10, 2.5, 1.5 | 0–50 | 0–50 |
| **Yu-Wang** | a, b, c, d | 1, 2, 0.1, 1 | -10–10 | -10–10 |
| **Wang-Sun** | a, b, c, d, e, f | 4, 6, 4, 5, -2, 1 | -20–20 | -20–20 |
| **Finance** | a, b, c | 0.1, 1, 1 | 0–1 | 0–1 |
| **Lotka-Volterra** | a, c, b | 1, 0.2, 0.4 | 0–5 | 0–5 |
| **Bouali Type 1** | a, b, d, f | 5, 0.05, 0.02, 1 | 0–10 | 0–10 |
| **Bouali Type 2** | a, b, c | 5, 1, 5 | 0–10 | 0–10 |
| **Bouali Type 3** | a, b, c | 5, 1, 20 | 0–50 | 0–50 |
| **Newton-Leipnik** | a, u | 0.375, 0.25 | 0–1 | 0–1 |
| **Rikitake** | α, β, ξ | 1.5, 2, 0.6 | 0–10 | 0–10 |
| **Rabinovich-Fabrikant** | a, b, γ | 1, 1.1, -1.1 | -5–5 | -5–5 |
| **Three-Cell-CNN** | a, b, c, d | 2, 1, 1, 1.25 | 0–5 | 0–5 |

---

## Architecture

### Data layer: `src/systems.ts`

The single source of truth. Each attractor system is a typed object:

```typescript
interface AttractorSystem {
  id: string;           // e.g. "lorenz"
  name: string;         // e.g. "Lorenz (1963)"
  equation: EqFn;       // (x, y, z, params) => [dx, dy, dz]
  params: {
    defaults: number[];  // e.g. [10, 28, 8/3]
    names: string[];     // e.g. ["σ (sigma)", "ρ (rho)", "β (beta)"]
    min: number[];       // Slider minimums
    max: number[];       // Slider maximums
  };
  initCoord: [number, number, number];
  limits?: { xlim?: [number, number]; ylim?: [number, number]; zlim?: [number, number] };
}
```

- **~650 lines** — all 28 system definitions, equation functions, type definitions, and the `systems` array
- `EqFn` is a function type: `(x: number, y: number, z: number, params: number[]) => [number, number, number]`
- The `wrap()` function converts a raw `EqFn` into the expected equation signature, binding the parameter vector
- The `systems` array is exported as a const, providing both the full list and the type inference for the UI

### Integration engine: `src/integrate.ts`

Two core functions:

**`integrate(system, steps, dt, paramsOverride?)`**
Computes the initial trajectory from scratch using RK4 (Runge-Kutta 4th order).

- **Input:** system definition, number of steps (typically 50,000 for initial render), time step (always 0.005), optional parameter override
- **Output:** `Float32Array` of length `steps × 3`, flat-encoded as `[x₀, y₀, z₀, x₁, y₁, z₁, ...]`

**`continueIntegrate(system, lastState, steps, dt, paramsOverride?)`**
Resumes integration from a given state — used for the animation loop.

- **Input:** system, last state `[x, y, z]`, number of steps, time step, optional parameters
- **Output:** `{ data: Float32Array, lastState: [number, number, number] }`

### Rendering pipeline: `src/components/AttractorCanvas.tsx`

The most complex component (~200 lines). Manages the entire Three.js lifecycle:

1. **Initialization:** Creates `WebGLRenderer`, `PerspectiveCamera`, `Scene`
2. **Buffer allocation:** 20 MB of GPU memory — 6 MB positions + 6 MB colors + 8 MB sizes for up to 2M points
3. **Shader pipeline:** Custom vertex + fragment shaders for soft-edged circular points with depth attenuation
4. **Animation loop:** `requestAnimationFrame` → integrate → update buffer attributes → render
5. **OrbitControls:** Damped rotation, scroll-to-zoom, right-drag-to-pan
6. **Resize handling:** `ResizeObserver` updates renderer and camera on window resize
7. **Cleanup:** Disposes all Three.js resources on unmount

**Custom GLSL Shaders:**

```glsl
// Vertex shader (key lines)
gl_PointSize = aSize * (300.0 / vDepth); // Depth-attenuated point size
gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);

// Fragment shader (key lines)
vec4 texColor = texture2D(t2D, vec2(dot(co, vec2(0.25, 0.75)) * 2.0, 0.5));
if (texColor.a < 0.1) discard;             // Discard transparent pixels
gl_FragColor = vec4(mix(vec3(0.0), texColor.rgb, aColor), 1.0);
```

### UI layer: `src/components/AttractorPanel.tsx`

The floating control panel. Key sections:

- **System selector** — dropdown populated from `systems` array
- **Parameter sliders** — auto-generated from `system.params`, one per parameter
- **Display controls** — steps per frame, color speed, point size, auto-rotate
- **Reset button** — triggers trajectory restart

**Styling:** Frosted glass panel: `rgba(10, 10, 20, 0.85)` with `backdrop-filter: blur(12px)`. Width: 280px, positioned absolute at top-left.

---

## API Reference

### `<AttractorCanvas>`

The 3D rendering component. Renders the attractor trajectory as a point cloud in a Three.js WebGL context.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `system` | `AttractorSystem` | — | The attractor system to render |
| `params` | `number[]` | `system.params.defaults` | Parameter values for the ODE |
| `stepsPerFrame` | `number` | `50` | Integration steps computed per animation frame |
| `colorSpeed` | `number` | `1` | Rainbow color cycle speed multiplier |
| `pointSize` | `number` | `1.5` | Base size of rendered points (subject to depth attenuation) |
| `speed` | `number` | `0.5` | Simulation speed multiplier |
| `autoRotate` | `boolean` | `true` | Whether the camera auto-orbits |
| `resetKey` | `number` | `0` | Increment to trigger a reset |
| `backgroundColor` | `string` | `'#000000'` | Canvas background color |
| `onSceneReady` | `(data: SceneData) => void` | — | Callback with `{ camera, renderer, scene }` for screenshots |

**Internal behavior:**

- Allocates 20 MB of GPU memory (6 MB positions + 6 MB colors + 8 MB sizes for 2M points)
- Uses `ResizeObserver` for responsive layout
- Runs `requestAnimationFrame` for the render loop
- Disposes all Three.js resources on unmount
- Maximum point count: **2,000,000** (hard cap — draw range caps at this)

### `<AttractorPanel>`

The floating control panel. Provides the UI for all configuration.

| Prop | Type | Description |
| --- | --- | --- |
| `system` | `AttractorSystem` | Current attractor system |
| `selectedId` | `string` | Currently selected system ID |
| `systems` | `AttractorSystem[]` | All available systems (for the dropdown) |
| `params` | `number[]` | Current parameter values |
| `stepsPerFrame` | `number` | Current integration speed |
| `colorSpeed` | `number` | Current color speed |
| `pointSize` | `number` | Current point size |
| `speed` | `number` | Current simulation speed |
| `autoRotate` | `boolean` | Current auto-rotate state |
| `backgroundColor` | `string` | Current background color |
| `resetAfter` | `number` | Auto-reset after N ms (0 = disabled) |
| `mobileOpen` | `boolean` | Mobile panel visibility |
| `onStepsChange` | `(value: number) => void` | Callback for steps per frame slider |
| `onColorSpeedChange` | `(value: number) => void` | Callback for color speed slider |
| `onPointSizeChange` | `(value: number) => void` | Callback for point size slider |
| `onSpeedChange` | `(value: number) => void` | Callback for speed slider |
| `onAutoRotateChange` | `(value: boolean) => void` | Callback for auto-rotate checkbox |
| `onBackgroundColorChange` | `(value: string) => void` | Callback for background color |
| `onReset` | `() => void` | Callback for reset button |
| `onResetAfterChange` | `(value: number) => void` | Callback for auto-reset timer |
| `onSystemChange` | `(id: string) => void` | Callback when system is changed |
| `onParamChange` | `(index: number, value: number) => void` | Callback when a parameter slider changes |
| `onShare` | `() => void` | Callback for share dialog |
| `onWallpaperDownload` | `() => void` | Callback for wallpaper download |
| `onCloseMobile` | `() => void` | Close mobile panel |

### Utility Exports

| Export | Signature | Description |
| --- | --- | --- |
| `getSystem` | `(id: string) => AttractorSystem \| undefined` | Looks up a system by ID |
| `systems` | `AttractorSystem[]` | Complete array of 28 `AttractorSystem` objects |

### `AttractorSystem` Type

```typescript
interface AttractorSystem {
  id: string;               // e.g. "lorenz"
  name: string;             // e.g. "Lorenz (1963)"
  equation: (state: Vector3, params: number[]) => Vector3;
  params: {
    defaults: number[];     // e.g. [10, 28, 8/3]
    names: string[];        // e.g. ["σ (sigma)", "ρ (rho)", "β (beta)"]
    min: number[];          // Slider minimums
    max: number[];          // Slider maximums
  };
  initCoord: [number, number, number]; // e.g. [0, 1, 0]
  limits?: {
    xlim?: [number, number];
    ylim?: [number, number];
    zlim?: [number, number];
  };
}
```

---

## Extending: Adding Your Own Attractor

To add a new attractor system:

**1. Define the equation function** in `src/systems.ts`:

```typescript
const myAttractor: EqFn = (x, y, z, p) => [
  p[0] * y - p[1] * x * z,  // dx/dt
  x * z - p[2] * y,          // dy/dt
  p[3] * x * y - p[4] * z,   // dz/dt
];
```

**2. Register the system** in the `systems` array:

```typescript
{
    id: "my_attractor",
    name: "My Attractor (2024)",
    equation: wrap(myAttractor),
    params: {
        defaults: [1, 2, 3, 4, 5],
        names: ["a", "b", "c", "d", "e"],
        min: [-10, -10, -10, -10, -10],
        max: [10, 10, 10, 10, 10],
    },
    initCoord: [0.1, 0.1, 0.1],
    limits: {
        xlim: [-5, 5],
        ylim: [-5, 5],
        zlim: [-5, 5],
    },
},
```

**3. Save and refresh** — the new system appears in the dropdown automatically. No other changes needed.

That's it. The `wrap()` function and the `systems` array handle the rest: registration, type-checking, slider generation, and rendering.

---

## Performance

| Metric | Value |
| --- | --- |
| Initial render time | ~50ms (50K steps + GPU buffer upload) |
| Memory usage | ~20 MB for 2M points (positions + colors + sizes) |
| GPU memory | ~44 MB (Float32Arrays + BufferGeometry) |
| Max points | 2,000,000 (hard cap — draw range caps at this) |
| Animation frame cost | ~0.5–5ms depending on `stepsPerFrame` |
| Bundle size (prod) | ~342 KB JS (ESM) + ~209 KB JS (CJS) |

### Tuning for performance

**If the animation is choppy:**

1. Lower `stepsPerFrame` (try 10–20) — reduces per-frame integration load
2. Lower `pointSize` slightly — reduces GPU rasterization cost
3. Close other GPU-heavy applications — the canvas is a WebGL context

**If you want a denser/more detailed attractor:**

1. Raise `stepsPerFrame` (try 200–500) — the attractor builds faster
2. Wait for it to fill — the point cloud grows up to 2M points over time
3. The color gradient will become more continuous at higher point counts

**If the attractor looks sparse:**

1. The trajectory may be building slowly — increase `stepsPerFrame`
2. Or the system may genuinely have a sparse attractor — try switching systems to compare

### Hardware recommendations

| Platform | Minimum | Recommended |
| --- | --- | --- |
| GPU | Integrated graphics (Intel HD 630) | Dedicated GPU (NVIDIA GTX 1060+) |
| RAM | 4 GB | 8 GB+ |
| CPU | Any x86_64 | Any modern CPU (integration is single-threaded) |

---

## Technical Decisions

**Why raw Three.js instead of React Three Fiber?**
React Three Fiber adds ~100 KB to the bundle and an extra abstraction layer. For this project — a single full-screen canvas with no complex scene hierarchy — raw Three.js is simpler, faster, and gives more control over the shader pipeline.

**Why custom GLSL shaders?**
The default `Points` material renders square pixels. Custom shaders let us:
- Render soft-edged circles (fragment shader checks distance from point center)
- Depth-attenuate point sizes (vertex shader divides by camera distance)
- Use additive blending for the characteristic "glowing" attractor look
- Control per-point color with a custom `aColor` attribute

**Why a mutable shared `config` object instead of React state for the animation loop?**
The animation loop runs at `requestAnimationFrame` speed (~60fps), independent of React's render cycle. Using a mutable object with known fields is simpler and more efficient than React state updates (which trigger re-renders). The animation loop reads from `config` directly on each frame.

**Why RK4 instead of Euler?**
Euler integration (`xₙ₊₁ = xₙ + f(xₙ) · dt`) accumulates error rapidly and can send the trajectory spiraling off to infinity even when the true solution is bounded. RK4 gives O(dt⁵) local error, keeping trajectories accurate even with `dt = 0.005`. For chaotic systems — which are extremely sensitive to initial conditions — numerical accuracy is critical.

**Why JavaScript instead of WebAssembly?**
The attractor systems are simple ODEs — no complex linear algebra, no matrix operations. The per-step cost is a handful of multiply-add operations. JavaScript V8 (Chrome/Edge) or SpiderMonkey (Firefox) handles this easily at 60fps. WebAssembly would add build complexity for negligible gain.

**Why HSL for color mapping?**
HSL gives a smooth, predictable rainbow that covers the full color spectrum. Converting from HSL to RGB in JavaScript per-frame is cheap (~10 operations). Alternative approaches — mapping by position (coloring by x, y, or z coordinate), or by velocity magnitude — also work but HSL produces the most visually striking result.

---

## Acknowledgements

Mathematical models ported from [vdesdm/attractors](https://github.com/vdesdm/attractors) by vdesdm.

Numerical integration method: Classical 4th-order Runge-Kutta (Leo Fox & George B. Dantzig, 1927).

Inspired by the beautiful work of:

- **Edward Lorenz** (1963) — deterministic nonperiodic flow
- **Otto Rössler** (1976) — continuous chaos
- **Guanrong Chen** (1999) — the Chen attractor
- **J.C. Sprott** — [Chaos and Time Series Analysis](https://sprott.physics.wisc.edu/chaos/) (2003)

Rendering built with:

- **Three.js** — [threejs.org](https://threejs.org)
- **Vite** — [vitejs.dev](https://vitejs.dev)
- **React 19** — [react.dev](https://react.dev)
- **TypeScript** — [typescriptlang.org](https://typescriptlang.org)
