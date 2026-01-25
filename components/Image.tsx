'use client'

import { useState, useEffect } from 'react'
import NextImage from 'next/image'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

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

export function DocImage({ src, alt, width, height, caption }: ImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: width || 1200, height: height || 800 })
  const [basePath, setBasePath] = useState('')

  useEffect(() => {
    setBasePath(getBasePath())
  }, [])

  // Normalize src to include basePath if needed
  const normalizedSrc = src.startsWith('/') && basePath && !src.startsWith(basePath)
    ? `${basePath}${src}`
    : src

  useEffect(() => {
    // Load image to get natural dimensions if not provided
    if (!width || !height) {
      const img = new window.Image()
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.src = normalizedSrc
    }
  }, [normalizedSrc, width, height])

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

  const handleClick = () => {
    setIsFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  const aspectRatio = imageDimensions.width / imageDimensions.height

  return (
    <>
      <figure className="my-8 group">
        <div
          className="relative overflow-hidden rounded-lg border border-border bg-muted/30 cursor-pointer transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <div 
            className="relative w-full"
            style={{ 
              aspectRatio: aspectRatio || 'auto',
              minHeight: '200px'
            }}
          >
            <NextImage
              src={normalizedSrc}
              alt={alt}
              width={imageDimensions.width}
              height={imageDimensions.height}
              className={`
                w-full h-full object-contain transition-transform duration-300
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}
              style={{
                objectFit: 'contain',
              }}
              unoptimized={normalizedSrc.startsWith('/')}
              priority={false}
            />
          </div>
          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
            <div className="bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm text-foreground flex items-center gap-2">
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
        </div>
        {caption && (
          <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={handleCloseFullscreen}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-primary transition-colors p-2 z-10 bg-black/50 rounded-full"
            onClick={handleCloseFullscreen}
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
            className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <NextImage
              src={normalizedSrc}
              alt={alt}
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              unoptimized={normalizedSrc.startsWith('/')}
              priority
            />
          </div>
          {caption && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/70 backdrop-blur-sm px-4 py-2 rounded-md">
              {caption}
            </div>
          )}
        </div>
      )}
    </>
  )
}

