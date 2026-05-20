import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export async function generateScreenshots() {
  console.log('[Screenshot Generator] Starting build-time screenshot generation...')

  const heroPath = path.join(process.cwd(), 'app/components/Hero.vue')
  if (!fs.existsSync(heroPath)) {
    console.warn(`[Screenshot Generator] Hero.vue not found at ${heroPath}, skipping.`)
    return
  }

  const heroContent = fs.readFileSync(heroPath, 'utf8')
  // Match url: '/...' or url: 'https://...'
  const urlRegex = /url:\s*['"]([^'"]+)['"]/g
  const urls: string[] = []
  let match
  while ((match = urlRegex.exec(heroContent)) !== null) {
    urls.push(match[1])
  }

  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(urls))
  console.log(`[Screenshot Generator] Found ${uniqueUrls.length} URLs to process:`, uniqueUrls)

  const aspectRatios = {
    '1-1': { width: 1080, height: 1080 },
    '16-9': { width: 1920, height: 1080 },
    '9-16': { width: 1080, height: 1920 }
  }

  const publicScreenshotsDir = path.join(process.cwd(), 'public/screenshots')
  if (!fs.existsSync(publicScreenshotsDir)) {
    fs.mkdirSync(publicScreenshotsDir, { recursive: true })
  }

  const siteUrl = 'https://jackgraddon.com'

  for (const rawUrl of uniqueUrls) {
    // Normalize URL
    const normalizedUrl = rawUrl.startsWith('/') ? `${siteUrl}${rawUrl}` : rawUrl

    // Skip localhost/127.0.0.1
    if (normalizedUrl.includes('localhost') || normalizedUrl.includes('127.0.0.1')) {
      continue
    }

    const hash = crypto.createHash('sha256').update(normalizedUrl).digest('hex')

    for (const [arName, vp] of Object.entries(aspectRatios)) {
      const filename = `${hash}_${arName}.png`
      const filePath = path.join(publicScreenshotsDir, filename)

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`[Screenshot Generator] Cache hit for ${rawUrl} (${arName}), skipping.`)
        continue
      }

      console.log(`[Screenshot Generator] Downloading ${rawUrl} (${arName}) [${vp.width}x${vp.height}]...`)

      const screenshotServiceUrl = `https://api.microlink.io/?url=${encodeURIComponent(normalizedUrl)}&screenshot=true&meta=false&waitForTimeout=4000&width=${vp.width}&height=${vp.height}`

      try {
        const response = await fetch(screenshotServiceUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch microlink metadata: ${response.statusText}`)
        }

        const data = (await response.json()) as any
        const imageUrl = data.data?.screenshot?.url

        if (!imageUrl) {
          throw new Error('Screenshot URL not found in microlink response')
        }

        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download screenshot image: ${imageResponse.statusText}`)
        }

        const arrayBuffer = await imageResponse.arrayBuffer()
        fs.writeFileSync(filePath, Buffer.from(arrayBuffer))
        console.log(`[Screenshot Generator] Saved ${filename}`)
      } catch (error: any) {
        console.error(`[Screenshot Generator] Failed to generate screenshot for ${rawUrl} (${arName}):`, error.message)
      }
    }
  }

  console.log('[Screenshot Generator] Screenshot generation complete.')
}

// Enable running directly via node
if (process.argv[1] === new URL(import.meta.url).pathname) {
  generateScreenshots()
}
