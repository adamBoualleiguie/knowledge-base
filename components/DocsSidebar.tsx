'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { Doc } from 'contentlayer/generated'
import { getSectionOrder, getSubsectionOrder } from '@/config/docs-order.config'

interface DocsSidebarProps {
  docs: Doc[]
  allDocs?: Doc[] // Optional: all docs for finding overview pages
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  titleLink?: string | null
}

function CollapsibleSection({ title, children, defaultOpen = false, titleLink = null, isSubsection = false }: CollapsibleSectionProps & { isSubsection?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const pathname = usePathname()

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  // Main section styling (big sections)
  const mainSectionClasses = titleLink
    ? `flex-1 text-base font-semibold capitalize transition-all duration-200 ${
        pathname === titleLink
          ? 'text-foreground dark:text-white dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'
          : 'text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]'
      }`
    : `flex-1 text-left text-base font-semibold capitalize transition-all duration-200 text-foreground/90 dark:text-gray-300 dark:hover:text-white dark:hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]`

  // Subsection styling (smaller sections)
  const subsectionClasses = `flex-1 text-sm font-medium capitalize transition-all duration-200 text-foreground/80 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]`

  return (
    <div className="mt-1">
      <div className={`w-full flex items-center justify-between ${isSubsection ? 'px-3' : 'px-3'} py-2`}>
        {titleLink ? (
          <Link
            href={titleLink}
            className={isSubsection ? subsectionClasses : mainSectionClasses}
          >
            {title}
          </Link>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={isSubsection ? subsectionClasses : mainSectionClasses}
          >
            {title}
          </button>
        )}
        <button
          onClick={handleToggleClick}
          className="ml-2 p-1 text-muted-foreground hover:text-foreground dark:hover:text-white transition-all duration-200"
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
      {isOpen && <div className={isSubsection ? 'ml-4 mt-0.5' : 'ml-2 mt-0.5'}>{children}</div>}
    </div>
  )
}

// Helper function to get document order (defaults to 999 if not set)
function getDocOrder(doc: Doc): number {
  return doc.order ?? 999
}

export function DocsSidebar({ docs, allDocs: allDocsProp }: DocsSidebarProps) {
  // Use allDocs prop if provided, otherwise fall back to docs
  const allDocs = allDocsProp || docs
  const pathname = usePathname()

  // Group docs by category (based on first part of slug)
  const groupedDocs = docs.reduce((acc, doc) => {
    const parts = doc.slug.split('/')
    const category = parts[0] || 'general'
    const subcategory = parts[1] || null
    
    if (!acc[category]) {
      acc[category] = {}
    }
    
    if (subcategory) {
      if (!acc[category][subcategory]) {
        acc[category][subcategory] = []
      }
      acc[category][subcategory].push(doc)
    } else {
      if (!acc[category]._root) {
        acc[category]._root = []
      }
      acc[category]._root.push(doc)
    }
    
    return acc
  }, {} as Record<string, Record<string, Doc[]>>)
  
  // Sort categories using global config
  const sortedCategories = Object.entries(groupedDocs).sort(([a], [b]) => {
    const orderA = getSectionOrder(a)
    const orderB = getSectionOrder(b)
    if (orderA !== orderB) return orderA - orderB
    
    // If same order, sort alphabetically
    return a.localeCompare(b)
  })

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border/40 pr-6">
      <nav className="sticky top-20 space-y-0 max-h-[calc(100vh-5rem)] overflow-y-auto hide-scrollbar pb-8 text-sm">
        <Link
          href="/docs"
          className={`flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
            pathname === '/docs'
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
          <span className="text-base">Overview</span>
        </Link>
        {sortedCategories.map(([category, subcategories]) => {
          const hasSubcategories = Object.keys(subcategories).length > 1 || (Object.keys(subcategories).length === 1 && !subcategories._root)
          const isCategoryActive = Object.values(subcategories)
            .flat()
            .some((doc) => pathname === doc.url)

          if (hasSubcategories) {
            // Check if overview page exists for this category
            const overviewDoc = allDocs.find((doc) => doc.slug === `${category}/overview`)
            const categoryUrl = overviewDoc?.url || null
            
            return (
              <CollapsibleSection
                key={category}
                title={category}
                defaultOpen={isCategoryActive}
                titleLink={categoryUrl}
                isSubsection={false}
              >
                {Object.entries(subcategories)
                  .sort(([a], [b]) => {
                    // Always put _root (which contains overview) first
                    if (a === '_root') return -1
                    if (b === '_root') return 1
                    
                    // Use global subsection order
                    const orderA = getSubsectionOrder(category, a)
                    const orderB = getSubsectionOrder(category, b)
                    if (orderA !== orderB) return orderA - orderB
                    
                    // Otherwise sort alphabetically
                    return a.localeCompare(b)
                  })
                  .map(([subcategory, docs]) => {
                  if (subcategory === '_root') {
                    // Sort documents by order field
                    const sortedDocs = [...docs].sort((a, b) => {
                      const orderA = getDocOrder(a)
                      const orderB = getDocOrder(b)
                      if (orderA !== orderB) return orderA - orderB
                      return a.title.localeCompare(b.title)
                    })
                    
                    return (
                      <div key={subcategory} className="ml-2 space-y-0.5">
                        {sortedDocs.map((doc) => (
                          <Link
                            key={doc._id}
                            href={doc.url}
                            className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-200 ${
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
                            <span className="truncate text-sm">{doc.title}</span>
                          </Link>
                        ))}
                      </div>
                    )
                  }

                  const isSubcategoryActive = docs.some((doc) => pathname === doc.url)

                  // Sort documents by order field
                  const sortedDocs = [...docs].sort((a, b) => {
                    const orderA = getDocOrder(a)
                    const orderB = getDocOrder(b)
                    if (orderA !== orderB) return orderA - orderB
                    return a.title.localeCompare(b.title)
                  })
                  
                  return (
                    <CollapsibleSection
                      key={subcategory}
                      title={subcategory}
                      defaultOpen={isSubcategoryActive}
                      isSubsection={true}
                    >
                      <div className="ml-2 space-y-0.5">
                        {sortedDocs.map((doc) => (
                          <Link
                            key={doc._id}
                            href={doc.url}
                            className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-200 ${
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
                            <span className="truncate text-sm">{doc.title}</span>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleSection>
                  )
                })}
              </CollapsibleSection>
            )
          }

          // No subcategories, just show docs directly as a collapsible section
          const hasDocs = Object.values(subcategories).flat().length > 0
          if (hasDocs) {
            const isCategoryActive = Object.values(subcategories)
              .flat()
              .some((doc) => pathname === doc.url)
            
            // Check if overview page exists for this category
            const overviewDoc = allDocs.find((doc) => doc.slug === `${category}/overview`)
            const categoryUrl = overviewDoc?.url || null
            
            // Sort documents by order field
            const allCategoryDocs = Object.values(subcategories).flat()
            const sortedCategoryDocs = [...allCategoryDocs].sort((a, b) => {
              const orderA = getDocOrder(a)
              const orderB = getDocOrder(b)
              if (orderA !== orderB) return orderA - orderB
              return a.title.localeCompare(b.title)
            })
            
            return (
              <CollapsibleSection
                key={category}
                title={category}
                defaultOpen={isCategoryActive}
                titleLink={categoryUrl}
                isSubsection={false}
              >
                <div className="ml-2 space-y-0.5">
                  {sortedCategoryDocs.map((doc) => (
                    <Link
                      key={doc._id}
                      href={doc.url}
                      className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-200 ${
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
                      <span className="truncate text-sm">{doc.title}</span>
                    </Link>
                  ))}
                </div>
              </CollapsibleSection>
            )
          }
          
          return null
        })}
      </nav>
    </aside>
  )
}

