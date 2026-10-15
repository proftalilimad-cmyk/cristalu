import { motion } from 'framer-motion'
import { cities as cityData, type City } from '@/data/cities'
import {
  CITY_XY,
  GEO_BOUNDS,
  MOROCCO_PATH,
  MOROCCO_VIEWBOX,
  SCALE_BAR,
  projectLat,
  projectLon,
} from '@/data/moroccoGeo'
import { cn } from '@/lib/utils'

const LABEL_FONT = 27
const LABEL_GAP = 16

/** Position de l'étiquette selon le côté choisi (anti-chevauchement). */
function labelPlacement(city: City) {
  const [x, y] = CITY_XY[city.id]
  switch (city.label) {
    case 'left':
      return { x: x - LABEL_GAP, y: y + LABEL_FONT * 0.35, anchor: 'end' as const, weight: 'auto' }
    case 'right':
      return { x: x + LABEL_GAP, y: y + LABEL_FONT * 0.35, anchor: 'start' as const }
    case 'above':
      return { x, y: y - LABEL_GAP * 0.85, anchor: 'middle' as const }
    default:
      return { x, y: y + LABEL_GAP * 1.7, anchor: 'middle' as const }
  }
}

/** Graticule subtil (repères de latitude/longitude) — registre cartographique. */
function Graticule() {
  const lons = [-16, -14, -12, -10, -8, -6, -4, -2]
  const lats = [22, 24, 26, 28, 30, 32, 34, 36]
  const top = projectLat(36.4)
  const bottom = projectLat(20.6)

  return (
    <g className="text-ink-900/12" aria-hidden>
      {lons.map((lon) => {
        const x = projectLon(lon)
        return <line key={lon} x1={x} y1={top} x2={x} y2={bottom} stroke="currentColor" strokeWidth="1" strokeDasharray="4 10" />
      })}
      {lats.map((lat) => {
        const y = projectLat(lat)
        const x1 = projectLon(GEO_BOUNDS.lonMin + 0.2)
        const x2 = projectLon(GEO_BOUNDS.lonMax - 0.2)
        return (
          <g key={lat}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="currentColor" strokeWidth="1" strokeDasharray="4 10" />
            <text x={x1 - 8} y={y + 6} fontSize="20" textAnchor="end" fill="currentColor" strokeWidth="0">
              {lat}°N
            </text>
          </g>
        )
      })}
    </g>
  )
}

export type MoroccoMapProps = {
  /** Ville mise en avant (survol ou sélection) */
  activeId: string
  /** Ville effectivement choisie par le visiteur */
  selectedName: string
  onHover: (id: string | null) => void
  onSelect: (city: City) => void
  className?: string
}

/**
 * Carte du Maroc — contour réel (Natural Earth, `npm run map`), villes
 * positionnées par projection Mercator, lignes de liaison vers la ville active.
 */
