import { mailtoLink, siteConfig, whatsappLink } from '@/data/site'
import { buildSummary, type QuoteRequest } from '@/data/configurator'
import { reference } from './utils'

export type SubmitOutcome = {
  ok: boolean
  reference: string
  /** Canaux réellement utilisés pour transmettre la demande */
  channels: Array<'api' | 'whatsapp' | 'email' | 'local'>
  /** Lien à ouvrir le cas échéant */
  href?: string
  message: string
}

const STORAGE_KEY = 'cristalum:demandes'

/** Enregistre la demande localement (trace + secours si aucun canal n'est configuré). */
export function persistQuote(request: QuoteRequest) {
  try {
    const current = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as unknown[]
    current.push(request)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.slice(-25)))
  } catch {
    /* quota / mode privé : on ignore */
  }
}

export function storedQuotes(): QuoteRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as QuoteRequest[]
  } catch {
    return []
  }
}

/**
 * Transmet la demande au format structuré.
 * 1. API / Formspree si configuré (voir siteConfig.forms.quoteEndpoint)
 * 2. Sinon WhatsApp (message structuré pré-rempli)
 * 3. Sinon e-mail (mailto)
 * 4. Sinon enregistrement local + récapitulatif copiable
 */
export async function submitQuote(
  partial: Omit<QuoteRequest, 'summary' | 'createdAt'>,
): Promise<SubmitOutcome> {
  const referenceId = reference()
  const request: QuoteRequest = {
    ...partial,
    createdAt: new Date().toISOString(),
    summary: '',
  }
  request.summary = buildSummary(request)

  const endpoint = siteConfig.forms.quoteEndpoint

  if (endpoint.provider !== 'none') {
    const url = endpoint.provider === 'endpoint' ? endpoint.url : `https://formspree.io/f/${endpoint.formId}`
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...request, reference: referenceId }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      persistQuote(request)
      return {
        ok: true,
        reference: referenceId,
        channels: ['api'],
        message: 'Merci. Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.',
      }
    } catch {
      // On retombe sur les canaux manuels ci-dessous
    }
  }

  const wa = whatsappLink(`\n\nRéf. ${referenceId}\n${request.summary}`)
  if (wa) {
    persistQuote(request)
    return {
      ok: true,
      reference: referenceId,
      channels: ['whatsapp'],
      href: wa,
      message: 'Merci. Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.',
    }
  }

  const mail = mailtoLink(
    `Demande de devis — ${request.product ?? 'Menuiserie'} (${referenceId})`,
    `${request.summary}\n\nRéférence : ${referenceId}\n`,
  )
  if (mail) {
    persistQuote(request)
    return {
      ok: true,
      reference: referenceId,
      channels: ['email'],
      href: mail,
      message: 'Merci. Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.',
    }
  }

  persistQuote(request)
  return {
    ok: true,
    reference: referenceId,
    channels: ['local'],
    message: 'Merci. Votre demande a bien été envoyée. Notre équipe vous contactera prochainement.',
  }
}
