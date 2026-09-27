import * as THREE from 'three'

/**
 * Coupes de profilés aluminium extrudés — géométries paramétriques.
 *
 * Unités de dessin : 1 = 1 mm (les géométries sont ensuite mises à l'échelle
 * dans la scène). Les sections reprennent la logique d'un profilé à rainures
 * en T : parois avec rainures (lèvre + gorge), noyau central percé, voiles
 * diagonaux en X et chambres d'allègement.
 */

export type Pt = [number, number]

/* ------------------------------------------------------------------ utils */

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

/** rotation d'un point de k × 90° (sens trigonométrique) */
function rot90(p: Pt, k: number): Pt {
  let [x, y] = p
  for (let i = 0; i < ((k % 4) + 4) % 4; i += 1) {
    const nx = -y
    const ny = x
    x = nx
    y = ny
  }
  return [x, y]
}

const translate = (pts: Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]) => [x + dx, y + dy])

function circlePts(cx: number, cy: number, r: number, segments = 28, ccw = true): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < segments; i += 1) {
    const a = (i / segments) * Math.PI * 2 * (ccw ? 1 : -1)
    out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return out
}

/* ------------------------------------------------------- profilé à rainures */

export type SlotProfileOptions = {
  /** largeur de l'ouverture de rainure (lèvres) */
  opening: number
  /** profondeur de la lèvre */
  lip: number
  /** largeur de la gorge intérieure */
  grooveWidth: number
  /** profondeur de la gorge */
  grooveDepth: number
  /** chanfrein d'angle */
  chamfer: number
  /** rayon extérieur du noyau */
  hub: number
  /** rayon du perçage central */
  bore: number
  /** demi-épaisseur des voiles diagonaux (mesurée sur l'axe Y) */
  web: number
}

export const SLOT_DEFAULTS: SlotProfileOptions = {
  opening: 10,
  lip: 3,
  grooveWidth: 17,
  grooveDepth: 5,
  chamfer: 4,
  hub: 4.6,
  bore: 2.6,
  web: 2,
}

/** épaisseur de paroi entre le fond de gorge et les chambres */
const WALL = 1.8

/**
 * Points d'une face plane (repère local : face en y = -halfDist, parcourue de
 * gauche à droite), avec une encoche de rainure à chaque centre demandé.
 */
function facePoints(
  halfDist: number,
  tangentHalf: number,
  slotCenters: number[],
  o: SlotProfileOptions,
): Pt[] {
  const pts: Pt[] = [[-(tangentHalf - o.chamfer), -halfDist]]
  for (const c of slotCenters) {
    pts.push(
      [c - o.opening / 2, -halfDist],
      [c - o.opening / 2, -(halfDist - o.lip)],
      [c - o.grooveWidth / 2, -(halfDist - o.lip)],
      [c - o.grooveWidth / 2, -(halfDist - o.lip - o.grooveDepth)],
      [c + o.grooveWidth / 2, -(halfDist - o.lip - o.grooveDepth)],
      [c + o.grooveWidth / 2, -(halfDist - o.lip)],
      [c + o.opening / 2, -(halfDist - o.lip)],
      [c + o.opening / 2, -halfDist],
    )
  }
  pts.push([tangentHalf - o.chamfer, -halfDist])
  return pts
}

/**
 * Chambre d'allègement : secteur compris entre deux voiles diagonaux, le noyau
 * et le fond de la gorge. Générée pour la direction +X puis pivotée.
 */
function chamberPoints(reach: number, o: SlotProfileOptions, segments = 12): Pt[] {
  const yEdge = reach - o.web
  // intersection de la droite y = -x + web avec le cercle du noyau
  const a = 2
  const b = -2 * o.web
  const c = o.web * o.web - o.hub * o.hub
  const x = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a)
  const y = -x + o.web
  const start = Math.atan2(y, x)
  const end = -start

  const pts: Pt[] = [
    [reach, yEdge],
    [reach, -yEdge],
  ]
  for (let i = 0; i <= segments; i += 1) {
    const ang = start + ((end - start) * i) / segments
    pts.push([Math.cos(ang) * o.hub, Math.sin(ang) * o.hub])
  }
  return pts
}

/** Cellule intérieure (noyau + 4 chambres) centrée sur (cx, cy). */
function cellHoles(cx: number, cy: number, reach: number, o: SlotProfileOptions): Pt[][] {
  const base = chamberPoints(reach, o)
  const holes: Pt[][] = []
  for (let k = 0; k < 4; k += 1) {
    holes.push(translate(base.map((p) => rot90(p, k)), cx, cy))
  }
  holes.push(translate(circlePts(0, 0, o.bore, 24, false), cx, cy))
  return holes
}

/** Profilé carré à rainures (ex. 40 × 40). */
export function slotSquareShape(size = 40, opts: Partial<SlotProfileOptions> = {}): THREE.Shape {
  const o = { ...SLOT_DEFAULTS, ...opts }
  const half = size / 2
  const outline: Pt[] = []
  for (let k = 0; k < 4; k += 1) {
    outline.push(...facePoints(half, half, [0], o).map((p) => rot90(p, k)))
  }
  const reach = half - o.lip - o.grooveDepth - WALL
  return shapeFrom(outline, cellHoles(0, 0, reach, o))
}

