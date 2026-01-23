'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { DocsSearchBar } from './DocsSearchBar'

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

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/docs', label: 'Documentation' },
    { href: '/blog', label: 'Blog' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center gap-6">
          {/* Left side: Logo and Navigation */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:from-primary/80 hover:to-primary/40 transition-all"
            >
              Portfolio
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 relative ${
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
          </div>

          {/* Centered Search Bar */}
          {docs.length > 0 && (
            <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2 w-full max-w-lg">
              <DocsSearchBar docs={docs} />
            </div>
          )}

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-4 ml-auto flex-shrink-0">
            <a
              href="/assets/general/pdfs/cv.pdf"
              download
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Download CV
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 flex-shrink-0"
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            {/* Mobile Search Bar */}
            {docs.length > 0 && (
              <div className="mb-4 px-2">
                <DocsSearchBar docs={docs} />
              </div>
            )}
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
              href="/assets/general/pdfs/cv.pdf"
              download
              className="block mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download CV
            </a>
            <div className="mt-4 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

