const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  // Enable static export for GitHub Pages / static hosting
  output: 'export',
  // IMPORTANT: Set basePath to match your repository name for GitHub Pages
  basePath: '/knowledge-base',
  // Enable trailing slashes for better GitHub Pages compatibility
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Disable image optimization for static export
    unoptimized: true,
  },
}

module.exports = withContentlayer(nextConfig)

