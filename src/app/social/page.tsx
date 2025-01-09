/**
 * Name: Social
 * Description: Displays my social media information and feeds.
 * Author: Jack Graddon
 */

import BeholdWidget from "@behold/react";

// Components
import Splash from "@/components/splash/splash";
import Link from "next/link";

export default function SocialPage() {
  return (
    <div>
      <Splash title="Social" subtitle="Check out my social media"></Splash>
      <main>
        <section>
          <h1>Social</h1>
          <p>I try to post my projects to Instagram when I can, though I do fall behind.</p>
          <p>View my LinkedIn <Link href={"https://www.linkedin.com/in/jackson-graddon-76753a202/"} target={"_blank"} rel={"noopener noreferrer"}>here</Link></p>
        </section>
        <section>
          <BeholdWidget feedId="w10XMGLgPKgvIZv0KvkH" />
          <Link className={"btn"} href={'https://www.instagram.com/jack.graddon/'} target={'_blank'} rel={'noopener noreferrer'}>See The Rest on Instagram</Link>
        </section>
      </main>
    </div>
  );
}