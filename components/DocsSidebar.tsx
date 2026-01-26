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
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
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

  // Main section styling (level 0)
  const mainSectionClasses = titleLink
    ? `flex-1 text-left text-base font-semibold capitalize transition-all duration-200 ${
        pathname === titleLink
          ? 'text-foreground dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
          : 'text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]'
      }`
    : `flex-1 text-left text-base font-semibold capitalize transition-all duration-200 text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]`

  // Subsection styling (level 1+)
  const subsectionClasses = `flex-1 text-left text-sm font-medium capitalize transition-all duration-200 text-foreground/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]`

  const isSubsection = level > 0

  // Automatically open section when it becomes "active" due to navigation,
  // but don't auto-close to respect manual user toggles.
  useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true)
    }
  }, [defaultOpen])

  return (
    <div className="mt-1">
      <div 
        className={`w-full flex items-center justify-between ${paddingClass} pr-3 py-2`}
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
            onClick={() => setIsOpen(!isOpen)}
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

    if ([...nodeDocs, ...nodeRootDocs].some((doc) => pathname === doc.url)) {
      return true
    }

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
              className={`flex items-center gap-2 pl-3 pr-3 py-1.5 transition-all duration-200 ${
                pathname === doc.url
                  ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                  : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]'
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
              <span className="truncate text-sm text-left">{doc.title}</span>
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
              className={`flex items-center gap-2 pl-3 pr-3 py-1.5 transition-all duration-200 ${
                pathname === doc.url
                  ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.3)]'
                  : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_3px_rgba(255,255,255,0.15)]'
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
              <span className="truncate text-sm text-left">{doc.title}</span>
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
  const { isSidebarOpen, setResizing, setResizeCooldown: setResizeCooldownContext } = useSidebar()
  
  // Resizable sidebar state - start with default to avoid hydration mismatch
  const [sidebarWidth, setSidebarWidth] = useState(220) // Default: 220px for better proportions
  const [isResizing, setIsResizing] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [resizeCooldown, setResizeCooldown] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  // Sync resize state with context
  useEffect(() => {
    setResizing(isResizing)
  }, [isResizing, setResizing])
  
  useEffect(() => {
    setResizeCooldownContext(resizeCooldown)
  }, [resizeCooldown, setResizeCooldownContext])
  
  // Load width from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docs-sidebar-width')
      if (saved) {
        const parsedWidth = parseInt(saved, 10)
        if (!isNaN(parsedWidth) && parsedWidth >= 180 && parsedWidth <= 400) {
          setSidebarWidth(parsedWidth)
        }
      }
    }
  }, [])
  
  // Save width to localStorage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('docs-sidebar-width', sidebarWidth.toString())
    }
  }, [sidebarWidth, mounted])
  
  // Handle mouse move for resizing
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    
    e.preventDefault()
    e.stopPropagation()
    
    const newWidth = e.clientX
    // Constrain width between 180px and 400px for better proportions
    const constrainedWidth = Math.min(Math.max(180, newWidth), 400)
    setSidebarWidth(constrainedWidth)
  }, [isResizing])
  
  // Handle mouse up to stop resizing
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!isResizing) return
    
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(false)
    
    // Add cooldown period to prevent accidental toggles
    setResizeCooldown(true)
    setTimeout(() => {
      setResizeCooldown(false)
    }, 150) // 150ms cooldown after resize ends
  }, [isResizing])
  
  // Set up event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      const handleMouseMoveWrapper = (e: MouseEvent) => {
        handleMouseMove(e)
      }
      
      const handleMouseUpWrapper = (e: MouseEvent) => {
        handleMouseUp(e)
      }
      
      // Prevent clicks during resize
      const handleClick = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
      }
      
      document.addEventListener('mousemove', handleMouseMoveWrapper, { passive: false })
      document.addEventListener('mouseup', handleMouseUpWrapper, { passive: false })
      document.addEventListener('click', handleClick, { capture: true, passive: false })
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.body.style.pointerEvents = 'auto'
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMoveWrapper)
        document.removeEventListener('mouseup', handleMouseUpWrapper)
        document.removeEventListener('click', handleClick, { capture: true })
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.body.style.pointerEvents = ''
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

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
      style={mounted ? { width: `${sidebarWidth}px` } : { width: '220px' }}
    >
      {/* Resize handle - wider hit area for better UX */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize z-20 transition-colors ${
          isResizing ? 'bg-primary/60' : 'hover:bg-primary/30'
        }`}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsResizing(true)
        }}
        onClick={(e) => {
          // Prevent any click events during or after resize
          e.preventDefault()
          e.stopPropagation()
        }}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
          pointerEvents: 'auto'
        }}
      />
      
      <nav className="sticky top-20 space-y-0 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar pb-8 text-sm pr-6 text-left">
        <Link
          href={pathname.startsWith('/knowledge-base') ? '/knowledge-base/docs' : '/docs'}
          className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
            pathname === (pathname.startsWith('/knowledge-base') ? '/knowledge-base/docs' : '/docs')
              ? 'text-foreground font-semibold dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
              : 'text-muted-foreground hover:text-foreground dark:hover:text-white dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]'
          }`}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-base text-left">Overview</span>
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

