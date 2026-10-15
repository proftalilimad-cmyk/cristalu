import { Suspense, lazy, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useInView, usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'
import { qualityFor, type QualitySettings } from './quality'
import { CanvasHostSkeleton } from './CanvasSkeleton'

const CanvasRuntime = lazy(() => import('./CanvasRuntime'))

function supportsWebGL() {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export type CanvasHostProps = {
  children: ReactNode
  /** Rendu de repli si WebGL est indisponible */
  fallback?: ReactNode
  className?: string
  /** Contrôles actifs (sinon le canvas laisse passer le défilement tactile) */
  interactive?: boolean
  camera?: { position: [number, number, number]; fov?: number; near?: number; far?: number }
  quality?: QualitySettings
  shadows?: boolean
  /** Préchauffe matériaux et textures avant affichage */
  preload?: boolean
  /** Retarde le montage de la scène (laisse respirer le premier rendu de la page) */
  deferMs?: number
  onCreated?: () => void
  /** Élément affiché pendant le chargement du moteur 3D */
  loadingLabel?: string
}

/**
 * Hôte de scène 3D :
 *  · vérifie le support WebGL (repli image sinon),
 *  · ne monte le moteur three.js que lorsque la section approche de l'écran,
 *  · met le rendu en pause hors écran (batterie / GPU),
 *  · charge le moteur dans un chunk séparé (aucun impact sur le LCP).
 */
export function CanvasHost({
  children,
  fallback,
  className,
  interactive = false,
  camera = { position: [0, 0.14, 4.6], fov: 30, near: 0.1, far: 80 },
  quality,
  shadows = false,
  preload = false,
  deferMs = 0,
  onCreated,
  loadingLabel,
}: CanvasHostProps) {
  const webgl = useMemo(supportsWebGL, [])
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '260px 0px' })
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(deferMs === 0)
  const [mounted, setMounted] = useState(false)
  const [frozen, setFrozen] = useState(false)
  const q = quality ?? qualityFor('medium')

  // Mouvement réduit : la maquette s'affiche, puis se figera (image 3D statique)
  useEffect(() => {
    if (!reduced) {
      setFrozen(false)
      return
    }
    const id = window.setTimeout(() => setFrozen(true), 1400)
    return () => window.clearTimeout(id)
  }, [reduced])

  // Montage différé : le temps que la page s'affiche et que les images arrivent
  useEffect(() => {
    if (deferMs === 0) return
    const id = window.setTimeout(() => setReady(true), deferMs)
    return () => window.clearTimeout(id)
  }, [deferMs])

  useEffect(() => {
    if (inView && ready) setMounted(true)
  }, [inView, ready])

  if (!webgl) {
    return (
      <div ref={ref} className={cn('relative overflow-hidden', className)}>
        {fallback}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        'canvas-host relative',
        interactive ? 'pointer-events-auto' : 'pointer-events-none',
        className,
      )}
      style={{ touchAction: interactive ? 'none' : 'pan-y' }}
    >
      <Suspense fallback={<CanvasHostSkeleton label={loadingLabel} />}>
        {mounted && (
          <CanvasRuntime
            active={inView && !frozen}
            quality={q}
            shadows={shadows}
            preload={preload}
            onCreated={onCreated}
            camera={{ ...camera, fov: camera.fov ?? 30, near: camera.near ?? 0.1, far: camera.far ?? 80 }}
          >
            {children}
          </CanvasRuntime>
        )}
      </Suspense>
    </div>
  )
}

export { qualityFor }
export type { QualitySettings }
