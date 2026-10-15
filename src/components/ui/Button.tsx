import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'glass' | 'outline' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg'

const base =
  'group relative inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-medium tracking-tight transition-[transform,box-shadow,background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform active:scale-[0.985] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-white shadow-accent hover:bg-accent-600 hover:shadow-accent',
  dark: 'bg-ink-900/90 text-alu-100 edge-alu-dark backdrop-blur-xl hover:bg-ink-900',
  glass: 'glass-pane text-alu-100 hover:bg-white/15',
  outline:
    'border border-ink-900/15 bg-white/60 text-ink-800 backdrop-blur-md hover:border-ink-900/30 hover:bg-white',
  ghost: 'text-ink-700 hover:text-ink-900',
}

const sizes: Record<Size, string> = {
  sm: 'h-10 px-4 text-[0.8rem]',
  md: 'h-12 px-6 text-[0.9rem]',
  lg: 'h-14 px-8 text-[0.95rem]',
}

type CommonProps = {
  children: ReactNode
  className?: string
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  /** Reflet lumineux qui balaie le bouton au survol */
  sheen?: boolean
  full?: boolean
}

const sheenEl = (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
  />
)

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  sheen = true,
  full,
  ref,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      ref={ref}
      className={cn(base, variants[variant], sizes[size], full && 'w-full', 'hover:-translate-y-0.5', className)}
    >
      {sheen && sheenEl}
      {icon && <span className="relative shrink-0 transition-transform duration-500 group-hover:scale-110">{icon}</span>}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="relative shrink-0 transition-transform duration-500 group-hover:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </button>
  )
}

type LinkButtonProps = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { ref?: React.Ref<HTMLAnchorElement> }

export function LinkButton({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  sheen = true,
  full,
  ref,
  ...rest
}: LinkButtonProps) {
  return (
    <a
      {...rest}
      ref={ref}
      className={cn(base, variants[variant], sizes[size], full && 'w-full', 'hover:-translate-y-0.5', className)}
    >
      {sheen && sheenEl}
      {icon && <span className="relative shrink-0 transition-transform duration-500 group-hover:scale-110">{icon}</span>}
      <span className="relative">{children}</span>
      {iconRight && (
        <span className="relative shrink-0 transition-transform duration-500 group-hover:translate-x-0.5">
          {iconRight}
        </span>
      )}
    </a>
  )
}

/** Bouton magnétique : suit légèrement le curseur (desktop uniquement). */
export function MagneticButton({ children, className, ...rest }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <span
      className="inline-block"
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || window.matchMedia('(hover: none)').matches) return
        const r = el.getBoundingClientRect()
        const mx = (e.clientX - (r.left + r.width / 2)) / r.width
        const my = (e.clientY - (r.top + r.height / 2)) / r.height
        el.style.transform = `translate3d(${mx * 7}px, ${my * 6}px, 0)`
      }}
      onPointerLeave={() => {
        const el = ref.current
        if (el) el.style.transform = 'translate3d(0,0,0)'
      }}
    >
      <Button {...rest} className={cn('transition-transform duration-300', className)} ref={ref}>
        {children}
      </Button>
    </span>
  )
}
