'use client'

import { useState, useEffect, cloneElement, isValidElement } from 'react'

interface MediaLoaderProps {
  children: React.ReactNode
  className?: string
}

export function MediaLoader({ children, className = '' }: MediaLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return 90 // Hold at 90% until actual load
        }
        return prev + Math.random() * 8
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  const handleLoad = () => {
    setProgress(100)
    setTimeout(() => {
      setIsLoading(false)
    }, 250)
  }

  // Clone children and add onLoad handlers
  const childrenWithHandlers = isValidElement(children)
    ? cloneElement(children as any, {
        onLoad: handleLoad,
        onLoadedData: handleLoad,
        onCanPlay: handleLoad,
        onLoadedMetadata: handleLoad,
      })
    : children

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-muted/60 backdrop-blur-sm rounded-lg flex items-center justify-center animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            {/* Creative animated spinner */}
            <div className="relative w-14 h-14">
              {/* Outer ring */}
              <div className="absolute inset-0 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              {/* Middle ring - reverse */}
              <div className="absolute inset-2 border-2 border-primary/30 border-b-primary rounded-full animate-spin-reverse" />
              {/* Inner pulsing dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              </div>
            </div>
            {/* Progress indicator with glow */}
            <div className="w-32 h-1.5 bg-border/50 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-200 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {childrenWithHandlers}
      </div>
    </div>
  )
}

