import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useMemo, useRef, type RefObject } from 'react'
import * as THREE from 'three'

/* ---------------------------------------------------------------- geometry */

/** Rectangular aluminium tube with two inner chambers + thermal break slot. */
function useAluminiumGeometry() {
  return useMemo(() => {
    const w = 1.1
    const h = 1.9
    const shape = new THREE.Shape()
    const r = 0.06
    shape.moveTo(-w / 2 + r, -h / 2)
    shape.lineTo(w / 2 - r, -h / 2)
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
    shape.lineTo(w / 2, h / 2 - r)
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
    shape.lineTo(-w / 2 + r, h / 2)
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
    shape.lineTo(-w / 2, -h / 2 + r)
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)

    const hole = (x: number, y: number, hw: number, hh: number) => {
      const p = new THREE.Path()
      p.moveTo(x - hw, y - hh)
      p.lineTo(x + hw, y - hh)
      p.lineTo(x + hw, y + hh)
      p.lineTo(x - hw, y + hh)
      p.closePath()
      return p
    }
    shape.holes.push(hole(0, 0.52, 0.36, 0.42))
    shape.holes.push(hole(0, -0.52, 0.36, 0.42))

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 3.2,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 6,
    })
    geo.center()
    return geo
  }, [])
}

/** Multi-chamber PVC frame section. */
function usePvcGeometry() {
  return useMemo(() => {
    const w = 1.35
    const h = 1.9
    const shape = new THREE.Shape()
    shape.moveTo(-w / 2, -h / 2)
    shape.lineTo(w / 2, -h / 2)
    shape.lineTo(w / 2, h / 2)
    shape.lineTo(-w / 2, h / 2)
    shape.closePath()

    const chamber = (x: number, y: number, hw: number, hh: number) => {
      const p = new THREE.Path()
      p.moveTo(x - hw, y - hh)
      p.lineTo(x + hw, y - hh)
      p.lineTo(x + hw, y + hh)
      p.lineTo(x - hw, y + hh)
      p.closePath()
      return p
    }
    // 5 chambers
    shape.holes.push(chamber(-0.36, 0.45, 0.2, 0.34))
    shape.holes.push(chamber(0.14, 0.45, 0.24, 0.34))
    shape.holes.push(chamber(-0.36, -0.45, 0.2, 0.34))
    shape.holes.push(chamber(0.14, -0.45, 0.24, 0.34))
    shape.holes.push(chamber(0.48, 0, 0.12, 0.72))

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 3.2,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 1,
      curveSegments: 4,
    })
    geo.center()
    return geo
  }, [])
}

/* ------------------------------------------------------------------ pieces */

type SceneProps = { progress: RefObject<number>; pointer: RefObject<{ x: number; y: number }> }

function AluminiumProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const geo = useAluminiumGeometry()

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const local = THREE.MathUtils.clamp(p * 3, 0, 1.6)
    const targetRotY = -0.6 + local * 2.2 + (pointer.current?.x ?? 0) * 0.25
    const targetRotX = 0.22 + (pointer.current?.y ?? 0) * 0.15
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetRotY, 4, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetRotX, 4, dt)
    const targetX = THREE.MathUtils.lerp(0, -3.4, THREE.MathUtils.clamp(p * 3, 0, 1))
    g.position.x = THREE.MathUtils.damp(g.position.x, targetX, 4, dt)
    const s = 1 + Math.sin(THREE.MathUtils.clamp(p * 3, 0, 1) * Math.PI) * 0.12
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, dt))
  })

  return (
    <group ref={group}>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color="#c6cace" metalness={1} roughness={0.26} envMapIntensity={1.15} />
      </mesh>
      {/* thermal break strips */}
      <mesh position={[0.56, 0, 0]}>
        <boxGeometry args={[0.07, 1.2, 3.2]} />
        <meshStandardMaterial color="#1c1e21" roughness={0.75} metalness={0} />
      </mesh>
      <mesh position={[-0.56, 0, 0]}>
        <boxGeometry args={[0.07, 1.2, 3.2]} />
        <meshStandardMaterial color="#1c1e21" roughness={0.75} metalness={0} />
      </mesh>
    </group>
  )
}

