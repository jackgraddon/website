<script setup lang="ts">
definePageMeta({
  title: 'Projects',
  description: 'A selection of my work.',
  icon: 'solar:folder-broken',
  keywords: 'projects, portfolio, work, design, development'
})
</script>

<template>
    <section>
        <h1>Some cool ones...</h1>
        <Stack direction="horizontal" gap="1rem" justify="between">
            <Card image="no-image.svg"></Card>
            <Card project-id="221001"></Card>
            <Card></Card>
        </Stack>
    </section>
</template>

<style scoped>

</style>