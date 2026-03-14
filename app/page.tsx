'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { allBlogs, allDocs, allCertifications } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { Typewriter } from 'react-simple-typewriter'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Highlight } from '@/components/Highlight'
import { getBlogTagColor } from '@/lib/tag-colors'
import { CertImage } from '@/components/CertImage'
import { ScrollIndicator } from '@/components/ScrollIndicator'
import { useHero } from '@/components/HeroContext'

// Vanta NET colors: black bg (0x0) + site orange (0xff823f / #ff823f)
const VANTA_COLOR = 0xff823f
const VANTA_BG = 0x0

const HERO_SEEN_KEY = 'hero-animation-seen'

function hasSeenHero(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return sessionStorage.getItem(HERO_SEEN_KEY) === 'true'
  } catch {
    return false
  }
}

// basePath from next.config (for static export / GitHub Pages)
const BASE_PATH = '/knowledge-base'

/**
 * Helper to extract section and subsection from a slug
 */
function getDocSectionInfo(slug: string): { section: string | null; subsection: string | null } {
  const parts = slug.split('/')
  const section = parts[0] || null
  const subsection = parts.length > 1 && parts[1] !== 'overview' ? parts[1] : null
  return { section, subsection }
}

/**
 * Convert normalized slug (with hyphens) to readable display name (with spaces)
 */
