import Link from 'next/link'
import { allDocs, allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export default function Home() {
  const latestBlogs = allBlogs
    .sort((a, b) => compareDesc(new Date(a.publishedAt), new Date(b.publishedAt)))
    .slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Welcome to My Portfolio
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
          Developer, Writer, and Problem Solver. Explore my work, read my documentation,
          and check out my latest blog posts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link
            href="/docs"
            className="px-8 py-3.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            View Documentation
          </Link>
          <a
            href="/assets/general/pdfs/cv.pdf"
            download
            className="px-8 py-3.5 border-2 border-border rounded-lg hover:bg-accent transition-all duration-200 font-medium hover:border-primary/50"
          >
            Download CV
          </a>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {latestBlogs.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Latest Blog Posts</h2>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {latestBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={blog.url}
                className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">{blog.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{blog.description}</p>
                <time className="text-sm text-muted-foreground">
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
              </Link>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              View all posts
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 bg-muted/30">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <Link
            href="/docs"
            className="group p-8 border border-border rounded-xl hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Documentation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive guides and documentation for my projects and work.
            </p>
          </Link>
          <Link
            href="/blog"
            className="group p-8 border border-border rounded-xl hover:border-primary/50 hover:bg-background transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Blog</h3>
            <p className="text-muted-foreground leading-relaxed">
              Thoughts, tutorials, and insights on development and technology.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}

