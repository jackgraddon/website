<script setup lang="ts">
useHead({
  title: 'Projects',
  meta: [
    { name: 'description', content: 'Projects by Jack Graddon' }
  ],
})
</script>

<template>
    <Hero title="Projects" subtitle="A selection of my work." iconName="solar:folder-broken" />
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