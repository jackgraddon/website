<template>
  <div v-if="variant === 'default'" class="surface default" :style="surfaceStyles">
    <slot />
  </div>
  <div
    v-else-if="variant === 'glass'"
    :class="['surface-glass', span ? `surface-glass--${span}` : '']"
    :style="surfaceStyles"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ 
  color?: string,
  variant?: 'default' | 'glass',
  span?: 'wide' | 'contact' | 'normal',
}>();

const surfaceStyles = computed(() => {
  let surfaceColor = 'var(--color-primary)';
  let backgroundColor = 'rgba(255, 255, 255, 0.3)';
  let textColor = 'var(--color-primary)';

  if (props.color && props.color.trim()) {
      if (props.color.startsWith('#') || props.color.startsWith('rgb')) {
          backgroundColor = `rgba(0, 0, 0, 0.1)`;
          surfaceColor = props.color;
          textColor = props.color;
      } else if (props.color === 'primary' || props.color === 'accent') {
          surfaceColor = `var(--color-${props.color})`;
          textColor = `var(--color-${props.color})`;
      }
  }

  return {
    '--surface-color': surfaceColor,
    '--background-color': backgroundColor,
    '--text-color': textColor,
  };
});
</script>

<style scoped>
.surface {
  padding: 1rem;
  border-radius: 20pt;
}

.default {
    background-color: var(--color-surface);
}

/* ── Glass Variant ────────────────────────────────────── */
.surface-glass {
    background: rgba(255, 255, 255, 0.04);
    border: 1.5px solid rgba(255, 255, 255, 0.08);
    border-radius: 18pt;
    padding: 1.2rem 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: background 200ms ease, border-color 200ms ease;
}

.surface-glass:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.14);
}

.surface-glass--wide {
    grid-column: span 2;
}

.surface-glass--contact {
    grid-column: span 2;
}
</style>