#!/usr/bin/env python3
"""
Test script to validate the Discord bot configuration
without actually connecting to Discord or Jellyfin.
"""

import os
import sys
from dotenv import load_dotenv

def test_configuration():
    """Test that all required configuration is available."""
    print("🔧 Testing Discord Bot Configuration...")
    
    # Load environment variables
    load_dotenv()
    
    # Required environment variables
    required_vars = {
        "DISCORD_TOKEN": "Discord bot token",
        "JELLYFIN_URL": "Jellyfin server URL", 
        "JELLYFIN_USERNAME": "Jellyfin username",
        "JELLYFIN_PASSWORD": "Jellyfin password"
    }
    
    missing_vars = []
    
    print("\n📋 Checking environment variables...")
    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive values
            if "PASSWORD" in var or "TOKEN" in var:
                display_value = "*" * len(value) if len(value) <= 10 else f"{'*' * 8}...{value[-4:]}"
            else:
                display_value = value
            print(f"  ✅ {var}: {display_value}")
        else:
            print(f"  ❌ {var}: Not set ({description})")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_vars)}")
        print("Please create a .env file based on .env.example and fill in your values.")
        return False
    
    print("\n📦 Testing Python imports...")
    
    try:
        import nextcord
        print("  ✅ nextcord imported successfully")
        print(f"     Version: {nextcord.__version__}")
    except ImportError as e:
        print(f"  ❌ Failed to import nextcord: {e}")
        return False
    
    try:
        import jellyfin_apiclient_python
        print("  ✅ jellyfin-apiclient-python imported successfully")
    except ImportError as e:
        print(f"  ❌ Failed to import jellyfin-apiclient-python: {e}")
        return False
    
    try:
        import jellyfin_client
        print("  ✅ jellyfin_client module imported successfully")
    except ImportError as e:
        print(f"  ❌ Failed to import jellyfin_client: {e}")
        return False
    
    try:
        import bot
        print("  ✅ bot module imported successfully")
    except ImportError as e:
        print(f"  ❌ Failed to import bot module: {e}")
        return False
    
    print("\n🎵 Testing bot class instantiation...")
    try:
        # Test that we can create the bot class (without running it)
        music_bot = bot.MusicBot()
        print("  ✅ MusicBot class instantiated successfully")
        print(f"     Command prefix: {music_bot.command_prefix}")
        print(f"     Jellyfin URL: {music_bot.jellyfin_client.server_url}")
        print(f"     Username: {music_bot.jellyfin_client.username}")
    except Exception as e:
        print(f"  ❌ Failed to instantiate MusicBot: {e}")
        return False
    
    print("\n✅ All configuration tests passed!")
    print("\n🚀 Your bot is ready to run!")
    print("   To start the bot: python3 bot.py")
    print("   Or use the startup script: ./start.sh")
    
    return True

def main():
    """Main entry point."""
    if not os.path.exists(".env"):
        print("⚠️  .env file not found!")
        print("Please copy .env.example to .env and configure your settings:")
        print("  cp .env.example .env")
        print("  nano .env")
        return 1
    
    success = test_configuration()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())