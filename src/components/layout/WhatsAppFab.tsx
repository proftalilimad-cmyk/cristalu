import { MessageCircle } from 'lucide-react'
import { company } from '../../content'
import { useI18n } from '../../i18n'

export default function WhatsAppFab() {
  const { locale } = useI18n()
  const text =
    locale === 'ar'
      ? 'مرحباً كريستالو المغرب، أرغب في معلومات حول مشروعي.'
      : 'Bonjour Cristalu Maroc, je souhaite des informations pour mon projet.'
  const href = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(text)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="WhatsApp"
      className="group fixed bottom-6 z-[85] inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_40px_rgba(0,0,0,0.28)] transition-transform duration-500 hover:scale-105 ltr:right-5 rtl:left-5 md:h-16 md:w-16"
    >
      <MessageCircle size={22} />
      <span className="pointer-events-none absolute inset-0 rounded-full border border-brand/40 opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100" />
    </a>
  )
}
