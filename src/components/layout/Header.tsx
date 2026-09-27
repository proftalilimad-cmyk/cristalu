import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import { useI18n } from '../../i18n'
import { gsap, prefersReducedMotion } from '../../lib/animation'
import { company } from '../../content'

export default function Header() {
  const { t, locale, setLocale } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const overlay = useRef<HTMLDivElement>(null)

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/solutions', label: t.nav.solutions },
    { to: '/produits', label: t.nav.products },
    { to: '/realisations', label: t.nav.projects },
    { to: '/a-propos', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const el = overlay.current
    if (!el || prefersReducedMotion()) return
    if (open) {
      const items = el.querySelectorAll('[data-menu-item]')
      gsap.fromTo(
        el,
        { clipPath: 'inset(0 0 100% 0)' },
        { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.out' },
      )
      gsap.fromTo(
        items,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.15 },
      )
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2 focus:text-paper"
      >
        Aller au contenu
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
          scrolled || open
            ? 'border-b border-ink/10 bg-paper/85 py-3 backdrop-blur-xl'
            : 'border-b border-transparent py-5'
        }`}
      >
        <div className="container-x flex items-center justify-between gap-6">
          <Link to="/" aria-label="Cristalu Maroc" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className="text-[0.78rem] font-medium uppercase tracking-[0.16em] text-graphite transition-colors hover:text-ink"
              >
                {({ isActive }) => (
                  <span data-active={isActive} className="link-underline">
                    {l.label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1 text-[0.72rem] font-medium tracking-[0.12em] sm:flex">
              <button
                onClick={() => setLocale('fr')}
                className={`px-2 py-1 transition-colors ${locale === 'fr' ? 'text-ink' : 'text-steel hover:text-graphite'}`}
                aria-pressed={locale === 'fr'}
              >
                FR
              </button>
              <span className="text-alu">|</span>
              <button
                onClick={() => setLocale('ar')}
                className={`px-2 py-1 transition-colors ${locale === 'ar' ? 'text-ink' : 'text-steel hover:text-graphite'}`}
                aria-pressed={locale === 'ar'}
              >
                AR
              </button>
            </div>

            <Link
              to="/contact"
              className="hidden items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-paper transition-colors hover:bg-void md:inline-flex"
            >
              {t.nav.quote}
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink/50 lg:hidden"
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <div
        ref={overlay}
        className={`fixed inset-0 z-[75] bg-paper lg:hidden ${open ? '' : 'pointer-events-none opacity-0'}`}
        style={{ clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)' }}
        aria-hidden={!open}
      >
        <div className="container-x flex h-full flex-col justify-between pb-10 pt-28">
          <nav className="flex flex-col gap-2" aria-label="Navigation mobile">
            {links.map((l, i) => (
              <span key={l.to} className="overflow-hidden">
                <Link
                  data-menu-item
                  to={l.to}
                  className="flex items-baseline gap-4 py-2 font-display text-[clamp(2rem,9vw,3.4rem)] leading-none tracking-[-0.04em]"
                >
                  <span className="text-[0.6rem] tracking-[0.2em] text-steel">
                    0{i + 1}
                  </span>
                  {l.label}
                </Link>
              </span>
            ))}
          </nav>

          <div className="flex flex-col gap-6">
            <div className="rule" />
            <div className="flex items-center justify-between">
              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => setLocale('fr')}
                  className={locale === 'fr' ? 'text-ink' : 'text-steel'}
                >
                  Français
                </button>
                <span className="text-alu">/</span>
                <button
                  onClick={() => setLocale('ar')}
                  className={locale === 'ar' ? 'text-ink' : 'text-steel'}
                >
                  العربية
                </button>
              </div>
              <a
                href={`tel:${company.phone.replace(/\s/g, '')}`}
                className="text-sm text-graphite underline underline-offset-4"
              >
                {company.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
