'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Component to handle anchor link clicks and URL updates
 * This ensures that when users click on anchor links, the URL is updated
 * and the link can be copied/shared
 */
export function AnchorLinks() {
  const pathname = usePathname()

  useEffect(() => {
    // Handle anchor link clicks
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('.anchor') as HTMLAnchorElement
      
      if (!anchor) return
      
      e.preventDefault()
      
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      
      const hash = href.substring(1)
      const element = document.getElementById(hash)
      
      if (element) {
        // Update URL without scrolling (we'll handle scroll separately)
        const newUrl = `${pathname}${href}`
        window.history.pushState(null, '', newUrl)
        
        // Scroll to element with offset for fixed header
        const offset = 100
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        })
        
        // Copy to clipboard on click (optional - can be removed if not desired)
        // Uncomment the following if you want to auto-copy on click
        /*
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href).catch(() => {
            // Ignore clipboard errors
          })
        }
        */
      }
    }

    // Handle hash changes on page load
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1)
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          // Small delay to ensure page is fully loaded
          setTimeout(() => {
            const offset = 100
            const elementPosition = element.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - offset
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            })
          }, 100)
        }
      }
    }

    // Attach click handlers to all anchor links
    const anchors = document.querySelectorAll('.prose .anchor')
    anchors.forEach((anchor) => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // Handle initial hash if present
    if (window.location.hash) {
      handleHashChange()
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pathname])

  return null
}

