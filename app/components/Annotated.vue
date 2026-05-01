<template>
  <span class="annotated-wrap" @mouseenter="show = true" @mouseleave="show = false" @focusin="show = true" @focusout="show = false" tabindex="0">
    <span class="annotated-label">{{ label }}</span>
    <AnimatePresence>
      <motion.span
        v-if="show"
        class="annotated-note"
        role="tooltip"
        :initial="{ opacity: 0, y: 6, scale: 0.96, filter: 'blur(4px)' }"
        :animate="{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.2, ease: 'easeOut' } }"
        :exit="{ opacity: 0, y: 4, scale: 0.97, filter: 'blur(2px)', transition: { duration: 0.15 } }"
      >
        {{ note }}
      </motion.span>
    </AnimatePresence>
  </span>
</template>

<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v'

defineProps<{
  label: string
  note: string
}>()

const show = ref(false)
</script>

<style scoped>
.annotated-wrap {
  position: relative;
  display: inline;
  cursor: help;
  outline: none;
}

.annotated-label {
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1.5px dashed rgba(255, 255, 255, 0.85);
  padding-bottom: 1px;
  transition: border-color 150ms ease, color 150ms ease;
}

.annotated-wrap:hover .annotated-label,
.annotated-wrap:focus .annotated-label {
  border-color: rgba(255, 255, 255, 0.30);
  color: rgba(255, 255, 255, 0.30);
}

.annotated-note {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 10%;
  transform: translateX(-50%);
  width: max-content;
  max-width: 240px;
  background: color-mix(in srgb, var(--color-surface) 90%, transparent);
  border: 1.5px solid rgba(174, 207, 219, 0.2);
  border-radius: 10pt;
  backdrop-filter: blur(12px);
  padding: 0.55rem 0.8rem;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  white-space: normal;

  /* little arrow */
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(174, 207, 219, 0.2);
  }
}
</style>
