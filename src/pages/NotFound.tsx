import { ArrowUpRight } from 'lucide-react'
import { MagneticLink } from '../components/ui/MagneticButton'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <section className="flex min-h-[70vh] items-center bg-paper pt-32">
      <div className="container-x">
        <span className="eyebrow">404</span>
        <h1 className="mt-5 font-display text-[clamp(2.2rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.05em]">
          {t.common.notFoundTitle}
        </h1>
        <p className="mt-5 max-w-md text-sm text-graphite">{t.common.notFoundText}</p>
        <div className="mt-9">
          <MagneticLink to="/">
            {t.common.backHome}
            <ArrowUpRight size={15} />
          </MagneticLink>
        </div>
      </div>
    </section>
  )
}
