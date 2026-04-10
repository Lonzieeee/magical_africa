import React from 'react'
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Magical Africa'
const SITE_URL = 'https://magical.africa'
const DEFAULT_IMAGE = `${SITE_URL}/images/magical-colored-fav.png`

const toAbsoluteUrl = (value = '') => {
  if (!value) return DEFAULT_IMAGE
  if (/^https?:\/\//i.test(value)) return value
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`
}

const normalizePath = (value = '/') => {
  if (!value) return '/'
  return value.startsWith('/') ? value : `/${value}`
}

const buildDefaultSchema = ({ title, description, canonical, image, type }) => ({
  '@context': 'https://schema.org',
  '@type': type || 'WebPage',
  name: title,
  description,
  url: canonical,
  image,
  inLanguage: 'en'
})

const PageSeo = ({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  keywords = '',
  type = 'website',
  schemaType = 'WebPage',
  noIndex = false,
  jsonLd = []
}) => {
  const canonicalPath = normalizePath(path)
  const canonical = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`
  const absoluteImage = toAbsoluteUrl(image)
  const robots = noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'
  const schemas = [buildDefaultSchema({ title, description, canonical, image: absoluteImage, type: schemaType })]
    .concat(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])

  return (
    <Helmet prioritizeSeoTags>
      <html lang='en' />
      <title>{title}</title>
      <meta name='description' content={description} />
      {keywords ? <meta name='keywords' content={keywords} /> : null}
      <meta name='robots' content={robots} />
      <meta name='author' content={SITE_NAME} />
      <link rel='canonical' href={canonical} />

      <meta property='og:site_name' content={SITE_NAME} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={type} />
      <meta property='og:url' content={canonical} />
      <meta property='og:image' content={absoluteImage} />

      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={absoluteImage} />

      {schemas.map((item, index) => (
        <script key={`seo-schema-${index}`} type='application/ld+json'>
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}

export default PageSeo
