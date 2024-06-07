import { createApp } from 'vue'

const deck = createApp({})

deck.component(
  // the registered name
  'project-deck',
  // the implementation
  {
    // Component template
    template: `
      <div class="deck">
        <slot></slot>
      </div>
    `,
  }
)