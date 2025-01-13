/**
 * Name: Project Page
 * Description: Display a project page with its title and content. Pulls data from GitHub from info looked up in project dictionary. Uses ID passed in URL.
 * Author: Jack Graddon
 */

"use client";

import "@/styles/globals.sass";
import Link from "next/link";
import ReactMarkdown, {ExtraProps} from "react-markdown";
import remarkGfm from 'remark-gfm'
import { useSearchParams } from "next/navigation";
import { projectDictionary } from "@/utils/project";
import { useEffect, useState, Suspense } from "react";

// Components
import Splash from "@/components/splash/splash";
import Image from "next/image";

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/";

function removeTableOfContents(content: string): string {
  const tocRegex = /## Table of Contents[\s\S]*?(?=##|$)/i;
  return content.replace(tocRegex, '');
}

export const dynamic = "force-dynamic"; // Dynamically render this page

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
        .then((readmeContent) => setReadmeContent(removeTableOfContents(readmeContent))) // Set the fetched README content to state
        .catch((error) => {
          console.error(error); // Log any errors to the console
          setReadmeContent("Failed to load project README."); // Update state with an error message
        });
    } else {
      // If 'id' is not valid or does not exist in 'projectDictionary', set an error message
      setReadmeContent("Invalid project ID.");
    }
  }, [id]); // Dependency array: effect runs when 'id' changes

  useEffect(() => {
    if (title) {
      document.title = `${title} | Jack Graddon`;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }
  }, [title, description]);

  const CustomImage = ({ alt, src, width, height, ...props }: { alt: string; src: string; width?: number | `${number}`; height?: number | `${number}` } & React.ImgHTMLAttributes<HTMLImageElement>) => (
      <Image alt={alt} src={src} width={width} height={height} style={{ maxWidth: '100%' }} {...props} />
  );

  const renderers = {
    image: CustomImage as unknown as React.ElementType<React.SVGProps<SVGImageElement> & ExtraProps>
  };

  return (
    <Suspense fallback={<Splash title={"Loading..."} subtitle={"Please hang tight!"}></Splash>}>
      <div>
        <Splash title={title ? title : "Loading..."} subtitle={description ? description : "Please hang tight!"}></Splash>
        <main style={{textAlign: 'center'}}>
          <section>
            {readmeContent ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={renderers}>
                  {readmeContent}
                </ReactMarkdown>
            ) : (
                <p>Loading...</p>
            )}
          </section>
          <section>
            {repoUrl ? (
                <Link href={repoUrl!} className={"btn"} target={'_blank'} rel={'noopener noreferrer'}>View Repository</Link>
            ) : (
                <p>No repository URL provided.</p>
            )}
          </section>
        </main>
      </div>
    </Suspense>
  );
}