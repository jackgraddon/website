import styles from './legal.module.sass';
import Splash from "@/components/splash/splash";
import Link from "next/link";
import Image from "next/image";

import ImageFont from './works/madesunflower.webp'
import ImageMotion from './works/motion.webp'

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
              <Link className={"btn"} href={"https://www.youworkforthem.com/font/T11080/made-sunflower"}>Made Sunflower</Link>
            </div>
            <div className={styles.worksCard}>
              <Image src={ImageMotion.src} width={1280} height={800} alt="Motion logo"/>
              <Link className={"btn"} href={"https://motion.dev/"}>Motion</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}