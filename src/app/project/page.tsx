// noinspection GrazieInspection

/**
 * Name: Project Page
 * Description: A page that displays the README of a project from GitHub. The project ID is passed as a query parameter.
 * Author: Jack Graddon
 */

"use client";

import "@/styles/globals.sass";
import Link from "next/link";
import ReactMarkdown, {ExtraProps} from "react-markdown";
import remarkGfm from 'remark-gfm';
import { useSearchParams } from "next/navigation";
import { projectDictionary } from "@/utils/project";
import { useEffect, useState, Suspense } from "react";

// Components
import Splash from "@/components/splash/splash";
import Image from "next/image";

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/";

/**
 * Removes the Table of Contents section from the given content.
 * @param {string} content - The content from which to remove the Table of Contents.
 * @returns {string} - The content without the Table of Contents section.
 */
function removeTableOfContents(content: string): string {
  const tocRegex = /## Table of Contents[\s\S]*?(?=##|$)/i;
  return content.replace(tocRegex, '');
}

export const dynamic = "force-dynamic"; // Dynamically render this page

/**
 * Component to fetch and display project content based on the project ID.
 * @param {Object} props - The component props.
 * @param {string} props.id - The project ID.
 * @returns {JSX.Element} - The rendered project content.
 */
function ProjectContent({ id }: { id: string }) {
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [repoUrl, setUrl] = useState<string | null>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);

  useEffect(() => {
    if (id && projectDictionary[id]) {
      const detailsUrl = `${BASE_URL}${projectDictionary[id].url}`;

      fetch(detailsUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch project details");
          }
          return response.json();
        })
        .then((projectDetails) => {
          setTitle(projectDetails.name);
          setDescription(projectDetails.description);
          setUrl(`https://github.com/jackgraddon/${projectDetails.url.replace('/main/README.md', '')}`);

          const readmeUrl = `${BASE_URL}${projectDetails.url}`;
          return fetch(readmeUrl);
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch README");
          }
          return response.text();
        })
        .then((readmeContent) => setReadmeContent(removeTableOfContents(readmeContent)))
        .catch((error) => {
          console.error(error);
          setReadmeContent("Failed to load project README.");
        });
    } else {
      setReadmeContent("Invalid project ID.");
    }
  }, [id]);

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
  );
}

/**
 * Main component for the project page.
 * Fetches the project ID from the URL and renders the project content.
 * @returns {JSX.Element} - The rendered project page.
 */
export default function ProjectPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <Suspense fallback={<Splash title={"Loading..."} subtitle={"Please hang tight!"}></Splash>}>
      {id ? <ProjectContent id={id} /> : <p>Invalid project ID.</p>}
    </Suspense>
  );
}