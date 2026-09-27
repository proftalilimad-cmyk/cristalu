import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ScrollProgress from './components/layout/ScrollProgress'
import ErrorBoundary from './components/ui/ErrorBoundary'
import CustomCursor from './components/layout/CustomCursor'
import WhatsAppFab from './components/layout/WhatsAppFab'
import Home from './pages/Home'
import { ScrollTrigger } from './lib/animation'
import { useSmoothScroll } from './lib/useSmoothScroll'
import { useI18n } from './i18n'

const Solutions = lazy(() => import('./pages/Solutions'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteEffects() {
  const { pathname, hash } = useLocation()
  const { lenis } = useSmoothScroll()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
    lenis?.scrollTo(0, { immediate: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => window.clearTimeout(id)
  }, [pathname, hash, lenis])

  useEffect(() => {
    if (!hash) return
    const id = window.setTimeout(() => {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
    return () => window.clearTimeout(id)
  }, [hash, pathname])

  return null
}

function PageFallback() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-24 text-sm text-steel">
      {t.common.loading}
    </div>
  )
}

export default function App() {
  const { locale } = useI18n()

  // Re-measure pinned/scrubbed sections when the language (and thus text
  // length + direction) changes.
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 250)
    return () => window.clearTimeout(id)
  }, [locale])

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Header />
      <main id="main" key={locale}>
        <RouteEffects />
        <ErrorBoundary label="Routes" fallback={<PageFallback />}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/produits" element={<Products />} />
            <Route path="/produits/:slug" element={<ProductDetail />} />
            <Route path="/realisations" element={<Projects />} />
            <Route path="/realisations/:slug" element={<ProjectDetail />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
