// ============================================================
// Strange Attractor Systems
// Port of https://github.com/vdesmond/attractors to JavaScript
// Each system: a set of coupled ODEs dx/dt = f(x, params)
// ============================================================

export type Vector3 = [number, number, number];

export interface AttractorParams {
  defaults: number[];
  names: string[];
  min: number[];
  max: number[];
}

export interface AttractorLimits {
  xlim?: [number, number];
  ylim?: [number, number];
  zlim?: [number, number];
}

export type EqFn = (
  x: number,
  y: number,
  z: number,
  params: number[],
) => [number, number, number];

export interface AttractorSystem {
  id: string;
  name: string;
  equation: (state: Vector3, params: number[]) => Vector3;
  params: AttractorParams;
  initCoord: Vector3;
  limits?: AttractorLimits;
}

// ─── Equation functions ────────────────────────────────────────

function wrap(eq: EqFn): AttractorSystem["equation"] {
  return (state: Vector3, params: number[]) => {
    const [x, y, z] = state;
    return eq(x, y, z, params);
  };
}

// 1. Lorenz (1963)
const lorenz: EqFn = (x, y, z, p) => [
  p[0] * (y - x),
  x * (p[1] - z) - y,
  x * y - p[2] * z,
];

// 2. Rössler (1976)
const roessler: EqFn = (x, y, z, p) => [
  -(y + z),
  x + p[0] * y,
  p[1] + z * (x - p[2]),
];

// 3. Chen (1999)
const chen: EqFn = (x, y, z, p) => [
  p[0] * (y - x),
  (p[1] - p[0]) * x - x * z + p[1] * y,
  x * y - p[2] * z,
];

// 4. Thomas (1999)
const thomas: EqFn = (x, y, z, p) => [
  Math.sin(y) - p[0] * x,
  Math.sin(z) - p[0] * y,
  Math.sin(x) - p[0] * z,
];

// 5. Halvorsen
const halvorsen: EqFn = (x, y, z, p) => [
  -p[0] * x - 4 * y - 4 * z - y * y,
  -p[0] * y - 4 * z - 4 * x - z * z,
  -p[0] * z - 4 * x - 4 * y - x * x,
];

// 6. Nose-Hoover
const noseHoover: EqFn = (x, y, z, p) => [
  p[0] * y,
  -x + y * z,
  1 - y * y,
];

// 7. Sakarya
const sakarya: EqFn = (x, y, z, p) => [
  -x + y + y * z,
  -x - y + p[0] * x * z,
  z - p[1] * x * y,
];

// 8. Burke-Shaw
const burkeShaw: EqFn = (x, y, z, p) => [
  -p[0] * (x + y),
  -y - p[0] * x * z,
  p[0] * x * y + p[1],
];

// 9. Rucklidge (1992)
const rucklidge: EqFn = (x, y, z, p) => [
  -p[0] * x + p[1] * y - y * z,
  x,
  -z + y * y,
];

// 10. Moore-Spiegel (1966)
const mooreSpiegel: EqFn = (x, y, z, p) => [
  y,
  z,
  -z - (p[0] - p[1] * (1 - x * x)) * y - p[0] * x,
];

// 11. Dequan Li (2008)
const dequanLi: EqFn = (x, y, z, p) => [
  p[0] * (y - x) + p[2] * x * z,
  p[4] * x + p[5] * y - x * z,
  p[1] * z + x * y - p[3] * x * x,
];

// 12. Langford
const langford: EqFn = (x, y, z, p) => [
  (z - p[1]) * x - p[3] * y,
  p[3] * x + (z - p[1]) * y,
  p[2] + p[4] * z - z * z * z / 3 - (x * x + y * y) * (1 + p[5] * z) + p[6] * z * x * x * x,
];

// 13. Dadras (2009)
const dadras: EqFn = (x, y, z, p) => [
  y - p[0] * x + p[1] * y * z,
  p[2] * y - x * z + z,
  p[3] * x * y - p[4] * z,
];

// 14. Hadley
const hadley: EqFn = (x, y, z, p) => [
  -y * y - z * z - p[0] * (x - p[2]),
  x * y - p[1] * x * z - y + p[3],
  p[1] * x * y + z * (x - 1),
];

// 15. Chen-Lee (2004)
const chenLee: EqFn = (x, y, z, p) => [
  p[0] * x - y * z,
  p[1] * y + x * z,
  p[2] * z + x * y / 3,
];

// 16. Shimizu-Morioka (1980)
const shimizuMorioka: EqFn = (x, y, z, p) => [
  y,
  x - p[0] * y - x * z,
  -p[1] * z + x * x,
];

// 17. Chen-Lu (2002)
const chenLu: EqFn = (x, y, z, p) => [
  p[0] * (y - x),
  -x * z + p[1] * y,
  x * y - p[2] * z,
];

