import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, MapPin, Ruler, X } from 'lucide-react'
import { gsap, initGsap } from '@/lib/gsap'
import type { Project } from '@/data/projects'
import { cn } from '@/lib/utils'
import { SmartImage } from '@/components/ui/SmartImage'

/**
 * Visionneuse plein écran d'un projet — transitions GSAP.
 * Navigation clavier : ← → Échap.
 */
export function ProjectViewer({
  project,
  onClose,
  onPrev,
  onNext,
  index,
  total,
}: {
  project: Project | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  index: number
  total: number
}) {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const imageWrap = useRef<HTMLDivElement>(null)
  const lines = useRef<HTMLDivElement>(null)
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos = project?.photos?.length ? project.photos : project ? [project.image] : []

  // Chaque projet démarre sur sa photo de couverture
  useEffect(() => {
    setPhotoIndex(0)
  }, [project])

  useEffect(() => {
    if (!project) return
    initGsap()
    const tl = gsap.timeline({ defaults: { ease: 'cristal' } })
    tl.fromTo(root.current, { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(panel.current, { yPercent: 4, opacity: 0.6 }, { yPercent: 0, opacity: 1, duration: 0.7 }, 0)
      .fromTo(
        imageWrap.current,
        { clipPath: 'inset(12% 8% 12% 8% round 28px)', scale: 1.06 },
        { clipPath: 'inset(0% 0% 0% 0% round 28px)', scale: 1, duration: 1.1 },
        0.05,
      )
    if (lines.current) {
      tl.fromTo(
        lines.current.children,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 },
        0.28,
      )
    }
    return () => {
      tl.kill()
    }
  }, [project])

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [project, onClose, onPrev, onNext])

  if (!project) return null

  return (
    <div ref={root} className="fixed inset-0 z-[80] flex items-stretch justify-center bg-ink-950/92 backdrop-blur-xl">
      <button type="button" aria-label="Fermer" onClick={onClose} className="absolute inset-0 cursor-default" />

      <div
        ref={panel}
        className="relative z-10 flex h-full w-full max-w-7xl flex-col overflow-y-auto px-4 pb-8 pt-6 md:px-8 md:pt-10"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="glass-pane rounded-full px-3 py-1.5 text-[0.66rem] uppercase tracking-[0.22em] text-alu-200">
              {project.category}
            </span>
            <span className="font-display text-[0.78rem] tracking-[0.18em] text-alu-400">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la visionneuse"
            className="glass-pane flex size-11 items-center justify-center rounded-full text-alu-100 transition-transform duration-500 hover:rotate-90"
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          ref={imageWrap}
          className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-white/10"
          style={{ clipPath: 'inset(0% 0% 0% 0% round 28px)' }}
        >
          <SmartImage
            key={photos[photoIndex]}
            name={photos[photoIndex]}
            alt={`${project.title} — photo ${photoIndex + 1}`}
            className="aspect-[16/10] w-full md:aspect-[16/9]"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
          {photos.length > 1 && (
            <div className="absolute right-5 top-5 rounded-full border border-white/15 bg-ink-900/55 px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] text-alu-200 backdrop-blur-md">
              {String(photoIndex + 1).padStart(2, '0')}
              <span className="mx-0.5 text-alu-500">/</span>
              {String(photos.length).padStart(2, '0')}
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
            <div>
              <h3 className="font-display text-[clamp(1.3rem,3vw,2.1rem)] leading-tight tracking-tight text-alu-100">
                {project.title}
              </h3>
              <p className="mt-1.5 text-[0.8rem] text-alu-300/80">{project.type}</p>
            </div>
            <div className="hidden shrink-0 gap-2 md:flex">
              <button
                type="button"
                onClick={onPrev}
                aria-label="Projet précédent"
                className="glass-pane flex size-11 items-center justify-center rounded-full text-alu-100 transition-transform duration-500 hover:-translate-x-0.5"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={onNext}
                aria-label="Projet suivant"
                className="glass-pane flex size-11 items-center justify-center rounded-full text-alu-100 transition-transform duration-500 hover:translate-x-0.5"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </div>

        {photos.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {photos.map((photo, i) => (
              <button
                key={photo}
                type="button"
                onClick={() => setPhotoIndex(i)}
                aria-label={`Photo ${i + 1} sur ${photos.length}`}
                aria-current={i === photoIndex}
                className={cn(
                  'relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-500 md:h-[4.5rem] md:w-28',
                  i === photoIndex
                    ? 'border-accent-500/80 opacity-100'
                    : 'border-white/10 opacity-55 hover:border-white/35 hover:opacity-100',
                )}
              >
                <SmartImage name={photo} alt="" sizes="112px" className="h-full w-full" />
              </button>
            ))}
          </div>
        )}

        <div ref={lines} className="mt-7 grid gap-7 md:grid-cols-[1.3fr_1fr] md:gap-12">
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.26em] text-accent-400">Description</p>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-alu-300">{project.description}</p>
          </div>
          <dl className="grid gap-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" />
              <div>
                <dt className="text-[0.66rem] uppercase tracking-[0.24em] text-alu-400/80">Localisation</dt>
                <dd className="mt-1 text-[0.9rem] text-alu-200">
                  {project.location ?? 'Communiquée sur demande (confidentialité client)'}
                </dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Ruler className="mt-0.5 size-4 shrink-0 text-accent-400" />
              <div>
                <dt className="text-[0.66rem] uppercase tracking-[0.24em] text-alu-400/80">Matériaux</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {project.materials.map((m) => (
                    <span
                      key={m}
                      className={cn(
                        'rounded-full border border-white/12 bg-white/5 px-2.5 py-1 text-[0.72rem] text-alu-200',
                      )}
                    >
                      {m}
                    </span>
                  ))}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="mt-6 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={onPrev}
            className="glass-pane flex-1 rounded-full py-3 text-[0.8rem] text-alu-100"
          >
            Précédent
          </button>
          <button
            type="button"
            onClick={onNext}
            className="glass-pane flex-1 rounded-full py-3 text-[0.8rem] text-alu-100"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  )
}
