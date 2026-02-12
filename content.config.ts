import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        projects: defineCollection({
            type: 'page',
            source: 'projects/**/*.md',
            schema: z.object({
                icon: z.string()
            })
        })
    }
})
