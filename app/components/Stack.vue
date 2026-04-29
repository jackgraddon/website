<script setup lang="ts">
let props = defineProps<{
    direction?: 'horizontal' | 'vertical',
    gap?: string,
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline',
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly',
    wrap?: boolean
}>();
</script>

<template>
    <div class="stack" :style="{
        display: 'flex',
        flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
        gap: props.gap || '1rem',
        alignItems: props.align === 'start' ? 'flex-start' :
                    props.align === 'center' ? 'center' :
                    props.align === 'end' ? 'flex-end' :
                    props.align === 'stretch' ? 'stretch' :
                    props.align === 'baseline' ? 'baseline' : 'stretch',
        justifyContent: props.justify === 'start' ? 'flex-start' :
                        props.justify === 'end' ? 'flex-end' :
                        props.justify === 'between' ? 'space-between' :
                        props.justify === 'around' ? 'space-around' :
                        props.justify === 'evenly' ? 'space-evenly' : 'flex-start',
        flexWrap: props.wrap ? 'wrap' : 'nowrap'
    }">
        <slot />
    </div>
</template>

<style scoped>
</style>