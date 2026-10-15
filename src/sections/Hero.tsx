import { lazy, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Images,
  MousePointerClick,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Ruler,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { gsap, initGsap } from '@/lib/gsap'
import { FILM_DURATION, filmSlides } from '@/data/slides'
import { siteConfig } from '@/data/site'
import { CanvasHost } from '@/three/CanvasHost'
import { qualityFor } from '@/three/quality'
import { usePointer } from '@/hooks/usePointer'
import { useIsMobile, useQualityTier, usePrefersReducedMotion } from '@/hooks'
import { cn } from '@/lib/utils'
import { LinkButton } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/ui/SmartImage'

/** La scène 3D est chargée à la demande (chunk dédié à three.js). */
const HeroScene = lazy(() => import('@/three/HeroScene').then((m) => ({ default: m.HeroScene })))

const specs = [
  { icon: ShieldCheck, label: 'Rupture de pont thermique' },
  { icon: Ruler, label: 'Fabrication sur mesure' },
  { icon: Sparkles, label: 'Vitrages de sécurité' },
]

/**
 * Hero « CRISTALUM en images » — le slider cinématique (plans du film avec
 * mouvement caméra, fondu enchaîné, autoplay et commandes) tient lieu de décor,
 * sous le texte de marque, la fenêtre 3D interactive et les CTA.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)
  const pointer = usePointer()
  const { tier } = useQualityTier()
  const isMobile = useIsMobile()
  const reduced = usePrefersReducedMotion()
  const quality = qualityFor(tier)

  /* ---- Slider ---- */
  const [index, setIndex] = useState(0)
  const [userPaused, setUserPaused] = useState(false)
  const [muted, setMuted] = useState(true)
  const elapsed = useRef(0)
  const lastTick = useRef(0)
  const pointerX = useRef<number | null>(null)

  const count = filmSlides.length
  const slide = filmSlides[index]
  const playing = !userPaused && !reduced

  const go = useCallback(
    (next: number) => {
      elapsed.current = 0
      setIndex(((next % count) + count) % count)
    },
    [count],
  )

  // Autoplay — minuterie et barre de progression partagent le même temps écoulé
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

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) setUserPaused(true)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Swipe horizontal (le scroll vertical reste libre : touch-action pan-y)
  const onPointerDown = (e: React.PointerEvent) => {
    pointerX.current = e.clientX
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerX.current === null) return
    const delta = e.clientX - pointerX.current
    pointerX.current = null
    if (Math.abs(delta) > 48) go(delta < 0 ? index + 1 : index - 1)
  }

  useEffect(() => {
    if (reduced) return
    initGsap()
    const ctx = gsap.context(() => {
      // Parallaxe du décor : les plans reculent doucement au défilement
      gsap.to(imageRef.current, {
        yPercent: 14,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to(contentRef.current, {
        y: -70,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      })
      // Progression transmise à la scène 3D
      gsap.to(scrollRef, {
        current: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="accueil"
      ref={sectionRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (pointerX.current = null)}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900 pt-28 pb-24 md:pt-32"
      style={{ touchAction: 'pan-y' }}
    >
      {/* Décor : slider cinématique « CRISTALUM en images » */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imageRef} className="absolute inset-0 will-change-transform">
          {filmSlides.map((item, i) => {
            const active = i === index
            return (
              <div
                key={item.id}
                aria-hidden={!active}
                className={cn(
                  'absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  active ? 'opacity-100' : 'opacity-0',
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
                      active && !reduced && (i % 2 === 0 ? 'film-kenburns-a' : 'film-kenburns-b'),
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/92 via-ink-950/70 to-ink-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/75" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_75%_45%,transparent_20%,rgba(6,8,10,0.55)_85%)]" />
      </div>

      {/* Scène 3D — le châssis aluminium au premier plan */}
      <CanvasHost
        className="absolute inset-0 z-0"
        interactive={false}
        quality={quality}
        camera={{ position: [0, 0.14, 5.15], fov: 30 }}
        fallback={null}
        deferMs={900}
        loadingLabel="Initialisation de la maquette 3D"
      >
        <HeroScene
          tier={tier}
          mobile={isMobile}
          pointer={pointer}
          scrollRef={scrollRef}
          finishId="anthracite"
          glassId="transparent"
        />
      </CanvasHost>

      {/* Contenu */}
      <div ref={contentRef} className="container-x relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="glass-pane mb-7 inline-flex items-center gap-2.5 rounded-full py-2 pl-3 pr-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-alu-200"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-pulse-ring rounded-full bg-accent-400" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-400" />
            </span>
            Maroc · Sur mesure
          </motion.div>

          <h1 className="sr-only">CRISTALUM — Menuiserie aluminium &amp; PVC sur mesure au Maroc</h1>

          <motion.p
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 1 }}
            className="font-display text-[clamp(3.4rem,12vw,9rem)] font-semibold leading-[0.86] tracking-[-0.045em] text-metal-light"
          >
            CRISTALUM
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl"
          >
            <p className="font-display text-[clamp(1.05rem,2.4vw,1.6rem)] leading-snug text-alu-100">
              {siteConfig.longTagline}
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-alu-300/85 md:text-[1rem]">
              {siteConfig.supportingText}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <LinkButton
              href="#contact"
              size="lg"
              variant="dark"
              className="border border-white/15"
              iconRight={<ArrowUpRight className="size-4" />}
            >
              Demander un devis
            </LinkButton>
            <LinkButton
              href="#realisations"
              size="lg"
              variant="glass"
              className="text-alu-100"
              icon={<Images className="size-4" />}
            >
              Découvrir nos réalisations
            </LinkButton>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 1 }}
            className="mt-10 flex flex-wrap gap-x-7 gap-y-3"
          >
            {specs.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[0.78rem] text-alu-300/75">
                <Icon className="size-4 text-accent-400" />
                {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      {/* Commandes du slider « en images » */}
      <div
        className="absolute bottom-24 right-5 z-10 w-[min(21rem,calc(100vw-2.5rem))] md:bottom-12 md:right-8"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            go(index - 1)
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            go(index + 1)
          }
        }}
      >
        <div className="glass-pane rounded-2xl p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[0.6rem] uppercase tracking-[0.28em] text-accent-300">{slide.eyebrow}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={slide.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-1 truncate font-display text-[0.92rem] text-alu-100"
                >
                  {slide.title}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                aria-label={playing ? 'Mettre en pause' : 'Lire le film'}
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-alu-200 transition-colors duration-500 hover:border-accent-400/50 hover:text-white"
              >
                {playing ? <Pause className="size-3" /> : <Play className="size-3 translate-x-px" />}
              </button>
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Image précédente"
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-alu-200 transition-colors duration-500 hover:border-accent-400/50 hover:text-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Image suivante"
                className="flex size-8 items-center justify-center rounded-full border border-white/15 text-alu-200 transition-colors duration-500 hover:border-accent-400/50 hover:text-white"
              >
                <ChevronRight className="size-4" />
              </button>
              {slide.video && (
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Activer le son' : 'Couper le son'}
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-alu-200 transition-colors duration-500 hover:border-accent-400/50 hover:text-white"
                >
                  {muted ? <VolumeX className="size-3" /> : <Volume2 className="size-3" />}
                </button>
              )}
            </div>
          </div>

          {/* Barres de progression */}
          <div className="mt-3 flex items-center gap-2">
            {filmSlides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Aller à l’image ${i + 1}`}
                aria-current={i === index}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/15"
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
              </button>
            ))}
            <span className="ml-1 font-mono text-[0.62rem] tracking-[0.14em] text-alu-300/80">
              {String(index + 1).padStart(2, '0')}
              <span className="mx-0.5 text-alu-500">/</span>
              {String(count).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <motion.a
        href="#a-propos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.62rem] uppercase tracking-[0.32em] text-alu-300/70 transition-colors hover:text-alu-100"
      >
        <span className="hidden md:inline">Défiler</span>
        <span className="relative h-14 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-5 animate-scan bg-gradient-to-b from-transparent via-accent-300 to-transparent" />
        </span>
        <MousePointerClick className="size-3.5 md:hidden" />
      </motion.a>

      <Reveal
        className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-2.5 xl:flex"
        y={0}
        x={30}
        delay={1.2}
        stagger={0.08}
      >
        {[
          ['Aluminium', 'anodisé & thermolaqué'],
          ['PVC', 'multi-chambres'],
          ['Verre', 'trempé & feuilleté'],
        ].map(([title, sub]) => (
          <div
            key={title}
            className="glass-pane rounded-2xl px-4 py-3 text-right backdrop-blur-xl"
          >
            <p className="font-display text-[0.82rem] tracking-[0.12em] text-alu-100">{title}</p>
            <p className="text-[0.68rem] text-alu-300/70">{sub}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
