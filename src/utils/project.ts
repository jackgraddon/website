/**
 * Name: Project Dictionary
 * Description: Exports a dictionary of project ids with their corresponding paths. This is used to get README files from GitHub repositories in its current state, and allows the project page to dynamically update its content. This dictionary should be updated manually when projects are added or removed.
 * Author: Jack Graddon
 */

interface Project {
  title: string,
  description: string,
  url: string
}

export const projectDictionary: { [id: string]: Project} = {
  "0": { url: "jackgraddon/main/.projectDetails/details.json", title: "Profile Repository", description: "My GitHub profile repository."},
}