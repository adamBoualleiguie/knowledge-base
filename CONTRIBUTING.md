# Contributing to Knowledge Base

Thank you for your interest in contributing. This document explains how to get set up, add or change content, and submit changes so that developers and contributors can work effectively.

---

## Table of contents

- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Development workflow](#development-workflow)
- [Adding content](#adding-content)
- [MDX features and components](#mdx-features-and-components)
- [Code and content guidelines](#code-and-content-guidelines)
- [Submitting changes](#submitting-changes)
- [Deployment note](#deployment-note)

---

## Getting started

### Prerequisites

- **Node.js** 20.x (recommended; use [nvm](https://github.com/nvm-sh/nvm) if needed: `nvm install` then `nvm use`)
- **Yarn** or **npm** for installing dependencies

### Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/knowledge-base.git
cd knowledge-base
yarn install
# or: npm install
```

### Run the development server

```bash
yarn dev
# or: npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.  
If the site is configured with a **basePath** (e.g. for GitHub Pages), use:

- [http://localhost:3000/knowledge-base](http://localhost:3000/knowledge-base)

---

## Project structure

```
├── app/                    # Next.js App Router
│   ├── blog/               # Blog routes
│   ├── certifications/     # Career & Certifications page + view
│   ├── docs/               # Documentation routes
│   ├── layout.tsx          # Root layout, metadata, scripts
│   ├── page.tsx            # Homepage
│   ├── robots.ts           # Generated robots.txt
│   └── globals.css         # Global and prose styles
├── components/             # React components
│   ├── mdx-components.tsx  # MDX → React (Callout, Highlight, Terminal, etc.)
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── DocsSidebar.tsx
│   └── ...
├── content/                # All MDX content (Contentlayer)
│   ├── docs/               # Documentation (hierarchy = sidebar)
│   ├── blog/               # Blog posts
│   ├── certifications/     # Certification entries
│   └── careers/            # Career timeline entries
├── lib/                    # Utilities
│   ├── tag-colors.ts       # Blog/career tag colors
│   └── career-sort.ts      # Deterministic sort for careers/certs
├── public/                 # Static assets
│   └── assets/
│       ├── docs/           # Doc images, etc.
│       ├── blogs/          # Blog media, hero images
│       ├── careers/        # Career/company images
│       └── general/        # e.g. PDFs (CV)
├── scripts/
│   └── generate-sitemap.mjs  # Build-time sitemap.xml
├── contentlayer.config.ts  # Doc, Blog, Certification, Career schemas
└── next.config.js          # basePath, output: 'export', etc.
```

---

## Development workflow

- **Content:** Add or edit MDX under `content/`. Contentlayer picks it up and the dev server reflects changes (with hot reload).
- **Build:** Run a full build (content + sitemap + Next) with:
  ```bash
  yarn build
  # or: npm run build
  ```
- **Lint:** `yarn lint` (or `npm run lint`). Note: production builds currently ignore ESLint (`ignoreDuringBuilds: true` in `next.config.js`).

---

## Adding content

### Documentation

- **Where:** `content/docs/` (folder structure = sidebar sections/subsections).
- **Format:** One `.mdx` file per page. Use an `overview.mdx` per section if you want a section landing page.
- **Frontmatter (typical):**
  ```yaml
  title: Your Document Title
  description: Short description
  publishedAt: 2024-01-01
  # optional: updatedAt, order, author, authorPhoto, showMetadata, heroMedia
  ```
- **URL:** Derived from path (e.g. `content/docs/My Section/overview.mdx` → `/docs/My-Section/overview/`).
- **Assets:** Put images in `public/assets/docs/...` and reference them with root-relative paths (e.g. `/assets/docs/images/...`) or use the `<DocImage>` component. See the in-repo **Documentation guide** (under docs) for full details.

### Blog posts

- **Where:** `content/blog/` (one `.mdx` file per post).
- **Frontmatter:**
  ```yaml
  title: Post Title
  description: Brief description for listings
  publishedAt: 2024-01-15
  # optional: updatedAt, author, authorPhoto, tags, heroMedia
  ```
- **URL:** Filename = slug (e.g. `my-post.mdx` → `/blog/my-post/`).
- **Tags:** Use `tags: [tag1, tag2]`. Tag colors come from `lib/tag-colors.ts` (add new tags there if you want custom colors).
- **Hero image/video:** Set `heroMedia: assets/blogs/hero/your-image.jpg` (or `.webm`, etc.). See docs for hero media.

### Certifications

- **Where:** `content/certifications/` (one `.mdx` per certification).
- **Frontmatter:**
  ```yaml
  name: "Certification Name"
  issuingOrganization: "Provider Name"
  issueDate: "March 2026"
  # optional: credentialId, credentialUrl, skills: [...], media: "public/assets/certification/..."
  ```
- **Body:** Use normal MDX (lists, **bold**, `<Highlight>`, etc.). They appear on the **Certifications** tab of the Career & Certifications page, sorted by `issueDate` (newest first).

### Careers

- **Where:** `content/careers/` (one `.mdx` per role/phase).
- **Frontmatter:**
  ```yaml
  company: "Company Name"
  role: "Job Title"
  startDate: "January 2024"
  endDate: "Present"
  # optional: location, tags: [...], media: "public/assets/careers/..."
  ```
- **Body:** Use normal MDX. Entries appear on the **Career** tab, sorted newest-first (reverse chronological). Use a fixed date for “Present” in sorting (no need to change the file when the date changes).

---

## MDX features and components

You can use these in docs, blog, certifications, and careers:

| Component        | Usage example |
|------------------|----------------|
| **Callout**      | `<Callout type="info" title="Note">...</Callout>` — `type`: `info`, `success`, `warning`, `error`, `note`, `danger` |
| **Highlight**    | `<Highlight color="blue">text</Highlight>` — `color`: `blue`, `green`, `orange`, `purple`, etc. |
| **DocImage**     | `<DocImage src="/assets/docs/..." alt="..." caption="..." />` — use root-relative `src` for correct basePath behaviour |
| **Terminal**     | `<Terminal commands={[{ command: '...', output: '...' }]} />` |
| **TabbedContent**| Wrap content in `<TabbedContent>` / `<TabPanel>` for tabs |
| **Mermaid**      | Fenced code block with `mermaid` language |
| **Excalidraw**   | `<ExcalidrawDiagram src="/assets/.../file.excalidraw" />` |

- **Lists:** Use `-` or `*` for unordered lists and `1. 2. 3.` for ordered lists; bullets and numbers are styled in `.prose` and `.prose-callout`.
- **Links:** Prefer `[text](url)` or `<Link href="...">` for internal links. For static export (e.g. GitHub Pages), internal links respect `basePath` when using the app’s routing.

---

## Code and content guidelines

- **Paths:** For images and assets, use **root-relative** paths (e.g. `/assets/...`) so they work with `basePath` in production. In frontmatter, `media` often uses `public/assets/...`; the rendering components normalize this.
- **Dates:** Use consistent formats: `YYYY-MM-DD` for `publishedAt`/`updatedAt`, and readable strings (e.g. `"January 2024"`, `"Present"`) for certification/career dates.
- **Style:** Keep prose clear and scannable (short paragraphs, headings, lists). Use Callouts and Highlights sparingly for emphasis.
- **No secrets:** Do not commit API keys, tokens, or credentials. Use env vars or placeholders in examples.

---

## Submitting changes

1. **Fork** the repository (if external) and create a branch from `main` (or the default branch).
2. **Make your changes** (content under `content/`, or code under `app/`, `components/`, `lib/`, etc.).
3. **Verify locally:**
   - `yarn build` (or `npm run build`) completes successfully.
   - Content and links work as expected at `http://localhost:3000/knowledge-base` (or without basePath if you’ve changed config).
4. **Commit** with a clear message (e.g. “Add doc for X”, “Fix bullet list styling in prose”).
5. **Open a Pull Request** against the upstream repository. Describe what you changed and why; reference any issues if applicable.

Maintainers will review and may ask for small edits. Once approved, your changes can be merged.

---

## Deployment note

This project is set up for **static export** (`output: 'export'` in `next.config.js`) and optional **basePath** (e.g. `/knowledge-base` for GitHub Pages). The build runs:

1. `contentlayer build` — generates content data from `content/`
2. `node scripts/generate-sitemap.mjs` — writes `public/sitemap.xml`
3. `next build` — produces a static export

When contributing, ensure that:

- New content lives under the correct `content/` folder and has valid frontmatter so the build does not fail.
- Links and image paths work both locally and with the deployed basePath (if used).

---

Thank you for contributing.
