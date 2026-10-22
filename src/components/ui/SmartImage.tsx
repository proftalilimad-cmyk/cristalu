import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/** Toutes les images produites par `npm run images` (public/images/<base>-800|1600.webp). */
export const IMAGE_BASES = [
  'hero-villa',
  'arch-villa',
  'before',
  'service-aluminium',
  'service-pvc',
  'service-baie',
  'service-pergola',
  'service-garde-corps',
  'service-volets',
  'service-miroiterie',
  'film-sejour',
  'film-detail',
  'film-terrasse',
  'film-nuit',
  'usine',
  'real-facade-vitree',
  'real-garde-corps-1',
  'real-garde-corps-2',
  'real-garde-corps-3',
  'real-volets-1',
  'real-volets-2',
  'real-portes-1',
  'real-portes-2',
  'real-portes-3',
  'real-habillage-1',
  'real-habillage-2',
  'real-flotte-1',
  'real-flotte-2',
  'real-facade-bardage-noir',
  'real-garde-corps-4',
  'real-manutention-verre-1',
  'real-piscine-villa',
  'real-portes-4',
] as const

export type ImageBase = (typeof IMAGE_BASES)[number]

/** @deprecated alias conservé pour la compatibilité des imports */
export type ImageName = ImageBase

type SmartImageProps = {
  name: ImageName
  alt: string
  className?: string
  /** Attribut sizes — affine le choix de la source responsive */
  sizes?: string
  /** Charge l'image sans attendre (LCP) */
  priority?: boolean
  objectPosition?: string
  imgClassName?: string
}

/**
 * Image responsive WebP (800 / 1600 px) avec fondu au chargement.
 * Les fichiers sont produits par `npm run images` (sharp).
 */
export function SmartImage({
  name,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  objectPosition = 'center',
  imgClassName,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  return (
    <span className={cn('relative block overflow-hidden bg-alu-200', className)}>
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 bg-gradient-to-br from-alu-200 via-alu-100 to-alu-300 transition-opacity duration-700',
          loaded ? 'opacity-0' : 'animate-pulse opacity-100',
        )}
      />
      <img
        ref={ref}
        src={`/images/${name}-1600.webp`}
        srcSet={`/images/${name}-800.webp 800w, /images/${name}-1600.webp 1600w`}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        style={{ objectPosition }}
        className={cn(
          'relative h-full w-full object-cover transition-[opacity,transform,filter] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          loaded ? 'scale-100 opacity-100 blur-0' : 'scale-[1.04] opacity-0 blur-md',
          imgClassName,
        )}
      />
    </span>
  )
}
