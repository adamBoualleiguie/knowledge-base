'use client'

import { useState, useEffect } from 'react'

/**
 * Animated scroll-down indicator (mouse + "Scroll" text).
 * Adapted from the Cabin font example, using site primary orange.
 * Fades out when user scrolls.
 */
export function ScrollIndicator({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!visible) return
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`scroll-indicator fixed inset-x-0 bottom-0 z-20 h-[72px] flex flex-col items-center justify-end pb-2 animate-fade-in transition-opacity duration-500 pointer-events-none ${
        scrolled ? 'opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1.5 scale-50 origin-bottom">
        <div className="scroll-indicator__mouse" />
        <p className="scroll-indicator__text">Scroll</p>
      </div>
    </div>
  )
}
