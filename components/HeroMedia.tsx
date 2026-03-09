'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.ogg', '.m4v']

function isVideoSrc(src: string): boolean {
  const lower = src.toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function getBasePath(): string {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/knowledge-base')) {
      return '/knowledge-base'
    }
  }
  return ''
}

function normalizeHeroSrc(src: string): string {
  let s = src.trim()
  if (s.startsWith('public/')) {
    s = '/' + s.slice(7)
  } else if (!s.startsWith('/')) {
    s = '/' + s
  }
  return s
}

export interface HeroMediaProps {
  readonly src: string
  readonly alt?: string
  readonly caption?: string
}

export function HeroMedia({ src, alt = '', caption }: HeroMediaProps) {
  const [basePath, setBasePath] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBasePath(getBasePath())
    setMounted(true)
  }, [])

  const normalizedSrc = normalizeHeroSrc(src)
  const finalSrc =
    mounted && basePath && !normalizedSrc.startsWith(basePath)
      ? `${basePath}${normalizedSrc}`
      : normalizedSrc
  const isVideo = isVideoSrc(normalizedSrc)

  if (!mounted) {
    return (
      <div
        className="w-full aspect-[21/9] sm:aspect-[2.5/1] max-h-[320px] sm:max-h-[400px] bg-muted/30 animate-pulse rounded-xl overflow-hidden"
        aria-hidden
      />
    )
  }

  return (
    <figure className="w-full mb-8 sm:mb-10 -mt-2 sm:-mt-4">
      <div className="relative w-full aspect-[21/9] sm:aspect-[2.5/1] max-h-[280px] sm:max-h-[380px] rounded-xl overflow-hidden border border-border/50 shadow-lg bg-muted/20">
        {isVideo ? (
          <video
            src={finalSrc}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            aria-label={alt || 'Hero video'}
          />
        ) : (
          <Image
            src={finalSrc}
            alt={alt || 'Hero image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            className="object-cover"
            priority
            unoptimized={true}
          />
        )}
        {/* Subtle gradient overlay at bottom for caption readability */}
        {caption && (
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-transparent"
            aria-hidden
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
