# Assets Directory Structure

This directory contains all static assets (images, videos, PDFs, etc.) used throughout the website.

## Directory Structure

```
public/assets/
├── docs/              # Assets for documentation pages
│   ├── images/        # Screenshots, diagrams, illustrations
│   ├── videos/        # Tutorial videos, demos
│   ├── pdfs/          # PDF documents, guides
│   └── other/         # Other file types (SVG, icons, etc.)
├── blog/              # Assets for blog posts
│   ├── images/        # Blog post images, featured images
│   ├── videos/        # Embedded videos in blog posts
│   ├── pdfs/          # PDF attachments
│   └── other/         # Other file types
└── general/           # Shared assets used across the site
    ├── images/        # Logos, icons, shared images
    ├── videos/       # Shared videos
    ├── pdfs/          # Shared PDFs (like CV)
    └── other/         # Other shared assets
```

## Naming Conventions

### Images
- Use descriptive, lowercase names with hyphens
- Include context: `installation-step-1.png`, `dashboard-overview.png`
- For screenshots: `feature-name-screenshot.png`
- For diagrams: `architecture-diagram.png`

**Examples:**
- ✅ `getting-started-welcome.png`
- ✅ `api-endpoints-diagram.png`
- ✅ `host-metrics-dashboard.png`
- ❌ `IMG_1234.png`
- ❌ `screenshot.png`

### Videos
- Use descriptive names matching the content
- Include format: `tutorial-name.mp4`
- For step-by-step: `step-1-installation.mp4`

**Examples:**
- ✅ `installation-tutorial.mp4`
- ✅ `quick-start-guide.mp4`
- ✅ `api-overview-demo.mp4`
- ❌ `video1.mp4`
- ❌ `recording.mp4`

### PDFs
- Use clear, descriptive names
- Match document title: `user-guide.pdf`, `api-reference.pdf`

**Examples:**
- ✅ `infrastructure-monitoring-guide.pdf`
- ✅ `api-reference-v2.pdf`
- ✅ `cv.pdf`
- ❌ `document.pdf`
- ❌ `file.pdf`

## Usage in Content

### Documentation (`content/docs/`)

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

### Blog Posts (`content/blog/`)

**Images:**
```mdx
<DocImage
  src="/assets/blog/images/featured-image.png"
  alt="Featured image"
/>
```

**Videos:**
```mdx
<DocVideo
  src="/assets/blog/videos/demo.mp4"
  controls
/>
```

### General Assets

For assets used across multiple pages (like CV):

```mdx
[Download CV](/assets/general/pdfs/cv.pdf)
```

## File Organization Tips

1. **Group by Content**: Place assets in the same directory as the content that uses them
2. **Use Subdirectories**: For large docs, create subdirectories:
   ```
   docs/
     infrastructure-monitoring/
       images/
         host-metrics.png
         kubernetes-view.png
   ```
3. **Keep Names Descriptive**: Future you will thank you
4. **Optimize Before Upload**: Compress images/videos to reasonable sizes
5. **Use Consistent Formats**: PNG for screenshots, JPG for photos, MP4 for videos

## Current Structure

- **Documentation Assets**: `public/assets/docs/`
- **Blog Assets**: `public/assets/blog/`
- **General Assets**: `public/assets/general/`

## Best Practices

1. ✅ Always use descriptive file names
2. ✅ Place assets in the appropriate category (docs/blog/general)
3. ✅ Use the correct subdirectory (images/videos/pdfs/other)
4. ✅ Optimize files before adding (compress images, videos)
5. ✅ Keep file sizes reasonable (< 5MB for images, < 50MB for videos)
6. ✅ Use relative paths starting with `/assets/`
7. ✅ Include alt text and captions for accessibility






