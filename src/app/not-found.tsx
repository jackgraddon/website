import Link from "next/link";
import ProjectDeck from "@/components/project-deck/deck";


export default function NotFound() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Whoops!</h1>
      <p>It looks like you&#39;re trying to access a page that doesn&#39;t exist.</p>
      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid yellow', padding: '1rem', borderRadius: '7pt', display: 'flex', flexDirection: 'column', gap: '0.5em'}}>
        <h2>Recent Changes</h2>
        <p>I recently updated my website, and rewrote it from scratch. It is likely you navigated to a URL that did work before this, but no longer does. If that happens to be you, please look below for common pages. If you can&#39;t find that page, please reach out to me. You can <Link href={'/contact'}>contact me here</Link>.</p>
        <ProjectDeck firstId={'221001'} secondId={'230201'} thirdId={'210310'}></ProjectDeck>
      </div>
    </main>
  );
}