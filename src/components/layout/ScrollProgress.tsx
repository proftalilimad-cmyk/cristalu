import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] bg-transparent"
      >
        <div
          className="h-full bg-ink/80 origin-left"
          style={{ transform: `scaleX(${progress})`, transition: 'transform 120ms linear' }}
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-6 z-[70] hidden text-[0.65rem] font-medium tracking-[0.2em] text-ink/45 lg:block ltr:left-8 rtl:right-8"
      >
        {String(Math.round(progress * 100)).padStart(2, '0')}%
      </div>
    </>
  )
}
