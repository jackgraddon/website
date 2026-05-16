<template>
  <div class="about-page">
    <PagedContent>
      <!-- Bio Tabs Section -->
      <section class="bio-section snap-section">
        <div class="tab-pills" role="tablist">
          <motion.div
            v-for="(tab, i) in tabs"
            :key="tab.id"
            :initial="{ opacity: 0, y: -10 }"
            :animate="{ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.4 } }"
          >
            <Button
              role="tab"
              :aria-selected="activeTab === tab.id"
              :active="activeTab === tab.id"
              @click="activeTab = tab.id"
            >
              <Icon :name="tab.icon" />
              {{ tab.label }}
            </Button>
          </motion.div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content-wrapper">
          <AnimatePresence mode="wait">
            <motion.div
              :key="activeTab"
              class="tab-content"
              :initial="{ opacity: 0, y: 16 }"
              :animate="{ opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }"
              :exit="{ opacity: 0, y: -10, transition: { duration: 0.2 } }"
            >
              <!-- WHO I AM -->
              <div v-if="activeTab === 'who'" class="tab-panel">
                <div class="bio-text-wrap">
                  <p class="bio-text">
                    Hey, I'm Jack — a
                    <Annotated label="Design Engineer" note="I sit at the intersection of design and code. I care deeply about how things look AND how they work." />
                    based in Spokane, WA. I've been building for the web since I was a kid, and I still get the same kick out of shipping something that looks and feels just right.
                  </p>
                  <p class="bio-text">
                    I believe technology should feel
                    <Annotated label="approachable" note="No unnecessary complexity. If it confuses people, it's not done yet." />
                    — not intimidating. Whether I'm designing a UI or writing a
                    <Annotated label="Vue component" note="Vue + TypeScript is my happy place. Nuxt 4 for anything that needs a full stack." />
                    , I'm always asking: does this make someone's life a little easier?
                  </p>
                  <p class="bio-text">
                    Outside of work, I'm usually obsessing over some new
                    <Annotated label="side project" note="Like Tumult — a Matrix-based chat and media client I'm building from scratch." />
                    , diving into music, or staring at the sky (hence the website).
                  </p>
                </div>
              </div>

              <!-- WHAT I BUILD -->
              <div v-else-if="activeTab === 'build'" class="tab-panel">
                <div class="skills-grid">
                  <motion.div
                    v-for="(skill, i) in skills"
                    :key="skill.label"
                    :initial="{ opacity: 0, scale: 0.95, y: 10 }"
                    :animate="{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.05 + 0.1, duration: 0.4, ease: 'easeOut' } }"
                  >
                    <Surface variant="glass">
                      <div class="skill-card-inner">
                        <Icon :name="skill.icon" class="skill-icon" />
                        <div>
                          <h4 class="skill-label">{{ skill.label }}</h4>
                          <p class="skill-desc">{{ skill.desc }}</p>
                        </div>
                      </div>
                    </Surface>
                  </motion.div>
                </div>
                <p class="build-note">
                  I'm especially drawn to the <Annotated label="design-engineering gap" note="The place where design mockups become something that actually breathes, responds, and feels alive." />, making interfaces that feel crafted, not assembled.
                </p>
              </div>

              <!-- WHAT I'M INTO -->
              <div v-else-if="activeTab === 'into'" class="tab-panel">
                <div class="interests-grid">
                  <motion.div
                    v-for="(interest, i) in interests"
                    :key="interest.label"
                    :initial="{ opacity: 0, scale: 0.95, y: 10 }"
                    :animate="{ opacity: 1, scale: 1, y: 0, transition: { delay: i * 0.05 + 0.1, duration: 0.4, ease: 'easeOut' } }"
                  >
                    <Surface variant="glass">
                      <div class="interest-inner">
                        <Icon :name="interest.icon" class="interest-icon" />
                        <div>
                          <p class="interest-label">{{ interest.label }}</p>
                          <p class="interest-desc">{{ interest.desc }}</p>
                        </div>
                      </div>
                    </Surface>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>


      <!-- Tech Stack -->
      <section class="layout-container snap-section" style="align-items: center;">
        <header class="section-header">
          <div style="display: flex; flex-direction: column; align-items: center;">
            <Icon name="solar:code-square-line-duotone" size="2rem"/>
            <h2>
              My Tech Stack
            </h2>
          </div>
        </header>

        <div class="tech-stack-outer">
          <Surface variant="glass" class="tech-stack-wrap">
            <div class="dock-container">
              <NuxtImg
                v-for="item in stack"
                :key="item.name"
                :src="item.image"
                class="dock-item"
                width="54"
                height="54"
                :alt="item.name"
                :title="item.name"
              />
            </div>
          </Surface>
        </div>
      </section>

      <!-- Right Now Section -->
      <section class="vibe-section snap-section">
        <div class="vibe-header">
          <Icon name="solar:compass-big-line-duotone" class="vibe-header-icon" />
          <h2 class="vibe-title">Right now</h2>
          <p class="vibe-subtitle">A snapshot of where I'm at</p>
        </div>

        <div class="vibe-grid">

          <!-- Now Playing -->
          <Surface variant="glass" class="vibe-card--wide">
            <div class="vibe-card-label">
              <Icon name="solar:music-note-2-line-duotone" />
              {{ lfmTrack?.nowPlaying ? 'Now Playing' : 'Last Played' }}
            </div>
            <div class="now-playing">
              <!-- Album art -->
              <div class="now-playing-art">
                <div class="album-art-placeholder">
                  <NuxtImg
                    v-if="lfmTrack?.albumArt"
                    :src="lfmTrack.albumArt"
                    :alt="lfmTrack.album"
                    class="album-art-img"
                    width="56"
                    height="56"
                  />
                  <Icon v-else name="solar:music-library-2-line-duotone" class="album-placeholder-icon" />
                </div>
                <div v-if="lfmTrack?.nowPlaying" class="now-playing-bars" aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
              </div>
              <!-- Track info -->
              <div class="now-playing-info" v-if="!lfmLoading && !lfmError && lfmTrack">
                <a :href="lfmTrack.url" target="_blank" rel="noopener" class="now-playing-track">
                  {{ lfmTrack.name }}
                </a>
                <p class="now-playing-artist">{{ lfmTrack.artist }}</p>
                <p class="now-playing-album" v-if="lfmTrack.album">{{ lfmTrack.album }}</p>
              </div>
              <div class="now-playing-info" v-else-if="lfmLoading">
                <p class="now-playing-track now-playing-track--muted">Loading...</p>
              </div>
              <div class="now-playing-info" v-else>
                <p class="now-playing-track now-playing-track--muted">
                  {{ lfmError === 'no tracks' ? 'Nothing scrobbled recently' : 'Couldn\'t load Last.fm' }}
                </p>
              </div>
            </div>
          </Surface>

          <!-- Building -->
          <Surface variant="glass">
            <div class="vibe-card-label">
              <Icon name="solar:programming-line-duotone" />
              Building
            </div>
            <p class="vibe-card-title">Tumult</p>
            <p class="vibe-card-body">A Matrix-based chat & media client. Vue, Tauri, and a lot of late nights.</p>
            <Button variant="default" to="/projects/260203">Check it out <Icon name="solar:alt-arrow-right-linear"/></Button>
          </Surface>

          <!-- Current Obsession -->
          <Surface variant="glass">
            <div class="vibe-card-label">
              <Icon name="solar:star-shine-line-duotone" />
              Current obsession
            </div>
            <p class="vibe-card-title">{{ currentObsession.title }}</p>
            <p class="vibe-card-body">{{ currentObsession.body }}</p>
          </Surface>

          <!-- Location -->
          <Surface variant="glass">
            <div class="vibe-card-label">
              <Icon name="solar:map-point-wave-line-duotone" />
              Location
            </div>
            <p class="vibe-card-title">Spokane, WA</p>
            <p class="vibe-card-body">Pacific Time · {{ localTime }}</p>
            <p class="vibe-card-body vibe-card-body--muted">Open to remote work worldwide</p>
          </Surface>

          <!-- GitHub -->
          <Surface variant="glass">
            <div class="vibe-card-label">
              <Icon name="simple-icons:github" />
              GitHub
            </div>
            <p class="vibe-card-title">jackgraddon</p>
            <p class="vibe-card-body">Building in public. Mostly Tumult lately.</p>
            <Button variant="default" to="https://github.com/jackgraddon">View profile <Icon name="solar:alt-arrow-right-linear"/></Button>
          </Surface>

          <!-- Get In Touch -->
          <Surface variant="glass" class="vibe-card--contact">
            <div class="vibe-card-label">
              <Icon name="solar:letter-line-duotone" />
              Get in touch
            </div>
            <p class="vibe-card-body">Got a project in mind, or just want to say hey?</p>
            <div class="contact-links">
              <Button variant="default" to="/contact">
                <Icon name="solar:letter-line-duotone" />
                Email me
              </Button>
              <Button variant="default" to="https://linkedin.com/in/jackgraddon">
                <Icon name="tabler:brand-linkedin-filled" />
                LinkedIn
              </Button>
            </div>
          </Surface>

        </div>
      </section>
    </PagedContent>
  </div>
