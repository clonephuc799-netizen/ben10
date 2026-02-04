import { createClient } from 'bedrock-protocol';
import { buildClientOptions } from '../handlers/connection.js';
import { isAuthError, showAuthTips } from '../handlers/error.js';

/**
 * Bot client factory module
 * Creates and configures the bot client
 */

/**
 * Creates a bot client with the given configuration
 * @param {Object} config - Configuration object
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @returns {Object} Bot client instance
 * @throws {Error} If client creation fails
 */
export function createBotClient(config, connectionManager) {
  const clientOptions = buildClientOptions(config, connectionManager);

  let client;
  try {
    client = createClient(clientOptions);
  } catch (err) {
    connectionManager.isConnecting = false;
    console.error('[error] Failed to create client:', err.message);

    if (isAuthError(err)) {
      showAuthTips();
      process.exit(1);
    }

    throw err;
  }

  return client;
}

/**
 * Logs connection information
 * @param {Object} config - Configuration object
 * @param {ConnectionManager} connectionManager - Connection manager instance
 */
export function logConnectionInfo(config, connectionManager) {
  if (connectionManager.isFirstAttempt) {
    console.log(`[info] Gamertag: ${config.gamertag}`);
  }
}
