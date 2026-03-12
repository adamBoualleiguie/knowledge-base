/**
 * Deterministic sort for careers and certifications.
 * Used on the server so client receives a stable order (avoids hydration mismatch).
 */

const FAR_FUTURE_MS = new Date('2100-01-01').getTime()

function parseDateForSort(dateStr: string): number {
  if (!dateStr || dateStr.toLowerCase() === 'present') return FAR_FUTURE_MS
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? 0 : d.getTime()
}

export type CareerLike = { startDate: string; slug?: string | null }
export type CertLike = { issueDate: string; slug?: string | null }

/** Careers: newest first (reverse chronological), tie-break by slug */
export function sortCareersChronologically<T extends CareerLike>(careers: T[]): T[] {
  return [...careers].sort((a, b) => {
    const diff = parseDateForSort(b.startDate) - parseDateForSort(a.startDate)
    return diff !== 0 ? diff : (a.slug ?? '').localeCompare(b.slug ?? '')
  })
}

/** Certifications: newest first, tie-break by slug */
export function sortCertsNewestFirst<T extends CertLike>(certs: T[]): T[] {
  return [...certs].sort((a, b) => {
    const dateA = new Date(a.issueDate).getTime()
    const dateB = new Date(b.issueDate).getTime()
    const diff = dateB - dateA
    return diff !== 0 ? diff : (a.slug ?? '').localeCompare(b.slug ?? '')
  })
}
