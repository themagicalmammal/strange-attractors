# Strange Attractors

An interactive 3D visualization of **28 strange chaotic attractor systems** in the browser, built with React, Three.js, and TypeScript. A faithful port of the mathematical engine from [vdesmond/attractors](https://github.com/vdesmond/attractors) from Python + NumPy to pure JavaScript + Three.js — no WebAssembly, no Rust, no backend.

![screenshot](https://img.shields.io/badge/28+attractors-supported-00b4d8)
![screenshot](https://img.shields.io/badge/React-19-61dafb?logo=react)
![screenshot](https://img.shields.io/badge/Three.js-r175-6e40e9?logo=threejs)

## Table of Contents

- [Strange Attractors](#strange-attractors)
  - [Table of Contents](#table-of-contents)
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
  - [Architecture](#architecture)
    - [Data layer: `src/systems.ts`](#data-layer-srcsystemsts)
    - [Integration engine: `src/integrate.ts`](#integration-engine-srcintegratets)
    - [Rendering pipeline: `src/components/AttractorCanvas.tsx`](#rendering-pipeline-srccomponentsattractorcanvastsx)
    - [UI layer: `src/components/AttractorPanel.tsx`](#ui-layer-srccomponentsattractorpaneltsx)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
    - [Production build](#production-build)
  - [Usage](#usage)
    - [First launch](#first-launch)
    - [Navigating the interface](#navigating-the-interface)
    - [Interacting with the 3D scene](#interacting-with-the-3d-scene)
    - [Adjusting parameters in real time](#adjusting-parameters-in-real-time)
  - [API Reference](#api-reference)
    - [`<AttractorCanvas>`](#attractorcanvas)
    - [`<AttractorPanel>`](#attractorpanel)
    - [`integrate(system, steps, dt, paramsOverride?)`](#integratesystem-steps-dt-paramsoverride)
    - [`continueIntegrate(system, lastState, steps, dt, paramsOverride?)`](#continueintegratesystem-laststate-steps-dt-paramsoverride)
    - [`getSystem(id)`](#getsystemid)
    - [`systems` array](#systems-array)
  - [Extending: Adding Your Own Attractor](#extending-adding-your-own-attractor)
  - [Performance](#performance)
    - [Tuning for performance](#tuning-for-performance)
    - [Hardware recommendations](#hardware-recommendations)
  - [Technical Decisions](#technical-decisions)
  - [Acknowledgements](#acknowledgements)

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

| Feature                              | Details                                                                                                                                                                                                                                                                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **28 systems**                       | Lorenz, Rössler, Chen, Thomas, Halvorsen, Nose-Hoover, Sakarya, Burke-Shaw, Rucklidge, Moore-Spiegel, Dequan Li, Langford, Dadras, Hadley, Chen-Lee, Shimizu-Morioka, Chen-Lu, Yu-Wang, Wang-Sun, Finance, Lotka-Volterra, Bouali Type 1/2/3, Newton-Leipnik, Rikitake, Rabinovich-Fabrikant, Three-Cell-CNN |
| **Real-time RK4 integration**        | Fourth-order Runge-Kutta method computes each trajectory point with O(dt⁵) local error                                                                                                                                                                                                                       |
| **Custom GLSL shaders**              | Soft-edged circular points with per-point size attenuation, additive blending, and HSL color mapping                                                                                                                                                                                                         |
| **Orbit camera**                     | Mouse drag to rotate, scroll to zoom, right-drag to pan — powered by Three.js `OrbitControls`                                                                                                                                                                                                                |
| **Auto-rotate**                      | Toggle smooth 360° camera orbiting                                                                                                                                                                                                                                                                           |
| **26+ parameter sliders**            | Every attractor exposes its parameters as sliders with min/max bounds; changing a slider immediately changes the trajectory (no page reload)                                                                                                                                                                 |
| **Configurable rendering**           | Steps per frame (speed vs. smoothness tradeoff), color speed (rainbow cycle rate), point size                                                                                                                                                                                                                |
| **Reset**                            | Instantly restarts the trajectory from the system's initial conditions                                                                                                                                                                                                                                       |
| **Fully typed**                      | Zero `any` — TypeScript enforces correctness across the entire codebase                                                                                                                                                                                                                                      |
| **No build-time framework overhead** | Vite + React (no Next.js, no R3F) — the bundle is lean and the dev server is instant                                                                                                                                                                                                                         |

---

## The 28 Attractor Systems

Each system is a tuple `(name, equations, parameters, initial state)` — and they fall into several families:

### Classic / Foundational

| System      | Year | Equations (default params)                           | Visual Character                                     |
| ----------- | ---- | ---------------------------------------------------- | ---------------------------------------------------- |
| **Lorenz**  | 1963 | `dx = σ(y-x)`, `dy = x(ρ-z)-y`, `dz = xy-βz`         | Two-lobed "butterfly"                                |
| **Rössler** | 1976 | `dx = -(y+z)`, `dy = x+ay`, `dz = b+z(x-c)`          | Single-loop tapestry                                 |
| **Chen**    | 1999 | `dx = a(y-x)`, `dy = (c-a)x-xz+cy`, `dz = xy-bz`     | Twin-scroll, like Lorenz but topologically different |
| **Thomas**  | 1999 | `dx = sin(y)-bx`, `dy = sin(z)-by`, `dz = sin(x)-bz` | Symmetric toroidal knot                              |

### Physical / Thermodynamic

| System            | Year | Equations                                     | Context                                |
| ----------------- | ---- | --------------------------------------------- | -------------------------------------- |
| **Nose-Hoover**   | 1986 | `dx = ay`, `dy = -x+yz`, `dz = 1-y²`          | Molecular dynamics, canonical ensemble |
| **Moore-Spiegel** | 1966 | `dx = y`, `dy = z`, `dz = -z-(t-r(1-x²))y-tx` | Thermally excited nonlinear oscillator |

### Engineering / Electronics

| System             | Year | Equations                                                  | Context                             |
| ------------------ | ---- | ---------------------------------------------------------- | ----------------------------------- |
| **Sakarya**        | —    | `dx = -x+y+yz`, `dy = -x-y+axz`, `dz = z-bxy`              | Chaotic circuit                     |
| **Three-Cell-CNN** | —    | `dx = z`, `dy = z`, `dz = -ax-by+cz-dz³+ex²`               | Cellular neural network             |
| **Rikitake**       | 1958 | `dx = -ax-z`, `dy = x+ay`, `dz = y(z-b)`                   | Dynamo model, geomagnetic reversals |
| **Hadley**         | 2003 | `dx = -y²-z²-a(x-f)`, `dy = xy-bxz-y+g`, `dz = bxy+z(x-1)` | Atmospheric circulation model       |

### Mathematical Curiosities

| System                   | Year      | Notable Property                                                                                                            |
| ------------------------ | --------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Halvorsen**            | —         | Fully symmetric in x,y,z — the three equations are cyclic permutations                                                      |
| **Langford**             | 1984      | Torus bifurcation; extremely rich behavior for small parameter changes                                                      |
| **Newton-Leipnik**       | 1988      | `dx = -αx+y+βy(x²-1)`, `dy = -αy+x+βx(y²-1)`, `dz = -z/α` — a variant of the Lorenz equations with different nonlinearities |
| **Rabinovich-Fabrikant** | —         | Exhibits "chaotic oscillations" in nonlinear elasticity media                                                               |
| **Bouali Type 1/2/3**    | 2012-2013 | Three variants discovered in electronic analogue emulation of business cycles; Type 1 produces a distinctive stretched loop |

### Economic / Financial

| System             | Year | Equations                                           |
| ------------------ | ---- | --------------------------------------------------- |
| **Finance**        | 2007 | `dx = (1/b-a)x+xy+z`, `dy = -by-x²`, `dz = -x-cz`   |
| **Lotka-Volterra** | 1999 | `dx = x-xy+cx²-azx²`, `dy = -y+xy`, `dz = -bz+azx²` |

### Four-Wing / Multi-Wing Attractors

| System        | Year | Notes                                                             |
| ------------- | ---- | ----------------------------------------------------------------- |
| **Yu-Wang**   | 2012 | "Fully qualified four-wing type"; uses `exp(x·y)` nonlinearity    |
| **Wang-Sun**  | 2009 | Three-dimensional four-wing attractor                             |
| **Dequan Li** | 2008 | Three-scroll chaotic attractor; six parameters, large state space |

### Parameter Space Surprises

| System              | Year | Notes                                                                                                                          |
| ------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Burke-Shaw**      | 1981 | `dx = -s(x+y)`, `dy = -y-sxz`, `dz = sxy+v` — compact double-scroll                                                            |
| **Rucklidge**       | 1992 | `dx = -kx+αy-yz`, `dy = x`, `dz = -z+y²` — double convection model; produces beautiful four-wing patterns at k=2, α=6.7        |
| **Chen-Lee**        | 2004 | `dx = ax-yz`, `dy = by+xz`, `dz = cz+xy/3` — anti-control of chaos in rigid body motion                                        |
| **Chen-Lu**         | 2002 | `dx = a(y-x)`, `dy = -xz+cy`, `dz = xy-bz` — a "new" chaotic attractor that occupies a gap between the Lorenz and Chen systems |
| **Shimizu-Morioka** | 1980 | `dx = y`, `dy = x-ay-xz`, `dz = -az+x²` — bifurcation of symmetric limit cycle                                                 |
| **Dadras**          | 2009 | `dx = y-ax+byz`, `dy = cy-xz+z`, `dz = dxy-hz` — generates two, three, and four-scroll attractors depending on parameters      |

---

### System Equations Reference

Below are the complete ODEs for every system. Each equation is `dx/dt = ...`, `dy/dt = ...`, `dz/dt = ...`. The parameter names use the exact identifiers shown in the slider labels.

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
dx/dt = k·y + μ·x·(b - y²)
dy/dt = -x + p·z
dz/dt = q·x - s·y
```

**Bouali Type 2**:

```
dx/dt = x·(a - y) + α·z
dy/dt = -y·(b - x²)
dz/dt = -x·(c - s·z) - β·z
```

**Bouali Type 3**:

```
dx/dt = α·x·(1 - y) - β·z
dy/dt = -γ·y·(1 - x²)
dz/dt = μ·x
```

**Newton-Leipnik**:

```
dx/dt = -α·x + y + β·y·(x² - 1)
dy/dt = -α·y + x + β·x·(y² - 1)
dz/dt = -z / α
```

**Rikitake**:

```
dx/dt = -a·x - z
dy/dt = x + a·y
dz/dt = y·(z - b)
```

**Rabinovich-Fabrikant**:

```
dx/dt = y·(z - 1 + x²) + α·x
dy/dt = x·(3z + 1 - x²) + α·y
dz/dt = -2z·(β + x·y)
```

**Three-Cell-CNN**:

```
dx/dt = z
dy/dt = z
dz/dt = -a·x - b·y + c·z - d·z³ + e·x²
```

### Parameters & Ranges

For each system below, the _default_ parameter values are the ones that produce the "canonical" attractor shape. The min/max values define the slider bounds and are chosen to keep the system in a chaotic regime.

| System               | Params (defaults → min → max)                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Lorenz               | σ: [10 → -10 → 50], ρ: [28 → 0 → 100], β: [2.67 → 0 → 50]                                                                       |
| Rössler              | a: [0.2 → -5 → 5], b: [0.2 → -5 → 5], c: [5.7 → -10 → 20]                                                                       |
| Chen                 | a: [35 → -10 → 100], b: [3 → -10 → 50], c: [28 → -10 → 100]                                                                     |
| Thomas               | b: [0.208 → -1 → 1]                                                                                                             |
| Halvorsen            | a: [1.89 → -10 → 10]                                                                                                            |
| Nose-Hoover          | a: [1 → -5 → 10]                                                                                                                |
| Sakarya              | a: [0.4 → -5 → 5], b: [0.3 → -5 → 5]                                                                                            |
| Burke-Shaw           | s: [10 → -10 → 30], v: [4.272 → -10 → 30]                                                                                       |
| Rucklidge            | k: [2 → -10 → 10], α: [6.7 → -10 → 20]                                                                                          |
| Moore-Spiegel        | t: [20 → -20 → 100], r: [100 → -100 → 500]                                                                                      |
| Dequan Li            | a: [40 → -100 → 200], c: [1.833 → -10 → 20], d: [0.16 → -1 → 1], e: [0.65 → -10 → 10], k: [55 → -50 → 200], f: [20 → -50 → 200] |
| Langford             | α: [0.95 → -10 → 10], β: [0.7 → -10 → 10], λ: [0.6 → -5 → 5], ω: [3.5 → -10 → 10], ρ: [0.25 → -2 → 2], ε: [0.1 → -5 → 5]        |
| Dadras               | a: [3 → -10 → 30], b: [2.7 → -10 → 30], c: [1.7 → -10 → 30], d: [2 → -10 → 30], h: [9 → -50 → 30]                               |
| Hadley               | a: [0.2 → -5 → 5], b: [4 → -10 → 10], f: [8 → -10 → 30], g: [1 → -5 → 5]                                                        |
| Chen-Lee             | a: [5 → -30 → 30], b: [-10 → -30 → 30], c: [-0.38 → -10 → 30]                                                                   |
| Shimizu-Morioka      | a: [0.45 → -2 → 5], B: [0.75 → -2 → 5]                                                                                          |
| Chen-Lu              | a: [36 → -30 → 100], b: [3 → -10 → 30], c: [17 → -50 → 100]                                                                     |
| Yu-Wang              | a: [10 → -20 → 50], b: [40 → -50 → 200], c: [2 → -10 → 30], d: [2.5 → -10 → 30]                                                 |
| Wang-Sun             | a: [0.2 → -3 → 3], b: [-0.01 → -3 → 3], c: [1 → -3 → 3], d: [-0.4 → -3 → 3], e: [-1 → -5 → 5], f: [-1 → -5 → 5]                 |
| Finance              | a: [1e-5 → -1 → 1], b: [0.1 → -10 → 10], c: [1 → -10 → 10]                                                                      |
| Lotka-Volterra       | a: [2.9851 → -5 → 10], b: [3 → -5 → 10], c: [2 → -10 → 10]                                                                      |
| Bouali Type 1        | k: [0.02 → -1 → 5], b: [0.2 → -5 → 5], μ: [0.4 → -5 → 5], p: [10 → -20 → 50], q: [0.1 → -1 → 5], s: [50 → -100 → 200]           |
| Bouali Type 2        | a: [4 → -10 → 10], b: [1 → -10 → 10], c: [1.4 → -10 → 10], s: [2.8 → -10 → 10], α: [1 → -10 → 10], β: [1 → -10 → 10]            |
| Bouali Type 3        | γ: [1 → -10 → 10], μ: [0.001 → -10 → 10], α: [3 → -10 → 10], β: [2.2 → -10 → 10]                                                |
| Newton-Leipnik       | α: [0.4 → -5 → 5], β: [0.175 → -5 → 5]                                                                                          |
| Rikitake             | a: [0.3 → -5 → 5], b: [1.5 → -5 → 5]                                                                                            |
| Rabinovich-Fabrikant | α: [0.43 → -3 → 3], β: [1.26 → -5 → 5]                                                                                          |
| Three-Cell-CNN       | a: [0 → -3 → 3], b: [1 → -3 → 3], c: [0 → -3 → 3], d: [1 → -3 → 3], e: [0.2 → -3 → 3]                                           |

---

## Architecture

The codebase is organized into four layers, each with a single responsibility:

```
attractor/
├── src/
│   ├── systems.ts              ← Mathematical model registry
│   ├── integrate.ts            ← RK4 integration engine
│   ├── components/
│   │   ├── AttractorCanvas.tsx  ← Three.js renderer (scene, buffers, shaders)
│   │   └── AttractorPanel.tsx   ← Control panel UI (sliders, dropdown, toggles)
│   ├── App.tsx                  ← App shell, state management
│   ├── main.tsx                 ← Entry point
│   └── index.css                ← Global styles
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Data layer: `src/systems.ts`

This file is the **source of truth** for all mathematical models. It exports:

- **`Vector3`** type — a 3-element tuple `[x, y, z]`
- **`AttractorSystem`** interface — the contract for every system
- **`systems`** array — a list of 28 fully-qualified attractor definitions
- **`getSystem(id)`** — lookup function
- **`systemIds`** — flat array of string IDs for iteration

Each `AttractorSystem` contains:

| Field       | Type                         | Purpose                                      |
| ----------- | ---------------------------- | -------------------------------------------- |
| `id`        | `string`                     | Unique slug (e.g. `"lorenz"`)                |
| `name`      | `string`                     | Display name (e.g. `"Lorenz (1963)"`)        |
| `equation`  | `(state, params) → Vector3`  | The ODE right-hand side `f(x,y,z, params)`   |
| `params`    | `AttractorParams`            | Default values, slider names, min/max bounds |
| `initCoord` | `Vector3`                    | Starting point in phase space                |
| `limits`    | `AttractorLimits` (optional) | Axis bounds for auto-framing the camera      |

The `equation` function takes a state vector `[x, y, z]` and parameter array `[p₀, p₁, ...]` and returns the derivatives `[dx/dt, dy/dt, dz/dt]`. The `wrap()` helper converts each raw equation `(x, y, z, p) → [...]` into the interface signature by destructuring the state tuple.

### Integration engine: `src/integrate.ts`

Two functions, both using the **classical fourth-order Runge-Kutta (RK4)** method:

**`integrate(system, steps, dt, paramsOverride?)`**

Computes the _initial_ trajectory from the system's `initCoord`. It:

1. Allocates a `Float32Array` of size `steps × 3`
2. Repeatedly applies the RK4 step for `steps` iterations
3. Returns a flat `[x₀, y₀, z₀, x₁, y₁, z₁, ...]` array

**RK4 step detail:**

For each state `xₙ` and time step `dt`:

```
k₁ = f(xₙ, params) · dt
k₂ = f(xₙ + k₁/2, params) · dt
k₃ = f(xₙ + k₂/2, params) · dt
k₄ = f(xₙ + k₃, params) · dt
xₙ₊₁ = xₙ + (k₁ + 2k₂ + 2k₃ + k₄) / 6
```

This gives O(dt⁵) local truncation error — far superior to Euler's O(dt²) method.

**`continueIntegrate(system, lastState, steps, dt, paramsOverride?)`**

Resumes a trajectory from an arbitrary point `lastState`. Used by the animation loop to extend the trajectory each frame. Returns both the new point data _and_ the final state (for the next frame's starting point).

Both functions accept an optional `paramsOverride` argument — when provided, the system integrates with those values instead of `system.params.defaults`. This is what enables live parameter adjustment.

### Rendering pipeline: `src/components/AttractorCanvas.tsx`

The canvas is a **manual Three.js scene** — no React Three Fiber, no abstraction layer. This keeps the bundle lean and gives full control over the rendering.

**Scene initialization (runs once on mount):**

1. Creates a `WebGLRenderer` with antialiasing and pixel-ratio capping at 2×
2. Creates a `PerspectiveCamera` (50° FOV)
3. Creates `OrbitControls` with damping (smooth momentum on drag)
4. Adds an ambient light
5. Allocates three typed arrays:
   - `positions`: Float32Array of up to 2,000,000 × 3 floats (6 MB)
   - `colors`: Float32Array of up to 2,000,000 × 3 floats (6 MB)
   - `sizes`: Float32Array of up to 2,000,000 floats (8 MB)
6. Creates a `BufferGeometry` with those attributes
7. Creates a custom `ShaderMaterial` with vertex + fragment shaders
8. Wraps it in a `THREE.Points` object and adds it to the scene
9. Runs initial integration (50,000 steps) to paint the first 50K points
10. Frames the camera based on the system's `limits`

**Custom shaders:**

_Vertex shader:_

```glsl
attribute vec3 aColor;
attribute float aSize;
varying vec3 vColor;
void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
}
```

The point size is **depth-attenuated**: points farther from the camera get smaller, creating a natural 3D depth cue. The factor `200.0` was chosen so that the default point size of 1.5 renders at a visually pleasing resolution.

_Fragment shader:_

```glsl
varying vec3 vColor;
void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    gl_FragColor = vec4(vColor, alpha * 0.85);
}
```

This creates **soft-edged circles** (not squares) with a smooth falloff from center to edge. Points outside the unit disc are discarded entirely. The alpha is multiplied by 0.85 for slight transparency.

**Additive blending** (`THREE.AdditiveBlending`) is used, meaning that overlapping points add their color values — this creates natural bright spots where the trajectory densely visits certain regions, giving the attractor a characteristic "glowing" appearance.

**Animation loop (rAF-driven):**

Each frame:

1. `controls.update()` — advances damped orbit and auto-rotation
2. Calls `continueIntegrate()` with current config (reads from mutable `config` object)
3. Computes `toAdd = min(stepsPerFrame, MAX_POINTS - frameCount)` — how many new points to add this frame
4. For each new point: writes position data, computes HSL → RGB color based on time, writes color data
5. Sets `needsUpdate = true` on the affected buffer attributes
6. Advances the draw range
7. Calls `renderer.render()`

**Color mapping:**

HSL hue is derived from the trajectory's _time index_ (normalized to [0, 1)) multiplied by `colorSpeed`. The full color cycle is `h = ((frameCount + i) / MAX_POINTS) % 1 * colorSpeed`. Saturation is fixed at 0.85, lightness at 0.55. This produces a smooth rainbow that winds through the trajectory — the color tells you "when" a point was visited.

**Resize handling:**

A `ResizeObserver` on the mount element re-sets the camera aspect ratio and renderer size whenever the browser window resizes.

### UI layer: `src/components/AttractorPanel.tsx`

A floating panel positioned at the top-left with `backdrop-filter: blur(12px)` for a frosted glass effect. It contains:

1. **System dropdown** — `<select>` with all 28 system names
2. **Parameter sliders** — one per parameter, dynamically generated from `system.params.defaults`. Each slider has:
   - A label (the parameter name, e.g. "σ (sigma)")
   - A numeric readout (format-aware: 4 decimals for tiny ranges, 2 for moderate, 1 for large)
   - A `<input type="range">` with step size auto-scaled to `(max - min) / 200`
3. **Display section** — Color speed, point size, steps per frame
4. **Auto-rotate toggle** — Checkbox
5. **Reset button** — Resets the trajectory to initial conditions

**State flow:**

```
User changes slider
    → React state update (setParams)
    → AttractorCanvas re-renders
    → useEffect fires → config.params = newParams
    → Animation loop reads new config on next rAF frame
    → Next integrate() call uses new params
    → New trajectory branches from current point (continuous)
```

No page reload, no scene rebuild — just a smooth morphing of the attractor shape.

## Installation

### Prerequisites

| Requirement | Minimum version      |
| ----------- | -------------------- |
| Node.js     | 18+                  |
| npm         | 9+ (comes with Node) |

### Steps

```bash
# 1. Clone or copy the project
cd attractor

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The dev server starts on `http://localhost:5173` by default. It hot-reloads on every file save — edit a system equation, save, and the browser updates instantly.

### Production build

```bash
npm run build
```

Outputs to `dist/`. Serve with any static file server:

```bash
npm run preview   # uses Vite's built-in production server
# or:
npx serve dist
```

---

## Usage

### First launch

1. Open `http://localhost:5173`
2. You see a **Lorenz attractor** rendering — two intertwined spiral lobes, colored in a rainbow gradient
3. The attractor is **already being integrated** — new points are added every frame
4. The left panel shows controls

### Navigating the interface

**Top section — System selector:**
The dropdown lists all 28 systems alphabetically. Selecting a different system:

- Resets the trajectory to the new system's initial coordinates
- Re-frames the camera to fit the new system's axis limits
- Clears the old point cloud and starts fresh

**Parameters section — one slider per parameter:**
Each slider corresponds to a parameter in the ODE. The slider label shows the parameter name (e.g., "σ (sigma)" for the Lorenz sigma parameter). Dragging a slider:

- Changes the ODE coefficients _immediately_
- The trajectory smoothly morphs from its current shape to the new one
- No discontinuity — the trajectory continues from its current point

**Display section:**

- **Color speed** — Controls how fast the rainbow cycles through the color wheel. Low values produce subtle color shifts; high values produce vivid, rapidly-changing gradients.
- **Point size** — Adjusts the rendered size of each point. Larger values make the attractor appear "fuller" but can obscure fine structure. Smaller values reveal more detail but may look sparse.
- **Steps per frame** — Controls how many integration steps are computed per animation frame. Low values (1-50) are very smooth but build slowly. High values (500-1000) fill the point cloud faster but may stutter on slower hardware.

**Toggle — Auto-rotate:**
When enabled, the camera smoothly orbits the attractor around its center. This is useful for examining the 3D shape from all angles.

**Reset button:**
Clears the point cloud and restarts the simulation from the system's initial coordinates with the current (possibly modified) parameter values.

### Interacting with the 3D scene

| Gesture            | Action                                  |
| ------------------ | --------------------------------------- |
| Left-click + drag  | Rotate the camera                       |
| Scroll wheel       | Zoom in/out                             |
| Right-click + drag | Pan the camera                          |
| Double-click       | (Default browser behavior; no override) |

The camera uses **damped orbit controls** — when you release the mouse, the rotation smoothly decelerates rather than stopping instantly. This gives a natural, physical feel to the interaction.

### Adjusting parameters in real time

The parameter adjustment is the core interactive feature. Here's what happens under the hood:

1. **You drag a slider** — e.g., the Lorenz `ρ (rho)` parameter from 28 to 10
2. **React state updates** — `setParams` is called with the new array
3. **Config object is updated** — A `useEffect` writes the new params into the shared `config` object that the animation loop reads from
4. **Next animation frame** — The `continueIntegrate()` call picks up the new parameter values
5. **New trajectory branches** — The ODE solver continues from the _current_ trajectory point, but with the new equations — the result is a smooth morphing, not an abrupt jump
6. **Visual feedback** — The newly added points trace the new attractor shape, while the old points retain their original colors

**Try this experiment:**

1. Select Lorenz, let the attractor build up to ~200K points
2. Slowly increase `ρ (rho)` from 28 to 30
3. Watch the butterfly wings spread apart
4. Slowly decrease `σ (sigma)` from 10 to 5
5. Watch the trajectory transition from chaotic to convergent
6. Click Reset to return to the canonical Lorenz shape

---

## API Reference

### `<AttractorCanvas>`

The 3D rendering component. Renders the attractor trajectory as a point cloud in a Three.js WebGL context.

**Props:**

| Prop            | Type              | Default                  | Description                                                                     |
| --------------- | ----------------- | ------------------------ | ------------------------------------------------------------------------------- |
| `system`        | `AttractorSystem` | —                        | The attractor system to render                                                  |
| `params`        | `number[]`        | `system.params.defaults` | Parameter values for the ODE                                                    |
| `stepsPerFrame` | `number`          | `50`                     | Integration steps computed per animation frame                                  |
| `colorSpeed`    | `number`          | `1`                      | Rainbow color cycle speed multiplier                                            |
| `pointSize`     | `number`          | `1.5`                    | Base size of rendered points (subject to depth attenuation)                     |
| `autoRotate`    | `boolean`         | `true`                   | Whether the camera auto-orbits                                                  |
| `resetKey`      | `number`          | `0`                      | Increment to trigger a reset (not used directly by canvas, wired via App state) |

**Internal behavior:**

- Allocates 20 MB of GPU memory (6 MB positions + 6 MB colors + 8 MB sizes for 2M points)
- Uses `ResizeObserver` for responsive layout
- Runs `requestAnimationFrame` for the render loop
- Disposes all Three.js resources on unmount

### `<AttractorPanel>`

The floating control panel. Provides the UI for all configuration.

**Props:**

| Prop                 | Type                                     | Description                              |
| -------------------- | ---------------------------------------- | ---------------------------------------- |
| `system`             | `AttractorSystem`                        | Current attractor system                 |
| `selectedId`         | `string`                                 | Currently selected system ID             |
| `systems`            | `AttractorSystem[]`                      | All available systems (for the dropdown) |
| `params`             | `number[]`                               | Current parameter values                 |
| `stepsPerFrame`      | `number`                                 | Current integration speed                |
| `colorSpeed`         | `number`                                 | Current color speed                      |
| `pointSize`          | `number`                                 | Current point size                       |
| `autoRotate`         | `boolean`                                | Current auto-rotate state                |
| `onSystemChange`     | `(id: string) => void`                   | Callback when system is changed          |
| `onParamChange`      | `(index: number, value: number) => void` | Callback when a parameter slider changes |
| `onStepsChange`      | `(value: number) => void`                | Callback for steps per frame slider      |
| `onColorSpeedChange` | `(value: number) => void`                | Callback for color speed slider          |
| `onPointSizeChange`  | `(value: number) => void`                | Callback for point size slider           |
| `onAutoRotateChange` | `(value: boolean) => void`               | Callback for auto-rotate checkbox        |
| `onReset`            | `() => void`                             | Callback for reset button                |

**Styling:**

- Frosted glass panel: `rgba(10, 10, 20, 0.85)` with `backdrop-filter: blur(12px)`
- Positioned absolute at top-left: `top: 16px; left: 16px`
- Width: 280px, scrollable if content overflows viewport
- Border: 1px semi-transparent white

### `integrate(system, steps, dt, paramsOverride?)`

Computes the initial trajectory from scratch.

**Parameters:**

- `system` — The attractor system definition
- `steps` — Number of integration steps (typically 50,000 for initial render)
- `dt` — Time step size (always 0.005 in this application)
- `paramsOverride` — Optional parameter array; if omitted, uses `system.params.defaults`

**Returns:** `Float32Array` of length `steps × 3`, flat-encoded as `[x₀, y₀, z₀, x₁, y₁, z₁, ...]`

### `continueIntegrate(system, lastState, steps, dt, paramsOverride?)`

Resumes integration from a given state.

**Parameters:**

- `system` — The attractor system definition
- `lastState` — Current trajectory endpoint as `[x, y, z]`
- `steps` — Number of steps to compute
- `dt` — Time step size (always 0.005)
- `paramsOverride` — Optional parameter array

**Returns:** `{ data: Float32Array, lastState: Vector3 }`

### `getSystem(id)`

Looks up a system by its ID string.

**Parameters:**

- `id` — The system's unique identifier (e.g., `"lorenz"`, `"roessler"`)

**Returns:** `AttractorSystem | undefined`

### `systems` array

The complete array of 28 `AttractorSystem` objects. Exported for use in custom UI components. Each entry has:

```typescript
interface AttractorSystem {
  id: string; // e.g. "lorenz"
  name: string; // e.g. "Lorenz (1963)"
  equation: (state: Vector3, params: number[]) => Vector3;
  params: {
    defaults: number[]; // e.g. [10, 28, 2.667]
    names: string[]; // e.g. ["σ (sigma)", "ρ (rho)", "β (beta)"]
    min: number[]; // Slider minimums
    max: number[]; // Slider maximums
  };
  initCoord: Vector3; // e.g. [0, 1, 0]
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

**1. Add the equation function** in `src/systems.ts`:

```typescript
// After the existing equation functions, add your own:
const myAttractor: EqFn = (x, y, z, p) => [
  p[0] * y - p[1] * x * z, // dx/dt
  x * z - p[2] * y, // dy/dt
  p[3] * x * y - p[4] * z, // dz/dt
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

| Metric               | Value                                              |
| -------------------- | -------------------------------------------------- |
| Initial render time  | ~50ms (50K steps + GPU buffer upload)              |
| Memory usage         | ~20 MB for 2M points (positions + colors + sizes)  |
| GPU memory           | ~44 MB (Float32Arrays + BufferGeometry)            |
| Max points           | 2,000,000 (hard cap — the draw range caps at this) |
| Animation frame cost | ~0.5-5ms depending on `stepsPerFrame`              |
| Bundle size (prod)   | ~694 KB JS + ~0.36 KB CSS                          |

### Tuning for performance

**If the animation is choppy:**

1. Lower `stepsPerFrame` (try 10-20) — this reduces the per-frame integration load
2. Lower `pointSize` slightly — reduces GPU rasterization cost
3. Close other GPU-heavy applications — the canvas is a WebGL context

**If you want a denser/more detailed attractor:**

1. Raise `stepsPerFrame` (try 200-500) — the attractor builds faster
2. Wait for it to fill — the point cloud grows up to 2M points over time
3. The color gradient will become more continuous at higher point counts

**If the attractor looks sparse:**

1. The trajectory may be building slowly — increase `stepsPerFrame`
2. Or the system may genuinely have a sparse attractor — try switching systems to compare

### Hardware recommendations

| Platform | Minimum                            | Recommended                                     |
| -------- | ---------------------------------- | ----------------------------------------------- |
| GPU      | Integrated graphics (Intel HD 630) | Dedicated GPU (NVIDIA GTX 1060+)                |
| RAM      | 4 GB                               | 8 GB+                                           |
| CPU      | Any x86_64                         | Any modern CPU (integration is single-threaded) |

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
