<template>
  <div>
    <Splash :title="title || 'Loading...'" :subtitle="description || 'Please hang tight!'" />
    <main style="text-align: center">
      <section>
        <div v-if="readmeContent" v-html="renderedMarkdown"></div>
        <p v-else>Loading...</p>
      </section>
      <section>
        <a v-if="repoUrl" :href="repoUrl" class="btn" target="_blank" rel="noopener noreferrer">View Repository</a>
        <p v-else>No repository URL provided.</p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: Project Page
 * Description: Display a project page with its title and content. Pulls data from GitHub from info looked up in project dictionary. Uses ID passed in URL.
 * Author: Jack Graddon
 */
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { projectDictionary } from '~/composables/project'

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/"

const route = useRoute()
const id = computed(() => route.query.id as string)

const title = ref<string | null>(null)
const description = ref<string | null>(null)
const repoUrl = ref<string | null>(null)
const readmeContent = ref<string | null>(null)

function removeTableOfContents(content: string): string {
  const tocRegex = /## Table of Contents[\s\S]*?(?=##|$)/i
  return content.replace(tocRegex, '')
}

const renderedMarkdown = computed(() => {
  if (!readmeContent.value) return ''
  return marked(readmeContent.value)
})

const fetchProjectData = async () => {
  const projectId = id.value
  if (projectId && projectDictionary[projectId]) {
    const detailsUrl = `${BASE_URL}${projectDictionary[projectId].url}`

    try {
      const response = await fetch(detailsUrl)
      if (!response.ok) {
        throw new Error("Failed to fetch project details")
      }
      const projectDetails = await response.json()

      title.value = projectDetails.name
      description.value = projectDetails.description
      repoUrl.value = `https://github.com/jackgraddon/${projectDetails.url.replace('/main/README.md', '')}`

      const readmeUrl = `${BASE_URL}${projectDetails.url}`
      const readmeResponse = await fetch(readmeUrl)
      if (!readmeResponse.ok) {
        throw new Error("Failed to fetch README")
      }
      const content = await readmeResponse.text()
      readmeContent.value = removeTableOfContents(content)
    } catch (error) {
      console.error(error)
      readmeContent.value = "Failed to load project README."
    }
  } else {
    readmeContent.value = "Invalid project ID."
  }
}

onMounted(() => {
  fetchProjectData()
})

watch(id, () => {
  fetchProjectData()
})

watch([title, description], () => {
  if (title.value && description.value) {
    useHead({
      title: `${title.value} | Jack Graddon`,
      meta: [
        { name: 'description', content: description.value }
      ]
    })
  }
})
</script>
