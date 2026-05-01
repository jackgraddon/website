<script setup lang="ts">
import { motion, useScroll, useTransform, useMotionTemplate, useInView, AnimatePresence } from "motion-v"

const { isLoaded } = useAppLoaded()
    
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

// Map scroll progress to opacity change (removed blur - filter forces repaint on scroll)
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
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
        <div v-if="props.variant === 'landing'">
            <FloatingCTADisplay id="floating-ctas" :ctas="[
                { id: 1, title: 'Projects', url: '/projects', icon: 'solar:laptop-minimalistic-bold' },
                { id: 2, title: 'GitHub', url: 'https://github.com/jackgraddon', icon: 'tabler:brand-github-filled' },
                { id: 3, title: 'About', url: '/about', icon: 'solar:hand-shake-bold-duotone' },
                { id: 4, title: 'LinkedIn', url: 'https://linkedin.com/in/jackgraddon', icon: 'tabler:brand-linkedin-filled' },
                { id: 5, title: 'Contact', url: '/contact', icon: 'solar:letter-bold' },
            ]" />
        </div>
        <motion.div class="hero-content" ref="heroContent" :style="{ opacity, transform: scaleTransform }">
            <div v-if="props.variant === 'landing'">
                <motion.div
                    :key="props.iconName"
                    :initial="{ rotate: 0, opacity: 0 }"
                    :animate="isLoaded ? { rotate: [0, 12, -8, 12, 0], opacity: 1, transition: { duration: 1.8, repeat: Infinity, ease: 'easeInOut', opacity: { duration: 0.5, delay: 0.5, ease: 'easeOut', repeat: 0 } } } : { opacity: 0 }"
                    :exit="{ opacity: 0 }"
                    style="transform-origin: bottom center;"
                >
                    <Icon class="hero-icon" name="solar:hand-shake-line-duotone"/>
                </motion.div>
                <h1 class="hero-title">
                    <AnimatePresence mode="wait">
                        <motion.div
                            :key="landingTitle"
                            :initial="{ opacity: 0 }"
                            :animate="isLoaded ? { opacity: 1, transition: { duration: 0.5 } } : { opacity: 0 }"
                            :exit="{ opacity: 0, transition: { duration: 0.2 } }" 
                        >
                            <motion.span
                                v-for="(char, index) in landingTitle.split('')"
                                :key="index"
                                :initial="{ opacity: 0, y: 12 }"
                                :animate="isLoaded ? { opacity: 1, y: 0, transition: { delay: 0.3 + (index * 0.04), duration: 0.4, ease: 'easeOut' } } : { opacity: 0, y: 12 }"
                                style="display: inline-block; white-space: pre;"
                            >
                                {{ char }}
                            </motion.span>
                        </motion.div>
                    </AnimatePresence>
                </h1>
                <div style="position: relative; min-height: 1.5em; width: 100%;">
                    <AnimatePresence mode="popLayout">
                        <motion.p
                            class="hero-subtitle"
                            :key="landingSubtitle"
                            :initial="{ opacity: 0, y: 20 }"
                            :animate="isLoaded ? { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } } : { opacity: 0, y: 20 }"
                            :exit="{ opacity: 0 }"
                            style="position: absolute; width: 100%; top: 0;"
                        >
                            {{ landingSubtitle }}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
            <div v-else>
                <div class="hero-content" ref="heroContent">
                    <motion.div
                        :key="props.iconName"
                        :initial="{ opacity: 0 }"
                        :animate="isLoaded ? { opacity: 1 } : { opacity: 0 }"
                        :transition="{ duration: 0.5, delay: 0.8 }"
                        :exit="{ opacity: 0 }"
                    >
                        <Icon v-if="props.iconName" class="hero-icon" :name="props.iconName"/>
                    </motion.div>
                    <h1 class="hero-title">
                        <AnimatePresence mode="wait">
                            <motion.div
                                :key="props.title || 'Add Title'"
                                :initial="{ opacity: 0 }"
                                :animate="isLoaded ? { opacity: 1, transition: { duration: 0.5 } } : { opacity: 0 }"
                                :exit="{ opacity: 0, transition: { duration: 0.2 } }" 
                            >
                                <motion.span
                                    v-for="(char, index) in (props.title || 'Add Title').split('')"
                                    :key="index"
                                    :initial="{ opacity: 0, y: 12 }"
                                    :animate="isLoaded ? { opacity: 1, y: 0, transition: { delay: 0.3 + (index * 0.04), duration: 0.4, ease: 'easeOut' } } : { opacity: 0, y: 12 }"
                                    style="display: inline-block; white-space: pre;"
                                >
                                    {{ char }}
                                </motion.span>
                            </motion.div>
                        </AnimatePresence>
                    </h1>
                    <div style="position: relative; min-height: 1.5em; width: 100%;">
                        <AnimatePresence mode="popLayout">
                            <motion.p
                                class="hero-subtitle"
                                :key="props.subtitle"
                                :initial="{ opacity: 0, y: 20 }"
                                :animate="isLoaded ? { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } } : { opacity: 0, y: 20 }"
                                :exit="{ opacity: 0 }"
                                style="position: absolute; width: 100%; top: 0;"
                            >
                                {{ props.subtitle }}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
        
        <motion.div
            class="hero-cloud-wrapper"
            :initial="{ y: 100, opacity: 0, filter: 'blur(20px)' }"
            :animate="isLoaded ? { y: 0, opacity: 1, filter: 'blur(0px)' } : { y: 100, opacity: 0, filter: 'blur(20px)' }"
            :transition="{ duration: 1.2, ease: 'easeOut' }"
        >
            <motion.img
                class="hero-cloud-img"
                alt="Decorative image of a fluffy cloud"
                :src="'images/splash-cloud.webp'"
                :style="{ y }"
            />
        </motion.div>
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

#floating-ctas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 100;
}

.hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100vw;
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

.hero-cloud-wrapper {
    min-width: 1560px;
    width: 100%;
    height: auto;
    position: absolute;
    bottom: -30%;
    z-index: 2;
    pointer-events: none;
    display: flex;
    justify-content: center;
}

.hero-cloud-img {
    width: 100%;
    height: auto;
}
</style>