import { useEffect, useState } from 'react'
import type { City } from '@/data/cities'

/**
 * Micro-store partagé : la ville choisie dans la carte (section « Zone
 * d'intervention ») alimente automatiquement le formulaire de devis, et
 * inversement.
 */
let currentCity: City | null = null
const listeners = new Set<(city: City | null) => void>()

export function setCity(city: City | null) {
  currentCity = city
  listeners.forEach((l) => l(city))
}

/** Recherche une ville par son nom (utilisé par le formulaire de devis). */
export function cityByName(name: string | null | undefined, all: City[]): City | null {
  if (!name) return null
  return all.find((c) => c.name.toLowerCase() === name.trim().toLowerCase()) ?? null
}

export function useCity(): [City | null, (city: City | null) => void] {
  const [city, setLocal] = useState<City | null>(currentCity)

  useEffect(() => {
    const listener = (next: City | null) => setLocal(next)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return [city, setCity]
}
