# Portfolio Website

A modern portfolio website built with Next.js, Contentlayer, and Tailwind CSS, inspired by the SigNoz.io design.

## Features

- 📝 **Documentation** - Write and manage documentation in MDX format
- ✍️ **Blog** - Create and publish blog posts
- 🎨 **Modern Design** - Clean and professional UI similar to SigNoz.io
- 📱 **Responsive** - Works seamlessly on all devices
- 🌙 **Dark Mode** - Automatic dark mode support
- 📄 **CV Download** - Easy CV download functionality

## Tech Stack

- **Next.js 14** - React framework with App Router
- **Contentlayer** - Content management for MDX files
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development
- **MDX** - Markdown with React components

## Getting Started

### Prerequisites

- Node.js 20.19.4 (use NVM to manage versions)
- Yarn package manager

### Installation

1. Install Node.js version:
   ```bash
   nvm install
   nvm use
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Run development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── blog/              # Blog pages
│   ├── docs/              # Documentation pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navigation.tsx     # Main navigation
│   ├── Footer.tsx         # Footer component
│   ├── DocsSidebar.tsx    # Documentation sidebar
│   └── mdx-components.tsx # MDX rendering
├── content/               # Content files (MDX)
│   ├── docs/             # Documentation files
│   └── blog/             # Blog posts
├── public/                # Static assets
│   └── assets/           # All static assets
│       ├── docs/         # Documentation assets
│       ├── blog/         # Blog post assets
│       └── general/      # Shared assets (CV, etc.)
│           └── pdfs/
│               └── cv.pdf  # CV file (replace with your own)
└── contentlayer.config.ts # Contentlayer configuration
```

## Adding Content

### Adding Documentation

1. Create a new `.mdx` file in `content/docs/`
2. Add frontmatter:
   ```mdx
   ---
   title: Your Document Title
   description: A brief description
   publishedAt: 2024-01-01
   ---
   ```
3. Write your content in Markdown/MDX
4. The document will automatically appear in the docs section

### Adding Blog Posts

1. Create a new `.mdx` file in `content/blog/`
2. Add frontmatter:
   ```mdx
   ---
   title: Your Blog Post Title
   description: A brief description
   publishedAt: 2024-01-01
   author: Your Name
   tags: [tag1, tag2]
   ---
   ```
3. Write your content in Markdown/MDX
4. The post will automatically appear in the blog section

### Adding Your CV

1. Replace `public/assets/general/pdfs/cv.pdf` with your actual CV file
2. The download button in the navigation will automatically work

## Customization

### Updating Site Metadata

Edit `app/layout.tsx` to update:
- Site title
- Site description
- Other metadata

### Customizing Colors

Edit `app/globals.css` to customize the color scheme.

### Updating Navigation

Edit `components/Navigation.tsx` to add/remove navigation items.

### Updating Footer

Edit `components/Footer.tsx` to update footer links and information.

## Building for Production

```bash
yarn build
yarn start
```

## Deployment

This site can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Any static hosting service**

## License

MIT

