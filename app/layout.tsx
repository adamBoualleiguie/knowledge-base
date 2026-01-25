import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/SidebarContext'
import { ReadingProgress } from '@/components/ReadingProgress'
import { allDocs } from 'contentlayer/generated'

export const metadata: Metadata = {
  title: 'Knowledge Base - Adam',
  description: 'Personal portfolio, documentation, and blog',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
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
    // Include raw MDX content so search can match inside document body
    content: doc.body.raw || doc.body.code,
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
          <SidebarProvider>
            <Navigation docs={docsForSearch} />
            <ReadingProgress />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

