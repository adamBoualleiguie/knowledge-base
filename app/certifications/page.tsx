import { allCertifications, allCareers } from 'contentlayer/generated'
import { sortCareersChronologically, sortCertsNewestFirst } from '@/lib/career-sort'
import { CareerCertificationsView } from './CareerCertificationsView'

export const metadata = {
  title: 'Career & Certifications | Knowledge Base',
  description: 'A timeline of my professional experience, certifications, and validated skills.',
}

export default function CertificationsPage() {
  const sortedCerts = sortCertsNewestFirst(allCertifications)
  const sortedCareers = sortCareersChronologically(allCareers)
  return <CareerCertificationsView certs={sortedCerts} careers={sortedCareers} />
}
