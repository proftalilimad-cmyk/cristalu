import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Finish, GlassType } from '@/data/configurator'
import { finishProps, glassProps, glassEdgeProps } from './materials'

export type JoineryVariant = 'sliding' | 'casement' | 'rail' | 'panel'
export type JoineryFlavor = 'slats' | 'railing' | 'mirror'

export type JoineryConfig = {
  variant: JoineryVariant
  flavor?: JoineryFlavor
  /** Largeur hors-tout en mètres */
  width: number
  /** Hauteur hors-tout en mètres */
  height: number
  panels: number
  finish: Finish
  glass: GlassType
  reflections: boolean
  /** 0 = fermé · 1 = ouvert */
  open: number
  /** 0 = assemblé · 1 = éclaté (vue technique) */
  explode: number
  detail: number
}

export type JoineryMaterials = {
  alum: THREE.MeshPhysicalMaterial
  glass: THREE.MeshPhysicalMaterial
  glassEdge: THREE.MeshPhysicalMaterial
  rubber: THREE.MeshPhysicalMaterial
  steel: THREE.MeshPhysicalMaterial
  mirror: THREE.MeshPhysicalMaterial
}

/* ------------------------------------------------------------------ *
 *  Matériaux animés — les changements de teinte/vitrage sont interpolés
 * ------------------------------------------------------------------ */
function useDampedMaterial(
  create: () => THREE.MeshPhysicalMaterial,
  target: () => Partial<THREE.MeshPhysicalMaterial>,
  speed = 6,
) {
  const mat = useMemo(create, [])
  const targetRef = useRef<Partial<THREE.MeshPhysicalMaterial>>({})
  targetRef.current = target()

  useFrame((_, dt) => {
    const t = targetRef.current
    const k = 1 - Math.exp(-speed * Math.min(dt, 0.1))
    const m = mat as unknown as Record<string, unknown>
    for (const [key, value] of Object.entries(t)) {
      if (key === 'color') {
        mat.color.lerp(value as THREE.Color, k)
        continue
      }
      const cur = m[key]
      if (typeof cur !== 'number' || typeof value !== 'number') continue
      m[key] = cur + (value - cur) * k
    }
  })

  return mat
}

export function useJoineryMaterials(
  finish: Finish,
  glass: GlassType,
  reflections: boolean,
): JoineryMaterials {
  const alum = useDampedMaterial(
    () => new THREE.MeshPhysicalMaterial(finishProps(finish, reflections)),
    () => finishProps(finish, reflections),
  )

  const glassMat = useDampedMaterial(
    () => new THREE.MeshPhysicalMaterial({ ...glassProps(glass, reflections), transparent: true }),
    () => ({ ...glassProps(glass, reflections), transparent: true }),
  )

  const glassEdge = useDampedMaterial(
    () => new THREE.MeshPhysicalMaterial(glassEdgeProps(glass)),
    () => glassEdgeProps(glass),
    4,
  )

  const rubber = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#101215'),
        roughness: 0.92,
        metalness: 0.05,
        envMapIntensity: 0.3,
      }),
    [],
  )

  const steel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#c3cace'),
        roughness: 0.28,
        metalness: 0.98,
        envMapIntensity: 1.5,
      }),
    [],
  )

  const mirror = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#dfe6ea'),
        roughness: 0.035,
        metalness: 1,
        envMapIntensity: 2.1,
      }),
    [],
  )

  // Identité stable : évite de recréer les tableaux de matériaux à chaque rendu
  return useMemo(
    () => ({ alum, glass: glassMat, glassEdge, rubber, steel, mirror }),
    [alum, glassMat, glassEdge, rubber, steel, mirror],
  )
}

/* ------------------------------------------------------------------ *
 *  Briques élémentaires
 * ------------------------------------------------------------------ */
type BoxProps = {
  size: [number, number, number]
  position: [number, number, number]
  material: THREE.Material | THREE.Material[]
  rotation?: [number, number, number]
  groupRef?: RefObject<THREE.Mesh | null>
  radius?: number
}

function Box({ size, position, material, rotation, groupRef }: BoxProps) {
  return (
    <mesh ref={groupRef} position={position} rotation={rotation} material={material}>
      <boxGeometry args={size} />
    </mesh>
  )
}

