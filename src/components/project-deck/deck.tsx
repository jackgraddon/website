/**
 * Name: Project Deck
 * Description: Displays three projects on cards with an image and a button to navigate to the project page with more details about it.
 * Author: Jack Graddon
 */

"use client";
import '@/styles/globals.sass'
import styles from '@/components/project-deck/deck.module.sass'
import Image from "next/image";
import Link from "next/link";
import { projectDictionary } from "@/utils/project";
import { useState, useEffect } from "react";

// Define base URL for the project images
const BASE_URL = 'https://raw.githubusercontent.com/jackgraddon/';

// Define project data
interface ProjectDeckProps {
  firstId: string,
  secondId: string,
  thirdId: string
}

interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  url: string;
  backgroundColor: string;
  buttonColor: string;
  status: string;
}

export default function ProjectDeck({ firstId, secondId, thirdId }: ProjectDeckProps) {
  const [projectData, setProjectData] = useState<ProjectDetails[]>([]);

  const fetchProjectDetails = async (id: string): Promise<ProjectDetails | null> => {
    const repo = projectDictionary[id];
    if (!repo) {
      console.error(`Project ID ${id} not found in dictionary.`);
      return null;
    }
    const url = `${BASE_URL}${repo.url}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch details for project ID ${id}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllProjects = async () => {
      const ids = [firstId, secondId, thirdId];
      const fetchedData = await Promise.all(ids.map(fetchProjectDetails));
      // Filter out null results and set the project data
      setProjectData(fetchedData.filter((data): data is ProjectDetails => data !== null));
    };

    fetchAllProjects();
  }, [firstId, secondId, thirdId]);

  return (
    <div className={styles.deck}>
      {projectData.map((project) => (
        <div
          key={project.id}
          className={styles.tile}
          style={{ backgroundColor: project.backgroundColor }}
        >
          <Image
            src={`https://raw.githubusercontent.com/jackgraddon/${project.url.replace('/README.md', '/.projectDetails/ogImage.jpg')}`}
            alt={project.name}
            width={400}
            height={300}
            style={{ objectFit: 'cover' }}
          />
          <Link
            className="btn"
            href={`/project?id=${project.id}`}
            style={{ color: project.buttonColor }}
          >
            {project.name}
          </Link>
        </div>
      ))}
    </div>
  );
}