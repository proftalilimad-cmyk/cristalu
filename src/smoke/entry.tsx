import { renderToString } from 'react-dom/server'
import { App } from '@/App'

/** Rendu serveur utilisé par le test de fumée (`npm run smoke`). */
export function render() {
  return renderToString(<App />)
}
