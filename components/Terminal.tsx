'use client'

import { useEffect, useState, useRef } from 'react'

interface Command {
  command: string
  output?: string
  delay?: number // Delay before showing output (ms)
}

interface TerminalProps {
  commands: Command[]
  prompt?: string
  title?: string
  autoStart?: boolean
}

export function Terminal({ 
  commands, 
  prompt = '$',
  title = 'Terminal',
  autoStart = true
}: TerminalProps) {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [currentCommandText, setCurrentCommandText] = useState('')
  const [currentOutput, setCurrentOutput] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [completedCommands, setCompletedCommands] = useState<number[]>([])
  const [copyFeedback, setCopyFeedback] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<NodeJS.Timeout[]>([]) // Store all timers for cleanup
  const isStartedRef = useRef(false) // Track started state in ref to avoid closure issues
  const currentCommandIndexRef = useRef(0) // Track current command index in ref
  const typingSpeed = 30 // milliseconds per character

  // Cleanup function to clear all timers
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer))
    timersRef.current = []
  }

  // Check if terminal is in viewport
  useEffect(() => {
    if (!autoStart || !terminalRef.current || isStartedRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isStartedRef.current) {
            isStartedRef.current = true
            setIsStarted(true)
            startTyping()
          }
        })
      },
      {
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
      }
    )

    observer.observe(terminalRef.current)

    return () => {
      observer.disconnect()
    }
  }, [autoStart])

  // Auto-start if autoStart is true and component mounts
  useEffect(() => {
    if (autoStart && !isStartedRef.current && terminalRef.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (terminalRef.current && !isStartedRef.current) {
          const rect = terminalRef.current.getBoundingClientRect()
          const isInView = rect.top < window.innerHeight && rect.bottom > 0
          if (isInView) {
            isStartedRef.current = true
            setIsStarted(true)
            startTyping()
          }
        }
      }, 500)
      timersRef.current.push(timer)
      return () => clearTimeout(timer)
    }
  }, [autoStart])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers()
    }
  }, [])

  const startTyping = () => {
    if (commands.length === 0) return
    clearAllTimers() // Clear any existing timers
    currentCommandIndexRef.current = 0
    setCurrentCommandIndex(0)
    setCurrentCommandText('')
    setCurrentOutput(null)
    setCompletedCommands([])
    setIsTyping(true)
    typeCommand(0)
  }

  const typeCommand = (commandIndex: number) => {
    if (commandIndex >= commands.length) {
      setIsTyping(false)
      return
    }

    const cmd = commands[commandIndex]
    if (!cmd) return
    
    let charIndex = 0

    const typeChar = () => {
      // Check if we should continue (in case of restart)
      if (commandIndex !== currentCommandIndexRef.current || !isStartedRef.current) {
        return
      }

      if (charIndex < cmd.command.length) {
        setCurrentCommandText(cmd.command.substring(0, charIndex + 1))
        charIndex++
        const timer = setTimeout(typeChar, typingSpeed)
        timersRef.current.push(timer)
      } else {
        // Command typed, wait a bit then show output
        const outputTimer = setTimeout(() => {
          if (commandIndex === currentCommandIndexRef.current && isStartedRef.current) {
            if (cmd.output !== undefined) {
              setCurrentOutput(cmd.output)
            }
            
            // Mark this command as completed and clear current typing state
            setCompletedCommands(prev => [...prev, commandIndex])
            
            // Wait before next command
            const delay = cmd.delay || 800
            const nextTimer = setTimeout(() => {
              if (isStartedRef.current) {
                const nextIndex = commandIndex + 1
                currentCommandIndexRef.current = nextIndex
                setCurrentCommandIndex(nextIndex)
                setCurrentCommandText('')
                setCurrentOutput(null)
                typeCommand(nextIndex)
              }
            }, delay)
            timersRef.current.push(nextTimer)
          }
        }, 500)
        timersRef.current.push(outputTimer)
      }
    }

    typeChar()
  }

  const handleRestart = () => {
    // Clear all timers first
    clearAllTimers()
    
    // Reset all state and refs
    isStartedRef.current = false
    currentCommandIndexRef.current = 0
    setIsStarted(false)
    setCurrentCommandIndex(0)
    setCurrentCommandText('')
    setCurrentOutput(null)
    setCompletedCommands([])
    setIsTyping(false)
    
    // Wait a moment then restart
    const restartTimer = setTimeout(() => {
      isStartedRef.current = true
      setIsStarted(true)
      startTyping()
    }, 150)
    timersRef.current.push(restartTimer)
  }

  const handleCopyCommands = async () => {
    // Collect all commands in order (without prompt)
    // Each command on a new line
    const commandsText = commands
      .map(cmd => cmd.command.trim()) // Remove any extra whitespace
      .filter(cmd => cmd.length > 0) // Remove empty commands
      .join('\n') // Join with newline - each command on its own line
    
    if (!commandsText) return // No commands to copy
    
    try {
      await navigator.clipboard.writeText(commandsText)
      // Show visual feedback
      setCopyFeedback(true)
      setTimeout(() => {
        setCopyFeedback(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy commands:', err)
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = commandsText
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        setCopyFeedback(true)
        setTimeout(() => {
          setCopyFeedback(false)
        }, 2000)
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr)
      }
      document.body.removeChild(textArea)
    }
  }

  return (
    <div ref={terminalRef} className="terminal-container my-6">
      <div className="terminal-window rounded-lg overflow-hidden border border-border/60 bg-[#0d1117] shadow-xl">
        {/* Terminal Header */}
        <div className="terminal-header flex items-center gap-2 px-4 py-2.5 bg-[#161b22] border-b border-border/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#28ca42]"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-xs text-muted-foreground font-mono">{title}</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={handleCopyCommands}
              className="terminal-copy-button flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all px-3 py-1.5 rounded-md font-medium relative"
              title="Copy all commands"
            >
              {copyFeedback ? (
                <>
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="hidden sm:inline text-green-500">Copied!</span>
                </>
              ) : (
                <>
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all px-3 py-1.5 rounded-md font-medium"
              title="Restart animation"
            >
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-3.582m-15.356-2A8.001 8.001 0 0015.418 15m0 0H9"
                />
              </svg>
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body p-4 font-mono text-sm">
          {/* Completed commands */}
          {completedCommands.map((index) => {
            const cmd = commands[index]
            return (
              <div key={index} className="mb-2">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-[#58a6ff] flex-shrink-0">{prompt}</span>
                  <span className="text-[#c9d1d9]">{cmd.command}</span>
                </div>
                {cmd.output && (
                  <div className="text-[#8b949e] ml-6 whitespace-pre-wrap">{cmd.output}</div>
                )}
              </div>
            )
          })}

          {/* Current typing command - only show if not completed yet */}
          {isStarted && 
           currentCommandIndex < commands.length && 
           !completedCommands.includes(currentCommandIndex) && (
            <div className="mb-2">
              <div className="flex items-start gap-2 mb-1">
                <span className="text-[#58a6ff] flex-shrink-0">{prompt}</span>
                <span className="text-[#c9d1d9]">
                  {currentCommandText}
                  {isTyping && <span className="terminal-cursor">▊</span>}
                </span>
              </div>
              {currentOutput && (
                <div className="text-[#8b949e] ml-6 whitespace-pre-wrap">{currentOutput}</div>
              )}
            </div>
          )}

          {/* Cursor when not typing */}
          {!isStarted && (
            <div className="flex items-center gap-2">
              <span className="text-[#58a6ff]">{prompt}</span>
              <span className="terminal-cursor">▊</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

