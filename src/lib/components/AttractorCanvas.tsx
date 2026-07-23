import type { AttractorSystem, Vector3 } from "../systems";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three-stdlib";

import { continueIntegrate, integrate } from "../integrate";

// ─── Props ─────────────────────────────────────────────────────

interface AttractorCanvasProps {
  autoRotate: boolean;
  backgroundColor?: string;
  colorSpeed: number;
  onSceneReady?: (data: {
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
  }) => void;
  params: number[];
  pointSize: number;
  resetKey: number;
  speed: number;
  stepsPerFrame: number;
  system: AttractorSystem;
}

// ─── Shared config object (mutable, read by animation loop) ─────

const config = {
  autoRotate: true,
  colorSpeed: 1,
  params: null as unknown as number[],
  pointSize: 1.5,
  speed: 0.5,
  stepsPerFrame: 50,
  system: null as unknown as AttractorSystem,
};

// ─── Shaders ───────────────────────────────────────────────────

const VERT = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const FRAG = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, d);
    gl_FragColor = vec4(vColor, alpha * 0.85);
  }
`;

// ─── Helpers ───────────────────────────────────────────────────

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      const t2 = ((t % 1) + 1) % 1;
      if (t2 < 1 / 6) return p + (q - p) * 6 * t2;
      if (t2 < 1 / 2) return q;
      if (t2 < 2 / 3) return p + (q - p) * (2 / 3 - t2) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}

// ─── Scene factory ─────────────────────────────────────────────

let renderer: null | THREE.WebGLRenderer = null;
let scene: null | THREE.Scene = null;
let camera: null | THREE.PerspectiveCamera = null;
let controls: null | OrbitControls = null;

const ZOOM_STEP = 0.06; // fraction of current distance per step
let pointsObj: null | THREE.Points = null;
let geometry: null | THREE.BufferGeometry = null;
let material: null | THREE.ShaderMaterial = null;
let positions: Float32Array | null = null;
let colors: Float32Array | null = null;
let sizes: Float32Array | null = null;
let frameCount = 0;
let lastState: Vector3 = [0, 0, 0];
let resizeObserver: null | ResizeObserver = null;
let running = false;
let animId = 0;

const MAX_POINTS = 2_000_000;

function hexToThreeColor(hex: string): number {
  const normalized = hex.replace("#", "");
  return parseInt(normalized.length === 3
    ? normalized[0] + normalized[0] + normalized[1] + normalized[1] + normalized[2] + normalized[2]
    : normalized, 16);
}

function initScene(mount: HTMLDivElement, backgroundColor: string, onSceneReady?: (data: {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
}) => void) {
  const width = mount.clientWidth;
  const height = mount.clientHeight;

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(
    backgroundColor === "inherit" ? 0x000000 : hexToThreeColor(backgroundColor),
    1,
  );
  mount.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);

  // Controls
  controls = new OrbitControls(camera, renderer.domElement!);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;

  scene.add(new THREE.AmbientLight(0xffffff, 1));

  // Buffers
  positions = new Float32Array(MAX_POINTS * 3);
  colors = new Float32Array(MAX_POINTS * 3);
  sizes = new Float32Array(MAX_POINTS);

  geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geometry.setDrawRange(0, 0);

  material = new THREE.ShaderMaterial({
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    fragmentShader: FRAG,
    transparent: true,
    vertexShader: VERT,
  });

  pointsObj = new THREE.Points(geometry, material);
  scene.add(pointsObj);

  // Resize
  resizeObserver = new ResizeObserver(() => {
    const w = mount.clientWidth;
    const h = mount.clientHeight;
    camera!.aspect = w / h;
    camera!.updateProjectionMatrix();
    renderer!.setSize(w, h);
  });
  resizeObserver.observe(mount);

  onSceneReady?.({ camera: camera!, renderer: renderer!, scene: scene! });
}

function doReset() {
  if (!geometry || !positions || !colors || !sizes) return;
  const sys = config.system;
  if (!sys) return;

  positions.fill(0);
  colors.fill(0);
  sizes.fill(config.pointSize);
  frameCount = 0;
  geometry.setDrawRange(0, 0);

  const data = integrate(sys, 50_000, 0.005, config.params);
  const count = Math.min(data.length / 3, MAX_POINTS);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = data[i * 3];
    positions[i * 3 + 1] = data[i * 3 + 1];
    positions[i * 3 + 2] = data[i * 3 + 2];
    const t = (i / count) % 1;
    const [r, g, b] = hslToRgb((t * config.colorSpeed) % 1, 0.8, 0.55);
    colors[i * 3] = r;
    colors[i * 3 + 1] = g;
    colors[i * 3 + 2] = b;
  }
  geometry.setDrawRange(0, count);
  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.aColor.needsUpdate = true;
  frameCount = count;
  lastState = [
    positions[(count - 1) * 3],
    positions[(count - 1) * 3 + 1],
    positions[(count - 1) * 3 + 2],
  ] as Vector3;
}

function frameCamera() {
  if (!camera || !controls) return;
  const sys = config.system;
  if (!sys || !sys.limits) return;

  const cx = ((sys.limits.xlim?.[0] ?? -10) + (sys.limits.xlim?.[1] ?? 10)) / 2;
  const cy = ((sys.limits.ylim?.[0] ?? -10) + (sys.limits.ylim?.[1] ?? 10)) / 2;
  const cz = ((sys.limits.zlim?.[0] ?? -10) + (sys.limits.zlim?.[1] ?? 10)) / 2;
  const sx = (sys.limits.xlim?.[1] ?? 20) - (sys.limits.xlim?.[0] ?? -20);
  const sy = (sys.limits.ylim?.[1] ?? 20) - (sys.limits.ylim?.[0] ?? -20);
  const sz = (sys.limits.zlim?.[1] ?? 20) - (sys.limits.zlim?.[0] ?? -20);
  const maxDim = Math.max(sx, sy, sz, 1);
  camera.position.set(cx + maxDim, cy + maxDim * 0.6, cz + maxDim);
  controls.target.set(cx, cy, cz);
}

function animate() {
  if (!running) return;
  animId = requestAnimationFrame(animate);

  controls?.update();

  const toAdd = Math.min(
    Math.round(config.stepsPerFrame * config.speed),
    MAX_POINTS - frameCount,
  );
  if (toAdd > 0 && config.system && config.params) {
    const { data, lastState: newState } = continueIntegrate(
      config.system,
      lastState,
      toAdd,
      0.005,
      config.params,
    );
    lastState = newState;

    for (let i = 0; i < toAdd; i++) {
      const src = i * 3;
      const dst = (frameCount + i) * 3;
      positions![dst] = data[src];
      positions![dst + 1] = data[src + 1];
      positions![dst + 2] = data[src + 2];
      const t = ((frameCount + i) / MAX_POINTS) % 1;
      const [r, g, b] = hslToRgb((t * config.colorSpeed) % 1, 0.85, 0.55);
      colors![dst] = r;
      colors![dst + 1] = g;
      colors![dst + 2] = b;
    }

    geometry!.attributes.position.needsUpdate = true;
    geometry!.attributes.aColor.needsUpdate = true;
    geometry!.setDrawRange(0, frameCount + toAdd);
    frameCount += toAdd;
  }

  renderer?.render(scene!, camera!);
}

function startAnimation() {
  running = true;
  animate();
}

/**
 * Zoom the camera by one small incremental step.
 * -1 = zoom out (move away), 1 = zoom in (move closer).
 * Each call moves the camera ~6% of its current distance from the orbit target.
 */
export function zoomCamera(direction: number) {
  if (!camera || !controls) return;
  const target = controls.target;
  const dir = new THREE.Vector3().subVectors(camera.position, target);
  const dist = dir.length();
  if (dist < 0.5) return;

  // Zoom in steps shrink, zoom out steps grow
  const step = dist * ZOOM_STEP;
  const newDist =
    direction > 0
      ? Math.max(dist - step, 0.5) // zoom in: don't go closer than 0.5
      : dist + step; // zoom out

  dir.normalize().multiplyScalar(newDist);
  camera.position.copy(target).add(dir);
  controls.update();
}

function stopAnimation() {
  running = false;
  cancelAnimationFrame(animId);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _dispose() {
  stopAnimation();
  resizeObserver?.disconnect();
  if (renderer && renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }
  renderer?.dispose();
  geometry?.dispose();
  material?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  pointsObj = null;
  geometry = null;
  material = null;
  positions = null;
  colors = null;
  sizes = null;
  frameCount = 0;
}

// ─── Component ─────────────────────────────────────────────────

export function AttractorCanvas({
  autoRotate,
  backgroundColor,
  colorSpeed,
  onSceneReady,
  params,
  pointSize,
  resetKey,
  speed,
  stepsPerFrame,
  system,
}: AttractorCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Sync config on mount and when system changes
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // If scene doesn't exist yet, initialize it
    if (!renderer) {
      initScene(mount, backgroundColor ?? "#000000", onSceneReady);
    }

    config.params = params;
    config.stepsPerFrame = stepsPerFrame;
    config.colorSpeed = colorSpeed;
    config.pointSize = pointSize;
    config.autoRotate = autoRotate;

    // If this is the first init (no points yet), do the reset
    if (frameCount === 0) {
      doReset();
      frameCamera();
    }

    // Start animation
    startAnimation();

    return () => {
      // Don't dispose on unmount if we're switching systems —
      // the cleanup for the previous system's effect will handle it
    };
  }, []); // Run once

  // Update mutable config on every render (animation loop reads from config)
  useEffect(() => {
    config.system = system;
    config.params = params;
    config.stepsPerFrame = stepsPerFrame;
    config.colorSpeed = colorSpeed;
    config.pointSize = pointSize;
    config.speed = speed;
    config.autoRotate = autoRotate;
    if (controls) controls.autoRotate = autoRotate;
    sizes?.fill(pointSize);
    if (geometry?.attributes.aSize)
      geometry.attributes.aSize.needsUpdate = true;
  }, [system, params, stepsPerFrame, colorSpeed, pointSize, speed, autoRotate]);

  // Sync renderer clear color when background changes
  useEffect(() => {
    if (!renderer) return;
    const color = backgroundColor ?? "#000000";
    renderer.setClearColor(
      color === "inherit" ? 0x000000 : hexToThreeColor(color),
      1,
    );
  }, [backgroundColor]);

  // Handle system change: rebuild buffers and reset
  useEffect(() => {
    if (!geometry || !positions || !colors) return;
    doReset();
    frameCamera();
  }, [system.id]); // Only when the system type changes

  // Handle explicit reset
  useEffect(() => {
    if (!geometry || !positions || !colors) return;
    doReset();
  }, [resetKey]);

  return <div ref={mountRef} style={{ height: "100%", width: "100%" }} />;
}
