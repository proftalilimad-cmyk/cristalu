import type { ReactNode } from 'react'
import Reveal from './Reveal'
import SplitLines from './SplitLines'

type Props = {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'start' | 'center'
  tone?: 'dark' | 'light'
  aside?: ReactNode
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'start',
  tone = 'dark',
  aside,
  className = '',
}: Props) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start'
  const introTone = tone === 'light' ? 'text-white/65' : 'text-graphite'
  const eyebrowTone = tone === 'light' ? 'text-white/50' : ''

  return (
    <div
      className={`flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between ${className}`}
    >
      <div className={`flex max-w-3xl flex-col gap-5 ${alignment}`}>
        {eyebrow ? (
          <Reveal>
            <span className={`eyebrow ${eyebrowTone}`}>{eyebrow}</span>
          </Reveal>
        ) : null}
        <SplitLines as="h2" text={title} className="fluid-h2 font-display" />
        {intro ? (
          <Reveal delay={0.1}>
            <p className={`max-w-xl text-base leading-relaxed ${introTone}`}>{intro}</p>
          </Reveal>
        ) : null}
      </div>
      {aside ? <Reveal delay={0.15}>{aside}</Reveal> : null}
    </div>
  )
}