/** Profilé double (ex. 40 × 80) : deux cellules, 2 rainures par grande face. */
export function slotDoubleShape(
  width = 40,
  height = 80,
  opts: Partial<SlotProfileOptions> = {},
): THREE.Shape {
  const o = { ...SLOT_DEFAULTS, ...opts }
  const hx = width / 2
  const hy = height / 2
  const cell = height / 4 // centres des cellules : ±20

  const outline: Pt[] = [
    // face basse (normale -Y)
    ...facePoints(hy, hx, [0], o),
    // face droite (normale +X) -> rotation 90°
    ...facePoints(hx, hy, [-cell, cell], o).map((p) => rot90(p, 1)),
    // face haute
    ...facePoints(hy, hx, [0], o).map((p) => rot90(p, 2)),
    // face gauche
    ...facePoints(hx, hy, [-cell, cell], o).map((p) => rot90(p, 3)),
  ]

  const reach = hx - o.lip - o.grooveDepth - WALL
  return shapeFrom(outline, [...cellHoles(0, -cell, reach, o), ...cellHoles(0, cell, reach, o)])
}

/** Profilé rond à rainures (ex. Ø 40) : 4 rainures réparties à 90°. */
export function slotRoundShape(diameter = 40, opts: Partial<SlotProfileOptions> = {}): THREE.Shape {
  const o = { ...SLOT_DEFAULTS, ...opts }
  const R = diameter / 2
  const halfOpen = Math.asin(o.opening / 2 / R) // demi-angle de l'ouverture
  const outline: Pt[] = []

  for (let k = 0; k < 4; k += 1) {
    const centre = -Math.PI / 2 + (k * Math.PI) / 2
    // arc entre la rainure k et la rainure k+1
    const a0 = centre + halfOpen
    const a1 = centre + Math.PI / 2 - halfOpen
    const seg = 10
    for (let i = 0; i <= seg; i += 1) {
      const a = a0 + ((a1 - a0) * i) / seg
      outline.push([Math.cos(a) * R, Math.sin(a) * R])
    }
    // encoche de la rainure k+1 (repère local : face en y = -R)
    const notch: Pt[] = [
      [-o.opening / 2, -(R - o.lip)],
      [-o.grooveWidth / 2, -(R - o.lip)],
      [-o.grooveWidth / 2, -(R - o.lip - o.grooveDepth)],
      [o.grooveWidth / 2, -(R - o.lip - o.grooveDepth)],
      [o.grooveWidth / 2, -(R - o.lip)],
      [o.opening / 2, -(R - o.lip)],
    ]
    outline.push(...notch.map((p) => rot90(p, k + 1)))
  }

  const reach = R - o.lip - o.grooveDepth - WALL
  return shapeFrom(outline, cellHoles(0, 0, reach, o))
}

/* ------------------------------------------------------------- extrusion */

export function extrude(shape: THREE.Shape, depth: number, bevel = 0.5): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 12,
    steps: 1,
  })
  geo.translate(0, 0, -depth / 2)
  geo.computeVertexNormals()
  return geo
}

/* --------------------------------------------------- disposition de la scène */

export type LayoutItem = {
  id: string
  kind: 'square' | 'double' | 'round'
  length: number
  position: [number, number, number]
  rotation: [number, number, number]
}

/**
 * Mise en scène « photo produit » : trois barres longues en fond,
 * trois tronçons coupés au premier plan (faces de coupe vers la caméra).
 */
export const ALU_LAYOUT: LayoutItem[] = [
  // barres longues en fond, légèrement éventail
  { id: 'bar-round', kind: 'round', length: 320, position: [-6, 74, -30], rotation: [0.04, -1.02, 0.28] },
  { id: 'bar-double', kind: 'double', length: 340, position: [16, 20, 6], rotation: [0.04, -1.02, 0.3] },
  { id: 'bar-square', kind: 'square', length: 320, position: [40, -24, 42], rotation: [0.04, -1.02, 0.32] },
  // tronçons coupés au premier plan, face de coupe vers la caméra
  { id: 'cut-round', kind: 'round', length: 40, position: [-94, -88, 126], rotation: [0.18, -0.72, 0.1] },
  { id: 'cut-double', kind: 'double', length: 40, position: [0, -92, 138], rotation: [0.18, -0.66, 0.02] },
  { id: 'cut-square', kind: 'square', length: 40, position: [96, -88, 126], rotation: [0.18, -0.72, -0.08] },
]

/* ------------------------------------------------------- menuiserie PVC/verre */

/** Dormant PVC multi-chambres avec logement du renfort acier (cotes en mm). */
export function pvcFrameShape(): THREE.Shape {
  const pts: Pt[] = [
    [-32, -32],
    [32, -32],
    [32, 32],
    [11.5, 32],
    [11.5, 41],
    [5.5, 41],
    [5.5, 32],
    [-9.5, 32],
    [-9.5, 46.5],
    [-16, 46.5],
    [-16, 32],
    [-32, 32],
  ]
  const holes: Pt[][] = [
    rect(-29.5, -29, -19.5, -2),
    rect(-29.5, 1, -19.5, 29),
    rect(-17, -29, -2, 29),
    rect(0.5, -29, 15, 29),
    rect(17.5, -29, 29.5, 5),
    rect(17.5, 8, 29.5, 29),
  ]
  return shapeFrom(pts, holes)
}

export const PVC_LAYOUT: LayoutItem[] = [
  { id: 'pvc-bar-1', kind: 'square', length: 330, position: [10, 50, -24], rotation: [0.04, -1.02, 0.28] },
  { id: 'pvc-bar-2', kind: 'square', length: 330, position: [34, -6, 24], rotation: [0.04, -1.02, 0.32] },
  { id: 'pvc-cut-1', kind: 'square', length: 44, position: [-70, -92, 132], rotation: [0.18, -0.68, 0.06] },
  { id: 'pvc-cut-2', kind: 'square', length: 44, position: [34, -96, 140], rotation: [0.18, -0.6, -0.04] },
]

/** Vitrage isolant (mm). */
export const glassUnit = {
  paneThickness: 6,
  gap: 16,
  width: 150,
  height: 190,
}
