// import Image from "next/image";
import styles from '@/app/page.module.sass';
import Image from "next/image";
import SplashCloud from "@/app/splash-cloud.png";

const getTimeBasedText = () => {
  const hour = new Date().getHours();

  const time = {
    morning: 5,
    afternoon: 9,
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
    <div className={styles.content}>
      <div className={styles.splash}>
        <div
          className={styles.splashTitle}
          // style={{
          //   opacity: useTransform(scrollYProgress, [0, 500], [1, 0]),
          //   filter: useTransform(scrollYProgress, [0, 500], ['blur(0px)', 'blur(10px)']),
          //   scale: useTransform(scrollYProgress, [0, 500], [1, 0.9]),
          //   y: useTransform(scrollYProgress, [0, 500], [0, -100]),
          // }}
        >
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <Image src={SplashCloud.src} width={1043} height={607} alt="A cloud, covering the width of the screen" className={styles.splashCloud}/>
      </div>
      <main>
        <section>
          <h2>Caution!</h2>
          <p>
            This website is under heavy development as I restructure it in Next.js, which
            I am learning as I go. If you have found this site, thank you for your
            patience!
          </p>
        </section>
        <section>
          <h2>Hello!</h2>
          <p>I&#39;m Jack, a freelance Web Developer and Graphic Designer.</p>
        </section>
        <section>
          <div>
          </div>
          <div>
            <h2>About</h2>
            <p>
              I&#39;m a freelance Web Developer and Graphic Designer. I&#39;ve
              worked on projects and designs for my local school, growing influencers,
              companies, and competitions. I&#39;ve always desired to make technology
              more accessible by developing user interfaces that are simple to
              navigate and visually engaging.
            </p>
            <a href="/about/" className="btn">
              Read More
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}