'use client'

import { useEffect, useState, useRef } from 'react'

interface HighlightProps {
  children: React.ReactNode
  color?: 'yellow' | 'orange' | 'blue' | 'green' | 'purple'
}

export function Highlight({ children, color = 'yellow' }: HighlightProps) {
  const [isActive, setIsActive] = useState(false)
  const highlightRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!highlightRef.current) return

    const element = highlightRef.current
    
    // Check if highlight is inside a tab and if that tab is active
    const isInActiveTab = (el: HTMLElement): boolean => {
      const tabContent = el.closest('.tab-content')
      if (!tabContent) return true // Not in a tab, so it's "active"
      
      // Check if this tab content is visible (not display: none)
      const style = window.getComputedStyle(tabContent)
      return style.display !== 'none' && style.visibility !== 'hidden'
    }
    
    // Find the nearest heading (h2, h3, h4) that this highlight belongs to
    const findParentHeading = (el: HTMLElement): HTMLElement | null => {
      let current: HTMLElement | null = el.parentElement
      while (current) {
        if (current.tagName.match(/^H[2-4]$/)) {
          return current
        }
        current = current.parentElement
      }
      return null
    }

    const parentHeading = findParentHeading(element)
    if (!parentHeading) {
      // If no parent heading, check if element itself is in viewport
      const checkElementInView = () => {
        if (!isInActiveTab(element)) {
          setIsActive(false)
          return
        }
        
        const rect = element.getBoundingClientRect()
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0
        setIsActive(isInViewport)
      }
      
      checkElementInView()
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsActive(entry.isIntersecting && isInActiveTab(element))
          })
        },
        {
          rootMargin: '-20% 0px -20% 0px', // Only activate when in center 60% of viewport
          threshold: 0.1
        }
      )
      
      observer.observe(element)
      return () => observer.disconnect()
    }

    const headingId = parentHeading.id
    if (!headingId) return

    // Function to check if this heading section is currently in view
    const checkIfActive = () => {
      // First check if we're in an active tab
      if (!isInActiveTab(element)) {
        return false
      }
      
      const headingElement = document.getElementById(headingId)
      if (!headingElement) return false

      // Check if heading is visible (not hidden in inactive tabs)
      const isVisible = headingElement.offsetParent !== null
      if (!isVisible) return false

      // Get the heading's position
      const headingRect = headingElement.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      
      // Check if heading is in viewport (top part visible)
      const headingInView = headingRect.top < window.innerHeight && headingRect.bottom > 0
      
      // Check if the highlight element itself is in viewport
      const elementInView = elementRect.top < window.innerHeight && elementRect.bottom > 0
      
      // Activate if heading is in view AND element is in viewport
      // This ensures highlights only show when you've scrolled to that section
      return headingInView && elementInView
    }

    // Use Intersection Observer for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Only activate if:
          // 1. Element is intersecting (in viewport)
          // 2. We're in an active tab
          // 3. The parent heading is in view
          if (entry.isIntersecting) {
            setIsActive(checkIfActive())
          } else {
            setIsActive(false)
          }
        })
      },
      {
        rootMargin: '-10% 0px -10% 0px', // Only activate when in center 80% of viewport
        threshold: 0.1
      }
    )

    observer.observe(element)

    // Also listen for scroll events to check heading position
    const handleScroll = () => {
      if (isInActiveTab(element)) {
        setIsActive(checkIfActive())
      } else {
        setIsActive(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Listen for tab changes
    const handleTabChange = () => {
      setTimeout(() => {
        if (isInActiveTab(element)) {
          setIsActive(checkIfActive())
        } else {
          setIsActive(false)
        }
      }, 100)
    }

    window.addEventListener('contentChange', handleTabChange)

    // Initial check
    setIsActive(checkIfActive())

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('contentChange', handleTabChange)
    }
  }, [])

  const colorClasses = {
    yellow: 'highlight-yellow',
    orange: 'highlight-orange',
    blue: 'highlight-blue',
    green: 'highlight-green',
    purple: 'highlight-purple',
  }

  return (
    <span
      ref={highlightRef}
      className={`highlight-marker ${colorClasses[color]} ${isActive ? 'highlight-active' : ''}`}
    >
      {children}
    </span>
  )
}

