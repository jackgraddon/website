
import html2canvas from 'html2canvas'
import { ref } from 'vue'

const pageSnapshot = ref<HTMLCanvasElement | null>(null)
const isCapturing = ref(false)
const waitingForSnapshot = ref<Array<() => void>>([])

export function usePageSnapshot() {
    const captureSnapshot = async () => {
        if (pageSnapshot.value) return
        if (isCapturing.value) {
            return new Promise<void>((resolve) => {
                waitingForSnapshot.value.push(resolve)
            })
        }

        isCapturing.value = true
        console.log('Capturing page snapshot...')

        try {
            // Wait for all images to load to avoid capturing background instead of content
            await waitForImages()

            const snapshot = await html2canvas(document.body, {
                scale: 1,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                ignoreElements: (element) => {
                    // Ignore all glass elements
                    return (
                        element.classList.contains('glass-container') ||
                        element.classList.contains('glass-button') ||
                        element.classList.contains('glass-button-text') ||
                        element.hasAttribute('data-glass-ignore')
                    )
                }
            })

            console.log('Page snapshot captured', snapshot)
            pageSnapshot.value = snapshot

            // Notify waiting components
            waitingForSnapshot.value.forEach(resolve => resolve())
            waitingForSnapshot.value = []

        } catch (error) {
            console.error('html2canvas error:', error)
            waitingForSnapshot.value = []
        } finally {
            isCapturing.value = false
        }
    }

    const ensureSnapshot = async () => {
        if (!pageSnapshot.value) {
            await captureSnapshot()
        }
    }

    return {
        pageSnapshot,
        isCapturing,
        captureSnapshot,
        ensureSnapshot
    }
}

// Helper to wait for all images to load
function waitForImages(): Promise<void> {
    const images = Array.from(document.images)
    const promises = images.map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise<void>(resolve => {
            img.onload = () => resolve()
            img.onerror = () => resolve() // Resolve on error too to avoid blocking
        })
    })

    // Timeout after 2 seconds to prevent hanging
    const timeout = new Promise<void>(resolve => setTimeout(resolve, 2000))

    return Promise.race([
        Promise.all(promises).then(() => { }),
        timeout
    ])
}
