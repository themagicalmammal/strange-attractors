// ============================================================
// Strange Attractor Systems
// Port of https://github.com/vdesmond/attractors to JavaScript
// Each system: a set of coupled ODEs dx/dt = f(x, params)
// ============================================================

export type Vector3 = [number, number, number];

export interface AttractorParams {
  defaults: number[];
  max: number[];
  min: number[];
  names: string[];
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
  equation: (state: Vector3, params: number[]) => Vector3;
  id: string;
  initCoord: Vector3;
  limits?: AttractorLimits;
  name: string;
  params: AttractorParams;
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
const noseHoover: EqFn = (x, y, z, p) => [p[0] * y, -x + y * z, 1 - y * y];

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
  p[2] +
    p[4] * z -
    (z * z * z) / 3 -
    (x * x + y * y) * (1 + p[5] * z) +
    p[6] * z * x * x * x,
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
  p[2] * z + (x * y) / 3,
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
    equation: wrap(lorenz),
    id: "lorenz",
    initCoord: [0, 1, 0],
    limits: { xlim: [-20, 20], ylim: [-30, 30], zlim: [5, 45] },
    name: "Lorenz (1963)",
    params: {
      defaults: [10, 28, 8 / 3],
      max: [50, 100, 50],
      min: [-10, 0, 0],
      names: ["σ (sigma)", "ρ (rho)", "β (beta)"],
    },
  },
  {
    equation: wrap(roessler),
    id: "roessler",
    initCoord: [0.1, 0, -0.1],
    limits: { xlim: [-15, 15], ylim: [-15, 15], zlim: [-1, 20] },
    name: "Rössler (1976)",
    params: {
      defaults: [0.2, 0.2, 5.7],
      max: [5, 5, 20],
      min: [-5, -5, -10],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(chen),
    id: "chen",
    initCoord: [-10, 0, 37],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [5, 45] },
    name: "Chen (1999)",
    params: {
      defaults: [35, 3, 28],
      max: [100, 50, 100],
      min: [-10, -10, -10],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(thomas),
    id: "thomas",
    initCoord: [0.01, 0, 0],
    limits: { xlim: [-2, 5], ylim: [-2, 4], zlim: [-2, 4] },
    name: "Thomas (1999)",
    params: { defaults: [0.208], max: [1, 1], min: [-1, -1], names: ["b"] },
  },
  {
    equation: wrap(halvorsen),
    id: "halvorsen",
    initCoord: [-1.48, 1.51, 2.04],
    limits: { xlim: [-20, 15], ylim: [-12, 8], zlim: [-12, 8] },
    name: "Halvorsen",
    params: { defaults: [1.89], max: [10, 10], min: [-10, -10], names: ["a"] },
  },
  {
    equation: wrap(noseHoover),
    id: "nose_hoover",
    initCoord: [0.1, 0, -0.1],
    limits: { xlim: [-3, 1], ylim: [-3, 3], zlim: [-3, 3] },
    name: "Nose-Hoover",
    params: { defaults: [1], max: [10, 10], min: [-5, -5], names: ["a"] },
  },
  {
    equation: wrap(sakarya),
    id: "sakarya",
    initCoord: [1, -1, 1],
    limits: { xlim: [-35, 30], ylim: [-17, 15], zlim: [-13, 17] },
    name: "Sakarya",
    params: {
      defaults: [0.4, 0.3],
      max: [5, 5],
      min: [-5, -5],
      names: ["a", "b"],
    },
  },
  {
    equation: wrap(burkeShaw),
    id: "burke_shaw",
    initCoord: [1, 0, 0],
    limits: { xlim: [-2.5, 2.5], ylim: [-2.5, 2.5], zlim: [-2, 2] },
    name: "Burke-Shaw",
    params: {
      defaults: [10, 4.272],
      max: [30, 30],
      min: [-10, -10],
      names: ["s", "v"],
    },
  },
  {
    equation: wrap(rucklidge),
    id: "rucklidge",
    initCoord: [1, 0, 4.5],
    limits: { xlim: [-10.5, 4.5], ylim: [-8.5, 6.7], zlim: [0.9, 16] },
    name: "Rucklidge (1992)",
    params: {
      defaults: [2, 6.7],
      max: [10, 20],
      min: [-10, -10],
      names: ["k", "α (alpha)"],
    },
  },
  {
    equation: wrap(mooreSpiegel),
    id: "moore_spiegel",
    initCoord: [0, 0.8, 0],
    limits: { xlim: [-10, 10], ylim: [-20, 20], zlim: [-250, 250] },
    name: "Moore-Spiegel (1966)",
    params: {
      defaults: [20, 100],
      max: [100, 500],
      min: [-20, -100],
      names: ["t", "r"],
    },
  },
  {
    equation: wrap(dequanLi),
    id: "dequan_li",
    initCoord: [0.01, 0, 0],
    limits: { xlim: [-200, 200], ylim: [-200, 250], zlim: [-50, 250] },
    name: "Dequan Li (2008)",
    params: {
      defaults: [40, 1.833, 0.16, 0.65, 55, 20],
      max: [200, 20, 1, 10, 200, 200],
      min: [-100, -10, -1, -10, -50, -50],
      names: ["a", "c", "d", "e", "k", "f"],
    },
  },
  {
    equation: wrap(langford),
    id: "langford",
    initCoord: [0.1, 0, 0],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-0.5, 2] },
    name: "Langford",
    params: {
      defaults: [0.95, 0.7, 0.6, 3.5, 0.25, 0.1],
      max: [10, 10, 5, 10, 2, 5],
      min: [-10, -10, -5, -10, -2, -5],
      names: ["α", "β", "λ", "ω", "ρ", "ε"],
    },
  },
  {
    equation: wrap(dadras),
    id: "dadras",
    initCoord: [5, 0, -4],
    limits: { xlim: [-15, 15], ylim: [-10, 8], zlim: [-12, 12] },
    name: "Dadras (2009)",
    params: {
      defaults: [3, 2.7, 1.7, 2, 9],
      max: [30, 30, 30, 30, 30],
      min: [-10, -10, -10, -10, -50],
      names: ["a", "b", "c", "d", "h"],
    },
  },
  {
    equation: wrap(hadley),
    id: "hadley",
    initCoord: [0, 0, 1],
    limits: { xlim: [-1, 3], ylim: [-2, 2], zlim: [-2, 2] },
    name: "Hadley",
    params: {
      defaults: [0.2, 4, 8, 1],
      max: [5, 10, 30, 5],
      min: [-5, -10, -10, -5],
      names: ["a", "b", "f", "g"],
    },
  },
  {
    equation: wrap(chenLee),
    id: "chen_lee",
    initCoord: [1, 1, 1],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [-1, 35] },
    name: "Chen-Lee (2004)",
    params: {
      defaults: [5, -10, -0.38],
      max: [30, 30, 30],
      min: [-30, -30, -10],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(shimizuMorioka),
    id: "shimizu_morioka",
    initCoord: [-1, 2, 1],
    limits: { xlim: [-10, 10], ylim: [-10, 10], zlim: [-10, 10] },
    name: "Shimizu-Morioka (1980)",
    params: {
      defaults: [0.45, 0.75],
      max: [5, 5],
      min: [-2, -2],
      names: ["a", "B"],
    },
  },
  {
    equation: wrap(chenLu),
    id: "chen_lu",
    initCoord: [1, 1, 30],
    limits: { xlim: [-30, 30], ylim: [-30, 30], zlim: [0, 30] },
    name: "Chen-Lu (2002)",
    params: {
      defaults: [36, 3, 17],
      max: [100, 30, 100],
      min: [-30, -10, -50],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(yuWang),
    id: "yu_wang",
    initCoord: [0.1, 0, 15],
    limits: { xlim: [-3, 3], ylim: [-5, 5], zlim: [0, 45] },
    name: "Yu-Wang (2012)",
    params: {
      defaults: [10, 40, 2, 2.5],
      max: [50, 200, 30, 30],
      min: [-20, -50, -10, -10],
      names: ["a", "b", "c", "d"],
    },
  },
  {
    equation: wrap(wangSun),
    id: "wang_sun",
    initCoord: [0.5, 0.1, 0.1],
    limits: { xlim: [-4, 4], ylim: [-4, 4], zlim: [-3, 2] },
    name: "Wang-Sun (2009)",
    params: {
      defaults: [0.2, -0.01, 1, -0.4, -1, -1],
      max: [3, 3, 3, 3, 5, 5],
      min: [-3, -3, -3, -3, -5, -5],
      names: ["a", "b", "c", "d", "e", "f"],
    },
  },
  {
    equation: wrap(finance),
    id: "finance",
    initCoord: [0, -10, 0.1],
    limits: { xlim: [-3, 3], ylim: [-15, -5], zlim: [-1.5, 1.5] },
    name: "Finance",
    params: {
      defaults: [0.00001, 0.1, 1],
      max: [1, 10, 10],
      min: [-1, -10, -10],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(lotkaVolterra),
    id: "lotka_volterra",
    initCoord: [1, 1, 1],
    limits: { xlim: [0.7, 1.3], ylim: [0.7, 1.3], zlim: [0.5, 1.1] },
    name: "Lotka-Volterra",
    params: {
      defaults: [2.9851, 3, 2],
      max: [10, 10, 10],
      min: [-5, -5, -10],
      names: ["a", "b", "c"],
    },
  },
  {
    equation: wrap(boualiType1),
    id: "bouali_1",
    initCoord: [0.012, 3.69, -0.09],
    limits: { xlim: [-0.05, 0.05], ylim: [-5, 5], zlim: [-0.2, 0.2] },
    name: "Bouali Type 1 (2012)",
    params: {
      defaults: [0.02, 0.2, 0.4, 10, 0.1, 50],
      max: [5, 5, 5, 50, 5, 200],
      min: [-1, -5, -5, -20, -1, -100],
      names: ["k", "b", "μ", "p", "q", "s"],
    },
  },
  {
    equation: wrap(boualiType2),
    id: "bouali_2",
    initCoord: [0.1, 3, 0.2],
    limits: { xlim: [-8, 8], ylim: [-3, 13], zlim: [-20, 1.5] },
    name: "Bouali Type 2 (2012)",
    params: {
      defaults: [4, 1, 1.4, 2.8, 1, 1],
      max: [10, 10, 10, 10, 10, 10],
      min: [-10, -10, -10, -10, -10, -10],
      names: ["a", "b", "c", "s", "α", "β"],
    },
  },
  {
    equation: wrap(boualiType3),
    id: "bouali_3",
    initCoord: [1, 1, 0],
    limits: { xlim: [-3, 3], ylim: [0, 3], zlim: [-0.15, 0.15] },
    name: "Bouali Type 3 (2013)",
    params: {
      defaults: [1, 0.001, 3, 2.2],
      max: [10, 10, 10, 10],
      min: [-10, -10, -10, -10],
      names: ["γ", "μ", "α", "β"],
    },
  },
  {
    equation: wrap(newtonLeipnik),
    id: "newton_leipnik",
    initCoord: [0.349, 0, -0.16],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-0.5, 0.5] },
    name: "Newton-Leipnik (1988)",
    params: {
      defaults: [0.4, 0.175],
      max: [5, 5],
      min: [-5, -5],
      names: ["α", "β"],
    },
  },
  {
    equation: wrap(rikitake),
    id: "rikitake",
    initCoord: [1, 1, 1],
    limits: { xlim: [-5, 5], ylim: [-5, 5], zlim: [-5, 5] },
    name: "Rikitake (1958)",
    params: {
      defaults: [0.3, 1.5],
      max: [5, 5],
      min: [-5, -5],
      names: ["a", "b"],
    },
  },
  {
    equation: wrap(rabinovichFabrant),
    id: "rabinovich_fabrikant",
    initCoord: [0, 0, 1],
    limits: { xlim: [-2, 2], ylim: [-2, 2], zlim: [-2, 2] },
    name: "Rabinovich-Fabrikant",
    params: {
      defaults: [0.43, 1.26],
      max: [3, 5],
      min: [-3, -5],
      names: ["α", "β"],
    },
  },
  {
    equation: wrap(threeCellCNN),
    id: "three_cell_cnn",
    initCoord: [0, 0, 1],
    limits: { xlim: [-3, 3], ylim: [-3, 3], zlim: [-3, 3] },
    name: "Three-Cell CNN",
    params: {
      defaults: [0, 1, 0, 1, 0.2],
      max: [3, 3, 3, 3, 3],
      min: [-3, -3, -3, -3, -3],
      names: ["a", "b", "c", "d", "e"],
    },
  },
];

export function getSystem(id: string): AttractorSystem | undefined {
  return systems.find((s) => s.id === id);
}

export const systemIds = systems.map((s) => s.id);
