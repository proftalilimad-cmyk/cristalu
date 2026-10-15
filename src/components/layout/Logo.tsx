import { cn } from '@/lib/utils'

/** Marque CRISTALUM : un cadre aluminium dont le vitrage capte la lumière. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('h-9 w-9', className)} aria-hidden>
      <defs>
        <linearGradient id="cristalum-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="cristalum-glass" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8FD3E8" stopOpacity="0.12" />
          <stop offset="0.5" stopColor="#DFF1F7" stopOpacity="0.85" />
          <stop offset="1" stopColor="#8FD3E8" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="3" y="2" width="34" height="36" rx="3" fill="none" stroke="url(#cristalum-metal)" strokeWidth="2" />
      <rect x="10" y="9" width="20" height="22" rx="1.5" fill="url(#cristalum-glass)" />
      <path d="M11 30 L29 11" stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17 30 L30 16" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span className={cn('group inline-flex items-center gap-3', className)}>
      <LogoMark className="text-current transition-transform duration-700 group-hover:rotate-[3deg]" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-[1.16rem] font-semibold tracking-[0.26em]',
            tone === 'light' ? 'text-ink-900' : 'text-alu-100',
          )}
        >
          CRISTALUM
        </span>
        <span
          className={cn(
            'mt-1 text-[0.56rem] font-medium uppercase tracking-[0.32em]',
            tone === 'light' ? 'text-ink-500' : 'text-alu-400/85',
          )}
        >
          Aluminium · PVC · Verre
        </span>
      </span>
    </span>
  )
}
