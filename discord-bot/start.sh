#!/bin/bash

# Jellyfin Discord Music Bot Startup Script

echo "🎵 Starting Jellyfin Discord Music Bot..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and configure your settings:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Check if Python dependencies are installed
python3 -c "import nextcord, jellyfin_apiclient_python" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ Python dependencies not found!"
    echo "Installing dependencies..."
    python3 -m pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        exit 1
    fi
fi

echo "✅ Dependencies verified"
echo "🚀 Starting bot..."

# Run the bot
python3 bot.py