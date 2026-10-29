import { useEffect, useState } from 'react'
import { SeoJsonLd } from '@/components/SeoJsonLd'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  BootScreen,
  ScrollProgress,
  StickyMobileCTA,
  ValuesMarquee,
  WhatsAppFloat,
} from '@/components/layout/Floating'
import { Legal, type LegalKind } from '@/pages/Legal'
import { Hero } from '@/sections/Hero'
import { About } from '@/sections/About'
import { AluminiumExperience } from '@/sections/AluminiumExperience'
import { Services } from '@/sections/Services'
import { BeforeAfter } from '@/sections/BeforeAfter'
import { Gallery } from '@/sections/Gallery'
import { Configurator } from '@/sections/Configurator'
import { Process } from '@/sections/Process'
import { WhyCristalu } from '@/sections/WhyCristalu'
import { Architecture } from '@/sections/Architecture'
import { ServiceArea } from '@/sections/ServiceArea'
import { Quote } from '@/sections/Quote'

/** Routage minimal par hash : pages légales + ancres de sections. */
function useHashRoute(): LegalKind | null {
  const [route, setRoute] = useState<LegalKind | null>(null)

  useEffect(() => {
    const parse = () => {
      const hash = window.location.hash.replace(/^#\/?/, '')
      setRoute(hash === 'mentions-legales' || hash === 'politique-de-confidentialite' ? hash : null)
    }
    parse()
    window.addEventListener('hashchange', parse)
    return () => window.removeEventListener('hashchange', parse)
  }, [])

  return route
}

export function App() {
  const route = useHashRoute()
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    if (route) window.scrollTo({ top: 0 })
  }, [route])

  if (route) return <Legal kind={route} />

  return (
    <>
      <SeoJsonLd />
      <BootScreen onDone={() => setBooted(true)} />
      <ScrollProgress />
      <Header />
      <main id="contenu" className={booted ? '' : 'pointer-events-none'}>
        <Hero />
        <ServiceArea id="zone" index="02" />
        <ValuesMarquee />
        <About />
        <AluminiumExperience />
        <Services />
        <BeforeAfter />
        <Gallery />
        <Configurator />
        <Process />
        <WhyCristalu />
        <Architecture />
        <ServiceArea id="zone-2" index="11" />
        <Quote />
      </main>
      <Footer />
      <WhatsAppFloat />
      <StickyMobileCTA />
    </>
  )
}
