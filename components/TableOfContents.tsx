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
      const scrollPosition = window.scrollY + 100 // Offset for sticky header
          const headingElements = headings
            .map((h) => document.getElementById(h.id))
            .filter((el) => el !== null && !el.closest('.callout-container')) as HTMLElement[]

          if (headingElements.length === 0) return

          // Find the heading that's currently in view
          let currentActiveId = ''

          for (let i = headingElements.length - 1; i >= 0; i--) {
            const heading = headingElements[i]
            // Check if heading is visible (not hidden in inactive tabs) and not inside a callout
            const isVisible = heading.offsetParent !== null && !heading.closest('.callout-container')
            if (!isVisible) continue
        
        const headingTop = heading.getBoundingClientRect().top + window.scrollY
        
        if (headingTop <= scrollPosition) {
          currentActiveId = heading.id
          break
        }
      }

      // If scrolled past all headings, highlight the last visible one
      if (!currentActiveId && headingElements.length > 0) {
        const visibleHeadings = headingElements.filter(h => h.offsetParent !== null)
        if (visibleHeadings.length > 0) {
          const lastHeading = visibleHeadings[visibleHeadings.length - 1]
          const lastHeadingBottom = lastHeading.getBoundingClientRect().bottom + window.scrollY
          if (scrollPosition >= lastHeadingBottom - 200) {
            currentActiveId = lastHeading.id
          }
        }
      }

      setActiveId(currentActiveId)
    }

    window.addEventListener('scroll', updateActiveHeading)
    updateActiveHeading() // Initial check

    return () => window.removeEventListener('scroll', updateActiveHeading)
  }, [headings])

  // Auto-scroll to active item when it changes
  useEffect(() => {
    if (activeId && activeItemRef.current && navRef.current) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => {
        if (activeItemRef.current && navRef.current) {
          const nav = navRef.current
          const activeItem = activeItemRef.current
          
          // Get positions
          const navRect = nav.getBoundingClientRect()
          const itemRect = activeItem.getBoundingClientRect()
          
          // Calculate if item is outside visible area
          const itemTop = itemRect.top - navRect.top + nav.scrollTop
          const itemBottom = itemTop + itemRect.height
          const navScrollTop = nav.scrollTop
          const navHeight = nav.clientHeight
          const navScrollBottom = navScrollTop + navHeight
          
          // Scroll to show active item if it's not fully visible
          if (itemTop < navScrollTop) {
            // Item is above visible area, scroll to show it at top
            nav.scrollTo({
              top: itemTop - 20, // Add some padding
              behavior: 'smooth'
            })
          } else if (itemBottom > navScrollBottom) {
            // Item is below visible area, scroll to show it at bottom
            nav.scrollTo({
              top: itemBottom - navHeight + 20, // Add some padding
              behavior: 'smooth'
            })
          }
        }
      }, 100)
    }
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
                ref={isActive ? activeItemRef : null}
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

