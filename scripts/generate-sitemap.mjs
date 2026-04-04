/**
 * Generates sitemap.xml and IndexNow key file.
 * Optionally submits URLs to IndexNow (Bing, Yandex) when CI or SUBMIT_INDEXNOW is set.
 * Run after contentlayer build.
 */
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const baseUrl = 'https://adamboualleiguie.github.io'
// GitHub Pages production deploy stays under the repository subpath.
const basePath = '/knowledge-base'

const INDEXNOW_KEY = '286f7e2dbfac40018a3bbfc4a355c421'
const INDEXNOW_KEY_URL = `${baseUrl}${basePath}/${INDEXNOW_KEY}.txt`

function fullUrl(pathSegment) {
  const normalized = pathSegment.endsWith('/') ? pathSegment : `${pathSegment}/`
  return `${baseUrl}${basePath}${normalized}`
}

/** lastmod in schema-friendly format: YYYY-MM-DDTHH:mm:ss+00:00 */
function formatLastmod(date) {
  const d = date instanceof Date ? date : new Date(date)
  return d.toISOString().replace('Z', '+00:00')
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function main() {
  const generatedPath = path.join(root, '.contentlayer', 'generated', 'index.mjs')
  let allDocs, allBlogs
  try {
    const gen = await import(pathToFileURL(generatedPath).href)
    allDocs = gen.allDocs ?? []
    allBlogs = gen.allBlogs ?? []
  } catch (err) {
    console.error('Run contentlayer build first. Missing or invalid .contentlayer/generated:', err.message)
    process.exit(1)
  }

  const now = new Date()
  const entries = [
    { url: fullUrl('/'), lastmod: now, changefreq: 'weekly', priority: '1.0' },
    { url: fullUrl('/blog/'), lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { url: fullUrl('/docs/'), lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { url: fullUrl('/certifications/'), lastmod: now, changefreq: 'monthly', priority: '0.8' },
  ]

  for (const doc of allDocs) {
    const lastmod = doc.updatedAt ? new Date(doc.updatedAt) : new Date(doc.publishedAt)
    entries.push({
      url: fullUrl(doc.url),
      lastmod,
      changefreq: 'weekly',
      priority: '0.7',
    })
  }

  for (const blog of allBlogs) {
    const lastmod = blog.updatedAt ? new Date(blog.updatedAt) : new Date(blog.publishedAt)
    entries.push({
      url: fullUrl(blog.url),
      lastmod,
      changefreq: 'monthly',
      priority: '0.8',
    })
  }

  const urlset = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    ...entries.map(
      (e) =>
        `  <url><loc>${escapeXml(e.url)}</loc><lastmod>${formatLastmod(e.lastmod)}</lastmod><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
    ),
    '</urlset>',
  ].join('\n')

  const outPath = path.join(root, 'public', 'sitemap.xml')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, urlset, 'utf8')
  console.log('Wrote sitemap.xml with', entries.length, 'entries')

  // IndexNow: write key file (always) and submit URLs (only in CI or when SUBMIT_INDEXNOW=1)
  const keyFilePath = path.join(root, 'public', `${INDEXNOW_KEY}.txt`)
  fs.writeFileSync(keyFilePath, INDEXNOW_KEY, 'utf8')
  console.log('Wrote IndexNow key file:', `${INDEXNOW_KEY}.txt`)

  const shouldSubmit = process.env.CI === 'true' || process.env.SUBMIT_INDEXNOW === '1'
  if (shouldSubmit) {
    const urlList = entries.map((e) => e.url)
    try {
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: 'adamboualleiguie.github.io',
          key: INDEXNOW_KEY,
          keyLocation: INDEXNOW_KEY_URL,
          urlList,
        }),
      })
      if (res.ok) {
        console.log('IndexNow: submitted', urlList.length, 'URLs to Bing/Yandex')
      } else {
        console.warn('IndexNow: submission failed', res.status, await res.text())
      }
    } catch (err) {
      console.warn('IndexNow: submission error', err.message)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
