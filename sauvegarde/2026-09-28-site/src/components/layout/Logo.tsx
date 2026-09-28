import { MARK_PATHS, MARK_VIEWBOX, WORD_PATHS, WORD_VIEWBOX } from './logoPaths'

type Props = {
  className?: string
  tone?: 'dark' | 'light'
  /** symbole seul (favicon, mobile, watermark) */
  markOnly?: boolean
}

/**
 * Logo officiel Cristalu Maroc — tracés vectoriels issus du fichier source
 * fourni par le client. Charte : noir #111111 + rouge #A30000.
 * Sur fond sombre, le rouge est éclairci (#D23434) pour rester lisible.
 */
export default function Logo({ className = '', tone = 'dark', markOnly = false }: Props) {
  const ink = tone === 'light' ? '#FFFFFF' : '#111111'
  const red = tone === 'light' ? '#D23434' : '#A30000'
  const sub = tone === 'light' ? 'text-white/60' : 'text-graphite'

  const Mark = (
    <svg
      viewBox={MARK_VIEWBOX}
      className="h-6 w-auto shrink-0 md:h-7"
      role="img"
      aria-label="Cristalu Maroc"
      focusable="false"
    >
      {MARK_PATHS.map((p, i) => (
        <path key={i} d={p.d} fill={p.tone === 'red' ? red : ink} />
      ))}
    </svg>
  )

  if (markOnly) return <span className={className}>{Mark}</span>

  return (
    <span className={`flex items-center gap-[0.5rem] md:gap-[0.6rem] ${className}`}>
      {Mark}
      <span className="flex flex-col items-stretch">
        <svg
          viewBox={WORD_VIEWBOX}
          className="h-[0.78rem] w-auto md:h-[0.88rem]"
          role="presentation"
          aria-hidden="true"
          focusable="false"
        >
          {WORD_PATHS.map((p, i) => (
            <path key={i} d={p.d} fill={ink} />
          ))}
        </svg>
        <span
          className={`mt-[0.35rem] text-end text-[0.46rem] font-medium uppercase leading-none tracking-[0.42em] ltr:pr-[0.12em] md:text-[0.5rem] ${sub}`}
        >
          Maroc
        </span>
      </span>
    </span>
  )
}
