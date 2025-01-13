/**
 * Name: Legals Page
 * Description: Displays my copyright information, as well as credits to other work I used to create this portfolio.
 * Author: Jack Graddon
 */

import styles from './legal.module.sass';
import Link from "next/link";
import Image from "next/image";

// Images
import ImageFont from './works/madesunflower.webp'
import ImageMotion from './works/motion.webp'

// Components
import Splash from "@/components/splash/splash";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Legals | Jack Graddon",
  description: "All of the legal information for Jack Graddon's portfolio website.",
};

export default function Page() {
  return (
    <div>
      <Splash title={"Legals"} subtitle={"All of the information."}></Splash>
      <main style={{ width: "100%" }}>
        <section>
          <h1>Copyright</h1>
          <p>This website was designed and developed by Jack Graddon. All rights reserved 2024.</p>
          <p>Contact me for any inquiries or feedback.</p>
          <Link href={"/contact"} className={"btn"}>Contact Me</Link>
        </section>
        <section>
          <h3>Other Work Used</h3>
          <p>Other work, code, fonts, or images I used are credited below.</p>
          <div className={styles.worksDeck}>
            <div className={styles.worksCard}>
              <Image src={ImageFont.src} width={1280} height={800} alt="MADE Sunflower banner"/>
              <Link className={"btn"} href={"https://www.youworkforthem.com/font/T11080/made-sunflower"} target={'_blank'} rel={'noopener noreferrer'}>Made Sunflower</Link>
            </div>
            <div className={styles.worksCard}>
              <Image src={ImageMotion.src} width={1280} height={800} alt="Motion logo"/>
              <Link className={"btn"} href={"https://motion.dev/"} target={'_blank'} rel={'noopener noreferrer'}>Motion</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}