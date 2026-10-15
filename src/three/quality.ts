import type { QualityTier } from '@/hooks'

export type QualitySettings = {
  dpr: [number, number]
  particles: number
  envResolution: number
  antialias: boolean
  shadows: boolean
  /** Nombre de segments sur les profils (détail des arêtes) */
  detail: number
  /** Affiche le halo lumineux animé sur le verre */
  lightSweep: boolean
}

export function qualityFor(tier: QualityTier): QualitySettings {
  switch (tier) {
    case 'low':
      return {
        dpr: [1, 1.4],
        particles: 26,
        envResolution: 96,
        antialias: false,
        shadows: false,
        detail: 1,
        lightSweep: false,
      }
    case 'medium':
      return {
        dpr: [1, 1.75],
        particles: 60,
        envResolution: 160,
        antialias: true,
        shadows: false,
        detail: 1,
        lightSweep: true,
      }
    default:
      return {
        dpr: [1, 2],
        particles: 120,
        envResolution: 256,
        antialias: true,
        shadows: false,
        detail: 2,
        lightSweep: true,
      }
  }
}
