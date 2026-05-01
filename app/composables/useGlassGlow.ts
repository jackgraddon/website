import { type Ref, onMounted, onUnmounted } from 'vue';

/**
 * Singleton registry — one global `mousemove` listener drives all glass
 * elements simultaneously. Each element receives --mouse-x / --mouse-y as
 * percentage values relative to its own bounding box, which can be negative
 * or >100% when the cursor is outside the element. The CSS radial-gradient
 * radius then determines how far the glow bleeds into surrounding elements.
 *
 * RAF-throttled: getBoundingClientRect is only called once per animation
 * frame, not on every raw mouse event.
 */
const _elements = new Set<HTMLElement>();
let _listening = false;
let _rafId = 0;
let _lastX = 0;
let _lastY = 0;

function _getEl(refVal: any): HTMLElement | null {
    if (!refVal) return null;
    // Vue component instances (e.g. NuxtLink) expose the root DOM node as $el
    if (refVal.$el instanceof HTMLElement) return refVal.$el;
    if (refVal instanceof HTMLElement) return refVal;
    return null;
}

function _applyGlow() {
    _rafId = 0;
    
    // Batch reads first to avoid layout thrashing
    const updates: { el: HTMLElement, x: string, y: string }[] = [];
    
    for (const el of _elements) {
        // Optional: skip if element is not connected to DOM
        if (!el.isConnected) continue;
        
        const r = el.getBoundingClientRect();
        
        // Optimization: Skip calculations if the mouse is nowhere near the element 
        // (e.g. more than 1000px away) - but for now let's just batch.
        updates.push({
            el,
            x: `${(((_lastX) - r.left) / r.width)  * 100}%`,
            y: `${(((_lastY) - r.top)  / r.height) * 100}%`
        });
    }
    
    // Then batch writes
    for (const update of updates) {
        update.el.style.setProperty('--mouse-x', update.x);
        update.el.style.setProperty('--mouse-y', update.y);
    }
}

function _onMouseMove(e: MouseEvent) {
    _lastX = e.clientX;
    _lastY = e.clientY;
    // Throttle updates to one per animation frame
    if (_rafId === 0) {
        _rafId = requestAnimationFrame(_applyGlow);
    }
}

/**
 * Call inside a `<script setup>` component and pass a template ref.
 * The element is registered on mount and deregistered on unmount.
 * The global listener is created when the first element registers and
 * torn down when the last element deregisters.
 */
export function useGlassGlow(elRef: Ref<any>) {
    onMounted(() => {
        const el = _getEl(elRef.value);
        if (!el) return;

        _elements.add(el);

        if (!_listening) {
            document.addEventListener('mousemove', _onMouseMove, { passive: true });
            _listening = true;
        }
    });

    onUnmounted(() => {
        const el = _getEl(elRef.value);
        if (el) _elements.delete(el);

        if (_elements.size === 0 && _listening) {
            document.removeEventListener('mousemove', _onMouseMove);
            _listening = false;
        }
    });
}
