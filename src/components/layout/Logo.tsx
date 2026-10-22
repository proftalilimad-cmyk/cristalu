import { cn } from '@/lib/utils'

/**
 * Marque CRISTALU MAROC — logo officiel fourni par l'entreprise
 * (fond blanc natif = plaque de lisibilité garantie sur tous les fonds).
 * Optimisé: WebP retina + PNG fallback, sans métadonnées.
 */

/** Symbole seul (C + chevron) — utilisé dans les panneaux flottants. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-[0_8px_22px_-14px_rgba(6,8,10,0.55)]',
        className,
      )}
    >
      <img
        src="/images/logo-mark.png"
        srcSet="/images/logo-mark.png 1024w"
        sizes="48px"
        alt=""
        aria-hidden
        width={1024}
        height={1024}
        decoding="async"
        className="h-full w-full object-contain p-[8%]"
      />
    </span>
  )
}

/** Logo complet « CRISTALU MAROC » — retina WebP + fallback PNG. */
export function Logo({
  tone: _tone,
  className,
}: {
  /** Conservé pour compatibilité : le fond blanc natif s'adapte à tous les tons. */
  tone?: 'light' | 'dark'
  className?: string
}) {
  void _tone
  return (
    <span className={cn('group inline-flex items-center', className)}>
      <span className="inline-flex items-center overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_12px_32px_-18px_rgba(6,8,10,0.8)] transition-transform duration-700 group-hover:-translate-y-0.5">
        <picture>
          <source
            type="image/webp"
            srcSet="/images/logo-cristalu-240.webp 240w, /images/logo-cristalu-360.webp 360w, /images/logo-cristalu-484.webp 484w, /images/logo-cristalu-720.webp 720w, /images/logo-cristalu-968.webp 968w"
            sizes="(max-width: 768px) 180px, 240px"
          />
          <img
            src="/images/logo-cristalu.png"
            srcSet="/images/logo-cristalu-484.png 484w, /images/logo-cristalu-968.png 968w"
            sizes="(max-width: 768px) 180px, 240px"
            alt="CRISTALU MAROC"
            width={484}
            height={96}
            decoding="async"
            fetchPriority="high"
            className="h-8 w-auto px-2.5 py-2 md:h-9"
          />
        </picture>
      </span>
    </span>
  )
}
