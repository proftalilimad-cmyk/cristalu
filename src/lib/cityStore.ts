import { useEffect, useState } from 'react'

/**
 * Micro-store partagé : la ville sélectionnée dans la carte alimente
 * automatiquement le formulaire de devis (et inversement).
 */
let currentCity = ''
const listeners = new Set<(city: string) => void>()

export function setCity(city: string) {
  currentCity = city
  listeners.forEach((l) => l(city))
}

export function useCity(): [string, (city: string) => void] {
  const [city, setLocal] = useState(currentCity)

  useEffect(() => {
    const listener = (next: string) => setLocal(next)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return [city, setCity]
}
