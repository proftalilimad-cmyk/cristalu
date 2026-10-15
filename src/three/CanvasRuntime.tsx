import { Suspense, useEffect, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Preload } from '@react-three/drei'
import * as THREE from 'three'
import type { QualitySettings } from './quality'

/**
 * Moteur 3D — chargé dynamiquement (chunk séparé) pour ne jamais bloquer
 * le premier affichage de la page.
 */

function FrameloopGate({ active }: { active: boolean }) {
  const setFrameloop = useThree((s) => s.setFrameloop)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    setFrameloop(active ? 'always' : 'never')
    if (active) invalidate(2)
  }, [active, setFrameloop, invalidate])
  return null
}

export type CanvasRuntimeProps = {
  children: ReactNode
  active: boolean
  quality: QualitySettings
  camera: { position: [number, number, number]; fov: number; near: number; far: number }
  shadows?: boolean
  preload?: boolean
  onCreated?: () => void
}

export default function CanvasRuntime({
  children,
  active,
  quality,
  camera,
  shadows = false,
  preload = false,
  onCreated,
}: CanvasRuntimeProps) {
  return (
    <Canvas
      dpr={quality.dpr}
      shadows={shadows}
      camera={camera}
      gl={{
        antialias: quality.antialias,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0)
        onCreated?.()
      }}
      className="!absolute inset-0"
    >
      <FrameloopGate active={active} />
      <Suspense fallback={null}>{children}</Suspense>
      {preload && <Preload all />}
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
