import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { damp } from '@/lib/utils'
import type { EnergyRef } from '@/hooks/usePointer'
import { makeGlowTexture, makeShadowTexture } from './materials'

export type { EnergyRef }

/** Décroissance de l'énergie du pointeur — appelée une fois par frame. */
export function useEnergyDecay(energy: EnergyRef, speed = 2.1) {
  useFrame((_, dt) => {
    const e = energy.current
    if (!e) return
    e.energy = damp(e.energy, 0, speed, Math.min(dt, 0.1))
  })
}

/* ------------------------------------------------------------------ *
 *  Environnement studio — Lightformers procéduraux (aucun HDRI à charger)
 * ------------------------------------------------------------------ */
export function StudioEnvironment({ resolution = 256 }: { resolution?: number }) {
  return (
    <Environment resolution={resolution} frames={1} background={false}>
      <color attach="background" args={['#070a0d']} />
      {/* Softbox principale — crée le reflet large et net sur le verre */}
      <Lightformer
        form="rect"
        intensity={4.2}
        color="#ffffff"
        position={[-4.5, 3.2, 2.4]}
        rotation={[0, Math.PI / 5, 0]}
        scale={[9, 6, 1]}
        target={[0, 0, 0]}
      />
      {/* Contre — dessine le liseré métallique sur les arêtes */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#f2dcde"
        position={[4.4, 1.4, -2.6]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[7, 5, 1]}
        target={[0, 0, 0]}
      />
      {/* Bandeau haut — reflet horizontal sur le vitrage */}
      <Lightformer
        form="rect"
        intensity={3}
        color="#f7f2f2"
        position={[0, 5.5, 1.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[12, 5, 1]}
        target={[0, 0, 0]}
      />
      {/* Rinçage bas — écho rouge CRISTALU */}
      <Lightformer
        form="rect"
        intensity={0.85}
        color="#e8b4b7"
        position={[1.5, -3.4, 0.8]}
        rotation={[Math.PI / 2.6, 0, 0]}
        scale={[9, 4, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer form="circle" intensity={1.6} color="#f08c91" position={[-3, -1.4, 3]} scale={[2.6, 2.6, 1]} />
    </Environment>
  )
}

/* ------------------------------------------------------------------ *
 *  Éclairage animé — le reflet balaie le verre quand la souris bouge
 * ------------------------------------------------------------------ */
export function LightRig({
  energy,
  lightSweep = true,
}: {
  energy: EnergyRef
  /** Lumière mobile supplémentaire (reflet qui balaie le verre) */
  lightSweep?: boolean
}) {
  const warm = useRef<THREE.DirectionalLight>(null)
  const key = useRef<THREE.DirectionalLight>(null)
  const rim = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    const e = energy.current?.energy ?? 0
    const t = clock.elapsedTime
    if (key.current) {
      key.current.position.x = -4 + e * 5.5
      key.current.position.y = 3.4 + e * 1.6
      key.current.intensity = 1.5 + e * 2.4
    }
    if (warm.current) {
      warm.current.position.x = 3.4 - e * 4.4
      warm.current.intensity = 0.55 + Math.sin(t * 0.4) * 0.06 + e * 1.1
    }
    if (rim.current) {
      rim.current.position.x = -1.6 + e * 3.2
      rim.current.position.z = 2.4 + e * 0.9
      rim.current.intensity = 3 + e * 9
    }
  })

  return (
    <>
      <ambientLight intensity={0.42} color="#e9e6e8" />
      <hemisphereLight args={['#fde8e9', '#22282e', 0.5]} />
      <directionalLight ref={key} position={[-4, 3.4, 3.4]} intensity={1.5} color="#ffffff" />
      <directionalLight ref={warm} position={[3.4, 1.2, 2.2]} intensity={0.55} color="#f4e3e3" />
      {lightSweep && <pointLight ref={rim} position={[-1.6, 0.6, 2.4]} intensity={3} color="#f08c91" distance={14} decay={2} />}
    </>
  )
}

/* ------------------------------------------------------------------ *
 *  Poussière de verre — particules de reflet
 * ------------------------------------------------------------------ */
export function GlassDust({
  count,
  area = [5.4, 3.2, 1.6],
  energy,
}: {
  count: number
  area?: [number, number, number]
  energy: EnergyRef
}) {
  const points = useRef<THREE.Points>(null)
  const texture = useMemo(() => makeGlowTexture(), [])

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * area[0]
      positions[i * 3 + 1] = (Math.random() - 0.5) * area[1]
      positions[i * 3 + 2] = (Math.random() - 0.5) * area[2]
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { positions, seeds }
  }, [count, area])

  const base = useMemo(() => positions.slice(), [positions])

  useFrame(({ clock }) => {
    const pts = points.current
    if (!pts) return
    const t = clock.elapsedTime
    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const e = energy.current?.energy ?? 0
    for (let i = 0; i < count; i++) {
      const s = seeds[i]
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.22 + s) * 0.22 + e * Math.sin(s) * 0.14
      arr[i * 3 + 1] = base[i * 3 + 1] + Math.cos(t * 0.3 + s) * 0.18 + e * Math.cos(s) * 0.12
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.sin(t * 0.18 + s * 1.7) * 0.1
    }
    attr.needsUpdate = true
    const mat = pts.material as THREE.PointsMaterial
    mat.opacity = 0.28 + e * 0.5
    mat.size = 0.052 + e * 0.032
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#fde8e9"
      />
    </points>
  )
}

/* ------------------------------------------------------------------ *
 *  Ombre de contact simulée — coût GPU quasi nul
 * ------------------------------------------------------------------ */
export function GroundShadow({
  y = -1.25,
  width = 7,
  height = 3,
  opacity = 0.5,
}: {
  y?: number
  width?: number
  height?: number
  opacity?: number
}) {
  const texture = useMemo(() => makeShadowTexture(), [])
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.NormalBlending}
        color="#0b0d10"
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ *
 *  Halo lumineux qui balaie le vitrage
 * ------------------------------------------------------------------ */
export function LightSweep({ width = 6, height = 2.6 }: { width?: number; height?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => makeGlowTexture(), [])
  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    const p = (t * 0.16) % 1
    mesh.current.position.x = -width / 2 + p * width
    mesh.current.position.y = Math.sin(p * Math.PI) * 0.5 - 0.1
    const mat = mesh.current.material as THREE.MeshBasicMaterial
    mat.opacity = Math.sin(p * Math.PI) * 0.36
  })
  return (
    <mesh ref={mesh} position={[0, 0, 0.24]}>
      <planeGeometry args={[width * 0.5, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.2}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#fdeeee"
      />
    </mesh>
  )
}
