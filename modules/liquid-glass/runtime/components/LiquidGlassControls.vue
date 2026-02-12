<template>
  <LiquidGlassContainer class="glass-controls-panel" :border-radius="12" :tint-opacity="0.7">
    <div class="controls-content">
      <h3>Glass Controls</h3>
      
      <div class="control-group">
        <label>
            Blur Radius: <span class="value">{{ blurRadius.toFixed(1) }}</span>
        </label>
        <input 
            type="range" 
            min="0" 
            max="20" 
            step="0.1" 
            :value="blurRadius" 
            @input="update('blurRadius', $event)"
        >
      </div>

       <div class="control-group">
        <label>
            Edge Intensity: <span class="value">{{ edgeIntensity.toFixed(3) }}</span>
        </label>
        <input type="range" min="0" max="0.1" step="0.001" :value="edgeIntensity" @input="update('edgeIntensity', $event)">
      </div>

      <div class="control-group">
        <label>
            Rim Intensity: <span class="value">{{ rimIntensity.toFixed(3) }}</span>
        </label>
        <input type="range" min="0" max="0.2" step="0.001" :value="rimIntensity" @input="update('rimIntensity', $event)">
      </div>

      <div class="control-group">
        <label>
            Base Intensity: <span class="value">{{ baseIntensity.toFixed(3) }}</span>
        </label>
        <input type="range" min="0" max="0.05" step="0.001" :value="baseIntensity" @input="update('baseIntensity', $event)">
      </div>

       <div class="control-group">
        <label>
            Edge Distance: <span class="value">{{ edgeDistance.toFixed(2) }}</span>
        </label>
        <input type="range" min="0.05" max="0.5" step="0.01" :value="edgeDistance" @input="update('edgeDistance', $event)">
      </div>

      <div class="control-group">
        <label>
            Rim Distance: <span class="value">{{ rimDistance.toFixed(2) }}</span>
        </label>
        <input type="range" min="0.1" max="2.0" step="0.01" :value="rimDistance" @input="update('rimDistance', $event)">
      </div>
      
       <div class="control-group">
        <label>
            Base Distance: <span class="value">{{ baseDistance.toFixed(2) }}</span>
        </label>
        <input type="range" min="0.05" max="0.3" step="0.01" :value="baseDistance" @input="update('baseDistance', $event)">
      </div>

       <div class="control-group">
        <label>
            Ripple Effect: <span class="value">{{ rippleEffect.toFixed(2) }}</span>
        </label>
        <input type="range" min="0" max="0.5" step="0.01" :value="rippleEffect" @input="update('rippleEffect', $event)">
      </div>
      
      <div class="control-group checkbox">
          <label>
           <input type="checkbox" :checked="warp" @change="updateBool('warp', $event)">
           Warp Effect
          </label>
      </div>

      <button class="randomize-button" @click="randomizeControls">🎲 Randomize</button>
    </div>
  </LiquidGlassContainer>
</template>

<script setup lang="ts">
import { useGlassControls } from '../composables/useGlassControls'

const { 
    blurRadius, edgeIntensity, rimIntensity, baseIntensity,
    edgeDistance, rimDistance, baseDistance, rippleEffect, warp,
    updateControl, randomizeControls
} = useGlassControls()

const update = (key: string, event: Event) => {
    const val = parseFloat((event.target as HTMLInputElement).value)
    updateControl(key as any, val)
}

const updateBool = (key: string, event: Event) => {
    const val = (event.target as HTMLInputElement).checked
    updateControl(key as any, val)
}
</script>

<style scoped>
.glass-controls-panel {
    width: 300px;
    /* Allows scrolling inside if needed, or just let it expand */
    align-items: flex-start; 
}

.controls-content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    color: #333;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    max-height: 80vh;
    overflow-y: auto;
}

h3 {
    margin: 0 0 16px 0;
    text-align: center;
    color: #222;
}

.control-group {
    margin-bottom: 16px;
}

label {
    display: block;
    margin-bottom: 4px;
    font-weight: 500;
}

.value {
    float: right;
    color: #666;
    font-size: 12px;
}

input[type="range"] {
    width: 100%;
}

.randomize-button {
    width: 100%;
    padding: 10px;
    background: rgba(255,255,255,0.3);
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
}
.randomize-button:hover {
    background: rgba(255,255,255,0.5);
}
</style>
