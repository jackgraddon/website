<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    image?: string,
    projectId?: string,
}>();

// Fetch project data using nuxt content if projectId is provided
const projectData = ref<any>(null);
if (props.projectId) {
    const { data } = await useAsyncData(`project-data-${props.projectId}`, () => {
        return queryCollection('content').path(`/projects/${props.projectId}`).first();
    });
    projectData.value = data.value;
}

// Define base URL for the project images
const imageUrl = {
    base: '/projects/',
    trail: '/ogImage.jpg'
}
// Determine the image source based on projectId or image prop
const projectImage = props.projectId ? `${imageUrl.base}${props.projectId}${imageUrl.trail}` : props.image ? `/${props.image}` : undefined;

// Determine button data if projectId is provided
const buttonLink = props.projectId ? `/projects/${props.projectId}` : undefined;
const buttonColor = props.projectId ? (projectData.value as any)?.meta?.buttonColor : 'primary';

console.log(buttonColor);

</script>

<template>
    <div class="card" :style="{
        backgroundImage: projectImage ? 'url(' + projectImage + ')' : 'none',
        }">
        <div class="card-header">
            <slot name="header" />
        </div>
        <div class="card-body">
            <slot />
        </div>
        <div class="card-footer">
            <Button v-if="buttonLink" :to="buttonLink" :color="buttonColor">Learn More</Button>
            <slot v-else name="footer" />
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 100%;
    aspect-ratio: 1.6;
    position: relative;

    display: flex;
    flex-direction: column;

    background-color: var(--color-surface);
    background-position: center;
    background-size: calc(100% + 4px);
    backdrop-filter: blur(7pt);
    
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 26pt;

    overflow: hidden;
}
.card-header {
    width: 100%;
}
.card-body {
    width: 100%;
    flex-grow: 1;
}
.card-footer {
    position: absolute;
    width: fit-content;
    bottom: 0;
    right: 0;
    padding: 0.5rem;
}
</style>