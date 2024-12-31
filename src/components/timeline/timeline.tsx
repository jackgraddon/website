"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./timeline.module.sass";
import {projectDictionary} from "@/utils/project";
import Image from "next/image";

const BASE_URL = "https://raw.githubusercontent.com/jackgraddon/";

interface TimelineProps {
  projects: string[]; // Pass in your timelineProjects
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

export default function Timeline({ projects }: TimelineProps) {
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
      const fetchedData = await Promise.all(projects.map(fetchProjectDetails));
      setProjectData(fetchedData.filter((data): data is ProjectDetails => data !== null)); // Filter out nulls
    };

    fetchAllProjects();
  }, [projects]);

  return (
    <div className={styles.timeline}>
      {projectData.map((project) => (
        <div key={project.id} className={styles["timeline-item"]}>
          <div
            className={styles["timeline-icon"]}
            style={{color: project.buttonColor}}
          >
            {`${project.id.slice(2, 4)}/${project.id.slice(0, 2)}`} {/* Convert to MM/YY format */}
          </div>
          <div
            key={project.id}
            className={styles.tile}
            style={{backgroundColor: project.backgroundColor}}
          >
            <Image
              src={`https://raw.githubusercontent.com/jackgraddon/${project.url.replace('/README.md', '/.projectDetails/ogImage.jpg')}`}
              alt={project.name}
              width={400}
              height={300}
              style={{objectFit: 'cover'}}
            />
            <Link
              className="btn"
              href={`/project?id=${project.id}`}
              style={{color: project.buttonColor}}
            >
              {project.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}