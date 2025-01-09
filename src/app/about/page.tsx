/**
 * Name: About Page
 * Description: Displays info about myself, my history, and my goals for the future.
 * Author: Jack Graddon
 */

// Components
import Splash from "@/components/splash/splash";

export default function AboutPage() {
  return (
    <div>
      <Splash title={'About'} subtitle={'Everything you need to know about me.'}></Splash>
      <main>
        <h1>About Me</h1>
        <section>
          <div>
            <h2>Summary</h2>
            <p>I am an 20 year old self-taught HTML web developer and student at Washington State University, and began
              studying Web Design and Development with a major in Digital Technology and Culture in August 2022.</p>
            <h2>Goals</h2>
            <p>Creating technology that is <b>Accessible to All</b>, <b>Enjoyable</b>, <b>Easy</b>, and <b>Intuitive to
              Use</b>, <b>Efficient</b>, and <b>Fast</b>, while remaining <b>Visually Pleasing to the eye</b>.</p>
            <h3>Resume</h3>
            <p>You can download my resume below.</p>
            <a className={'btn'} href={"https://raw.githubusercontent.com/jackgraddon/jackgraddon/main/Resume.pdf"}
               title={"Download my Resume"} rel={"noreferrer noopener"} target={"_blank"}>Download Now</a>
          </div>
        </section>
        <section>
          <div>
            <h2>Action Plan</h2>
            <p>I&#39;ve always desired to make technology more accessible by developing user interfaces that are simple
              to navigate and visually engaging. My studies at Washington State University in Web Design and Development
              and Computer Science will further my understanding of the concepts, methods, and best practices used in
              the industry. I approach challenges with an open mind and consistently challenge myself to learn new
              things, inside and outside the classroom environment. My studies will prepare me for a successful career
              in Web Design and Development. With that career, I plan to make using technology easier for people at all
              levels of access and comfort.</p>
          </div>
        </section>
        <section>
          <h2>A bit more In Depth</h2>
          <p>I am Jack Graddon, a freelance Web Developer and Graphic Designer. I grew up in Lynden, Washington, a
            farming community about five minutes south of the Canadian Border. I enjoy designing, and making my design
            myself gives me a huge sense of pride and accomplishment. I am studying Digital Technology and Culture at
            Washington State University as a Regent Scholar and Honors Student with the goal of creating technology that
            is intuitive, accessible, and enjoyable to use.</p>
          <h3>Getting Started</h3>
          <p>My interest in graphic design was started at my grandparents house, where my Grandpa let me have access to
            a computer with Microsoft Publisher. Publisher isn&#39;t exactly the staple of graphic design software, but
            it is what got me interested in design. This then led to various apps related to graphic design and digital
            art, such as Procreate and Affinity Designer, which I bought for my iPad Pro (2017) from money made mowing
            lawns.</p>
          <h3>Growing Up</h3>
          <p>As a child, I grew up with the need to take things apart. I did this to learn how the things I took apart
            worked, how they were made. And I often put them back together. Did they work after I put them back
            together? They worked every time, about 20% of the time. This did however lead me down a path of making
            things, and making them to look good - visually and aesthetically pleasing. I crave to learn more and more
            about ways I can make things. And I have learned how to make many different things. I&#39;ve taught myself
            how to code websites (with HTML, CSS, and JavaScript), how to use design software like Photoshop and
            Illustrator, and am even starting now on 3D modelling with Blender. I learn as I go, trying new stuff every
            project. With each new thing I try, I have to learn a new thing.</p>
          <h3>School</h3>
          <p>I took all of the design and coding classes I could possibly take at my High School. Those classes included
            Graphic Arts I and II, Broadcast I and II, Web Design, Javascript, and AP Computer Science. In Graphic Arts
            I and II, you have access to Photoshop, Adobe Illustrator, and InDesign to learn the basics of the programs.
            In Broadcast I and II you learn how to record and edit video for the school&#39;s Morning Announcements, and
            how to make graphics and effects for the videos you record. In Web Design, you learn the basics of HTML,
            where I took the top of my class fairly quickly. In JavaScript and AP Computer Science, you learn basic
            fundamental JavaScript to code arduino&#39;s and aid HTML. To continue my education, my studies at
            Washington State University in Web Design and Development and Computer Science will further my understanding
            of the concepts, methods, and best practices used in the industry.</p>
        </section>
      </main>
    </div>
  )
}