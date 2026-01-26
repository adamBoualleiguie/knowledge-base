'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DocsSearchBar } from './DocsSearchBar'

// Get basePath from Next.js config (for static export)
const getBasePath = () => {
  // In browser, check if we're in a subdirectory
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    // If path starts with /knowledge-base, return it
    if (path.startsWith('/knowledge-base')) {
      return '/knowledge-base'
    }
  }
  return ''
}

interface Doc {
  title: string
  url: string
  slug: string
  description?: string
}

interface NavigationProps {
  docs?: Doc[]
}

export function Navigation({ docs = [] }: NavigationProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [basePath, setBasePath] = useState('')

  useEffect(() => {
    setBasePath(getBasePath())
  }, [])

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/docs', label: 'Documentation' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center gap-4">
          {/* Left side: Logo - Always visible */}
          <div className="flex items-center flex-shrink-0">
            <Link 
              href="/" 
              className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all whitespace-nowrap"
            >
              Knowledge Base
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on smaller screens to prevent overlap with search */}
          <div className="hidden xl:flex items-center gap-6 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 relative whitespace-nowrap ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Centered Search Bar - Always visible, adjusts position and size based on screen */}
          {docs.length > 0 && (
            <>
              {/* Desktop/Tablet Search - Hidden on mobile */}
              <div className="hidden sm:flex items-center justify-center flex-1 min-w-0 mx-4">
                <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
                  <DocsSearchBar docs={docs} />
                </div>
              </div>
              {/* Mobile Search - Visible only on mobile, in header */}
              <div className="flex sm:hidden items-center flex-1 min-w-0 mx-2">
                <DocsSearchBar docs={docs} />
              </div>
            </>
          )}

          {/* Right side actions - Responsive visibility */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto flex-shrink-0">
            {/* Download CV - Hidden on small screens, visible on lg+ */}
            <a
              href={`${basePath}/assets/general/pdfs/AdamBoualleiguie.pdf`}
              download
              className="hidden lg:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              Download CV
            </a>
            {/* Theme Toggle - Always visible */}
            <ThemeToggle />
            {/* Mobile Menu Button - Only on mobile */}
            <button
              className="sm:hidden p-2 flex-shrink-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Only shows nav items and Download CV */}
        {mobileMenuOpen && (
          <div className="sm:hidden py-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`${basePath}/assets/general/pdfs/cv.pdf`}
              download
              className="block mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download CV
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

