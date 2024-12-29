import '@/styles/globals.sass';
import styles from '@/app/page.module.sass';
import Image from "next/image";
import ImageAbout from '../../public/images/Jack_Horizontal_Sit.webp'

import Splash from "@/components/splash/splash";
import ProjectDeck from "@/components/project-deck/deck";
import Link from "next/link";

const getTimeBasedText = () => {
  const hour = new Date().getHours();

  const time = {
    morning: 6,
    afternoon: 12,
    evening: 18,
    night: 22,
  };

  if (hour >= time.morning && hour < time.afternoon) {
    return {
      title: 'Good Morning!',
      subtitle: "It's going to be a great day.",
    };
  } else if (hour >= time.afternoon && hour < time.evening) {
    return {
      title: 'Good Afternoon!',
      subtitle: 'What a beautiful day it is.',
    };
  } else if (hour >= time.evening && hour < time.night) {
    return {
      title: 'Good Evening!',
      subtitle: "Don't miss the sunset tonight.",
    };
  } else {
    return {
      title: 'Good Night!',
      subtitle: 'Rest well and wake up refreshed.',
    };
  }
};

const { title, subtitle } = getTimeBasedText();

export default function HomePage() {
  return (
    <div>
      <Splash title={title} subtitle={subtitle} />
      <main>
        <section className={styles.warning}>
          <h2>Caution!</h2>
          <p>
            This website is under heavy development as I restructure it in Next.js, which
            I am learning as I go. If you have found this site, thank you for your
            patience!
          </p>
        </section>
        <section>
          <h1>Hello!</h1>
          <p>I&#39;m Jack, a freelance Web Developer and Graphic Designer.</p>
          <ProjectDeck></ProjectDeck>
        </section>
        <section className={styles.about}>
          <Image src={ImageAbout} alt={""} width={1920} height={1280} style={{ height: '100%'}}></Image>
          <div>
            <h2>About</h2>
            <p>
              I&#39;m a freelance Web Developer and Graphic Designer. I&#39;ve
              worked on projects and designs for my local school, growing influencers,
              companies, and competitions. I&#39;ve always desired to make technology
              more accessible by developing user interfaces that are simple to
              navigate and visually engaging.
            </p>
            <Link href="/about/" className="btn">Read More</Link>
          </div>
        </section>
      </main>
    </div>
  );
}