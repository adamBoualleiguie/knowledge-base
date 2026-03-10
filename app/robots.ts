import type { MetadataRoute } from 'next'

const baseUrl = 'https://adamboualleiguie.github.io'
const basePath = '/knowledge-base'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}${basePath}/sitemap.xml`,
  }
}
