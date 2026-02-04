import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/SidebarContext'
import { ReadingProgress } from '@/components/ReadingProgress'
import { PageLoader } from '@/components/PageLoader'
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
        {/* Fix favicon paths to respect basePath */}
        <Script
          id="fix-favicon"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const path = window.location.pathname;
                const basePath = path.startsWith('/knowledge-base') ? '/knowledge-base' : '';
                
                // Remove existing favicon links
                document.querySelectorAll('link[rel="icon"], link[rel="apple-touch-icon"]').forEach(link => link.remove());
                
                // Add favicon with correct basePath
                const faviconLink = document.createElement('link');
                faviconLink.rel = 'icon';
                faviconLink.type = 'image/svg+xml';
                faviconLink.href = basePath + '/favicon.svg';
                document.head.appendChild(faviconLink);
                
                // Add apple touch icon with correct basePath
                const appleLink = document.createElement('link');
                appleLink.rel = 'apple-touch-icon';
                appleLink.sizes = '180x180';
                appleLink.type = 'image/svg+xml';
                appleLink.href = basePath + '/apple-touch-icon.svg';
                document.head.appendChild(appleLink);
              })();
            `,
          }}
        />
        {/* Cloudflare Web Analytics */}
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "9c1ec2f6b17d48b482ca36c68dbb0fe1"}'
          strategy="afterInteractive"
        />
        {/* End Cloudflare Web Analytics */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <PageLoader />
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

