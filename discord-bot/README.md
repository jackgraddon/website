# Jellyfin Discord Music Bot

A Discord bot that connects to your Jellyfin server to stream music directly in Discord voice channels.

## Features

- Connect to Jellyfin server with user credentials
- Stream music from your Jellyfin library to Discord voice channels
- Basic music controls (play, pause, skip, queue)
- Search for music in your Jellyfin library

## Setup

1. **Install Python dependencies:**
   ```bash
   cd discord-bot
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your configuration:
   - `DISCORD_TOKEN`: Your Discord bot token
   - `JELLYFIN_URL`: URL to your Jellyfin server
   - `JELLYFIN_USERNAME`: Your Jellyfin username
   - `JELLYFIN_PASSWORD`: Your Jellyfin password

3. **Run the bot:**
   ```bash
   python bot.py
   ```

## Commands

- `!play <song name>` - Search for and play a song
- `!pause` - Pause current playback
- `!resume` - Resume playback
- `!skip` - Skip current song
- `!queue` - Show current queue
- `!stop` - Stop playbook and disconnect

## Requirements

- Python 3.8+
- Jellyfin server
- Discord bot token