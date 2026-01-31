'use client'

import { useState, useRef, useEffect } from 'react'
import { MediaLoader } from './MediaLoader'

interface VideoProps {
  src: string
  poster?: string
  caption?: string
  autoplay?: boolean
  controls?: boolean
  loop?: boolean
  muted?: boolean
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

export function DocVideo({
  src,
  poster,
  caption,
  autoplay = false,
  controls = true,
  loop = false,
  muted = false,
}: VideoProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [basePath, setBasePath] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setBasePath(getBasePath())
  }, [])

  // Normalize src and poster to include basePath if needed
  const normalizedSrc = src.startsWith('/') && basePath && !src.startsWith(basePath)
    ? `${basePath}${src}`
    : src
  const normalizedPoster = poster && poster.startsWith('/') && basePath && !poster.startsWith(basePath)
    ? `${basePath}${poster}`
    : poster

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        ;(videoRef.current as any).webkitRequestFullscreen()
      } else if ((videoRef.current as any).mozRequestFullScreen) {
        ;(videoRef.current as any).mozRequestFullScreen()
      }
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const [videoLoading, setVideoLoading] = useState(true)

  const handleCanPlay = () => {
    setVideoLoading(false)
  }

  const handleLoadedData = () => {
    setVideoLoading(false)
  }

  return (
    <figure className="my-8">
      <MediaLoader>
        <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
          <video
            ref={videoRef}
            src={normalizedSrc}
            poster={normalizedPoster}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
            onPlay={handlePlay}
            onPause={handlePause}
            onCanPlay={handleCanPlay}
            onLoadedData={handleLoadedData}
            className="w-full h-auto"
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          >
            Your browser does not support the video tag.
          </video>
        {!controls && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-colors">
            <button
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause()
                  } else {
                    videoRef.current.play()
                  }
                }
              }}
              className="opacity-0 hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm rounded-full p-3"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <svg
                className="w-8 h-8 text-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                {isPlaying ? (
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                ) : (
                  <path d="M8 5v14l11-7z" />
                )}
              </svg>
            </button>
          </div>
        )}
        </div>
      </MediaLoader>
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}


