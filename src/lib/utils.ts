/** Concaténateur de classes minimaliste (remplace clsx : zéro dépendance). */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, boolean | null | undefined>

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = []
  const walk = (v: ClassValue) => {
    if (!v) return
    if (typeof v === 'string' || typeof v === 'number') {
      out.push(String(v))
    } else if (Array.isArray(v)) {
      v.forEach(walk)
    } else if (typeof v === 'object') {
      for (const [k, on] of Object.entries(v)) if (on) out.push(k)
    }
  }
  inputs.forEach(walk)
  return out.join(' ')
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Amortissement indépendant du framerate (pour le parallaxe souris). */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt))
}

export function mapRange(v: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin)
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`
}

/** Identifiant court pour les demandes (référence affichée à l'utilisateur). */
export function reference() {
  const d = new Date()
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `CR-${stamp}-${rand}`
}

export const isBrowser = typeof window !== 'undefined'

export function prefersReducedMotion() {
  if (!isBrowser) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
