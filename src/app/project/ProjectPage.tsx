"use client";
import "@/styles/globals.sass";
import { useSearchParams } from "next/navigation";
import { projectDictionary } from "@/utils/project";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Splash from "@/components/splash/splash";
import Link from "next/link";

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/";

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [repoUrl, setUrl] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);

  useEffect(() => {
    // Check if 'id' is defined and if it exists in the 'projectDictionary'
    if (id && projectDictionary[id]) {
      // Construct the full URL to the 'details.json' file
      const detailsUrl = `${BASE_URL}${projectDictionary[id].url}`;

      // Fetch the details.json file associated with the project ID
      fetch(detailsUrl)
        .then((response) => {
          // Check if the response is not OK (status code outside the range 200-299)
          if (!response.ok) {
            throw new Error("Failed to fetch project details");
          }
          return response.json(); // Parse the response body as JSON
        })
        .then((projectDetails) => {
          // Update the state with data from 'details.json'
          setTitle(projectDetails.name);
          setDescription(projectDetails.description);
          setUrl(`https://github.com/jackgraddon/${projectDetails.url.replace('/main/README.md', '')}`);

          // Fetch the README file from the URL specified in 'details.json'
          const readmeUrl = `${BASE_URL}${projectDetails.url}`;
          return fetch(readmeUrl);
        })
        .then((response) => {
          // Check if the response is not OK
          if (!response.ok) {
            throw new Error("Failed to fetch README");
          }
          return response.text(); // Parse the response body as text
        })
        .then((readmeContent) => setReadmeContent(readmeContent)) // Set the fetched README content to state
        .catch((error) => {
          console.error(error); // Log any errors to the console
          setReadmeContent("Failed to load project README."); // Update state with an error message
        });
    } else {
      // If 'id' is not valid or does not exist in 'projectDictionary', set an error message
      setReadmeContent("Invalid project ID.");
    }
  }, [id]); // Dependency array: effect runs when 'id' changes


  return (
    <div>
      <Splash title={title!} subtitle={description!}></Splash>
      <main style={{textAlign: 'center'}}>
        <h1>Project Details</h1>
        {repoUrl ? (
          <Link href={repoUrl!} className={"btn"}>View Repository</Link>
        ) : (
          <p>No repository URL provided.</p>
        )}
        {readmeContent ? (
          <ReactMarkdown>{readmeContent}</ReactMarkdown>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}