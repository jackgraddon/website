let activeScrollAbort: (() => void) | null = null

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server || to.path === from.path) {
        return
    }

    if (to.hash) {
        return
    }

    const { trigger } = useCloudStinger()

    if (activeScrollAbort) {
        activeScrollAbort()
    }

    // Start the JS-eased scroll immediately — races the stinger upward.
    // We don't await it; the stinger covers any jank before scroll completes.
    scrollToTop()

    // Await the stinger to reach full cover (and hold for 0.5s).
    // The middleware returning is what triggers the Nuxt route swap.
    await trigger()
    
    // Abort any ongoing easing before the swap
    if (activeScrollAbort) {
        activeScrollAbort()
    }

    // Force an instant snap to top before the route even returns.
    window.scrollTo(0, 0)

    // And do it again in a setTimeout(0) to ensure we hit the new page 
    // context even if the browser tries to restore scroll after the swap.
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 0)
})

/**
 * JS-driven eased scroll — ease-out cubic so it decelerates smoothly,
 * giving a "floating upward" feel. Duration scales with distance.
 */
function scrollToTop(): Promise<void> {
    return new Promise((resolve) => {
        const start = window.scrollY
        if (start === 0) { resolve(); return }

        let aborted = false
        activeScrollAbort = () => { aborted = true }

        const duration = Math.min(Math.max(start * 0.45, 280), 680)
        const startTime = performance.now()

        function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

        function tick(now: number) {
            if (aborted) { resolve(); return }

            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            window.scrollTo(0, start * (1 - easeOutCubic(progress)))
            if (progress < 1) requestAnimationFrame(tick)
            else { window.scrollTo(0, 0); resolve() }
        }

        requestAnimationFrame(tick)
    })
}