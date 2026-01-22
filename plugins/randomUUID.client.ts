export default defineNuxtPlugin(() => {
    // Polyfill crypto.randomUUID for browsers that don't support it (e.g., older Safari)
    const g = globalThis as any
    if (typeof g.crypto === 'undefined') {
        // If crypto is missing entirely, create a minimal stub
        g.crypto = {}
    }
    if (typeof g.crypto.randomUUID !== 'function') {
        const getRandomValues: ((arr: Uint8Array) => Uint8Array) | undefined = g.crypto?.getRandomValues
        g.crypto.randomUUID = () => {
            const bytes = new Uint8Array(16)
            if (typeof getRandomValues === 'function') {
                getRandomValues(bytes)
            } else {
                // Fallback (less secure) if getRandomValues is unavailable
                for (let i = 0; i < bytes.length; i++) {
                    bytes[i] = Math.floor(Math.random() * 256)
                }
            }
            // Set version and variant bits per RFC 4122 v4
            bytes[6] = (bytes[6] & 0x0f) | 0x40
            bytes[8] = (bytes[8] & 0x3f) | 0x80
            const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'))
            return (
                hex.slice(0, 4).join('') + '-' +
                hex.slice(4, 6).join('') + '-' +
                hex.slice(6, 8).join('') + '-' +
                hex.slice(8, 10).join('') + '-' +
                hex.slice(10).join('')
            )
        }
    }
})
