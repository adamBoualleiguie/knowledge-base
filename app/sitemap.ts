import { allDocs, allBlogs } from 'contentlayer/generated'
import type { MetadataRoute } from 'next'

const baseUrl = 'https://adamboualleiguie.github.io'
const basePath = '/knowledge-base'

function fullUrl(path: string): string {
  const normalized = path.endsWith('/') ? path : `${path}/`
  return `${baseUrl}${basePath}${normalized}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: fullUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: fullUrl('/blog/'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: fullUrl('/docs/'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: fullUrl('/certifications/'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]

  const docPages: MetadataRoute.Sitemap = allDocs.map((doc) => ({
    url: fullUrl(doc.url),
    lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const blogPages: MetadataRoute.Sitemap = allBlogs.map((blog) => ({
    url: fullUrl(blog.url),
    lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...docPages, ...blogPages]
}