// 18. Yu-Wang (2012)
const yuWang: EqFn = (x, y, z, p) => [
  p[0] * (y - x),
  p[1] * x - p[2] * x * z,
  Math.exp(x * y) - p[3] * z,
];

// 19. Wang-Sun (2009)
const wangSun: EqFn = (x, y, z, p) => [
  p[0] * x + p[2] * y * z,
  p[1] * x + p[3] * y - x * z,
  p[4] * z + p[5] * x * y,
];

// 20. Finance (2007)
const finance: EqFn = (x, y, z, p) => [
  (1 / p[1] - p[0]) * x + x * y + z,
  -p[1] * y - x * x,
  -x - p[2] * z,
];

// 21. Lotka-Volterra
const lotkaVolterra: EqFn = (x, y, z, p) => [
  x - x * y + p[2] * x * x - p[0] * z * x * x,
  -y + x * y,
  -p[1] * z + p[0] * z * x * x,
];

// 22. Bouali Type 1 (2012)
const boualiType1: EqFn = (x, y, z, p) => [
  p[0] * y + p[2] * x * (p[1] - y * y),
  -x + p[3] * z,
  p[4] * x - p[5] * y,
];

// 23. Bouali Type 2 (2012)
const boualiType2: EqFn = (x, y, z, p) => [
  x * (p[0] - y) + p[4] * z,
  -y * (p[1] - x * x),
  -x * (p[2] - p[3] * z) - p[5] * z,
];

// 24. Bouali Type 3 (2013)
const boualiType3: EqFn = (x, y, z, p) => [
  p[2] * x * (1 - y) - p[3] * z,
  -p[0] * y * (1 - x * x),
  p[1] * x,
];

// 25. Newton-Leipnik (1988)
const newtonLeipnik: EqFn = (x, y, z, p) => [
  -p[0] * x + y + p[1] * y * (x * x - 1),
  -p[0] * y + x + p[1] * x * (y * y - 1),
  -z / p[0],
];

// 26. Rikitake (1958-1960)
const rikitake: EqFn = (x, y, z, p) => [
  -p[0] * x - z,
  x + p[0] * y,
  y * (z - p[1]),
];

// 27. Rabinovich-Fabrikant
const rabinovichFabrant: EqFn = (x, y, z, p) => [
  y * (z - 1 + x * x) + p[0] * x,
  x * (3 * z + 1 - x * x) + p[0] * y,
  -2 * z * (p[1] + x * y),
];

// 28. Three-Cell-CNN
const threeCellCNN: EqFn = (x, y, z, p) => [
  z,
  z,
  -p[0] * x - p[1] * y + p[2] * z - p[3] * z * z * z + p[4] * x * x,
];

// ─── System registry ───────────────────────────────────────────

