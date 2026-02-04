import { getRootDir } from '../config/loader.js';
import { RETRY_CONFIG } from '../config/constants.js';
import { troubleshoot } from './error.js';

/**
 * Connection handler module
 * Manages bot connection, reconnection, and retry logic
 */

/**
 * Connection state manager
 */
export class ConnectionManager {
  constructor(config) {
    this.config = config;
    this.retryCount = 0;
    this.isConnecting = false;
    this.isAuthenticating = false;
    this.isReconnecting = false;
    this.isShuttingDown = false;
    this.isFirstAttempt = true;
  }

  /**
   * Gets the current retry count
   * @returns {number} Current retry count
   */
  get retryCount() {
    return this._retryCount;
  }

  /**
   * Sets the current retry count
   * @param {number} value - New retry count
   */
  set retryCount(value) {
    this._retryCount = value;
  }

  /**
   * Checks if bot is currently connecting
   * @returns {boolean} True if connecting
   */
  get isConnecting() {
    return this._isConnecting;
  }

  /**
   * Sets the connecting state
   * @param {boolean} value - Connecting state
   */
  set isConnecting(value) {
    this._isConnecting = value;
  }

  /**
   * Checks if bot is currently authenticating
   * @returns {boolean} True if authenticating
   */
  get isAuthenticating() {
    return this._isAuthenticating;
  }

  /**
   * Sets the authenticating state
   * @param {boolean} value - Authenticating state
   */
  set isAuthenticating(value) {
    this._isAuthenticating = value;
  }

  /**
   * Checks if bot is currently reconnecting
   * @returns {boolean} True if reconnecting
   */
  get isReconnecting() {
    return this._isReconnecting;
  }

  /**
   * Sets the reconnecting state
   * @param {boolean} value - Reconnecting state
   */
  set isReconnecting(value) {
    this._isReconnecting = value;
  }

  /**
   * Increments retry count
   */
  incrementRetry() {
    this.retryCount++;
    this.isFirstAttempt = false;
  }

  /**
   * Resets retry count
   */
  resetRetry() {
    this.retryCount = 0;
    this.isFirstAttempt = true;
  }

  /**
   * Checks if max retries has been reached
   * @returns {boolean} True if max retries reached
   */
  isMaxRetriesReached() {
    return this.retryCount >= (this.config?.reconnect ?? RETRY_CONFIG.MAX_RETRIES);
  }

  /**
   * Gets retry delay in milliseconds
   * @returns {number} Retry delay
   */
  getRetryDelay() {
    return RETRY_CONFIG.DELAY_MS;
  }

  /**
   * Gets max retries
   * @returns {number} Max retries
   */
  getMaxRetries() {
    return this.config?.reconnect ?? RETRY_CONFIG.MAX_RETRIES;
  }
}

/**
 * Builds client options from config
 * @param {Object} config - Configuration object
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @returns {Object} Client options
 */
export function buildClientOptions(config, connectionManager) {
  const clientOptions = {
    host: config.host,
    port: config.port,
    gamertag: config.gamertag,
    profilesFolder: getRootDir() + '/auth-cache/' + config.gamertag,
  };

  if (config.offline) {
    clientOptions.offline = true;
    if (connectionManager.isFirstAttempt) {
      console.log('[info] Offline mode (no authentication)');
    }
  } else {
    if (connectionManager.isFirstAttempt) {
      console.log('[info] Online mode (Microsoft authentication)');
    }
    clientOptions.flow = 'microsoft';
    clientOptions.onMsaCode = (data) => {
      connectionManager.isAuthenticating = true;
      console.log(`[auth] Visit: ${data.verification_uri}?otc=${data.user_code}`);
    };
  }

  if (config.version) {
    clientOptions.version = config.version;
  }

  return clientOptions;
}

/**
 * Schedules a reconnection attempt
 * @param {Function} connectFn - Function to call for reconnection
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {string} [logPrefix='[info]'] - Log message prefix
 */
export function scheduleReconnect(connectFn, connectionManager, logPrefix = '[info]') {
  // Stop reconnect if bot is shutting down
  if (connectionManager.isShuttingDown) {
    return;
  }

  // Prevent double reconnection if already scheduled
  if (connectionManager.isReconnecting) {
    return;
  }

  if (connectionManager.isMaxRetriesReached()) {
    console.log('[fail] Max reconnection attempts reached. Exiting.');
    process.exit(0);
  }

  connectionManager.isReconnecting = true;
  connectionManager.incrementRetry();
  const retryCount = connectionManager.retryCount;
  const maxRetries = connectionManager.getMaxRetries();
  const delay = connectionManager.getRetryDelay();

  console.log(`${logPrefix} Reconnecting (${retryCount}/${maxRetries}) in ${delay / 1000} seconds...`);

  setTimeout(() => {
    // Check again before reconnecting in case shutdown was triggered during delay
    if (connectionManager.isShuttingDown) {
      return;
    }
    connectionManager.isReconnecting = false;
    connectionManager.isConnecting = false;
    connectFn();
  }, delay);
}

/**
 * Handles retry logic with logging
 * @param {Function} connectFn - Function to call for reconnection
 * @param {ConnectionManager} connectionManager - Connection manager instance
 * @param {Error} [err] - Error object (for showing troubleshooting tips on max retries)
 * @param {string} [logPrefix='[error]'] - Log message prefix
 */
export function handleRetry(connectFn, connectionManager, err = null, logPrefix = '[error]') {
  // Don't retry if bot is shutting down
  if (connectionManager.isShuttingDown) {
    return;
  }

  // Prevent double retry if already scheduled
  if (connectionManager.isReconnecting) {
    return;
  }

  if (connectionManager.isMaxRetriesReached()) {
    console.error(`${logPrefix} Max retries reached. Exiting.`);
    // Show troubleshooting tips when max retries reached
    if (err) {
      troubleshoot(err);
    }
    process.exit(1);
  }

  connectionManager.isReconnecting = true;
  connectionManager.incrementRetry();
  const retryCount = connectionManager.retryCount;
  const maxRetries = connectionManager.getMaxRetries();
  const delay = connectionManager.getRetryDelay();

  console.error(`${logPrefix} Retrying connection (${retryCount}/${maxRetries}) in ${delay / 1000} seconds...`);

  setTimeout(() => {
    // Check again before reconnecting in case shutdown was triggered during delay
    if (connectionManager.isShuttingDown) {
      return;
    }
    connectionManager.isReconnecting = false;
    connectionManager.isConnecting = false;
    connectFn();
  }, delay);
}
