'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DocNavigationProps {
  prevDoc?: {
    title: string
    url: string
  } | null
  nextDoc?: {
    title: string
    url: string
  } | null
}

export function DocNavigation({ prevDoc, nextDoc }: DocNavigationProps) {
  if (!prevDoc && !nextDoc) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {prevDoc ? (
          <Link
            href={prevDoc.url}
            className="group flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 max-w-full sm:max-w-[48%]"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">Prev</div>
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {prevDoc.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="flex-1 sm:max-w-[48%]" />
        )}

        {nextDoc ? (
          <Link
            href={nextDoc.url}
            className="group flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200 max-w-full sm:max-w-[48%] ml-auto text-right"
          >
            <div className="flex-1 min-w-0 text-right">
              <div className="text-xs text-muted-foreground mb-0.5">Next</div>
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {nextDoc.title}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </Link>
        ) : (
          <div className="flex-1 sm:max-w-[48%]" />
        )}
      </div>
    </div>
  )
}

