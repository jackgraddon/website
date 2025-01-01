/**
 * Name: Index
 * Description: The application's index page, displays Splash and Project Deck components, as well as links to contact.
 * Author: Jack Graddon
 */

import styles from '@/app/page.module.sass';
import Image from "next/image";
import { timeWindows } from "@/utils/timeWindows";

// Images
import ImageAbout from '../../public/images/portraits/Jack_Horizontal_Sit.webp'

// Components
import Splash from "@/components/splash/splash";
import ProjectDeck from "@/components/project-deck/deck";
import Link from "next/link";

/**
 * Retrieves a greeting message based on the current time of day.
 * The function determines the current hour and returns an object
 * containing a title and subtitle appropriate for morning, afternoon,
 * evening, or night.
 *
 * @returns {Object} An object containing:
 * @property {string} title - A greeting message based on the time of day.
 * @property {string} subtitle - A supportive message related to the greeting.
 */
const getTimeBasedText = () => {
  const hour = new Date().getHours();

  if (hour >= timeWindows.morning && hour < timeWindows.afternoon) {
    return {
      title: 'Good Morning!',
      subtitle: "It's going to be a great day.",
    };
  } else if (hour >= timeWindows.afternoon && hour < timeWindows.evening) {
    return {
      title: 'Good Afternoon!',
      subtitle: 'What a beautiful day it is.',
    };
  } else if (hour >= timeWindows.evening && hour < timeWindows.night) {
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
            This website is under heavy development as I restructure it in Next.js, which I am learning as I go. If you have found this site, thank you for your patience!
          </p>
        </section>
        <section>
          <h1>Hello!</h1>
          <p>I&#39;m Jack, a freelance Web Developer and Graphic Designer.</p>
          <ProjectDeck firstId={"220301"} secondId={"230201"} thirdId={"210310"}></ProjectDeck>
          <Link href={'/projects'} className={"btn"}>View All Projects</Link>
        </section>
        <section className={styles.about}>
          <Image src={ImageAbout} alt={""} width={1920} height={1280} style={{ height: '100%'}}></Image>
          <div>
            <h2>About</h2>
            <p>
              I&#39;m a freelance Web Developer and Graphic Designer. I&#39;ve worked on projects and designs for my local school, growing influencers, companies, and competitions. I&#39;ve always desired to make technology more accessible by developing user interfaces that are simple to navigate and visually engaging.
            </p>
            <Link href="/about/" className="btn">Read More</Link>
          </div>
        </section>
        <section>
          <h2>Contact</h2>
          <p style={{textAlign: 'center'}}>Have any questions, comments, or just want to reach out? Feel free to contact me by email or by using the form below.</p>
          <Link href={'/contact'} className={"btn"}>Open Form</Link>
        </section>
      </main>
    </div>
  );
}