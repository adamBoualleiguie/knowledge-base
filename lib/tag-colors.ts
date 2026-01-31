/**
 * Get color classes for blog tags
 * Similar to documentation section/subsection colors
 */
export function getBlogTagColor(tag: string): string {
  // Normalize tag to lowercase for consistent matching
  const normalizedTag = tag.toLowerCase()
  
  // Color mapping for common blog tags
  const colorMap: Record<string, string> = {
    // Technology tags
    'nextjs': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'react': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'typescript': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'javascript': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    'nodejs': 'bg-green-500/10 text-green-400 border-green-500/30',
    'python': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'kubernetes': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    'docker': 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    
    // Development tags
    'web-development': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'frontend': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    'backend': 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    'fullstack': 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    'devops': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    
    // Project tags
    'portfolio': 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    'tutorial': 'bg-lime-500/10 text-lime-400 border-lime-500/30',
    'guide': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    
    // General tags
    'welcome': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    'introduction': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    'open-source': 'bg-green-500/10 text-green-400 border-green-500/30',
    'technology': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  }
  
  // Return mapped color or default
  return colorMap[normalizedTag] || 'bg-muted text-muted-foreground border-border'
}

