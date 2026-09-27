import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import {
  ALU_LAYOUT,
  PVC_LAYOUT,
  extrude,
  glassUnit,
  pvcFrameShape,
  slotDoubleShape,
  slotRoundShape,
  slotSquareShape,
  type LayoutItem,
} from './profiles'

type SceneProps = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }

/** échelle mm -> unités de scène */
const MM = 0.0145

/* ------------------------------------------------------------- matériaux */

function AluMaterial({ tint = 0 }: { tint?: number }) {
  return (
    <meshPhysicalMaterial
      color={new THREE.Color().setHSL(0.58, 0.02, 0.72 + tint)}
      metalness={1}
      roughness={0.26}
      envMapIntensity={1.45}
      anisotropy={0.6}
      anisotropyRotation={Math.PI / 2}
      clearcoat={0.25}
      clearcoatRoughness={0.35}
    />
  )
}

/* ------------------------------------------------- étape 1 : aluminium */

function AluminiumStage({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  const geometries = useMemo(() => {
    const shapes = {
      square: slotSquareShape(40),
      double: slotDoubleShape(40, 80),
      round: slotRoundShape(40),
    }
    const map = new Map<string, THREE.ExtrudeGeometry>()
    for (const item of ALU_LAYOUT) map.set(item.id, extrude(shapes[item.kind], item.length, 0.55))
    return map
  }, [])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp(p * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + t * 0.7 + px * 0.22, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.06 + py * 0.1, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(0.35, -5.4, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, 0.1 + Math.sin(t * Math.PI) * 0.22, 4, dt)
  })

  return (
    <group ref={group} position={[0.35, 0.1, 0]} scale={MM}>
      {ALU_LAYOUT.map((item: LayoutItem, i) => (
        <mesh
          key={item.id}
          geometry={geometries.get(item.id)}
          position={item.position}
          rotation={item.rotation}
          castShadow
          receiveShadow
        >
          <AluMaterial tint={i % 2 === 0 ? 0.02 : 0} />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------------------------------- étape 2 : PVC */

function PvcStage({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  const geometries = useMemo(() => {
    const shape = pvcFrameShape()
    const map = new Map<string, THREE.ExtrudeGeometry>()
    for (const item of PVC_LAYOUT) map.set(item.id, extrude(shape, item.length, 0.4))
    return map
  }, [])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.33) * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.35 + t * 0.62 + px * 0.2, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.06 + py * 0.09, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(6.4, -5.4, t), 4, dt)
    g.visible = p > 0.28
  })

  return (
    <group ref={group} position={[6.4, 0.1, 0]} scale={MM}>
      {PVC_LAYOUT.map((item) => (
        <group key={item.id} position={item.position} rotation={item.rotation}>
          <mesh geometry={geometries.get(item.id)} castShadow receiveShadow>
            <meshPhysicalMaterial
              color="#f3f4f5"
              metalness={0}
              roughness={0.34}
              clearcoat={0.6}
              clearcoatRoughness={0.22}
              envMapIntensity={0.9}
              sheen={0.25}
            />
          </mesh>
          {/* renfort acier galvanisé visible dans la chambre centrale */}
          <mesh position={[-9.5, 0, 0]}>
            <boxGeometry args={[14, 56, item.length - 1]} />
            <meshStandardMaterial color="#8d949a" metalness={0.92} roughness={0.32} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ------------------------------------------------------ étape 3 : vitrage */

function GlassStage({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const { paneThickness: pt, gap, width, height } = glassUnit

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.66) * 3, 0, 1)
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, -0.95 + t * 0.75 + px * 0.28, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.05 + py * 0.09, 4, dt)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(7, -4.4, t), 4, dt)
    g.visible = p > 0.6
  })

  const x = gap / 2 + pt / 2

  return (
    <group ref={group} position={[7, 0, 0]} scale={MM * 1.35}>
      {/* double vitrage */}
      <group>
        <mesh position={[-x, 0, 0]}>
          <boxGeometry args={[pt, height, width]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={8}
            ior={1.52}
            roughness={0.03}
            color="#e6f0ef"
            attenuationColor="#cfe2df"
            attenuationDistance={120}
            clearcoat={1}
            clearcoatRoughness={0.03}
          />
        </mesh>
        <mesh position={[x, 0, 0]}>
          <boxGeometry args={[pt, height, width]} />
          <meshPhysicalMaterial
            transmission={1}
            thickness={8}
            ior={1.52}
            roughness={0.04}
            color="#e4eeee"
            attenuationColor="#cfe2df"
            attenuationDistance={120}
            clearcoat={1}
            clearcoatRoughness={0.04}
          />
        </mesh>
      </group>
      {/* intercalaire périphérique + scellement */}
      <mesh position={[0, -height / 2 + 9, 0]}>
        <boxGeometry args={[gap, 14, width]} />
        <meshStandardMaterial color="#3c4044" metalness={0.75} roughness={0.42} />
      </mesh>
      <mesh position={[0, height / 2 - 9, 0]}>
        <boxGeometry args={[gap, 14, width]} />
        <meshStandardMaterial color="#3c4044" metalness={0.75} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0, -width / 2 + 7]}>
        <boxGeometry args={[gap, height - 36, 12]} />
        <meshStandardMaterial color="#3c4044" metalness={0.75} roughness={0.42} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------------------------- rig */

function Rig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }, dt) => {
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.55, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.25 - py * 0.4, 3, dt)
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
      camera={{ position: [0, 0.25, 9.2], fov: 36 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-7, 3, -4]} intensity={0.6} color="#d3dbe1" />
      <spotLight position={[1, 7, 7]} angle={0.75} penumbra={1} intensity={1.2} />

      {/* studio : bandes lumineuses -> reflets filants typiques de l'aluminium */}
      <Environment resolution={256}>
        <Lightformer intensity={3.4} position={[0, 7, -3]} rotation-x={Math.PI / 2} scale={[16, 5, 1]} />
        <Lightformer
          intensity={1.7}
          position={[-8, 2, 4]}
          rotation-y={Math.PI / 2}
          scale={[12, 7, 1]}
          color="#eef3f6"
        />
        <Lightformer
          intensity={1.3}
          position={[8, -1, 3]}
          rotation-y={-Math.PI / 2}
          scale={[12, 7, 1]}
          color="#c6d0d6"
        />
        <Lightformer
          intensity={0.9}
          position={[0, -6, 2]}
          rotation-x={-Math.PI / 2}
          scale={[14, 7, 1]}
          color="#aab4bb"
        />
      </Environment>

      <AluminiumStage progress={progress} pointer={pointer} />
      <PvcStage progress={progress} pointer={pointer} />
      <GlassStage progress={progress} pointer={pointer} />

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.3}
        scale={18}
        blur={2.6}
        far={5}
        resolution={512}
        color="#0a0a0a"
      />
      <Rig pointer={pointer} />
    </Canvas>
  )
}
