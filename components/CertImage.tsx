'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// Get basePath from Next.js config (for static export)
const getBasePath = () => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname
    if (path.startsWith('/knowledge-base')) {
      return '/knowledge-base'
    }
  }
  return ''
}

export function CertImage({ src, alt, disableZoom = false }: { src: string; alt: string; disableZoom?: boolean }) {
  const [basePath, setBasePath] = useState('')
  const [mounted, setMounted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    setBasePath(getBasePath())
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isFullscreen])

  // Normalize src to ensure it starts with /
  let finalSrc = src
  if (src.startsWith('public/')) {
    finalSrc = '/' + src.slice(7)
  } else if (!src.startsWith('/')) {
    finalSrc = '/' + src
  }

  // Add basePath if needed for GitHub pages static export
  const normalizedSrc = mounted && basePath && !finalSrc.startsWith(basePath)
    ? `${basePath}${finalSrc}`
    : finalSrc

  if (!mounted) {
    return <div className="w-full h-full bg-muted/30 animate-pulse rounded-xl" />
  }

  return (
    <>
      <div 
        className={`relative w-full h-full ${!disableZoom ? 'cursor-pointer group' : ''}`}
        onClick={() => !disableZoom && setIsFullscreen(true)}
      >
        <Image 
          src={normalizedSrc}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-contain p-2 hover:scale-105 transition-transform duration-500"
          loading="lazy"
          unoptimized={true}
        />
        {!disableZoom && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none rounded-xl">
            <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm text-foreground flex items-center gap-2 shadow-lg">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                />
              </svg>
              Click to view fullscreen
            </div>
          </div>
        )}
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 z-10 bg-black/50 hover:bg-black/70 rounded-full"
            onClick={() => setIsFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="relative max-w-[95vw] max-h-[95vh] w-[90vw] h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={normalizedSrc}
              alt={alt}
              fill
              className="object-contain"
              unoptimized={true}
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
