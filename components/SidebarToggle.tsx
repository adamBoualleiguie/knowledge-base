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
      className="fixed left-4 top-24 z-50 p-2.5 rounded-lg bg-background border border-border shadow-lg hover:bg-accent transition-all duration-200 hover:shadow-xl hover:border-primary/50 lg:left-6"
      aria-label={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
      title={isSidebarOpen ? 'Hide sidebar (more reading space)' : 'Show sidebar (navigation)'}
    >
      {isSidebarOpen ? (
        <X className="w-5 h-5 text-foreground" />
      ) : (
        <Menu className="w-5 h-5 text-foreground" />
      )}
    </button>
  )
}

