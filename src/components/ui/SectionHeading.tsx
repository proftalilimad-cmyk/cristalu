import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal, RevealText } from './Reveal'

export function Eyebrow({
  children,
  index,
  tone = 'light',
  className,
}: {
  children: ReactNode
  index?: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.34em]',
        tone === 'light' ? 'text-ink-500' : 'text-alu-400/80',
        className,
      )}
    >
      {index && (
        <span
          className={cn(
            'font-display text-[0.7rem] tracking-[0.2em]',
            tone === 'light' ? 'text-glacier-600' : 'text-glacier-400',
          )}
        >
          {index}
        </span>
      )}
      <span className={cn('h-px w-8', tone === 'light' ? 'bg-ink-900/25' : 'bg-alu-400/40')} />
      <span>{children}</span>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  tone = 'light',
  align = 'left',
  className,
  children,
}: {
  eyebrow?: string
  index?: string
  title: string
  lead?: ReactNode
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <Reveal y={16} duration={0.7}>
          <Eyebrow index={index} tone={tone}>
            {eyebrow}
          </Eyebrow>
        </Reveal>
      )}
      <RevealText
        as="h2"
        text={title}
        className={cn(
          'max-w-3xl text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.06]',
          tone === 'light' ? 'text-ink-900' : 'text-alu-100',
        )}
      />
      {lead && (
        <Reveal y={20} delay={0.12}>
          <p
            className={cn(
              'max-w-2xl text-[0.98rem] leading-relaxed md:text-[1.05rem]',
              tone === 'light' ? 'text-ink-500' : 'text-alu-400',
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  )
}
