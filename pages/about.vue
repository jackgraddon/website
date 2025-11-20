<template>
  <div>
    <Splash title="About" subtitle="Everything you need to know about me." />
    <main :class="$style.container">
      <section :class="$style.cover">
        <div :class="$style.portrait">
          <NuxtImg 
            src="/images/portraits/Jack_Vertical_Lean.webp" 
            alt="Jack leaning against a pillar, black and white." 
            width="1281"
            height="1920" 
          />
        </div>
        <div :class="$style.col" style="align-items: start; text-align: left">
          <h2>Hello! 👋</h2>
          <p>I'm Jack Graddon, a freelance Web Developer and Graphic Designer with a passion for creating technology that is intuitive, accessible, and enjoyable. My studies in Digital Technology and Culture at Washington State University, as a Regent Scholar and Honors Student, empower me to approach challenges with creativity and determination.</p>
          <p>My goal? To make technology easier for everyone—whether they're tech-savvy or just getting started.</p>
          <div class="btnGroup">
            <a class="btn" href="https://raw.githubusercontent.com/jackgraddon/jackgraddon/main/Resume.pdf"
                  title="Download my Resume" rel="noreferrer noopener" target="_blank">Download Resume</a>
            <a class="btn" href="https://linkedin.com/in/jackgraddon" title="View my LinkedIn" rel="noreferrer noopener" target="_blank"><LinkedInIcon /></a>
            <a class="btn" href="https://instagram.com/jack.graddon" title="View my Instagram" rel="noreferrer noopener" target="_blank"><InstagramIcon /></a>
          </div>
        </div>
      </section>
      <section>
        <h2>Experience</h2>
        <p>I've worked on diverse web development projects, including modernizing websites for organizations like the Cowboy Ted Foundation and the Learning and Performance Research Center at WSU. These projects taught me how to create engaging user experiences while adhering to professional standards. Over the years, I've worked on many exciting projects. Some of my highlights are below!</p>
        <ProjectDeck first-id="240101" second-id="230101" third-id="240701" />
      </section>
      <section>
        <h2>How It All Began</h2>
        <p>My journey started at my grandparents' house, exploring design through Microsoft Publisher. That simple beginning sparked my love for technology and design. Over the years, I've taught myself to code (HTML, CSS, JavaScript), mastered tools like Photoshop and Illustrator, and even ventured into 3D modeling with Blender.</p>
        <p>I've always been a hands-on learner, taking things apart to figure out how they work (though at the time they only went back together successfully 20% of the time). This curiosity has fueled my love for creating things that are visually and functionally excellent.</p>
      </section>
      <section>
        <h2>Education &amp; Skills</h2>
        <p>From high school design and coding classes to advanced university courses, I've built a solid foundation in:</p>
        <div :class="$style.skills">
          <div>
            <h3><SourceCodeIcon /> Web Development</h3>
            <p>Skilled in HTML, CSS, and JavaScript, I create clean, responsive, and user-friendly websites tailored to client needs. My focus is on modern design principles, accessibility, and functionality, ensuring that each project not only looks great but performs flawlessly across devices and browsers.</p>
          </div>
          <div>
            <h3><PaintBrushIcon /> Design Software</h3>
            <p>Proficient in Adobe Creative Suite, my preferred Affinity Suite, and Figma, I bring ideas to life with exceptional graphic design, prototyping, and branding capabilities. From crafting pixel-perfect user interfaces to creating stunning visual content, I specialize in delivering designs that captivate and inspire.</p>
          </div>
          <div>
            <h3><VideoIcon /> Media Production</h3>
            <p>Experienced in video editing and production using Final Cut Pro, DaVinci Resolve, and Motion, as well as audio production with Logic Pro. I produce engaging and professional-quality media content, ensuring every detail enhances the overall storytelling experience.</p>
          </div>
        </div>
      </section>
      <section>
        <h2>Let's Collaborate</h2>
        <p>I'm committed to continuous learning—exploring new tools, tackling new challenges, and creating designs that make a difference. Are you looking for a creative, detail-oriented web developer? I'd love to help bring your vision to life. Check out my portfolio or get in touch today!</p>
        <div class="btnGroup">
          <NuxtLink class="btn" to="/projects" title="Take a look at my portfolio">See my Projects</NuxtLink>
          <NuxtLink class="btn" to="/contact" title="Connect with me by filling out the form on this page">Reach Out</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * Name: About Page
 * Description: Displays info about myself, my history, and my goals for the future.
 * Author: Jack Graddon
 */

useHead({
  title: 'About | Jack Graddon',
  meta: [
    { name: 'description', content: 'Crafting user-friendly web experiences with a creative edge.' }
  ]
})
</script>

<style module>
.container { text-align: justify; }

.flex { display: flex; justify-content: center; align-items: center; gap: 1rem; }

.row { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-direction: row; }
.col { display: flex; justify-content: center; align-items: center; gap: 1rem; flex-direction: column; }

.cover { display: grid; grid-template: 1fr / 1fr 2fr; }

@media (max-width: 768px) { .cover { display: flex; flex-direction: column-reverse; } }

.portrait { width: 100%; height: 100%; overflow: hidden; }
.portrait img { width: 100%; height: 100%; object-fit: cover; }

.skills { display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; }

@media (max-width: 768px) { .skills { flex-direction: column; } }

.skills > div {
  background-color: #f9f9f9;
  padding: 1rem 2rem;
  border-radius: 7pt;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
  color: black;
  text-align: left;
  flex: 0 1 calc(50% - 0.5rem);
}

.skills > div:nth-child(3n) { flex: 0 1 100%; }

.skills h3 { display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 5px; }
</style>
