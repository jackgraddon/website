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
        <Stack direction="horizontal" gap="2rem" justify="between" class="fit-wide">
            <Card image="no-image.svg">
                <template #footer>
                    <Button to="#">Learn More</Button>
                </template>
            </Card>
            <Card>
                
            </Card>
            <Card>

            </Card>
        </Stack>
    </section>
</template>

<style scoped>

</style>