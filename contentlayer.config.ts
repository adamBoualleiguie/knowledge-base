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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace('docs/', ''),
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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (blog) => `/${blog._raw.flattenedPath}`,
    },
    slug: {
      type: 'string',
      resolve: (blog) => blog._raw.flattenedPath.replace('blog/', ''),
    },
  },
}))

export default makeSource({
  contentDirPath: './content',
  documentTypes: [Doc, Blog],
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

