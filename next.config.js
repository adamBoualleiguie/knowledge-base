const { withContentlayer } = require('next-contentlayer')

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true' || process.env.NODE_ENV === 'production'
const basePath = isGitHubPagesBuild ? '/knowledge-base' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    mdxRs: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable static export for GitHub Pages / static hosting
  output: 'export',
  // Use the GitHub Pages repo subpath only for production/static deployments.
  // In local dev we keep the app at / so routes and assets behave naturally.
  basePath,
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