function PvcProfile({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)
  const geo = usePvcGeometry()

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const local = THREE.MathUtils.clamp((p - 0.33) * 3, -1, 1.6)
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      -0.5 + local * 1.9 + (pointer.current?.x ?? 0) * 0.2,
      4,
      dt,
    )
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.2 + (pointer.current?.y ?? 0) * 0.12, 4, dt)
    const t = THREE.MathUtils.clamp((p - 0.33) * 3, 0, 1)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(4.2, -3.4, t), 4, dt)
    g.position.y = THREE.MathUtils.damp(g.position.y, THREE.MathUtils.lerp(-0.3, 0, t), 4, dt)
  })

  return (
    <group ref={group} position={[4.2, 0, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#f4f5f6" metalness={0.05} roughness={0.45} envMapIntensity={0.9} />
      </mesh>
      {/* galvanised steel reinforcement inside the main chamber */}
      <mesh position={[-0.12, 0, 0]}>
        <boxGeometry args={[0.5, 1.0, 3.18]} />
        <meshStandardMaterial color="#8e959b" metalness={0.9} roughness={0.35} />
      </mesh>
      {/* seals */}
      <mesh position={[0.72, 0.35, 0]}>
        <boxGeometry args={[0.1, 0.16, 3.2]} />
        <meshStandardMaterial color="#26282b" roughness={0.9} />
      </mesh>
      <mesh position={[0.72, -0.35, 0]}>
        <boxGeometry args={[0.1, 0.16, 3.2]} />
        <meshStandardMaterial color="#26282b" roughness={0.9} />
      </mesh>
    </group>
  )
}

function GlassPanel({ progress, pointer }: SceneProps) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return
    const p = progress.current ?? 0
    const t = THREE.MathUtils.clamp((p - 0.66) * 3, 0, 1)
    g.position.x = THREE.MathUtils.damp(g.position.x, THREE.MathUtils.lerp(5, 0.4, t), 4, dt)
    g.rotation.y = THREE.MathUtils.damp(
      g.rotation.y,
      -0.9 + t * 0.75 + (pointer.current?.x ?? 0) * 0.3,
      4,
      dt,
    )
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, (pointer.current?.y ?? 0) * 0.12, 4, dt)
  })

  return (
    <group ref={group} position={[5, 0, 0]}>
      {/* outer pane */}
      <mesh position={[0, 0, 0.14]}>
        <boxGeometry args={[2.9, 3.7, 0.06]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.35}
          roughness={0.04}
          ior={1.48}
          reflectivity={0.6}
          clearcoat={1}
          clearcoatRoughness={0.05}
          color="#eaf1f4"
        />
      </mesh>
      {/* inner pane */}
      <mesh position={[0, 0, -0.14]}>
        <boxGeometry args={[2.9, 3.7, 0.06]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={0.35}
          roughness={0.06}
          ior={1.48}
          color="#e6eef2"
        />
      </mesh>
      {/* spacer frame */}
      <mesh>
        <boxGeometry args={[2.92, 3.72, 0.22]} />
        <meshStandardMaterial color="#4d5257" metalness={0.85} roughness={0.4} wireframe />
      </mesh>
    </group>
  )
}

function Rig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame(({ camera }, dt) => {
    const px = pointer.current?.x ?? 0
    const py = pointer.current?.y ?? 0
    camera.position.x = THREE.MathUtils.damp(camera.position.x, px * 0.7, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -py * 0.5, 3, dt)
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
      <color attach="background" args={['#fafaf8']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <directionalLight position={[-5, -2, -4]} intensity={0.5} color="#cfd6da" />

      <Environment resolution={192}>
        <Lightformer intensity={2.4} position={[0, 5, -6]} scale={[12, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-6, 1, 2]} scale={[8, 8, 1]} color="#dfe6ea" />
        <Lightformer intensity={0.9} position={[6, -2, 3]} scale={[8, 8, 1]} color="#c9d1d6" />
      </Environment>

      <AluminiumProfile progress={progress} pointer={pointer} />
      <PvcProfile progress={progress} pointer={pointer} />
      <GlassPanel progress={progress} pointer={pointer} />
      <Rig pointer={pointer} />
    </Canvas>
  )
}
