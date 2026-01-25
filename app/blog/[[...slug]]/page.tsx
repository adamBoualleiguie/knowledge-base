import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { Mdx } from '@/components/mdx-components'
import { format, compareDesc } from 'date-fns'
import { MetadataCard } from '@/components/MetadataCard'
import { TableOfContents } from '@/components/TableOfContents'
import { calculateReadTime } from '@/lib/readTime'
import { DocsSearchBar } from '@/components/DocsSearchBar'

interface BlogPageProps {
  params: {
    slug?: string[]
  }
}

async function getBlogFromParams(params: BlogPageProps['params']) {
  const slug = params?.slug?.join('/')
  if (!slug) {
    return null
  }
  const blog = allBlogs.find((blog) => blog.slug === slug)
  return blog
}

export async function generateStaticParams() {
  // Generate params for all blogs
  const blogParams = allBlogs.map((blog) => ({
    slug: blog.slug.split('/'),
  }))
  
  // Also generate the root /blog route (empty slug)
  return [
    { slug: [] },
    ...blogParams,
  ]
}

export default async function BlogPage({ params }: BlogPageProps) {
  // If no slug, show blog listing
  if (!params?.slug || params.slug.length === 0) {
    const blogs = allBlogs.sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    )

    // Prepare blogs for search
    const blogsForSearch = blogs.map((blog) => ({
      title: blog.title,
      url: blog.url,
      slug: blog.slug,
      description: blog.description,
    }))

    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">Blog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Blog
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-6">
              Stay updated with product updates, company news, and articles on development, technology, and open-source tools.
            </p>
            {/* Search Bar */}
            <div className="max-w-2xl">
              <DocsSearchBar docs={blogsForSearch} />
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Featured Blog Posts</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {blogs.map((blog) => {
              const readTime = calculateReadTime(blog.body.raw || blog.body.code)
              return (
                <Link
                  key={blog._id}
                  href={blog.url}
                  className="group block p-6 border border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 hover:shadow-lg"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">{blog.title}</h2>
                  {blog.description && (
                    <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">{blog.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <time dateTime={blog.publishedAt}>
                      {format(new Date(blog.publishedAt), 'MMMM d, yyyy').toUpperCase()}
                    </time>
                    {blog.author && <span>by {blog.author}</span>}
                    {readTime > 0 && <span>{readTime} min read</span>}
                  </div>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-3">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-muted rounded-md text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Show individual blog post
  const blog = await getBlogFromParams(params)

  if (!blog) {
    notFound()
  }

  const readTime = calculateReadTime(blog.body.raw || blog.body.code)
  const updatedAt = blog.updatedAt || blog.publishedAt

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex gap-8 lg:gap-12">
        <article className="flex-1 max-w-3xl min-w-0">
          <div className="mb-10 pb-8 border-b border-border">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {blog.title}
            </h1>
            {blog.description && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">{blog.description}</p>
            )}
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20" id="blog-content">
            <Mdx code={blog.body.code} />
          </div>
        </article>
        {/* Right Sidebar: Metadata Card and Table of Contents */}
        <aside className="hidden xl:block flex-shrink-0">
          <div className="sticky top-20">
            <div className="mb-10">
              <MetadataCard
                author={blog.author}
                authorPhoto={blog.authorPhoto}
                readTime={readTime}
                publishedAt={blog.publishedAt}
                updatedAt={updatedAt}
                tags={blog.tags}
              />
            </div>
            <TableOfContents content={blog.body.raw || blog.body.code} />
          </div>
        </aside>
      </div>
    </div>
  )
}

