'use client'

import { useEffect, useState, useRef } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
  onContentChange?: () => void
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function TableOfContents({ content, onContentChange }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const activeItemRef = useRef<HTMLLIElement | null>(null)
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    // Extract headings from rendered DOM (most reliable method)
    const extractFromDOM = () => {
      const headingElements = document.querySelectorAll('.prose h2, .prose h3, .prose h4')
      const extractedHeadings: Heading[] = []

      headingElements.forEach((heading) => {
        // Skip headings that are inside callouts
        if (heading.closest('.callout-container')) {
          return
        }
        
        const level = parseInt(heading.tagName.charAt(1)) // H2 -> 2, H3 -> 3, etc.
        const text = heading.textContent?.trim() || ''
        
        // Skip if empty
        if (!text) return
        
        // Clean text - remove anchor link symbols and extra whitespace
        const cleanText = text
          .replace(/\s*#+\s*$/, '') // Remove trailing anchor symbols
          .replace(/^\s*#+\s*/, '') // Remove leading anchor symbols
          .trim()
        
        if (!cleanText) return
        
        // Generate or use existing ID
        const id = heading.id || slugify(cleanText)
        if (!heading.id) {
          heading.id = id
        }
        
        extractedHeadings.push({ id, text: cleanText, level })
      })

      if (extractedHeadings.length > 0) {
        setHeadings(extractedHeadings)
      }
    }

    // Try to extract from DOM (after MDX renders)
    const timeoutId = setTimeout(extractFromDOM, 300)

    return () => clearTimeout(timeoutId)
  }, [content])

  // Re-extract when DOM changes (for dynamic content like tabs)
  useEffect(() => {
    const extractHeadings = () => {
      // Include headings from tab content as well
      const headingElements = document.querySelectorAll('.prose h2, .prose h3, .prose h4, .tab-content h2, .tab-content h3, .tab-content h4')
      if (headingElements.length === 0) return
      
      const extractedHeadings: Heading[] = []
      headingElements.forEach((heading) => {
        // Skip headings that are inside callouts
        if (heading.closest('.callout-container')) {
          return
        }
        
        const level = parseInt(heading.tagName.charAt(1))
        const text = heading.textContent?.trim() || ''
        if (!text) return
        
        const cleanText = text
          .replace(/\s*#+\s*$/, '')
          .replace(/^\s*#+\s*/, '')
          .trim()
        if (!cleanText) return
        
        const id = heading.id || slugify(cleanText)
        if (!heading.id) {
          heading.id = id
        }
        
        extractedHeadings.push({ id, text: cleanText, level })
      })
      
      if (extractedHeadings.length > 0) {
        setHeadings(extractedHeadings)
        onContentChange?.() // Notify parent of content change
      }
    }

    const observer = new MutationObserver(extractHeadings)

    const proseElement = document.querySelector('.prose, #doc-content, #blog-content')
    if (proseElement) {
      observer.observe(proseElement, {
        childList: true,
        subtree: true
      })
      
      // Also extract immediately
      extractHeadings()
    }

    // Listen for content changes from tabs
    const handleContentChange = () => {
      setTimeout(extractHeadings, 200)
    }
    window.addEventListener('contentChange', handleContentChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('contentChange', handleContentChange)
    }
  }, [onContentChange])

  // Scroll spy to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return

    const updateActiveHeading = () => {
      // Offset for sticky header and some buffer
      const scrollOffset = 120
      const scrollPosition = window.scrollY + scrollOffset
      
      const headingElements = headings
        .map((h) => document.getElementById(h.id))
        .filter((el) => el !== null && !el.closest('.callout-container')) as HTMLElement[]

      if (headingElements.length === 0) return

      // Find the heading that's currently in view
      let currentActiveId = ''

      // Check from bottom to top to find the last heading that has passed the scroll position
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const heading = headingElements[i]
        // Check if heading is visible (not hidden in inactive tabs) and not inside a callout
        const isVisible = heading.offsetParent !== null && !heading.closest('.callout-container')
        if (!isVisible) continue
    
        const headingRect = heading.getBoundingClientRect()
        const headingTop = headingRect.top + window.scrollY
        const headingBottom = headingRect.bottom + window.scrollY
        
        // Check if the heading is in the viewport with some buffer
        // Consider a heading active if its top has passed the scroll position
        // or if we're within the heading's area
        if (headingTop <= scrollPosition) {
          currentActiveId = heading.id
          break
        }
      }

      // If scrolled past all headings, highlight the last visible one
      if (!currentActiveId && headingElements.length > 0) {
        const visibleHeadings = headingElements.filter(h => {
          const isVisible = h.offsetParent !== null && !h.closest('.callout-container')
          return isVisible
        })
        if (visibleHeadings.length > 0) {
          const lastHeading = visibleHeadings[visibleHeadings.length - 1]
          const lastHeadingRect = lastHeading.getBoundingClientRect()
          const lastHeadingBottom = lastHeadingRect.bottom + window.scrollY
          // If we're near the bottom of the page, highlight the last heading
          if (scrollPosition >= lastHeadingBottom - 300) {
            currentActiveId = lastHeading.id
          }
        }
      }

      // Only update if the active ID actually changed to avoid unnecessary re-renders
      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId)
      }
    }

    // Use passive listener for better performance
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    // Also listen for resize events in case layout changes
    window.addEventListener('resize', updateActiveHeading, { passive: true })
    updateActiveHeading() // Initial check

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [headings, activeId])

  // Auto-scroll to active item when it changes
  useEffect(() => {
    if (!activeId || !navRef.current) return

    // Use requestAnimationFrame and setTimeout to ensure DOM is fully updated
    const scrollToActive = () => {
      // Find the active item in the DOM (in case ref wasn't set yet)
      const activeItem = navRef.current?.querySelector(`li a[href="#${activeId}"]`)?.closest('li') as HTMLLIElement | null
      const activeItemElement = activeItemRef.current || activeItem
      
      if (!activeItemElement || !navRef.current) return

      const nav = navRef.current
      
      // Get positions relative to the nav container
      const navRect = nav.getBoundingClientRect()
      const itemRect = activeItemElement.getBoundingClientRect()
      
      // Calculate positions relative to nav's scroll container
      const itemTopRelative = itemRect.top - navRect.top + nav.scrollTop
      const itemBottomRelative = itemTopRelative + activeItemElement.offsetHeight
      
      // Get current scroll state
      const navScrollTop = nav.scrollTop
      const navHeight = nav.clientHeight
      const navScrollBottom = navScrollTop + navHeight
      
      // Calculate padding (keep some space at top and bottom)
      const paddingTop = 30
      const paddingBottom = 30
      
      // Check if item is outside visible area and scroll if needed
      const isAboveViewport = itemTopRelative < navScrollTop + paddingTop
      const isBelowViewport = itemBottomRelative > navScrollBottom - paddingBottom
      
      if (isAboveViewport) {
        // Item is above visible area or too close to top, scroll to show it with padding
        nav.scrollTo({
          top: Math.max(0, itemTopRelative - paddingTop),
          behavior: 'smooth'
        })
      } else if (isBelowViewport) {
        // Item is below visible area or too close to bottom, scroll to show it with padding
        const targetScroll = itemBottomRelative - navHeight + paddingBottom
        nav.scrollTo({
          top: Math.max(0, targetScroll),
          behavior: 'smooth'
        })
      }
    }

    // Use multiple delays to ensure DOM is updated
    requestAnimationFrame(() => {
      setTimeout(scrollToActive, 100)
      // Also try again after a longer delay in case of slow renders
      setTimeout(scrollToActive, 300)
    })
  }, [activeId])

  if (headings.length === 0) {
    return null
  }

  return (
    <aside className="hidden xl:block w-56 flex-shrink-0 pl-6">
      <nav 
        ref={navRef}
        className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar pb-8 border-l border-border/40 pl-4"
      >
        <h2 className="text-xs font-bold text-foreground mb-5 uppercase tracking-wider dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]">
          ON THIS PAGE
        </h2>
        <ul className="space-y-1.5 text-sm">
          {headings.map((heading, index) => {
            const isActive = activeId === heading.id
            
            // Different styling based on heading level
            const getHeadingClasses = () => {
              if (isActive) {
                return 'text-primary font-bold dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
              }
              
              if (heading.level === 2) {
                return 'text-foreground font-semibold dark:text-gray-200 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
              } else if (heading.level === 3) {
                return 'text-foreground/90 font-medium dark:text-gray-300 dark:hover:text-gray-100 dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.25)]'
              } else {
                return 'text-muted-foreground dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.2)]'
              }
            }
            
            return (
              <li
                key={`${heading.id}-${index}`}
                ref={isActive ? (el) => {
                  // Update ref when this item becomes active
                  if (el && isActive) {
                    activeItemRef.current = el
                  }
                } : null}
                className={`
                  relative
                  ${heading.level === 2 ? 'pl-0' : heading.level === 3 ? 'pl-4' : heading.level === 4 ? 'pl-8' : ''}
                `}
              >
                {/* Vertical line indicator for active item with glow */}
                {isActive && (
                  <span className="absolute left-[-17px] top-0 bottom-0 w-0.5 bg-primary dark:shadow-[0_0_8px_rgba(255,94,25,0.6)]" />
                )}
                <a
                  href={`#${heading.id}`}
                  className={`
                    block py-1 transition-all duration-200
                    ${getHeadingClasses()}
                  `}
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(heading.id)
                    if (element) {
                      const offset = 100
                      const elementPosition = element.getBoundingClientRect().top
                      const offsetPosition = elementPosition + window.pageYOffset - offset

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                      })
                      
                      window.history.pushState(null, '', `#${heading.id}`)
                      setActiveId(heading.id)
                    }
                  }}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

