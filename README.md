# Jack Graddon's Website

This repository contains the source code for Jack Graddon's portfolio website, built using Next.js. The website showcases my work as a freelance Web Developer and Graphic Designer.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
  - [Dynamic Greeting and Background](#dynamic-greeting-and-background)
  - [Custom Project Management](#custom-project-management)
    - [Project Details System](#project-details-system)
    - [Project Deck](#project-deck)
    - [Project Page](#project-page)
- [License](#license)
- [Discord Music Bot](#discord-music-bot)

## Project Overview

The website serves as a portfolio to display my projects, provide information about his services, and offer a way for visitors to contact him. It includes a dynamic greeting based on the time of day, a project deck, and a contact form.

## Technologies Used

- **TypeScript**
- **JavaScript**
- **React**
- **Next.js**
- **Sass**

## Features

### Dynamic Greeting and Background

Displays a greeting message based on the time of day and updates the background of the page accordingly. The greeting and background change dynamically based on the current hour of the client. The time of day is determined by the client's local time compared against a dictionary of times available in `timeWindow.ts`.

### Custom Project Management

I created a method to manage projects that allows me to easily add new projects to the website. By creating a dictionary of projects I want to display on the site in the `project.ts` file, I can easily add new projects to the site by adding a new object to the dictionary. The object contains a title, description, image, and link to the project.

#### Project Details System

Each project's GitHub repository contains a folder, `.projectDetails`, that contains `details.json` and `ogImage.jpg` files. The `details.json` file contains the project's id, name, description, README url, colors, and status.

My profile repository's details file looks like this:
```json
{
  "id": "0",
  "name": "Profile Repository",
  "description": "My GitHub profile repository.",
  "url": "jackgraddon/main/README.md",
  "backgroundColor": "rgb(174, 207, 219)",
  "buttonColor": "rgb(23, 94, 132)",
  "status": "Active"
}
```

#### Project Deck

A `ProjectDeck` component is used to display a showcase of three projects. The component is given three project ids, and pulls the corresponding projects from the `project.ts` file. The component displays the project's image, and creates a button to open the project page with the project's details.

#### Project Page

The `ProjectPage` component is used to display the details of a project. The component is given a project id from the parent page, `/project?id={pid}`, and pulls the corresponding project from the `project.ts` file. The dictionary contains an url to a GutHub repository. The component will fetch the README file from the repository and display it on the page, converted to HTML using the `react-markdown` library.file.

## Discord Music Bot

This repository also includes a Discord music bot that connects to a Jellyfin server to stream music directly in Discord voice channels.

### Features

- Connect to Jellyfin server with user credentials
- Stream music from your Jellyfin library to Discord voice channels
- Basic music controls (play, pause, skip, queue)
- Search for music in your Jellyfin library

### Quick Start

1. Navigate to the discord-bot directory:
   ```bash
   cd discord-bot
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Discord token and Jellyfin server details
   ```

4. Test your configuration:
   ```bash
   python3 test_config.py
   ```

5. Start the bot:
   ```bash
   python3 bot.py
   # Or use the startup script: ./start.sh
   ```

### Commands

- `!play <song name>` - Search for and play a song
- `!pause` - Pause current playbook
- `!resume` - Resume playback
- `!skip` - Skip current song
- `!queue` - Show current queue
- `!stop` - Stop playback and disconnect
- `!search <query>` - Search for music in Jellyfin library

For detailed setup instructions, see [discord-bot/README.md](discord-bot/README.md).

## License

This project is Copyright (c) Jack Graddon 2024-2025. All Rights Reserved.

If you have suggestions or improvements I can make to this project, please let me know! But because this is my portfolio website, I will be the only one making those changes.