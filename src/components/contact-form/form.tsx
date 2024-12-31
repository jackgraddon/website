"use client";
import "@/styles/globals.sass";
import styles from "@/components/contact-form/form.module.sass";
import { useState, useEffect } from "react";
import { redirect} from "next/navigation";

export default function ContactForm() {
  const [state, setState] = useState({
    submitting: false,
    succeeded: false,
  });

  const [placeholders, setPlaceholders] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    // Define possible placeholder values
    const names = [
      "John Doe", "Prince Hamlet", "Phil Swift", "Abraham Lincoln",
      "Marilyn Monroe", "Winston Churchill", "Queen Elizabeth II",
      "Bill Gates", "Elvis Presley",
    ];
    const emails = [
      "johndoe@unkown.com", "p.hamlet@denmark.gov", "phil@flextape.com",
      "lincolna@whitehouse.gov", "marilyn@marilynmonroe.com",
      "churchill@gov.uk", "liz@gov.uk", "gatesb@microsoft.com",
      "presley@elvispresely.com",
    ];
    const subjects = [
      "I know who you are", "Ghost Sighting", "Flex Tape", "Speech Idea",
      "Important Info", "RE: Good Quotes?", "RE: Important - Read Now!",
      "I Love Windows 11", "It's ok, we all have rough times.",
    ];
    const messages = [
      "Hello! You may not know who I am, but...",
      "Hello! Have you seen my father? I've heard he...",
      "Hey! To show you the power of flex tape, I sawed this form in half...",
      "Hello. I have this speech idea: Four score and seven years ago our fathers...",
      "The sky is not the limit. Your mind is...",
      "You have enemies? Good. That means you've stood up for something, sometime in your life...",
      "Hey, let us not take ourselves too seriously. None of us has a monopoly on wisdom...",
      "Hey, if you can't make it good, at least make it look good...",
      "When things go wrong, don't go with them...",
    ];

    // Generate a random index
    const rand = Math.floor(Math.random() * names.length);

    // Set placeholders dynamically
    setPlaceholders({
      name: names[rand],
      email: emails[rand],
      subject: subjects[rand],
      message: messages[rand],
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ ...state, submitting: true });

    const formData = new FormData(event.target as HTMLFormElement);
    const data = new URLSearchParams();

    formData.forEach((value, key) => {
      data.append(key, value.toString());
    });

    try {
      await fetch("https://formspree.io/f/xjvljrlq", {
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        // redirect: "manual"  // Prevent automatic redirects by Formspree
      });

      // We won't be checking if the response was successful, because Formspree doesn't provide a straightforward way to check this.
    } catch (error) {
      // Handle network or other errors
      setState({ submitting: false, succeeded: false });

      // Log the error and prevent the alert from triggering
      console.error("Network or server error:", error);
    }

    redirect('/contact/success/');
  };

  if (state.succeeded) {
    return <p>Thanks for your message! We&#39;ll get back to you soon.</p>;
  }

  return (
    <form
      id="contact"
      onSubmit={handleSubmit}
      acceptCharset="utf-8"
      method="post"
      className={styles.form}
    >
      <div className={styles.formInputContainer}>
        <label className={styles.formLabel} htmlFor="name">
          Full Name <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          className={styles.formInput}
          placeholder={placeholders.name}
          required
        />
      </div>
      <div className={styles.formInputContainer}>
        <label className={styles.formLabel} htmlFor="email">
          Email Address <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          name="replyto"
          id="email"
          className={styles.formInput}
          placeholder={placeholders.email}
          required
        />
      </div>
      <div className={styles.formInputContainer}>
        <label className={styles.formLabel} htmlFor="subject">
          Subject <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="_subject"
          id="subject"
          className={styles.formInput}
          placeholder={placeholders.subject}
          required
        />
      </div>
      <div className={styles.formInputContainer}>
        <label className={styles.formLabel} htmlFor="message">
          Message <span className={styles.required}>*</span>
        </label>
        <textarea
          name="message"
          id="message"
          className={styles.formText}
          placeholder={placeholders.message}
          required
        ></textarea>
      </div>
      <button type="submit" className={styles.submit} disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}