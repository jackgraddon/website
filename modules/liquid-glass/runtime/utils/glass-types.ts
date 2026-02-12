
import type { PropType } from 'vue'

export const glassProps = {
    type: {
        type: String as PropType<'rounded' | 'circle' | 'pill'>,
        default: 'pill'
    },
    borderRadius: {
        type: Number,
        default: 48
    },
    tintOpacity: {
        type: Number,
        default: 0.2
    },
    blurRadius: {
        type: Number,
        default: 5.0
    },
    warp: {
        type: Boolean,
        default: false
    },
    // Advanced controls
    edgeIntensity: { type: Number, default: 0.01 },
    rimIntensity: { type: Number, default: 0.05 },
    baseIntensity: { type: Number, default: 0.01 },
    edgeDistance: { type: Number, default: 0.15 },
    rimDistance: { type: Number, default: 0.8 },
    baseDistance: { type: Number, default: 0.1 },
    cornerBoost: { type: Number, default: 0.02 },
    rippleEffect: { type: Number, default: 0.1 }
}

export const GlassContainerKey = Symbol('GlassContainer')
