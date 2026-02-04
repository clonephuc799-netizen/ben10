import { AUTH_ERROR_PATTERNS, TRANSIENT_NETWORK_ERROR_PATTERNS } from '../config/constants.js';

/**
 * Error handler module
 * Provides error detection and helpful troubleshooting messages
 */

/**
 * Checks if an error is an authentication error
 * @param {Error} err - Error object
 * @returns {boolean} True if authentication error
 */
export function isAuthError(err) {
  return AUTH_ERROR_PATTERNS.some((pattern) => err.message.includes(pattern));
}

/**
 * Checks if an error is a connection timeout error
 * @param {Error} err - Error object
 * @returns {boolean} True if timeout error
 */
export function isTimeoutError(err) {
  return err.message.includes('Ping timed out');
}

/**
 * Checks if an error is a connection refused error
 * @param {Error} err - Error object
 * @returns {boolean} True if connection refused
 */
export function isConnectionRefusedError(err) {
  return err.message.includes('ECONNREFUSED');
}

/**
 * Checks if an error is a transient network error
 * @param {Error} err - Error object
 * @returns {boolean} True if transient network error
 */
export function isNetworkError(err) {
  const message = err.message;
  const cause = err.cause?.message || '';
  const fullMessage = message + ' ' + cause;

  return TRANSIENT_NETWORK_ERROR_PATTERNS.some((pattern) => fullMessage.includes(pattern));
}

/**
 * Troubleshooting tips by error type
 */
const TROUBLESHOOTING_TIPS = {
  timeout: ['Check if the server is running', 'Verify the host and port in config.json', 'Check if the server allows external connections', 'Ensure the Minecraft version matches the server', 'Check firewall settings'],
  connectionRefused: ['The server may not be running', 'Check the port number in config.json', 'Verify the host address is correct'],
  auth: ['Delete auth-cache/ directory: rm -rf auth-cache/', 'Try using offline mode if the server supports it', 'Ensure your Microsoft account is valid'],
};

/**
 * Displays troubleshooting tips for timeout errors
 */
export function showTimeoutTips() {
  console.error('\nTroubleshooting tips:');
  TROUBLESHOOTING_TIPS.timeout.forEach((tip, i) => console.error(`  ${i + 1}. ${tip}`));
}

/**
 * Displays troubleshooting tips for connection refused errors
 */
export function showConnectionRefusedTips() {
  console.error('\nTroubleshooting tips:');
  TROUBLESHOOTING_TIPS.connectionRefused.forEach((tip, i) => console.error(`  ${i + 1}. ${tip}`));
}

/**
 * Displays troubleshooting tips for authentication errors
 */
export function showAuthTips() {
  console.error('\nAuthentication failed. Please check:');
  TROUBLESHOOTING_TIPS.auth.forEach((tip, i) => console.error(`  ${i + 1}. ${tip}`));
  console.error('\nExiting due to authentication error.');
}

/**
 * Displays appropriate troubleshooting tips based on error type
 * @param {Error} err - Error object
 */
export function troubleshoot(err) {
  if (isTimeoutError(err)) showTimeoutTips();
  else if (isConnectionRefusedError(err)) showConnectionRefusedTips();
  else if (isAuthError(err)) showAuthTips();
}
