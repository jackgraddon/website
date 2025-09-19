"""
Jellyfin client wrapper for the Discord music bot.
Handles authentication and music streaming functionality.
"""

import asyncio
import logging
from typing import Optional, List, Dict, Any
from jellyfin_apiclient_python import JellyfinClient


class JellyfinMusicClient:
    """Wrapper for Jellyfin API client with music-focused methods."""
    
    def __init__(self, server_url: str, username: str, password: str):
        self.server_url = server_url
        self.username = username
        self.password = password
        self.client = None
        self.user_id = None
        self.access_token = None
        self.logger = logging.getLogger(__name__)
        
    async def connect(self) -> bool:
        """
        Connect to the Jellyfin server and authenticate.
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            # Initialize the client
            self.client = JellyfinClient()
            self.client.config.app("Discord Music Bot", "1.0.0", "discord-bot", "unique-device-id")
            self.client.config.data["auth.ssl"] = self.server_url.startswith("https")
            
            # Connect to server
            connect_result = self.client.auth.connect_to_address(self.server_url)
            if not connect_result["State"] == "Available":
                self.logger.error(f"Server not available: {connect_result}")
                return False
            
            # Authenticate user
            auth_result = self.client.auth.login(self.server_url, self.username, self.password)
            if "User" not in auth_result:
                self.logger.error("Authentication failed")
                return False
                
            # Store authentication info
            self.user_id = auth_result["User"]["Id"]
            self.access_token = auth_result["AccessToken"]
            
            self.logger.info(f"Successfully connected to Jellyfin as {self.username}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to connect to Jellyfin: {e}")
            return False
    
    async def search_music(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for music items in the Jellyfin library.
        
        Args:
            query: Search query string
            limit: Maximum number of results to return
            
        Returns:
            List of music items with metadata
        """
        if not self.client:
            raise RuntimeError("Not connected to Jellyfin server")
            
        try:
            # Search for audio items
            search_results = self.client.jellyfin.search_media_items(
                search_term=query,
                media_type="Audio",
                limit=limit
            )
            
            items = []
            for item in search_results.get("Items", []):
                # Extract relevant metadata
                music_item = {
                    "id": item["Id"],
                    "name": item["Name"],
                    "artist": item.get("AlbumArtist") or item.get("Artist", "Unknown Artist"),
                    "album": item.get("Album", "Unknown Album"),
                    "duration": item.get("RunTimeTicks", 0),
                    "type": item.get("Type", "Audio")
                }
                items.append(music_item)
            
            return items
            
        except Exception as e:
            self.logger.error(f"Search failed: {e}")
            return []
    
    def get_stream_url(self, item_id: str) -> Optional[str]:
        """
        Get the streaming URL for a music item.
        
        Args:
            item_id: The Jellyfin item ID
            
        Returns:
            Direct streaming URL or None if failed
        """
        if not self.client:
            raise RuntimeError("Not connected to Jellyfin server")
            
        try:
            # Get the direct stream URL
            stream_url = self.client.jellyfin.download_url(
                item_id, 
                api_key=self.access_token
            )
            return stream_url
            
        except Exception as e:
            self.logger.error(f"Failed to get stream URL for {item_id}: {e}")
            return None
    
    def format_duration(self, ticks: int) -> str:
        """
        Convert Jellyfin RunTimeTicks to human-readable duration.
        
        Args:
            ticks: Duration in Jellyfin ticks (100ns intervals)
            
        Returns:
            Formatted duration string (MM:SS or HH:MM:SS)
        """
        if ticks == 0:
            return "Unknown"
            
        # Convert ticks to seconds
        seconds = ticks // 10_000_000
        
        minutes, seconds = divmod(seconds, 60)
        hours, minutes = divmod(minutes, 60)
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes}:{seconds:02d}"
    
    def disconnect(self):
        """Disconnect from the Jellyfin server."""
        if self.client:
            try:
                # Jellyfin client doesn't need explicit disconnect
                self.client = None
                self.user_id = None
                self.access_token = None
                self.logger.info("Disconnected from Jellyfin server")
            except Exception as e:
                self.logger.error(f"Error during disconnect: {e}")