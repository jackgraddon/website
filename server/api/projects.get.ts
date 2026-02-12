export default defineEventHandler(async (event) => {
    // Use Nitro's storage abstraction to access the file system
    const storage = useStorage('root')

    // Get all keys starting with public/projects
    const keys = await storage.getKeys('public/projects')

    const projects = []

    for (const key of keys) {
        if (key.endsWith('projectDetails.json')) {
            const data = await storage.getItem(key)
            // Storage might return objects if the driver parses JSON, or strings
            if (data) {
                const project = typeof data === 'string' ? JSON.parse(data) : data
                projects.push(project)
            }
        }
    }

    // Sort by date (id is likely YYYYMMDD or similar date format as noted)
    // Assuming descending order for timeline (newest first)
    return projects.sort((a, b) => b.id - a.id)
})