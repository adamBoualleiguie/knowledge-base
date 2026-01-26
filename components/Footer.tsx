'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()
  
  // Determine basePath dynamically
  const basePath = pathname.startsWith('/knowledge-base') ? '/knowledge-base' : ''

  return (
    <footer className="border-t border-border/40 mt-auto bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Knowledge Base</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
            Personal hub showcasing DevOps & SysOps mastery.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href={`${basePath}/`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/docs`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href={`${basePath}/blog`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Connect</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="https://github.com/adamBoualleiguie" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/boualleiguie-adam-isslem-98a1111b1/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Adam Boualleiguie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

