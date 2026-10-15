import * as THREE from 'three'
import type { Finish, GlassType } from '@/data/configurator'

/* ------------------------------------------------------------------ *
 *  PALETTES PHYSIQUES
 *  Contrôle de la réflectivité — aluminium anodisé vs verre
 * ------------------------------------------------------------------ */

export type ReflectMode = 'on' | 'off'

/** Paramètres du matériau aluminium/thermolaqué. */
export function finishProps(finish: Finish, reflections: boolean) {
  const metalBoost = reflections ? 1 : 0.55
  return {
    color: new THREE.Color(finish.swatch),
    metalness: Math.min(1, finish.metalness * (reflections ? 1 : 0.75)),
    roughness: finish.roughness * (reflections ? 1 : 1.25),
    clearcoat: finish.clearcoat,
    clearcoatRoughness: reflections ? 0.08 : 0.35,
    envMapIntensity: 1.35 * metalBoost,
    reflectivity: 0.5,
  }
}

/** Couleur de chant du verre (le fameux liseré vert-bleu du verre float). */
export function glassEdgeColor(glass: GlassType) {
  const c = new THREE.Color(glass.tint)
  const hsl = { h: 0, s: 0, l: 0 }
  c.getHSL(hsl)
  return new THREE.Color().setHSL(0.45, 0.42, Math.min(0.82, Math.max(0.42, hsl.l)))
}

/**
 * Paramètres du verre. On n'utilise volontairement pas `transmission` :
 * le canvas est en alpha au-dessus d'une photographie DOM — un verre alpha-blendé
 * laisse réellement apparaître le décor (villa, paysage) à travers le vitrage,
 * ce qui est bien plus réaliste ici et beaucoup plus léger à l'exécution.
 */
export function glassProps(glass: GlassType, reflections: boolean) {
  const refl = glass.reflectivity
  return {
    color: new THREE.Color(glass.tint),
    metalness: reflections ? (glass.id === 'reflechissant' ? 0.92 : 0.12 * refl) : 0.05,
    roughness: reflections ? glass.roughness : Math.min(0.5, glass.roughness + 0.22),
    opacity: reflections ? glass.opacity : Math.min(0.62, glass.opacity + 0.14),
    envMapIntensity: reflections ? 1.1 + refl * 2.2 : 0.3,
    clearcoat: reflections ? 1 : 0.15,
    clearcoatRoughness: reflections ? 0.02 : 0.4,
    ior: 1.52,
    reflectivity: 0.5,
    specularIntensity: reflections ? 1 : 0.4,
  }
}

/** Matériau du chant du verre : opaque, teinté, légèrement émissif. */
export function glassEdgeProps(glass: GlassType) {
  return {
    color: glassEdgeColor(glass),
    metalness: 0.1,
    roughness: 0.18,
    envMapIntensity: 1.1,
    transparent: true,
    opacity: 0.92,
  }
}

/** Texture de halo doux (particules de reflet) — générée à la volée, 0 octet réseau. */
export function makeGlowTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(253,232,233,0.85)')
  g.addColorStop(0.6, 'rgba(226,73,79,0.25)')
  g.addColorStop(1, 'rgba(226,73,79,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Ombre de contact simplifiée : dégradé radial sur un plan (aucun shadow map). */
export function makeShadowTexture() {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(6,8,10,0.55)')
  g.addColorStop(0.45, 'rgba(6,8,10,0.28)')
  g.addColorStop(0.75, 'rgba(6,8,10,0.07)')
  g.addColorStop(1, 'rgba(6,8,10,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
