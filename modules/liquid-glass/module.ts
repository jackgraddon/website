import { defineNuxtModule, createResolver, addComponent, addImports } from '@nuxt/kit'

export interface ModuleOptions {
  // Options for the module
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'liquid-glass-nuxt',
    configKey: 'liquidGlass'
  },
  defaults: {},
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Register components
    addComponent({
      name: 'LiquidGlassContainer',
      filePath: resolver.resolve('./runtime/components/LiquidGlassContainer.vue')
    })

    addComponent({
      name: 'LiquidGlassControls',
      filePath: resolver.resolve('./runtime/components/LiquidGlassControls.vue')
    })

    addComponent({
      name: 'LiquidGlassButton',
      filePath: resolver.resolve('./runtime/components/LiquidGlassButton.vue')
    })

    // Register composables
    addImports({
      name: 'useGlassGl',
      as: 'useGlassGl',
      from: resolver.resolve('./runtime/composables/useGlassGl')
    })

    addImports({
      name: 'usePageSnapshot',
      as: 'usePageSnapshot',
      from: resolver.resolve('./runtime/composables/usePageSnapshot')
    })
  }
})
