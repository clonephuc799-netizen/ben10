# Bedrock Bot

An automated AFK solution for Minecraft Bedrock Edition. This bot handles player persistence, messages log, auto-reconnects to servers, and keep your farms or processes running while you’re offline.

## Pre Installation

If you're using UserLand or fresh installed system, you need to run this first to install some dependencies.

```bash
sudo apt update; sudo apt upgrade -y; sudo apt install ca-certificates -y
```

## Quick Installation

### Method 1: Using Installer Script (Recommended)

The easiest way to install and configure the bot is using the provided installer script.

```bash
curl -fsSL https://raw.githubusercontent.com/cloudy-network/bedrock-bot/refs/heads/main/installer.sh | bash
```

### Method 2: Manual Installation

If you prefer to install manually:

```bash
# Clone the repository
git clone https://github.com/cloudy-network/bedrock-bot.git
cd bedrock-bot

# Install dependencies
npm install

# Create config.json from the example
cp config.json.example config.json

# Edit config.json with your settings
nano config.json
```

## Configuration

The bot uses a `config.json` file for configuration. Reference [`config.json.exaple`](config.json.example) for the structure:

```json
{
  "host": "127.0.0.1",
  "port": 19132,
  "gamertag": "fankyfankz",
  "reconnect": 10,
  "offline": false,
  "debug": false
}
```

| Option      | Description                             |
| ----------- | --------------------------------------- |
| `host`      | Server IP address                       |
| `port`      | Server port number                      |
| `gamertag`  | Bot's in-game username                  |
| `reconnect` | Max number of attempts to reconnect     |
| `offline`   | Enable offline mode (no authentication) |
| `debug`     | Enable debug logging                    |
| `version`   | Client versioning (optional)            |

## Running Bot

After installation:

```bash
# Run this command only after node and npm are installed
source ~/.bashrc

# Go to bot folder
cd ~/bedrock-bot

# Start bot
npm start
```
