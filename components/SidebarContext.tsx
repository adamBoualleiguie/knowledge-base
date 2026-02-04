'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Start with default to avoid hydration mismatch
  // On mobile, default to closed for better UX. On desktop, default to open.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Default: open (desktop)
  const [mounted, setMounted] = useState(false)
  
  // Load from localStorage after mount (client-side only)
  // BUT: Don't load if we're on a docs page - we'll force it open via DocsSidebar
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      // Check if we're on mobile (screen width < 1024px = lg breakpoint)
      const isMobile = window.innerWidth < 1024
      
      // Check if we're on a docs page
      const isDocsPage = window.location.pathname?.startsWith('/docs') || window.location.pathname?.startsWith('/knowledge-base/docs')
      
      // Always check localStorage first to respect user preference
      const saved = localStorage.getItem('docs-sidebar-open')
      if (saved !== null) {
        // Respect user's saved preference
        setIsSidebarOpen(saved === 'true')
      } else {
        // No saved preference - default to open on desktop, closed on mobile
        setIsSidebarOpen(!isMobile)
      }
    }
  }, [])
  
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('docs-sidebar-open', isSidebarOpen.toString())
    }
  }, [isSidebarOpen, mounted])
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev)
  }
  
  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open)
  }
  
  return (
    <SidebarContext.Provider value={{ 
      isSidebarOpen, 
      toggleSidebar, 
      setSidebarOpen
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

