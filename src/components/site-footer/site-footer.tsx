import Link from 'next/link';
import styles from '@/components/site-footer/site-footer.module.sass';

export default function Footer() {
    return (
      <div className={styles.footer}>
        <div className={styles.footerCauses}>
          <a id="data-rights" href="https://epic.org" title={"Learn about your Data Rights"} target="_blank">&#x1F512;</a>
          <a id="help-me" href="https://ko-fi.com/jackgraddon" title={"Buy me a Coffee"} target="_blank">&#x1FA99;</a>
        </div>
        <h3>Jack Graddon</h3>
        <p>Website © Jack Graddon 2024</p>
        <div>
          <ul className={styles.nav}>
            <li className={styles.navItem}>
              <Link href="/">Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/about/">About</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/projects/">Projects</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/contact/">Contact</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/legal/">Legal</Link>
            </li>
          </ul>
        </div>
      </div>
    );
};