import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Calculator, MessageCircle, Phone, X } from 'lucide-react'
import { hasPhone, hasWhatsApp, siteConfig, telLink, whatsappLink } from '@/data/site'
import { cn } from '@/lib/utils'
import { LogoMark } from './Logo'

/* ------------------------------------------------------------------ *
 *  Barre de progression de lecture
 * ------------------------------------------------------------------ */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[65] h-[2px]" aria-hidden>
      <div
        className="h-full origin-left bg-gradient-to-r from-accent-500 via-accent-300 to-white/70 transition-transform duration-150"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Bouton WhatsApp flottant
 * ------------------------------------------------------------------ */
export function WhatsAppFloat() {
  const [expanded, setExpanded] = useState(false)
  const link = whatsappLink()

  // Le bouton n'apparaît que si un numéro WhatsApp réel est configuré.
  if (!hasWhatsApp() || !link) return null

  return (
    <div className="fixed bottom-24 right-4 z-[62] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-[17rem] rounded-2xl border border-white/12 bg-ink-900/95 p-4 text-alu-100 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          >
            <p className="text-[0.82rem] font-medium">Assistance WhatsApp</p>
            <p className="mt-1.5 text-[0.75rem] leading-relaxed text-alu-400">{siteConfig.whatsapp.message}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3.5 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-[0.8rem] font-medium text-ink-950 transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MessageCircle className="size-4" />
              Ouvrir WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? 'Fermer l’assistance WhatsApp' : 'Contacter CRISTALUM sur WhatsApp'}
        className="group relative flex size-13 items-center justify-center rounded-full bg-[#25D366] text-ink-950 shadow-[0_18px_40px_-18px_rgba(37,211,102,0.8)] transition-transform duration-500 hover:scale-105"
      >
        {!expanded && (
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25D366]/60" aria-hidden />
        )}
        {expanded ? <X className="size-5" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  CTA collant mobile + retour en haut
 * ------------------------------------------------------------------ */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const nearContact = (() => {
        const el = document.getElementById('contact')
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top < window.innerHeight * 0.8
      })()
      setVisible(window.scrollY > window.innerHeight * 0.9 && !nearContact)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[61] border-t border-white/10 bg-ink-900/92 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5">
                <LogoMark className="size-8 text-alu-300" />
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-[0.82rem] tracking-[0.18em] text-alu-100">CRISTALUM</span>
                  <span className="text-[0.62rem] uppercase tracking-[0.2em] text-alu-400">Sur mesure</span>
                </span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {hasPhone() && (
                  <a
                    href={telLink() ?? '#'}
                    aria-label="Appeler CRISTALUM"
                    className="flex size-11 items-center justify-center rounded-full border border-white/15 text-alu-100"
                  >
                    <Phone className="size-4.5" />
                  </a>
                )}
                <a
                  href="#contact"
                  className="flex h-11 items-center gap-2 rounded-full bg-alu-100 px-5 text-[0.82rem] font-medium text-ink-900"
                >
                  <Calculator className="size-4" />
                  Devis gratuit
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Revenir en haut"
        className={cn(
          'fixed bottom-6 left-4 z-[60] hidden size-11 items-center justify-center rounded-full border border-white/15 bg-ink-900/80 text-alu-200 backdrop-blur-xl transition-all duration-500 hover:text-alu-100 lg:flex',
          visible ? 'opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <ArrowUp className="size-4" />
      </button>
    </>
  )
}

/* ------------------------------------------------------------------ *
 *  Écran d'accueil (chargement) — bref, non bloquant
 * ------------------------------------------------------------------ */
export function BootScreen({ onDone }: { onDone: () => void }) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timeout = window.setTimeout(
      () => {
        setHidden(true)
        onDone()
      },
      reduced ? 200 : 1250,
    )
    return () => window.clearTimeout(timeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 bg-zellige opacity-[0.12]" aria-hidden />
          <div className="relative flex flex-col items-center gap-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(1.6rem,6vw,2.6rem)] font-semibold tracking-[0.34em] text-metal-light"
            >
              CRISTALUM
            </motion.span>
            <span className="relative h-px w-48 overflow-hidden bg-white/12">
              <motion.span
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-500 to-accent-300"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.15, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[0.66rem] uppercase tracking-[0.32em] text-alu-500"
            >
              Menuiserie Aluminium &amp; PVC
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Bandeau défilant de valeurs — respiration entre deux sections. */
export function ValuesMarquee() {
  const items = [
    'Sur mesure',
    'Aluminium à rupture de pont thermique',
    'PVC multi-chambres',
    'Vitrages de sécurité',
    'Finitions thermolaquées',
    'Pose professionnelle',
    'Design & performance',
    'Durabilité',
  ]

  return (
    <div className="relative overflow-hidden border-y border-ink-900/8 bg-white py-5">
      <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="text-[0.74rem] uppercase tracking-[0.3em] text-ink-500">{item}</span>
            <span className="size-1 rotate-45 bg-accent-400" aria-hidden />
          </span>
        ))}
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent" />
    </div>
  )
}
