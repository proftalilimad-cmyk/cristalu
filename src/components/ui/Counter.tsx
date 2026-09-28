import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../lib/hooks'
import { prefersReducedMotion } from '../../lib/animation'

type Props = { to: number; suffix?: string; prefix?: string; duration?: number; className?: string }

export default function Counter({ to, suffix = '', prefix = '', duration = 1600, className = '' }: Props) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4)
  const [value, setValue] = useState(0)
  const frame = useRef<number>(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      setValue(to)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(Math.round(to * eased))
      if (p < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [inView, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  )
}
