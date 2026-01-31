'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import type { Doc } from 'contentlayer/generated'
import { getSectionOrder, getSubsectionOrder } from '@/config/docs-order.config'
import { useSidebar } from './SidebarContext'

interface DocsSidebarProps {
  docs: Doc[]
  allDocs?: Doc[] // Optional: all docs for finding overview pages
}

/**
 * Convert normalized slug (with hyphens) to readable display name (with spaces)
 * Example: "Knowledge-base" -> "Knowledge base"
 */
function formatDisplayName(slug: string): string {
  return slug.replace(/-/g, ' ')
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  titleLink?: string | null
  level?: number
}

function CollapsibleSection({ title, children, defaultOpen = false, titleLink = null, level = 0 }: CollapsibleSectionProps) {
  // Always sync state with defaultOpen prop - this ensures sections open when they should
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()

  const triggerWidthRecalc = () => {
    // Trigger width recalculation after state update
    // Use a longer delay to ensure React has updated the DOM and animations have started
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('sidebar-content-change'))
    }, 150)
  }
  
  // CRITICAL: Sync isOpen with defaultOpen whenever it changes
  // This ensures sections open when they contain the active document
  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true)
    }
  }, [defaultOpen]) // This will run whenever defaultOpen changes
  
  // Listen for sidebar reopen event to ensure active sections are expanded
  useEffect(() => {
    const handleSidebarReopen = () => {
      // If this section should be open, ensure it is
      if (defaultOpen) {
        setIsOpen(true)
      }
    }
    
    window.addEventListener('sidebar-reopened', handleSidebarReopen as EventListener)
    
    return () => {
      window.removeEventListener('sidebar-reopened', handleSidebarReopen as EventListener)
    }
  }, [defaultOpen])

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
    triggerWidthRecalc()
  }
  
  const handleButtonToggle = () => {
    setIsOpen(!isOpen)
    triggerWidthRecalc()
  }

  // Calculate padding based on level for proper tabulation
  // Level 0 (main sections): pl-3 (12px)
  // Level 1 (subsections): pl-5 (20px)
  // Level 2 (nested subsections): pl-8 (32px)
  // Level 3+ (deeper nesting): use inline style
  const getLevelPadding = (level: number) => {
    if (level === 0) return { class: 'pl-3', style: undefined }
    if (level === 1) return { class: 'pl-5', style: undefined }
    if (level === 2) return { class: 'pl-8', style: undefined }
    // For deeper levels, use inline style
    return { class: '', style: { paddingLeft: `${12 + level * 8}px` } }
  }
  
  const { class: paddingClass, style: paddingStyle } = getLevelPadding(level)

  // Main section styling (level 0) - slightly smaller for better proportions
  const mainSectionClasses = titleLink
    ? `flex-1 text-left text-sm font-semibold capitalize transition-all duration-200 ${
        pathname === titleLink
          ? 'text-foreground dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
          : 'text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]'
      }`
    : `flex-1 text-left text-sm font-semibold capitalize transition-all duration-200 text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]`

  // Subsection styling (level 1+) - slightly smaller
  const subsectionClasses = `flex-1 text-left text-xs font-medium capitalize transition-all duration-200 text-foreground/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]`

  const isSubsection = level > 0

 // Run once on mount

  return (
    <div className="mt-1">
      <div 
        className={`w-full flex items-center justify-between ${paddingClass} pr-2 py-1.5`}
        style={paddingStyle}
      >
        {titleLink ? (
          <Link
            href={titleLink}
            className={isSubsection ? subsectionClasses : mainSectionClasses}
          >
            <span className="text-left block">{title}</span>
          </Link>
        ) : (
          <button
            onClick={handleButtonToggle}
            className={isSubsection ? subsectionClasses : mainSectionClasses}
          >
            <span className="text-left block">{title}</span>
          </button>
        )}
        <button
          onClick={handleToggleClick}
          className="ml-2 p-1 text-muted-foreground hover:text-foreground dark:hover:text-white transition-all duration-200 flex-shrink-0"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {isOpen && <div className="mt-0.5">{children}</div>}
    </div>
  )
}

// Helper function to get document order (defaults to 999 if not set)
// Ensures the order is always a number, even if it comes as a string from frontmatter
function getDocOrder(doc: Doc): number {
  if (doc.order === undefined || doc.order === null) return 999
  // Ensure it's a number (in case contentlayer returns it as a string)
  const order = typeof doc.order === 'string' ? parseInt(doc.order, 10) : doc.order
  return isNaN(order) ? 999 : order
}

