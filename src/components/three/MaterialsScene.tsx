import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import aluSection from './aluSection.json'

/* ------------------------------------------------------------- materials */

type MatKey = 'alu' | 'polyamide' | 'epdm' | 'steel' | 'glass'

function createMaterials() {
  {
    /** Aluminium anodisé : faces extrudées (longueur du profilé). */
    const aluShell = new THREE.MeshPhysicalMaterial({
      color: '#aeb4b9',
      metalness: 1,
      roughness: 0.3,
      clearcoat: 0.35,
      clearcoatRoughness: 0.25,
      envMapIntensity: 1.5,
    })
    /** Faces de coupe : aspect scié, plus mat et plus clair. */
    const aluCut = new THREE.MeshPhysicalMaterial({
      color: '#c9ced2',
      metalness: 0.95,
      roughness: 0.55,
      envMapIntensity: 1.1,
    })
    const polyamide = new THREE.MeshStandardMaterial({
      color: '#2a2c2f',
      roughness: 0.82,
      metalness: 0,
    })
    const epdm = new THREE.MeshStandardMaterial({ color: '#121314', roughness: 0.95, metalness: 0 })
    const steel = new THREE.MeshStandardMaterial({
      color: '#949a9f',
      metalness: 0.92,
      roughness: 0.32,
      envMapIntensity: 1.2,
    })
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#dfeaef',
      transmission: 1,
      thickness: 0.28,
      roughness: 0.045,
      ior: 1.49,
      reflectivity: 0.55,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      transparent: true,
      opacity: 1,
    })
    const pvc = new THREE.MeshPhysicalMaterial({
      color: '#f2f3f4',
      metalness: 0,
      roughness: 0.42,
      clearcoat: 0.5,
      clearcoatRoughness: 0.32,
      envMapIntensity: 0.85,
    })
    const pvcCut = new THREE.MeshStandardMaterial({ color: '#e7e9ea', roughness: 0.75 })

    /** Vitrage de la coupe : transparence simple (moins coûteux que la réfraction). */
    const glassLite = new THREE.MeshPhysicalMaterial({
      color: '#cfe0e8',
      metalness: 0,
      roughness: 0.08,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.03,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide,
    })

    const byKey: Record<MatKey, THREE.Material | THREE.Material[]> = {
      alu: [aluCut, aluShell],
      polyamide,
      epdm,
      steel,
      glass: glassLite,
    }
    return { byKey, glass, pvc, pvcCut, steel, epdm }
  }
}

/** Matériaux partagés par toute la scène (créés une seule fois). */
const M = createMaterials()

/* -------------------------------------------------------------- geometry */

const EXTRUDE = {
  depth: 3.6,
  bevelEnabled: true,
  bevelThickness: 0.012,
  bevelSize: 0.012,
  bevelSegments: 2,
  curveSegments: 14,
}

function buildShape(outline: number[][], holes: number[][][]) {
  const shape = new THREE.Shape()
  outline.forEach(([x, y], i) => (i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y)))
  shape.closePath()
  holes.forEach((hole) => {
    const path = new THREE.Path()
    hole.forEach(([x, y], i) => (i === 0 ? path.moveTo(x, y) : path.lineTo(x, y)))
    path.closePath()
    shape.holes.push(path)
  })
  return shape
}

/** Coupe réelle d'un profilé aluminium à rupture de pont thermique. */
function useAluParts() {
  return useMemo(() => {
    return aluSection.parts.map((part) => {
      const geo = new THREE.ExtrudeGeometry(buildShape(part.outline, part.holes), EXTRUDE)
      geo.translate(0, 0, -EXTRUDE.depth / 2)
      geo.computeVertexNormals()
      return { id: part.id, mat: part.mat as MatKey, geo }
    })
  }, [])
}

/** Dormant PVC multi-chambres avec renfort acier. */
function usePvcGeometry() {
  return useMemo(() => {
    const w = 1.5
    const h = 2.0
    const r = 0.07
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2 + r, -h / 2)
    shape.lineTo(w / 2 - r, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    shape.lineTo(w / 2, h / 2 - r)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    shape.lineTo(-w / 2 + r, h / 2)
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
    shape.lineTo(-w / 2, -h / 2 + r)
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

    const chamber = (x: number, y: number, hw: number, hh: number) => {
      const p = new THREE.Path()
      p.moveTo(x - hw, y - hh)
      p.lineTo(x + hw, y - hh)
      p.lineTo(x + hw, y + hh)
      p.lineTo(x - hw, y + hh)
      p.closePath()
      return p
    }
    // 5 chambres : centrale (renfort), 2 hautes, 2 basses
    shape.holes.push(chamber(0, 0.02, 0.32, 0.4))
    shape.holes.push(chamber(-0.45, 0.58, 0.18, 0.26))
    shape.holes.push(chamber(0.45, 0.58, 0.18, 0.26))
    shape.holes.push(chamber(-0.45, -0.54, 0.18, 0.26))
    shape.holes.push(chamber(0.45, -0.54, 0.18, 0.26))

    const geo = new THREE.ExtrudeGeometry(shape, { ...EXTRUDE, bevelThickness: 0.02, bevelSize: 0.02 })
    geo.translate(0, 0, -EXTRUDE.depth / 2)
    geo.computeVertexNormals()
    return geo
  }, [])
}

