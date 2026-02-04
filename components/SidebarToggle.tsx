'use client'

import { useState, useEffect } from 'react'
import { useSidebar } from './SidebarContext'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export function SidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only show on docs pages and after mount
  // Check for both /docs and /knowledge-base/docs
  const isDocsPage = pathname?.startsWith('/docs') || pathname?.startsWith('/knowledge-base/docs')
  if (!mounted || !isDocsPage) {
    return null
  }

  return (
    <button
      onClick={toggleSidebar}
      className="
        fixed 
        top-[68px] right-3 
        lg:top-24 lg:left-6 lg:right-auto
        z-50 
        p-2 lg:p-2.5 
        rounded-lg 
        bg-background/95 backdrop-blur-sm
        border border-border/60
        shadow-md 
        hover:bg-accent active:bg-accent 
        transition-all duration-200 
        hover:shadow-lg hover:border-primary/50 
        touch-manipulation
        lg:bg-background lg:border-border lg:shadow-lg
      "
      aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      title={isSidebarOpen ? 'Hide sidebar (more reading space)' : 'Show sidebar (navigation)'}
    >
      {isSidebarOpen ? (
        <X className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
      ) : (
        <Menu className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
      )}
    </button>
  )
}

