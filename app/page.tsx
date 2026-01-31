'use client'

import Link from 'next/link'
import { allBlogs, allDocs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { Typewriter } from 'react-simple-typewriter'
import { useState, useEffect } from 'react'
import { Highlight } from '@/components/Highlight'
import { getBlogTagColor } from '@/lib/tag-colors'

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

  const [basePath, setBasePath] = useState('')

  // Determine basePath dynamically (same approach as Navigation.tsx)
  useEffect(() => {
    setBasePath(getBasePath())
  }, [])

  // Enhanced state sequence: Hi → Name → Title → Value Statement → CTAs → Why → About → Skills → Docs → Blog → Recruiter
  const [showHi, setShowHi] = useState(true)
  const [showName, setShowName] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const [showValueStatement, setShowValueStatement] = useState(false)
  const [showCTAs, setShowCTAs] = useState(false)
  const [showWhy, setShowWhy] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showSkills, setShowSkills] = useState(false)
  const [showDocs, setShowDocs] = useState(false)
  const [showBlog, setShowBlog] = useState(false)
  const [showRecruiter, setShowRecruiter] = useState(false)

  useEffect(() => {
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

    const whyTimeout = setTimeout(() => {
      setShowWhy(true)
    }, 9000) // Why section appears

    const aboutTimeout = setTimeout(() => {
      setShowAbout(true)
    }, 11000) // About section appears

    const skillsTimeout = setTimeout(() => {
      setShowSkills(true)
    }, 12000) // Skills section appears

    const docsTimeout = setTimeout(() => {
      setShowDocs(true)
    }, 13000) // Docs section appears

    const blogTimeout = setTimeout(() => {
      setShowBlog(true)
    }, 14000) // Blog section appears

    const recruiterTimeout = setTimeout(() => {
      setShowRecruiter(true)
    }, 15000) // Recruiter section appears

    return () => {
      clearTimeout(hiTimeout)
      clearTimeout(titleTimeout)
      clearTimeout(valueTimeout)
      clearTimeout(ctaTimeout)
      clearTimeout(whyTimeout)
      clearTimeout(aboutTimeout)
      clearTimeout(skillsTimeout)
      clearTimeout(docsTimeout)
      clearTimeout(blogTimeout)
      clearTimeout(recruiterTimeout)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Hi + waving hand */}
        {showHi && (
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Hi{' '}
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
        )}

        {/* Typed Name */}
        {showName && (
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6
                     bg-gradient-to-r from-primary via-primary/90 to-primary/70
                     bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]
                     animate-fade-in">
            <Typewriter
              words={["I'm Adam Boualleiguie"]}
              cursor
              cursorStyle="▍"
              typeSpeed={70}
            />
          </h2>
        )}

        {/* Enhanced Title with scope */}
        {showTitle && (
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-2 max-w-4xl mx-auto leading-relaxed">
              DevOps · DevSecOps · SysOps Engineer
            </p>
            <p className="text-base sm:text-lg text-muted-foreground/80 mb-6 max-w-3xl mx-auto">
              Building, operating, and documenting production systems
            </p>
          </div>
        )}

        {/* Core Value Statement (CRITICAL) */}
        {showValueStatement && (
          <div className="animate-fade-in max-w-4xl mx-auto" style={{ animationDelay: '300ms' }}>
            <p className="text-lg sm:text-xl text-foreground/90 mb-4 leading-relaxed font-medium">
              I design, operate, and secure production-grade infrastructures — and I document everything I learn.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              This website is my <span className="text-primary font-medium">living knowledge base</span>: real-world DevOps and DevSecOps practices, architecture decisions, experiments, failures, and continuous learning from production environments.
            </p>
          </div>
        )}

        {/* CTAs */}
        {showCTAs && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-in" style={{ animationDelay: '400ms' }}>
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

            <a
              href={`${basePath}/assets/general/pdfs/AdamBoualleiguie.pdf`}
              download
              className="px-8 py-3.5 border-2 border-border rounded-lg
                       hover:bg-accent transition-all duration-300 font-medium
                       hover:border-primary/50 hover:scale-105 active:scale-95"
            >
              Download CV
            </a>
          </div>
        )}

        {/* Microtext under CTAs */}
        {showCTAs && (
          <p className="text-xs sm:text-sm text-muted-foreground/70 mt-4 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <em>Everything here reflects how I work in real environments.</em>
          </p>
        )}
      </section>

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

      {/* ================= LATEST DOCUMENTATION ================= */}
      {showDocs && latestDocs.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 animate-fade-in">
          <div className="max-w-6xl mx-auto">
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
                    className="group flex flex-col p-6 border border-border rounded-xl 
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
        <section className="bg-muted/30 py-16 sm:py-20 animate-fade-in">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
                    className="group flex flex-col p-6 border border-border rounded-xl bg-background
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
