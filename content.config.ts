import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        projects: defineCollection({
            type: 'page',
            source: 'projects/**/*.md',
            schema: z.object({
                title: z.string().optional(),
                subtitle: z.string().optional(),
                buttonColor: z.string().optional(),
                backgroundColor: z.string().optional(),
                status: z.string().optional(),
                icon: z.string().optional(),
            })
        })
    }
})
