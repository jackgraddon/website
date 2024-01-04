// Fills in the project deck on the home page with the projects defined below (ideally would like to reference some database instead, but this is what I have for now)

// Array of three projects to be displayed on the home page
var projects = [
    { 
        title: "FBLA Web Design 2022",
        description: "Future Business Leaders of America 2021/22 Competition - Website Design.",
        link: "./projects/web/fbla/2022/",
        color: {
            background: "#432534",
            text: "#C44900"
        }
    },
    {
        title: "Posts",
        description: "Instagram logo with the word 'posts' on its right.",
        link: "./projects/design/instagram/",
        color: {
            background: "#C837AB",
            text: "#3771C8"
        }
    },
    {
        title: "DTC",
        description: "WSU Logo with the letters DTC, which stands for Digital Technology and Culture.",
        link: "./projects/design/dtc/",
        color: {
            background: "#A60F2D",
            text: "#4D4D4D"
        }
    },
]


// Format of each project card
/* 
<div
    class="project-tile"
    style="background-image: url('path/to/background/image.jpg'); background-color: #backgroundColor;"
    aria-label="Project Description">
    <a onclick="openModal('project', 'projectID')" class="btn" style="color: #textColor;">Learn More</a>
</div> 
*/

// Function to fill in the project deck
function fillProjectDeck() {
    // Get the project deck element
    let projectDeck = document.querySelector("div.project-deck");

    // For each project in the array
    for (let i = 0; i < projects.length; i++) {
        // Create a new project tile
        let projectTile = document.createElement("div");
        projectTile.classList.add("project-tile");
        projectTile.style.backgroundImage = "url('" + projects[i].link + "preview.jpg')";
        projectTile.style.backgroundColor = projects[i].color.background;
        projectTile.setAttribute("aria-label", projects[i].description);

        // Create a new button
        let button = document.createElement("a");
        button.classList.add("btn");
        button.setAttribute("onclick", "openModal('project', '" + i + "')");
        button.style.color = projects[i].color.text;
        button.innerHTML = "Learn More";

        // Append the button to the project tile
        projectTile.appendChild(button);

        // Append the project tile to the project deck
        projectDeck.appendChild(projectTile);

        // Log the project tile
        console.log(projectTile);
    }
}

// Fill the project deck
fillProjectDeck();