/** Vitrage avec chant teinté (liseré vert-bleu du verre float). */
function Pane({
  size,
  position,
  materials,
  double,
}: {
  size: [number, number]
  position: [number, number, number]
  materials: JoineryMaterials
  double?: boolean
}) {
  const surfaces = useMemo(
    () => [
      materials.glassEdge,
      materials.glassEdge,
      materials.glassEdge,
      materials.glassEdge,
      materials.glass,
      materials.glass,
    ],
    [materials],
  )

  if (double) {
    return (
      <group position={position}>
        <mesh material={surfaces} position={[0, 0, 0.009]}>
          <boxGeometry args={[size[0], size[1], 0.005]} />
        </mesh>
        <mesh material={surfaces} position={[0, 0, -0.009]}>
          <boxGeometry args={[size[0], size[1], 0.005]} />
        </mesh>
        {/* Intercalaire aluminium entre les deux vitrages */}
        <group>
          <Box size={[size[0] + 0.006, 0.014, 0.026]} position={[0, size[1] / 2, 0]} material={materials.alum} />
          <Box size={[size[0] + 0.006, 0.014, 0.026]} position={[0, -size[1] / 2, 0]} material={materials.alum} />
          <Box size={[0.014, size[1], 0.026]} position={[-size[0] / 2, 0, 0]} material={materials.alum} />
          <Box size={[0.014, size[1], 0.026]} position={[size[0] / 2, 0, 0]} material={materials.alum} />
        </group>
      </group>
    )
  }

  return (
    <mesh material={surfaces} position={position}>
      <boxGeometry args={[size[0], size[1], 0.006]} />
    </mesh>
  )
}

/** Poignée : embase + tige brossée. */
function Handle({
  position,
  material,
  side = 1,
}: {
  position: [number, number, number]
  material: THREE.Material
  side?: 1 | -1
}) {
  return (
    <group position={position}>
      <Box size={[0.03, 0.13, 0.012]} position={[0, 0, 0.006]} material={material} />
      <Box size={[0.012, 0.1, 0.026]} position={[side * 0.014, 0, 0.024]} material={material} />
    </group>
  )
}

/* Constantes de profil — géométrie d'une menuiserie aluminium réelle */
const DEPTH = 0.108
const FACE = 0.055
const SILL = 0.078
const SASH = 0.048
const SASH_D = 0.062
const OVERLAP = 0.03

type AssemblyProps = {
  cfg: JoineryConfig
  mats: JoineryMaterials
  openRef: RefObject<number>
  explodeRef: RefObject<number>
}

/* ------------------------------------------------------------------ *
 *  Cadre dormant commun (fenêtre / baie / porte)
 * ------------------------------------------------------------------ */
