import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ReadingProgress } from '@/components/ReadingProgress'
import { allDocs } from 'contentlayer/generated'

export const metadata: Metadata = {
  title: 'Knowledge Base - Adam',
  description: 'Personal portfolio, documentation, and blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Prepare docs data for search
  const docsForSearch = allDocs.map((doc) => ({
    title: doc.title,
    url: doc.url,
    slug: doc.slug,
    description: doc.description,
  }))

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation docs={docsForSearch} />
          <ReadingProgress />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

