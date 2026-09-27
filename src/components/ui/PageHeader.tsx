import type { ReactNode } from 'react'
import Reveal from './Reveal'
import SplitLines from './SplitLines'
import Media from './Media'

type Props = {
  eyebrow: string
  title: string
  intro?: string
  image?: { src: string; alt: string }
  children?: ReactNode
}

export default function PageHeader({ eyebrow, title, intro, image, children }: Props) {
  return (
    <header className="relative bg-paper pb-14 pt-36 lg:pb-20 lg:pt-44">
      <div className="container-x">
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
        <SplitLines
          as="h1"
          text={title}
          className="mt-5 max-w-4xl font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.05em]"
        />
        {intro ? (
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-graphite">{intro}</p>
          </Reveal>
        ) : null}
        {children}
      </div>

      {image ? (
        <div className="container-x mt-12">
          <Reveal mask>
            <Media
              src={image.src}
              alt={image.alt}
              className="aspect-16/9 w-full rounded-xl md:aspect-16/7"
              sizes="100vw"
              priority
            />
          </Reveal>
        </div>
      ) : null}
    </header>
  )
}
