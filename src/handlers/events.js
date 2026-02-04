import { scheduleReconnect, handleRetry } from './connection.js';
import { isAuthError, isNetworkError, showAuthTips } from './error.js';
import { TRANSLATION_MESSAGES, DEATH_ATTACK_MESSAGES, DEATH_FELL_MESSAGES, ENTITY_NAMES, DISCONNECT_MESSAGES } from '../config/constants.js';

/**
 * Event handlers module
 * Registers event handlers for the bot client
 */

/**
 * Translate an entity parameter key to human-readable name
 * @param {string} key - The entity parameter key (e.g., "%entity.skeleton.name")
 * @returns {string} Translated entity name
 */
function translateEntityName(key) {
  // Check if the key is an entity translation key (e.g., "%entity.creeper.name")
  if (key.startsWith('%entity.') && key.endsWith('.name')) {
    // Remove the leading '%' to match ENTITY_NAMES format
    const entityKey = key.substring(1); // Remove leading '%'
    return (
      ENTITY_NAMES[entityKey] ||
      key
        .substring(8, key.length - 5) // Remove '%entity.' and '.name'
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }
  // If it's not an entity translation key, return as-is (could be a player name)
  return key;
}

/**
 * Handles the 'join' event
 * @param {Object} client - Bot client instance
 * @param {ConnectionManager} connectionManager - Connection manager instance
 */
export function handleJoin(client, connectionManager) {
  console.log('[info] Successfully joined the server!');
  connectionManager.resetRetry();
  connectionManager.isConnecting = false;
  connectionManager.isAuthenticating = false;
  connectionManager.isReconnecting = false;
}

/**
 * Handles the 'text' event (chat messages)
 * @param {Object} packet - Text packet
 * @param {Object} client - Bot client instance
 * @param {string} gamertag - Bot's gamertag
 * @param {boolean} debug - Debug mode flag
 */
export function handleText(packet, client, gamertag, debug = false) {
  if (debug) console.log(JSON.stringify(packet, null, 2));

  if (packet.source_name === gamertag || packet.type === 'json') return;

  // Handle translation messages (with or without parameters)
  if (packet.needs_translation) {
    // Filter out formatting codes like §e%, §r, etc. from the translation key
    const translationKey = packet.message
      .replace(/^§[0-9a-fk-or]%/g, '') // Remove color codes like §e%, §c%, etc.
      .replace(/§[0-9a-fk-or]$/g, ''); // Remove color codes at end like §r

    const template = TRANSLATION_MESSAGES[translationKey];
    if (template) {
      let formattedMessage = template;
      // Replace %s placeholders with parameters
      if (packet.parameters?.length > 0) {
        packet.parameters.forEach((param, index) => {
          formattedMessage = formattedMessage.replace('%s', param);
        });
      }
      console.log(`[info] ${formattedMessage}`);
      return;
    }

    // Handle death messages
    if (translationKey.startsWith('death.attack.') || translationKey.startsWith('death.fell.')) {
      const playerName = packet.parameters?.[0] || 'Unknown';
      const template = DEATH_ATTACK_MESSAGES[translationKey] || DEATH_FELL_MESSAGES[translationKey];

      if (template) {
        let formattedMessage = template;

        // Replace %1$s with player/entity name (translate if it's an entity key)
        const victimName = translateEntityName(playerName);
        formattedMessage = formattedMessage.replace('%1$s', victimName);

        // Replace %2$s with killer/entity name (translate if it's an entity key)
        if (packet.parameters?.[1]) {
          const entityName = translateEntityName(packet.parameters[1]);
          formattedMessage = formattedMessage.replace('%2$s', entityName);
        }

        // Replace %3$s with item name (translate if it's an entity key)
        if (packet.parameters?.[2]) {
          let itemName = translateEntityName(packet.parameters[2]);
          // Strip Minecraft formatting codes from item name
          itemName = itemName.replace(/§[0-9a-fk-or]/g, '');
          formattedMessage = formattedMessage.replace('%3$s', itemName);
        }

        console.log(`[death] ${formattedMessage}`);
      } else {
        // Fallback if template not found
        console.log(`[death] ${playerName} died (${translationKey})`);
      }
      return;
    }

    console.log(`[translation] Unknown: ${translationKey}`);
    return;
  }

  const message = packet.message;
  const sender = packet.source_name || 'Unknown';
  const type = packet.type;

  console.log(`[${type}] ${sender}: ${message}`);
}

/**
 * Handles the 'error' event
 * @param {Error} err - Error object
 * @param {Object} client - Bot client instance
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {Function} connectFn - Function to call for reconnection
 */
export function handleError(err, client, connectionManager, connectFn) {
  // Suppress transient network errors during authentication
  if (connectionManager.isAuthenticating && isNetworkError(err)) {
    console.log('[auth] Retrying authentication due to network issue...');
    return;
  }

  if (connectionManager.isAuthenticating && isAuthError(err)) {
    console.error('[info] Waiting for authentication to complete...');
    console.error('[info] If authentication is taking too long, press Ctrl+C and try again.');
    return;
  }

  if (isAuthError(err)) {
    showAuthTips();
    connectionManager.isConnecting = false;
    process.exit(1);
  }

  handleRetry(connectFn, connectionManager, err);
}

/**
 * Handles the 'close' event
 * @param {ConnectionManager} connectionManager - Connection manager instance
 */
export function handleClose(connectionManager, connectFn) {
  console.log('[info] Disconnected from server.');
  connectionManager.isConnecting = false;
  scheduleReconnect(connectFn, connectionManager);
}

/**
 * Translates a disconnect message key
 * @param {string} message - The disconnect message (e.g., "%disconnect.kicked")
 * @param {Array<string>} [parameters] - Optional parameters for the message
 * @returns {string} Translated disconnect message
 */
function translateDisconnectMessage(message, parameters = []) {
  // Check if the message is a disconnect translation key (e.g., "%disconnect.kicked")
  if (message.startsWith('%disconnect.')) {
    // Handle case where reason is appended directly to message: "%disconnect.kicked.reason trash talk"
    const parts = message.split(' ');
    const key = parts[0].substring(1); // Remove leading '%'
    const extraReason = parts.slice(1).join(' '); // Get any text after the key

    const template = DISCONNECT_MESSAGES[key];

    if (template) {
      let formattedMessage = template;
      // Replace %s placeholders with parameters
      parameters.forEach((param) => {
        formattedMessage = formattedMessage.replace('%s', param);
      });
      // Append extra reason if present
      if (extraReason) formattedMessage += ' ' + extraReason;

      return formattedMessage;
    }
  }

  // If not a translation key or no template found, return as-is
  return message;
}

/**
 * Handles the 'disconnect' event
 * @param {Object} packet - Disconnect packet
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {Function} connectFn - Function to call for reconnection
 */
export function handleDisconnect(packet, connectionManager, connectFn) {
  const translatedMessage = translateDisconnectMessage(packet.message, packet.parameters);
  console.log('[info]', translatedMessage);
  connectionManager.isConnecting = false;
  scheduleReconnect(connectFn, connectionManager);
}

/**
 * Registers all event handlers
 * @param {Object} client - Bot client instance
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {Function} connectFn - Function to call for reconnection
 * @param {string} gamertag - Bot's gamertag
 * @param {boolean} debug - Debug mode flag
 */
export function registerEventHandlers(client, connectionManager, connectFn, gamertag, debug = false) {
  client.on('join', () => handleJoin(client, connectionManager));
  client.on('text', (packet) => handleText(packet, client, gamertag, debug));
  client.on('error', (err) => handleError(err, client, connectionManager, connectFn));
  client.on('close', () => handleClose(connectionManager, connectFn));
  client.on('disconnect', (packet) => handleDisconnect(packet, connectionManager, connectFn));
}

/**
 * Registers global shutdown handlers (should be called once at startup)
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {Function} getCurrentClient - Function that returns the current client instance
 */
export function registerShutdownHandlers(connectionManager, getCurrentClient) {
  // Handle graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
  const handleShutdown = () => {
    if (connectionManager.isShuttingDown) {
      // Already shutting down, force exit
      process.exit(0);
    }
    connectionManager.isShuttingDown = true;
    console.log('');
    const client = getCurrentClient();
    if (client) client.disconnect();
    process.exit(0);
  };

  process.on('SIGINT', handleShutdown);
  process.on('SIGTERM', handleShutdown);
}
