/**
 * /api/lastfm.get.ts
 *
 * Server-side proxy for the Last.fm recent tracks API.
 * Keeps the API key out of the client bundle by reading it
 * from the LASTFM_API_KEY environment variable.
 *
 * Add to .env:
 *   LASTFM_API_KEY=your_key_here
 *   LASTFM_USER=jackgraddon
 */

export default defineEventHandler(async () => {
    const apiKey = process.env.LASTFM_API_KEY
    const user = process.env.LASTFM_USER ?? 'jackgraddon'

    if (!apiKey) {
        throw createError({ statusCode: 500, statusMessage: 'LASTFM_API_KEY is not set' })
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=2`

    const data = await $fetch<any>(url)

    if (data.error) {
        throw createError({ statusCode: 502, statusMessage: `Last.fm error ${data.error}: ${data.message}` })
    }

    return data
})
