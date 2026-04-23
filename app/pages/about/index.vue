<template>
  <div class="about-page">

    <!-- ===================== -->
    <!--   BIO TABS SECTION    -->
    <!-- ===================== -->
    <section class="bio-section">
      <!-- Tab Pills -->
      <div class="tab-pills" role="tablist">
        <motion.button
          v-for="(tab, i) in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="activeTab === tab.id"
          :class="['tab-pill', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
          :initial="{ opacity: 0, y: -10 }"
          :animate="{ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.4 } }"
        >
          <Icon :name="tab.icon" class="tab-icon" />
          {{ tab.label }}
        </motion.button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content-wrapper">
        <AnimatePresence mode="wait">
          <motion.div
            :key="activeTab"
            class="tab-content"
            :initial="{ opacity: 0, y: 16, filter: 'blur(6px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } }"
            :exit="{ opacity: 0, y: -10, filter: 'blur(4px)', transition: { duration: 0.2 } }"
          >
            <!-- WHO I AM -->
            <div v-if="activeTab === 'who'" class="tab-panel">
              <div class="bio-text-wrap">
                <p class="bio-text">
                  Hey, I'm Jack — a
                  <Annotated label="Design Engineer" note="I sit at the intersection of design and code. I care deeply about how things look AND how they work." />
                  based in
                  <Annotated label="Spokane, WA" note="Eastern Washington — surprisingly great for a tech nerd. Mountains, coffee, and fast internet." />
                  . I've been building for the web since I was a kid, and I still get the same kick out of shipping something that looks and feels just right.
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
                <div v-for="skill in skills" :key="skill.label" class="skill-card">
                  <div class="skill-card-inner">
                    <Icon :name="skill.icon" class="skill-icon" />
                    <div>
                      <h4 class="skill-label">{{ skill.label }}</h4>
                      <p class="skill-desc">{{ skill.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p class="build-note">
                I'm especially drawn to the
                <Annotated label="design–engineering gap" note="The place where a Figma file becomes something that actually breathes, responds, and feels alive." />
                — making interfaces that feel crafted, not assembled.
              </p>
            </div>

            <!-- WHAT I'M INTO -->
            <div v-else-if="activeTab === 'into'" class="tab-panel">
              <div class="interests-grid">
                <div v-for="interest in interests" :key="interest.label" class="interest-item">
                  <Icon :name="interest.icon" class="interest-icon" />
                  <div>
                    <p class="interest-label">{{ interest.label }}</p>
                    <p class="interest-desc">{{ interest.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>

    <!-- ===================== -->
    <!--   VIBE BOARD SECTION  -->
    <!-- ===================== -->
    <section class="vibe-section">
      <div class="vibe-header">
        <Icon name="solar:compass-big-line-duotone" class="vibe-header-icon" />
        <h2 class="vibe-title">Right now</h2>
        <p class="vibe-subtitle">A snapshot of where I'm at</p>
      </div>

      <div class="vibe-grid">

        <!-- Now Playing -->
        <Surface variant="glass" span="wide">
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
              <!-- Dev hint: remove before shipping -->
              <p class="now-playing-album" v-if="lfmError && lfmError !== 'no tracks'">{{ lfmError }}</p>
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
          <Button variant="default" to="/projects/260203">See the project <Icon name="solar:alt-arrow-right-linear"/></Button>
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
        <Surface variant="glass" span="contact">
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
              <Icon name="simple-icons:linkedin" />
              LinkedIn
            </Button>
          </div>
        </Surface>

      </div>
    </section>

  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { motion, AnimatePresence } from 'motion-v'

definePageMeta({
  layout: 'default',
  title: 'About',
  description: "Learn more about me!",
  icon: 'solar:user-broken',
})

// ── Tabs ─────────────────────────────────────────────────
const activeTab = ref('who')

const tabs = [
  { id: 'who', label: 'Who I Am', icon: 'solar:user-rounded-line-duotone' },
  { id: 'build', label: 'What I Build', icon: 'solar:code-square-line-duotone' },
  { id: 'into', label: "What I'm Into", icon: 'solar:heart-shine-line-duotone' },
]

// ── Skills ────────────────────────────────────────────────
const skills = [
  { icon: 'solar:palette-line-duotone', label: 'Design Engineering', desc: 'Bridging Figma and production-ready Vue components with motion and care.' },
  { icon: 'solar:sidebar-code-line-duotone', label: 'Vue / Nuxt', desc: 'My primary stack. Nuxt 4, Pinia, TypeScript, motion-v.' },
  { icon: 'solar:smartphone-line-duotone', label: 'Tauri / Desktop', desc: 'Shipping web apps as native desktop clients with Rust under the hood.' },
  { icon: 'solar:pen-new-square-line-duotone', label: 'Graphic Design', desc: 'Logos, brand identity, print, and digital — I\'ve done it all.' },
  { icon: 'solar:server-line-duotone', label: 'Matrix / Protocols', desc: 'Building Tumult on top of the Matrix protocol for decentralised comms.' },
  { icon: 'solar:global-line-duotone', label: 'Web Performance', desc: 'PWA, service workers, caching — making the web fast and resilient.' },
]

// ── Interests ─────────────────────────────────────────────
const interests = [
  { icon: 'solar:music-note-2-line-duotone', label: 'Music', desc: 'All genres, all hours. Music is always on.' },
  { icon: 'solar:sky-line-duotone', label: 'The Sky', desc: 'Clouds, weather, that liminal golden hour light. Obviously.' },
  { icon: 'solar:cpu-bolt-line-duotone', label: 'Open Protocols', desc: 'Matrix, ActivityPub — the decentralised web is fascinating.' },
  { icon: 'solar:book-bookmark-line-duotone', label: 'Craft', desc: 'Obsessed with things made with intention — code, design, or otherwise.' },
  { icon: 'solar:camera-minimalistic-line-duotone', label: 'Photography', desc: 'Mostly sky and architecture. Surprise surprise.' },
  { icon: 'solar:gamepad-line-duotone', label: 'Games', desc: 'Indie games with strong aesthetics. Story over mechanics.' },
]

// ── Last.fm ───────────────────────────────────────────────
const { track: lfmTrack, loading: lfmLoading, error: lfmError } = useLastFm()

// ── Current Obsession (update manually) ───────────────────
const currentObsession = {
  title: 'Liquid Glass UI',
  body: 'The physics of frosted glass and how to push it further than anyone expects.',
}

// ── Local Time ────────────────────────────────────────────
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

<!-- ──────────────────────────────────────────────────────── -->
<!--  Annotated Inline Component                             -->
<!-- ──────────────────────────────────────────────────────── -->
<script lang="ts">
// Inline sub-component for hover annotations
</script>

<style scoped>
/* ── Page ─────────────────────────────────────────────── */
.about-page {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

/* ── Bio Section ──────────────────────────────────────── */
.bio-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Tab Pills ────────────────────────────────────────── */
.tab-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 1.1rem 0.5rem;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text-muted);
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background 200ms ease, border-color 200ms ease, color 200ms ease, transform 150ms ease, box-shadow 200ms ease;
}

.tab-pill:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.4);
  color: var(--color-text);
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 4px 10px rgba(0, 0, 0, 0.14);
}

.tab-pill.active {
  background: rgba(255, 255, 255, 0.16);
  border-color: rgba(255, 255, 255, 0.5);
  color: var(--color-text);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.1);
}

