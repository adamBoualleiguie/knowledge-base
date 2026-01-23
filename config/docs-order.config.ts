/**
 * Global Documentation Ordering Configuration
 * 
 * This file controls the display order of all documentation sections, subsections, and documents.
 * 
 * How it works:
 * 1. Section Order: Controls the order of top-level sections (categories)
 * 2. Subsection Order: Controls the order of subsections within each section
 * 3. Document Order: Set via the `order` field in each document's frontmatter
 * 
 * If a section/subsection/document doesn't have an order specified, it will be sorted alphabetically at the end.
 */

export interface DocsOrderConfig {
  // Order of top-level sections (categories)
  sections: string[]
  
  // Order of subsections within each section
  subsections: Record<string, string[]>
}

export const docsOrderConfig: DocsOrderConfig = {
  // Top-level sections order
  sections: [
    'guide',
    'knowledge-base',
  ],
  
  // Subsection order within each section
  subsections: {
    'guide': [
      'overview',
      'getting-started',
      'adding-content',
      'features',
      'customization',
      'deployment',
    ],
    'knowledge-base': [
      'overview',
      'foundations',
      'platforms',
      'projects',
      'architectures',
      'cicd',
      'cloud',
      'toolbox',
      'notes-and-deep-dives',
    ],
  },
}

/**
 * Get the order index for a section
 */
export function getSectionOrder(section: string): number {
  const index = docsOrderConfig.sections.indexOf(section)
  return index === -1 ? 999 : index
}

/**
 * Get the order index for a subsection within a section
 */
export function getSubsectionOrder(section: string, subsection: string): number {
  const sectionSubsections = docsOrderConfig.subsections[section]
  if (!sectionSubsections) return 999
  
  const index = sectionSubsections.indexOf(subsection)
  return index === -1 ? 999 : index
}


