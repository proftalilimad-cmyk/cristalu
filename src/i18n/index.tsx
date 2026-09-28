import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { dictionaries, type Dictionary } from './dictionaries'
import type { Localized } from '../content/types'

export type UILocale = 'fr' | 'ar'

const STORAGE_KEY = 'cristalu.locale'
const RTL_LOCALES: UILocale[] = ['ar']

type I18nValue = {
  locale: UILocale
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  t: Dictionary
  setLocale: (l: UILocale) => void
  /** Resolve a localized content field with graceful fallback to French. */
  L: (value: Localized | undefined) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function readInitialLocale(): UILocale {
  if (typeof window === 'undefined') return 'fr'
  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (fromQuery === 'ar' || fromQuery === 'fr') return fromQuery
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'ar' || stored === 'fr') return stored
  return 'fr'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<UILocale>(readInitialLocale)

  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'

  useEffect(() => {
    const html = document.documentElement
    html.lang = locale
    html.dir = dir
    html.dataset.locale = locale
    document.title = dictionaries[locale].meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', dictionaries[locale].meta.description)
    window.localStorage.setItem(STORAGE_KEY, locale)
  }, [locale, dir])

  const setLocale = useCallback((l: UILocale) => setLocaleState(l), [])

  const L = useCallback(
    (value: Localized | undefined) => (value ? (value[locale] ?? value.fr) : ''),
    [locale],
  )

  const value = useMemo<I18nValue>(
    () => ({ locale, dir, isRTL: dir === 'rtl', t: dictionaries[locale], setLocale, L }),
    [locale, dir, setLocale, L],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}
