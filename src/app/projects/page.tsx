import ProjectDeck from "@/components/project-deck/deck";
import Splash from "@/components/splash/splash";
import { projectDictionary } from "@/utils/project";
import Timeline from "@/components/timeline/timeline";

export default function ProjectsPage() {
  const topProjects = ["220301", "230201", "210310"]

  // Convert projectDictionary to an array of IDs and sort them by ID (descending)
  const timelineProjects = Object.keys(projectDictionary)
    // .filter((id) => !topProjects.includes(id)) // Exclude top projects
    .sort((a, b) => parseInt(b) - parseInt(a)); // Sort by ID in descending order

  return (
    <div>
      <Splash title={"Projects"} subtitle={"My Portfolio"}></Splash>
      <main>
        <h2>Top Projects</h2>
        <ProjectDeck firstId={topProjects[0]} secondId={topProjects[1]} thirdId={topProjects[2]}></ProjectDeck>
        <h2>All Projects</h2>
        <p>See all my latest projects, newest to oldest.</p>
        <Timeline projects={timelineProjects}></Timeline>
      </main>
    </div>
  )
}