</template>

<script lang="ts" setup>
import { motion, AnimatePresence } from 'motion-v'

definePageMeta({
  layout: 'default',
  title: 'About',
  description: "Learn more about me!",
  icon: 'solar:user-broken',
})

// ── Tabs ──────────────────────────────────────────────────
const activeTab = ref('who')

const tabs = [
  { id: 'who',   label: 'Who I Am',      icon: 'solar:user-rounded-line-duotone' },
  { id: 'build', label: 'What I Do',     icon: 'solar:code-square-line-duotone' },
  { id: 'into',  label: "What I'm Into", icon: 'solar:heart-shine-line-duotone' },
]

const stack = [
  { name: 'Linux',        image: '/images/apps/fedora.png' },
  { name: 'macOS',        image: '/images/apps/finder.png' },
  { name: 'VS Code',      image: '/images/apps/vscode.png' },
  { name: 'Nuxt 4',       image: '/images/apps/nuxt.png' },
  { name: 'Vue 3',        image: '/images/apps/vue.png' },
  { name: 'Tailwind CSS', image: '/images/apps/tailwind.png' },
  { name: 'TypeScript',   image: '/images/apps/typescript.png' },
  { name: 'Motion',       image: '/images/apps/motion.png' },
  { name: 'Tauri',        image: '/images/apps/tauri.png' },
  { name: 'Affinity',     image: '/images/apps/affinity.png' },
  { name: 'Figma',        image: '/images/apps/figma.png' },
  { name: 'Final Cut',    image: '/images/apps/finalcut.png' },
]


