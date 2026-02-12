<script setup lang="ts">
// Each section will snap to the viewport when scrolling
import { ref, onMounted, onUnmounted } from 'vue'
import { motion, useScroll, useTransform, useSpring } from 'motion-v'

const container = ref<HTMLElement | null>(null)
const currentSection = ref(0)
const isScrolling = ref(false)
const scrollAccumulator = ref(0)
const scrollThreshold = 100 // Adjust sensitivity

// Track scroll progress
const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"]
})

// Create staggered slow scroll transforms for each child
const sectionTransforms = ref<any[]>([])

function createSectionTransforms() {
    if (!container.value) return
    
    const sections = Array.from(container.value.children) as HTMLElement[]
    const totalSections = sections.length
    
    sectionTransforms.value = sections.map((_, index) => {
        // Stagger each section's entrance/exit timing
        const sectionStart = (index / totalSections)
        const sectionEnd = ((index + 1) / totalSections)
        const sectionMid = sectionStart + (sectionEnd - sectionStart) * 0.5
        
        return useSpring(
            useTransform(scrollYProgress, 
                [
                    sectionStart - 0.1,  // Before section: off screen below
                    sectionStart,         // Quick enter
                    sectionMid - 0.05,    // Slow hang (early)
                    sectionMid + 0.05,    // Slow hang (late)
                    sectionEnd,           // Quick exit
                    sectionEnd + 0.1      // After section: off screen above
                ],
                [
                    0,                    // Start off screen
                    -100,                 // Entered screen
                    -120,                 // Slow moving
                    -130,                 // Slow moving
                    -250,                 // Quick exit
                    -350                  // Off screen above
                ]
            ),
            { stiffness: 100, damping: 20 }
        )
    })
}

onMounted(() => {
    createSectionTransforms()
})

</script>

<template>
    <div class="paged-content" ref="container">
        <slot :sectionTransforms="sectionTransforms" />
    </div>
</template>

<style>
.paged-content {
    display: grid;
    gap: 4rem;
    
    > section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: start;
    }
}
</style>