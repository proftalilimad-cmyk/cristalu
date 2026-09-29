import type { ElementType, ReactNode } from 'react'
import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

type Props = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
  y?: number
  /** clip-path mask reveal instead of a simple fade+rise */
  mask?: boolean
  stagger?: number
}

export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  delay = 0,
  y = 28,
  mask = false,
  stagger = 0,
}: Props) {
  const ref = useGsap<HTMLDivElement>(({ el, reduced }) => {
    const targets = stagger ? Array.from(el.children) : [el]
    if (reduced) {
      gsap.set(targets, { opacity: 1, y: 0, clipPath: 'none' })
      return
    }
    gsap.fromTo(
      targets,
      mask
        ? { clipPath: 'inset(0 0 100% 0)', y: y * 0.6, opacity: 1 }
        : { opacity: 0, y },
      {
        clipPath: mask ? 'inset(0 0 0% 0)' : undefined,
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: 'expo.out',
        delay,
        stagger,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    )
  }, [])

  const Component = Tag as React.ComponentType<
    React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> }
  >

  return (
    <Component ref={ref} className={className}>
      {children}
    </Component>
  )
}
