import { useEffect, useMemo, useRef, type ComponentRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { gsap, initGsap } from '@/lib/gsap'
import { damp } from '@/lib/utils'
import type { Finish, GlassType } from '@/data/configurator'
import { JoineryProduct, useJoineryMaterials, type JoineryConfig, type JoineryFlavor, type JoineryVariant } from './Joinery'
import { GlassDust, GroundShadow, LightRig, LightSweep, StudioEnvironment, useEnergyDecay } from './Studio'
import type { QualitySettings } from './quality'
import type { PointerState } from '@/hooks/usePointer'

export type ShowroomProductConfig = {
  variant: JoineryVariant
  flavor?: JoineryFlavor
  width: number
  height: number
  panels: number
  finish: Finish
  glass: GlassType
  reflections: boolean
  open: number
  explode: number
}

export type OrbitControlsHandle = ComponentRef<typeof OrbitControls>

function ProductRig({
  cfg,
  detail,
  pointer,
}: {
  cfg: ShowroomProductConfig
  detail: number
  pointer: RefObject<PointerState>
}) {
  const group = useRef<THREE.Group>(null)
  const mats = useJoineryMaterials(cfg.finish, cfg.glass, cfg.reflections)

  const joineryCfg: JoineryConfig = useMemo(
    () => ({
      variant: cfg.variant,
      flavor: cfg.flavor,
      width: cfg.width,
      height: cfg.height,
      panels: cfg.panels,
      finish: cfg.finish,
      glass: cfg.glass,
      reflections: cfg.reflections,
      open: cfg.open,
      explode: cfg.explode,
      detail,
    }),
    [cfg, detail],
  )

  // Entrée en scène : le produit s'assemble et se présente
  useEffect(() => {
    const el = group.current
    if (!el) return
    initGsap()
    const tl = gsap.timeline({ defaults: { ease: 'cristal', duration: 1.15 } })
    tl.fromTo(
      el.rotation,
      { y: -0.62, x: 0.18 },
      { y: 0, x: 0, duration: 1.35 },
    )
      .fromTo(el.scale, { x: 0.84, y: 0.84, z: 0.84 }, { x: 1, y: 1, z: 1 }, 0)
      .fromTo(el.position, { y: -0.22 }, { y: 0 }, 0)
    return () => {
      tl.kill()
    }
  }, [])

  useFrame((_, dt) => {
    const el = group.current
    if (!el) return
    const p = pointer.current
    const d = Math.min(dt, 0.1)
    // Micro-mouvement : la pièce reste vivante même sans interaction
    const idle = Math.sin(performance.now() * 0.00028) * 0.035
    el.rotation.y = damp(el.rotation.y, idle + (p?.x ?? 0) * 0.06, 1.6, d)
    el.rotation.x = damp(el.rotation.x, -0.02 + (p?.y ?? 0) * 0.04, 1.6, d)
  })

  return (
    <group ref={group}>
      <JoineryProduct cfg={joineryCfg} mats={mats} />
    </group>
  )
}

export function ShowroomScene({
  cfg,
  quality,
  pointer,
  controlsRef,
  interactive = true,
}: {
  cfg: ShowroomProductConfig
  quality: QualitySettings
  pointer: RefObject<PointerState>
  controlsRef: RefObject<OrbitControlsHandle | null>
  interactive?: boolean
}) {
  useEnergyDecay(pointer, 2.2)

  const floorY = cfg.variant === 'rail' ? -cfg.height / 2 : -cfg.height / 2 - 0.34

  return (
    <>
      <StudioEnvironment resolution={quality.envResolution} />
      <LightRig energy={pointer} lightSweep={quality.lightSweep} />
      <ProductRig cfg={cfg} detail={quality.detail} pointer={pointer} />

      <OrbitControls
        ref={controlsRef}
        enabled={interactive}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.55}
        zoomSpeed={0.65}
        minDistance={cfg.variant === 'rail' ? 5 : 2.6}
        maxDistance={cfg.variant === 'rail' ? 20 : 9.5}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 2 + 0.26}
        target={[0, 0, 0]}
      />

      {quality.lightSweep && <LightSweep width={5} height={2.4} />}
      {quality.particles >= 60 && cfg.variant !== 'rail' && (
        <GlassDust count={Math.round(quality.particles / 2.2)} energy={pointer} area={[4.6, 2.8, 1.2]} />
      )}
      <GroundShadow y={floorY} width={7} height={3} opacity={0.4} />
    </>
  )
}
