'use client'

import { useState, useEffect, ReactNode, Children, isValidElement } from 'react'

interface TabPanelProps {
  id: string
  label: string
  children: ReactNode
}

export function TabPanel({ children }: TabPanelProps) {
  return <>{children}</>
}

interface TabbedContentProps {
  children: ReactNode
  defaultTab?: string
}

export function TabbedContent({ children, defaultTab }: TabbedContentProps) {
  const tabs: Array<{ id: string; label: string; content: ReactNode }> = []
  
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === TabPanel) {
      const props = child.props as TabPanelProps
      tabs.push({
        id: props.id,
        label: props.label,
        content: props.children,
      })
    }
  })

  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  useEffect(() => {
    if (defaultTab && tabs.some(tab => tab.id === defaultTab)) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, tabs])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    
    // Trigger a custom event for TOC to update
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('contentChange'))
    }, 100)
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  if (tabs.length === 0) {
    return <>{children}</>
  }

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




