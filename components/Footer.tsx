'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function Footer() {
  const pathname = usePathname()
  
  // Determine basePath dynamically
  const basePath = pathname.startsWith('/knowledge-base') ? '/knowledge-base' : ''

  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const hasAnimatedRef = useRef(false)
  const footerRef = useRef<HTMLDivElement>(null)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find if any part of the footer is intersecting
        const isVisible = entries.some(entry => entry.isIntersecting)
        
        if (isVisible) {
          if (!hasAnimatedRef.current) {
            hasAnimatedRef.current = true
            
            // Start the wave animation (left to right, then right to left)
            const sequence = [0, 1, 2, 3, 4, 3, 2, 1, 0]
            
            sequence.forEach((iconIndex, step) => {
              setTimeout(() => {
                if (!isHoveredRef.current) {
                  setActiveIndex(iconIndex)
                }
              }, step * 300) // 300ms per step
            })

            // Clear active index after the last animation
            setTimeout(() => {
              if (!isHoveredRef.current) {
                setActiveIndex(-1)
              }
            }, sequence.length * 300)
          }
        } else {
          // Only reset if completely out of view
          hasAnimatedRef.current = false
          setActiveIndex(-1)
        }
      },
      // Lower threshold so it triggers earlier on long pages
      // and add rootMargin so it triggers slightly before entering viewport
      { 
        threshold: 0.1,
        rootMargin: '50px' 
      }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleMouseEnter = () => {
    isHoveredRef.current = true
    setActiveIndex(-1)
  }

  const socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/adamBoualleiguie',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      activeClasses: "border-foreground/50 bg-foreground/5 text-foreground shadow-md -translate-y-1",
      hoverClasses: "hover:border-foreground/50 hover:bg-foreground/5 hover:text-foreground"
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/boualleiguieadam/',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      activeClasses: "border-[#0A66C2]/50 bg-[#0A66C2]/10 text-[#0A66C2] shadow-md -translate-y-1",
      hoverClasses: "hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
    },
    {
      name: 'Credly',
      url: 'https://www.credly.com/users/adam-boualleiguie/badges#credly',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0L1.604 6v12L12 24l10.396-6V6L12 0zm0 2.14l8.528 4.924-4.887 2.822L12 7.783l-3.641 2.103-4.887-2.822L12 2.14zm-9.458 6.4l3.968 2.29-3.968 2.29V8.54zm9.458 13.32l-8.528-4.924 4.887-2.822L12 16.217l3.641-2.103 4.887 2.822-8.528 4.924zm9.458-6.4l-3.968-2.29 3.968-2.29v4.58z"/>
        </svg>
      ),
      activeClasses: "border-[#FF6B00]/50 bg-[#FF6B00]/10 text-[#FF6B00] shadow-md -translate-y-1",
      hoverClasses: "hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]"
    },
    {
      name: 'Upwork',
      url: 'https://www.upwork.com/freelancers/~010ba71237624305d2?mp_source=share',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.48,6.06c-2.07,0-3.64,1.07-4.48,2.77V6.37h-2.5v7.65c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5V6.37H1v7.65c0,3.31,2.69,6,6,6s6-2.69,6-6v-1.63c.69,1.25,2.16,2.68,4.18,2.68,3.22,0,5.82-2.58,5.82-6.06S20.7,6.06,17.48,6.06Zm0,9.62c-1.88,0-3.32-1.5-3.32-3.56s1.44-3.56,3.32-3.56,3.32,1.5,3.32,3.56-1.44,3.56-3.32,3.56Z" />
        </svg>
      ),
      activeClasses: "border-[#14A800]/50 bg-[#14A800]/10 text-[#14A800] shadow-md -translate-y-1",
      hoverClasses: "hover:border-[#14A800]/50 hover:bg-[#14A800]/10 hover:text-[#14A800]"
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/21626999276?text=Hello%20Adam%20%2C%20I%20saw%20your%20amazing%20portfolio%20and%20would%20love%20to%20connect%21',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.031 0C5.385 0 0 5.386 0 12.035c0 2.128.552 4.205 1.6 6.027L.17 23.3l5.4-1.411c1.766.953 3.753 1.455 5.766 1.455 6.645 0 12.03-5.385 12.03-12.033C23.366 5.386 17.98 0 12.031 0zm0 21.365c-1.802 0-3.567-.485-5.116-1.4l-.367-.217-3.8.993 1.01-3.705-.238-.38c-1.002-1.597-1.53-3.447-1.53-5.351 0-5.545 4.512-10.057 10.06-10.057 5.548 0 10.06 4.512 10.06 10.057 0 5.546-4.512 10.06-10.06 10.06zm5.518-7.53c-.303-.151-1.792-.885-2.07-.987-.278-.102-.48-.152-.682.152-.202.303-.783.987-.96 1.19-.177.202-.354.227-.657.076-1.402-.71-2.457-1.341-3.4-2.827-.177-.278-.019-.429.132-.58.136-.137.303-.354.454-.53.152-.177.202-.303.303-.505.101-.202.051-.38-.025-.53-.076-.152-.682-1.644-.935-2.25-.246-.593-.497-.512-.682-.52-.177-.008-.38-.01-.582-.01-.202 0-.53.076-.808.38-.278.303-1.06 1.037-1.06 2.528 0 1.49 1.086 2.932 1.238 3.134.152.202 2.14 3.266 5.183 4.56.723.307 1.288.49 1.728.627.725.226 1.385.194 1.905.117.584-.086 1.792-.733 2.045-1.44.253-.707.253-1.314.177-1.44-.076-.127-.278-.203-.58-.354z" />
        </svg>
      ),
      activeClasses: "border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] shadow-md -translate-y-1",
      hoverClasses: "hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366]"
    }
  ]

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
              <li>
                <Link href={`${basePath}/certifications`} className="text-muted-foreground hover:text-foreground transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-lg">Connect</h3>
            <div className="flex flex-wrap gap-4" onMouseEnter={handleMouseEnter} onTouchStart={handleMouseEnter} ref={footerRef}>
              {socialLinks.map((link, index) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-2.5 bg-background border rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                    activeIndex === index 
                      ? link.activeClasses 
                      : `border-border text-muted-foreground shadow-sm ${link.hoverClasses}`
                  }`}
                  aria-label={link.name}
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Adam Boualleiguie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

