'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextType {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  isResizing: boolean
  setResizing: (resizing: boolean) => void
  resizeCooldown: boolean
  setResizeCooldown: (cooldown: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Start with default to avoid hydration mismatch
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Default: open
  const [isResizing, setIsResizing] = useState(false)
  const [resizeCooldown, setResizeCooldown] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('docs-sidebar-open')
      if (saved !== null) {
        setIsSidebarOpen(saved === 'true')
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
      setSidebarOpen,
      isResizing,
      setResizing: setIsResizing,
      resizeCooldown,
      setResizeCooldown
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

