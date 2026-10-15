import { useId, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ *
 *  Contrôle segmenté — sélection binaire/limitée avec indicateur glissant
 * ------------------------------------------------------------------ */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  name,
  size = 'md',
  tone = 'dark',
  className,
}: {
  options: Array<{ value: T; label: string; icon?: ReactNode; hint?: string }>
  value: T
  onChange: (v: T) => void
  name: string
  size?: 'sm' | 'md'
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={cn(
        'flex flex-wrap gap-2',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={opt.hint}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative overflow-hidden rounded-full border font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              size === 'sm' ? 'px-3.5 py-2 text-[0.76rem]' : 'px-4 py-2.5 text-[0.83rem]',
              active
                ? tone === 'dark'
                  ? 'border-accent-400/60 text-alu-100'
                  : 'border-ink-900/25 text-ink-900'
                : tone === 'dark'
                  ? 'border-white/10 text-alu-400 hover:border-white/25 hover:text-alu-200'
                  : 'border-ink-900/10 text-ink-500 hover:border-ink-900/25 hover:text-ink-800',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${name}`}
                className={cn(
                  'absolute inset-0 -z-10',
                  tone === 'dark' ? 'bg-white/12 backdrop-blur-md' : 'bg-white shadow-sm',
                )}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              {opt.icon}
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Pastille de finition (couleur aluminium)
 * ------------------------------------------------------------------ */
export function SwatchButton({
  color,
  label,
  note,
  active,
  onClick,
}: {
  color: string
  label: string
  note?: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group flex items-center gap-3 rounded-2xl border p-2 pr-4 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
        active
          ? 'border-accent-400/50 bg-white/10 backdrop-blur-md'
          : 'border-white/8 hover:border-white/20 hover:bg-white/5',
      )}
    >
      <span
        className="relative size-9 shrink-0 rounded-xl ring-1 ring-inset ring-white/25 transition-transform duration-500 group-hover:scale-105"
        style={{
          background: `linear-gradient(140deg, ${color} 0%, ${color} 38%, rgba(255,255,255,0.35) 52%, ${color} 66%, ${color} 100%)`,
        }}
      >
        {active && (
          <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-ink-950/25">
            <Check className="size-4 text-alu-100" strokeWidth={2.5} />
          </span>
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.83rem] font-medium text-alu-100">{label}</span>
        {note && <span className="block truncate text-[0.7rem] text-alu-400/70">{note}</span>}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------ *
 *  Interrupteur (réflexions, options…)
 * ------------------------------------------------------------------ */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
  icon?: ReactNode
}) {
  const id = useId()
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 p-3">
      <span className="flex items-center gap-3">
        {icon && <span className="text-accent-400">{icon}</span>}
        <span>
          <label htmlFor={id} className="block cursor-pointer text-[0.83rem] font-medium text-alu-100">
            {label}
          </label>
          {description && <span className="block text-[0.7rem] text-alu-400/70">{description}</span>}
        </span>
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-500',
          checked ? 'border-accent-400/60 bg-accent-500/30' : 'border-white/12 bg-white/5',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 460, damping: 32 }}
          className={cn(
            'absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-sm',
            checked ? 'left-[1.55rem] bg-accent-300' : 'left-1 bg-alu-400',
          )}
        />
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 *  Curseur (ouverture des vantaux)
 * ------------------------------------------------------------------ */
export function RangeSlider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
  suffix = '%',
  tone = 'dark',
}: {
  value: number
  onChange: (v: number) => void
  label: string
  min?: number
  max?: number
  step?: number
  suffix?: string
  tone?: 'dark' | 'light'
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span
          className={cn(
            'text-[0.7rem] uppercase tracking-[0.22em]',
            tone === 'dark' ? 'text-alu-400/80' : 'text-ink-500',
          )}
        >
          {label}
        </span>
        <span className={cn('font-display text-[0.82rem]', tone === 'dark' ? 'text-alu-100' : 'text-ink-900')}>
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <div className="relative h-6">
        <div
          className={cn(
            'absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full',
            tone === 'dark' ? 'bg-white/10' : 'bg-ink-900/10',
          )}
        />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-accent-500 to-accent-300"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white/40
            [&::-webkit-slider-thumb]:bg-gradient-to-b [&::-webkit-slider-thumb]:from-white [&::-webkit-slider-thumb]:to-alu-300
            [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgba(6,8,10,0.45)] [&::-webkit-slider-thumb]:transition-transform
            hover:[&::-webkit-slider-thumb]:scale-110
            [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:bg-white"
        />
      </div>
    </div>
  )
}
