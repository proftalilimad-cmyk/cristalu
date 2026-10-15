import { useEffect } from 'react'
import { siteConfig, val } from '@/data/site'
import { services } from '@/data/services'
import { cities } from '@/data/cities'

const SCRIPT_ID = 'cristalum-jsonld'

/**
 * Enrichit les données structurées (schema.org) avec les informations
 * réellement configurées. Tant qu'un champ n'est pas renseigné dans
 * `src/data/site.ts`, il n'est pas publié — aucune donnée inventée.
 */
export function SeoJsonLd() {
  useEffect(() => {
    const phone = val(siteConfig.contact.phone)
    const email = val(siteConfig.contact.email)
    const street = val(siteConfig.contact.address.street)
    const city = val(siteConfig.contact.address.city)
    const region = val(siteConfig.contact.address.region)
    const maps = val(siteConfig.contact.maps)
    const facebook = val(siteConfig.social.facebook)
    const instagram = val(siteConfig.social.instagram)

    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'HomeAndConstructionBusiness',
      name: siteConfig.legalName,
      description: `${siteConfig.tagline} au Maroc : ${services.map((s) => s.title).join(', ')}.`,
      url: siteConfig.url,
      image: `${siteConfig.url}/images/og-cristalum.jpg`,
      priceRange: 'Sur devis',
      areaServed: cities.map((c) => ({ '@type': 'City', name: c.name })),
      makesOffer: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.short },
      })),
    }

    if (phone) data.telephone = phone
    if (email) data.email = email
    if (street || city || region || maps) {
      data.address = {
        '@type': 'PostalAddress',
        ...(street ? { streetAddress: street } : {}),
        ...(city ? { addressLocality: city } : {}),
        ...(region ? { addressRegion: region } : {}),
        addressCountry: 'MA',
      }
      if (maps) data.hasMap = maps
    }

    const sameAs = [facebook, instagram].filter(Boolean)
    if (sameAs.length) data.sameAs = sameAs

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(data)
  }, [])

  return null
}
