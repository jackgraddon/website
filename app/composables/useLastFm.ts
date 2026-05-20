// composables/useLastFm.ts
export interface LastFmTrack {
  name: string
  artist: string
  album: string
  albumArt: string | null
  url: string
  nowPlaying: boolean
}

export function useLastFm() {
  const track = ref<LastFmTrack | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchRecentTrack() {
    try {
      // Call the server-side proxy — keeps the API key out of the client bundle
      const data = await $fetch<any>('/api/lastfm')

      // Last.fm returns track as array normally, but can return a single object
      // when there's only one result — normalise to always be an array
      const raw = data?.recenttracks?.track
      const tracks = Array.isArray(raw) ? raw : raw ? [raw] : []

      if (!tracks.length) {
        error.value = 'no tracks'
        return
      }

      const recent = tracks[0]
      const images: any[] = recent.image ?? []

      // Find the best available image — prefer extralarge, then large, then medium
      const art = ['extralarge', 'large', 'medium'].reduce<string | null>((found, size) => {
        if (found) return found
        const img = images.find((i: any) => i.size === size)
        const src = img?.['#text']?.trim()
        return src && src !== '' ? src : null
      }, null)

      track.value = {
        name: recent.name,
        artist: recent.artist?.['#text'] ?? recent.artist ?? '',
        album: recent.album?.['#text'] ?? '',
        albumArt: art,
        url: recent.url,
        nowPlaying: recent['@attr']?.nowplaying === 'true',
      }
      error.value = null
    } catch (e: any) {
      // Server route throws if env var is missing, or if Last.fm is down
      error.value = e?.data?.statusMessage ?? e?.message ?? 'fetch failed'
    } finally {
      loading.value = false
    }
  }

  let interval: ReturnType<typeof setInterval>

  onMounted(() => {
    fetchRecentTrack()
    interval = setInterval(fetchRecentTrack, 30000)
  })

  onUnmounted(() => clearInterval(interval))

  return { track, loading, error }
}