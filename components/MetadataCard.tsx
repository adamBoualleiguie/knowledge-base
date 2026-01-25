'use client'

import { format } from 'date-fns'
import { User, Clock, Calendar, Tag } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'

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

interface MetadataCardProps {
  author?: string
  authorPhoto?: string
  readTime?: number
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
}

/**
 * Resolve author photo path
 * If it starts with /, use as-is
 * Otherwise, assume it's in /assets/authors/
 * Handles various formats: "author.jpg", "/assets/authors/author.jpg", "assets/authors/author.jpg"
 */
function resolveAuthorPhoto(authorPhoto?: string | null, basePath: string = ''): string | null {
  if (!authorPhoto || typeof authorPhoto !== 'string' || authorPhoto.trim() === '') {
    return null
  }
  
  const trimmed = authorPhoto.trim()
  let resolvedPath: string
  
  // If it already starts with /, use as-is
  if (trimmed.startsWith('/')) {
    resolvedPath = trimmed
  }
  // If it starts with assets/, add leading slash
  else if (trimmed.startsWith('assets/')) {
    resolvedPath = `/${trimmed}`
  }
  // Otherwise, assume it's just the filename and add the path
  else {
    resolvedPath = `/assets/authors/${trimmed}`
  }
  
  // Add basePath prefix if needed and not already present
  if (basePath && resolvedPath.startsWith('/') && !resolvedPath.startsWith(basePath)) {
    return `${basePath}${resolvedPath}`
  }
  
  return resolvedPath
}

export function MetadataCard({ 
  author, 
  authorPhoto,
  readTime, 
  publishedAt, 
  updatedAt, 
  tags 
}: MetadataCardProps) {
  const displayReadTime = readTime || 0
  const [basePath, setBasePath] = useState('')
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    setBasePath(getBasePath())
  }, [])

  const photoPath = resolveAuthorPhoto(authorPhoto, basePath)

  return (
    <div className="w-64 p-6 border border-border rounded-lg bg-card shadow-sm">
      <div className="space-y-4">
        {author && (
          <div className="flex items-center gap-3">
            {photoPath && !imageError ? (
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted border border-border/50">
                  <Image
                    src={photoPath}
                    alt={author}
                    fill
                    className="object-cover"
                    sizes="48px"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted border border-border/50 flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                Author
              </div>
              <div className="text-sm font-medium text-foreground">
                {author}
              </div>
            </div>
          </div>
        )}

        {displayReadTime > 0 && (
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                Read Time
              </div>
              <div className="text-sm font-medium text-foreground">
                {displayReadTime} min read
              </div>
            </div>
          </div>
        )}

        {updatedAt && (
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                Last Updated
              </div>
              <div className="text-sm font-medium text-foreground">
                {format(new Date(updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="flex items-start gap-3">
            <Tag className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Tags
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-muted text-foreground rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

