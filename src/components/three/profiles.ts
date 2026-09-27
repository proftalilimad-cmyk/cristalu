import * as THREE from 'three'

/**
 * Coupes de profilés — géométries paramétriques.
 *
 * Unités : 1 unité ≈ 10 mm. Les sections reprennent la logique réelle d'un
 * profilé de menuiserie : coquille extérieure, coquille intérieure, barrettes
 * polyamide (rupture de pont thermique), chambres d'isolation, ports à vis,
 * feuillure de vitrage, joints EPDM et vitrage isolant.
 */

export type Pt = [number, number]

export function shapeFrom(points: Pt[], holes: Pt[][] = []): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i += 1) shape.lineTo(points[i][0], points[i][1])
  shape.closePath()
  for (const hole of holes) {
    const path = new THREE.Path()
    path.moveTo(hole[0][0], hole[0][1])
    for (let i = 1; i < hole.length; i += 1) path.lineTo(hole[i][0], hole[i][1])
    path.closePath()
    shape.holes.push(path)
  }
  return shape
}

export const rect = (x0: number, y0: number, x1: number, y1: number): Pt[] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
]

const DEPTH = 3.4

export function extrude(shape: THREE.Shape, depth = DEPTH, bevel = 0.018): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 10,
    steps: 1,
  })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

/** Port à vis : tube ouvert, caractéristique des extrusions aluminium. */
export function screwPort(cx: number, cy: number, outer = 0.42, inner = 0.21): THREE.Shape {
  const shape = new THREE.Shape()
  shape.absarc(cx, cy, outer, 0, Math.PI * 2, false)
  const hole = new THREE.Path()
  hole.absarc(cx, cy, inner, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  return shape
}

/* ------------------------------------------------ aluminium à rupture de pont thermique */

/** Demi-coquille extérieure : goutte d'eau, deux chambres, gorges des barrettes. */
export function aluOuterShape(): THREE.Shape {
  const pts: Pt[] = [
    [-3.4, -3.2],
    [-2.65, -3.2],
    [-2.65, -3.0], // rainure de drainage
    [-1.95, -3.0],
    [-1.95, -3.2],
    [-0.4, -3.2],
    [-0.4, -2.55], // gorge barrette basse
    [-0.66, -2.55],
    [-0.66, -2.05],
    [-0.4, -2.05],
    [-0.4, 2.05], // gorge barrette haute
    [-0.66, 2.05],
    [-0.66, 2.55],
    [-0.4, 2.55],
    [-0.4, 3.2],
    [-0.92, 3.2], // aile de vitrage extérieure
    [-0.92, 3.88],
    [-1.08, 3.98], // gorge du joint
    [-1.08, 4.3],
    [-0.92, 4.4],
    [-0.92, 4.75],
    [-1.55, 4.75],
    [-1.55, 3.2],
    [-3.4, 3.2],
  ]
  const holes: Pt[][] = [
    rect(-3.16, -2.82, -2.1, 2.96),
    rect(-1.88, -2.82, -0.86, 2.96),
  ]
  return shapeFrom(pts, holes)
}

/** Demi-coquille intérieure : chambres, gorges des barrettes, portée de parclose. */
export function aluInnerShape(): THREE.Shape {
  const pts: Pt[] = [
    [0.4, -3.2],
    [3.4, -3.2],
    [3.4, 3.2],
    [1.12, 3.2],
    [1.12, 4.05], // montant de clippage de la parclose
    [0.56, 4.05],
    [0.56, 3.78],
    [0.72, 3.66],
    [0.56, 3.54],
    [0.56, 3.2],
    [0.4, 3.2],
    [0.4, 2.55],
    [0.66, 2.55],
    [0.66, 2.05],
    [0.4, 2.05],
    [0.4, -2.05],
    [0.66, -2.05],
    [0.66, -2.55],
    [0.4, -2.55],
  ]
  const holes: Pt[][] = [rect(0.86, -2.82, 1.9, 2.96), rect(2.12, -2.82, 3.16, 2.96)]
  return shapeFrom(pts, holes)
}

/** Barrette polyamide en I (rupture de pont thermique). */
export function polyamideBar(yCenter: number): THREE.Shape {
  const h = 0.22
  const y0 = yCenter - h
  const y1 = yCenter + h
  const pts: Pt[] = [
    [-0.68, y0],
    [-0.44, y0],
    [-0.44, yCenter - 0.08],
    [0.44, yCenter - 0.08],
    [0.44, y0],
    [0.68, y0],
    [0.68, y1],
    [0.44, y1],
    [0.44, yCenter + 0.08],
    [-0.44, yCenter + 0.08],
    [-0.44, y1],
    [-0.68, y1],
  ]
  return shapeFrom(pts)
}

/** Parclose clipsée côté intérieur. */
export function aluBeadShape(): THREE.Shape {
  const pts: Pt[] = [
    [0.6, 4.62],
    [1.18, 4.62],
    [1.18, 3.42],
    [0.98, 3.42],
    [0.98, 3.56],
    [0.82, 3.66],
    [0.98, 3.76],
    [0.98, 4.18],
    [0.6, 4.18],
  ]
  return shapeFrom(pts)
}

/* ---------------------------------------------------------------------- PVC */

/** Dormant PVC 5 chambres avec logement du renfort acier. */
export function pvcShape(): THREE.Shape {
  const r = 0.12
  const pts: Pt[] = [
    [-3.2, -3.2],
    [3.2, -3.2],
    [3.2, 3.2],
    [1.15, 3.2],
    [1.15, 4.1],
    [0.55, 4.1],
    [0.55, 3.2],
    [-0.95, 3.2],
    [-0.95, 4.65],
    [-1.6, 4.65],
    [-1.6, 3.2],
    [-3.2, 3.2],
  ]
  void r
  const holes: Pt[][] = [
    rect(-2.95, -2.9, -1.95, -0.2),
    rect(-2.95, 0.1, -1.95, 2.9),
    rect(-1.7, -2.9, -0.2, 2.9), // chambre centrale (renfort acier)
    rect(0.05, -2.9, 1.5, 2.9),
    rect(1.75, -2.9, 2.95, 0.5),
    rect(1.75, 0.8, 2.95, 2.9),
  ]
  return shapeFrom(pts, holes)
}

/* -------------------------------------------------------------------- verre */

export const glassUnit = {
  paneThickness: 0.32,
  gap: 0.56,
  height: 3.9,
  base: 3.5,
}
