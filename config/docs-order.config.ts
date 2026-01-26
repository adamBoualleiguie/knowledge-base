/**
 * Global Documentation Ordering Configuration
 * 
 * This file controls the display order of all documentation sections, subsections, and documents.
 * 
 * How it works:
 * 1. Section Order: Controls the order of top-level sections (categories)
 * 2. Subsection Order: Controls the order of subsections within each section
 * 3. Nested Subsection Order: Controls the order of subsections within subsections (subsection of subsection)
 * 4. Document Order: Set via the `order` field in each document's frontmatter
 * 
 * If a section/subsection/document doesn't have an order specified, it will be sorted alphabetically at the end.
 * 
 * Nested Subsection Ordering:
 * To order nested subsections (subsection of subsection), use dot notation in nestedSubsections:
 * 
 * Example: If you have Knowledge-base/foundations/Linux/ and Knowledge-base/foundations/Windows/
 * Add to nestedSubsections:
 *   'Knowledge-base.foundations': ['Linux', 'Windows', 'macOS']
 * 
 * The format is: 'section.subsection': ['nested-subsection1', 'nested-subsection2', ...]
 */

export interface DocsOrderConfig {
  // Order of top-level sections (categories)
  sections: string[]
  
  // Order of subsections within each section
  // Supports nested subsections using dot notation: 'subsection.nested-subsection'
  subsections: Record<string, string[]>
  
  // Order of nested subsections (subsection of subsection)
  // Format: 'section.subsection': ['nested-subsection1', 'nested-subsection2']
  nestedSubsections?: Record<string, string[]>
}

export const docsOrderConfig: DocsOrderConfig = {
  // Top-level sections order
  // Note: Use normalized names (spaces converted to hyphens) to match Contentlayer slugs
  sections: [
    'Documentation-guide',
    'Knowledge-base',
  ],
  
  // Subsection order within each section
  subsections: {
    'Documentation-guide': [
      'overview',
      'getting-started',
      'adding-content',
      'features',
      'customization',
      'deployment',
    ],
    'Knowledge-base': [
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
  
  // Nested subsection order (subsection of subsection)
  // Format: 'section.subsection': ['nested-subsection1', 'nested-subsection2']
  // Example: If you have Knowledge-base/foundations/Linux/, you would add:
  // 'Knowledge-base.foundations': ['Linux', 'Windows', 'macOS']
  nestedSubsections: {
    // Example: Order nested subsections within 'foundations' subsection of 'Knowledge-base'
    // 'Knowledge-base.foundations': [
    //   'Linux',
    //   'Windows',
    //   'macOS',
    // ],
    // 
    // Example: Order nested subsections within 'getting-started' subsection of 'Documentation-guide'
    // 'Documentation-guide.getting-started': [
    //   'overview',
    //   'first-document',
    //   'structure',
    // ],
    'Knowledge-base.foundations.foundations': [
      'Linux',
      'Windows',
      'macOS',
    ],
    'Knowledge-base.architectures': [
      'System-design',
    ],
    'Knowledge-base.CICD': [
      'Git',
      'Github',
    ],
    'Knowledge-base.toolbox': [
      'Lab-tools',
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
 * Supports nested subsections using dot notation path
 * 
 * Examples:
 * - getSubsectionOrder('Knowledge-base', 'foundations') -> checks 'Knowledge-base' subsections
 * - getSubsectionOrder('Knowledge-base', 'Linux', 'foundations') -> checks 'Knowledge-base.foundations' nested subsections
 * - getSubsectionOrder('Knowledge-base', 'Linux', 'foundations.foundations') -> checks 'Knowledge-base.foundations.foundations' nested subsections
 */
export function getSubsectionOrder(section: string, subsection: string, parentPath?: string): number {
  // If we have a parent path, check nested subsections first
  if (parentPath && docsOrderConfig.nestedSubsections) {
    // Build the nested path: section.parentPath (e.g., "Knowledge-base.foundations.foundations")
    const nestedPath = `${section}.${parentPath}`
    const nestedSubsections = docsOrderConfig.nestedSubsections[nestedPath]
    if (nestedSubsections) {
      const index = nestedSubsections.indexOf(subsection)
      if (index !== -1) return index
    }
    
    // Also try checking if parentPath itself is a nested path we should check
    // This handles cases where we need to check intermediate levels
    const parentParts = parentPath.split('.')
    if (parentParts.length > 1) {
      // Try checking with just the last part of the parent path
      const lastParent = parentParts[parentParts.length - 1]
      const intermediatePath = `${section}.${lastParent}`
      const intermediateSubsections = docsOrderConfig.nestedSubsections[intermediatePath]
      if (intermediateSubsections) {
        const index = intermediateSubsections.indexOf(subsection)
        if (index !== -1) return index
      }
    }
  }
  
  // Check regular subsections (first-level subsections)
  const sectionSubsections = docsOrderConfig.subsections[section]
  if (!sectionSubsections) return 999
  
  const index = sectionSubsections.indexOf(subsection)
  return index === -1 ? 999 : index
}


