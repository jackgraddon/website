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
  // "0": { url: "jackgraddon/main/.projectDetails/details.json", title: "Profile Repository", description: "My GitHub profile repository."},
  "230801": { url: "lprc-wsu/main/.projectDetails/details.json", title: "WSU LPRC", description: "Redesigns for WSU's LPRC website"},
  "230201": { url: "crimsoncode2023/main/.projectDetails/details.json", title: "Launchpad", description: "Crimson Code 2023 Project"},
  "221001": { url: "dataprivacydeepdive/main/.projectDetails/details.json", title: "Data Privacy Deep Dive", description: "An argumentative exploration"},
  "220301": { url: "lyndentechtips/main/.projectDetails/details.json", title: "Lynden Tech Tips", description: "Support Videos for LHS"},
  "210815": { url: "fblaproject/main/.projectDetails/details.json", title: "FBLA Web Project", description: "A project for FBLA 2021/2022"},
  "210310": { url: "lyndenit/main/.projectDetails/details.json", title: "Lynden IT Support", description: "A Simple Support Website"},
}