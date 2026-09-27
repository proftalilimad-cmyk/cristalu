import { useI18n } from '../../i18n'

/**
 * Schéma de principe : intégration du coffre MOMO Box au-dessus de l'ouverture.
 * Volontairement simplifié — il illustre le principe, il ne remplace pas le
 * plan de pose fourni avec le produit.
 */
export default function MomoDiagram() {
  const { locale } = useI18n()

  const legend =
    locale === 'ar'
      ? [
          'صندوق MOMO Box (بوليستيرين عالي الكثافة)',
          'بكرة اللف',
          'جسم الريدو',
          'مجاري جانبية',
          'النجارة (ألمنيوم / PVC)',
          'الجدار + الطلاء',
        ]
      : [
          'Coffre MOMO Box (polystyrène haute densité)',
          'Enrouleur du rideau',
          'Tablier',
          'Coulisses latérales',
          'Menuiserie (aluminium / PVC)',
          'Maçonnerie + enduit',
        ]

  const num = (x: number, y: number, n: number) => (
    <g>
      <circle cx={x} cy={y} r="9.5" fill="#a30000" />
      <text
        x={x}
        y={y + 3.6}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#ffffff"
        fontFamily="Manrope, Arial, sans-serif"
      >
        {n}
      </text>
    </g>
  )

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <svg viewBox="0 0 420 320" className="w-full" role="img" aria-label="Schéma MOMO Box">
        {/* maçonnerie */}
        <rect x="10" y="10" width="400" height="300" fill="#f0f1f1" />
        <rect x="10" y="10" width="400" height="300" fill="none" stroke="#d7dadd" />
        {/* hachures mur */}
        {Array.from({ length: 26 }).map((_, i) => (
          <line
            key={i}
            x1={10 + i * 16}
            y1="10"
            x2={10 + i * 16 - 20}
            y2="310"
            stroke="#d7dadd"
            strokeWidth="1"
          />
        ))}
        {/* ouverture */}
        <rect x="90" y="60" width="240" height="250" fill="#ffffff" />

        {/* coffre */}
        <rect x="90" y="60" width="240" height="66" rx="3" fill="#ffffff" stroke="#111111" strokeWidth="2" />
        <rect x="98" y="68" width="224" height="50" rx="2" fill="#fafaf9" stroke="#9aa0a5" />
        {/* enrouleur */}
        <circle cx="210" cy="93" r="20" fill="none" stroke="#111111" strokeWidth="2" />
        <circle cx="210" cy="93" r="6" fill="#111111" />
        {/* tablier */}
        <rect x="120" y="126" width="180" height="96" fill="#e9ecee" stroke="#9aa0a5" />
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1="120"
            y1={126 + 13 * (i + 1)}
            x2="300"
            y2={126 + 13 * (i + 1)}
            stroke="#9aa0a5"
          />
        ))}
        {/* coulisses */}
        <rect x="108" y="126" width="12" height="184" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
        <rect x="300" y="126" width="12" height="184" fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
        {/* menuiserie */}
        <rect x="126" y="228" width="168" height="82" fill="none" stroke="#111111" strokeWidth="2" />
        <line x1="210" y1="228" x2="210" y2="310" stroke="#111111" strokeWidth="1.5" />

        {/* appels */}
        {num(78, 78, 1)}
        {num(248, 93, 2)}
        {num(210, 176, 3)}
        {num(114, 250, 4)}
        {num(168, 292, 5)}
        {num(48, 180, 6)}
      </svg>

      <ol className="flex flex-col gap-3">
        {legend.map((item, i) => (
          <li key={i} className="flex items-start gap-4 border-b border-ink/10 pb-3 text-sm text-graphite">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-[0.68rem] font-semibold text-white">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  )
}
