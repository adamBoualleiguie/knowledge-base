# AI Documentation System Guide

This is a comprehensive guide for AI systems to create MDX documentation files for this Knowledge Base website. Use this guide to understand all available features, syntax, and best practices.

## Table of Contents

1. [Document Structure](#document-structure)
2. [Frontmatter Fields](#frontmatter-fields)
3. [Available Components](#available-components)
4. [Content Features](#content-features)
5. [File Organization](#file-organization)
6. [Best Practices](#best-practices)
7. [Complete Examples](#complete-examples)

---

## Document Structure

### Documentation Files

Documentation files are located in `content/docs/` and follow a hierarchical structure that supports **unlimited nesting levels**:

```
content/docs/
├── section-name/                    # Section (top level)
│   ├── overview.mdx                 # Makes section title clickable
│   ├── document.mdx                 # Document directly in section
│   └── subsection-name/             # Subsection (second level)
│       ├── document1.mdx
│       ├── document2.mdx
│       └── nested-subsection/       # Subsection of subsection (third level)
│           ├── document3.mdx
│           └── deeper-nested/       # Even deeper nesting (fourth level)
│               └── document4.mdx
```

**URL Structure:**
- `content/docs/guide/overview.mdx` → `/docs/guide/overview`
- `content/docs/guide/getting-started/structure.mdx` → `/docs/guide/getting-started/structure`
- `content/docs/guide/getting-started/advanced/optimization.mdx` → `/docs/guide/getting-started/advanced/optimization`

**Note:** 
- Spaces in folder names are automatically converted to hyphens in URLs (e.g., "Documentation guide" → "Documentation-guide")
- You can nest subsections as deep as needed - the sidebar will automatically handle the hierarchy
- Each nesting level is properly indented and collapsible in the sidebar

### Blog Post Files

Blog posts are located in `content/blog/`:

```
content/blog/
├── post-name.mdx
└── 2024/
    └── january/
        └── another-post.mdx
```

**URL Structure:**
- `content/blog/my-post.mdx` → `/blog/my-post`
- `content/blog/2024/january/post.mdx` → `/blog/2024/january/post`

---

## Frontmatter Fields

### Required Fields (All Documents)

```yaml
---
title: Document Title
description: Brief description (appears in listings and meta tags)
publishedAt: 2024-01-15  # Format: YYYY-MM-DD
---
```

### Optional Fields (Documentation)

```yaml
---
title: Document Title
description: Brief description
publishedAt: 2024-01-15
updatedAt: 2024-01-20      # Last update date
order: 1                   # Display order (lower = first)
author: Author Name        # Author name
authorPhoto: author.jpg    # Author photo filename (in /assets/authors/)
tags: [tag1, tag2]         # Array of tags
showMetadata: true         # Show metadata card (default: false for docs)
---
```

### Optional Fields (Blog Posts)

```yaml
---
title: Blog Post Title
description: Brief description
publishedAt: 2024-01-15
updatedAt: 2024-01-20      # Last update date
author: Author Name        # Author name
authorPhoto: author.jpg    # Author photo filename
tags: [tag1, tag2, tag3]   # Array of tags
---
```

**Note:** Blog posts automatically show metadata cards. Documentation requires `showMetadata: true`.

---

## Available Components

### 1. Callout Components

Styled information boxes with 6 types:

**Syntax:**
```mdx
<Callout type="info" title="Optional Title">
Your content here. Supports markdown:
- Lists
- **Bold text**
- `Inline code`
- [Links](/docs/guide/overview)
</Callout>
```

**Available Types:**
- `info` (default) - Blue background - General information
- `success` - Green background - Success messages
- `warning` - Yellow background - Warnings, cautions
- `error` - Red background - Error messages
- `note` - Purple background - Additional notes, tips
- `danger` - Red background - Critical warnings

**Examples:**
```mdx
<Callout type="info" title="Tip">
This is a helpful tip for readers.
</Callout>

<Callout type="warning" title="Before You Begin">
Make sure you have Node.js 20.19.4 or higher installed.
</Callout>

<Callout type="success" title="Installation Complete">
Your application is now running!
</Callout>
```

### 2. Excalidraw Diagrams

Interactive diagrams with zoom and fullscreen support.

**Syntax:**
```mdx
<ExcalidrawDiagram 
  src="/assets/docs/path/to/diagram.excalidraw"
  caption="Optional caption text"
  initialZoom={0.5}
  alt="Optional alt text for accessibility"
/>
```

**Props:**
- `src` (required): Path to `.excalidraw` file (relative to `public/`)
- `caption` (optional): Caption displayed below diagram
- `initialZoom` (optional): Initial zoom level (default: 1, use 0.5 for large diagrams)
- `alt` (optional): Alt text for accessibility

**Example:**
```mdx
<ExcalidrawDiagram 
  src="/assets/docs/architectures/system-architecture.excalidraw"
  caption="Complete system architecture"
  initialZoom={0.5}
/>
```

**File Location:** Save `.excalidraw` files in `public/assets/docs/`

### 3. Tabbed Content

Multi-tab sections for different methods/interfaces.

**Syntax:**
```mdx
<TabbedContent>
  <TabPanel id="unique-id-1" label="Tab Label 1">
    Content for tab 1.
    
    You can include:
    - Headings (H2, H3, H4 appear in TOC)
    - Code blocks
    - Callouts
    - Any markdown/MDX
  </TabPanel>
  
  <TabPanel id="unique-id-2" label="Tab Label 2">
    Content for tab 2.
  </TabPanel>
</TabbedContent>
```

**Props:**
- `id` (required): Unique identifier for each tab
- `label` (required): Text displayed on tab button

**Example:**
```mdx
<TabbedContent>
  <TabPanel id="docker" label="Docker">
    ### Docker Installation
    
    ```bash
    docker run -d -p 3000:3000 myapp
    ```
  </TabPanel>
  
  <TabPanel id="kubernetes" label="Kubernetes">
    ### Kubernetes Installation
    
    ```yaml
    apiVersion: v1
    kind: Pod
    # ...
    ```
  </TabPanel>
</TabbedContent>
```

**Note:** Headings inside tabs automatically appear in the Table of Contents when that tab is active.

### 4. Code Blocks

Enhanced code blocks with syntax highlighting and copy functionality.

**Syntax:**
```mdx
```language
Your code here
```
```

**With Filename:**
```mdx
```language:filename
Your code here
```
```

**Supported Languages:**
- `bash`, `sh`, `zsh` - Shell scripts
- `yaml`, `yml` - YAML files
- `json` - JSON data
- `javascript`, `js`, `typescript`, `ts`, `tsx`, `jsx` - JavaScript/TypeScript
- `python`, `py` - Python
- `java` - Java
- `c`, `cpp`, `c++` - C/C++
- `go` - Go
- `rust`, `rs` - Rust
- `ruby`, `rb` - Ruby
- `php` - PHP
- `sql` - SQL
- `html`, `css` - HTML/CSS
- `dockerfile`, `docker` - Docker
- And many more!

**Examples:**
```mdx
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
```

```mdx
```bash:install.sh
#!/bin/bash
yarn install
yarn dev
```
```

**Features:**
- Automatic syntax highlighting
- Copy button (appears on hover)
- Language badge
- Filename display (when specified)
- Dark theme support

### 5. Images

Enhanced image component with hover effects and fullscreen.

**Syntax:**
```mdx
<DocImage
  src="/assets/docs/images/screenshot.png"
  alt="Description of the image"
  caption="Optional caption text"
  width={1200}    # Optional: width in pixels
  height={800}    # Optional: height in pixels
/>
```

**Props:**
- `src` (required): Path to image (relative to `public/`)
- `alt` (required): Alt text for accessibility
- `caption` (optional): Caption displayed below image
- `width` (optional): Image width in pixels
- `height` (optional): Image height in pixels

**Example:**
```mdx
<DocImage
  src="/assets/docs/images/dashboard.png"
  alt="Monitoring dashboard"
  caption="Example monitoring dashboard showing system metrics"
/>
```

**File Location:** `public/assets/docs/images/` (for docs) or `public/assets/blog/images/` (for blog)

**Features:**
- Hover zoom effect
- Click for fullscreen
- Maintains aspect ratio
- Responsive design

### 6. Videos

Enhanced video component with controls and poster images.

**Syntax:**
```mdx
<DocVideo
  src="/assets/docs/videos/tutorial.mp4"
  poster="/assets/docs/images/video-thumbnail.png"
  caption="Optional caption text"
  controls
  autoplay    # Optional
  loop        # Optional
  muted       # Optional
/>
```

**Props:**
- `src` (required): Path to video file (relative to `public/`)
- `poster` (optional): Path to poster/thumbnail image
- `caption` (optional): Caption displayed below video
- `controls` (optional): Show video controls
- `autoplay` (optional): Auto-play video
- `loop` (optional): Loop video
- `muted` (optional): Mute video

**Example:**
```mdx
<DocVideo
  src="/assets/docs/videos/installation.mp4"
  poster="/assets/docs/images/install-thumb.png"
  caption="Complete installation tutorial"
  controls
/>
```

**File Location:** `public/assets/docs/videos/` (for docs) or `public/assets/blog/videos/` (for blog)

---

## Content Features

### Standard Markdown

All standard markdown features are supported:

```mdx
# H1 Heading (page title, don't use in content)
## H2 Heading (appears in TOC)
### H3 Heading (appears in TOC)
#### H4 Heading (appears in TOC)

**Bold text**
*Italic text*
`inline code`

- Unordered list
- Item 2
- Item 3

1. Ordered list
2. Item 2
3. Item 3

[Link text](/docs/guide/overview)
![Alt text](/path/to/image.png)
```

### Table of Contents

Automatically generated from H2, H3, and H4 headings. Appears in the right sidebar on desktop.

**Note:** Headings inside callouts are excluded from TOC.

### Metadata Card

Displays author, read time, last updated, and tags in a sidebar card.

**For Blog Posts:** Automatically displayed (no configuration needed)

**For Documentation:** Enable with `showMetadata: true` in frontmatter

**Author Photos:**
- Place photos in `public/assets/authors/`
- Reference in frontmatter: `authorPhoto: author-name.jpg`
- Supported formats: JPG, PNG, WebP
- Displayed as circular profile picture

**Example:**
```yaml
---
title: My Document
author: John Doe
authorPhoto: john-doe.jpg
tags: [tutorial, guide]
showMetadata: true
---
```

---

## File Organization

### Documentation Structure

The structure supports **unlimited nesting levels** (subsection of subsection, etc.):

```
content/docs/
├── section-name/
│   ├── overview.mdx              # Makes section clickable
│   ├── document1.mdx             # Direct document
│   └── subsection-name/
│       ├── document2.mdx
│       ├── document3.mdx
│       └── nested-subsection/    # Subsection of subsection (third level)
│           ├── document4.mdx
│           └── deeper-level/     # Even deeper nesting (fourth level)
│               └── document5.mdx
```

**Creating Nested Subsections:**

Simply create nested folders - the sidebar will automatically handle the hierarchy:

```bash
# Create a subsection of a subsection
mkdir -p content/docs/section/subsection/nested-subsection

# Create a document in the nested subsection
touch content/docs/section/subsection/nested-subsection/my-doc.mdx
```

**Result in Sidebar:**
- 📁 Section (collapsible)
  - 📁 Subsection (collapsible)
    - 📁 Nested Subsection (collapsible)
      - 📄 My Doc

Each level is properly indented and collapsible. You can nest as deep as needed!

### Asset Organization

```
public/assets/
├── docs/                      # Documentation assets
│   ├── images/
│   │   ├── installation/
│   │   └── api/
│   ├── videos/
│   │   └── tutorials/
│   └── other/                 # Excalidraw diagrams
│       └── diagram.excalidraw
├── blog/                      # Blog post assets
│   ├── images/
│   └── videos/
└── authors/                   # Author photos
    └── author-name.jpg
```

### Naming Conventions

- **Files:** Use lowercase with hyphens: `my-document.mdx`
- **Folders:** Use lowercase with hyphens: `getting-started/`
- **Images:** Use descriptive names: `dashboard-overview.png`
- **Author Photos:** Use lowercase with hyphens: `john-doe.jpg`

---

## Best Practices

### Document Structure

1. **Use descriptive titles:** Clear, specific titles help users find content
2. **Add descriptions:** Brief descriptions appear in listings and search
3. **Structure with headings:** Use H2, H3, H4 for clear hierarchy
4. **Create overview pages:** Add `overview.mdx` to make section titles clickable
5. **Use order field:** Control display order with `order` in frontmatter

### Content Writing

1. **Use callouts sparingly:** Highlight important information, don't overuse
2. **Include examples:** Code examples and screenshots improve understanding
3. **Link between docs:** Use internal links to connect related content
4. **Add alt text:** Always provide descriptive alt text for images
5. **Use appropriate callout types:** Match callout type to message importance

### Code Examples

1. **Always specify language:** Helps with syntax highlighting
2. **Use filenames:** Include filename when showing file contents
3. **Keep focused:** Don't make code blocks too long
4. **Test your code:** Ensure examples actually work
5. **Add comments:** Explain complex code with comments

### Media Files

1. **Optimize images:** Keep file sizes reasonable (max 2MB recommended)
2. **Use appropriate formats:** PNG for screenshots, JPG for photos, SVG for icons
3. **Add captions:** Help readers understand what images show
4. **Organize logically:** Group related assets in subdirectories
5. **Compress videos:** Keep video files reasonable (max 50MB recommended)

### Metadata

1. **Include updatedAt:** Helps readers know when content was last updated
2. **Use relevant tags:** Tags help with discoverability
3. **Add author info:** Especially useful for team documentation
4. **Include author photos:** Makes content more personal and professional
5. **Enable selectively:** Only enable `showMetadata` for important docs

---

## Complete Examples

### Example 1: Installation Guide (Documentation)

```mdx
---
title: Installation Guide
description: Step-by-step installation instructions
publishedAt: 2024-01-15
updatedAt: 2024-01-20
order: 2
author: Development Team
tags: [installation, setup, guide]
showMetadata: true
---

# Installation Guide

This guide will help you install the project on your system.

## Prerequisites

<Callout type="info" title="Before You Begin">
Make sure you have the following installed:
- Node.js 20.19.4 or higher
- Yarn package manager
- Git
</Callout>

### System Requirements

- **Operating System:** macOS, Linux, or Windows
- **Node.js:** 20.19.4 or higher
- **Memory:** 4GB RAM minimum
- **Disk Space:** 2GB free space

## Installation Methods

Choose the method that works best for your environment:

<TabbedContent>
  <TabPanel id="quick-start" label="Quick Start">
    ### Quick Start
    
    Get up and running in minutes:
    
    ```bash
    npx create-myapp@latest
    cd myapp
    npm run dev
    ```
    
    <Callout type="success" title="Ready!">
    Your application is now running at `http://localhost:3000`
    </Callout>
  </TabPanel>
  
  <TabPanel id="docker" label="Docker">
    ### Docker Installation
    
    Run with Docker:
    
    ```bash
    docker pull myapp:latest
    docker run -d -p 3000:3000 myapp:latest
    ```
    
    ### Docker Compose
    
    For a complete setup:
    
    ```yaml:docker-compose.yml
    version: '3.8'
    services:
      app:
        image: myapp:latest
        ports:
          - "3000:3000"
        environment:
          - NODE_ENV=production
    ```
  </TabPanel>
</TabbedContent>

## Step-by-Step Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

### Step 2: Install Dependencies

```bash
yarn install
```

<Callout type="warning" title="Common Issue">
If you encounter permission errors, try using `sudo` on macOS/Linux or run as administrator on Windows.
</Callout>

### Step 3: Verify Installation

<DocImage
  src="/assets/docs/images/installation/verify.png"
  alt="Verification screen"
  caption="Check that installation was successful"
/>

## Architecture Overview

<ExcalidrawDiagram 
  src="/assets/docs/other/system-architecture.excalidraw"
  caption="Complete system architecture"
  initialZoom={0.5}
/>

## Troubleshooting

<Callout type="error" title="Build Fails">
If the build fails, check:
1. Node.js version (should be 20.19.4 or higher)
2. All dependencies are installed
3. No syntax errors in your code
</Callout>

## Next Steps

- [Configuration Guide](/docs/guide/customization/overview)
- [Getting Started](/docs/guide/getting-started/overview)
```

### Example 2: Blog Post

```mdx
---
title: Building a Modern Portfolio Website
description: Learn how I built this portfolio website using Next.js and Contentlayer
publishedAt: 2024-01-20
updatedAt: 2024-01-25
author: John Doe
authorPhoto: john-doe.jpg
tags: [nextjs, web-development, portfolio, tutorial]
---

# Building a Modern Portfolio Website

In this post, I'll share how I built my portfolio website using Next.js 14 and Contentlayer.

## Introduction

Building a modern portfolio website requires careful consideration of design, performance, and user experience. I chose Next.js 14 for its excellent developer experience and Contentlayer for content management.

## Why Next.js 14?

Next.js 14 brings several exciting features:

### App Router

The App Router provides a new way to structure applications:

```typescript:app/page.tsx
export default function Home() {
  return <h1>Welcome to My Portfolio</h1>
}
```

### Server Components

Server Components allow server-side rendering:

```typescript:app/components/ServerComponent.tsx
export default async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* Render data */}</div>
}
```

## Key Features

<Callout type="info" title="Feature Highlights">
My portfolio includes:
- Dark mode support
- Responsive design
- Fast page loads
- SEO optimization
</Callout>

## Screenshots

<DocImage
  src="/assets/blog/images/portfolio-homepage.png"
  alt="Portfolio homepage"
  caption="The homepage of my portfolio website"
/>

## Conclusion

Building this portfolio was a great learning experience. Next.js 14 and Contentlayer made it easy to create a fast, modern website.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Contentlayer Documentation](https://www.contentlayer.dev/)
```

### Example 3: API Documentation

```mdx
---
title: API Reference
description: Complete API reference documentation
publishedAt: 2024-01-01
updatedAt: 2024-01-15
order: 1
author: API Team
tags: [api, reference, documentation]
showMetadata: true
---

# API Reference

Complete reference for all API endpoints.

## Authentication

<Callout type="warning" title="API Key Required">
All API requests require an API key in the `Authorization` header.
</Callout>

## Endpoints

### Get User

<TabbedContent>
  <TabPanel id="rest" label="REST API">
    ```bash
    curl -X GET https://api.example.com/v1/users/123 \
      -H "Authorization: Bearer YOUR_API_KEY"
    ```
  </TabPanel>
  
  <TabPanel id="graphql" label="GraphQL">
    ```graphql
    query {
      user(id: "123") {
        id
        name
        email
      }
    }
    ```
  </TabPanel>
</TabbedContent>

## Response Format

```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

## Error Handling

<Callout type="error" title="Error Response">
If an error occurs, the API returns:
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```
</Callout>
```

---

## Quick Reference

### Component Syntax Summary

| Component | Syntax | Required Props |
|-----------|--------|----------------|
| Callout | `<Callout type="info" title="Title">Content</Callout>` | `type` |
| ExcalidrawDiagram | `<ExcalidrawDiagram src="/path/to/file.excalidraw" />` | `src` |
| TabbedContent | `<TabbedContent><TabPanel id="id" label="Label">Content</TabPanel></TabbedContent>` | `id`, `label` |
| DocImage | `<DocImage src="/path/to/image.png" alt="Description" />` | `src`, `alt` |
| DocVideo | `<DocVideo src="/path/to/video.mp4" controls />` | `src` |
| Code Block | ` ```language\ncode\n``` ` | language |

### Frontmatter Quick Reference

**Required:**
- `title` - Document title
- `description` - Brief description
- `publishedAt` - Publication date (YYYY-MM-DD)

**Optional:**
- `updatedAt` - Last update date
- `order` - Display order (lower = first)
- `author` - Author name
- `authorPhoto` - Author photo filename
- `tags` - Array of tags
- `showMetadata` - Show metadata card (docs only, default: false)

---

## Important Notes

1. **Spaces in folder names:** Automatically converted to hyphens in URLs
2. **Headings in TOC:** Only H2, H3, H4 appear in table of contents
3. **Callouts excluded:** Headings inside callouts don't appear in TOC
4. **Tabbed content:** Headings in active tab appear in TOC
5. **Blog posts:** Automatically show metadata cards
6. **Documentation:** Require `showMetadata: true` to show metadata card
7. **Author photos:** Place in `public/assets/authors/` and reference by filename
8. **File paths:** All asset paths are relative to `public/` directory

---

## When Creating Documentation

1. **Start with frontmatter:** Always include required fields
2. **Use proper structure:** H1 for title, H2+ for sections
3. **Add examples:** Include code examples and screenshots
4. **Use callouts:** Highlight important information
5. **Link between docs:** Connect related content
6. **Test your content:** Ensure all links and examples work
7. **Optimize media:** Keep file sizes reasonable
8. **Follow naming conventions:** Use lowercase with hyphens

---

This guide covers all available features and best practices. Use it as a reference when creating MDX documentation files for this Knowledge Base website.

