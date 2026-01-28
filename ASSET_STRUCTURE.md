# Asset Structure Guide

This document provides a quick reference for organizing assets in your portfolio website.

## 📁 Directory Structure

```
public/assets/
├── docs/                    # Documentation assets
│   ├── images/             # Screenshots, diagrams, illustrations
│   │   └── example-dashboard.png
│   ├── videos/             # Tutorial videos, demos
│   │   └── example-tutorial.mp4
│   ├── pdfs/               # PDF documents, guides
│   └── other/               # Other file types (SVG, icons, etc.)
│
├── blog/                    # Blog post assets
│   ├── images/             # Blog post images, featured images
│   ├── videos/             # Embedded videos in blog posts
│   ├── pdfs/               # PDF attachments
│   └── other/              # Other file types
│
└── general/                 # Shared assets used across the site
    ├── images/             # Logos, icons, shared images
    ├── videos/             # Shared videos
    ├── pdfs/               # Shared PDFs (CV, etc.)
    │   └── cv.pdf
    └── other/              # Other shared assets
```

## 🎯 Quick Reference

### Documentation Assets
**Path:** `public/assets/docs/`

**Use for:**
- Screenshots in documentation
- Tutorial videos
- PDF guides
- Diagrams and illustrations

**Example paths:**
- `/assets/docs/images/installation-step-1.png`
- `/assets/docs/videos/quick-start-tutorial.mp4`
- `/assets/docs/pdfs/user-guide.pdf`

### Blog Assets
**Path:** `public/assets/blog/`

**Use for:**
- Featured images for blog posts
- Embedded videos in posts
- PDF attachments

**Example paths:**
- `/assets/blog/images/featured-post-image.png`
- `/assets/blog/videos/demo.mp4`

### General Assets
**Path:** `public/assets/general/`

**Use for:**
- CV/resume PDF
- Site-wide logos
- Shared icons
- Common images used across pages

**Example paths:**
- `/assets/general/pdfs/cv.pdf`
- `/assets/general/images/logo.png`

## 📝 Naming Conventions

### Images
- ✅ `installation-step-1.png`
- ✅ `dashboard-overview.png`
- ✅ `api-endpoints-diagram.png`
- ❌ `IMG_1234.png`
- ❌ `screenshot.png`

### Videos
- ✅ `installation-tutorial.mp4`
- ✅ `quick-start-guide.mp4`
- ❌ `video1.mp4`
- ❌ `recording.mp4`

### PDFs
- ✅ `user-guide.pdf`
- ✅ `api-reference-v2.pdf`
- ❌ `document.pdf`

## 🔗 Usage in Content

### In MDX Files

**Images:**
```mdx
<DocImage
  src="/assets/docs/images/installation-step-1.png"
  alt="Installation step 1"
  caption="Follow the installation wizard"
/>
```

**Videos:**
```mdx
<DocVideo
  src="/assets/docs/videos/installation-tutorial.mp4"
  caption="Complete installation process"
  controls
/>
```

**PDFs:**
```mdx
[Download the guide](/assets/docs/pdfs/user-guide.pdf)
```

## 📂 Subdirectories for Large Sections

For documentation with many assets, create subdirectories:

```
public/assets/docs/
├── images/
│   ├── installation/
│   │   ├── step-1.png
│   │   ├── step-2.png
│   │   └── verification.png
│   └── api/
│       ├── endpoints-diagram.png
│       └── authentication-flow.png
```

Then reference: `/assets/docs/images/installation/step-1.png`

## ✅ Best Practices

1. **Always use descriptive names** - Future you will thank you
2. **Place assets in the correct category** - docs/blog/general
3. **Use the right subdirectory** - images/videos/pdfs/other
4. **Optimize before uploading** - Compress images/videos
5. **Keep file sizes reasonable** - < 5MB for images, < 50MB for videos
6. **Use relative paths** - Always start with `/assets/`
7. **Include alt text** - For accessibility

## 🚀 Quick Start

1. **Adding a documentation image:**
   - Place in: `public/assets/docs/images/`
   - Reference as: `/assets/docs/images/your-image.png`

2. **Adding a blog video:**
   - Place in: `public/assets/blog/videos/`
   - Reference as: `/assets/blog/videos/your-video.mp4`

3. **Adding your CV:**
   - Place in: `public/assets/general/pdfs/`
   - Name it: `cv.pdf`
   - Already configured in navigation!

## 📚 More Information

See `public/assets/README.md` for detailed documentation.