/* ---------------------------------------------------------------- pieces */

type SceneProps = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }

function AluminiumProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const parts = useAluParts()

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp(p * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.75 + t * 1.5 + px * 0.22, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.16 + py * 0.12, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(0.4, -3.6, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, THREE.MathUtils.lerp(-0.25, 0.1, t), 4, dt)
  })

  return (
    <group ref={group} position={[0.4, -0.25, 0]}>
      {/* la coupe est dessinée en coordonnées réelles : on la recentre */}
      <group position={[0, -0.4, 0]} scale={1.15}>
        {parts.map((part) => (
          <mesh
            key={part.id}
            geometry={part.geo}
            material={M.byKey[part.mat] as THREE.Material}
          />
        ))}
      </group>
    </group>
  )
}

function PvcProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const geo = usePvcGeometry()
  const { pvc, pvcCut, steel, epdm } = M

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.33) * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.65 + t * 1.35 + px * 0.2, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.15 + py * 0.1, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(4.4, -3.4, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, THREE.MathUtils.lerp(-0.4, 0, t), 4, dt)
  })

  return (
    <group ref={group} position={[4.4, -0.4, 0]}>
      <mesh geometry={geo} material={[pvcCut, pvc]} />
      {/* renfort acier galvanisé dans la chambre centrale */}
      <mesh position={[0, 0.02, 0]} material={steel}>
        <boxGeometry args={[0.58, 0.74, 3.55]} />
      </mesh>
      {/* joints EPDM */}
      <mesh position={[0.78, 0.42, 0]} material={epdm}>
        <boxGeometry args={[0.11, 0.2, 3.6]} />
      </mesh>
      <mesh position={[0.78, -0.42, 0]} material={epdm}>
        <boxGeometry args={[0.11, 0.2, 3.6]} />
      </mesh>
    </group>
  )
}

function GlassPanel({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const { steel, epdm } = M

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.66) * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(5.2, 0.3, t), 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -1 + t * 0.78 + px * 0.26, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, py * 0.1, 4, dt)
  })

  const glass = M.glass

  return (
    <group ref={group} position={[5.2, 0, 0]}>
      <mesh position={[0, 0, 0.17]} material={glass}>
        <boxGeometry args={[3, 3.8, 0.07]} />
      </mesh>
      <mesh position={[0, 0, -0.17]} material={glass}>
        <boxGeometry args={[3, 3.8, 0.07]} />
      </mesh>
      {/* intercalaire + scellement périphérique */}
      <mesh position={[0, -1.82, 0]} material={steel}>
        <boxGeometry args={[2.86, 0.16, 0.27]} />
      </mesh>
      <mesh position={[0, 1.82, 0]} material={steel}>
        <boxGeometry args={[2.86, 0.16, 0.27]} />
      </mesh>
      <mesh position={[-1.42, 0, 0]} material={steel}>
        <boxGeometry args={[0.16, 3.5, 0.27]} />
      </mesh>
      <mesh position={[1.42, 0, 0]} material={steel}>
        <boxGeometry args={[0.16, 3.5, 0.27]} />
      </mesh>
      <mesh material={epdm}>
        <boxGeometry args={[3.02, 3.82, 0.2]} />
      </mesh>
    </group>
  )
}

/** Reflet mobile : donne vie au métal sans animer l'objet. */
function SweepLight() {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.25
  })
  return (
    <group ref={ref}>
      <Lightformer intensity={2.6} position={[0, 1.5, 7]} rotation={[0, 0, Math.PI / 2]} scale={[1.2, 10, 1]} color="#ffffff" />
    </group>
  )
}

function Rig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }, dt) => {
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.6, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -py * 0.45, 3, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function MaterialsScene({ progress, pointer }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8.5], fov: 38 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#fafaf9']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4.5, 6.5, 5]} intensity={1.45} />
      <directionalLight position={[-5, -1.5, -4]} intensity={0.45} color="#cfd6da" />

      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 6, -4]} rotation={[Math.PI / 2, 0, 0]} scale={[14, 8, 1]} color="#ffffff" />
        <Lightformer intensity={1.2} position={[-7, 1, 3]} scale={[9, 9, 1]} color="#e3e9ec" />
        <Lightformer intensity={1} position={[7, -2, 3]} scale={[9, 9, 1]} color="#c6cfd5" />
        <Lightformer intensity={0.8} position={[0, -5, 2]} rotation={[-Math.PI / 2, 0, 0]} scale={[12, 6, 1]} color="#b9c2c8" />
        <SweepLight />
      </Environment>

      <AluminiumProfile progress={progress} pointer={pointer} />
      <PvcProfile progress={progress} pointer={pointer} />
      <GlassPanel progress={progress} pointer={pointer} />

      <ContactShadows position={[0, -2.6, 0]} opacity={0.32} scale={18} blur={2.8} far={5} resolution={512} color="#0a0a0a" />

      <Rig pointer={pointer} />
    </Canvas>
  )
}
