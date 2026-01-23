# Complete Guide to Your Portfolio Website

This guide explains how to add documentation, blog posts, and customize your portfolio website.

## Table of Contents

1. [Adding Documentation](#adding-documentation)
2. [Overview Pages for Major Sections](#overview-pages-for-major-sections)
3. [Knowledge Base Structure](#knowledge-base-structure)
4. [Custom Section Ordering](#custom-section-ordering)
5. [Callout Components](#callout-components)
6. [Excalidraw Diagrams](#excalidraw-diagrams)
7. [Table of Contents](#table-of-contents-right-sidebar)
8. [Tabbed Content](#tabbed-content)
9. [Images and Videos](#images-and-videos)
10. [Code Blocks](#code-blocks)
11. [Global Search](#global-search)
12. [Adding Blog Posts](#adding-blog-posts)
13. [Customizing the Homepage](#customizing-the-homepage)
14. [Updating Navigation](#updating-navigation)
15. [Adding Your CV](#adding-your-cv)
16. [Customizing Colors and Styling](#customizing-colors-and-styling)
17. [Deployment](#deployment)

---

## Adding Documentation

The documentation uses a hierarchical structure with **Sections**, **Subsections**, and **Documents**. This creates a collapsible sidebar navigation like SigNoz.io.

### Understanding the Structure

The sidebar automatically organizes your docs into:
- **Sections** (top level) - e.g., "Installation", "Getting Started", "API"
- **Subsections** (second level) - e.g., "Overview", "Setup", "Prerequisites"
- **Documents** (individual pages) - the actual content files

### Step 1: Create the Folder Structure

Create folders to organize your documentation:

```bash
# Create a section folder
mkdir -p content/docs/installation

# Create subsections within the section
mkdir -p content/docs/installation/overview
mkdir -p content/docs/installation/setup
```

**Example Structure:**
```
content/docs/
├── installation/          # Section
│   ├── overview.mdx      # Document (no subsection)
│   ├── prerequisites.mdx # Document (no subsection)
│   └── setup.mdx         # Document (no subsection)
├── getting-started/       # Section
│   ├── introduction.mdx # Document
│   └── quick-start.mdx   # Document
└── api/                   # Section
    ├── reference.mdx     # Document
    └── endpoints.mdx     # Document
```

### Step 2: Create Documents with Frontmatter

Every documentation file needs frontmatter at the top:

```mdx
---
title: Your Document Title
description: A brief description of what this document covers
publishedAt: 2024-01-15
updatedAt: 2024-01-20  # Optional
---
```

### Step 3: Write Your Content

Write your content using Markdown or MDX syntax:

```mdx
---
title: Installation Overview
description: Learn how to install the project
publishedAt: 2024-01-15
---

# Installation Overview

This guide will help you install the project.

## Prerequisites

Before you begin, make sure you have:

- Node.js 20.19.4 or higher
- Yarn package manager

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio-website
```

### Step 2: Install Dependencies

```bash
yarn install
```

## Next Steps

- Read the [Setup Guide](/docs/installation/setup)
- Check the [Prerequisites](/docs/installation/prerequisites)
```

### Step 4: How the Sidebar Works

The sidebar automatically creates a hierarchical structure:

1. **Section Level** (e.g., "Installation")
   - Created from the first folder name
   - Collapsible with expand/collapse arrow
   - Auto-expands if any document inside is active

2. **Subsection Level** (optional)
   - Created from nested folders
   - Also collapsible
   - Auto-expands if any document inside is active

3. **Document Level**
   - Individual MDX files
   - Shown with document icons
   - Active document is highlighted

### Examples

**Simple Structure (Section → Documents):**
```
content/docs/installation/
├── overview.mdx
├── prerequisites.mdx
└── setup.mdx
```
This creates:
- Section: "Installation" (collapsible)
  - Document: "Overview"
  - Document: "Prerequisites"
  - Document: "Setup"

**Nested Structure (Section → Subsection → Documents):**
```
content/docs/installation/
├── getting-started/
│   ├── overview.mdx
│   └── quick-start.mdx
└── advanced/
    ├── configuration.mdx
    └── optimization.mdx
```
This creates:
- Section: "Installation" (collapsible)
  - Subsection: "Getting Started" (collapsible)
    - Document: "Overview"
    - Document: "Quick Start"
  - Subsection: "Advanced" (collapsible)
    - Document: "Configuration"
    - Document: "Optimization"

### Step 5: URL Structure

The URL matches your folder structure:

- `content/docs/installation/overview.mdx` → `/docs/installation/overview`
- `content/docs/getting-started/introduction.mdx` → `/docs/getting-started/introduction`
- `content/docs/api/reference.mdx` → `/docs/api/reference`

### Step 6: Active Document Highlighting

The current document you're viewing is automatically:
- Highlighted in the sidebar
- Has its parent sections/subsections auto-expanded
- Shows with bold text and active color

### Tips for Organization

1. **Use descriptive folder names**: They become section titles
2. **Keep folder names lowercase**: Use hyphens for spaces (e.g., `getting-started`)
3. **Group related docs**: Put related documents in the same section
4. **Use subsections sparingly**: Only when you have many related docs
5. **Consistent naming**: Keep file names descriptive and consistent

### Quick Reference: Folder Structure Examples

**Example 1: Simple Section**
```
content/docs/installation/
├── overview.mdx
├── prerequisites.mdx
└── setup.mdx
```
**Result in Sidebar:**
- 📁 Installation (collapsible)
  - 📄 Overview
  - 📄 Prerequisites
  - 📄 Setup

**Example 2: Section with Subsections**
```
content/docs/installation/
├── getting-started/
│   ├── overview.mdx
│   └── quick-start.mdx
└── advanced/
    ├── configuration.mdx
    └── optimization.mdx
```
**Result in Sidebar:**
- 📁 Installation (collapsible)
  - 📁 Getting Started (collapsible)
    - 📄 Overview
    - 📄 Quick Start
  - 📁 Advanced (collapsible)
    - 📄 Configuration
    - 📄 Optimization

### Active Document Highlighting

When you view a document:
- ✅ The document is highlighted in the sidebar
- ✅ All parent sections/subsections auto-expand
- ✅ The document text appears in bold with active color
- ✅ Document icon is visible

### Sidebar Features

- **Collapsible Sections**: Click to expand/collapse
- **Auto-Expand**: Active sections open automatically
- **Document Icons**: Visual indicators for each document
- **Smooth Transitions**: All interactions are animated
- **Responsive**: Hidden on mobile, visible on desktop (lg+)
- **Clickable Section Titles**: Major sections with overview pages have clickable titles

---

## Overview Pages for Major Sections

Major sections (like "API", "Getting Started", "Knowledge Base") can have overview pages that describe what the section is about. When an overview page exists, the section title becomes clickable and links to that overview page.

### How to Create an Overview Page

1. **Create an `overview.mdx` file** in the section directory:
   ```
   content/docs/api/overview.mdx
   content/docs/getting-started/overview.mdx
   content/docs/knowledge-base/overview.mdx
   ```

2. **Add frontmatter and content**:
   ```mdx
   ---
   title: API Documentation
   description: Complete API reference and endpoint documentation
   publishedAt: 2024-01-01
   ---
   
   # API Documentation
   
   Welcome to the API documentation section. This section provides comprehensive information about all available APIs, endpoints, and integration guides.
   
   ## What's in this section
   
   - **Endpoints**: Detailed documentation for all API endpoints
   - **Reference**: Complete API reference with request/response examples
   - **Authentication**: How to authenticate and use the APIs
   - **Rate Limits**: Understanding API rate limits and best practices
   
   ## Quick Links
   
   - [API Endpoints](/docs/api/endpoints) - All available endpoints
   - [API Reference](/docs/api/reference) - Complete API reference
   ```

3. **The section title becomes clickable** in the sidebar, linking to the overview page

### Benefits

- ✅ **Better Navigation**: Users can quickly understand what a section contains
- ✅ **Central Hub**: Overview pages serve as landing pages for major sections
- ✅ **Better UX**: Clickable section titles make navigation more intuitive
- ✅ **Documentation**: Overview pages help organize and explain section structure

### Example Structure

```
content/docs/
├── api/
│   ├── overview.mdx          # Overview page (clickable section title)
│   ├── endpoints.mdx
│   └── reference.mdx
├── getting-started/
│   ├── overview.mdx          # Overview page (clickable section title)
│   ├── introduction.mdx
│   └── quick-start.mdx
└── knowledge-base/
    ├── overview.mdx          # Overview page (clickable section title)
    ├── foundations/
    ├── platforms/
    └── projects/
```

### How It Works

- If `section-name/overview.mdx` exists, the section title in the sidebar becomes a clickable link
- Clicking the section title navigates to the overview page
- The expand/collapse button still works independently
- Overview pages are great for explaining the section's purpose and structure

---

## Knowledge Base Structure

The Knowledge Base is a special major section designed for comprehensive, multi-dimensional documentation. It follows a specific structure that separates **WHAT**, **HOW**, and **WHY**.

### Structure Overview

The Knowledge Base is organized into 8 main categories:

```
knowledge-base/
├── overview.mdx              # Main overview page
├── foundations/              # Core concepts (vendor-neutral)
│   └── overview.mdx
├── platforms/                # How to run Kubernetes & infrastructure
│   └── overview.mdx
├── projects/                 # Real-world use cases
│   └── overview.mdx
├── architectures/            # Design patterns & decisions
│   └── overview.mdx
├── cicd/                     # CI/CD tools and concepts
│   └── overview.mdx
├── cloud/                    # Cloud provider deep dives
│   └── overview.mdx
├── toolbox/                  # Quick references & cheatsheets
│   └── overview.mdx
└── notes-and-deep-dives/     # Technical explorations
    └── overview.mdx
```

### Creating Knowledge Base Content

1. **Create the directory structure**:
   ```bash
   mkdir -p content/docs/knowledge-base/{foundations,platforms,projects,architectures,cicd,cloud,toolbox,notes-and-deep-dives}
   ```

2. **Create overview pages** for each category:
   ```mdx
   ---
   title: Foundations
   description: Core concepts and vendor-neutral knowledge
   publishedAt: 2024-01-01
   ---
   
   # Foundations
   
   This section contains core concepts and vendor-neutral knowledge...
   ```

3. **Add content files** within each category:
   ```
   knowledge-base/foundations/
   ├── overview.mdx
   ├── linux/
   │   ├── systemd.mdx
   │   ├── networking.mdx
   │   └── storage.mdx
   └── containers/
       ├── docker-internals.mdx
       └── container-networking.mdx
   ```

### Knowledge Base Philosophy

- **Foundations**: Learn once, reuse forever - vendor-neutral concepts
- **Platforms**: Real setups, commands, gotchas - how things actually work
- **Projects**: Complete implementations with context, architecture, setup, problems & fixes
- **Architectures**: Design patterns with diagrams, tradeoffs, alternatives, cost notes
- **CI/CD**: Tool comparisons without mixing content
- **Cloud**: Provider-specific reality, not theory
- **Toolbox**: Fast lookup, zero storytelling
- **Notes & Deep Dives**: Thinking out loud, comparisons, insights

### Example Knowledge Base Structure

```
knowledge-base/
├── overview.mdx
├── foundations/
│   ├── overview.mdx
│   ├── linux/
│   │   ├── systemd.mdx
│   │   └── networking.mdx
│   └── kubernetes-core/
│       ├── architecture.mdx
│       └── scheduling.mdx
├── platforms/
│   ├── overview.mdx
│   └── kubernetes/
│       ├── k3s/
│       │   ├── setup-multipass.mdx
│       │   └── networking.mdx
│       └── kubeadm/
│           └── from-scratch.mdx
└── projects/
    ├── overview.mdx
    └── observability/
        ├── monitoring/
        │   └── prometheus-stack.mdx
        └── logging/
            └── elasticsearch.mdx
```

---

## Custom Section Ordering

The sidebar supports custom ordering for sections and subcategories. This is especially useful for the Knowledge Base section.

### How It Works

Custom ordering is defined in `components/DocsSidebar.tsx` using the `categoryOrder` object:

```typescript
const categoryOrder: Record<string, string[]> = {
  'knowledge-base': [
    'overview',
    'foundations',
    'platforms',
    'projects',
    'architectures',
    'cicd',
    'cloud',
    'toolbox',
    'notes-and-deep-dives',
  ],
}
```

### Adding Custom Order for Other Sections

To add custom ordering for another section:

1. **Edit `components/DocsSidebar.tsx`**
2. **Add your section to `categoryOrder`**:
   ```typescript
   const categoryOrder: Record<string, string[]> = {
     'knowledge-base': [...],
     'your-section': [
       'overview',
       'first-subcategory',
       'second-subcategory',
       'third-subcategory',
     ],
   }
   ```

### Default Behavior

- Sections without custom order are sorted **alphabetically**
- The `overview` subcategory (or `_root` containing overview.mdx) always appears **first**
- Other subcategories follow the custom order if defined, otherwise alphabetical

---

## Callout Components

Callout components are styled information boxes that help highlight important information, warnings, tips, and notes in your documentation.

### Available Callout Types

- **`info`** (default): Blue background - General information
- **`success`**: Green background - Success messages, confirmations
- **`warning`**: Yellow background - Warnings, cautions
- **`error`**: Red background - Error messages, issues
- **`note`**: Purple background - Additional notes, tips
- **`danger`**: Red background - Critical warnings, dangerous operations

### Basic Usage

```mdx
<Callout type="info" title="Info">
This is an informational callout with a custom title.
</Callout>

<Callout type="success">
This is a success callout. The title will be auto-generated as "Success".
</Callout>

<Callout type="warning" title="Important">
Make sure to backup your data before proceeding.
</Callout>

<Callout type="danger" title="Danger">
This operation cannot be undone. Proceed with caution.
</Callout>
```

### Examples

**Info Callout:**
```mdx
<Callout type="info" title="Did you know?">
You can reference files like `network_security_config.xml` or directories like `opentelemetry-demo` and they will be highlighted as inline code.
</Callout>
```

**Success Callout:**
```mdx
<Callout type="success" title="Installation Complete">
Your application has been successfully installed and is ready to use.
</Callout>
```

**Warning Callout:**
```mdx
<Callout type="warning" title="Before You Begin">
Make sure you have Node.js 20.19.4 or higher installed before proceeding.
</Callout>
```

**Error Callout:**
```mdx
<Callout type="error" title="Error">
Failed to connect to the database. Please check your connection settings.
</Callout>
```

**Note Callout:**
```mdx
<Callout type="note" title="Note">
This feature requires additional configuration. See the [Configuration Guide](/docs/configuration) for details.
</Callout>
```

**Danger Callout:**
```mdx
<Callout type="danger" title="Danger">
This operation will delete all data. This action cannot be undone. Make sure you have a backup.
</Callout>
```

### Features

- ✅ **Auto-generated Titles**: If you don't provide a title, it's auto-generated from the type
- ✅ **Styled Icons**: Each type has a unique icon (Info, CheckCircle, AlertTriangle, etc.)
- ✅ **Color-coded**: Different background and border colors for each type
- ✅ **Excluded from TOC**: Callouts don't appear in the "ON THIS PAGE" table of contents
- ✅ **Responsive**: Works perfectly on all screen sizes

### Best Practices

1. **Use appropriate types**: Choose the callout type that matches the message importance
2. **Keep titles concise**: Short, descriptive titles work best
3. **Use sparingly**: Don't overuse callouts - they should highlight important information
4. **Combine with inline code**: You can reference files and directories inside callouts using backticks

---

## Excalidraw Diagrams

Excalidraw diagrams allow you to embed interactive diagrams in your documentation. These diagrams support theme switching, fullscreen mode, and zoom controls.

### Creating an Excalidraw Diagram

1. **Create your diagram** in Excalidraw (https://excalidraw.com/)
2. **Export as `.excalidraw` file** (JSON format)
3. **Save it** in `public/assets/docs/other/` or your preferred location
4. **Reference it** in your MDX:

```mdx
<ExcalidrawDiagram 
  src="/assets/docs/other/diagram.excalidraw"
  caption="Project Architecture Overview"
  initialZoom={0.5}
/>
```

### Component Props

- **`src`** (required): Path to the `.excalidraw` file (relative to `public/`)
- **`alt`** (optional): Alt text for accessibility
- **`caption`** (optional): Caption text displayed below the diagram
- **`initialZoom`** (optional): Initial zoom level (default: `1` = 100%)
  - `0.5` = 50% zoom
  - `1` = 100% zoom (default)
  - `2` = 200% zoom

### Features

- ✅ **Theme Support**: Automatically matches your website's theme (light/dark)
- ✅ **Fullscreen Mode**: Click the fullscreen button to view in fullscreen
- ✅ **Zoom Controls**: Zoom in, zoom out, and reset zoom
- ✅ **Centered Display**: Diagrams are automatically centered
- ✅ **Responsive**: Adapts to different screen sizes
- ✅ **Clean UI**: Default Excalidraw UI elements are hidden for a clean look

### Example Usage

```mdx
## Architecture Diagram

Here's a visual representation of the project architecture:

<ExcalidrawDiagram 
  src="/assets/docs/other/diagram.excalidraw"
  caption="Project Architecture Overview"
  initialZoom={0.5}
/>

This diagram shows the main components and their relationships.
```

### Zoom Levels

- **`initialZoom={0.5}`**: Good for large diagrams that need to fit on screen
- **`initialZoom={1}`**: Default - shows diagram at 100%
- **`initialZoom={2}`**: Useful for detailed diagrams that need to be larger

### File Organization

Store Excalidraw files in:
```
public/assets/docs/
├── other/
│   └── diagram.excalidraw
├── images/
└── videos/
```

Or organize by section:
```
public/assets/docs/
├── knowledge-base/
│   └── architectures/
│       └── system-architecture.excalidraw
└── other/
    └── general-diagram.excalidraw
```

### Best Practices

1. **Use descriptive filenames**: `project-architecture.excalidraw`, `data-flow.excalidraw`
2. **Add captions**: Help readers understand what the diagram shows
3. **Choose appropriate zoom**: Large diagrams benefit from `initialZoom={0.5}`
4. **Organize files**: Keep diagrams in logical locations (by section or topic)
5. **Test both themes**: Make sure diagrams look good in both light and dark modes

---

## Table of Contents (Right Sidebar)

The "ON THIS PAGE" sidebar automatically extracts headings from your document content.

### How It Works

1. **Automatic Extraction**: Headings (H2, H3, H4) are automatically extracted from your MDX content
2. **Hierarchical Display**: Headings are shown with proper indentation based on level
3. **Smooth Scrolling**: Clicking a heading smoothly scrolls to that section
4. **Active Highlighting**: The current section is highlighted as you scroll

### What Gets Displayed

- ✅ **H2 Headings** (##): Main sections - shown in bold
- ✅ **H3 Headings** (###): Subsections - indented
- ✅ **H4 Headings** (####): Sub-subsections - more indented
- ❌ **H1 Headings** (#): Page title - excluded from TOC
- ❌ **Code Examples**: Headings in code blocks are ignored
- ❌ **Callout Headings**: Headings inside callout components are excluded
- ❌ **Tab Content**: Headings in inactive tabs are excluded (active tab headings are included)

### Example

For a document with these headings:

```mdx
# Page Title (not in TOC)

## Installation
### Prerequisites
### Steps

## Configuration
### Basic Setup
### Advanced Options
```

The TOC will show:
- **Installation** (H2 - bold)
  - Prerequisites (H3 - indented)
  - Steps (H3 - indented)
- **Configuration** (H2 - bold)
  - Basic Setup (H3 - indented)
  - Advanced Options (H3 - indented)

### Tips

- Use H2 for main sections
- Use H3 for subsections
- Use H4 for deeper nesting
- Avoid using H1 in content (it's reserved for the page title)
- Headings in code blocks won't appear in the TOC
- Headings inside callout components won't appear in the TOC
- The TOC automatically updates when switching between tabs in tabbed content

---

## Tabbed Content

You can create tabbed content sections where readers can choose between different methods or interfaces. This is perfect for documentation that has multiple approaches or options.

### How to Use Tabbed Content

Use the `<TabbedContent>` and `<TabPanel>` components in your MDX files:

```mdx
<TabbedContent>
  <TabPanel id="method1" label="Method 1">
    ### Method 1 Title
    
    Content for method 1 goes here.
    
    You can include:
    - Lists
    - **Bold text**
    - Code blocks
    - Any markdown content
  </TabPanel>

  <TabPanel id="method2" label="Method 2">
    ### Method 2 Title
    
    Content for method 2 goes here.
  </TabPanel>
</TabbedContent>
```

### Features

- **Dynamic Content Switching**: Content changes when tabs are clicked
- **Auto-Updating TOC**: The "ON THIS PAGE" section automatically updates when tabs change
- **Progress Bar**: Reading progress bar updates correctly with tabbed content
- **Scroll Spy**: Active heading highlighting works with tabbed content

### Example Use Cases

1. **Multiple Interfaces**: Host Interface vs Kubernetes Interface
2. **Installation Methods**: Docker vs Kubernetes vs Cloud
3. **Configuration Options**: Basic vs Advanced setup
4. **Platform-Specific Guides**: macOS vs Linux vs Windows

### Example

```mdx
## Installation Methods

<TabbedContent>
  <TabPanel id="docker" label="Docker">
    ### Docker Installation
    
    Install using Docker:
    
    ```bash
    docker run -d -p 3000:3000 myapp
    ```
  </TabPanel>

  <TabPanel id="kubernetes" label="Kubernetes">
    ### Kubernetes Installation
    
    Install using Kubernetes:
    
    ```yaml
    apiVersion: v1
    kind: Pod
    ...
    ```
  </TabPanel>
</TabbedContent>
```

### Notes

- Each `<TabPanel>` must have a unique `id`
- The `label` appears on the tab button
- Content inside tabs can include any markdown/MDX
- Headings inside tabs are automatically included in the TOC
- The first tab is selected by default

---

## Images and Videos

You can display images and videos in your documentation with enhanced features like hover effects and fullscreen viewing.

### Displaying Images

Use the `<DocImage>` component for images:

```mdx
<DocImage
  src="/path/to/image.png"
  alt="Description of the image"
  caption="Optional caption text"
  width={1200}
  height={800}
/>
```

**Features:**
- ✅ **Maintains Aspect Ratio**: Images are never flattened or distorted
- ✅ **Hover Effect**: Images slightly zoom on hover
- ✅ **Fullscreen View**: Click to view in fullscreen mode
- ✅ **Responsive**: Automatically adapts to screen size
- ✅ **Caption Support**: Optional caption below the image

**Example:**
```mdx
<DocImage
  src="/screenshots/dashboard.png"
  alt="Monitoring dashboard"
  caption="The main monitoring dashboard showing CPU and memory metrics"
/>
```

### Displaying Videos

Use the `<DocVideo>` component for videos:

```mdx
<DocVideo
  src="/path/to/video.mp4"
  poster="/path/to/poster.png"
  caption="Optional caption text"
  controls
  autoplay={false}
  loop={false}
  muted={false}
/>
```

**Features:**
- ✅ **Video Controls**: Play, pause, volume, fullscreen
- ✅ **Poster Image**: Show a thumbnail before playing
- ✅ **Responsive**: Maintains aspect ratio
- ✅ **Caption Support**: Optional caption below the video

**Example:**
```mdx
<DocVideo
  src="/videos/tutorial.mp4"
  poster="/thumbnails/tutorial-thumb.png"
  caption="Step-by-step tutorial on setting up monitoring"
  controls
/>
```

### Using Regular Markdown Images

You can also use regular markdown image syntax, and it will automatically be converted to the enhanced image component:

```mdx
![Alt text](/path/to/image.png "Optional title/caption")
```

---

## Code Blocks

Enhanced code blocks with syntax highlighting, copy functionality, and beautiful formatting.

### Basic Usage

Use standard markdown code fences:

````mdx
```bash
yarn install
yarn dev
```
````

### Supported Languages

The code blocks support **all major programming languages** including:

- **Shell/Bash**: `bash`, `sh`, `zsh`
- **YAML**: `yaml`, `yml`
- **JSON**: `json`
- **JavaScript/TypeScript**: `javascript`, `js`, `typescript`, `ts`, `tsx`, `jsx`
- **Java**: `java`
- **C/C++**: `c`, `cpp`, `c++`
- **Python**: `python`, `py`
- **Go**: `go`
- **Rust**: `rust`, `rs`
- **Ruby**: `ruby`, `rb`
- **PHP**: `php`
- **SQL**: `sql`
- **HTML/CSS**: `html`, `css`
- **Docker**: `dockerfile`, `docker`
- **Kubernetes**: `yaml` (with k8s context)
- And **many more**!

### Features

- ✅ **Syntax Highlighting**: Beautiful color-coded syntax for all languages
- ✅ **Copy Button**: One-click copy to clipboard (appears on hover)
- ✅ **Line Numbers**: Optional line numbers for easier reference
- ✅ **Language Badge**: Shows the programming language
- ✅ **Filename Support**: Display filename above code block
- ✅ **Highlight Lines**: Highlight specific lines
- ✅ **Dark Theme**: Beautiful dark theme matching SigNoz.io
- ✅ **Responsive**: Works perfectly on all screen sizes

### Examples

**Basic Code Block:**
````mdx
```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

**With Filename:**
````mdx
```javascript:app.js
function greet(name) {
  return `Hello, ${name}!`;
}
```
````

**YAML Configuration:**
````mdx
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
    - name: app
      image: nginx
```
````

**Bash Script:**
````mdx
```bash
#!/bin/bash
echo "Installing dependencies..."
yarn install
echo "Starting server..."
yarn dev
```
````

**Java Example:**
````mdx
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```
````

**C Example:**
````mdx
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```
````

### Advanced Features

**Line Numbers** (enabled by default):
````mdx
```typescript
// Line numbers are shown automatically
const message = "Hello, World!";
console.log(message);
```
````

**Copy Functionality:**
- Hover over any code block to see the copy button
- Click to copy the entire code block
- Visual feedback when code is copied

### Best Practices

1. **Always specify language**: Helps with syntax highlighting
2. **Use descriptive code**: Add comments when needed
3. **Keep blocks focused**: Don't make code blocks too long
4. **Use filenames**: When showing file contents, include filename
5. **Test your code**: Make sure code examples actually work

### Code Block Styling

Code blocks automatically:
- Use monospace font (JetBrains Mono)
- Apply dark theme (github-dark)
- Show proper indentation
- Handle long lines with horizontal scroll
- Maintain proper spacing

---

### Asset Organization

All assets (images, videos, PDFs) should be organized in the `public/assets/` directory following this structure:

```
public/assets/
├── docs/              # Documentation assets
│   ├── images/        # Screenshots, diagrams
│   ├── videos/        # Tutorial videos
│   ├── pdfs/          # PDF documents
│   └── other/         # Other file types
├── blog/              # Blog post assets
│   ├── images/
│   ├── videos/
│   ├── pdfs/
│   └── other/
└── general/           # Shared assets
    ├── images/
    ├── videos/
    ├── pdfs/
    └── other/
```

**Path Examples:**
- Documentation image: `/assets/docs/images/installation-step-1.png`
- Blog video: `/assets/blog/videos/demo.mp4`
- Shared PDF: `/assets/general/pdfs/cv.pdf`

### Image Best Practices

1. **File Location**: Place images in `public/assets/docs/images/` (for docs) or `public/assets/blog/images/` (for blog)
2. **Naming**: Use descriptive, lowercase names with hyphens (e.g., `dashboard-overview.png`, `installation-step-1.png`)
3. **Format**: Use PNG for screenshots, JPG for photos, SVG for icons
4. **Size**: Optimize images before uploading (recommended max 2MB)
5. **Aspect Ratio**: Specify width/height to maintain proper proportions
6. **Alt Text**: Always provide descriptive alt text for accessibility
7. **Organization**: Group related assets in subdirectories for large documentation sections

### Video Best Practices

1. **File Location**: Place videos in `public/assets/docs/videos/` (for docs) or `public/assets/blog/videos/` (for blog)
2. **Format**: Use MP4 format for best browser compatibility
3. **Size**: Compress videos to reasonable file sizes (recommended max 50MB)
4. **Duration**: Keep tutorial videos concise (2-5 minutes recommended)
5. **Poster**: Include a poster image for better UX
6. **Naming**: Use descriptive names matching the content (e.g., `installation-tutorial.mp4`)

### Example Documentation with Media

```mdx
## Installation Steps

### Step 1: Download the Package

<DocImage
  src="/assets/docs/images/installation/download-page.png"
  alt="Download page screenshot"
  caption="Navigate to the download page"
/>

### Step 2: Run the Installer

Follow the installation wizard:

<DocVideo
  src="/assets/docs/videos/installation/installation-tutorial.mp4"
  caption="Complete installation process"
  controls
/>

### Step 3: Verify Installation

<DocImage
  src="/assets/docs/images/installation/verify-install.png"
  alt="Verification screen"
  caption="Check that installation was successful"
/>
```

### Asset Organization for Large Documentation

For documentation with many assets, you can create subdirectories:

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
└── videos/
    └── installation/
        └── complete-tutorial.mp4
```

Then reference them as:
```mdx
<DocImage src="/assets/docs/images/installation/step-1.png" alt="..." />
```

---

## Global Search

The documentation includes a global search bar that allows users to quickly find documentation pages across the entire site.

### Features

- ✅ **Always Visible**: Search bar is available in the top navigation menu site-wide
- ✅ **Real-Time Search**: Results update as you type (debounced for performance)
- ✅ **Keyboard Shortcut**: Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) to open search
- ✅ **Centered Modal**: Search modal appears centered on the screen
- ✅ **Keyboard Navigation**: Use arrow keys to navigate results, Enter to select
- ✅ **Escape to Close**: Press Escape or click outside to close

### How It Works

1. **Click the search icon** in the navigation bar or press `⌘K` / `Ctrl+K`
2. **Type your search query** - results appear in real-time
3. **Navigate results** with arrow keys or mouse
4. **Click or press Enter** to navigate to a result
5. **Press Escape** or click outside to close

### Search Results

Results show:
- **Title**: The document title
- **Path**: Breadcrumb showing the document location (e.g., `docs › api › endpoints`)

### Search Behavior

- **Searches**: Page titles, headings, and slugs/paths
- **Debounced**: Input is debounced (150-300ms) for performance
- **No Backend Required**: All search is done client-side
- **Case Insensitive**: Search is case-insensitive

### Example

When you type "installation", you might see:
- Installation Overview (`docs › installation › overview`)
- Installation Prerequisites (`docs › installation › prerequisites`)
- Installation Setup (`docs › installation › setup`)

### Tips

- Use specific keywords for better results
- Search works across all documentation sections
- Results are sorted by relevance

---

## Adding Blog Posts

### Step 1: Create a New MDX File

Create a new `.mdx` file in the `content/blog/` directory.

**Example:** `content/blog/my-first-post.mdx` will be accessible at `/blog/my-first-post`

### Step 2: Add Frontmatter

Blog posts require more metadata:

```mdx
---
title: My First Blog Post
description: A brief description that appears in listings
publishedAt: 2024-01-15
updatedAt: 2024-01-20  # Optional
author: Your Name  # Optional
tags: [web-development, nextjs, tutorial]  # Optional array
---
```

### Step 3: Write Your Blog Post

```mdx
---
title: Building a Modern Portfolio
description: How I built my portfolio website
publishedAt: 2024-01-15
author: Your Name
tags: [nextjs, web-development]
---

# Building a Modern Portfolio

This is my blog post about building a portfolio...

## Introduction

Here's the introduction...

## Main Content

More content here...
```

### Step 4: Organize with Folders (Optional)

You can organize blog posts in subfolders:

- `content/blog/2024/january/my-post.mdx` → `/blog/2024/january/my-post`

---

## Customizing the Homepage

Edit `app/page.tsx` to customize your homepage:

1. **Update the Hero Section:**
   - Change the title and description
   - Modify the call-to-action buttons
   - Update links

2. **Customize Latest Blog Posts:**
   - Change how many posts are shown (currently 3)
   - Modify the card design

3. **Update Quick Links:**
   - Add or remove quick link sections
   - Customize descriptions

---

## Updating Navigation

Edit `components/Navigation.tsx` to update navigation:

1. **Add/Remove Navigation Items:**
   ```tsx
   const navItems = [
     { href: '/', label: 'Home' },
     { href: '/docs', label: 'Documentation' },
     { href: '/blog', label: 'Blog' },
     { href: '/projects', label: 'Projects' },  // Add new item
   ]
   ```

2. **Update Site Name:**
   ```tsx
   <Link href="/" className="text-xl font-bold">
     Your Site Name  // Change this
   </Link>
   ```

---

## Adding Your CV

1. **Replace the CV File:**
   - Place your CV PDF in `public/assets/general/pdfs/cv.pdf`
   - The download button in the navigation will automatically work

2. **Update CV Filename (Optional):**
   - If your CV has a different name, update the links in:
     - `components/Navigation.tsx`
     - `app/page.tsx`
   - The path should follow: `/assets/general/pdfs/your-cv-name.pdf`

---

## Customizing Colors and Styling

### Update Color Scheme

Edit `app/globals.css` to customize colors:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;  /* Change primary color */
  /* ... more colors */
}
```

### Update Tailwind Config

Edit `tailwind.config.js` to add custom colors, fonts, or spacing:

```js
theme: {
  extend: {
    colors: {
      // Add custom colors
    },
    fontFamily: {
      // Add custom fonts
    },
  },
}
```

---

## Customizing Footer

Edit `components/Footer.tsx` to:

1. Update social media links
2. Change footer text
3. Add/remove footer sections
4. Update copyright information

---

## Updating Site Metadata

Edit `app/layout.tsx` to update:

- Site title
- Site description
- Open Graph tags
- Other metadata

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository in Netlify
3. Set build command: `yarn build`
4. Set publish directory: `.next`

### Build for Static Export

If you need a static site:

1. Update `next.config.js`:
   ```js
   const nextConfig = {
     output: 'export',
     // ... rest of config
   }
   ```

2. Build:
   ```bash
   yarn build
   ```

3. Deploy the `out` directory

---

## Tips and Best Practices

### Documentation

- Use clear, descriptive titles
- Organize related docs in folders
- Keep descriptions concise but informative
- Use code blocks for examples
- Link between related documents

### Blog Posts

- Write engaging descriptions (they appear in listings)
- Use tags to categorize posts
- Include dates for chronological organization
- Use headings to structure long posts

### Content Organization

- Keep file names lowercase with hyphens
- Use descriptive file names
- Group related content in folders
- Maintain consistent frontmatter format

---

## Troubleshooting

### Content Not Appearing

1. Check that files are in the correct directory (`content/docs/` or `content/blog/`)
2. Verify frontmatter is correct (YAML format)
3. Restart the dev server: `yarn dev`
4. Check for syntax errors in MDX files

### Build Errors

1. Check for TypeScript errors: `yarn build`
2. Verify all imports are correct
3. Check MDX syntax (proper closing of code blocks, etc.)

### Styling Issues

1. Clear `.next` cache: `rm -rf .next`
2. Rebuild: `yarn build`
3. Check Tailwind classes are correct

---

## Need Help?

- Check the [Next.js Documentation](https://nextjs.org/docs)
- Check the [Contentlayer Documentation](https://www.contentlayer.dev/)
- Review the sample content files for examples

Happy building! 🚀

