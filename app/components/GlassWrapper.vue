<template>
  <div class="glass-wrapper-container" :style="containerStyle">
    <!-- SVG Filter Definition -->
    <svg width="0" height="0" style="position: absolute; pointer-events: none; opacity: 0; aria-hidden: true;">
      <defs>
        <filter :id="filterId" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence 
            type="fractalNoise" 
            :baseFrequency="baseFrequency" 
            numOctaves="3" 
            seed="5" 
            result="noise" 
          />
          <feDisplacementMap 
            in="SourceGraphic" 
            in2="noise" 
            :scale="refractionScale" 
            xChannelSelector="R" 
            yChannelSelector="G" 
          />
        </filter>
      </defs>
    </svg>

    <div class="glass-surface" :style="surfaceStyle">
      <div class="glass-content">
        <slot />
      </div>
      
      <!-- Premium highlights -->
      <div class="glass-shine" />
      <div class="glass-edge" /
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps({
  refractionScale: {
    type: Number,
    default: 25
  },
  baseFrequency: {
    type: Number,
    default: 0.015
  },
  blurRadius: {
    type: Number,
    default: 20
  },
  borderRadius: {
    type: String,
    default: '16px'
  },
  tintColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.05)'
  },
  borderColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.2)'
  }
})

// Generate a unique ID to avoid collisions if multiple wrappers are used
const filterId = `glass-filter-${Math.random().toString(36).substr(2, 9)}`

const containerStyle = computed(() => ({
  borderRadius: props.borderRadius,
  overflow: 'hidden',
  position: 'relative' as const,
  display: 'inline-block'
}))

const surfaceStyle = computed(() => ({
  backdropFilter: `blur(${props.blurRadius}px) url(#${filterId}) saturate(160%) contrast(90%)`,
  WebkitBackdropFilter: `blur(${props.blurRadius}px) url(#${filterId}) saturate(160%) contrast(90%)`,
  backgroundColor: props.tintColor,
  border: `1px solid ${props.borderColor}`,
  borderRadius: props.borderRadius,
  width: '100%',
  height: '100%',
  position: 'relative' as const,
  zIndex: 1
}))
</script>

<style scoped>
.glass-wrapper-container {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.glass-surface {
  position: relative;
  box-shadow: 
    0 8px 32px 0 rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.glass-content {
  position: relative;
  z-index: 2;
  padding: inherit;
}

.glass-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 30% 30%, 
    rgba(255, 255, 255, 0.1) 0%, 
    transparent 50%
  );
  pointer-events: none;
  z-index: 3;
}

.glass-edge {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.05);
  pointer-events: none;
  z-index: 4;
}

/* Force children to inherit glassiness if they are wrappers too */
:deep(.glass-wrapper-container) {
  backdrop-filter: none !important;
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
</style>
