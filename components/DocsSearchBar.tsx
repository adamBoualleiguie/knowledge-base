'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

interface SearchResult {
  title: string
  url: string
  slug: string
  description?: string
  snippet?: string
}

interface Doc {
  title: string
  url: string
  slug: string
  description?: string
  content?: string
}

interface DocsSearchBarProps {
  docs: Doc[]
}

export function DocsSearchBar({ docs }: DocsSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Ensure component is mounted (for portal)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const lowerQuery = searchQuery.toLowerCase()
    const scoredResults: Array<SearchResult & { score: number }> = []

    docs.forEach((doc) => {
      const title = doc.title.toLowerCase()
      const description = doc.description?.toLowerCase() || ''
      const slug = doc.slug.toLowerCase()
      const content = doc.content?.toLowerCase() || ''

      let score = 0

      // Strong weight for title matches
      if (title === lowerQuery) score += 120
      else if (title.startsWith(lowerQuery)) score += 80
      else if (title.includes(lowerQuery)) score += 60

      // Medium weight for description and slug
      if (description.includes(lowerQuery)) score += 25
      if (slug.includes(lowerQuery)) score += 20

      // Lower, but still meaningful, weight for body content matches
      let snippet: string | undefined
      const contentIndex = content.indexOf(lowerQuery)
      if (contentIndex !== -1) {
        score += 30

        // Build a human-readable snippet around the first match
        const originalContent = doc.content || ''
        const start = Math.max(0, contentIndex - 60)
        const end = Math.min(originalContent.length, contentIndex + lowerQuery.length + 80)
        let rawSnippet = originalContent.slice(start, end).replace(/\s+/g, ' ')

        if (start > 0) rawSnippet = '… ' + rawSnippet
        if (end < originalContent.length) rawSnippet = rawSnippet + ' …'
        snippet = rawSnippet
      }

      if (score > 0) {
        scoredResults.push({
          title: doc.title,
          url: doc.url,
          slug: doc.slug,
          description: doc.description,
          snippet,
          score,
        })
      }
    })

    // Sort by descending score (higher score = more relevant)
    scoredResults.sort((a, b) => b.score - a.score)

    // Strip score before putting into state
    const finalResults: SearchResult[] = scoredResults.slice(0, 10).map(({ score, ...rest }) => rest)

    setResults(finalResults) // Limit to 10 results
    setSelectedIndex(0)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timeoutId = setTimeout(() => {
      performSearch(query)
    }, 200)

    return () => clearTimeout(timeoutId)
  }, [query, isOpen, performSearch])

  // Keyboard shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || results.length === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        router.push(results[selectedIndex].url)
        setIsOpen(false)
        setQuery('')
        setResults([])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, router])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Format breadcrumb from slug
  const formatBreadcrumb = (slug: string) => {
    const parts = slug.split('/')
    return parts.join(' › ')
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <>
      {/* Render modal as portal to body - ensures it's always on top and centered */}
      {mounted && isOpen && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: 9999
          }}
          onClick={(e) => {
            // Close if clicking on the overlay itself, not the search container
            if (e.target === e.currentTarget) {
              setIsOpen(false)
              setQuery('')
              setResults([])
            }
          }}
        >
          {/* Centered Search Container */}
          <div 
            className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden"
            style={{ maxHeight: '80vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search docs..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              {query && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setQuery('')
                    setResults([])
                    inputRef.current?.focus()
                  }}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  setQuery('')
                  setResults([])
                }}
                className="text-xs text-muted-foreground border border-border rounded px-2 py-1 hover:bg-muted transition-colors"
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            {/* Results Dropdown */}
            <div
              ref={resultsRef}
              className="max-h-[60vh] overflow-y-auto"
            >
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={result.url}
                      onClick={() => handleResultClick(result.url)}
                      className={`w-full text-left px-4 py-3 hover:bg-accent transition-colors cursor-pointer ${
                        index === selectedIndex ? 'bg-accent' : ''
                      }`}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="text-sm font-medium text-foreground mb-0.5">
                        {result.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatBreadcrumb(result.slug)}
                      </div>
                      {result.snippet && (
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {result.snippet}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No results found
                </div>
              ) : (
                <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Search Bar Trigger (always visible) */}
      {!isOpen && (
        <div className="relative z-50 w-full">
          <div
            className="relative flex items-center gap-3 px-4 py-3 rounded-full border transition-all duration-200 bg-muted/50 border-border hover:border-primary/30 hover:bg-muted"
            style={{ height: '40px' }}
            onClick={() => setIsOpen(true)}
          >
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="flex-1 text-sm text-muted-foreground cursor-pointer">
              Search docs...
            </span>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
              <kbd className="font-mono text-[10px]">⌘</kbd>
              <kbd className="font-mono text-[10px]">K</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

