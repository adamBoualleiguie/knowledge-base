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
  // Optional: Enable trailing slashes for better compatibility
  // trailingSlash: true,
}

module.exports = withContentlayer(nextConfig)

