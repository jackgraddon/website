
import { reactive, toRefs } from 'vue'

const state = reactive({
    edgeIntensity: 0.01,
    rimIntensity: 0.05,
    baseIntensity: 0.01,
    edgeDistance: 0.15,
    rimDistance: 0.8,
    baseDistance: 0.1,
    cornerBoost: 0.02,
    rippleEffect: 0.1,
    blurRadius: 5.0,
    tintOpacity: 0.2, // Global tint, can be overridden by instance
    warp: false
})

export function useGlassControls() {
    const updateControl = (key: keyof typeof state, value: number | boolean) => {
        // @ts-ignore
        state[key] = value
    }

    const randomizeControls = () => {
        state.edgeIntensity = 0.005 + Math.random() * 0.025
        state.rimIntensity = 0.02 + Math.random() * 0.13
        state.baseIntensity = 0.005 + Math.random() * 0.025
        state.edgeDistance = 0.1 + Math.random() * 0.3
        state.rimDistance = 0.3 + Math.random() * 1.2
        state.baseDistance = 0.08 + Math.random() * 0.17
        state.cornerBoost = 0.01 + Math.random() * 0.05
        state.rippleEffect = 0.05 + Math.random() * 0.25
        state.blurRadius = 2 + Math.random() * 10
        state.tintOpacity = 0.1 + Math.random() * 0.7
        state.warp = Math.random() < 0.3
    }

    return {
        ...toRefs(state),
        updateControl,
        randomizeControls
    }
}
