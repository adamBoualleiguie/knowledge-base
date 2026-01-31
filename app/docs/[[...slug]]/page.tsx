import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allDocs } from 'contentlayer/generated'
import { Mdx } from '@/components/mdx-components'
import { DocsSidebar } from '@/components/DocsSidebar'
import { SidebarToggle } from '@/components/SidebarToggle'
import { TableOfContents } from '@/components/TableOfContents'
import { DocNavigation } from '@/components/DocNavigation'
import { AnchorLinks } from '@/components/AnchorLinks'
import { MetadataCard } from '@/components/MetadataCard'
import { calculateReadTime } from '@/lib/readTime'
import { getSectionOrder, getSubsectionOrder } from '@/config/docs-order.config'
import { compareDesc } from 'date-fns'
import type { Doc } from 'contentlayer/generated'

interface DocPageProps {
  params: {
    slug?: string[]
  }
}

async function getDocFromParams(params: DocPageProps['params']) {
  const slug = params?.slug?.join('/') || 'getting-started'
  const doc = allDocs.find((doc) => doc.slug === slug)
  return doc
}

/**
 * Get document order value (defaults to 999 if not set)
 */
function getDocOrder(doc: Doc): number {
  return doc.order ?? 999
}

/**
 * Extract section and subsection from document slug
 * Example: "Documentation-guide/features/mermaid" -> { section: "Documentation-guide", subsection: "features" }
 */
function getDocSectionInfo(slug: string): { section: string; subsection: string | null } {
  const parts = slug.split('/')
  return {
    section: parts[0] || '',
    subsection: parts[1] || null,
  }
}

/**
 * Format display name (convert hyphens to spaces and capitalize)
 */
function formatDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
  
  // Different colors for different subsections within each section
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

/**
 * Sort documents using the global ordering system
 * This matches the sidebar ordering logic
 */
function sortDocsByOrder(docs: Doc[]): Doc[] {
  return [...docs].sort((a, b) => {
    const aParts = a.slug.split('/')
    const bParts = b.slug.split('/')
    
    const aSection = aParts[0] || ''
    const bSection = bParts[0] || ''
    
    // First, sort by section order
    const sectionOrderA = getSectionOrder(aSection)
    const sectionOrderB = getSectionOrder(bSection)
    if (sectionOrderA !== sectionOrderB) {
      return sectionOrderA - sectionOrderB
    }
    
    // If same section, sort by subsection order
    const aSubsection = aParts[1] || '_root'
    const bSubsection = bParts[1] || '_root'
    
    // Handle _root (documents directly in section) - always first
    if (aSubsection === '_root' && bSubsection !== '_root') return -1
    if (aSubsection !== '_root' && bSubsection === '_root') return 1
    
    if (aSubsection !== '_root' && bSubsection !== '_root') {
      const subsectionOrderA = getSubsectionOrder(aSection, aSubsection)
      const subsectionOrderB = getSubsectionOrder(bSection, bSubsection)
      if (subsectionOrderA !== subsectionOrderB) {
        return subsectionOrderA - subsectionOrderB
      }
    }
    
    // If same subsection, sort by document order
    const docOrderA = getDocOrder(a)
    const docOrderB = getDocOrder(b)
    if (docOrderA !== docOrderB) {
      return docOrderA - docOrderB
    }
    
    // Finally, sort alphabetically by title
    return a.title.localeCompare(b.title)
  })
}

function getPrevNextDocs(currentSlug: string) {
  // Sort docs using the same ordering as sidebar
  const sortedDocs = sortDocsByOrder(allDocs)

  const currentIndex = sortedDocs.findIndex((doc) => doc.slug === currentSlug)

  if (currentIndex === -1) {
    return { prevDoc: null, nextDoc: null }
  }

  const prevDoc = currentIndex > 0 ? sortedDocs[currentIndex - 1] : null
  const nextDoc = currentIndex < sortedDocs.length - 1 ? sortedDocs[currentIndex + 1] : null

  return {
    prevDoc: prevDoc
      ? {
          title: prevDoc.title,
          url: prevDoc.url,
        }
      : null,
    nextDoc: nextDoc
      ? {
          title: nextDoc.title,
          url: nextDoc.url,
        }
      : null,
  }
}

export async function generateStaticParams() {
  // Generate params for all docs
  const docParams = allDocs.map((doc) => ({
    slug: doc.slug.split('/'),
  }))
  
  // Also generate the root /docs route (empty slug)
  return [
    { slug: [] },
    ...docParams,
  ]
}

export default async function DocPage({ params }: DocPageProps) {
  // If no slug, show docs listing
  if (!params?.slug || params.slug.length === 0) {
    // Sort docs by most recently updated or created (latest first)
    const sortedDocs = [...allDocs].sort((a, b) => {
      // Use updatedAt if available, otherwise fall back to publishedAt
      const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(a.publishedAt)
      const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(b.publishedAt)
      return compareDesc(dateA, dateB)
    })

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <SidebarToggle />
        <div className="flex gap-6 lg:gap-8 xl:gap-10">
          <DocsSidebar docs={allDocs} allDocs={allDocs} />
          <div className="flex-1 max-w-4xl">
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Welcome to the documentation. Here you&apos;ll find guides, tutorials, and reference materials.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {sortedDocs.map((doc) => {
                const { section, subsection } = getDocSectionInfo(doc.slug)
                const sectionColor = getSectionColor(section)
                const subsectionColor = getSubsectionColor(section, subsection)
                
                return (
                  <Link
                    key={doc._id}
                    href={doc.url}
                    className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 hover:shadow-lg flex flex-col"
                  >
                    {/* Tags at the top */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${sectionColor}`}>
                        {formatDisplayName(section)}
                      </span>
                      {subsection && (
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${subsectionColor}`}>
                          {formatDisplayName(subsection)}
                        </span>
                      )}
                    </div>
                    
                    {/* Title and description */}
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{doc.title}</h2>
                    {doc.description && (
                      <p className="text-muted-foreground line-clamp-2 flex-1">{doc.description}</p>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show individual doc
  const doc = await getDocFromParams(params)

  if (!doc) {
    notFound()
  }

  const { prevDoc, nextDoc } = getPrevNextDocs(doc.slug)
  const readTime = calculateReadTime(doc.body.raw || doc.body.code)
  const updatedAt = doc.updatedAt || doc.publishedAt
  const showMetadata = doc.showMetadata ?? false

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SidebarToggle />
      <div className="flex gap-6 lg:gap-8 xl:gap-10 transition-all duration-300">
        <DocsSidebar docs={allDocs} allDocs={allDocs} />
        <div className="flex-1 max-w-4xl min-w-0 transition-all duration-300">
          <article>
            <div className="mb-8 pb-6 border-b border-border">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-base text-muted-foreground leading-relaxed">{doc.description}</p>
              )}
            </div>
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-lg" id="doc-content">
              <AnchorLinks />
              <Mdx code={doc.body.code} />
            </div>
            <DocNavigation prevDoc={prevDoc} nextDoc={nextDoc} />
          </article>
        </div>
        <div className="hidden xl:block flex-shrink-0">
          <div className="sticky top-20">
            {showMetadata && (
              <div className="mb-10">
                <MetadataCard
                  author={doc.author}
                  authorPhoto={doc.authorPhoto}
                  readTime={readTime}
                  publishedAt={doc.publishedAt}
                  updatedAt={updatedAt}
                  tags={doc.tags}
                />
              </div>
            )}
            <TableOfContents content={doc.body.raw || doc.body.code} />
          </div>
        </div>
      </div>
    </div>
  )
}