// ── Skills ────────────────────────────────────────────────
const skills = [
  { icon: 'solar:palette-line-duotone',        label: 'Design Engineering', desc: 'Bridging design and production-ready systems with motion and care.' },
  { icon: 'solar:sidebar-code-line-duotone',   label: 'Web',                desc: 'Building with Nuxt 4, creating smooth and intuitive user experiences.' },
  { icon: 'solar:monitor-line-duotone',        label: 'Desktop',            desc: 'Shipping web apps as native desktop clients with Tauri.' },
  { icon: 'solar:pen-new-square-line-duotone', label: 'Graphic Design',     desc: 'Crafting unique compositions in both digital and print.' },
  { icon: 'solar:global-line-duotone',         label: 'Performance',        desc: 'Building a fast, resilient, intuitive web experience.' },
]

const interests = [
  { icon: 'solar:sun-line-duotone',                 label: 'The Sky',        desc: 'Clouds, weather, that liminal golden hour light.' },
  { icon: 'solar:music-note-2-line-duotone',        label: 'Music',          desc: 'All genres, all hours. Music is always on.' },
  { icon: 'solar:cpu-bolt-line-duotone',            label: 'Open Protocols', desc: 'Matrix, ActivityPub — the decentralised web is fascinating.' },
  { icon: 'solar:book-bookmark-line-duotone',       label: 'Craft',          desc: 'Obsessed with things made with intention — code, design, or otherwise.' },
  { icon: 'solar:camera-minimalistic-line-duotone', label: 'Photography',    desc: 'Mostly sky and architecture.' },
  { icon: 'solar:gamepad-line-duotone',             label: 'Games',          desc: 'Indie games with strong aesthetics. Story over mechanics.' },
]

const { track: lfmTrack, loading: lfmLoading, error: lfmError } = useLastFm()

const currentObsession = {
  title: 'Glassmorphism',
  body: 'The physics and beauty of frosted glass as a design element in user interfaces.',
}

const localTime = ref('')
let clockInterval: ReturnType<typeof setInterval>

