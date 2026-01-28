# Author Photos

This directory contains author profile photos for blog posts and documentation.

## Usage

Place author photos in this directory with the filename matching the author name (lowercase, with hyphens for spaces).

For example:
- `dhruv-ahuja.jpg` or `dhruv-ahuja.png`
- `john-doe.jpg`
- `jane-smith.png`

## Supported Formats

- JPG/JPEG
- PNG
- WebP

## Naming Convention

Use lowercase letters and hyphens for spaces:
- Author name: "Dhruv Ahuja" → filename: `dhruv-ahuja.jpg`
- Author name: "John Doe" → filename: `john-doe.png`

## In Frontmatter

Reference the author photo in your MDX frontmatter:

```mdx
---
title: My Post
author: Dhruv Ahuja
authorPhoto: /assets/authors/dhruv-ahuja.jpg
---
```

Or use just the filename (without path) and it will be automatically resolved:

```mdx
---
title: My Post
author: Dhruv Ahuja
authorPhoto: dhruv-ahuja.jpg
---
```