// Recursive component to render nested structure
function NestedSection({
  structure,
  pathname,
  allDocs,
  level = 0,
  parentPath = '',
  category = '',
}: {
  structure: any
  pathname: string
  allDocs: Doc[]
  level?: number
  parentPath?: string
  category?: string
}) {
  const entries = Object.entries(structure).filter(([key]) => key !== '_docs' && key !== '_root')
  
  // Get documents at this level
  const docs = structure._docs || []
  const rootDocs = structure._root || []

  // Helper to determine if any doc in this structure (at any depth) matches the current pathname
  const hasActiveDoc = (node: any): boolean => {
    const nodeDocs: Doc[] = node._docs || []
    const nodeRootDocs: Doc[] = node._root || []

    // Check if any document at this level matches the current pathname
    const hasMatch = [...nodeDocs, ...nodeRootDocs].some((doc) => {
      // Normalize both URLs for comparison (handle trailing slashes)
      const docUrl = doc.url?.replace(/\/$/, '') || ''
      const currentPath = pathname?.replace(/\/$/, '') || ''
      return docUrl === currentPath
    })

    if (hasMatch) {
      return true
    }

    // Recursively check child nodes
    return Object.entries(node).some(([key, child]) => {
      if (key === '_docs' || key === '_root') return false
      return hasActiveDoc(child)
    })
  }
  
  // Sort entries (subsections) - use parentPath for nested subsections
  const sortedEntries = entries.sort(([a], [b]) => {
    // Extract parent path from parentPath
    // Example: "Knowledge-base/foundations/foundations" -> "foundations.foundations"
    // Example: "Knowledge-base/foundations" -> "foundations"
    let parentSubsection: string | undefined = undefined
    if (parentPath) {
      const parts = parentPath.split('/')
      if (parts.length > 1) {
        // Remove the category (first part) and join the rest with dots
        parentSubsection = parts.slice(1).join('.')
      } else if (parts.length === 1 && parts[0] !== category) {
        parentSubsection = parts[0]
      }
    }
    
    const orderA = getSubsectionOrder(category, a, parentSubsection)
    const orderB = getSubsectionOrder(category, b, parentSubsection)
    if (orderA !== orderB) return orderA - orderB
    return a.localeCompare(b)
  })
  
  // Helper to check if a document is an overview
  const isOverview = (doc: Doc) => doc.slug.endsWith('/overview')
  
  // Sort documents - order field takes precedence, then overview status
  const sortedDocs = [...docs].sort((a, b) => {
    const orderA = getDocOrder(a)
    const orderB = getDocOrder(b)
    
    // First, sort by order field (lower numbers come first)
    if (orderA !== orderB) return orderA - orderB
    
    // If order is the same, prioritize overview documents
    const aIsOverview = isOverview(a)
    const bIsOverview = isOverview(b)
    if (aIsOverview && !bIsOverview) return -1
    if (!aIsOverview && bIsOverview) return 1
    
    // Finally, sort alphabetically
    return a.title.localeCompare(b.title)
  })
  
  const sortedRootDocs = [...rootDocs].sort((a, b) => {
    const orderA = getDocOrder(a)
    const orderB = getDocOrder(b)
    
    // First, sort by order field (lower numbers come first)
    if (orderA !== orderB) return orderA - orderB
    
    // If order is the same, prioritize overview documents
    const aIsOverview = isOverview(a)
    const bIsOverview = isOverview(b)
    if (aIsOverview && !bIsOverview) return -1
    if (!aIsOverview && bIsOverview) return 1
    
    // Finally, sort alphabetically
    return a.title.localeCompare(b.title)
  })
  
  // Calculate padding for documents based on level for proper tabulation
  // Documents should be indented more than their parent section/subsection
  // Level 0 docs (directly in section): pl-5 (20px) - 8px more than section (pl-3)
  // Level 1 docs (in subsection): pl-8 (32px) - 8px more than subsection (pl-5)
  // Level 2 docs (in nested subsection): pl-11 (44px) - 8px more than nested subsection (pl-8)
  // Level 3+ docs: use inline style
  const getDocumentPadding = (level: number) => {
    if (level === 0) return { class: 'pl-5', style: undefined }  // 20px
    if (level === 1) return { class: 'pl-8', style: undefined }  // 32px
    if (level === 2) return { class: 'pl-11', style: undefined } // 44px
    // For deeper levels, use inline style
    return { class: '', style: { paddingLeft: `${20 + level * 12}px` } }
  }
  
  const { class: documentPaddingClass, style: documentPaddingStyle } = getDocumentPadding(level)
  
  return (
    <>
      {/* Root documents (documents directly in this section) */}
      {sortedRootDocs.length > 0 && (
        <div 
          className={`space-y-0.5 text-left ${documentPaddingClass}`}
          style={documentPaddingStyle}
        >
          {sortedRootDocs.map((doc) => (
            <Link
              key={doc._id}
              href={doc.url}
              className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1 transition-all duration-200 ${
                pathname === doc.url
                  ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                  : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]'
              }`}
            >
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate text-xs text-left">{doc.title}</span>
            </Link>
          ))}
        </div>
      )}
      
      {/* Render subsections recursively */}
      {sortedEntries.map(([subsectionName, subsectionStructure]) => {
        const subsectionPath = parentPath ? `${parentPath}/${subsectionName}` : subsectionName
        const subsectionIsActive = hasActiveDoc(subsectionStructure)
        
        // Check if overview page exists - look in _root first, then by slug
        const subsectionRootDocs: Doc[] = (subsectionStructure as any)._root || []
        const overviewInRoot = subsectionRootDocs.find((doc) => doc.slug.endsWith('/overview'))
        const overviewDoc = overviewInRoot || allDocs.find((doc) => doc.slug === `${subsectionPath}/overview`)
        const overviewUrl = overviewDoc?.url || null
        
        return (
          <CollapsibleSection
            key={subsectionName}
            title={formatDisplayName(subsectionName)}
            defaultOpen={subsectionIsActive}
            titleLink={overviewUrl}
            level={level + 1}
          >
            <NestedSection
              structure={subsectionStructure}
              pathname={pathname}
              allDocs={allDocs}
              level={level + 1}
              parentPath={subsectionPath}
              category={category}
            />
          </CollapsibleSection>
        )
      })}
      
      {/* Documents at this level (if any) */}
      {sortedDocs.length > 0 && (
        <div 
          className={`space-y-0.5 text-left ${documentPaddingClass}`}
          style={documentPaddingStyle}
        >
          {sortedDocs.map((doc) => (
            <Link
              key={doc._id}
              href={doc.url}
              className={`flex items-center gap-1.5 pl-2.5 pr-2 py-1 transition-all duration-200 ${
                pathname === doc.url
                  ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                  : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]'
              }`}
            >
              <svg
                className="w-3 h-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="truncate text-xs text-left">{doc.title}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export function DocsSidebar({ docs, allDocs: allDocsProp }: DocsSidebarProps) {
  // Use allDocs prop if provided, otherwise fall back to docs
  const allDocs = allDocsProp || docs
  const pathname = usePathname()
  const { isSidebarOpen } = useSidebar()
  const prevSidebarOpenRef = useRef(isSidebarOpen)
  
  // Dynamic sidebar width based on content
  const [sidebarWidth, setSidebarWidth] = useState(200) // Default: 200px
  const [mounted, setMounted] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  
  // When sidebar reopens (transitions from closed to open), ensure active document's parent sections are expanded
  useEffect(() => {
    // Only trigger when sidebar transitions from closed to open (not on initial mount)
    if (mounted && !prevSidebarOpenRef.current && isSidebarOpen) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Trigger a custom event that CollapsibleSection can listen to
        window.dispatchEvent(new CustomEvent('sidebar-reopened', { detail: { pathname } }))
        
        // Scroll active document into view
        if (navRef.current) {
          const activeLink = navRef.current.querySelector(`a[href="${pathname}"]`)
          if (activeLink) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 300) // Delay to ensure all sections are expanded
    }
    prevSidebarOpenRef.current = isSidebarOpen
  }, [isSidebarOpen, pathname, mounted])
  
  // Calculate optimal width based on content - only when content is actually truncated
  const calculateOptimalWidth = useCallback(() => {
    if (!navRef.current || !mounted || !isSidebarOpen) return
    
    // Find all visible links and buttons (the actual clickable items)
    const allLinks = navRef.current.querySelectorAll('a, button')
    let maxWidth = sidebarWidth // Start with current width
    let hasTruncatedContent = false
    
    // First, check all links for truncation
    allLinks.forEach((link) => {
      const rect = link.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      
      // Find the text span inside
      const textSpan = link.querySelector('span')
      if (!textSpan) return
      
      // Check if the text span is truncated
      const spanRect = textSpan.getBoundingClientRect()
      if (spanRect.width === 0 || spanRect.height === 0) return
      
      // Check if text is being truncated
      const isTruncated = textSpan.scrollWidth > textSpan.clientWidth
      
      if (isTruncated) {
        hasTruncatedContent = true
        
        const linkStyles = window.getComputedStyle(link)
        const linkPaddingLeft = parseFloat(linkStyles.paddingLeft) || 0
        const linkPaddingRight = parseFloat(linkStyles.paddingRight) || 0
        
        // Get all siblings (like icons) to account for their width
        let siblingsWidth = 0
        Array.from(link.children).forEach((child) => {
          if (child !== textSpan && child instanceof HTMLElement) {
            siblingsWidth += child.offsetWidth
          }
        })
        
        // Calculate total width needed including all padding and gaps
        const parent = link.parentElement
        const parentPaddingLeft = parent ? parseFloat(window.getComputedStyle(parent).paddingLeft) || 0 : 0
        
        // Use scrollWidth to get the full text width (what the text actually needs)
        const textWidth = textSpan.scrollWidth
        const gap = 6 // Gap between icon and text (gap-1.5 = 6px)
        const totalWidth = textWidth + linkPaddingLeft + linkPaddingRight + parentPaddingLeft + siblingsWidth + gap + 25 // Extra buffer
        
        if (totalWidth > maxWidth) {
          maxWidth = Math.min(totalWidth, 320) // Cap at 320px max
        }
      }
    })
    
    // Only update width if we found truncated content that needs more space
    if (hasTruncatedContent && maxWidth > sidebarWidth) {
      const optimalWidth = Math.max(180, Math.min(maxWidth, 320))
      setSidebarWidth(optimalWidth)
    } else if (!hasTruncatedContent) {
      // If nothing is truncated, we can potentially shrink
      // Find the minimum width needed for all visible content
      let minNeededWidth = 180
      
      allLinks.forEach((link) => {
        const rect = link.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) return
        
        const textSpan = link.querySelector('span')
        if (!textSpan) return
        
        const linkStyles = window.getComputedStyle(link)
        const linkPaddingLeft = parseFloat(linkStyles.paddingLeft) || 0
        const linkPaddingRight = parseFloat(linkStyles.paddingRight) || 0
        
        let siblingsWidth = 0
        Array.from(link.children).forEach((child) => {
          if (child !== textSpan && child instanceof HTMLElement) {
            siblingsWidth += child.offsetWidth
          }
        })
        
        const parent = link.parentElement
        const parentPaddingLeft = parent ? parseFloat(window.getComputedStyle(parent).paddingLeft) || 0 : 0
        const textWidth = textSpan.scrollWidth
        const gap = 6
        const totalWidth = textWidth + linkPaddingLeft + linkPaddingRight + parentPaddingLeft + siblingsWidth + gap + 25
        
        if (totalWidth > minNeededWidth) {
          minNeededWidth = Math.min(totalWidth, 320)
        }
      })
      
      // Only shrink if we can safely reduce width
      if (minNeededWidth < sidebarWidth) {
        const optimalWidth = Math.max(180, minNeededWidth)
        setSidebarWidth(optimalWidth)
      }
    }
  }, [mounted, isSidebarOpen, sidebarWidth])
  
  // Initialize mounted state and ensure active sections are expanded on initial load
  useEffect(() => {
    setMounted(true)
    
    // On initial mount, if sidebar is open, ensure active document's sections are expanded
    if (isSidebarOpen) {
      setTimeout(() => {
        // Trigger a custom event that CollapsibleSection can listen to
        window.dispatchEvent(new CustomEvent('sidebar-reopened', { detail: { pathname } }))
        
        // Scroll active document into view
        if (navRef.current) {
          const activeLink = navRef.current.querySelector(`a[href="${pathname}"]`)
          if (activeLink) {
            activeLink.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 300) // Delay to ensure DOM is ready
    }
  }, []) // Run once on mount
  
  // Only listen for section toggle events (user interaction) - NO automatic resize on mount
  useEffect(() => {
    if (!mounted || !isSidebarOpen) return
    
    const handleContentChange = () => {
      // Delay to allow animation to complete before measuring
      setTimeout(() => {
        calculateOptimalWidth()
      }, 400) // Longer delay to ensure DOM is fully updated after animation
    }
    
    // Listen for custom event from CollapsibleSection (only when user toggles sections)
    window.addEventListener('sidebar-content-change', handleContentChange)
    
    return () => {
      window.removeEventListener('sidebar-content-change', handleContentChange)
    }
  }, [mounted, isSidebarOpen, calculateOptimalWidth])

  // Recursive function to build nested structure (strips category prefix)
  const buildNestedStructure = (docs: Doc[], category: string): Record<string, any> => {
    const structure: Record<string, any> = {}
    
    docs.forEach((doc) => {
      const parts = doc.slug.split('/')
      // Remove the category part (first element) since we're building within a category
      const relativeParts = parts.slice(1)
      
      if (relativeParts.length === 0) {
        // Document directly in section (e.g., section/overview.mdx)
        if (!structure._root) {
          structure._root = []
        }
        structure._root.push(doc)
      } else {
        // Document in a subsection - build nested structure
        let current = structure
        
        // Build nested structure for all parts except the last (which is the document name)
        for (let i = 0; i < relativeParts.length - 1; i++) {
          const part = relativeParts[i]
          if (!current[part]) {
            current[part] = { _docs: [], _root: [] }
          }
          current = current[part]
        }
        
        // Add document to the appropriate level
        const lastPart = relativeParts[relativeParts.length - 1]
        if (relativeParts.length === 1) {
          // Document directly in first-level subsection
          if (!current._docs) {
            current._docs = []
          }
          current._docs.push(doc)
        } else {
          // Document in nested subsection
          if (!current._docs) {
            current._docs = []
          }
          current._docs.push(doc)
        }
      }
    })
    
    return structure
  }
  
  // Group docs by category (first level)
  const groupedDocs = docs.reduce((acc, doc) => {
    const parts = doc.slug.split('/')
    const category = parts[0] || 'general'
    
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(doc)
    
    return acc
  }, {} as Record<string, Doc[]>)
  
  // Build nested structure for each category (stripping category prefix)
  const nestedStructures = Object.entries(groupedDocs).reduce((acc, [category, categoryDocs]) => {
    acc[category] = buildNestedStructure(categoryDocs, category)
    return acc
  }, {} as Record<string, any>)
  
  // Sort categories using global config
  const sortedCategories = Object.entries(nestedStructures).sort(([a], [b]) => {
    const orderA = getSectionOrder(a)
    const orderB = getSectionOrder(b)
    if (orderA !== orderB) return orderA - orderB
    
    // If same order, sort alphabetically
    return a.localeCompare(b)
  })

  if (!isSidebarOpen) {
    return null
  }

  return (
    <aside 
      ref={sidebarRef}
      className="hidden lg:block flex-shrink-0 border-r border-border/40 relative transition-all duration-300"
      style={mounted ? { width: `${sidebarWidth}px` } : { width: '200px' }}
    >
      <nav 
        ref={navRef}
        className="sticky top-20 space-y-0 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar pb-8 text-sm pr-3 text-left"
        id="docs-sidebar-nav"
      >
        <Link
          href={pathname.startsWith('/knowledge-base') ? '/knowledge-base/docs' : '/docs'}
          className={`flex items-center gap-2 px-2.5 py-2 transition-all duration-200 ${
            pathname === (pathname.startsWith('/knowledge-base') ? '/knowledge-base/docs' : '/docs')
              ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              : 'text-muted-foreground hover:text-foreground dark:hover:text-white dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
          }`}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm text-left">Overview</span>
        </Link>
        {sortedCategories.map(([category, structure]) => {
          // Get all docs from this category to check if active
          const allCategoryDocs = groupedDocs[category] || []
          const isCategoryActive = allCategoryDocs.some((doc) => pathname === doc.url)
          
          // Check if category has any content
          const hasContent = Object.keys(structure).length > 0
          
          if (!hasContent) return null
          
          // Check if overview page exists for this category
          const overviewDoc = allDocs.find((doc) => doc.slug === `${category}/overview`)
          const categoryUrl = overviewDoc?.url || null
          
          return (
            <CollapsibleSection
              key={category}
              title={formatDisplayName(category)}
              defaultOpen={isCategoryActive}
              titleLink={categoryUrl}
              level={0}
            >
              <NestedSection
                structure={structure}
                pathname={pathname}
                allDocs={allDocs}
                level={0}
                parentPath={category}
                category={category}
              />
            </CollapsibleSection>
          )
        })}
      </nav>
    </aside>
  )
}

