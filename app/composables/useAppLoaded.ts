export const useAppLoaded = () => {
  const isLoaded = useState('appLoaded', () => false)
  
  if (import.meta.client) {
    onMounted(() => {
      const setLoaded = () => {
        // Use requestAnimationFrame to ensure the browser has had a chance to paint
        requestAnimationFrame(() => {
          // A small delay often helps settle any remaining background tasks
          setTimeout(() => {
            isLoaded.value = true
          }, 300)
        })
      }

      if (document.readyState === 'complete') {
        setLoaded()
      } else {
        window.addEventListener('load', setLoaded, { once: true })
      }
    })
  }

  return { isLoaded }
}
