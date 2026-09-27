/**
 * Content client.
 *
 * All UI components read their data through this module. Today it resolves
 * local typed data; tomorrow each function can `fetch()` a CMS/API endpoint
 * without changing a single component (the signatures are already async-ready).
 */
import { company } from './company'
import { products } from './products'
import { projects, projectCategories } from './projects'
import { materials, processSteps, qualities, services } from './services'
import type { Product, Project } from './types'

export * from './types'
export { company, products, projects, projectCategories, materials, processSteps, qualities, services }

export const contentClient = {
  getCompany: async () => company,
  getProducts: async (): Promise<Product[]> => products,
  getProduct: async (slug: string): Promise<Product | undefined> =>
    products.find((p) => p.slug === slug),
  getProjects: async (category?: string): Promise<Project[]> =>
    !category || category === 'all' ? projects : projects.filter((p) => p.category === category),
  getProject: async (slug: string): Promise<Project | undefined> =>
    projects.find((p) => p.slug === slug),
  getServices: async () => services,
  getQualities: async () => qualities,
  getProcess: async () => processSteps,
  getMaterials: async () => materials,
  /** Contact requests — plug a real endpoint (API route, Formspree, CRM) here. */
  submitContactRequest: async (payload: Record<string, string>) => {
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined
    if (!endpoint) return { ok: false as const, reason: 'no-endpoint' as const, payload }
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    })
    return { ok: res.ok as boolean, reason: (res.ok ? 'sent' : 'error') as 'sent' | 'error', payload }
  },
}