function updateTime() {
  localTime.value = new Date().toLocaleTimeString('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

onMounted(() => {
  updateTime()
  clockInterval = setInterval(updateTime, 30000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
})
</script>

<style scoped>
.tech-stack-outer {
  width: 100%;
  display: flex;
  justify-content: center;
}

.tech-stack-wrap {
  padding: 0.6rem;
  border-radius: 20px;
  width: fit-content;
  max-width: 100%;
}

.dock-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.dock-item {
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  cursor: default;
}

.dock-item:hover {
  transform: translateY(-8px) scale(1.15);
  filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
}

.about-page {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

.bio-section {
  min-height: 80vh;
  margin: 0 auto;
  padding: 10vh 0;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 1.5rem;
}

/* ── Tab Pills ────────────────────────────────────────── */
.tab-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

/* ── Tab Content ──────────────────────────────────────── */
.tab-content-wrapper {
  min-height: 260px;
  position: relative;
}

.tab-content {
  width: 100%;
}

.tab-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* ── Bio Text ─────────────────────────────────────────── */
.bio-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 680px;
}

.bio-text {
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--color-text-muted);
}

/* ── Skills and Interests Grid ────────────────────────── */
.skills-grid,
.interests-grid {
  columns: 3 280px;
  column-gap: 0.75rem;
  display: block;
}

.skills-grid > *,
.interests-grid > * {
  break-inside: avoid-column;
  margin-bottom: 0.75rem;
  display: inline-block;
  width: 100%;
}

.skill-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.skill-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.skill-label {
  font-family: 'Sunflower', serif;
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 0.2rem;
}

.skill-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.build-note {
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  max-width: 600px;
  padding-top: 0.5rem;
}

.interest-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.interest-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.interest-label {
  font-family: 'Sunflower', serif;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.3;
  margin-bottom: 0.15rem;
}

.interest-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.vibe-section {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.vibe-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}

.vibe-header-icon {
  font-size: 2rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.vibe-title {
  font-family: 'Sunflower', serif;
  font-size: 2rem;
  color: var(--color-text);
  line-height: 1;
}

.vibe-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.vibe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.vibe-card--wide {
  grid-column: span 2;
}
.vibe-card--contact {
  grid-column: span 3;
}

.vibe-card-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.vibe-card-title {
  font-family: 'Sunflower', serif;
  font-size: 1.2rem;
  color: var(--color-text);
  line-height: 1.2;
}

.vibe-card-body {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.vibe-card-body--muted {
  opacity: 0.6;
  font-size: 0.8rem;
}

.now-playing {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.now-playing-art {
  height: 80%;
  position: relative;
  flex-shrink: 0;
}

.album-art-placeholder {
  height: 100%;
  width: auto;
  aspect-ratio: 1;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.album-placeholder-icon {
  font-size: 1.5rem;
  color: var(--color-text-muted);
  opacity: 0.4;
}

.now-playing-bars {
  position: absolute;
  bottom: -6px;
  right: -6px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
  background: var(--color-bg);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  padding: 3px 4px;
}

.now-playing-bars span {
  display: block;
  width: 3px;
  background: var(--color-afternoon);
  border-radius: 2px;
  animation: bar-bounce 1.2s ease-in-out infinite;
}

.now-playing-bars span:nth-child(1) { height: 8px;  animation-delay: 0s; }
.now-playing-bars span:nth-child(2) { height: 12px; animation-delay: 0.2s; }
.now-playing-bars span:nth-child(3) { height: 6px;  animation-delay: 0.4s; }
.now-playing-bars span:nth-child(4) { height: 10px; animation-delay: 0.1s; }

@keyframes bar-bounce {
  0%, 100% { transform: scaleY(0.4); }
  50%       { transform: scaleY(1); }
}

.now-playing-track {
  font-family: 'Sunflower', serif;
  font-size: 1rem;
  color: var(--color-text);
  line-height: 1.3;
  text-decoration: none;
  transition: color 150ms ease;
}

.now-playing-track:hover {
  color: var(--color-afternoon);
  text-decoration: none;
}

.now-playing-track--muted {
  color: var(--color-text-muted);
  opacity: 0.6;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
}

.now-playing-artist {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.now-playing-album {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  opacity: 0.6;
  margin-top: 0.1rem;
}

.album-art-img {
  width: auto;
  height: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  object-fit: cover;
  display: block;
}

.contact-links {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .vibe-grid {
    grid-template-columns: 1fr 1fr;
  }

  .vibe-card--wide {
    grid-column: span 2;
  }

  .vibe-card--contact {
    grid-column: span 2;
  }

  .skills-grid {
    columns: 2 280px;
  }
}

@media (max-width: 480px) {
  .vibe-grid {
    grid-template-columns: 1fr;
  }

  .vibe-card--wide,
  .vibe-card--contact {
    grid-column: span 1;
  }

  .skills-grid,
  .interests-grid {
    columns: 1;
  }
}
</style>