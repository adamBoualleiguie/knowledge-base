import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export const Doc = defineDocumentType(() => ({
  name: 'Doc',
  filePathPattern: 'docs/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the document',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the document',
      required: false,
    },
    metaDescription: {
      type: 'string',
      description: 'The meta description for SEO',
      required: false,
    },
    publishedAt: {
      type: 'date',
      description: 'The date the document was published',
      required: true,
    },
    updatedAt: {
      type: 'date',
      description: 'The date the document was last updated',
      required: false,
    },
    order: {
      type: 'number',
      description: 'The display order of the document (lower numbers appear first)',
      required: false,
    },
    author: {
      type: 'string',
      description: 'The author of the document',
      required: false,
    },
    authorPhoto: {
      type: 'string',
      description: 'Path to the author photo (e.g., /assets/authors/author.jpg or just author.jpg)',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the document',
      required: false,
    },
    showMetadata: {
      type: 'boolean',
      description: 'Whether to show the metadata card on the right side',
      required: false,
      default: false,
    },
    heroMedia: {
      type: 'string',
      description: 'Path to hero image or video at the top of the document (e.g. assets/docs/hero/intro.jpg)',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => {
        // Convert spaces to hyphens and normalize the path for URL safety
        const normalizedPath = doc._raw.flattenedPath.replace(/\s+/g, '-')
        return `/${normalizedPath}`
      },
    },
    slug: {
      type: 'string',
      resolve: (doc) => {
        // Convert spaces to hyphens and remove 'docs/' prefix
        const normalizedPath = doc._raw.flattenedPath.replace(/\s+/g, '-')
        return normalizedPath.replace('docs/', '')
      },
    },
  },
}))

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      description: 'The title of the blog post',
      required: true,
    },
    description: {
      type: 'string',
      description: 'The description of the blog post',
      required: true,
    },
    publishedAt: {
      type: 'date',
      description: 'The date the blog post was published',
      required: true,
    },
    updatedAt: {
      type: 'date',
      description: 'The date the blog post was last updated',
      required: false,
    },
    author: {
      type: 'string',
      description: 'The author of the blog post',
      required: false,
    },
    authorPhoto: {
      type: 'string',
      description: 'Path to the author photo (e.g., /assets/authors/author.jpg or just author.jpg)',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Tags for the blog post',
      required: false,
    },
    heroMedia: {
      type: 'string',
      description: 'Path to hero image or video at the top of the post (e.g. assets/blogs/hero/documentation.jpg)',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (blog) => {
        // Convert spaces to hyphens and normalize the path for URL safety
        const normalizedPath = blog._raw.flattenedPath.replace(/\s+/g, '-')
        return `/${normalizedPath}`
      },
    },
    slug: {
      type: 'string',
      resolve: (blog) => {
        // Convert spaces to hyphens and remove 'blog/' prefix
        const normalizedPath = blog._raw.flattenedPath.replace(/\s+/g, '-')
        return normalizedPath.replace('blog/', '')
      },
    },
  },
}))

export const Certification = defineDocumentType(() => ({
  name: 'Certification',
  filePathPattern: 'certifications/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: {
      type: 'string',
      description: 'The name of the certification',
      required: true,
    },
    issuingOrganization: {
      type: 'string',
      description: 'The issuing organization',
      required: true,
    },
    issueDate: {
      type: 'string',
      description: 'The issue date',
      required: true,
    },
    credentialId: {
      type: 'string',
      description: 'The credential ID',
      required: false,
    },
    credentialUrl: {
      type: 'string',
      description: 'The credential URL',
      required: false,
    },
    skills: {
      type: 'list',
      of: { type: 'string' },
      description: 'Skills learned',
      required: false,
    },
    media: {
      type: 'string',
      description: 'Path to certification image',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (cert) => `/certifications`,
    },
    slug: {
      type: 'string',
      resolve: (cert) => cert._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}))

export const Career = defineDocumentType(() => ({
  name: 'Career',
  filePathPattern: 'careers/**/*.mdx',
  contentType: 'mdx',
  fields: {
    company: {
      type: 'string',
      description: 'Company or organization name',
      required: true,
    },
    role: {
      type: 'string',
      description: 'Job title or role',
      required: true,
    },
    startDate: {
      type: 'string',
      description: 'Start date (e.g. "January 2024")',
      required: true,
    },
    endDate: {
      type: 'string',
      description: 'End date (e.g. "Present" or "March 2026")',
      required: true,
    },
    location: {
      type: 'string',
      description: 'Location (city, country, or remote)',
      required: false,
    },
    tags: {
      type: 'list',
      of: { type: 'string' },
      description: 'Skills or technologies used in this role',
      required: false,
    },
    media: {
      type: 'string',
      description: 'Path to role/company image (e.g. public/assets/careers/logo.png)',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: () => `/certifications`,
    },
    slug: {
      type: 'string',
      resolve: (career) => career._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Doc, Blog, Certification, Career],
  disableImportAliasWarning: true, // Suppress the baseUrl warning
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          properties: {
            className: ['anchor'],
            'aria-label': 'Anchor link',
          },
          content: {
            type: 'element',
            tagName: 'svg',
            properties: {
              className: ['anchor-icon'],
              width: 16,
              height: 16,
              viewBox: '0 0 16 16',
              fill: 'none',
              xmlns: 'http://www.w3.org/2000/svg',
            },
            children: [
              {
                type: 'element',
                tagName: 'path',
                properties: {
                  d: 'M4.75 6.75h6.5m-6.5 0a2.5 2.5 0 0 0 0 5h6.5m0-5a2.5 2.5 0 0 1 0 5m0-5V4.5a2.5 2.5 0 0 0-5 0m5 7.25V11.5a2.5 2.5 0 0 1-5 0',
                  stroke: 'currentColor',
                  strokeWidth: 1.5,
                  strokeLinecap: 'round',
                  strokeLinejoin: 'round',
                },
              },
            ],
          },
        },
      ],
    ],
  },
})

