/**
 * Name: Contact Page
 * Description: Displays a form for viewers to submit their inquiries. Redirects to the success page when submitted.
 * Author: Jack Graddon
 */

// Components
import Splash from "@/components/splash/splash";
import ContactForm from "@/components/contact-form/form";
import Link from "next/link";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Contact | Jack Graddon",
  description: "Let's talk! Get in touch with Jack Graddon.",
};

export default function Page() {
  return (
    <div>
      <Splash title={"Contact"} subtitle={"How to reach out."}></Splash>
      <main style={{ width: "100%" }}>
        <section>
          <h1>Contact</h1>
          <p>If you need to contact me, you can fill out the form below!</p>
        </section>
        <section>
          <ContactForm></ContactForm>
          <p>Want to reach me the old fashioned way? Open your mail application by clicking <Link href={"mailto:hello@jackgraddon.com?subject=What%20do%20you%20want%20to%20talk%20about?"} target={'_blank'} rel={'noopener noreferrer'}>here</Link> and send me an email!
          </p>
        </section>
      </main>
    </div>
  );
}