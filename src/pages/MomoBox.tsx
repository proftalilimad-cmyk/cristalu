import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  Feather,
  HardHat,
  Layers,
  Minus,
  MessageCircle,
  Phone,
  Plus,
  Thermometer,
  Timer,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import Media from '../components/ui/Media'
import Reveal from '../components/ui/Reveal'
import SplitLines from '../components/ui/SplitLines'
import SectionHeading from '../components/ui/SectionHeading'
import { MagneticAnchor, MagneticLink } from '../components/ui/MagneticButton'
import MomoDiagram from '../components/momo/MomoDiagram'
import { useI18n } from '../i18n'
import { company, momoBox } from '../content'
import { gsap } from '../lib/animation'
import { useGsap } from '../lib/hooks'

const icons: Record<string, LucideIcon> = {
  HardHat,
  Thermometer,
  Feather,
  Trowel: Layers,
  Timer,
  Wallet,
}

function Steps() {
  const { t, L } = useI18n()
  const images = [
    momoBox.media.product,
    momoBox.media.install,
    momoBox.media.render,
    momoBox.media.finished,
  ]

  const ref = useGsap<HTMLDivElement>(({ el, reduced }) => {
    if (reduced) return
    const items = el.querySelectorAll('[data-step]')
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        },
      )
    })
  }, [])

  return (
    <div ref={ref} className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {momoBox.steps.map((step, i) => (
        <article key={step.index} data-step className="flex flex-col gap-5">
          <div className="relative overflow-hidden rounded-xl">
            <Media
              src={images[i].src}
              alt={L(images[i].alt)}
              className="aspect-4/3 w-full"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            <span className="absolute top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-[0.7rem] font-semibold text-white ltr:left-4 rtl:right-4">
              {step.index}
            </span>
          </div>
          <div>
            <h3 className="font-display text-lg tracking-[-0.02em]">{L(step.title)}</h3>
            <p className="mt-2 text-sm leading-relaxed text-graphite">{L(step.description)}</p>
          </div>
        </article>
      ))}
      <p className="text-[0.7rem] uppercase tracking-[0.16em] text-steel md:col-span-2 xl:col-span-4">
        {t.momo.note}
      </p>
    </div>
  )
}

