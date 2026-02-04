import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { Mdx } from '@/components/mdx-components'
import { format, compareDesc } from 'date-fns'
import { MetadataCard } from '@/components/MetadataCard'
import { TableOfContents } from '@/components/TableOfContents'
import { calculateReadTime } from '@/lib/readTime'
import { DocsSearchBar } from '@/components/DocsSearchBar'
import { getBlogTagColor } from '@/lib/tag-colors'
import type { Metadata as NextMetadata } from 'next'

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

// Base URL for Open Graph images and links
const baseUrl = 'https://adamboualleiguie.github.io'
const basePath = '/knowledge-base'
const siteName = 'Knowledge Base - Adam Boualleiguie'

// Generate metadata for Open Graph and Twitter Cards
export async function generateMetadata({ params }: BlogPageProps): Promise<NextMetadata> {
  // If no slug, it's the blog listing page
  if (!params?.slug || params.slug.length === 0) {
    const blogListingUrl = `${baseUrl}${basePath}/blog/`
    const ogImage = `${baseUrl}${basePath}/og-image.png`
    
    return {
      title: `Blog | ${siteName}`,
      description: 'Stay updated with product updates, company news, and articles on development, technology, and open-source tools.',
      openGraph: {
        type: 'website',
        url: blogListingUrl,
        title: `Blog | ${siteName}`,
        description: 'Stay updated with product updates, company news, and articles on development, technology, and open-source tools.',
        siteName: siteName,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: 'Knowledge Base Blog',
          },
        ],
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `Blog | ${siteName}`,
        description: 'Stay updated with product updates, company news, and articles on development, technology, and open-source tools.',
        images: [ogImage],
      },
      alternates: {
        canonical: blogListingUrl,
      },
    }
  }

  // Individual blog post
  const blog = await getBlogFromParams(params)
  
  if (!blog) {
    return {
      title: 'Blog Post',
      description: 'Blog post from Knowledge Base',
    }
  }

  const blogUrl = `${baseUrl}${basePath}${blog.url}`
  const blogTitle = blog.title
  const blogDescription = blog.description || `${blogTitle} - Blog post from Knowledge Base`
  const ogImage = `${baseUrl}${basePath}/og-image.png`

  return {
    title: `${blogTitle} | ${siteName}`,
    description: blogDescription,
    authors: blog.author ? [{ name: blog.author }] : undefined,
    openGraph: {
      type: 'article',
      url: blogUrl,
      title: blogTitle,
      description: blogDescription,
      siteName: siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blogTitle,
        },
      ],
      locale: 'en_US',
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt || blog.publishedAt,
      authors: blog.author ? [blog.author] : undefined,
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: blogTitle,
      description: blogDescription,
      images: [ogImage],
      creator: blog.author ? `@${blog.author.replace(/\s+/g, '')}` : undefined,
    },
    alternates: {
      canonical: blogUrl,
    },
  }
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
                          className={`px-2.5 py-1 text-xs font-medium rounded-md border ${getBlogTagColor(tag)}`}
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

