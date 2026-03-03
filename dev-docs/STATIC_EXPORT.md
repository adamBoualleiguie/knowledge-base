# Static Export Setup

This branch (`static`) demonstrates that the Next.js application can be exported as static files and deployed to GitHub Pages or any static hosting service.

## Changes Made

1. **`next.config.js`**: Changed from `output: 'standalone'` to `output: 'export'` and enabled `images.unoptimized: true`
2. **`package.json`**: Updated build script to run `contentlayer build` before `next build`
3. **`Dockerfile.static`**: Simple multi-stage Docker build that creates static export and serves with Nginx (for testing)
4. **`nginx.static.conf`**: Simple Nginx configuration for serving static files

## Building Static Export

```bash
# Build the static export
yarn build

# The static files will be in the `out/` directory
ls -la out/
```

## Testing Locally with Docker (Optional)

### Build the Docker image:

```bash
docker build -f Dockerfile.static -t docs-website:static .
```

### Run the container:

```bash
docker run -p 8080:80 --name docs-static docs-website:static
```

### Access the website:

Open your browser and navigate to:
- http://localhost:8080

### Stop the container:

```bash
docker stop docs-static
docker rm docs-static
```

## Deploying to GitHub Pages

### Option 1: Manual Deployment

1. **Build the static export:**
   ```bash
   yarn build
   ```

2. **Create or switch to `gh-pages` branch:**
   ```bash
   git checkout --orphan gh-pages
   git rm -rf .
   ```

3. **Copy the `out` directory contents:**
   ```bash
   cp -r out/* .
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Deploy static site to GitHub Pages"
   git push origin gh-pages
   ```

5. **Configure GitHub Pages:**
   - Go to your repository Settings → Pages
   - Select source: `gh-pages` branch
   - Select folder: `/ (root)`
   - Click Save

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, static ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Build static export
        run: yarn build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

This workflow will:
- Build your static site on every push to `main` or `static` branch
- Deploy it automatically to GitHub Pages
- Make it available at `https://<username>.github.io/<repository-name>/`

### Option 3: Deploy to Root Domain (username.github.io)

If you want to deploy to `https://username.github.io` (without repository name):

1. **Update `next.config.js`** - No `basePath` needed (already correct)
2. **Follow Option 1 or 2** above
3. **Configure GitHub Pages** to use the repository named `username.github.io`

## What Works

✅ All MDX features (Terminal, Highlight, Mermaid, YouTube, etc.)
✅ Dynamic routes (docs and blog pages)
✅ Client-side search
✅ Dark mode
✅ All interactive components
✅ Responsive design

## Notes

- Image optimization is disabled (`unoptimized: true`) as required for static export
- All routes are pre-rendered at build time
- No server-side features are used (compatible with static export)
- The Nginx configuration is only for local testing with Docker
- For GitHub Pages, you don't need Nginx - GitHub serves the static files directly

## Troubleshooting

### Routes not working on GitHub Pages

If routes like `/docs` don't work, ensure:
1. The `out` directory contains the correct HTML files
2. GitHub Pages is configured to serve from the correct branch/folder
3. Check the browser console for any 404 errors

### Base Path Issues

If deploying to a subdirectory (e.g., `/repo-name/`), add to `next.config.js`:

```javascript
basePath: '/repo-name',
trailingSlash: true,
```

Then rebuild and redeploy.
