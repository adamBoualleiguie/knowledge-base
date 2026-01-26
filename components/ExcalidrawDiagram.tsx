'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Dynamically import Excalidraw to avoid SSR issues
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
)

interface ExcalidrawDiagramProps {
  src: string
  alt?: string
  caption?: string
  initialZoom?: number // Initial zoom level (1 = 100%, 0.5 = 50%, 2 = 200%, etc.)
}

export function ExcalidrawDiagram({ src, alt, caption, initialZoom = 1 }: ExcalidrawDiagramProps) {
  const [excalidrawData, setExcalidrawData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(initialZoom)
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Determine basePath dynamically
  const basePath = pathname.startsWith('/knowledge-base') ? '/knowledge-base' : ''

  // Ensure component is mounted (for theme)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load Excalidraw file
  useEffect(() => {
    const loadExcalidrawFile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Add basePath prefix to src if it's a relative path
        const finalSrc = src.startsWith('/') && !src.startsWith(basePath) ? `${basePath}${src}` : src
        
        const response = await fetch(finalSrc)
        if (!response.ok) {
          throw new Error(`Failed to load Excalidraw file: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Excalidraw expects the data in a specific format
        // If it's a .excalidraw file, it should have elements, appState, etc.
        if (data.type === 'excalidraw' && data.elements) {
          // Format is correct for Excalidraw
          setExcalidrawData({
            elements: data.elements,
            appState: data.appState || {},
            files: data.files || {},
          })
        } else if (data.elements) {
          // Already in correct format
          setExcalidrawData(data)
        } else {
          throw new Error('Invalid Excalidraw file format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load diagram')
        console.error('Error loading Excalidraw file:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (src) {
      loadExcalidrawFile()
    }
  }, [src, basePath])

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Zoom controls
  const handleZoomIn = () => {
    if (excalidrawAPI) {
      try {
        const appState = excalidrawAPI.getAppState()
        const currentZoom = appState?.zoom?.value || 1
        const newZoom = Math.min(currentZoom + 0.25, 3)
        excalidrawAPI.updateScene({
          appState: {
            ...appState,
            zoom: { value: newZoom }
          }
        })
        setZoom(newZoom)
      } catch (err) {
        console.error('Error zooming in:', err)
      }
    }
  }

  const handleZoomOut = () => {
    if (excalidrawAPI) {
      try {
        const appState = excalidrawAPI.getAppState()
        const currentZoom = appState?.zoom?.value || 1
        const newZoom = Math.max(currentZoom - 0.25, 0.5)
        excalidrawAPI.updateScene({
          appState: {
            ...appState,
            zoom: { value: newZoom }
          }
        })
        setZoom(newZoom)
      } catch (err) {
        console.error('Error zooming out:', err)
      }
    }
  }

  const handleResetZoom = () => {
    if (excalidrawAPI) {
      try {
        const appState = excalidrawAPI.getAppState()
        excalidrawAPI.updateScene({
          appState: {
            ...appState,
            zoom: { value: 1 },
            scrollX: 0,
            scrollY: 0
          }
        })
        setZoom(1)
      } catch (err) {
        console.error('Error resetting zoom:', err)
      }
    }
  }

  // Excalidraw theme matches app theme
  const excalidrawTheme = mounted && theme === 'dark' ? 'dark' : 'light'

  if (isLoading) {
    return (
      <div className="my-8 rounded-lg border border-border bg-muted/30 p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading diagram...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-8 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-destructive text-sm">Error loading diagram: {error}</p>
      </div>
    )
  }

  if (!excalidrawData) {
    return null
  }

  return (
    <div className="my-8">
      <div
        ref={containerRef}
        className={`relative rounded-lg border border-border bg-background ${
          isFullscreen ? 'fixed inset-0 z-[9999] rounded-none' : ''
        }`}
        style={isFullscreen ? { width: '100vw', height: '100vh' } : { minHeight: '500px', height: '500px' }}
      >
        {/* Toolbar */}
        <div className="absolute top-2 right-2 z-50 flex items-center gap-2 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-1">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded hover:bg-muted transition-colors"
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="px-2 text-xs text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded hover:bg-muted transition-colors"
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 rounded hover:bg-muted transition-colors"
              aria-label="Reset zoom"
              title="Reset zoom"
            >
              <RotateCcw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <div className="flex items-center gap-1 border-l border-border pl-1">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded hover:bg-muted transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Excalidraw Component */}
        <div 
          className={isFullscreen ? 'h-screen w-screen' : 'h-[500px] w-full'} 
          style={{ 
            position: 'relative',
            width: '100%',
            height: isFullscreen ? '100vh' : '500px',
            backgroundColor: excalidrawTheme === 'dark' ? '#1e1e1e' : '#ffffff'
          }}
        >
          {mounted && excalidrawData && (
            <div 
              className="excalidraw-container"
              style={{ 
                width: '100%', 
                height: '100%',
                position: 'relative',
                display: 'block',
                minHeight: isFullscreen ? '100vh' : '500px'
              }}
            >
              <Excalidraw
                initialData={{
                  ...excalidrawData,
                  appState: {
                    ...(excalidrawData.appState || {}),
                    zoom: { value: Number(initialZoom) }
                  }
                }}
                theme={excalidrawTheme}
                UIOptions={{
                  canvasActions: {
                    saveToActiveFile: false,
                    loadScene: false,
                    export: false,
                    toggleTheme: false,
                  },
                  tools: {
                    image: false,
                  },
                }}
                viewModeEnabled={true}
                zenModeEnabled={false}
                excalidrawAPI={(api) => {
                  setExcalidrawAPI(api)
                  // Update zoom state from API and center the diagram
                  if (api) {
                    try {
                      const appState = api.getAppState()
                      // Set zoom from initialZoom or from appState
                      const currentZoom = appState?.zoom?.value || initialZoom
                      setZoom(currentZoom)
                      
                      // Center the diagram after it loads
                      setTimeout(() => {
                        try {
                          const elements = api.getSceneElements()
                          if (elements && elements.length > 0) {
                            // Calculate center of all elements
                            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
                            elements.forEach((el: any) => {
                              if (el.x !== undefined) {
                                minX = Math.min(minX, el.x)
                                maxX = Math.max(maxX, el.x + (el.width || 0))
                              }
                              if (el.y !== undefined) {
                                minY = Math.min(minY, el.y)
                                maxY = Math.max(maxY, el.y + (el.height || 0))
                              }
                            })
                            if (minX !== Infinity) {
                              const centerX = (minX + maxX) / 2
                              const centerY = (minY + maxY) / 2
                              const currentState = api.getAppState()
                              const currentZoom = currentState?.zoom || { value: 1 }
                              const zoomValue = (currentZoom.value as number) || 1
                              const canvas = document.querySelector('.excalidraw-container .canvas-container') as HTMLElement
                              if (canvas) {
                                const { width, height } = canvas.getBoundingClientRect()
                                const scrollXValue = centerX - width / (2 * zoomValue)
                                const scrollYValue = centerY - height / (2 * zoomValue)
                                api.updateScene({
                                  appState: {
                                    ...currentState,
                                    scrollX: scrollXValue,
                                    scrollY: scrollYValue,
                                  }
                                })
                              }
                            }
                          }
                        } catch (err) {
                          // Silently fail if centering doesn't work
                        }
                      }, 300)
                    } catch (err) {
                      console.error('Error getting app state:', err)
                    }
                  }
                }}
                onChange={(elements, appState, files) => {
                  // Update zoom state when it changes
                  if (appState?.zoom?.value) {
                    setZoom(appState.zoom.value)
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Caption */}
      {caption && (
        <p className="mt-3 text-sm text-muted-foreground text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}