function DormantFrame({
  cfg,
  mats,
  explodeRef,
  children,
}: AssemblyProps & { children?: React.ReactNode }) {
  const g = useRef<THREE.Group>(null)
  const { width: w, height: h, detail } = cfg
  const opH = h - FACE - SILL
  const opY = (SILL - FACE) / 2

  useFrame(() => {
    if (!g.current) return
    g.current.position.z = -0.34 * (explodeRef.current ?? 0)
  })

  return (
    <group ref={g}>
      {/* Traverse haute */}
      <Box size={[w, FACE, DEPTH]} position={[0, h / 2 - FACE / 2, 0]} material={mats.alum} />
      {/* Traverse basse (seuil) */}
      <Box size={[w, SILL, DEPTH]} position={[0, -h / 2 + SILL / 2, 0]} material={mats.alum} />
      {/* Montants */}
      <Box size={[FACE, opH, DEPTH]} position={[-w / 2 + FACE / 2, opY, 0]} material={mats.alum} />
      <Box size={[FACE, opH, DEPTH]} position={[w / 2 - FACE / 2, opY, 0]} material={mats.alum} />

      {/* Rainures de rail (coulissant) */}
      <Box size={[w - FACE * 2, 0.012, 0.016]} position={[0, -h / 2 + SILL + 0.006, 0.033]} material={mats.alum} />
      <Box size={[w - FACE * 2, 0.012, 0.016]} position={[0, -h / 2 + SILL + 0.006, -0.033]} material={mats.alum} />
      <Box size={[w - FACE * 2, 0.01, 0.014]} position={[0, h / 2 - FACE - 0.005, 0.033]} material={mats.alum} />

      {/* Parclose (joint de vitrage intérieur) — détail haute qualité */}
      {detail >= 2 && (
        <group position={[0, opY, 0.046]}>
          <Box size={[w - FACE * 2, 0.02, 0.03]} position={[0, opH / 2 - 0.01, 0]} material={mats.alum} />
          <Box size={[w - FACE * 2, 0.02, 0.03]} position={[0, -opH / 2 + 0.01, 0]} material={mats.alum} />
          <Box size={[0.02, opH, 0.03]} position={[-w / 2 + FACE + 0.01, 0, 0]} material={mats.alum} />
          <Box size={[0.02, opH, 0.03]} position={[w / 2 - FACE - 0.01, 0, 0]} material={mats.alum} />
        </group>
      )}

      {/* Joint d'étanchéité périphérique */}
      <Box
        size={[w - FACE * 2 - 0.01, 0.012, DEPTH * 0.75]}
        position={[0, h / 2 - FACE - 0.008, 0]}
        material={mats.rubber}
      />
      <Box
        size={[w - FACE * 2 - 0.01, 0.012, DEPTH * 0.75]}
        position={[0, -h / 2 + SILL + 0.008, 0]}
        material={mats.rubber}
      />
      {children}
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Vantail coulissant
 * ------------------------------------------------------------------ */
function SlidingSash({
  cfg,
  mats,
  openRef,
  explodeRef,
  index,
  pw,
  ph,
  xAt,
  y,
  z,
}: AssemblyProps & {
  index: number
  pw: number
  ph: number
  xAt: (i: number, open: number) => number
  y: number
  z: number
}) {
  const g = useRef<THREE.Group>(null)
  const { glass: gt, detail } = cfg

  useFrame(() => {
    if (!g.current) return
    const e = explodeRef.current ?? 0
    g.current.position.x = xAt(index, openRef.current ?? 0)
    g.current.position.z = z + e * (0.6 + index * 0.22)
  })

  const innerW = pw - SASH * 2
  const innerH = ph - SASH * 2.15

  return (
    <group ref={g} position={[xAt(index, 0), y, z]}>
      {/* Dormant de vantail */}
      <Box size={[pw, SASH, SASH_D]} position={[0, ph / 2 - SASH / 2, 0]} material={mats.alum} />
      <Box size={[pw, SASH * 1.15, SASH_D]} position={[0, -ph / 2 + SASH * 0.575, 0]} material={mats.alum} />
      <Box
        size={[SASH, ph - SASH * 2.15, SASH_D]}
        position={[-pw / 2 + SASH / 2, 0, 0]}
        material={mats.alum}
      />
      {/* Montant d'interbâillement : plus large, c'est lui qui porte le joint */}
      <Box
        size={[SASH * 1.35, ph - SASH * 2.15, SASH_D]}
        position={[pw / 2 - SASH * 0.675, 0, 0]}
        material={mats.alum}
      />
      <Box
        size={[0.012, ph - SASH * 2.4, SASH_D * 0.8]}
        position={[pw / 2 - SASH * 1.32, 0, 0]}
        material={mats.rubber}
      />

      {/* Vitrage */}
      <Pane
        size={[innerW, innerH]}
        position={[0, 0, 0]}
        materials={mats}
        double={gt.double}
      />

      {/* Quincaillerie */}
      <Handle
        position={[pw / 2 - SASH * 1.5, gt.double ? -0.02 : 0, SASH_D / 2]}
        material={mats.steel}
        side={-1}
      />
      {detail >= 2 && (
        <>
          {/* Galets de roulement */}
          <Box size={[0.05, 0.028, 0.022]} position={[-pw / 2 + 0.07, -ph / 2 + 0.012, 0]} material={mats.steel} />
          <Box size={[0.05, 0.028, 0.022]} position={[pw / 2 - 0.07, -ph / 2 + 0.012, 0]} material={mats.steel} />
        </>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Vantail battant (à la française)
 * ------------------------------------------------------------------ */
function CasementSash({
  cfg,
  mats,
  openRef,
  explodeRef,
  index,
  count,
  pw,
  ph,
  hingeX,
  dir,
  y,
}: AssemblyProps & {
  index: number
  count: number
  pw: number
  ph: number
  hingeX: number
  dir: 1 | -1
  y: number
}) {
  const hinge = useRef<THREE.Group>(null)
  const { glass: gt, detail } = cfg

  useFrame(() => {
    if (!hinge.current) return
    const e = explodeRef.current ?? 0
    const o = openRef.current ?? 0
    // L'ouverture maximale est limitée à ~62° (comme une vraie fenêtre)
    hinge.current.rotation.y = -dir * o * 1.08
    hinge.current.position.z = e * (0.5 + index * 0.25)
  })

  const innerW = pw - SASH * 2
  const innerH = ph - SASH * 2.15

  return (
    <group ref={hinge} position={[hingeX, y, 0]}>
      <group position={[(dir * pw) / 2, 0, 0]}>
        <Box size={[pw, SASH, SASH_D]} position={[0, ph / 2 - SASH / 2, 0]} material={mats.alum} />
        <Box size={[pw, SASH * 1.15, SASH_D]} position={[0, -ph / 2 + SASH * 0.575, 0]} material={mats.alum} />
        <Box size={[SASH, ph - SASH * 2.15, SASH_D]} position={[(-dir * pw) / 2 + (dir * SASH) / 2, 0, 0]} material={mats.alum} />
        <Box size={[SASH * 1.2, ph - SASH * 2.15, SASH_D]} position={[(dir * pw) / 2 - (dir * SASH * 0.6), 0, 0]} material={mats.alum} />
        <Box size={[0.012, ph - SASH * 2.4, SASH_D * 0.8]} position={[(dir * pw) / 2 - dir * SASH * 1.24, 0, 0]} material={mats.rubber} />
        <Pane size={[innerW, innerH]} position={[0, 0, 0]} materials={mats} double={gt.double} />
        <Handle
          position={[(dir * pw) / 2 - dir * SASH * 1.7, gt.double ? -0.02 : 0, SASH_D / 2]}
          material={mats.steel}
          side={dir === 1 ? -1 : 1}
        />
        {detail >= 2 && count > 1 && (
          <Box size={[0.03, 0.03, 0.02]} position={[(dir * pw) / 2 - dir * 0.02, 0, 0]} material={mats.steel} />
        )}
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Pergola — lames orientables
 * ------------------------------------------------------------------ */
function PergolaAssembly({ cfg, mats, openRef }: AssemblyProps) {
  const blades = useRef<THREE.Group>(null)
  const { width: w, height: h } = cfg
  const d = w * 0.52
  const post = 0.1
  const bladeCount = Math.max(6, Math.round(w * 3.2))
  const bladeY = h - 0.19

  useFrame(() => {
    if (!blades.current) return
    const o = openRef.current ?? 0
    blades.current.children.forEach((child) => {
      child.rotation.x = o * (Math.PI / 2)
    })
  })

  const zs = useMemo(() => {
    const arr: number[] = []
    const inner = d - 0.22
    for (let i = 0; i < bladeCount; i++) {
      arr.push(-inner / 2 + (i * inner) / (bladeCount - 1))
    }
    return arr
  }, [bladeCount, d])

  return (
    <group position={[0, -h / 2, 0]}>
      {/* Poteaux */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <Box
          key={i}
          size={[post, h, post]}
          position={[sx * (w / 2 - post / 2), h / 2, sz * (d / 2 - post / 2)]}
          material={mats.alum}
        />
      ))}
      {/* Poutres périmétriques */}
      <Box size={[w, 0.14, 0.1]} position={[0, h - 0.07, d / 2 - 0.05]} material={mats.alum} />
      <Box size={[w, 0.14, 0.1]} position={[0, h - 0.07, -d / 2 + 0.05]} material={mats.alum} />
      <Box size={[0.1, 0.14, d]} position={[w / 2 - 0.05, h - 0.07, 0]} material={mats.alum} />
      <Box size={[0.1, 0.14, d]} position={[-w / 2 + 0.05, h - 0.07, 0]} material={mats.alum} />
      {/* Gouttière */}
      <Box size={[w - 0.16, 0.05, 0.06]} position={[0, h - 0.16, d / 2 - 0.08]} material={mats.alum} />
      {/* Lames orientables */}
      <group ref={blades}>
        {zs.map((z, i) => (
          <Box key={i} size={[w - 0.2, 0.016, 0.096]} position={[0, bladeY, z]} material={mats.alum} />
        ))}
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Volet roulant — lames qui remontent dans le coffre
 * ------------------------------------------------------------------ */
function ShutterAssembly({ cfg, mats, openRef, explodeRef }: AssemblyProps) {
  const slats = useRef<THREE.Group>(null)
  const { width: w, height: h, detail } = cfg
  const opH = h - FACE - SILL
  const count = 16
  const closedGap = (opH - 0.06) / (count - 1)
  const openGap = 0.012
  const topOpen = h / 2 - 0.18
  const g = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!g.current) return
    g.current.position.z = -0.2 * (explodeRef.current ?? 0)
    const group = slats.current
    if (!group) return
    const o = openRef.current ?? 0
    const gap = closedGap + (openGap - closedGap) * o
    void gap
    group.children.forEach((child, i) => {
      const closedY = -opH / 2 + 0.03 + i * closedGap
      const stackedY = topOpen - i * openGap
      child.position.y = closedY + (stackedY - closedY) * o
    })
  })

  return (
    <group ref={g}>
      {/* Coffre */}
      <Box size={[w, 0.19, DEPTH * 1.5]} position={[0, h / 2 - 0.095, 0]} material={mats.alum} />
      <Box size={[w - 0.06, 0.02, DEPTH * 1.4]} position={[0, h / 2 - 0.198, 0]} material={mats.rubber} />
      {/* Coulisses latérales */}
      <Box size={[0.036, h - 0.2, 0.05]} position={[-w / 2 + 0.018, -0.09, 0.012]} material={mats.alum} />
      <Box size={[0.036, h - 0.2, 0.05]} position={[w / 2 - 0.018, -0.09, 0.012]} material={mats.alum} />
      <Box size={[w - 0.06, 0.03, 0.05]} position={[0, -h / 2 + 0.015, 0.012]} material={mats.alum} />
      {detail >= 2 && <Box size={[w - 0.05, 0.06, 0.02]} position={[0, -h / 2 + 0.06, 0.02]} material={mats.rubber} />}
      {/* Lames */}
      <group ref={slats}>
        {Array.from({ length: count }, (_, i) => (
          <group key={i} position={[0, 0, 0.012]}>
            <Box size={[w - 0.075, 0.052, 0.032]} position={[0, 0, 0]} material={mats.alum} />
            <Box size={[w - 0.075, 0.008, 0.036]} position={[0, 0.022, 0]} material={mats.rubber} />
          </group>
        ))}
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Garde-corps verre & miroiterie
 * ------------------------------------------------------------------ */
function PanelAssembly({ cfg, mats, openRef, explodeRef }: AssemblyProps) {
  const slide = useRef<THREE.Group>(null)
  const { width: w, height: h, flavor = 'railing', glass: gt, detail } = cfg

  useFrame(() => {
    if (!slide.current) return
    const o = openRef.current ?? 0
    const e = explodeRef.current ?? 0
    slide.current.position.x = flavor === 'mirror' ? o * w * 0.34 : o * w * 0.4
    slide.current.position.z = e * 0.5
  })

  if (flavor === 'mirror') {
    return (
      <group>
        <Box size={[w, 0.05, 0.06]} position={[0, -h / 2 + 0.025, 0]} material={mats.alum} />
        <Box size={[w, 0.05, 0.06]} position={[0, h / 2 - 0.025, 0]} material={mats.alum} />
        <Box size={[0.05, h, 0.06]} position={[-w / 2 + 0.025, 0, 0]} material={mats.alum} />
        <group ref={slide}>
          <Box size={[0.05, h, 0.06]} position={[w / 2 - 0.025, 0, 0]} material={mats.alum} />
          <Box size={[w - 0.06, 0.012, 0.02]} position={[0, 0, 0]} material={mats.mirror} />
          <mesh position={[0, 0, -0.014]} material={mats.mirror}>
            <boxGeometry args={[w - 0.06, h - 0.06, 0.004]} />
          </mesh>
        </group>
      </group>
    )
  }

  const glassH = h - 0.28
  return (
    <group>
      {/* Profil de base aluminium */}
      <Box size={[w, 0.1, 0.13]} position={[0, -h / 2 + 0.05, 0]} material={mats.alum} />
      <Box size={[w - 0.02, 0.02, 0.11]} position={[0, -h / 2 + 0.11, 0]} material={mats.rubber} />
      {/* Poteaux */}
      {[-1, 1].map((s) => (
        <Box key={s} size={[0.05, h, 0.05]} position={[s * (w / 2 - 0.025), 0, 0]} material={mats.alum} />
      ))}
      {/* Vitrage feuilleté */}
      <mesh position={[0, 0.1, 0]} material={mats.glass}>
        <boxGeometry args={[w - 0.1, glassH, 0.016]} />
      </mesh>
      {/* Main courante */}
      <group ref={slide}>
        <Box size={[w - 0.06, 0.045, 0.07]} position={[0, h / 2 - 0.0225, 0.01]} material={mats.alum} />
      </group>
      {detail >= 2 && (
        <>
          <Box size={[w - 0.1, 0.012, 0.02]} position={[0, -h / 2 + 0.135, 0]} material={mats.steel} />
          <Box size={[0.03, 0.012, 0.014]} position={[0, -h / 2 + 0.155, gt.double ? 0.004 : 0]} material={mats.steel} />
        </>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ *
 *  Produit complet
 * ------------------------------------------------------------------ */
export function JoineryProduct({
  cfg,
  mats,
  driveRef,
}: {
  cfg: JoineryConfig
  mats: JoineryMaterials
  /** Valeur d'ouverture pilotée image par image (respirations, hover…) */
  driveRef?: RefObject<number>
}) {
  const openRef = useRef(cfg.open)
  const explodeRef = useRef(cfg.explode)

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-4.4 * Math.min(dt, 0.1))
    const targetOpen = driveRef?.current ?? cfg.open ?? 0
    openRef.current += (targetOpen - openRef.current) * k
    explodeRef.current += ((cfg.explode ?? 0) - explodeRef.current) * k
  })

  const { width: w, height: h, panels, variant, glass: gt } = cfg
  const opW = w - FACE * 2
  const opH = h - FACE - SILL
  const opY = (SILL - FACE) / 2
  const pw = (opW + (panels - 1) * OVERLAP) / panels
  const ph = opH + 0.052

  if (variant === 'rail') {
    return <PergolaAssembly cfg={cfg} mats={mats} openRef={openRef} explodeRef={explodeRef} />
  }

  if (variant === 'panel') {
    return (
      <group>
        {cfg.flavor === 'slats' ? (
          <ShutterAssembly cfg={cfg} mats={mats} openRef={openRef} explodeRef={explodeRef} />
        ) : (
          <PanelAssembly cfg={cfg} mats={mats} openRef={openRef} explodeRef={explodeRef} />
        )}
      </group>
    )
  }

  const xAt = (i: number, open: number) => {
    const base = -opW / 2 + pw / 2 + i * (pw - OVERLAP)
    return base - i * (pw - OVERLAP) * open
  }

  return (
    <DormantFrame cfg={cfg} mats={mats} openRef={openRef} explodeRef={explodeRef}>
      {variant === 'sliding'
        ? Array.from({ length: panels }, (_, i) => (
            <SlidingSash
              key={i}
              cfg={cfg}
              mats={mats}
              openRef={openRef}
              explodeRef={explodeRef}
              index={i}
              pw={pw}
              ph={ph}
              xAt={xAt}
              y={opY}
              z={0.034 - i * 0.023}
            />
          ))
        : Array.from({ length: panels }, (_, i) => {
            const dir: 1 | -1 = panels === 1 ? 1 : i === 0 ? 1 : -1
            const hingeX = panels === 1 ? -opW / 2 : i === 0 ? -opW / 2 : opW / 2
            return (
              <CasementSash
                key={i}
                cfg={cfg}
                mats={mats}
                openRef={openRef}
                explodeRef={explodeRef}
                index={i}
                count={panels}
                pw={panels === 1 ? opW : opW / 2}
                ph={ph}
                hingeX={hingeX}
                dir={dir}
                y={opY}
              />
            )
          })}
      {/* Refend central pour les menuiseries à deux vantaux */}
      {variant === 'casement' && panels === 2 && (
        <Box size={[0.04, opH, DEPTH * 0.9]} position={[0, opY, 0]} material={mats.alum} />
      )}
      {gt.double && variant === 'sliding' && <group />}
    </DormantFrame>
  )
}
