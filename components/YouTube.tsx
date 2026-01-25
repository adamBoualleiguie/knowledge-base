'use client'

interface YouTubeProps {
  url: string
  caption?: string
  autoplay?: boolean
  start?: number // Start time in seconds
  end?: number // End time in seconds
  loop?: boolean
  muted?: boolean
  controls?: boolean
}

/**
 * Extracts YouTube video ID from various URL formats:
 * - https://youtu.be/a_FLqX3vGR4
 * - https://www.youtube.com/watch?v=a_FLqX3vGR4
 * - https://www.youtube.com/embed/a_FLqX3vGR4
 * - https://youtube.com/watch?v=a_FLqX3vGR4&t=123s
 */
function extractVideoId(url: string): string | null {
  // Handle youtu.be format
  const shortMatch = url.match(/(?:youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/)
  if (shortMatch) {
    return shortMatch[1]
  }

  // Handle youtube.com/watch format
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/v\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (watchMatch) {
    return watchMatch[1]
  }

  // Handle direct video ID (if someone just passes the ID)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url
  }

  return null
}

export function YouTube({
  url,
  caption,
  autoplay = false,
  start,
  end,
  loop = false,
  muted = false,
  controls = true,
}: YouTubeProps) {
  const videoId = extractVideoId(url)

  if (!videoId) {
    return (
      <div className="my-8 rounded-lg border border-destructive bg-destructive/10 p-4">
        <p className="text-destructive">
          Invalid YouTube URL. Please provide a valid YouTube video link.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Supported formats:
          <br />
          • https://youtu.be/VIDEO_ID
          <br />
          • https://www.youtube.com/watch?v=VIDEO_ID
          <br />
          • https://www.youtube.com/embed/VIDEO_ID
        </p>
      </div>
    )
  }

  // Build embed URL with parameters
  const embedParams = new URLSearchParams()
  
  if (autoplay) embedParams.set('autoplay', '1')
  if (muted) embedParams.set('mute', '1')
  if (!controls) embedParams.set('controls', '0')
  if (start) embedParams.set('start', start.toString())
  if (end) embedParams.set('end', end.toString())
  if (loop) {
    embedParams.set('loop', '1')
    embedParams.set('playlist', videoId) // Required for loop to work
  }
  
  // Enable privacy-enhanced mode for better GDPR compliance
  embedParams.set('rel', '0') // Don't show related videos from other channels
  embedParams.set('modestbranding', '1') // Reduce YouTube branding

  const embedUrl = `https://www.youtube.com/embed/${videoId}?${embedParams.toString()}`

  return (
    <figure className="my-8">
      <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
          <iframe
            src={embedUrl}
            title={caption || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full border-0"
            loading="lazy"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

