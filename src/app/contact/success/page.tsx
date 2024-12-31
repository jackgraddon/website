/**
 * Name: Contact Success Page
 * Description: Displays when the contact form is submitted. This page redirects the user to the home page after 5 seconds.
 * Author: Jack Graddon
 */

"use client"; // Render on client
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function SuccessfulSubmitPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirect('/');
    }, 5000) // redirect after 5 seconds

    return () => clearTimeout(timer); // clear the timeout when the component unmounts
  })

  return (
    <div style={{margin: '35vh 0 0 0'}}>
      <main>
        <h1>Thank you!</h1>
        <p>I will get back to you soon.</p>
      </main>
    </div>
  )
}