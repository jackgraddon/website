<script setup lang="ts">
import { ref, watch } from "vue"
import { motion, useScroll, useTransform, useMotionTemplate, useInView } from "motion-v"
import cloudImg from "~/assets/img/splash-cloud.webp"
    
// Define props for the component
const props = defineProps<{
    title?: string, // Title text
    subtitle?: string // Subtitle text
    iconName?: string // Icon name compatible with Nuxt Icon 
    variant?: 'default' | 'landing' // For handling logic only used in landing page
}>()

// Handle viewport animations
const hero = ref<HTMLElement | null>(null)
const heroContent = ref<HTMLElement | null>(null)

// Track scroll progress of cloud image
const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"]
})

// Map scroll progress to vertical movement
const y = useTransform(scrollYProgress, [0, 1], [0, -200])

// Map scroll progress to opacity and blur change
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
const blur = useTransform(scrollYProgress, [0, 1], [0, 10])
const blurFilter = useMotionTemplate`blur(${blur}px)`
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
const scaleTransform = useMotionTemplate`scale(${scale})`

// Landing specific logic

// Get the current time to use for dynamic greeting
let now = new Date().getHours();

// Define greeting based on time of day
const greeting = computed(() => {
    if (now >= 6 && now < 12) {
        // Morning
        return 'Good Morning!';
    } else if (now >= 12 && now < 18) {
        // Afternoon
        return 'Good Afternoon!';
    } else if (now >= 18 && now < 21) {
        // Evening
        return 'Good Evening!';
    } else {
        // Night
        return 'Good Night!';
    }
});

// Define subtitle based on time of day
const subtitle = computed(() => {
    if (now >= 6 && now < 12) {
        return "It's going to be a great day.";
    } else if (now >= 12 && now < 18) {
        return "Let's finish strong!";
    } else if (now >= 18 && now < 21) {
        return "Hope you had a wonderful day.";
    } else {
        return "Get some rest for tomorrow.";
    }
});

// Reactive titles for landing variant
const landingTitle = ref<string>(greeting.value);
const landingSubtitle = ref<string>(subtitle.value);

// Change title when heroContent is out of view
const inView = useInView(heroContent, { amount: 0 }) 

watch(inView, (visible) => {
    if (!visible) {
        changeLandingHeroTitle()
    }
})

function changeLandingHeroTitle() {
    landingTitle.value = "Jack Graddon";
    landingSubtitle.value = "Design Engineer";
}

</script>


<template>
    <section class="hero" ref="hero">
        <motion.div class="hero-content" ref="heroContent" :style="{ opacity, filter: blurFilter, transform: scaleTransform }">
            <div v-if="props.variant === 'landing'">
                <motion.div
                    :initial="{ rotate: 0 }"
                    :animate="{ rotate: [0, 12, -8, 12, 0], transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } }"
                    style="transform-origin: bottom center;"
                >
                    <Icon class="hero-icon" name="solar:hand-shake-line-duotone"/>
                </motion.div>
                <h1 class="hero-title">{{ landingTitle }}</h1>
                <p class="hero-subtitle">{{ landingSubtitle }}</p>
            </div>
            <div v-else>
                <motion.div class="hero-content" ref="heroContent">
                    <Icon v-if="props.iconName" class="hero-icon" :name="props.iconName"/>
                    <h1 class="hero-title">{{ props.title || 'Add Title' }}</h1>
                    <p class="hero-subtitle">{{ props.subtitle }}</p>
                </motion.div>
            </div>
        </motion.div>
        <motion.img
            class="hero-cloud"
            :src="cloudImg"
            :style="{ y }"
        />
    </section>
</template>

<style scoped>
.hero {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 75vh;
    margin-bottom: 25vh;
}

.hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.hero-icon {
    font-size: 2rem;
}

.hero-title {
    font-size: 3rem;
    line-height: 1;
    color: var(--color-text);
}

.hero-subtitle {
    font-size: 1.2rem;
    line-height: 1;
    color: var(--color-text-muted);
}

.hero-cloud {
    min-width: 1560px;
    width: 100%;
    height: auto;
    opacity: 1;
    position: absolute;
    bottom: -30%;
    z-index: 2;
    pointer-events: none;
}
</style>