function Faq() {
  const { L } = useI18n()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mt-12 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
      {momoBox.faq.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-start"
            >
              <span className="font-display text-base tracking-[-0.02em] md:text-lg">{L(item.q)}</span>
              <span
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  isOpen ? 'border-brand bg-brand text-white' : 'border-ink/20 text-ink'
                }`}
              >
                {isOpen ? <Minus size={15} /> : <Plus size={15} />}
              </span>
            </button>
            <div
              className="grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-sm leading-relaxed text-graphite">{L(item.a)}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function MomoBox() {
  const { t, L } = useI18n()

  const waHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(
    `MOMO Box — ${L(momoBox.category)} : ${t.momo.quote}`,
  )}`

  const heroRef = useGsap<HTMLElement>(({ el, reduced }) => {
    if (reduced) return
    gsap.to(el.querySelector('[data-bg]'), {
      yPercent: 12,
      scale: 1.08,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    })
  }, [])

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative flex min-h-[86svh] items-end overflow-hidden bg-void">
        <div data-bg className="absolute inset-0">
          <Media
            src={momoBox.media.hero.src}
            alt={L(momoBox.media.hero.alt)}
            className="h-full w-full"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/25" />
        </div>

        <div className="container-x relative z-10 pb-16 pt-36 text-white">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white">
                {t.momo.eyebrow}
              </span>
              {momoBox.promo.active ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-white/80">
                  {L(momoBox.promo.label)} · {L(momoBox.promo.text)}
                </span>
              ) : null}
            </div>

            <h1 className="mt-7 font-display text-[clamp(3rem,11vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.05em]">
              MOMO<span className="text-brand-light"> Box</span>
            </h1>

            <p className="mt-6 max-w-xl font-display text-[clamp(1.05rem,2.1vw,1.7rem)] leading-tight tracking-[-0.02em] text-white/90">
              {t.momo.heroSub}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 md:text-base">
              {L(momoBox.lead)}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticLink to="/contact" variant="solid">
                {t.momo.quote}
                <ArrowUpRight size={15} />
              </MagneticLink>
              <MagneticAnchor
                href={waHref}
                target="_blank"
                rel="noreferrer noopener"
                variant="light"
              >
                <MessageCircle size={15} />
                {t.momo.whatsapp}
              </MagneticAnchor>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70" dir="ltr">
              <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 hover:text-white">
                <Phone size={14} /> {company.phone}
              </a>
              {company.phoneAlt ? (
                <a
                  href={`tel:${company.phoneAlt.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 hover:text-white"
                >
                  <Phone size={14} /> {company.phoneAlt}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + PRODUIT */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <Reveal mask>
              <Media
                src={momoBox.media.product.src}
                alt={L(momoBox.media.product.alt)}
                className="aspect-4/3 w-full rounded-xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal>
              <span className="flex items-center gap-3">
                <span className="h-px w-8 bg-brand" />
                <span className="eyebrow">{L(momoBox.category)}</span>
              </span>
            </Reveal>
            <SplitLines
              as="h2"
              text={L(momoBox.tagline)}
              className="fluid-h2 mt-5 font-display"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-graphite md:text-base">
                {L(momoBox.intro)}
              </p>
            </Reveal>
            <Reveal delay={0.16} className="mt-8 grid grid-cols-2 gap-5 border-t border-ink/10 pt-6">
              {momoBox.specs.slice(0, 4).map((spec, i) => (
                <div key={i}>
                  <div className="eyebrow">{L(spec.label)}</div>
                  <div className="mt-2 text-sm text-graphite">{L(spec.value)}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="bg-ink py-20 text-white lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow={t.momo.benefitsEyebrow}
            title={t.momo.benefitsTitle}
            tone="light"
            className="[&_h2]:text-white"
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {momoBox.benefits.map((b, i) => {
              const Icon = icons[b.icon] ?? Check
              return (
                <article
                  key={b.id}
                  className="group flex min-h-[15rem] flex-col justify-between gap-8 bg-ink p-8 transition-colors duration-700 hover:bg-void"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[0.62rem] uppercase tracking-[0.2em] text-brand-light/80">
                      0{i + 1}
                    </span>
                    <Icon size={24} strokeWidth={1.2} className="text-white/70" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl tracking-[-0.025em]">{L(b.title)}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/60">{L(b.description)}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* SCHÉMA */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.momo.specsEyebrow} title={t.momo.galleryTitle} />
          <div className="mt-14">
            <MomoDiagram />
          </div>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.momo.stepsEyebrow} title={t.momo.stepsTitle} />
          <Steps />
        </div>
      </section>

      {/* COMPARAISON */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.momo.compareEyebrow} title={t.momo.compareTitle} />

          {/* desktop */}
          <div className="mt-12 hidden overflow-hidden rounded-xl bg-paper md:block">
            <table className="w-full border-collapse text-start text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="p-5 text-start font-medium">{t.momo.compareCriterion}</th>
                  <th className="bg-brand p-5 text-start font-semibold">MOMO Box</th>
                  <th className="p-5 text-start font-medium">{t.momo.compareConcrete}</th>
                  <th className="p-5 text-start font-medium">{t.momo.compareWood}</th>
                </tr>
              </thead>
              <tbody>
                {momoBox.comparison.map((row, i) => (
                  <tr key={i} className="border-b border-ink/10 last:border-0">
                    <td className="p-5 font-medium text-ink">{L(row.criterion)}</td>
                    <td className="bg-brand/5 p-5 text-ink">
                      <span className="inline-flex items-start gap-2">
                        <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                        {L(row.momo)}
                      </span>
                    </td>
                    <td className="p-5 text-graphite">{L(row.concrete)}</td>
                    <td className="p-5 text-graphite">{L(row.wood)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* mobile */}
          <div className="mt-10 flex flex-col gap-4 md:hidden">
            {momoBox.comparison.map((row, i) => (
              <div key={i} className="rounded-xl bg-paper p-5">
                <div className="eyebrow">{L(row.criterion)}</div>
                <div className="mt-3 flex items-start gap-2 text-sm text-ink">
                  <Check size={15} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <strong className="font-semibold">MOMO Box</strong> — {L(row.momo)}
                  </span>
                </div>
                <div className="mt-2 text-sm text-graphite">
                  {t.momo.compareConcrete} — {L(row.concrete)}
                </div>
                <div className="mt-1 text-sm text-graphite">
                  {t.momo.compareWood} — {L(row.wood)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIE */}
      <section className="bg-paper py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading eyebrow={t.momo.galleryEyebrow} title={t.momo.galleryTitle} />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {[momoBox.media.real, momoBox.media.install, momoBox.media.render, momoBox.media.finished].map(
              (m, i) => (
                <Reveal key={m.src} mask delay={(i % 2) * 0.06}>
                  <Media
                    src={m.src}
                    alt={L(m.alt)}
                    className={`w-full rounded-xl ${i === 0 ? 'aspect-4/3' : 'aspect-4/3'}`}
                    imgClassName="transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* SPECS + FAQ */}
      <section className="bg-mist py-20 lg:py-28">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={t.momo.specsEyebrow} title={t.momo.specsTitle} />
            <dl className="mt-10 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
              {momoBox.specs.map((s, i) => (
                <div key={i} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-sm text-steel">{L(s.label)}</dt>
                  <dd className="text-end font-display text-sm tracking-[-0.01em]">{L(s.value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-xl bg-paper p-6">
              <h3 className="font-display text-lg tracking-[-0.02em]">{t.momo.proTitle}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite">{t.momo.proText}</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <SectionHeading eyebrow={t.momo.faqEyebrow} title={t.momo.faqTitle} />
            <Faq />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-void py-24 text-white lg:py-32">
        <div className="absolute inset-0 opacity-45">
          <Media
            src={momoBox.media.finished.src}
            alt=""
            className="h-full w-full"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/85 to-void/60" />
        </div>
        <div className="container-x relative z-10">
          <SplitLines
            as="h2"
            text={t.momo.ctaTitle}
            className="max-w-3xl font-display text-[clamp(1.8rem,5vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em]"
          />
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">{t.momo.ctaText}</p>
          </Reveal>
          <Reveal delay={0.16} className="mt-10 flex flex-wrap gap-3">
            <MagneticAnchor href={waHref} target="_blank" rel="noreferrer noopener" variant="solid">
              <MessageCircle size={15} />
              {t.momo.whatsapp}
            </MagneticAnchor>
            <MagneticLink to="/contact" variant="light">
              {t.momo.quote}
              <ArrowUpRight size={15} />
            </MagneticLink>
          </Reveal>
          <p className="mt-8 text-sm text-white/55" dir="ltr">
            {company.phone}
            {company.phoneAlt ? ` · ${company.phoneAlt}` : ''} · {company.email}
          </p>
        </div>
      </section>
    </>
  )
}
