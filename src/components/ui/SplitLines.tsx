import { gsap } from '../../lib/animation'
import { useGsap } from '../../lib/hooks'

type Props = {
  text: string
  className?: string
  lineClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  delay?: number
}

/**
 * Word-by-word masked reveal. Each word sits in an overflow-hidden span so the
 * text appears to rise out of the baseline — a staple of editorial motion.
 */
export default function SplitLines({
  text,
  className = '',
  lineClassName = '',
  as: Tag = 'div',
  delay = 0,
}: Props) {
  const ref = useGsap<HTMLDivElement>(({ el, reduced }) => {
    const words = el.querySelectorAll<HTMLElement>('[data-word]')
    if (reduced) {
      gsap.set(words, { yPercent: 0, opacity: 1 })
      return
    }
    gsap.fromTo(
      words,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.055,
        delay,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    )
  }, [text])

  return (
    <Tag ref={ref} className={className}>
      {text.split(' ').map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span data-word className={`inline-block will-change-transform ${lineClassName}`}>
            {word}
            {i < text.split(' ').length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
