/**
 * useCloudStinger
 *
 * Module-level singleton so middleware and CloudStinger.vue always share
 * the exact same refs — no matter how many times the composable is called.
 */

type Phase = 'idle' | 'rising' | 'revealing'

const phase = ref<Phase>('idle')
let _resolveCovered: (() => void) | null = null
let _coveredCallback: (() => void) | null = null

export function useCloudStinger() {
  /**
   * Trigger the full stinger. Returns a Promise that resolves after the
   * complete rise → cover → reveal cycle. Middleware awaits this.
   */
  function trigger(onCovered?: () => void): Promise<void> {
    _coveredCallback = onCovered ?? null
    return new Promise((resolve) => {
      // Resolve when covered, so navigation happens while screen is hidden
      _resolveCovered = resolve
      phase.value = 'rising'
    })
  }

  /** Called by CloudStinger once the viewport is fully covered. */
  function notifyCovered() {
    _coveredCallback?.()
    _coveredCallback = null
    _resolveCovered?.()
    _resolveCovered = null
    phase.value = 'revealing'
  }

  /** Called by CloudStinger once the reveal animation finishes. */
  function notifyRevealed() {
    phase.value = 'idle'
  }

  return {
    phase: readonly(phase),
    trigger,
    notifyCovered,
    notifyRevealed,
  }
}