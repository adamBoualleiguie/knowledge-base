import { allCertifications } from 'contentlayer/generated'
import { getBlogTagColor } from '@/lib/tag-colors'
import { Mdx } from '@/components/mdx-components'
import { ExternalLink, Calendar, Award } from 'lucide-react'
import { CertImage } from '@/components/CertImage'
import Link from 'next/link'

export const metadata = {
  title: 'Certifications | Knowledge Base',
  description: 'A timeline of my professional certifications and achievements.',
}

export default function CertificationsPage() {
  // Sort certifications by issueDate descending (newest first)
  const certs = [...allCertifications].sort((a, b) => {
    const dateA = new Date(a.issueDate)
    const dateB = new Date(b.issueDate)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 max-w-5xl">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
          Certification Catalogue
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A timeline of my professional certifications, continuous learning, and validated skills.
        </p>
      </div>

      <div className="relative border-l-2 border-border/50 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-16">
        {certs.map((cert, index) => (
          <div 
            key={cert._id} 
            id={cert.slug}
            className="relative group animate-fade-in scroll-mt-24 pt-8 sm:pt-10"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Timeline Marker (Dot + Date) */}
            <div className="absolute -left-[37px] sm:-left-[53px] top-0 flex items-center gap-4 z-10">
              <div className="h-6 w-6 rounded-full border-4 border-background bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-125 transition-transform duration-300 flex-shrink-0" />
              
              <div className="bg-background/80 backdrop-blur-sm border border-primary/30 text-primary px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-sm group-hover:bg-primary/10 group-hover:border-primary/60 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300 flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                {cert.issueDate}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl group-hover:-translate-y-1">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Image Section */}
                {cert.media && (
                  <div className="flex-shrink-0 w-full lg:w-1/3">
                    <div className="relative rounded-xl overflow-hidden border border-border/50 bg-background/50 aspect-[4/3] flex items-center justify-center p-4">
                      <CertImage src={cert.media} alt={cert.name} />
                    </div>
                  </div>
                )}

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 bg-accent/50 px-3 py-1 rounded-full border border-border/50">
                      <Award className="w-4 h-4 text-primary" />
                      {cert.issuingOrganization}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {cert.name}
                  </h2>

                  {/* Skills Pops */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {cert.skills.map(skill => (
                        <span 
                          key={skill}
                          className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${getBlogTagColor(skill)} hover:scale-105 transition-transform cursor-default`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-6">
                    <Mdx code={cert.body.code} />
                  </div>

                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors"
                    >
                      View Credential
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {certs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border">
            No certifications found.
          </div>
        )}
      </div>
    </div>
  )
}
