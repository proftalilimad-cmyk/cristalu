import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { damp } from '@/lib/utils'
import { finishes, glassTypes, type FinishId, type GlassId } from '@/data/configurator'
import { JoineryProduct, useJoineryMaterials, type JoineryConfig } from './Joinery'
import { GlassDust, GroundShadow, LightRig, LightSweep, StudioEnvironment, useEnergyDecay } from './Studio'
import { qualityFor } from './quality'
import type { QualityTier } from '@/hooks'
import type { PointerState } from '@/hooks/usePointer'

export type HeroSceneProps = {
  tier: QualityTier
  /** Appareil mobile : géométrie allégée + cadrage vertical */
  mobile?: boolean
  pointer: RefObject<PointerState>
  /** Progression du défilement du hero (0 → 1), pilotée par GSAP */
  scrollRef: RefObject<number>
  finishId?: FinishId
  glassId?: GlassId
}

/* ------------------------------------------------------------------ *
 *  Caméra : dérive douce, parallaxe souris, plongée au défilement
 * ------------------------------------------------------------------ */
function HeroCamera({
  pointer,
  scrollRef,
  mobile,
}: {
  pointer: RefObject<PointerState>
  scrollRef: RefObject<number>
  mobile: boolean
}) {
  const { camera } = useThree()
  const target = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  useFrame((_, dt) => {
    const p = pointer.current ?? { x: 0, y: 0, energy: 0, active: false }
    const progress = scrollRef.current ?? 0
    const d = Math.min(dt, 0.1)
    const depth = mobile ? 6.1 : 5.15

    camera.position.x = damp(camera.position.x, p.x * (mobile ? 0.2 : 0.5), 2.2, d)
    camera.position.y = damp(
      camera.position.y,
      (mobile ? 0.98 : 0.12) - p.y * 0.22 + progress * 0.9,
      2.2,
      d,
    )
    camera.position.z = damp(camera.position.z, depth - progress * 1.5, 2.4, d)
    target.set(p.x * 0.12, (mobile ? -0.62 : 0.02) - progress * 0.35, 0)
    camera.lookAt(target)
  })
  return null
}

/* ------------------------------------------------------------------ *
 *  Réglage vivant du produit + halo de reflet
 * ------------------------------------------------------------------ */
function HeroProduct({
  pointer,
  scrollRef,
  mobile,
  finishId,
  glassId,
  detail,
  particles,
  lightSweep,
}: {
  pointer: RefObject<PointerState>
  scrollRef: RefObject<number>
  mobile: boolean
  finishId?: FinishId
  glassId?: GlassId
  detail: number
  particles: number
  lightSweep: boolean
}) {
  const finish = finishes.find((f) => f.id === finishId) ?? finishes[1]
  const glass = glassTypes.find((g) => g.id === glassId) ?? glassTypes[0]
  const mats = useJoineryMaterials(finish, glass, true)
  const rig = useRef<THREE.Group>(null)
  /** Cadrage : le châssis se tient à droite du texte sur desktop, centré en bas sur mobile */
  const base = mobile
    ? { x: 0, y: -0.95, rotY: -0.12, rotX: 0.05 }
    : { x: 0.82, y: -0.02, rotY: -0.3, rotX: 0.035 }
  /** Respiration du coulissant : les vantaux s'entrouvrent lentement */
  const breath = useRef(0.2)

  const cfg: JoineryConfig = useMemo(
    () => ({
      variant: 'sliding',
      width: mobile ? 2.9 : 2.95,
      height: mobile ? 2.05 : 2.08,
      panels: 2,
      finish,
      glass,
      reflections: true,
      open: 0.2,
      explode: 0,
      detail,
    }),
    [finish, glass, mobile, detail],
  )

  useFrame(({ clock }, dt) => {
    const p = pointer.current ?? { x: 0, y: 0, energy: 0, active: false }
    const progress = scrollRef.current ?? 0
    const d = Math.min(dt, 0.1)
    const t = clock.elapsedTime

    if (rig.current) {
      rig.current.rotation.y = damp(rig.current.rotation.y, base.rotY + p.x * 0.26, 2.6, d)
      rig.current.rotation.x = damp(rig.current.rotation.x, base.rotX - p.y * 0.1, 2.6, d)
      rig.current.position.x = damp(rig.current.position.x, base.x + p.x * 0.1, 2.4, d)
      rig.current.position.y = damp(
        rig.current.position.y,
        base.y + Math.sin(t * 0.45) * 0.03 - progress * (mobile ? 0.9 : 1.5),
        3.4,
        d,
      )
      rig.current.rotation.z = damp(rig.current.rotation.z, p.x * -0.016, 2, d)
    }
    breath.current = 0.2 + Math.sin(t * 0.3) * 0.16
  })

  return (
    <>
      <HeroCamera pointer={pointer} scrollRef={scrollRef} mobile={mobile} />
      <StudioEnvironment resolution={detail >= 2 ? 256 : 128} />
      <LightRig energy={pointer} lightSweep={lightSweep} />
      <group ref={rig} position={[0, 0, 0]}>
        <JoineryProduct cfg={cfg} mats={mats} driveRef={breath} />
      </group>
      <LightSweep width={mobile ? 4 : 5.4} height={mobile ? 2.2 : 2.6} />
      {!mobile && <GlassDust count={particles} energy={pointer} area={[5.6, 3.1, 1.4]} />}
      <GroundShadow y={mobile ? -1.4 : -1.3} width={mobile ? 4.4 : 5.6} height={2.2} opacity={0.32} />
    </>
  )
}

/** Scène du hero : la pièce maîtresse, vivante au mouvement de la souris. */
export function HeroScene({
  tier,
  mobile = false,
  pointer,
  scrollRef,
  finishId = 'anthracite',
  glassId = 'transparent',
}: HeroSceneProps) {
  const q = qualityFor(tier)
  useEnergyDecay(pointer, 1.9)

  return (
    <HeroProduct
      pointer={pointer}
      scrollRef={scrollRef}
      mobile={mobile}
      finishId={finishId}
      glassId={glassId}
      detail={q.detail}
      particles={q.particles}
      lightSweep={q.lightSweep}
    />
  )
}
