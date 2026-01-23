'use client'

import { useState, useEffect } from 'react'
import { Copy, Check } from 'lucide-react'

// Dynamic import for shiki to avoid SSR issues
let shiki: any = null
const loadShiki = async () => {
  if (!shiki && typeof window !== 'undefined') {
    try {
      const shikiModule = await import('shiki')
      shiki = shikiModule
    } catch (error) {
      console.warn('Failed to load shiki:', error)
    }
  }
  return shiki
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlight = async () => {
      setIsLoading(true)
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          const escapedCode = escapeHtml(code)
          setHighlightedCode(`<pre><code>${escapedCode}</code></pre>`)
          setIsLoading(false)
          return
        }

        const shikiModule = await loadShiki()
        if (shikiModule && shikiModule.codeToHtml) {
          try {
            // Use shiki for syntax highlighting
            const html = await shikiModule.codeToHtml(code, {
              lang: language,
              theme: 'github-dark',
            })
            setHighlightedCode(html)
          } catch (shikiError) {
            // If shiki fails for this language, use fallback
            console.warn('Shiki highlighting failed, using fallback:', shikiError)
            throw shikiError // Fall through to fallback
          }
        } else {
          // Fallback: create styled code block
          const lines = code.split('\n')
          const linesHtml = lines.map((line, index) => {
            const lineNum = index + 1
            const isHighlighted = highlightLines.includes(lineNum)
            const lineNumberClass = showLineNumbers ? 'line-number' : ''
            const highlightClass = isHighlighted ? 'highlighted-line' : ''
            const classes = [lineNumberClass, highlightClass].filter(Boolean).join(' ')
            return `<span class="line ${classes}">${escapeHtml(line || ' ')}</span>`
          })
          setHighlightedCode(`<pre><code class="language-${language}">${linesHtml.join('\n')}</code></pre>`)
        }
      } catch (error) {
        console.error('Code highlighting error:', error)
        // Fallback to plain text
        const lines = code.split('\n')
        const linesHtml = lines.map((line, index) => {
          const lineNum = index + 1
          const isHighlighted = highlightLines.includes(lineNum)
          const lineNumberClass = showLineNumbers ? 'line-number' : ''
          const highlightClass = isHighlighted ? 'highlighted-line' : ''
          const classes = [lineNumberClass, highlightClass].filter(Boolean).join(' ')
          return `<span class="line ${classes}">${escapeHtml(line || ' ')}</span>`
        })
        setHighlightedCode(`<pre><code class="language-${language}">${linesHtml.join('\n')}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlight()
  }, [code, language, showLineNumbers, highlightLines])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="my-6 rounded-lg border border-border bg-[#0d1117] p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted/20 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted/20 rounded w-full mb-2"></div>
          <div className="h-4 bg-muted/20 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="my-6 group">
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border border-border border-b-0 rounded-t-lg text-sm text-muted-foreground">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="font-mono">{filename}</span>
          {language && language !== 'text' && (
            <span className="ml-auto px-2 py-0.5 bg-background rounded text-xs font-medium">
              {language}
            </span>
          )}
        </div>
      )}
      <div className={`relative rounded-lg border border-border/50 bg-[#0d1117] overflow-hidden ${filename ? 'rounded-t-none' : ''}`}>
        {!filename && language !== 'text' && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            <span className="px-2 py-1 bg-background/80 backdrop-blur-sm rounded text-xs font-medium text-muted-foreground">
              {language}
            </span>
          </div>
        )}
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 z-10 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border text-muted-foreground hover:text-foreground hover:bg-background transition-all opacity-0 group-hover:opacity-100"
            aria-label="Copy code"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <div
            className="shiki overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            style={{
              fontSize: '14px',
              lineHeight: '1.75',
            }}
          />
        </div>
      </div>
    </div>
  )
}
