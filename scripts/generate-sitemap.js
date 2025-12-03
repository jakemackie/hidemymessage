import { writeFileSync } from 'node:fs'

const baseUrl = 'https://hidemymessage.com'

const urls = [
  '/',
  '/message'
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${baseUrl}${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('')}
</urlset>
`

writeFileSync('public/sitemap.xml', xml)
console.log('✅ sitemap.xml written to /public')