export function MoroccoMap({ activeId, selectedName, onHover, onSelect, className }: MoroccoMapProps) {
  const active = cityData.find((c) => c.id === activeId) ?? cityData[0]
  const [ax, ay] = CITY_XY[active.id]

  return (
    <svg
      viewBox={MOROCCO_VIEWBOX}
      className={cn('relative w-full', className)}
      role="img"
      aria-label="Carte du Maroc — villes desservies par CRISTALUM"
    >
      <defs>
        <linearGradient id="cristalum-ma-fill" x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#e6e9eb" stopOpacity="0.92" />
          <stop offset="1" stopColor="#b6bdc2" stopOpacity="0.88" />
        </linearGradient>
        <linearGradient id="cristalum-ma-line" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f08c91" />
          <stop offset="0.45" stopColor="#c8102e" />
          <stop offset="1" stopColor="#e2494f" />
        </linearGradient>
        <filter id="cristalum-ma-shadow" x="-12%" y="-12%" width="124%" height="124%">
          <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="#06080a" floodOpacity="0.18" />
        </filter>
        <filter id="cristalum-ma-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <Graticule />

      {/* Contour du Royaume */}
      <path
        d={MOROCCO_PATH}
        fill="url(#cristalum-ma-fill)"
        stroke="url(#cristalum-ma-line)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        filter="url(#cristalum-ma-shadow)"
      />

      {/* Halo de la ville active */}
      <motion.circle
        cx={ax}
        cy={ay}
        r="46"
        fill="#e2494f"
        opacity="0.16"
        filter="url(#cristalum-ma-glow)"
        animate={{ r: [40, 52, 40], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Lignes de liaison */}
      <g>
        {cityData
          .filter((c) => c.id !== active.id)
          .map((city) => {
            const [cx, cy] = CITY_XY[city.id]
            return (
              <line
                key={`link-${city.id}`}
                x1={cx}
                y1={cy}
                x2={ax}
                y2={ay}
                stroke="#e2494f"
                strokeOpacity="0.5"
                strokeWidth="1.6"
                strokeDasharray="12 9"
                style={{ animation: 'dash-flow 1.6s linear infinite' }}
              />
            )
          })}
      </g>

      {/* Barre d'échelle */}
      <g transform={`translate(${projectLon(GEO_BOUNDS.lonMin + 0.6)} ${projectLat(21.9)})`} aria-hidden>
        <line x1="0" y1="0" x2={SCALE_BAR.units} y2="0" stroke="#545c63" strokeWidth="2.4" />
        <line x1="0" y1="-9" x2="0" y2="9" stroke="#545c63" strokeWidth="2.4" />
        <line x1={SCALE_BAR.units / 2} y1="-6" x2={SCALE_BAR.units / 2} y2="6" stroke="#545c63" strokeWidth="1.8" />
        <line x1={SCALE_BAR.units} y1="-9" x2={SCALE_BAR.units} y2="9" stroke="#545c63" strokeWidth="2.4" />
        <text x="0" y="-16" fontSize="20" fill="#545c63">
          0
        </text>
        <text x={SCALE_BAR.units} y="-16" fontSize="20" textAnchor="end" fill="#545c63">
          {SCALE_BAR.km} km
        </text>
      </g>

      {/* Rose des vents */}
      <g transform="translate(930 985)" className="text-ink-500" aria-hidden>
        <circle r="34" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
        <path d="M0,-26 L8,6 L0,0 L-8,6 Z" fill="currentColor" fillOpacity="0.75" />
        <text y="-40" fontSize="22" textAnchor="middle" fill="currentColor" fontWeight="600">
          N
        </text>
      </g>

      {/* Villes */}
      {cityData.map((city) => {
        const [x, y] = CITY_XY[city.id]
        const isActive = city.id === active.id
        const isSelected = city.name === selectedName
        const place = labelPlacement(city)

        return (
          <g
            key={city.id}
            transform={`translate(${x} ${y})`}
            className="cursor-pointer"
            onMouseEnter={() => onHover(city.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(city.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(city)}
            tabIndex={0}
            role="button"
            aria-label={`${city.name} — ${city.region}`}
          >
            {/* Cible tactile confortable */}
            <circle r="46" fill="transparent" />
            <motion.circle
              r={isActive ? 11 : 8.5}
              fill={isActive ? '#c8102e' : isSelected ? '#e2494f' : '#6f777e'}
              stroke="#ffffff"
              strokeWidth="3.4"
              animate={{ r: isActive ? 11 : 8.5 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            />
            {isSelected && (
              <circle r="16" fill="none" stroke="#e2494f" strokeWidth="2.4" strokeOpacity="0.9" />
            )}
            <text
              x={place.x - x}
              y={place.y - y}
              fontSize={LABEL_FONT}
              textAnchor={place.anchor}
              fill={isActive ? '#0b0d10' : '#4d575f'}
              fontWeight={isActive ? 600 : 400}
              className={cn(
                'pointer-events-none select-none transition-opacity duration-300',
                isActive ? 'opacity-100' : 'opacity-[0.72] hover:opacity-100',
              )}
            >
              {city.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
