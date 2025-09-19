"""
Discord Music Bot with Jellyfin Integration
Streams music from Jellyfin server to Discord voice channels.
"""

import os
import asyncio
import logging
from typing import Optional, List, Dict, Any
from collections import deque

import nextcord
from nextcord.ext import commands
from dotenv import load_dotenv

from jellyfin_client import JellyfinMusicClient


# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MusicQueue:
    """Simple music queue management."""
    
    def __init__(self):
        self.queue = deque()
        self.current_track = None
    
    def add(self, track: Dict[str, Any]):
        """Add a track to the queue."""
        self.queue.append(track)
    
    def next(self) -> Optional[Dict[str, Any]]:
        """Get the next track from the queue."""
        if self.queue:
            self.current_track = self.queue.popleft()
            return self.current_track
        return None
    
    def clear(self):
        """Clear the entire queue."""
        self.queue.clear()
        self.current_track = None
    
    def is_empty(self) -> bool:
        """Check if the queue is empty."""
        return len(self.queue) == 0
    
    def size(self) -> int:
        """Get the queue size."""
        return len(self.queue)


class MusicBot(commands.Bot):
    """Discord Music Bot with Jellyfin integration."""
    
    def __init__(self):
        # Bot configuration
        prefix = os.getenv("COMMAND_PREFIX", "!")
        intents = nextcord.Intents.default()
        intents.message_content = True
        intents.voice_states = True
        
        super().__init__(command_prefix=prefix, intents=intents)
        
        # Jellyfin client
        self.jellyfin_client = JellyfinMusicClient(
            server_url=os.getenv("JELLYFIN_URL"),
            username=os.getenv("JELLYFIN_USERNAME"),
            password=os.getenv("JELLYFIN_PASSWORD")
        )
        
        # Music state
        self.music_queue = MusicQueue()
        self.voice_client: Optional[nextcord.VoiceClient] = None
        self.is_playing = False
        self.is_paused = False
        
    async def on_ready(self):
        """Event called when bot is ready."""
        logger.info(f"{self.user} has connected to Discord!")
        
        # Connect to Jellyfin
        success = await self.jellyfin_client.connect()
        if not success:
            logger.error("Failed to connect to Jellyfin server!")
            await self.close()
            return
            
        logger.info("Successfully connected to Jellyfin server!")
    
    async def on_voice_state_update(self, member, before, after):
        """Handle voice state updates (e.g., when bot is disconnected)."""
        if member == self.user and after.channel is None:
            # Bot was disconnected from voice channel
            self.voice_client = None
            self.is_playing = False
            self.is_paused = False
            self.music_queue.clear()
    
    @commands.command(name="play")
    async def play_music(self, ctx, *, query: str):
        """Search for and play music from Jellyfin."""
        if not ctx.author.voice:
            await ctx.send("❌ You need to be in a voice channel to use this command!")
            return
        
        # Connect to voice channel if not already connected
        if not self.voice_client:
            try:
                self.voice_client = await ctx.author.voice.channel.connect()
                logger.info(f"Connected to voice channel: {ctx.author.voice.channel.name}")
            except Exception as e:
                await ctx.send(f"❌ Failed to connect to voice channel: {e}")
                return
        
        # Search for music
        await ctx.send(f"🔍 Searching for: **{query}**...")
        search_results = await self.jellyfin_client.search_music(query, limit=5)
        
        if not search_results:
            await ctx.send("❌ No music found for that query!")
            return
        
        # Use the first result
        track = search_results[0]
        stream_url = self.jellyfin_client.get_stream_url(track["id"])
        
        if not stream_url:
            await ctx.send("❌ Failed to get stream URL for the track!")
            return
        
        track["stream_url"] = stream_url
        
        # Add to queue or play immediately
        if self.is_playing:
            self.music_queue.add(track)
            duration = self.jellyfin_client.format_duration(track["duration"])
            await ctx.send(
                f"➕ Added to queue: **{track['name']}** by **{track['artist']}** ({duration})\n"
                f"Queue position: {self.music_queue.size()}"
            )
        else:
            await self._play_track(ctx, track)
    
    async def _play_track(self, ctx, track: Dict[str, Any]):
        """Play a specific track."""
        try:
            # Create audio source
            ffmpeg_options = {
                'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
                'options': '-vn'
            }
            
            audio_source = nextcord.FFmpegPCMAudio(track["stream_url"], **ffmpeg_options)
            
            # Play the track
            self.voice_client.play(
                audio_source,
                after=lambda e: asyncio.run_coroutine_threadsafe(
                    self._track_finished(ctx, e), self.loop
                )
            )
            
            self.is_playing = True
            self.is_paused = False
            self.music_queue.current_track = track
            
            duration = self.jellyfin_client.format_duration(track["duration"])
            embed = nextcord.Embed(
                title="🎵 Now Playing",
                description=f"**{track['name']}**\nby **{track['artist']}**\nfrom *{track['album']}*",
                color=0x00ff00
            )
            embed.add_field(name="Duration", value=duration, inline=True)
            embed.add_field(name="Queue", value=f"{self.music_queue.size()} tracks", inline=True)
            
            await ctx.send(embed=embed)
            
        except Exception as e:
            logger.error(f"Error playing track: {e}")
            await ctx.send(f"❌ Error playing track: {e}")
    
    async def _track_finished(self, ctx, error):
        """Handle track completion."""
        if error:
            logger.error(f"Audio playback error: {error}")
            await ctx.send(f"❌ Playback error: {error}")
        
        # Play next track in queue
        next_track = self.music_queue.next()
        if next_track:
            await self._play_track(ctx, next_track)
        else:
            self.is_playing = False
            self.is_paused = False
            await ctx.send("🎵 Queue finished!")
    
    @commands.command(name="pause")
    async def pause_music(self, ctx):
        """Pause current playback."""
        if not self.voice_client or not self.voice_client.is_playing():
            await ctx.send("❌ Nothing is currently playing!")
            return
        
        self.voice_client.pause()
        self.is_paused = True
        await ctx.send("⏸️ Playback paused!")
    
    @commands.command(name="resume")
    async def resume_music(self, ctx):
        """Resume paused playback."""
        if not self.voice_client or not self.is_paused:
            await ctx.send("❌ Nothing is paused!")
            return
        
        self.voice_client.resume()
        self.is_paused = False
        await ctx.send("▶️ Playback resumed!")
    
    @commands.command(name="skip")
    async def skip_track(self, ctx):
        """Skip the current track."""
        if not self.voice_client or not self.voice_client.is_playing():
            await ctx.send("❌ Nothing is currently playing!")
            return
        
        self.voice_client.stop()
        await ctx.send("⏭️ Skipped current track!")
    
    @commands.command(name="queue")
    async def show_queue(self, ctx):
        """Display the current music queue."""
        if self.music_queue.is_empty() and not self.music_queue.current_track:
            await ctx.send("📭 The queue is empty!")
            return
        
        embed = nextcord.Embed(title="🎵 Music Queue", color=0x0099ff)
        
        # Current track
        if self.music_queue.current_track:
            current = self.music_queue.current_track
            duration = self.jellyfin_client.format_duration(current["duration"])
            embed.add_field(
                name="🎵 Now Playing",
                value=f"**{current['name']}** by **{current['artist']}** ({duration})",
                inline=False
            )
        
        # Queue
        if not self.music_queue.is_empty():
            queue_text = ""
            for i, track in enumerate(list(self.music_queue.queue)[:10], 1):
                duration = self.jellyfin_client.format_duration(track["duration"])
                queue_text += f"{i}. **{track['name']}** by **{track['artist']}** ({duration})\n"
            
            if self.music_queue.size() > 10:
                queue_text += f"... and {self.music_queue.size() - 10} more tracks"
            
            embed.add_field(name="📋 Up Next", value=queue_text, inline=False)
        
        embed.add_field(name="📊 Total", value=f"{self.music_queue.size()} tracks in queue", inline=True)
        await ctx.send(embed=embed)
    
    @commands.command(name="stop")
    async def stop_music(self, ctx):
        """Stop playback and disconnect from voice channel."""
        if self.voice_client:
            if self.voice_client.is_playing():
                self.voice_client.stop()
            
            await self.voice_client.disconnect()
            self.voice_client = None
        
        self.music_queue.clear()
        self.is_playing = False
        self.is_paused = False
        
        await ctx.send("⏹️ Stopped playback and disconnected!")
    
    @commands.command(name="search")
    async def search_music(self, ctx, *, query: str):
        """Search for music in Jellyfin library."""
        await ctx.send(f"🔍 Searching for: **{query}**...")
        
        search_results = await self.jellyfin_client.search_music(query, limit=10)
        
        if not search_results:
            await ctx.send("❌ No music found for that query!")
            return
        
        embed = nextcord.Embed(title=f"🔍 Search Results for: {query}", color=0x0099ff)
        
        for i, track in enumerate(search_results[:5], 1):
            duration = self.jellyfin_client.format_duration(track["duration"])
            embed.add_field(
                name=f"{i}. {track['name']}",
                value=f"by **{track['artist']}** from *{track['album']}* ({duration})",
                inline=False
            )
        
        if len(search_results) > 5:
            embed.add_field(
                name="More Results",
                value=f"... and {len(search_results) - 5} more results. Use `!play <song name>` to play.",
                inline=False
            )
        
        await ctx.send(embed=embed)
    
    async def close(self):
        """Clean shutdown."""
        logger.info("Shutting down bot...")
        if self.voice_client:
            await self.voice_client.disconnect()
        self.jellyfin_client.disconnect()
        await super().close()


def main():
    """Main entry point."""
    # Check for required environment variables
    required_vars = ["DISCORD_TOKEN", "JELLYFIN_URL", "JELLYFIN_USERNAME", "JELLYFIN_PASSWORD"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please check your .env file and ensure all required variables are set.")
        return
    
    # Create and run the bot
    bot = MusicBot()
    
    try:
        bot.run(os.getenv("DISCORD_TOKEN"))
    except KeyboardInterrupt:
        logger.info("Bot shutdown requested by user")
    except Exception as e:
        logger.error(f"Bot crashed: {e}")
    finally:
        # Clean shutdown
        if not bot.is_closed():
            asyncio.run(bot.close())


if __name__ == "__main__":
    main()