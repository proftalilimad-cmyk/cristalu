import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap, isCoarsePointer, prefersReducedMotion } from '../../lib/animation'

type Variant = 'solid' | 'outline' | 'ghost' | 'light'

type BaseProps = {
  children: ReactNode
  variant?: Variant
  className?: string
  strength?: number
}

const variantClass: Record<Variant, string> = {
  solid: 'bg-ink text-paper hover:bg-void',
  outline: 'border border-ink/25 text-ink hover:border-ink/70',
  ghost: 'text-ink hover:opacity-70',
  light: 'border border-white/35 text-white hover:bg-white hover:text-ink',
}

function useMagnetic(strength: number) {
  const ref = useRef<HTMLSpanElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || isCoarsePointer() || prefersReducedMotion()) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
  }

  return { ref, onMove, onLeave }
}

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[0.82rem] font-medium uppercase tracking-[0.14em] transition-colors duration-500 will-change-transform'

export function MagneticLink({
  to,
  children,
  variant = 'solid',
  className = '',
  strength = 0.25,
  ...rest
}: BaseProps & { to: string } & React.ComponentProps<typeof Link>) {
  const { ref, onMove, onLeave } = useMagnetic(strength)
  return (
    <Link
      to={to}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variantClass[variant]} ${className}`}
      data-cursor="link"
      {...rest}
    >
      <span ref={ref} className="inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  )
}

export function MagneticButton({
  children,
  variant = 'solid',
  className = '',
  strength = 0.25,
  ...rest
}: BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { ref, onMove, onLeave } = useMagnetic(strength)
  return (
    <button
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variantClass[variant]} ${className}`}
      data-cursor="link"
      {...rest}
    >
      <span ref={ref} className="inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  )
}

export function MagneticAnchor({
  href,
  children,
  variant = 'solid',
  className = '',
  strength = 0.25,
  ...rest
}: BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { ref, onMove, onLeave } = useMagnetic(strength)
  return (
    <a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${variantClass[variant]} ${className}`}
      data-cursor="link"
      {...rest}
    >
      <span ref={ref} className="inline-flex items-center gap-2">
        {children}
      </span>
    </a>
  )
}
