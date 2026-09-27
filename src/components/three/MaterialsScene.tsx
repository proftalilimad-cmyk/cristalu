import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import {
  aluBeadShape,
  aluInnerShape,
  aluOuterShape,
  extrude,
  glassUnit,
  polyamideBar,
  pvcShape,
  screwPort,
} from './profiles'

type SceneProps = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }

/* -------------------------------------------------------------- matériaux */

function AluMaterial({ color = '#b7bcc1', roughness = 0.29 }: { color?: string; roughness?: number }) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={1}
      roughness={roughness}
      envMapIntensity={1.35}
      anisotropy={0.55}
      anisotropyRotation={Math.PI / 2}
      clearcoat={0.18}
      clearcoatRoughness={0.4}
    />
  )
}

function PolyamideMaterial() {
  return <meshStandardMaterial color="#2a2c2f" roughness={0.82} metalness={0} envMapIntensity={0.5} />
}

function GasketMaterial() {
  return <meshStandardMaterial color="#141618" roughness={0.95} metalness={0} envMapIntensity={0.35} />
}

/* ------------------------------------------------------------ sous-modules */

/** Vitrage isolant : deux verres, intercalaire warm-edge, scellement. */
function Glazing({ height = glassUnit.height }: { height?: number }) {
  const base = glassUnit.base
  const top = base + height
  const t = glassUnit.paneThickness
  const gap = glassUnit.gap
  const x = gap / 2 + t / 2

  return (
    <group>
      {[-x, x].map((px, i) => (
        <mesh key={i} position={[px, (base + top) / 2, 0]}>
          <boxGeometry args={[t, height, 3.4]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={0.6}
            ior={1.52}
            roughness={0.03}
            metalness={0}
            color="#e4efee"
            attenuationColor="#cfe2df"
            attenuationDistance={6}
            clearcoat={1}
            clearcoatRoughness={0.03}
            specularIntensity={1}
          />
        </mesh>
      ))}
      {/* intercalaire */}
      <mesh position={[0, base + 0.55, 0]}>
        <boxGeometry args={[gap, 0.5, 3.4]} />
        <meshStandardMaterial color="#3c4044" metalness={0.75} roughness={0.45} />
      </mesh>
      {/* mastic de scellement */}
      <mesh position={[0, base + 0.16, 0]}>
        <boxGeometry args={[gap + t * 2, 0.34, 3.4]} />
        <GasketMaterial />
      </mesh>
    </group>
  )
}

/** Joints EPDM de part et d'autre du vitrage. */
function Gaskets() {
  return (
    <group>
      <mesh position={[-0.75, 4.12, 0]}>
        <boxGeometry args={[0.36, 0.5, 3.4]} />
        <GasketMaterial />
      </mesh>
      <mesh position={[0.75, 4.12, 0]}>
        <boxGeometry args={[0.36, 0.5, 3.4]} />
        <GasketMaterial />
      </mesh>
      {/* joint central entre coquilles */}
      <mesh position={[0, 3.32, 0]}>
        <boxGeometry args={[0.9, 0.24, 3.4]} />
        <GasketMaterial />
      </mesh>
    </group>
  )
}

/* ---------------------------------------------------------- profilé alu RPT */

function AluminiumProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  const geos = useMemo(() => {
    const outer = extrude(aluOuterShape())
    const inner = extrude(aluInnerShape())
    const barLow = extrude(polyamideBar(-2.3))
    const barHigh = extrude(polyamideBar(2.3))
    const bead = extrude(aluBeadShape())
    const portOuter = extrude(screwPort(-2.62, -2.42))
    const portInner = extrude(screwPort(2.6, -2.42))
    return { outer, inner, barLow, barHigh, bead, portOuter, portInner }
  }, [])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp(p * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.85 + t * 1.5 + px * 0.28, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 + py * 0.12, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(0.4, -4.2, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, -1.35 + Math.sin(t * Math.PI) * 0.25, 4, dt)
  })

  return (
    <group ref={group} position={[0.4, -1.35, 0]} scale={0.52}>
      <mesh geometry={geos.outer} castShadow receiveShadow>
        <AluMaterial />
      </mesh>
      <mesh geometry={geos.inner} castShadow receiveShadow>
        <AluMaterial color="#c2c7cb" roughness={0.32} />
      </mesh>
      <mesh geometry={geos.portOuter}>
        <AluMaterial roughness={0.35} />
      </mesh>
      <mesh geometry={geos.portInner}>
        <AluMaterial roughness={0.35} />
      </mesh>
      <mesh geometry={geos.barLow}>
        <PolyamideMaterial />
      </mesh>
      <mesh geometry={geos.barHigh}>
        <PolyamideMaterial />
      </mesh>
      <mesh geometry={geos.bead} castShadow>
        <AluMaterial color="#bfc4c8" />
      </mesh>
      <Gaskets />
      <Glazing />
    </group>
  )
}

