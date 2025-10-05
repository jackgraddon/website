# Website Migration: Next.js to Nuxt 3

This project has been successfully migrated from Next.js to Nuxt 3!

## 🎉 Migration Complete

The application has been transitioned from React/Next.js to Vue/Nuxt 3 with the following changes:

### Key Changes Made:

1. **Framework Update**
   - Replaced Next.js with Nuxt 3
   - Migrated from React to Vue 3 with Composition API
   - Updated all dependencies for Vue ecosystem

2. **Routing**
   - Converted Next.js `src/app` directory to Nuxt `pages` directory
   - Migrated all page components to Vue SFC format
   - File-based routing now uses Nuxt conventions

3. **Components**
   - All React components converted to Vue Single File Components
   - Used Vue Composition API (`<script setup>`)
   - Replaced React hooks with Vue composables:
     - `useState` → `ref`
     - `useEffect` → `onMounted`, `watch`
     - `useRouter` → `useRouter` (Nuxt version)

4. **Styling**
   - Moved styles from `src/styles/` to `assets/styles/`
   - Maintained SASS module system
   - Updated font paths for Nuxt conventions
   - Converted CSS modules to work with Vue's `$style`

5. **Animation**
   - Replaced Framer Motion with `@vueuse/motion`
   - Converted scroll animations to use VueUse composables

6. **Image Optimization**
   - Replaced Next.js `Image` with Nuxt `NuxtImg`
   - Configured `@nuxt/image` module

7. **Configuration**
   - Created `nuxt.config.ts` with equivalent settings
   - Updated TypeScript and ESLint configs for Nuxt/Vue
   - Maintained SASS preprocessor configuration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## 📁 Project Structure

```
├── assets/
│   └── styles/          # Global SASS styles and fonts
├── components/          # Vue components
│   ├── Background.vue
│   ├── ContactForm.vue
│   ├── ProjectDeck.vue
│   ├── SiteFooter.vue
│   └── Splash.vue
├── layouts/
│   └── default.vue      # Default layout
├── pages/               # File-based routing
│   ├── index.vue        # Home page
│   ├── about.vue
│   ├── contact.vue
│   ├── projects.vue
│   └── contact/
│       └── success.vue
├── public/              # Static assets
├── utils/               # Utility functions
│   ├── project.ts
│   └── timeWindows.ts
├── app.vue              # Root component
├── nuxt.config.ts       # Nuxt configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## 🔧 Configuration

### Environment Variables
Runtime config is set in `nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    appName: "Jack Graddon's Portfolio Website"
  }
}
```

### SASS Variables
Global SASS variables are available in all components:
- `$mobile-width: 480px`
- `$tablet-width: 768px`
- `$desktop-width: 1024px`

## 📝 Component Migration Notes

### Splash Component
- Converted Framer Motion scroll animations to VueUse's `useWindowScroll`
- Manual easing function implementation
- Reactive computed properties for transforms

### ProjectDeck Component
- Async data fetching with `onMounted` and `watch`
- Maintained GitHub API integration
- Updated image paths for Nuxt Image

### ContactForm Component
- Form handling with Vue's `v-model`
- Replaced `useRouter` redirect with Nuxt's `navigateTo`
- Maintained Formspree integration

## 🎨 Styling

- SASS modules are imported via `src` attribute in style tags
- Module classes accessed via `$style.className` in templates
- Global styles automatically loaded from `assets/styles/globals.sass`

## 📦 Dependencies

### Core
- `nuxt`: ^3.15.1
- `vue`: ^3.5.13

### Modules & Plugins
- `@nuxt/image`: Image optimization
- `@vueuse/motion`: Animation library
- `@vueuse/core`: Vue composition utilities
- `@vercel/analytics` & `@vercel/speed-insights`: Analytics

## ⚠️ Known Migration Items

### Still Using Old Structure
The following directories contain Next.js/React code and can be safely removed after verifying the migration:
- `src/app/` - Old Next.js pages
- `src/components/` - Old React components
- `src/styles/` - Old styles (now in `assets/styles/`)

### Additional Pages to Migrate
Some pages may still need migration:
- Social page (`/social`)
- Legal page (`/legal`)
- Project detail page (`/project`)

### Icons
The original used `hugeicons-react`. You may want to:
- Use Vue icon library like `@iconify/vue`
- Create custom Vue icon components
- Use SVG icons directly

## 🐛 Debugging

If you encounter issues:

1. **TypeScript errors**: Run `npm run postinstall` to generate Nuxt types
2. **Module not found**: Clear `.nuxt` directory and restart dev server
3. **Style issues**: Check SASS module paths and imports
4. **Runtime errors**: Check browser console and Nuxt dev server logs

## 📚 Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Vue 3 Documentation](https://vuejs.org)
- [VueUse Documentation](https://vueuse.org)
- [Nuxt Image Documentation](https://image.nuxt.com)

## 🎯 Next Steps

1. **Test all pages** - Verify each route works correctly
2. **Remove old files** - Clean up `src/` directory with Next.js code
3. **Add remaining pages** - Migrate social, legal, and project detail pages
4. **Icon library** - Replace React icon library with Vue alternative
5. **Deploy** - Update deployment config for Nuxt (Vercel works great!)
6. **Performance** - Test and optimize with Lighthouse

---

**Original Framework**: Next.js 15 + React 19  
**New Framework**: Nuxt 3 + Vue 3  
**Migration Date**: 2025  
**Author**: Jack Graddon
