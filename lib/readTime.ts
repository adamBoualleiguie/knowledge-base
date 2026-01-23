/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 * @param content - The content to calculate read time for (markdown or text)
 * @returns The estimated reading time in minutes
 */
export function calculateReadTime(content: string | undefined | null): number {
  if (!content || typeof content !== 'string') return 0
  
  // Remove markdown syntax for more accurate word count
  const text = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to just text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()
  
  const words = text.split(/\s+/).filter(word => word.length > 0).length
  const minutes = Math.ceil(words / 200)
  return minutes || 1 // Return at least 1 minute if there's any content
}

