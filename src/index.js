/**
 * Minecraft Bot for Minecraft Bedrock Edition servers
 */

import { loadConfig } from './config/loader.js';
import { setupConsoleFilters } from './utils/logger.js';
import { checkForUpdates } from './utils/updater.js';
import { pingServer } from './utils/server.js';
import { ConnectionManager, handleRetry } from './handlers/connection.js';
import { createBotClient, logConnectionInfo } from './bot/client.js';
import { registerEventHandlers, registerShutdownHandlers } from './handlers/events.js';
import { isAuthError } from './handlers/error.js';

/**
 * Main startup function
 */
async function startBot() {
  setupConsoleFilters();

  // Check for updates on startup
  await checkForUpdates();

  const config = loadConfig();
  const connectionManager = new ConnectionManager(config);
  let currentClient = null;

  // Register shutdown handlers once at startup
  registerShutdownHandlers(connectionManager, () => currentClient);

  /**
   * Connects the bot to the server
   */
  async function connectBot() {
    if (connectionManager.isConnecting) return;
    connectionManager.isConnecting = true;

    // Ping server for information on first attempt
    if (connectionManager.isFirstAttempt) {
      await pingServer(config);
    }

    let client;
    try {
      client = createBotClient(config, connectionManager);
    } catch (err) {
      if (!isAuthError(err)) {
        handleRetry(connectBot, connectionManager, err);
      }
      return;
    }

    currentClient = client;
    logConnectionInfo(config, connectionManager);
    registerEventHandlers(client, connectionManager, connectBot, config.gamertag, config.debug);
  }

  connectBot();
}

startBot();
