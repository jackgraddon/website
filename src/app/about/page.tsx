/**
 * Name: About Page
 * Description: Displays info about myself, my history, and my goals for the future.
 * Author: Jack Graddon
 */

import styles from './about.module.sass';
import Image from "next/image";

import ImgVerticalLean from '/public/images/portraits/Jack_Vertical_Lean.webp';

import {InstagramIcon, Linkedin02Icon, SourceCodeSquareIcon, PaintBrush04Icon, Video01Icon} from 'hugeicons-react';

// Components
import Splash from "@/components/splash/splash";
import Link from "next/link";
import ProjectDeck from "@/components/project-deck/deck";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "About | Jack Graddon",
  description: "Crafting user-friendly web experiences with a creative edge.",
};

export default function AboutPage() {
  return (
    <div>
      <Splash title={'About'} subtitle={'Everything you need to know about me.'}></Splash>
      <main className={styles.container}>
        <section className={styles.cover}>
          <div className={styles.portrait}>
            <Image src={ImgVerticalLean.src} alt={"Jack leaning against a pillar, black and white."} width={1281}
                   height={1920} />
          </div>
          <div className={styles.col} style={{alignItems: 'start', textAlign: 'left'}}>
            <h2>Hello! &#x1F44B;</h2>
            <p>I&#39;m Jack Graddon, a freelance Web Developer and Graphic Designer with a passion for creating technology that is intuitive, accessible, and enjoyable. My studies in Digital Technology and Culture at Washington State University, as a Regent Scholar and Honors Student, empower me to approach challenges with creativity and determination.</p>
            <p>My goal? To make technology easier for everyone—whether they&#39;re tech-savvy or just getting started.</p>
            <div className={"btnGroup"}>
              <Link className={'btn'} href={"https://raw.githubusercontent.com/jackgraddon/jackgraddon/main/Resume.pdf"}
                    title={"Download my Resume"} rel={"noreferrer noopener"} target={"_blank"}>Download Resume</Link>
              <Link className={'btn'} href={"https://linkedin.com/in/jackgraddon"} title={"View my LinkedIn"} rel={"noreferrer noopener"} target={"_blank"}><Linkedin02Icon></Linkedin02Icon></Link>
              <Link className={'btn'} href={"https://instagram.com/jack.graddon"} title={"View my Instagram"} rel={"noreferrer noopener"} target={"_blank"}><InstagramIcon></InstagramIcon></Link>
            </div>
          </div>
        </section>
        <section>
          <h2>Experience</h2>
          <p>I&#39;ve worked on diverse web development projects, including modernizing websites for organizations like the Cowboy Ted Foundation and the Learning and Performance Research Center at WSU. These projects taught me how to create engaging user experiences while adhering to professional standards. Over the years, I’ve worked on many exciting projects. Some of my highlights are below!</p>
          <ProjectDeck firstId={'240101'} secondId={'230101'} thirdId={'240701'}></ProjectDeck>
        </section>
        <section>
          <h2>How It All Began</h2>
          <p>My journey started at my grandparents&#39; house, exploring design through Microsoft Publisher. That simple beginning sparked my love for technology and design. Over the years, I&#39;ve taught myself to code (HTML, CSS, JavaScript), mastered tools like Photoshop and Illustrator, and even ventured into 3D modeling with Blender.</p>
          <p>I&#39;ve always been a hands-on learner, taking things apart to figure out how they work (though at the time they only went back together successfully 20% of the time). This curiosity has fueled my love for creating things that are visually and functionally excellent.</p>
        </section>
        <section>
          <h2>Education &amp; Skills</h2>
          <p>From high school design and coding classes to advanced university courses, I&#39;ve built a solid foundation in:</p>
          <div className={styles.skills}>
            <div>
              <h3><SourceCodeSquareIcon></SourceCodeSquareIcon> Web Development</h3>
              <p>Skilled in HTML, CSS, and JavaScript, I create clean, responsive, and user-friendly websites tailored to client needs. My focus is on modern design principles, accessibility, and functionality, ensuring that each project not only looks great but performs flawlessly across devices and browsers.</p>
            </div>
            <div>
              <h3><PaintBrush04Icon></PaintBrush04Icon> Design Software</h3>
              <p>Proficient in Adobe Creative Suite, my preferred Affinity Suite, and Figma, I bring ideas to life with exceptional graphic design, prototyping, and branding capabilities. From crafting pixel-perfect user interfaces to creating stunning visual content, I specialize in delivering designs that captivate and inspire.</p>
            </div>
            <div>
              <h3><Video01Icon></Video01Icon> Media Production</h3>
              <p>Experienced in video editing and production using Final Cut Pro, DaVinci Resolve, and Motion, as well as audio production with Logic Pro. I produce engaging and professional-quality media content, ensuring every detail enhances the overall storytelling experience.</p>
            </div>
          </div>
        </section>
        <section>
          <h2>Let&#39;s Collaborate</h2>
          <p>I&#39;m committed to continuous learning—exploring new tools, tackling new challenges, and creating designs that make a difference. Are you looking for a creative, detail-oriented web developer? I’d love to help bring your vision to life. Check out my portfolio or get in touch today!</p>
          <div className={"btnGroup"}>
            <Link className={"btn"} href={'/projects'} title={"Take a look at my portfolio"}>See my Projects</Link>
            <Link className={"btn"} href={'/contact'} title={"Connect with me by filling out the form on this page"}>Reach Out</Link>
          </div>
        </section>
      </main>
    </div>
  )
}