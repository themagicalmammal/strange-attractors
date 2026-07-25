// AttractorBackground — strange attractor as a fullscreen background component
// Usage:
//   import { AttractorBackground } from "strange-background";
//   import "strange-background/styles.css";
//
//   <AttractorBackground system="lorenz" speed={1.5} colorSpeed={0.5}>
//     <h1>Your Content</h1>
//   </AttractorBackground>

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import {
  AttractorCanvas,
  getSystem,
  systems,
  type AttractorSystem,
} from "strange-attractorz";

export { getSystem, systems, type AttractorSystem } from "strange-attractorz";

// ─── Props ─────────────────────────────────────────────────────

export interface AttractorBackgroundProps {
  /** System ID (e.g. "lorenz", "roessler") or system object. Default: "lorenz" */
  system?: string | AttractorSystem;
  /** Custom parameter values. Falls back to system defaults. */
  params?: number[];
  /** Animation speed multiplier. Default: 1 */
  speed?: number;
  /** Max point count (0.1M–2M). Lower = better performance. Default: 500000 */
  pointCount?: number;
  /** Integration steps per frame. Default: 50 */
  stepsPerFrame?: number;
  /** HSL rainbow cycling speed (0–10). Default: 1 */
  colorSpeed?: number;
  /** OrbitControls auto-rotate. Default: true */
  autoRotate?: boolean;
  /** Size of rendered points. Default: 1.5 */
  pointSize?: number;
  /** Hex color or "inherit" for transparent. Default: "inherit" */
  backgroundColor?: string;
  /** Blur applied to the background canvas (e.g. "8px" or 8). Default: 0 */
  backgroundBlur?: string | number;
  /** Class on the root container */
  className?: string;
  /** Inline styles on the root container */
  style?: React.CSSProperties;
  /** Callback when Three.js scene is ready */
  onSceneReady?: (data: {
    camera: import("three").PerspectiveCamera;
    renderer: import("three").WebGLRenderer;
    scene: import("three").Scene;
  }) => void;
  /** Content rendered above the attractor */
  children?: ReactNode;
}

// ─── Component ─────────────────────────────────────────────────

const DEFAULT_SYSTEM_ID = "lorenz";
const DEFAULT_POINT_COUNT = 500_000;
const DEFAULT_SPEED = 1;
const DEFAULT_STEPS_PER_FRAME = 50;
const DEFAULT_COLOR_SPEED = 1;
const DEFAULT_POINT_SIZE = 1.5;
const DEFAULT_BACKGROUND_BLUR = 0;

export function AttractorBackground({
  system,
  params,
  speed = DEFAULT_SPEED,
  pointCount = DEFAULT_POINT_COUNT,
  stepsPerFrame = DEFAULT_STEPS_PER_FRAME,
  colorSpeed = DEFAULT_COLOR_SPEED,
  autoRotate = true,
  pointSize = DEFAULT_POINT_SIZE,
  backgroundColor = "inherit",
  backgroundBlur = DEFAULT_BACKGROUND_BLUR,
  className,
  style,
  onSceneReady,
  children,
}: AttractorBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [resolvedSystem, setResolvedSystem] = useState<AttractorSystem>(() => {
    const sysId = typeof system === "string" ? system : DEFAULT_SYSTEM_ID;
    return getSystem(sysId) ?? systems[0];
  });

  // Re-resolve system if the prop changes
  useEffect(() => {
    if (typeof system === "string") {
      const resolved = getSystem(system) ?? systems[0];
      setResolvedSystem(resolved);
    } else if (system) {
      setResolvedSystem(system);
    }
  }, [system]);

  const effectiveParams = params ?? resolvedSystem.params.defaults;

  // Clamp pointCount to valid range
  const clampedPointCount = Math.max(100_000, Math.min(2_000_000, pointCount));

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          filter: backgroundBlur ? `blur(${backgroundBlur}px)` : undefined,
        }}
      >
        <AttractorCanvas
          system={resolvedSystem}
          params={effectiveParams}
          speed={speed}
          pointCount={clampedPointCount}
          stepsPerFrame={stepsPerFrame}
          colorSpeed={colorSpeed}
          autoRotate={autoRotate}
          pointSize={pointSize}
          backgroundColor={backgroundColor}
          onSceneReady={onSceneReady}
          resetKey={0}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}
