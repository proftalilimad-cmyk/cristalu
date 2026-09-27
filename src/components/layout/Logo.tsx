type Props = { className?: string; tone?: 'dark' | 'light' }

/** Typographic mark — no invented graphic identity, just a precise wordmark. */
export default function Logo({ className = '', tone = 'dark' }: Props) {
  const color = tone === 'light' ? 'text-white' : 'text-ink'
  const sub = tone === 'light' ? 'text-white/55' : 'text-steel'
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className={`h-7 w-7 shrink-0 ${color}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden
      >
        <rect x="4.5" y="3.5" width="23" height="25" />
        <line x1="16" y1="3.5" x2="16" y2="28.5" />
        <path d="M7.5 8 L13 8 L7.5 19 Z" fill="currentColor" opacity="0.35" stroke="none" />
        <path d="M19 16 L24.5 16 L19 27 Z" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[0.95rem] uppercase tracking-[0.2em] ${color}`}
          style={{ fontWeight: 700 }}
        >
          Cristalu
        </span>
        <span className={`mt-1 text-[0.58rem] uppercase tracking-[0.42em] ${sub}`}>Maroc</span>
      </span>
    </span>
  )
}
