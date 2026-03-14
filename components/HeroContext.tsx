'use client'

import { createContext, useContext, useState, useMemo } from 'react'

interface HeroContextValue {
  heroComplete: boolean
  setHeroComplete: (complete: boolean) => void
}

const HeroContext = createContext<HeroContextValue | null>(null)

export function HeroProvider({ children }: { children: React.ReactNode }) {
  const [heroComplete, setHeroComplete] = useState(true) // true by default so navbar shows on non-home pages

  const value = useMemo(
    () => ({ heroComplete, setHeroComplete }),
    [heroComplete]
  )

  return (
    <HeroContext.Provider value={value}>
      {children}
    </HeroContext.Provider>
  )
}

export function useHero() {
  const ctx = useContext(HeroContext)
  return ctx ?? { heroComplete: true, setHeroComplete: () => {} }
}
