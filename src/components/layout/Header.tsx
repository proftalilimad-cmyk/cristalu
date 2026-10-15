import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Phone, X } from 'lucide-react'
import { navItems, sectionIds } from '@/data/navigation'
import { siteConfig, telLink, val } from '@/data/site'
import { useIsDesktop } from '@/hooks'
import { cn } from '@/lib/utils'
import { Button, LinkButton } from '@/components/ui/Button'
import { Logo } from './Logo'

/** Surbrillance du lien correspondant à la section visible. */
function useActiveSection() {
  const [active, setActive] = useState<string>('accueil')
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!elements.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.15, 0.4, 0.75] },
    )
    elements.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
  return active
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const isDesktop = useIsDesktop()
  const phone = val(siteConfig.contact.phone)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (isDesktop && open) setOpen(false)
  }, [isDesktop, open])

  const overHero = !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow,padding] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
          scrolled
            ? 'border-b border-white/10 bg-ink-900/70 py-2 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_18px_50px_-40px_rgba(6,8,10,0.9)]'
            : 'py-4',
        )}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <a href="#accueil" className="shrink-0" aria-label="CRISTALUM — retour à l’accueil">
            <Logo tone={overHero ? 'dark' : 'dark'} />
          </a>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {navItems.map((item) => {
              const isActive = active === item.href.replace('#', '')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium tracking-tight transition-colors duration-300',
                    isActive ? 'text-alu-100' : 'text-alu-300/75 hover:text-alu-100',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full border border-white/12 bg-white/10 backdrop-blur-md"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={phone ? (telLink() ?? '#contact') : '#contact'}
              className="hidden items-center gap-2 text-[0.8rem] font-medium text-alu-300/80 transition-colors hover:text-alu-100 xl:flex"
            >
              <Phone className="size-3.5" />
              {phone ?? 'Nous appeler'}
            </a>
            <LinkButton
              href="#contact"
              size="sm"
              variant="dark"
              className="hidden sm:inline-flex"
              iconRight={<ArrowUpRight className="size-3.5" />}
            >
              Demander un devis
            </LinkButton>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="glass-pane flex size-11 items-center justify-center rounded-full text-alu-100 lg:hidden"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="surface-dark absolute inset-0 bg-zellige" />
            <div
              className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/80"
              aria-hidden
            />
            <motion.nav
              className="relative flex h-full flex-col justify-between px-6 pb-10 pt-7"
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-between">
                <Logo tone="dark" />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer le menu"
                  className="glass-pane flex size-11 items-center justify-center rounded-full text-alu-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              <ul className="mt-14 flex flex-col gap-1.5">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.07 + i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline justify-between border-b border-white/8 py-4"
                    >
                      <span className="font-display text-[1.75rem] tracking-tight text-alu-100">{item.label}</span>
                      <span className="text-[0.7rem] uppercase tracking-[0.28em] text-glacier-400/70">
                        0{i + 1}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col gap-4">
                <LinkButton
                  href="#contact"
                  full
                  size="lg"
                  variant="glass"
                  onClick={() => setOpen(false)}
                  iconRight={<ArrowUpRight className="size-4" />}
                >
                  Demander un devis
                </LinkButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-alu-400 hover:text-alu-100"
                  onClick={() => setOpen(false)}
                >
                  Fermer
                </Button>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
