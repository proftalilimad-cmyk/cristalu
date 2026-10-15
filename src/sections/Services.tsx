import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { services, type Service, type ServiceId } from '@/data/services'
import { cn } from '@/lib/utils'
import { LinkButton } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Reveal, RevealText } from '@/components/ui/Reveal'
import { SmartImage } from '@/components/ui/SmartImage'

/** Carte avec inclinaison 3D douce au survol (désactivée au tactile). */
function TiltCard({
  children,
  className,
  strength = 6,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  return (
    <div
      className={cn('group [perspective:1400px]', className)}
      onPointerMove={(e) => {
        const el = e.currentTarget.firstElementChild as HTMLElement | null
        if (!el || window.matchMedia('(hover: none)').matches) return
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        el.style.transform = `rotateY(${px * strength}deg) rotateX(${-py * strength}deg) translateY(-6px)`
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
      }}
      onPointerLeave={(e) => {
        const el = e.currentTarget.firstElementChild as HTMLElement | null
        if (el) el.style.transform = ''
      }}
    >
      {children}
    </div>
  )
}

function ServiceCard({ service, onOpen }: { service: Service; onOpen: () => void }) {
  const Icon = service.icon
  return (
    <TiltCard className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink-900/8 bg-white/80 shadow-[0_30px_70px_-60px_rgba(6,8,10,0.6)] backdrop-blur-md transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-glacier-400/40 group-hover:shadow-[0_50px_90px_-60px_rgba(6,8,10,0.75)] [transform-style:preserve-3d]">
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(340px circle at var(--mx,50%) var(--my,50%), rgba(143,211,232,0.18), transparent 60%)',
          }}
          aria-hidden
        />
        <div className="relative aspect-[16/10] overflow-hidden">
          <SmartImage
            name={service.image}
            alt={service.title}
            className="h-full w-full"
            sizes="(max-width: 768px) 100vw, 33vw"
            imgClassName="transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 glass-pane rounded-full px-2.5 py-1 font-display text-[0.68rem] tracking-[0.2em] text-alu-100">
            {service.index}
          </span>
          <span className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-2xl border border-white/20 bg-ink-950/45 text-glacier-300 backdrop-blur-md transition-transform duration-700 group-hover:-translate-y-1">
            <Icon className="size-5" strokeWidth={1.6} />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-[1.12rem] tracking-tight text-ink-900">{service.title}</h3>
          <p className="mt-2.5 flex-1 text-[0.88rem] leading-relaxed text-ink-500">{service.short}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5">
            {service.features.map((f) => (
              <li
                key={f}
                className="rounded-full border border-ink-900/8 bg-alu-100 px-2.5 py-1 text-[0.68rem] text-ink-600"
              >
                {f}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onOpen}
            className="group/btn mt-6 inline-flex items-center gap-2 self-start text-[0.82rem] font-medium text-ink-800 transition-colors hover:text-glacier-700"
          >
            En savoir plus
            <ArrowRight className="size-3.5 transition-transform duration-500 group-hover/btn:translate-x-1" />
          </button>
        </div>
      </article>
    </TiltCard>
  )
}

function ServiceDrawer({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const Icon = service?.icon
  return (
    <AnimatePresence>
      {service && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={onClose}
            className="absolute inset-0 bg-ink-950/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-ink-900 text-alu-100"
          >
            <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
              <SmartImage
                name={service.image}
                alt={service.title}
                className="h-full w-full"
                sizes="(max-width: 640px) 100vw, 576px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer la fiche"
                className="glass-pane absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-alu-100"
              >
                <X className="size-4.5" />
              </button>
              <div className="absolute bottom-5 left-6 flex items-center gap-3">
                {Icon && (
                  <span className="flex size-11 items-center justify-center rounded-2xl border border-white/15 bg-ink-950/50 text-glacier-300 backdrop-blur-md">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </span>
                )}
                <div>
                  <p className="text-[0.66rem] uppercase tracking-[0.26em] text-glacier-400">
                    Solution {service.index}
                  </p>
                  <h3 className="font-display text-[1.5rem] tracking-tight">{service.title}</h3>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-7 p-6 md:p-8">
              <p className="text-[0.95rem] leading-relaxed text-alu-300">{service.description}</p>

              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">Points techniques</p>
                <ul className="mt-3.5 grid gap-2.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[0.88rem] text-alu-200">
                      <Check className="mt-0.5 size-4 shrink-0 text-glacier-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-alu-400/80">Applications</p>
                <ul className="mt-3.5 flex flex-wrap gap-2">
                  {service.applications.map((a) => (
                    <li
                      key={a}
                      className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-[0.75rem] text-alu-200"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto flex flex-wrap gap-3 border-t border-white/10 pt-6">
                <LinkButton href="#contact" size="md" variant="glass" className="text-alu-100" onClick={onClose}>
                  Demander un devis
                </LinkButton>
                <LinkButton
                  href="#configurateur"
                  size="md"
                  variant="ghost"
                  className="text-alu-300 hover:text-alu-100"
                  onClick={onClose}
                  iconRight={<ArrowUpRight className="size-4" />}
                >
                  Configurer ce produit
                </LinkButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Services() {
  const [openId, setOpenId] = useState<ServiceId | null>(null)
  const open = services.find((s) => s.id === openId) ?? null

  return (
    <section id="solutions" className="relative overflow-hidden bg-alu-100 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal y={16} duration={0.7}>
              <Eyebrow index="03">Solutions</Eyebrow>
            </Reveal>
            <RevealText
              text="Une gamme complète, pensée pour durer"
              className="mt-6 max-w-2xl text-[clamp(1.9rem,4.4vw,3.3rem)] leading-[1.06] text-ink-900"
            />
          </div>
          <Reveal y={20} delay={0.1}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-ink-500">
              De la fenêtre isolante à la pergola, du garde-corps en verre à la vitrerie sur mesure : sept familles de
              solutions, une même exigence de finition.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.id} y={34} delay={(i % 3) * 0.06} duration={1} className="h-full">
              <ServiceCard service={service} onOpen={() => setOpenId(service.id)} />
            </Reveal>
          ))}

          <Reveal y={34} delay={0.12} className="h-full">
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border border-ink-900/10 bg-ink-900 p-7 text-alu-100">
              <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.18]" aria-hidden />
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-glacier-500/20 blur-[70px]" aria-hidden />
              <div className="relative">
                <p className="text-[0.66rem] uppercase tracking-[0.28em] text-glacier-400">Sur mesure</p>
                <h3 className="mt-4 font-display text-[1.4rem] leading-snug tracking-tight">
                  Un projet hors standard ? C’est notre terrain de jeu.
                </h3>
                <p className="mt-4 text-[0.88rem] leading-relaxed text-alu-400">
                  Grandes dimensions, formes particulières, teintes spécifiques : nous étudions votre ouverture et
                  proposons la solution technique adaptée.
                </p>
              </div>
              <LinkButton
                href="#contact"
                size="md"
                variant="glass"
                className="relative mt-8 self-start text-alu-100"
                iconRight={<ArrowUpRight className="size-4" />}
              >
                Parler à un conseiller
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>

      <ServiceDrawer service={open} onClose={() => setOpenId(null)} />
    </section>
  )
}
