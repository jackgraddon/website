/**
 * Name: Projects Page
 * Description: A page listing all projects with a timeline and deck of cards.
 * Author: Jack Graddon
 */

import { projectDictionary } from "@/utils/project";
import ProjectDeck from "@/components/project-deck/deck";
import Splash from "@/components/splash/splash";
import Timeline from "@/components/timeline/timeline";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Projects | Jack Graddon",
  description: "Check out all of my latest projects, from web development to graphic design.",
};

export default function ProjectsPage() {
  const topProjects = ["221001", "230201", "230801"]

  // Convert projectDictionary to an array of IDs and sort them by ID (descending)
  const timelineProjects = Object.keys(projectDictionary)
    // .filter((id) => !topProjects.includes(id)) // Exclude top projects
    .sort((a, b) => parseInt(b) - parseInt(a)); // Sort by ID in descending order

  return (
    <div>
      <Splash title={"Projects"} subtitle={"My Portfolio"}></Splash>
      <main>
        <section>
          <h2>Top Projects</h2>
          <ProjectDeck firstId={topProjects[0]} secondId={topProjects[1]} thirdId={topProjects[2]}></ProjectDeck>
        </section>
        <section>
          <h2>All Projects</h2>
          <p>See all my latest projects, newest to oldest.</p>
          <Timeline projects={timelineProjects}></Timeline>
        </section>
      </main>
    </div>
  )
}