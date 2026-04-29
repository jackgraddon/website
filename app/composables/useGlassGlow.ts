import { type Ref, onMounted, onUnmounted } from 'vue';

/**
 * Singleton registry — one global `mousemove` listener drives all glass
 * elements simultaneously. Each element receives --mouse-x / --mouse-y as
 * percentage values relative to its own bounding box, which can be negative
 * or >100% when the cursor is outside the element. The CSS radial-gradient
 * radius then determines how far the glow bleeds into surrounding elements.
 */
const _elements = new Set<HTMLElement>();
let _listening = false;

function _getEl(refVal: any): HTMLElement | null {
    if (!refVal) return null;
    // Vue component instances (e.g. NuxtLink) expose the root DOM node as $el
    if (refVal.$el instanceof HTMLElement) return refVal.$el;
    if (refVal instanceof HTMLElement) return refVal;
    return null;
}

function _onMouseMove(e: MouseEvent) {
    for (const el of _elements) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mouse-x', `${((e.clientX - r.left) / r.width)  * 100}%`);
        el.style.setProperty('--mouse-y', `${((e.clientY - r.top)  / r.height) * 100}%`);
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
