'use client'

import { Info, CheckCircle2, AlertTriangle, Lightbulb, AlertCircle } from 'lucide-react'

interface CalloutProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'note' | 'danger'
  title?: string
  children: React.ReactNode
}

const calloutConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    titleColor: 'text-blue-300',
  },
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/30',
    iconColor: 'text-green-400',
    titleColor: 'text-green-300',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    iconColor: 'text-yellow-400',
    titleColor: 'text-yellow-300',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
  note: {
    icon: Lightbulb,
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    titleColor: 'text-purple-300',
  },
  danger: {
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400',
    titleColor: 'text-red-300',
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const config = calloutConfig[type]
  const Icon = config.icon
  const displayTitle = title || (type === 'info' ? 'Info' : type.charAt(0).toUpperCase() + type.slice(1))

  return (
    <div className={`my-6 rounded-lg border ${config.borderColor} ${config.bgColor} p-4 callout-container`}>
      <div className="flex gap-3">
        <Icon className={`${config.iconColor} flex-shrink-0 mt-0.5 w-5 h-5`} />
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <div className={`${config.titleColor} font-semibold mb-2 text-sm`}>
              {displayTitle}
            </div>
          )}
          <div className="text-sm text-foreground prose-callout">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

