export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server || to.path === from.path) {
        return
    }

    if (to.hash) {
        return
    }

    const scrollDistance = window.scrollY;
    // Calculate duration based on distance - min 200ms
    const duration = Math.max(200, scrollDistance * 0.15);

    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Wait for the scroll to complete visually
    await new Promise(resolve => setTimeout(resolve, duration))
})