.tab-icon {
  font-size: 1rem;
  opacity: 0.85;
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

/* ── Skills Grid ──────────────────────────────────────── */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.skill-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14pt;
  padding: 1rem 1.1rem;
  transition: background 200ms ease, border-color 200ms ease;
}

.skill-card:hover {
  background: rgba(174, 207, 219, 0.07);
  border-color: rgba(174, 207, 219, 0.2);
}

.skill-card-inner {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.skill-icon {
  font-size: 1.5rem;
  color: var(--color-afternoon);
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

/* ── Interests Grid ───────────────────────────────────── */
.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}

.interest-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14pt;
  padding: 0.9rem 1rem;
  transition: background 200ms ease, border-color 200ms ease;
}

.interest-item:hover {
  background: rgba(115, 149, 111, 0.08);
  border-color: rgba(115, 149, 111, 0.25);
}

.interest-icon {
  font-size: 1.4rem;
  color: var(--color-secondary);
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

/* ── Vibe Section ─────────────────────────────────────── */
.vibe-section {
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

/* ── Vibe Grid ────────────────────────────────────────── */
.vibe-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
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

/* ── Now Playing ──────────────────────────────────────── */
.now-playing {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.now-playing-art {
  position: relative;
  flex-shrink: 0;
}

.album-art-placeholder {
  width: 56px;
  height: 56px;
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


/* ── Contact Links ────────────────────────────────────── */
.contact-links {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 768px) {
  .vibe-grid {
    grid-template-columns: 1fr;
  }
  .vibe-card--wide,
  .vibe-card--contact {
    grid-column: span 1;
  }
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>