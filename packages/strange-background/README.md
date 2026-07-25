# strange-background

Strange attractor as a fullscreen animated background for React apps.

Drop `<AttractorBackground>` around any content and it renders an interactive 3D strange attractor as a fixed-position backdrop behind your UI.

## Why use it

- **Zero config** — one component, works out of the box
- **8 systems** — Lorenz, Rossler, Chen, Thomas, Newton-Leipnik, Shimizu-Morioka, Rabinovich-Fabrikant, Finance
- **Adjustable** — speed, point count, color cycling, rotation, blur
- **Glass-morphism ready** — transparent canvas with CSS blur for frosted-glass readability
- **Performance tuned** — lower default point count (500K) since backgrounds don't need 2M points for visual impact

## Quick start

```bash
npm install strange-background strange-attractorz three
```

```tsx
import { AttractorBackground } from "strange-background";

function App() {
  return (
    <AttractorBackground system="lorenz">
      <h1>Hello World</h1>
    </AttractorBackground>
  );
}
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `system` | `string \| AttractorSystem` | `"lorenz"` | System ID or system object |
| `params` | `number[]` | system defaults | Custom parameter values |
| `speed` | `number` | `1` | Animation speed multiplier |
| `pointCount` | `number` | `500000` | Max points (100K–2M). Lower = better performance |
| `stepsPerFrame` | `number` | `50` | Integration steps per frame |
| `colorSpeed` | `number` | `1` | HSL rainbow cycling speed (0–10) |
| `autoRotate` | `boolean` | `true` | OrbitControls auto-rotate |
| `pointSize` | `number` | `1.5` | Size of rendered points |
| `backgroundColor` | `string` | `"inherit"` | Hex color or `"inherit"` for transparent (CSS parent controls background) |
| `backgroundBlur` | `string \| number` | `0` | CSS blur applied to the canvas (e.g. `"8px"`, `8`, `12px`) |
| `className` | `string` | — | Class on the root container |
| `style` | `React.CSSProperties` | — | Inline styles on the root container |
| `onSceneReady` | `(data) => void` | — | Callback: `camera`, `renderer`, `scene` from Three.js |
| `children` | `ReactNode` | — | Content overlaid above the attractor |

## Usage patterns

### With blur for readability

```tsx
<AttractorBackground system="lorenz" backgroundBlur={8}>
  <main>
    <h1>Readable text over a blurred attractor</h1>
  </main>
</AttractorBackground>
```

### Custom background color

```tsx
<AttractorBackground system="roessler" backgroundColor="#0a0a1a">
  <h1>Dark attractor on deep navy</h1>
</AttractorBackground>
```

### Slow motion, high detail

```tsx
<AttractorBackground
  system="chen"
  speed={0.3}
  pointCount={1500000}
  colorSpeed={2}
>
  <h1>Slow, beautiful, detailed</h1>
</AttractorBackground>
```

### With custom parameters

```tsx
import { systems } from "strange-background";

const lorenzParams = [10, 28, 8 / 3]; // σ, ρ, β

<AttractorBackground system="lorenz" params={lorenzParams}>
  <h1>Classic Lorenz butterfly</h1>
</AttractorBackground>
```

## When NOT to use it

- **You need full interactivity** — `AttractorCanvas` from `strange-attractorz` gives orbit controls, a UI panel, and direct access to the Three.js scene. `AttractorBackground` is a drop-in wrapper optimized for decorative use, not manipulation.
- **You need 2M+ points** — `AttractorBackground` clamps to 2M. Use `AttractorCanvas` directly for the full range.
- **You need server-side rendering** — Three.js WebGL doesn't render on the server. The canvas only mounts in the browser.
- **You want a lightweight dependency** — `strange-background` brings in `strange-attractorz` + `three` (~1.5 MB gzipped for three alone). If you just need a static gradient or simple animation, a CSS background is far lighter.
- **You need fine-grained Three.js control** — `onSceneReady` gives you the camera, renderer, and scene, but if you need to modify geometry, lighting, shaders, or post-processing, use `AttractorCanvas` directly.
- **You're building a data visualization** — `AttractorCanvas` is built for exploration and display of the attractor itself. For charting or analytical overlays, use it directly.

## Exports

- `AttractorBackground` — the main component
- `getSystem(id)` — look up a system by ID
- `systems` — array of all system definitions
- `AttractorSystem` — TypeScript type for system objects

## Building

```bash
npm run build:package
```

Output goes to `dist/` (ESM, CJS, type declarations, CSS).
