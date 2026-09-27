import { useCallback, useEffect, useRef, useState } from 'react'
import Media from '../ui/Media'
import SectionHeading from '../ui/SectionHeading'
import { useI18n } from '../../i18n'

/**
 * Draggable before/after comparison.
 * ⚠️ Visuels de démonstration : remplacez `before`/`after` par les photos
 * réelles d'un chantier de rénovation (même cadrage avant et après pose).
 */
export default function BeforeAfter({
  before = 'realisation-immeuble',
  after = 'hero-option-2',
}: {
  before?: string
  after?: string
}) {
  const { t } = useI18n()
  const container = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(52)
  const dragging = useRef(false)

  const setFromClientX = useCallback((clientX: number) => {
    const el = container.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setValue(Math.min(100, Math.max(0, pct)))
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => dragging.current && setFromClientX(e.clientX)
    const touch = (e: TouchEvent) => dragging.current && setFromClientX(e.touches[0].clientX)
    const up = () => (dragging.current = false)
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', touch, { passive: true })
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', touch)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
  }, [setFromClientX])

  return (
    <section className="bg-paper pb-24 lg:pb-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.beforeAfter.eyebrow}
          title={t.beforeAfter.title}
          intro={t.beforeAfter.intro}
        />

        <div
          ref={container}
          className="relative mt-12 aspect-16/10 w-full cursor-ew-resize select-none overflow-hidden rounded-xl md:aspect-16/8"
          onMouseDown={(e) => {
            dragging.current = true
            setFromClientX(e.clientX)
          }}
          onTouchStart={(e) => {
            dragging.current = true
            setFromClientX(e.touches[0].clientX)
          }}
        >
          {/* AFTER (background) */}
          <Media
            src={after}
            alt="Après : menuiseries aluminium et PVC posées"
            className="absolute inset-0 h-full w-full"
            sizes="100vw"
          />

          {/* BEFORE (clipped with clip-path so the image never distorts) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
            aria-hidden
          >
            <Media
              src={before}
              alt="Avant : anciennes menuiseries"
              className="h-full w-full [filter:grayscale(0.72)_contrast(0.92)_brightness(0.86)_sepia(0.18)]"
              sizes="100vw"
            />
          </div>

          {/* handle */}
          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white/90"
            style={{ left: `${value}%` }}
          >
            <span className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg">
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden>
                <path d="M7 1 2 6l5 5M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </div>

          <span className="pointer-events-none absolute top-5 rounded-full bg-black/55 px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-white backdrop-blur-sm ltr:left-5 rtl:right-5">
            {t.beforeAfter.before}
          </span>
          <span className="pointer-events-none absolute top-5 rounded-full bg-white/85 px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.2em] text-ink backdrop-blur-sm ltr:right-5 rtl:left-5">
            {t.beforeAfter.after}
          </span>

          <input
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-label={t.beforeAfter.hint}
            className="absolute bottom-4 left-1/2 z-20 w-2/3 -translate-x-1/2 opacity-0 focus-visible:opacity-100"
          />
        </div>

        <p className="mt-4 text-[0.7rem] uppercase tracking-[0.16em] text-steel">
          {t.beforeAfter.hint} · {t.projects.disclaimer}
        </p>
      </div>
    </section>
  )
}
