// composables/useLastFm.ts
export interface LastFmTrack {
  name: string
  artist: string
  album: string
  albumArt: string | null
  url: string
  nowPlaying: boolean
}

const LASTFM_API_KEY = 'dcaa05f4938fc2d2b68d6e2055fb5f54'
const LASTFM_USER = 'jackgraddon'

export function useLastFm() {
  const track = ref<LastFmTrack | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchRecentTrack() {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_API_KEY}&format=json&limit=2`
      const res = await fetch(url)

      if (!res.ok) {
        error.value = `HTTP ${res.status}`
        return
      }

      const data = await res.json()

      if (data.error) {
        error.value = `Last.fm error ${data.error}: ${data.message}`
        return
      }

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
      error.value = e?.message ?? 'fetch failed'
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