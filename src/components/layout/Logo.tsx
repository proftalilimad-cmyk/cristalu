import { cn } from '@/lib/utils'

/**
 * Marque CRISTALU MAROC — logo officiel fourni par l'entreprise
 * (fond blanc natif = plaque de lisibilité garantie sur tous les fonds).
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
      <img src="/images/logo-mark.png" alt="" aria-hidden className="h-full w-full object-contain" />
    </span>
  )
}

/** Logo complet « CRISTALU MAROC ». */
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
        <img
          src="/images/logo-cristalu.png"
          alt="CRISTALU MAROC"
          width={484}
          height={96}
          className="h-8 w-auto px-2.5 py-2 md:h-9"
        />
      </span>
    </span>
  )
}
