import Link from 'next/link'
import ProjectDeck from "@/components/project-deck/deck";
import Splash from "@/components/splash/splash";
import { projectDictionary } from "@/utils/project";

export default function ProjectsPage() {
  const topProjects = ["0", "210310", "230201"]

  // Convert projectDictionary to an array of projects and sort them by ID (descending)
  const timelineProjects = Object.keys(projectDictionary)
    .filter((id) => !topProjects.includes(id)) // Exclude top projects
    .sort((a, b) => parseInt(b) - parseInt(a)) // Sort by ID in descending order
    .map((id) => ({
      id,
      title: `Project ${id}`, // Default title, replace if you have a better mapping
    }));

  return (
    <div>
      <Splash title={"Projects"} subtitle={"My Portfolio"}></Splash>
      <main>
        <h2>Top Projects</h2>
        <ProjectDeck firstId={topProjects[0]} secondId={topProjects[1]} thirdId={topProjects[2]}></ProjectDeck>
        <h2>All Projects</h2>
        <ul>
          {timelineProjects.map((project) => (
            <li key={project.id}>
              <Link href={`/project?id=${project.id}`}>{project.title}</Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}