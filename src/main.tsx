import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { I18nProvider } from './i18n'
import { SmoothScrollProvider } from './lib/useSmoothScroll'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <SmoothScrollProvider>
          <App />
        </SmoothScrollProvider>
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
