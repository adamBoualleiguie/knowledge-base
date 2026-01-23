'use client'

import { useState, useEffect, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onTabChange?: (tabId: string) => void
}

export function Tabs({ tabs, defaultTab, onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  useEffect(() => {
    if (defaultTab && tabs.some(tab => tab.id === defaultTab)) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, tabs])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onTabChange?.(tabId)
    
    // Trigger a custom event for TOC to update
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('contentChange'))
    }, 100)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="my-6">
      <div className="border-b border-border mb-6">
        <div className="flex gap-2 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium transition-colors border-b-2
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="tab-content">
        {activeTabContent}
      </div>
    </div>
  )
}

