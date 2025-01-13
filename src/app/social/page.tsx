/**
 * Name: Social
 * Description: Displays my social media information and feeds.
 * Author: Jack Graddon
 */

import styles from "@/app/social/social.module.sass";
import BeholdWidget from "@behold/react";


// Components
import Splash from "@/components/splash/splash";
import Link from "next/link";
import {InstagramIcon, Linkedin01Icon} from "hugeicons-react";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Social | Jack Graddon",
  description: "Take a look at my social media profiles and feeds.",
};

export default function SocialPage() {
  return (
    <div>
      <Splash title="Social" subtitle="Check out my social media"></Splash>
      <main>
        <section>
          <h1>Social</h1>
          <div className={styles.platforms}>
            <Link title={"Click to view Instagram"} href={'https://www.instagram.com/jack.graddon/'} target={'_blank'} rel={'noopener noreferrer'} style={{color: "#E1306C"}}><InstagramIcon/></Link>
            <Link title={"Click to view LinkedIn"} href={'https://www.linkedin.com/in/jackgraddon/'} target={'_blank'} rel={'noopener noreferrer'} style={{color: "#0A66C2"}}><Linkedin01Icon/></Link>
          </div>
        </section>
        <section>
          <BeholdWidget feedId="w10XMGLgPKgvIZv0KvkH" />
        </section>
      </main>
    </div>
  );
}