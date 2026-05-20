import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let targetUrl = query.url as string
    const ar = query.ar as string || '16-9'

    if (!targetUrl) {
        throw createError({ statusCode: 400, statusMessage: 'Missing URL' })
    }

    // Normalize target URL (prepend public production domain if relative path)
    const siteUrl = 'https://jackgraddon.com'
    if (targetUrl.startsWith('/')) {
        targetUrl = `${siteUrl}${targetUrl}`
    }

    if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
        return sendRedirect(event, '/no-image.svg')
    }

    // Helper to calculate numerical aspect ratio
    function getRatio(arStr: string): number {
        const [wStr, hStr] = arStr.replace(':', '-').split('-')
        const w = parseFloat(wStr)
        const h = parseFloat(hStr)
        if (!isNaN(w) && !isNaN(h) && h !== 0) {
            return w / h
        }
        return 16 / 9
    }

    // The aspect ratios generated at build time
    const CACHED_PRESETS = [
        { name: '16-9', ratio: 16 / 9 },
        { name: '1-1',  ratio: 1 / 1 },
        { name: '9-16', ratio: 9 / 16 }
    ]

    const targetRatio = getRatio(ar)
    const closestPreset = CACHED_PRESETS.reduce((prev, curr) => {
        return Math.abs(curr.ratio - targetRatio) < Math.abs(prev.ratio - targetRatio) ? curr : prev
    })

    // Hash URL to find cached file
    const hash = crypto.createHash('sha256').update(targetUrl).digest('hex')
    const filename = `${hash}_${closestPreset.name}.png`

    // Define cache paths
    const devPath = path.join(process.cwd(), 'public', 'screenshots', filename)
    const prodPath = path.join(process.cwd(), '.output', 'public', 'screenshots', filename)

    // Check if the file is cached in the filesystem
    let cachePath: string | null = null
    if (fs.existsSync(devPath)) {
        cachePath = devPath
    } else if (fs.existsSync(prodPath)) {
        cachePath = prodPath
    }

    if (cachePath) {
        try {
            const cachedBuffer = fs.readFileSync(cachePath)
            setResponseHeader(event, 'Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
            setResponseHeader(event, 'Content-Type', 'image/png')
            return cachedBuffer
        } catch (readError) {
            console.error('[Screenshot API] Error reading cached file:', readError)
        }
    }

    // Fallback: fetch dynamically if not cached (or if reading cache failed)
    console.log(`[Screenshot API] Cache miss for ${targetUrl}. Fetching dynamically...`)

    const viewports: Record<string, { width: number, height: number }> = {
        '16-9': { width: 1920, height: 1080 },
        '4-3': { width: 1440, height: 1080 },
        '9-16': { width: 1080, height: 1920 },
        '1-1': { width: 1080, height: 1080 }
    }

    const vp = viewports[closestPreset.name] || viewports['16-9']
    const screenshotServiceUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&waitForTimeout=4000&width=${vp.width}&height=${vp.height}`

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
        const imageBuffer = Buffer.from(arrayBuffer)

        // Asynchronously save to cache so subsequent requests are lightning-fast
        try {
            const screenshotsDir = path.dirname(devPath)
            if (!fs.existsSync(screenshotsDir)) {
                fs.mkdirSync(screenshotsDir, { recursive: true })
            }
            fs.writeFile(devPath, imageBuffer, (err) => {
                if (err) {
                    console.error('[Screenshot API] Failed to write fallback cache:', err)
                } else {
                    console.log(`[Screenshot API] Successfully cached fallback screenshot: ${filename}`)
                }
            })
        } catch (saveError) {
            console.error('[Screenshot API] Cache save error:', saveError)
        }

        setResponseHeader(event, 'Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        setResponseHeader(event, 'Content-Type', 'image/png')
        return imageBuffer
    } catch (error) {
        console.error('[Screenshot API] Dynamic screenshot failed:', error)
        return sendRedirect(event, '/no-image.svg')
    }
})