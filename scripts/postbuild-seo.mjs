import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SEO_ROUTE_LIST } from '../src/utils/seoContent.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')
const distDir = path.join(projectRoot, 'dist')
const indexPath = path.join(distDir, 'index.html')

const SITE_NAME = 'Magical Africa'
const SITE_URL = 'https://magical.africa'
const DEFAULT_IMAGE = `${SITE_URL}/images/magical-colored-fav.png`

const routes = SEO_ROUTE_LIST

const toAbsoluteUrl = (value = '') => {
  if (!value) return DEFAULT_IMAGE
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

const canonicalUrl = (routePath) => `${SITE_URL}${routePath === '/' ? '' : routePath}`

const buildSchema = (route) => JSON.stringify({
  '@context': 'https://schema.org',
  '@type': route.schemaType || 'WebPage',
  name: route.title,
  description: route.description,
  url: canonicalUrl(route.path),
  image: toAbsoluteUrl(route.image),
  inLanguage: 'en'
})

const stripSeoTags = (html) => html
  .replace(/<title>[\s\S]*?<\/title>/i, '')
  .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+name="robots"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+property="og:title"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+property="og:description"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+property="og:type"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+property="og:image"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+property="og:url"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+name="twitter:card"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+name="twitter:title"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+name="twitter:description"[\s\S]*?\/>\s*/i, '')
  .replace(/<meta\s+name="twitter:image"[\s\S]*?\/>\s*/i, '')
  .replace(/<link\s+rel="canonical"[\s\S]*?\/?>\s*/i, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '')

const buildSeoBlock = (route) => {
  const image = toAbsoluteUrl(route.image)
  const url = canonicalUrl(route.path)
  const robots = route.noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  return `
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="keywords" content="${route.keywords}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${buildSchema(route)}</script>
  `
}

const routeOutputPath = (routePath) => {
  if (routePath === '/') return indexPath
  return path.join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

const main = async () => {
  const template = await readFile(indexPath, 'utf8')

  for (const route of routes) {
    const outputPath = routeOutputPath(route.path)
    const html = stripSeoTags(template).replace('</head>', `${buildSeoBlock(route)}\n  </head>`)

    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html, 'utf8')
  }

  console.log(`SEO route HTML generated for ${routes.length} public routes.`)
}

main().catch((error) => {
  console.error('SEO postbuild failed:', error)
  process.exit(1)
})
