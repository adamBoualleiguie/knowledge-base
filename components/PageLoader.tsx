'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { usePathname } from 'next/navigation'

function PageLoaderContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const prevPathnameRef = useRef(pathname)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Only show loader if pathname actually changed (not on initial mount)
    if (prevPathnameRef.current === pathname) {
      prevPathnameRef.current = pathname
      return
    }

    // Start loading when pathname changes
    setIsLoading(true)
    setProgress(0)
    prevPathnameRef.current = pathname

    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }

    // Simulate progress with realistic increments
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          return 85 // Hold at 85% until page loads
        }
        // Slower progress as we get closer
        const increment = prev < 50 ? 8 : prev < 75 ? 4 : 2
        return Math.min(prev + increment + Math.random() * 3, 85)
      })
    }, 60)

    // Complete loading when page is ready
    const handleLoad = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
        }
      }, 300)
    }

    // Check if page is already loaded
    if (typeof window !== 'undefined' && document.readyState === 'complete') {
      setTimeout(handleLoad, 100)
    } else if (typeof window !== 'undefined') {
      window.addEventListener('load', handleLoad, { once: true })
    }

    // Fallback: complete after max time
    const fallbackTimeout = setTimeout(() => {
      handleLoad()
    }, 2000)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
      clearTimeout(fallbackTimeout)
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [pathname, mounted])

  if (!isLoading || !mounted) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Animated background overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-md animate-fade-in" />
      
      {/* Progress bar at top with glow effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-border/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary transition-all duration-300 ease-out relative overflow-hidden shadow-lg shadow-primary/50"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
      </div>

      {/* Loading animation in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          {/* Creative animated loader */}
          <div className="relative w-20 h-20">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin-slow" />
            {/* Middle ring - reverse direction */}
            <div className="absolute inset-2 border-3 border-primary/30 rounded-full animate-spin-reverse" />
            {/* Inner pulsing circle */}
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full animate-pulse shadow-lg shadow-primary/50" />
            </div>
            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary-foreground rounded-full shadow-md" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
            </div>
            <div className="absolute inset-0 animate-spin-reverse" style={{ animationDuration: '2s' }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full" />
            </div>
          </div>
          
          {/* Loading text with subtle animation */}
          <div className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            <span className="animate-pulse">Loading</span>
            <span className="flex gap-1">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <Suspense fallback={null}>
      <PageLoaderContent />
    </Suspense>
  )
}

