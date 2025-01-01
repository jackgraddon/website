/**
 * Name: Splash
 * Description: This component serves as a hero for any page, providing a title and a description of the page, and contains the scroll animations baked in.
 * Author: Jack Graddon
 */

"use client"; // This marks the component as a client-side component
import Image from "next/image";
import { easeInOut } from "motion";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "@/components/splash/splash.module.sass";
import SplashCloud from "@/components/splash/splash-cloud.webp";

/**
 * Interface representing the properties for the Splash component.
 *
 * @interface SplashProps
 * @property {string} title - The main title to be displayed on the splash screen.
 * @property {string} subtitle - The subtitle to provide additional context or information on the splash screen.
 */
interface SplashProps {
  title: string;
  subtitle: string;
}

/**
 * Splash component that displays a splash screen with a title and subtitle.
 *
 * @param {SplashProps} props - The properties for the Splash component.
 * @param {string} props.title - The main title to be displayed on the splash screen.
 * @param {string} props.subtitle - The subtitle to provide additional context or information on the splash screen.
 *
 * @returns {JSX.Element} The rendered splash screen component.
 */
const Splash = ({ title, subtitle }: SplashProps) => {
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, 1], { ease: easeInOut });
  const opacity = useTransform(yRange, [0, 1], [1, 0], { ease: easeInOut });
  const filter = useTransform(yRange, [0, 1], ["blur(0px)", "blur(10px)"], { ease: easeInOut });
  const scale = useTransform(yRange, [0, 1], [1, 0.9], { ease: easeInOut });
  const y = useTransform(yRange, [0, 1], [-50, -100], { ease: easeInOut });

  const transform = useTransform(
    [y, scale],
    ([latestY, latestScale]) => `translate(-50%, ${latestY}%) scale(${latestScale})`
  )

  return (
    <div className={styles.splash}>
      <motion.div className={styles.splashTitle}
                  initial={{ opacity: 1, filter: "blur(0px)", transform: "translate(-50%, -50%) scale(1)" }}
                  style={{ opacity, filter, transform}}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </motion.div>
      <Image
        src={SplashCloud.src}
        width={1043}
        height={607}
        alt="A cloud, covering the width of the screen"
        className={styles.splashCloud}
        priority={true}
      />
    </div>
  );
};

export default Splash;