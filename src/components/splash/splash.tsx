/**
 * Name: Splash
 * Description: This component serves as a hero for any page, providing a title and a description of the page, and contains the scroll animations baked in.
 * Author: Jack Graddon
 * Date: 12/24/2024
 */

"use client"; // This marks the component as a client-side component
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import styles from "@/components/splash/splash.module.sass";
import SplashCloud from "@/components/splash/splash-cloud.png";
import {useRef} from "react";

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
  // Track the scroll progress
  const containerRef = useRef(null);
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    // container: containerRef,
    // target: targetRef,
    offset: ['start start', 'center start'],

  });

  // useMotionValueEvent(scrollYProgress, "change", (latest) => {
  //   console.log("Page scroll: ", latest)
  // })

  // Use transforms with scrollYProgress ranging from 0 to 1
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(10px)']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -500]);


  return (
  <div className={styles.splash} ref={containerRef} style={{ border: '2px solid red' }}>
    <motion.div
      className={styles.splashTitle}
      initial={{transform: 'translate(-50%, -50%) scale(1)'}}
      style={{opacity, filter: blur, scale, y}}
    >
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </motion.div>

    <Image src={SplashCloud.src} width={1043} height={607} alt="A cloud, covering the width of the screen"
           className={styles.splashCloud} ref={targetRef}/>
  </div>
  )
}

export default Splash;