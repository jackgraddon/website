export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.server || to.path === from.path) {
        return
    }

    if (to.hash) {
        return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
    // Wait for a brief moment to allow the scroll to start/complete visually
    await new Promise(resolve => setTimeout(resolve, 150))
})
