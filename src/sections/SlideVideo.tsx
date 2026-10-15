import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { FILM_DURATION, filmSlides } from '@/data/slides'
import { usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'
import { SmartImage } from '@/components/ui/SmartImage'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { Eyebrow } from '@/components/ui/SectionHeading'

/**
 * « Slide vidéo » — slider cinématique plein cadre.
 *
 * Chaque slide joue soit une vraie vidéo mp4 (champ `video` de `src/data/slides.ts`),
 * soit son image avec un lent mouvement Ken Burns (scale + translation) qui donne
 * la sensation d'un plan filmé. Autoplay avec barres de progression, lecture /
 * pause, flèches, vignettes, swipe tactile et clavier.
 */
export function SlideVideo() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [muted, setMuted] = useState(true)
  const [dragging, setDragging] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const pointerX = useRef<number | null>(null)
  const elapsed = useRef(0)
  const lastTick = useRef(0)

  const count = filmSlides.length
  const slide = filmSlides[index]
  const hasVideo = Boolean(slide.video)
  const playing = !userPaused && !hovered && !reduced

  const go = useCallback(
    (next: number) => {
      elapsed.current = 0
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  // Autoplay piloté par le temps écoulé : la pause gèle la minuterie,
  // exactement comme la barre de progression (animation-play-state).
  useEffect(() => {
    if (!playing) return
    lastTick.current = Date.now()
    const id = window.setInterval(() => {
      elapsed.current += Date.now() - lastTick.current
      lastTick.current = Date.now()
      if (elapsed.current >= FILM_DURATION) {
        elapsed.current = 0
        setIndex((i) => (i + 1) % count)
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [index, playing, count])

  // Pause automatique quand l'onglet est en arrière-plan
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setUserPaused(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    pointerX.current = e.clientX
    setDragging(true)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerX.current === null) return
    const delta = e.clientX - pointerX.current
    pointerX.current = null
    setDragging(false)
    if (Math.abs(delta) > 48) {
      go(delta < 0 ? index + 1 : index - 1)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(index - 1)
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(index + 1)
    }
  }

  return (
    <section id="film" className="relative overflow-hidden bg-ink-900 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-40" aria-hidden />

      <div className="container-x relative">
        {/* En-tête */}
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal y={14} duration={0.6}>
              <Eyebrow index="01" tone="dark">Le film</Eyebrow>
            </Reveal>
            <RevealText
              text="CRISTALUM en images"
              className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.2rem)] leading-[1.08] text-alu-100"
            />
            <Reveal y={16} delay={0.08}>
              <p className="mt-4 max-w-lg text-[0.92rem] leading-relaxed text-alu-400">
                Quatre regards sur notre savoir-faire — la lumière, le détail, la terrasse, la nuit.
              </p>
            </Reveal>
          </div>

          {/* Commandes principales */}
          <Reveal y={16} delay={0.12}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={playing ? 'Mettre en pause' : 'Lire le film'}
                className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-alu-100 backdrop-blur-md transition-all duration-500 hover:border-accent-400/50 hover:bg-accent-500 hover:text-white"
              >
                {playing && !reduced ? <Pause className="size-4" /> : <Play className="size-4 translate-x-px" />}
              </button>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Slide précédente"
                className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-alu-100 backdrop-blur-md transition-all duration-500 hover:border-accent-400/50 hover:bg-white/15"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Slide suivante"
                className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-alu-100 backdrop-blur-md transition-all duration-500 hover:border-accent-400/50 hover:bg-white/15"
              >
                <ChevronRight className="size-5" />
              </button>
              {hasVideo && (
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Activer le son' : 'Couper le son'}
                  className="flex size-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-alu-100 backdrop-blur-md transition-all duration-500 hover:border-accent-400/50 hover:bg-white/15"
                >
                  {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                </button>
              )}
            </div>
          </Reveal>
        </div>

        {/* Scène */}
        <Reveal y={26} delay={0.1} duration={0.9}>
          <div
            ref={stageRef}
            role="region"
            aria-roledescription="carrousel"
            aria-label="Film CRISTALUM"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              pointerX.current = null
              setDragging(false)
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
              'relative mt-10 aspect-[16/9] max-h-[820px] min-h-[420px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-800 outline-none select-none focus-visible:ring-2 focus-visible:ring-accent-500/60',
              dragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
            style={{ touchAction: 'pan-y' }}
          >
            {/* Slides empilées (fondu enchaîné) */}
            {filmSlides.map((item, i) => {
              const active = i === index
              return (
                <div
                  key={item.id}
                  aria-hidden={!active}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    active ? 'z-10 opacity-100' : 'z-0 opacity-0',
                  )}
                >
                  {item.video ? (
                    <video
                      className="h-full w-full object-cover"
                      src={item.video}
                      poster={`/images/${item.name}-1600.webp`}
                      autoPlay={active}
                      loop
                      muted={muted}
                      playsInline
                      preload={active ? 'auto' : 'none'}
                    />
                  ) : (
                    <SmartImage
                      name={item.name}
                      alt={item.title}
                      sizes="100vw"
                      priority={i === 0}
                      objectPosition={item.objectPosition ?? 'center'}
                      className="h-full w-full"
                      imgClassName={cn(
                        // Mouvement « caméra » : le plan vit même sans vidéo
                        active && !reduced && (i % 2 === 0 ? 'film-kenburns-a' : 'film-kenburns-b'),
                      )}
                    />
                  )}
                </div>
              )
            })}

            {/* Voile de lisibilité */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_top,rgba(6,8,10,0.78)_0%,rgba(6,8,10,0.18)_38%,transparent_62%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(to_right,rgba(6,8,10,0.45)_0%,transparent_45%)]"
            />

            {/* Compteur */}
            <div className="absolute right-5 top-5 z-30 rounded-full border border-white/15 bg-ink-900/50 px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.18em] text-alu-200 backdrop-blur-md">
              {String(index + 1).padStart(2, '0')}
              <span className="mx-1 text-alu-500">/</span>
              {String(count).padStart(2, '0')}
            </div>

            {/* Légende animée */}
            <div className="absolute bottom-0 left-0 right-0 z-30 p-6 md:p-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl"
                >
                  <p className="text-[0.66rem] uppercase tracking-[0.3em] text-accent-300">{slide.eyebrow}</p>
                  <h3 className="mt-2.5 font-display text-[clamp(1.35rem,3vw,2.15rem)] leading-tight text-white">
                    {slide.title}
                  </h3>
                  <p className="mt-2.5 max-w-lg text-[0.86rem] leading-relaxed text-alu-300">{slide.caption}</p>
                </motion.div>
              </AnimatePresence>

              {/* Barres de progression */}
              <div className="mt-6 flex items-center gap-2.5">
                {filmSlides.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Aller à la slide ${i + 1}`}
                    aria-current={i === index}
                    className="group relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-all duration-500"
                    style={{ width: i === index ? 64 : 28 }}
                  >
                    {i === index && (
                      <span
                        key={item.id}
                        className="absolute inset-y-0 left-0 rounded-full bg-accent-500"
                        style={{
                          width: '100%',
                          animation: `film-progress ${FILM_DURATION}ms linear both`,
                          animationPlayState: playing ? 'running' : 'paused',
                        }}
                      />
                    )}
                    {i !== index && (
                      <span className="absolute inset-0 rounded-full bg-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Vignettes */}
        <Reveal y={18} delay={0.16} stagger={0.05} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {filmSlides.map((item, i) => {
            const active = i === index
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => go(i)}
                aria-label={item.title}
                aria-current={active}
                className={cn(
                  'group relative aspect-[16/9] overflow-hidden rounded-xl border transition-all duration-500',
                  active
                    ? 'border-accent-500/70 shadow-[0_18px_40px_-24px_rgba(200,16,46,0.65)]'
                    : 'border-white/10 opacity-70 hover:border-white/30 hover:opacity-100',
                )}
              >
                <SmartImage
                  name={item.name}
                  alt=""
                  sizes="(max-width: 640px) 50vw, 25vw"
                  objectPosition={item.objectPosition ?? 'center'}
                  className="h-full w-full"
                />
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-1 transition-all duration-500',
                    active ? 'bg-accent-500' : 'bg-transparent',
                  )}
                />
              </button>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
