// import "@/styles/globals.sass"
import Splash from "@/components/splash/splash";
import ContactForm from "@/components/contact-form/form";

export default function Page() {
  return (
    <div>
      <Splash title={"Contact"} subtitle={"How to reach out."}></Splash>
      <main style={{ width: "100%" }}>
        <h1>Contact</h1>
        <p>If you need to contact me, you can fill out the form below!</p>
        <ContactForm></ContactForm>
        <p>Want to reach me the old fashioned way? Open your mail application by clicking <a
          href="mailto:hello@jackgraddon.com?subject=What%20do%20you%20want%20to%20talk%20about?">here
          <i className="bi bi-box-arrow-up-right"></i></a> and send me an email!
        </p>
      </main>
    </div>
  );
}