/* ------------------------------------------------------------ profilé PVC */

function PvcProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const geo = useMemo(() => extrude(pvcShape(), 3.4, 0.03), [])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.33) * 3, 0, 1)
    const enter = THREE.MathUtils.clamp((p - 0.28) * 4, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.8 + t * 1.35 + px * 0.24, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.1 + py * 0.1, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(6.5, -4.2, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, -1.35, 4, dt)
    g.visible = enter > 0.01
  })

  return (
    <group ref={group} position={[6.5, -1.35, 0]} scale={0.52}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f2f3f4"
          metalness={0}
          roughness={0.38}
          clearcoat={0.55}
          clearcoatRoughness={0.25}
          envMapIntensity={0.85}
          sheen={0.2}
        />
      </mesh>
      {/* renfort acier galvanisé dans la chambre centrale */}
      <mesh position={[-0.95, 0, 0]}>
        <boxGeometry args={[1.3, 5.5, 3.36]} />
        <meshStandardMaterial color="#8d949a" metalness={0.92} roughness={0.34} />
      </mesh>
      <Gaskets />
      <Glazing />
    </group>
  )
}

/* -------------------------------------------------------- vitrage isolant */

function GlassUnit({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.66) * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -1.05 + t * 0.95 + px * 0.3, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.06 + py * 0.1, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(7, -3.6, t), 4, dt)
    g.visible = p > 0.6
  })

  return (
    <group ref={group} position={[7, -1.1, 0]} scale={0.62}>
      <group position={[0, -3.2, 0]}>
        <Glazing height={9.5} />
      </group>
      {/* cadre du vitrage : intercalaire périphérique */}
      <mesh position={[0, 3.05, 0]}>
        <boxGeometry args={[0.6, 0.5, 3.4]} />
        <meshStandardMaterial color="#3c4044" metalness={0.75} roughness={0.45} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------------- rig */

function Rig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }, dt) => {
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.6, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.2 - py * 0.45, 3, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function MaterialsScene({ progress, pointer }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      shadows
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={{ position: [0, 0.2, 9.2], fov: 36 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[5, 7, 6]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-6, 2, -3]} intensity={0.55} color="#cfd8de" />
      <spotLight position={[0, 6, 6]} angle={0.7} penumbra={1} intensity={1.1} color="#ffffff" />

      {/* studio : bandes lumineuses -> reflets filants typiques de l'aluminium */}
      <Environment resolution={256}>
        <Lightformer intensity={3.2} position={[0, 6, -4]} rotation-x={Math.PI / 2} scale={[14, 4, 1]} />
        <Lightformer intensity={1.6} position={[-7, 2, 3]} rotation-y={Math.PI / 2} scale={[10, 6, 1]} color="#eef3f6" />
        <Lightformer intensity={1.2} position={[7, -1, 2]} rotation-y={-Math.PI / 2} scale={[10, 6, 1]} color="#c6d0d6" />
        <Lightformer intensity={0.8} position={[0, -5, 2]} rotation-x={-Math.PI / 2} scale={[12, 6, 1]} color="#aab4bb" />
      </Environment>

      <AluminiumProfile progress={progress} pointer={pointer} />
      <PvcProfile progress={progress} pointer={pointer} />
      <GlassUnit progress={progress} pointer={pointer} />

      <ContactShadows
        position={[0, -3.05, 0]}
        opacity={0.3}
        scale={16}
        blur={2.6}
        far={5}
        resolution={512}
        color="#0a0a0a"
      />
      <Rig pointer={pointer} />
    </Canvas>
  )
}