export const systems: AttractorSystem[] = [
  {
    id: "lorenz",
    name: "Lorenz (1963)",
    equation: wrap(lorenz),
    params: { defaults: [10, 28, 8 / 3], names: ["σ (sigma)", "ρ (rho)", "β (beta)"], min: [-10, 0, 0], max: [50, 100, 50] },
    initCoord: [0, 1, 0],
    limits: { xlim: [-20, 20], ylim: [-30, 30], zlim: [5, 45] },
  },
  {
    id: "roessler",
    name: "Rössler (1976)",
    equation: wrap(roessler),
    params: { defaults: [0.2, 0.2, 5.7], names: ["a", "b", "c"], min: [-5, -5, -10], max: [5, 5, 20] },
    initCoord: [0.1, 0, -0.1],
    limits: { xlim: [-15, 15], ylim: [-15, 15], zlim: [-1, 20] },
  },
  {
    id: "chen",
    name: "Chen (1999)",
    equation: wrap(chen),
    params: { defaults: [35, 3, 28], names: ["a", "b", "c"], min: [-10, -10, -10], max: [100, 50, 100] },
    initCoord: [-10, 0, 37],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [5, 45] },
  },
  {
    id: "thomas",
    name: "Thomas (1999)",
    equation: wrap(thomas),
    params: { defaults: [0.208], names: ["b"], min: [-1, -1], max: [1, 1] },
    initCoord: [0.01, 0, 0],
    limits: { xlim: [-2, 5], ylim: [-2, 4], zlim: [-2, 4] },
  },
  {
    id: "halvorsen",
    name: "Halvorsen",
    equation: wrap(halvorsen),
    params: { defaults: [1.89], names: ["a"], min: [-10, -10], max: [10, 10] },
    initCoord: [-1.48, 1.51, 2.04],
    limits: { xlim: [-20, 15], ylim: [-12, 8], zlim: [-12, 8] },
  },
  {
    id: "nose_hoover",
    name: "Nose-Hoover",
    equation: wrap(noseHoover),
    params: { defaults: [1], names: ["a"], min: [-5, -5], max: [10, 10] },
    initCoord: [0.1, 0, -0.1],
    limits: { xlim: [-3, 1], ylim: [-3, 3], zlim: [-3, 3] },
  },
  {
    id: "sakarya",
    name: "Sakarya",
    equation: wrap(sakarya),
    params: { defaults: [0.4, 0.3], names: ["a", "b"], min: [-5, -5], max: [5, 5] },
    initCoord: [1, -1, 1],
    limits: { xlim: [-35, 30], ylim: [-17, 15], zlim: [-13, 17] },
  },
  {
    id: "burke_shaw",
    name: "Burke-Shaw",
    equation: wrap(burkeShaw),
    params: { defaults: [10, 4.272], names: ["s", "v"], min: [-10, -10], max: [30, 30] },
    initCoord: [1, 0, 0],
    limits: { xlim: [-2.5, 2.5], ylim: [-2.5, 2.5], zlim: [-2, 2] },
  },
  {
    id: "rucklidge",
    name: "Rucklidge (1992)",
    equation: wrap(rucklidge),
    params: { defaults: [2, 6.7], names: ["k", "α (alpha)"], min: [-10, -10], max: [10, 20] },
    initCoord: [1, 0, 4.5],
    limits: { xlim: [-10.5, 4.5], ylim: [-8.5, 6.7], zlim: [0.9, 16] },
  },
  {
    id: "moore_spiegel",
    name: "Moore-Spiegel (1966)",
    equation: wrap(mooreSpiegel),
    params: { defaults: [20, 100], names: ["t", "r"], min: [-20, -100], max: [100, 500] },
    initCoord: [0, 0.8, 0],
    limits: { xlim: [-10, 10], ylim: [-20, 20], zlim: [-250, 250] },
  },
  {
    id: "dequan_li",
    name: "Dequan Li (2008)",
    equation: wrap(dequanLi),
    params: { defaults: [40, 1.833, 0.16, 0.65, 55, 20], names: ["a", "c", "d", "e", "k", "f"], min: [-100, -10, -1, -10, -50, -50], max: [200, 20, 1, 10, 200, 200] },
    initCoord: [0.01, 0, 0],
    limits: { xlim: [-200, 200], ylim: [-200, 250], zlim: [-50, 250] },
  },
  {
    id: "langford",
    name: "Langford",
    equation: wrap(langford),
    params: { defaults: [0.95, 0.7, 0.6, 3.5, 0.25, 0.1], names: ["α", "β", "λ", "ω", "ρ", "ε"], min: [-10, -10, -5, -10, -2, -5], max: [10, 10, 5, 10, 2, 5] },
    initCoord: [0.1, 0, 0],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-0.5, 2] },
  },
  {
    id: "dadras",
    name: "Dadras (2009)",
    equation: wrap(dadras),
    params: { defaults: [3, 2.7, 1.7, 2, 9], names: ["a", "b", "c", "d", "h"], min: [-10, -10, -10, -10, -50], max: [30, 30, 30, 30, 30] },
    initCoord: [5, 0, -4],
    limits: { xlim: [-15, 15], ylim: [-10, 8], zlim: [-12, 12] },
  },
  {
    id: "hadley",
    name: "Hadley",
    equation: wrap(hadley),
    params: { defaults: [0.2, 4, 8, 1], names: ["a", "b", "f", "g"], min: [-5, -10, -10, -5], max: [5, 10, 30, 5] },
    initCoord: [0, 0, 1],
    limits: { xlim: [-1, 3], ylim: [-2, 2], zlim: [-2, 2] },
  },
  {
    id: "chen_lee",
    name: "Chen-Lee (2004)",
    equation: wrap(chenLee),
    params: { defaults: [5, -10, -0.38], names: ["a", "b", "c"], min: [-30, -30, -10], max: [30, 30, 30] },
    initCoord: [1, 1, 1],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [-1, 35] },
  },
  {
    id: "shimizu_morioka",
    name: "Shimizu-Morioka (1980)",
    equation: wrap(shimizuMorioka),
    params: { defaults: [0.45, 0.75], names: ["a", "B"], min: [-2, -2], max: [5, 5] },
    initCoord: [-1, 2, 1],
    limits: { xlim: [-10, 10], ylim: [-10, 10], zlim: [-10, 10] },
  },
  {
    id: "chen_lu",
    name: "Chen-Lu (2002)",
    equation: wrap(chenLu),
    params: { defaults: [36, 3, 17], names: ["a", "b", "c"], min: [-30, -10, -50], max: [100, 30, 100] },
    initCoord: [1, 1, 30],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [0, 30] },
  },
  {
    id: "yu_wang",
    name: "Yu-Wang (2012)",
    equation: wrap(yuWang),
    params: { defaults: [10, 40, 2, 2.5], names: ["a", "b", "c", "d"], min: [-20, -50, -10, -10], max: [50, 200, 30, 30] },
    initCoord: [0.1, 0, 15],
    limits: { xlim: [-3, 3], ylim: [-5, 5], zlim: [0, 45] },
  },
  {
    id: "wang_sun",
    name: "Wang-Sun (2009)",
    equation: wrap(wangSun),
    params: { defaults: [0.2, -0.01, 1, -0.4, -1, -1], names: ["a", "b", "c", "d", "e", "f"], min: [-3, -3, -3, -3, -5, -5], max: [3, 3, 3, 3, 5, 5] },
    initCoord: [0.5, 0.1, 0.1],
    limits: { xlim: [-4, 4], ylim: [-4, 4], zlim: [-3, 2] },
  },
  {
    id: "finance",
    name: "Finance",
    equation: wrap(finance),
    params: { defaults: [0.00001, 0.1, 1], names: ["a", "b", "c"], min: [-1, -10, -10], max: [1, 10, 10] },
    initCoord: [0, -10, 0.1],
    limits: { xlim: [-3, 3], ylim: [-15, -5], zlim: [-1.5, 1.5] },
  },
  {
    id: "lotka_volterra",
    name: "Lotka-Volterra",
    equation: wrap(lotkaVolterra),
    params: { defaults: [2.9851, 3, 2], names: ["a", "b", "c"], min: [-5, -5, -10], max: [10, 10, 10] },
    initCoord: [1, 1, 1],
    limits: { xlim: [0.7, 1.3], ylim: [0.7, 1.3], zlim: [0.5, 1.1] },
  },
  {
    id: "bouali_1",
    name: "Bouali Type 1 (2012)",
    equation: wrap(boualiType1),
    params: { defaults: [0.02, 0.2, 0.4, 10, 0.1, 50], names: ["k", "b", "μ", "p", "q", "s"], min: [-1, -5, -5, -20, -1, -100], max: [5, 5, 5, 50, 5, 200] },
    initCoord: [0.012, 3.69, -0.09],
    limits: { xlim: [-0.05, 0.05], ylim: [-5, 5], zlim: [-0.2, 0.2] },
  },
  {
    id: "bouali_2",
    name: "Bouali Type 2 (2012)",
    equation: wrap(boualiType2),
    params: { defaults: [4, 1, 1.4, 2.8, 1, 1], names: ["a", "b", "c", "s", "α", "β"], min: [-10, -10, -10, -10, -10, -10], max: [10, 10, 10, 10, 10, 10] },
    initCoord: [0.1, 3, 0.2],
    limits: { xlim: [-8, 8], ylim: [-3, 13], zlim: [-20, 1.5] },
  },
  {
    id: "bouali_3",
    name: "Bouali Type 3 (2013)",
    equation: wrap(boualiType3),
    params: { defaults: [1, 0.001, 3, 2.2], names: ["γ", "μ", "α", "β"], min: [-10, -10, -10, -10], max: [10, 10, 10, 10] },
    initCoord: [1, 1, 0],
    limits: { xlim: [-3, 3], ylim: [0, 3], zlim: [-0.15, 0.15] },
  },
  {
    id: "newton_leipnik",
    name: "Newton-Leipnik (1988)",
    equation: wrap(newtonLeipnik),
    params: { defaults: [0.4, 0.175], names: ["α", "β"], min: [-5, -5], max: [5, 5] },
    initCoord: [0.349, 0, -0.16],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-0.5, 0.5] },
  },
  {
    id: "rikitake",
    name: "Rikitake (1958)",
    equation: wrap(rikitake),
    params: { defaults: [0.3, 1.5], names: ["a", "b"], min: [-5, -5], max: [5, 5] },
    initCoord: [1, 1, 1],
    limits: { xlim: [-5, 5], ylim: [-5, 5], zlim: [-5, 5] },
  },
  {
    id: "rabinovich_fabrikant",
    name: "Rabinovich-Fabrikant",
    equation: wrap(rabinovichFabrant),
    params: { defaults: [0.43, 1.26], names: ["α", "β"], min: [-3, -5], max: [3, 5] },
    initCoord: [0, 0, 1],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-2, 2] },
  },
  {
    id: "three_cell_cnn",
    name: "Three-Cell CNN",
    equation: wrap(threeCellCNN),
    params: { defaults: [0, 1, 0, 1, 0.2], names: ["a", "b", "c", "d", "e"], min: [-3, -3, -3, -3, -3], max: [3, 3, 3, 3, 3] },
    initCoord: [0, 0, 1],
    limits: { xlim: [-3, 3], ylim: [-3, 3], zlim: [-3, 3] },
  },
];

export function getSystem(id: string): AttractorSystem | undefined {
  return systems.find((s) => s.id === id);
}

export const systemIds = systems.map((s) => s.id);