function formatDisplayName(slug: string): string {
  return slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

/**
 * Get color classes for section tags
 */
function getSectionColor(section: string): string {
  const colorMap: Record<string, string> = {
    'Documentation-guide': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'Knowledge-base': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }
  return colorMap[section] || 'bg-muted text-muted-foreground border-border'
}

/**
 * Get color classes for subsection tags
 */
function getSubsectionColor(section: string, subsection: string | null): string {
  if (!subsection) return ''

  const colorMap: Record<string, Record<string, string>> = {
    'Documentation-guide': {
      'overview': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      'getting-started': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      'adding-content': 'bg-green-500/10 text-green-400 border-green-500/30',
      'features': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      'customization': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      'deployment': 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    'Knowledge-base': {
      'overview': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      'foundations': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      'platforms': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      'projects': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      'architectures': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      'cicd': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      'cloud': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      'toolbox': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      'notes-and-deep-dives': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
  }

  return colorMap[section]?.[subsection] || 'bg-muted text-muted-foreground border-border'
}

export default function Home() {
  // Get latest 3 blogs sorted by updatedAt or publishedAt (latest first)
  const latestBlogs = allBlogs
    .sort((a, b) => {
      // Use updatedAt if available, otherwise fall back to publishedAt
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.publishedAt)
      return compareDesc(dateA, dateB)
    })
    .slice(0, 3)

  // Get latest 3 docs sorted by updatedAt or publishedAt (latest first)
  const latestDocs = allDocs
    .sort((a, b) => {
      // Use updatedAt if available, otherwise fall back to publishedAt
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.publishedAt)
      return compareDesc(dateA, dateB)
    })
    .slice(0, 3)

  // Get latest 3 certifications sorted by issueDate
  const latestCerts = [...allCertifications]
    .sort((a, b) => {
      const dateA = new Date(a.issueDate)
      const dateB = new Date(b.issueDate)
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 3)

  // Skip animation if user already saw it this session. Only check after mount to avoid hydration mismatch.
  const [skipAnimation, setSkipAnimation] = useState(false)

  // Enhanced state sequence: Hi → Name → Title → Value Statement → CTAs → Why → About → Skills → Certs → Docs → Blog → Recruiter
  // Initial state always matches server (first-time) to prevent hydration errors
  const [showHi, setShowHi] = useState(true)
  const [showName, setShowName] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showValueStatement, setShowValueStatement] = useState(false)
  const [showCTAs, setShowCTAs] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const [showCerts, setShowCerts] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showBlog, setShowBlog] = useState(false)
  const [showRecruiter, setShowRecruiter] = useState(false)
  const [showConnect, setShowConnect] = useState(false)
  
  // Connect Animation state
  const [activeConnectIndex, setActiveConnectIndex] = useState<number>(-1)
  const isConnectHoveredRef = useRef(false)

  // Vanta NET 3D background (dark theme only)
  const vantaRef = useRef<HTMLDivElement>(null)
  const vantaEffectRef = useRef<{ destroy: () => void } | null>(null)
  const [vantaReady, setVantaReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = mounted && resolvedTheme === 'dark'

  // Avoid hydration mismatch: theme is only known after client mount
  useEffect(() => setMounted(true), [])

  const { setHeroComplete } = useHero()

  // Check sessionStorage after mount (client-only) to skip animation for returning visitors.
  // Must run after hydration to avoid server/client mismatch.
  useLayoutEffect(() => {
    if (hasSeenHero()) {
      setSkipAnimation(true)
      setShowHi(false)
      setShowName(true)
      setShowTitle(true)
      setShowValueStatement(true)
      setShowCTAs(true)
      setShowConnect(true)
      setShowWhy(true)
      setShowAbout(true)
      setShowSkills(true)
      setShowCerts(true)
      setShowDocs(true)
      setShowBlog(true)
      setShowRecruiter(true)
    }
  }, [])

  // Hide navbar on home mount (before paint), show when scroll enabled. Skip if returning visitor.
  useLayoutEffect(() => {
    if (skipAnimation) {
      setHeroComplete(true) // show navbar immediately when skipping
    } else {
      setHeroComplete(false)
    }
    return () => setHeroComplete(true) // show navbar when navigating away
  }, [setHeroComplete, skipAnimation])

  // Show navbar when scroll indicator appears (showConnect)
  useEffect(() => {
    if (showConnect) setHeroComplete(true)
  }, [showConnect, setHeroComplete])

  // Block scroll until hero sequence finishes (Let's Connect appears at 8.5s)
  useEffect(() => {
    if (showConnect) {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      return
    }
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
    }
  }, [showConnect])

  // Vanta scripts load in layout and persist across navigation — check on mount or listen for ready event
  useEffect(() => {
    if (typeof window === 'undefined') return
    const win = window as Window & { VANTA?: { NET: (opts: Record<string, unknown>) => { destroy: () => void } } }
    if (win.VANTA?.NET) {
      setVantaReady(true)
      return
    }
    const onReady = () => setVantaReady(true)
    window.addEventListener('vanta-ready', onReady)
    return () => window.removeEventListener('vanta-ready', onReady)
  }, [])

  useEffect(() => {
    if (showConnect) {
      // Start the wave animation (left to right, then right to left)
      const sequence = [0, 1, 2, 3, 4, 3, 2, 1, 0]
      
      sequence.forEach((iconIndex, step) => {
        setTimeout(() => {
          if (!isConnectHoveredRef.current) {
            setActiveConnectIndex(iconIndex)
          }
        }, step * 300) // 300ms per step
      })

      // Clear active index after the last animation
      setTimeout(() => {
        if (!isConnectHoveredRef.current) {
          setActiveConnectIndex(-1)
        }
      }, sequence.length * 300)
    }
  }, [showConnect])

  // Initialize Vanta NET only in dark theme; destroy when switching to light
  useEffect(() => {
    if (!isDark) {
      vantaEffectRef.current?.destroy?.()
      vantaEffectRef.current = null
      return
    }
    if (!vantaReady || !vantaRef.current || typeof window === 'undefined') return
    const win = window as Window & { VANTA?: { NET: (opts: Record<string, unknown>) => { destroy: () => void } } }
    if (!win.VANTA?.NET) return

    vantaEffectRef.current?.destroy?.()
    const effect = win.VANTA.NET({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
      color: VANTA_COLOR,
      backgroundColor: VANTA_BG,
      points: 7,
      maxDistance: 18,
      spacing: 18,
    })
    vantaEffectRef.current = effect

    return () => {
      effect?.destroy?.()
      vantaEffectRef.current = null
    }
  }, [vantaReady, isDark])

  // Run animation sequence only for first-time visitors
  useEffect(() => {
    if (skipAnimation) return

    const hiTimeout = setTimeout(() => {
      setShowHi(false)
      setShowName(true)
    }, 2000) // Hi displays 2s

    const titleTimeout = setTimeout(() => {
      setShowTitle(true)
    }, 4500) // After name typing completes

    const valueTimeout = setTimeout(() => {
      setShowValueStatement(true)
    }, 6000) // Value statement appears

    const ctaTimeout = setTimeout(() => {
      setShowCTAs(true)
    }, 7500) // CTAs appear

    const connectTimeout = setTimeout(() => {
      setShowConnect(true)
    }, 8500) // Connect section appears right after CTAs

    const whyTimeout = setTimeout(() => {
      setShowWhy(true)
    }, 9500) // Why section appears

    const aboutTimeout = setTimeout(() => {
      setShowAbout(true)
    }, 11500) // About section appears

    const skillsTimeout = setTimeout(() => {
      setShowSkills(true)
    }, 12500) // Skills section appears

    const certsTimeout = setTimeout(() => {
      setShowCerts(true)
    }, 13500) // Certs section appears

    const docsTimeout = setTimeout(() => {
      setShowDocs(true)
    }, 14500) // Docs section appears

    const blogTimeout = setTimeout(() => {
      setShowBlog(true)
    }, 15500) // Blog section appears

    const recruiterTimeout = setTimeout(() => {
      setShowRecruiter(true)
    }, 16500) // Recruiter section appears

    return () => {
      clearTimeout(hiTimeout)
      clearTimeout(titleTimeout)
      clearTimeout(valueTimeout)
      clearTimeout(ctaTimeout)
      clearTimeout(connectTimeout)
      clearTimeout(whyTimeout)
      clearTimeout(aboutTimeout)
      clearTimeout(skillsTimeout)
      clearTimeout(certsTimeout)
      clearTimeout(docsTimeout)
      clearTimeout(blogTimeout)
      clearTimeout(recruiterTimeout)
    }
  }, [skipAnimation])

  // Mark hero as seen when animation completes (enables skip on return)
  useEffect(() => {
    if (showConnect && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(HERO_SEEN_KEY, 'true')
      } catch {
        // ignore
      }
    }
  }, [showConnect])

  return (
    <div className="flex flex-col">
      {/* ================= HERO + CONNECT ================= */}
      <div
        className={`relative min-h-[100dvh] min-h-screen flex flex-col overflow-hidden ${
          isDark ? '' : 'bg-background'
        }`}
      >
        {/* Scroll-down indicator (visible when scroll enabled) */}
        <ScrollIndicator visible={showConnect} />

        {/* Vanta NET 3D animated background — dark theme only */}
        {isDark && (
          <>
            <div ref={vantaRef} className="absolute inset-0 z-0" aria-hidden="true" />
            <div
              className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_80%_70%_at_50%_45%,transparent_0%,rgba(0,0,0,0.15)_40%,rgba(0,0,0,0.35)_100%)]"
              aria-hidden="true"
            />
          </>
        )}

        {/* Content above Vanta */}
        <div className="relative z-10 flex flex-1 flex-col justify-center container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          {/* Hi + waving hand */}
          {showHi && (
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in">
              Hi{' '}
              <span className="inline-block animate-wave origin-bottom-right">👋</span>
            </h1>
          )}

          {/* Typed Name - vibrant orange, floats above glass */}
          {showName && (
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6
                       bg-gradient-to-r from-primary via-primary/90 to-primary/70
                       bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,130,63,0.5)]
                       animate-fade-in">
              {skipAnimation ? (
                "I'm Adam Boualleiguie"
              ) : (
                <Typewriter
                  words={["I'm Adam Boualleiguie"]}
                  cursor
                  cursorStyle="▍"
                  typeSpeed={70}
                />
              )}
            </h2>
          )}

          {/* Glass container: frosted panel behind text for readability */}
          {(showTitle || showValueStatement || showCTAs || showConnect) && (
          <div
            className="mx-auto w-full max-w-4xl rounded-2xl sm:rounded-3xl px-6 sm:px-10 py-8 sm:py-10
                       backdrop-blur-xl bg-black/5 border border-white/5
                       shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
                       animate-fade-in"
          >
            {/* Enhanced Title with scope */}
            {showTitle && (
              <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-xl sm:text-2xl text-foreground/95 mb-1 sm:mb-2 max-w-4xl mx-auto leading-relaxed">
                  DevOps · DevSecOps · SysOps Engineer
                </p>
                <p className="text-base sm:text-lg text-foreground/90 mb-4 sm:mb-6 max-w-3xl mx-auto">
                  Building, operating, and documenting production systems
                </p>
              </div>
            )}

            {/* Core Value Statement (CRITICAL) */}
            {showValueStatement && (
              <div className="animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '300ms' }}>
                <p className="text-lg sm:text-xl text-foreground mb-3 sm:mb-4 leading-relaxed font-medium">
                  I design, operate, and secure production-grade infrastructures — and I document everything I learn.
                </p>
                <p className="text-base sm:text-lg text-foreground/95 leading-relaxed">
                  This website is my <span className="text-primary font-medium">living knowledge base</span>: real-world DevOps and DevSecOps practices, architecture decisions, experiments, failures, and continuous learning from production environments.
                </p>
              </div>
            )}

            {/* CTAs */}
            {showCTAs && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <Link
                  href="/docs"
                  className="px-8 py-3.5 bg-primary text-primary-foreground rounded-lg
                           hover:bg-primary/90 transition-all duration-300 font-medium
                           shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                           relative overflow-hidden group"
                >
                  <span className="relative z-10">Explore the Knowledge Base</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 
                                translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </Link>

                <Link
                  href="/certifications"
                  className="px-8 py-3.5 border-2 border-primary/50 text-foreground rounded-lg
                           hover:bg-primary/10 transition-all duration-300 font-medium
                           shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                           relative overflow-hidden group"
                >
                  <span className="relative z-10">Career & Certifications</span>
                </Link>

                <a
                  href={`${BASE_PATH}/assets/general/pdfs/AdamBoualleiguie.pdf`}
                  download
                  className="px-8 py-3.5 border-2 border-border rounded-lg
                           hover:bg-accent transition-all duration-300 font-medium
                           hover:border-primary/50 hover:scale-105 active:scale-95"
                >
                  Download CV
                </a>
              </div>
            )}

            {/* Microtext under CTAs - reduced spacing before Let's Connect */}
            {showCTAs && (
              <p className="text-xs sm:text-sm text-foreground/90 mt-3 sm:mt-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
                <em>Everything here reflects how I work in real environments.</em>
              </p>
            )}

            {/* Let's Connect - tight spacing after microtext */}
            {showConnect && (
              <div className="mt-4 sm:mt-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <h3 className="text-xl font-medium mb-4 sm:mb-5 text-foreground/95">Let's Connect</h3>
              <div
                className="flex flex-wrap gap-4 sm:gap-6 justify-center"
                onMouseEnter={() => {
                  isConnectHoveredRef.current = true
                  setActiveConnectIndex(-1)
                }}
                onTouchStart={() => {
                  isConnectHoveredRef.current = true
                  setActiveConnectIndex(-1)
                }}
              >
              {[
                {
                  name: 'GitHub',
                  url: 'https://github.com/adamBoualleiguie',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  ),
                  activeClasses: "border-foreground/50 bg-foreground/5 text-foreground shadow-[0_0_15px_rgba(255,255,255,0.5)] -translate-y-2 scale-110",
                  hoverClasses: "hover:border-foreground/50 hover:bg-foreground/5 hover:text-foreground hover:-translate-y-2 hover:scale-110"
                },
                {
                  name: 'LinkedIn',
                  url: 'https://www.linkedin.com/in/boualleiguieadam/',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                    </svg>
                  ),
                  activeClasses: "border-[#0A66C2]/50 bg-[#0A66C2]/10 text-[#0A66C2] shadow-[0_0_15px_rgba(10,102,194,0.5)] -translate-y-2 scale-110",
                  hoverClasses: "hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] hover:-translate-y-2 hover:scale-110"
                },
                {
                  name: 'Credly',
                  url: 'https://www.credly.com/users/adam-boualleiguie/badges#credly',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0L1.604 6v12L12 24l10.396-6V6L12 0zm0 2.14l8.528 4.924-4.887 2.822L12 7.783l-3.641 2.103-4.887-2.822L12 2.14zm-9.458 6.4l3.968 2.29-3.968 2.29V8.54zm9.458 13.32l-8.528-4.924 4.887-2.822L12 16.217l3.641-2.103 4.887 2.822-8.528 4.924zm9.458-6.4l-3.968-2.29 3.968-2.29v4.58z"/>
                    </svg>
                  ),
                  activeClasses: "border-[#FF6B00]/50 bg-[#FF6B00]/10 text-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.5)] -translate-y-2 scale-110",
                  hoverClasses: "hover:border-[#FF6B00]/50 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00] hover:-translate-y-2 hover:scale-110"
                },
                {
                  name: 'Upwork',
                  url: 'https://www.upwork.com/freelancers/~010ba71237624305d2?mp_source=share',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.48,6.06c-2.07,0-3.64,1.07-4.48,2.77V6.37h-2.5v7.65c0,1.93-1.57,3.5-3.5,3.5s-3.5-1.57-3.5-3.5V6.37H1v7.65c0,3.31,2.69,6,6,6s6-2.69,6-6v-1.63c.69,1.25,2.16,2.68,4.18,2.68,3.22,0,5.82-2.58,5.82-6.06S20.7,6.06,17.48,6.06Zm0,9.62c-1.88,0-3.32-1.5-3.32-3.56s1.44-3.56,3.32-3.56,3.32,1.5,3.32,3.56-1.44,3.56-3.32,3.56Z" />
                    </svg>
                  ),
                  activeClasses: "border-[#14A800]/50 bg-[#14A800]/10 text-[#14A800] shadow-[0_0_15px_rgba(20,168,0,0.5)] -translate-y-2 scale-110",
                  hoverClasses: "hover:border-[#14A800]/50 hover:bg-[#14A800]/10 hover:text-[#14A800] hover:-translate-y-2 hover:scale-110"
                },
                {
                  name: 'WhatsApp',
                  url: 'https://wa.me/21626999276?text=Hello%20Adam%20%2C%20I%20saw%20your%20amazing%20portfolio%20and%20would%20love%20to%20connect%21',
                  icon: (
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12.031 0C5.385 0 0 5.386 0 12.035c0 2.128.552 4.205 1.6 6.027L.17 23.3l5.4-1.411c1.766.953 3.753 1.455 5.766 1.455 6.645 0 12.03-5.385 12.03-12.033C23.366 5.386 17.98 0 12.031 0zm0 21.365c-1.802 0-3.567-.485-5.116-1.4l-.367-.217-3.8.993 1.01-3.705-.238-.38c-1.002-1.597-1.53-3.447-1.53-5.351 0-5.545 4.512-10.057 10.06-10.057 5.548 0 10.06 4.512 10.06 10.057 0 5.546-4.512 10.06-10.06 10.06zm5.518-7.53c-.303-.151-1.792-.885-2.07-.987-.278-.102-.48-.152-.682.152-.202.303-.783.987-.96 1.19-.177.202-.354.227-.657.076-1.402-.71-2.457-1.341-3.4-2.827-.177-.278-.019-.429.132-.58.136-.137.303-.354.454-.53.152-.177.202-.303.303-.505.101-.202.051-.38-.025-.53-.076-.152-.682-1.644-.935-2.25-.246-.593-.497-.512-.682-.52-.177-.008-.38-.01-.582-.01-.202 0-.53.076-.808.38-.278.303-1.06 1.037-1.06 2.528 0 1.49 1.086 2.932 1.238 3.134.152.202 2.14 3.266 5.183 4.56.723.307 1.288.49 1.728.627.725.226 1.385.194 1.905.117.584-.086 1.792-.733 2.045-1.44.253-.707.253-1.314.177-1.44-.076-.127-.278-.203-.58-.354z" />
                    </svg>
                  ),
                  activeClasses: "border-[#25D366]/50 bg-[#25D366]/10 text-[#25D366] shadow-[0_0_15px_rgba(37,211,102,0.5)] -translate-y-2 scale-110",
                  hoverClasses: "hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:-translate-y-2 hover:scale-110"
                }
              ].map((link, index) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-3 sm:p-4 bg-background border rounded-xl transition-all duration-300 shadow-sm group ${
                    activeConnectIndex === index 
                      ? link.activeClasses 
                      : `border-border text-muted-foreground ${link.hoverClasses}`
                  }`}
                  aria-label={link.name}
                  title={link.name}
                >
                  <div className="transition-transform duration-300">
                    {link.icon}
                  </div>
                </a>
              ))}
              </div>
            </div>
          )}
          </div>
          )}
        </div>
      </div>

      {/* ================= WHY THIS SITE EXISTS ================= */}
      {showWhy && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="p-8 sm:p-10 border border-border rounded-2xl bg-card/50 backdrop-blur-sm
                          hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
                Why this site exists
              </h2>
              
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-base sm:text-lg">
                  I created this platform <Highlight color="blue">to document my professional journey as a DevOps / DevSecOps engineer</Highlight>.
                </p>
                
                <p className="text-base sm:text-lg">
                  Every guide, article, and document here is based on hands-on work: systems I've built, operated, secured, debugged, and improved in production.
                </p>
                
                <p className="text-base sm:text-lg font-medium text-foreground/90">
                  I believe good engineers don't just solve problems — they <span className="text-primary">capture knowledge, share it, and refine it over time</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      {showAbout && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Engineer by Practice, Learner by Nature
            </h2>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-base sm:text-lg">
                I'm a engineer with strong hands-on experience in automating, managing, and securing complex systems — from bare-metal and hypervisors to cloud-native and Kubernetes-based platforms.
              </p>
              
              <p className="text-base sm:text-lg">
                I enjoy the full IT spectrum: performance tuning, CI/CD architecture, GitOps workflows, Kubernetes operations, and security-first system design. Everything you see here is built from real production experience.
              </p>
              
              <div className="mt-8 p-6 border-l-4 border-primary/50 bg-muted/30 rounded-r-lg">
                <p className="text-base sm:text-lg text-foreground/90 italic">
                  What defines my work is not just the tools I use, but how I approach systems: designing for failure, automating everything repeatable, documenting decisions, and building with security and reliability as first-class concerns.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= HOW I WORK IN PRODUCTION ================= */}
      {showSkills && (
        <section className="bg-muted/30 py-16 sm:py-20 animate-fade-in">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              How I Work in Production
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Engineering focus areas — outcomes and approaches from real production environments
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'CI/CD & Automation',
                  desc: 'Designing resilient pipelines that handle monorepos, multi-platform builds, and self-hosted runners. Focus on reducing toil through automation while maintaining reliability and observability.',
                },
                {
                  title: 'Kubernetes & GitOps',
                  desc: 'Operating production-grade clusters with GitOps workflows. Using ArgoCD, FluxCD, and Fleet to ensure deployments are declarative, auditable, and recoverable.',
                },
                {
                  title: 'Cloud & Hypervisors',
                  desc: 'Managing infrastructure across Rancher-managed clusters, Longhorn distributed storage, and enterprise virtualization platforms like Proxmox and Harvester (HCI).',
                },
                {
                  title: 'Infrastructure as Code',
                  desc: 'Provisioning and bootstrapping infrastructure through Terraform and Ansible. Every environment is reproducible, version-controlled, and documented.',
                },
                {
                  title: 'DevSecOps & SSDLC',
                  desc: 'Building security-first pipelines with SonarQube, Trivy, Harbor, and NeuVector. Integrating real penetration testing practices into the development lifecycle.',
                },
                {
                  title: 'Networking & Linux',
                  desc: 'Deep understanding of networking principles, firewall configuration, system hardening, and Linux administration. Building secure, performant foundations.',
                },
              ].map((skill, index) => (
                <div
                  key={skill.title}
                  className="group p-6 border border-border rounded-xl bg-background
                           hover:border-primary/50 hover:bg-accent/50
                           transition-all duration-300
                           hover:shadow-lg hover:-translate-y-1
                           animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-semibold mb-3 transition-colors group-hover:text-primary">
                    {skill.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= LATEST CERTIFICATIONS ================= */}
      {showCerts && latestCerts.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Latest Certifications
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-base sm:text-lg">
              Continuous learning and validated expertise across various technologies.
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {latestCerts.map((cert, index) => (
                <div
                  key={cert._id}
                  className="group flex flex-col border border-border rounded-xl 
                           transition-all duration-300 hover:shadow-lg hover:-translate-y-1
                           animate-fade-in bg-card/50 overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/certifications#${cert.slug}`} className="flex-1 flex flex-col p-6 pb-0">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-md border bg-primary/10 text-primary border-primary/30">
                        {cert.issuingOrganization}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {cert.name}
                    </h3>
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex gap-2 flex-wrap mb-4 content-start">
                        {cert.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className={`px-2.5 py-1 text-xs font-medium rounded-md border ${getBlogTagColor(skill)}`}
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="px-2.5 py-1 text-xs font-medium rounded-md border bg-muted text-muted-foreground border-border">
                            +{cert.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </Link>

                  {cert.media && (
                    <div className="px-6 py-4 mt-auto">
                      <Link href={`/certifications#${cert.slug}`} className="relative rounded-lg overflow-hidden border border-border/50 bg-background/50 h-32 flex items-center justify-center block">
                        <CertImage src={cert.media} alt={cert.name} disableZoom={true} />
                      </Link>
                    </div>
                  )}
                  
                  <Link href={`/certifications#${cert.slug}`} className="px-6 pb-6 pt-2 block mt-auto">
                    <time className="text-sm text-muted-foreground">
                      {cert.issueDate}
                    </time>
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/certifications"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                Career & certifications
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= LATEST DOCUMENTATION ================= */}
      {showDocs && latestDocs.length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-6xl mx-auto container px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Latest Documentation
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-base sm:text-lg">
              Recent guides and documentation from my knowledge base — real-world practices and continuous learning.
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {latestDocs.map((doc, index) => {
                const { section, subsection } = getDocSectionInfo(doc.slug)
                const sectionColorClass = section ? getSectionColor(section) : ''
                const subsectionColorClass = subsection ? getSubsectionColor(section || '', subsection) : ''
                const updatedAt = doc.updatedAt || doc.publishedAt

                return (
                  <Link
                    key={doc._id}
                    href={doc.url}
                    className="group flex flex-col p-6 border border-border rounded-xl bg-background
                             hover:border-primary/50 hover:bg-accent/50 
                             transition-all duration-300 
                             hover:shadow-lg hover:-translate-y-1
                             animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-wrap gap-2 mb-3">
                      {section && (
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${sectionColorClass}`}>
                          {formatDisplayName(section)}
                        </span>
                      )}
                      {subsection && (
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-md border ${subsectionColorClass}`}>
                          {formatDisplayName(subsection)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    {doc.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
                        {doc.description}
                      </p>
                    )}
                    <time className="text-sm text-muted-foreground mt-auto">
                      {new Date(updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </Link>
                )
              })}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                View all documentation
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= KNOWLEDGE BASE - BLOG ================= */}
      {showBlog && latestBlogs.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
              Knowledge Base — Recent Notes & Deep Dives
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-base sm:text-lg">
              These articles are written as internal documentation first — shared publicly to help others and to sharpen my own understanding.
            </p>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {latestBlogs.map((blog, index) => (
                <Link
                  key={blog._id}
                  href={blog.url}
                  className="group flex flex-col p-6 border border-border rounded-xl bg-card/50
                           hover:border-primary/50 hover:bg-accent/50 
                           transition-all duration-300 
                           hover:shadow-lg hover:-translate-y-1
                           animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1">
                    {blog.description}
                  </p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border ${getBlogTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <time className="text-sm text-muted-foreground mt-auto">
                    {new Date(blog.updatedAt || blog.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
              >
                View all posts
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================= RECRUITER SIGNAL ================= */}
      {showRecruiter && (
        <section className="bg-muted/30 py-16 sm:py-20 animate-fade-in">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="p-8 sm:p-10 border border-border rounded-2xl bg-card/50 backdrop-blur-sm
                            hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">
                  For recruiters & hiring managers
                </h2>
                
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4">
                  This site reflects how I work day to day: structured thinking, clear documentation, security-first design, and continuous learning.
                </p>
                
                <p className="text-base sm:text-lg text-foreground/90 font-medium">
                  <Highlight color="orange">If this approach resonates with your team, we'll likely work well together</Highlight>.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  )
}