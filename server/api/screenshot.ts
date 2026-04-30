export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let targetUrl = query.url as string
    const ar = query.ar as string || '16-9';

    const viewports: Record<string, { width: number, height: number }> = {
        '16-9': { width: 1920, height: 1080 },
        '4-3': { width: 1440, height: 1080 },
        '9-16': { width: 1080, height: 1920 },
        '1-1': { width: 1080, height: 1080 }
    };

    const vp = viewports[ar] || viewports['16-9'];

    if (!targetUrl) {
        throw createError({ statusCode: 400, statusMessage: 'Missing URL' })
    }

    // 1. Resolve relative paths to absolute URLs
    if (targetUrl.startsWith('/')) {
        const host = getHeader(event, 'host')
        // In dev, host is usually 'localhost:3000'
        // In production (Vercel), it's your actual domain
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
        targetUrl = `${protocol}://${host}${targetUrl}`
    }

    // 2. The Localhost Catch (Read the section below!)
    if (targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1')) {
        // Microlink cannot see your local machine. 
        // We should return a local fallback or a redirect.
        return sendRedirect(event, '/placeholder-preview.png')
    }

    const screenshotServiceUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&width=${vp!.width}&height=${vp!.height}`;

    try {
        const response = await $fetch<{ data: { screenshot: { url: string } } }>(screenshotServiceUrl)
        const imageUrl = response.data.screenshot.url

        const imageBuffer = await $fetch<Blob>(imageUrl)

        setResponseHeader(event, 'Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
        setResponseHeader(event, 'Content-Type', 'image/png')

        return imageBuffer
    } catch (error) {
        console.error('Screenshot failed:', error)
        return sendRedirect(event, '/placeholder-preview.png')
    }
})