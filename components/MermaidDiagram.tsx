'use client'

import { useState, useEffect, useRef } from 'react'
import { Mermaid } from 'mdx-mermaid/lib/Mermaid'

interface MermaidDiagramProps {
  chart: string
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Prevent hydration mismatch by only rendering on client
  useEffect(() => {
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

  const handleClick = () => {
    setIsFullscreen(true)
  }

  const handleCloseFullscreen = () => {
    setIsFullscreen(false)
  }

  // Show loading state during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="my-8 rounded-lg border border-border bg-background p-4">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse text-muted-foreground">Loading diagram...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="my-8 group">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg border border-border bg-background cursor-pointer transition-all duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          <div className="p-4">
            <div
              className={`
                transition-transform duration-300
                ${isHovered ? 'scale-[1.02]' : 'scale-100'}
              `}
            >
              <Mermaid chart={chart} />
            </div>
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
      </div>

      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in duration-200"
          onClick={handleCloseFullscreen}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-primary transition-colors p-3 z-10 bg-black/70 hover:bg-black/90 rounded-full shadow-lg"
            onClick={handleCloseFullscreen}
            aria-label="Close fullscreen"
          >
            <svg
              className="w-7 h-7"
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
            className="relative w-full h-full flex items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-12 bg-background rounded-lg border border-border/50 shadow-2xl max-w-[98vw] max-h-[98vh] overflow-auto">
              <div className="min-w-[1200px] min-h-[800px] flex items-center justify-center">
                <div className="scale-[1.5] origin-center">
                  <Mermaid chart={chart} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

