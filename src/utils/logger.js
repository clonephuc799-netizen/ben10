import { FILTER_PATTERNS } from '../config/constants.js';

/**
 * Logger utility module for filtering noisy console logs and adding timestamps
 */

const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

/**
 * Pattern to detect log prefixes like [info], [death], [translation], etc.
 */
const LOG_PREFIX_PATTERN = /^\s*\[(\w+)\]/;

/**
 * Generates a timestamp in the format [HH:MM]
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `[${hours}:${minutes}]`;
}

/**
 * Checks if a message should be filtered
 * @param {string} message - Message to check
 * @returns {boolean} True if message should be filtered
 */
function shouldFilter(message) {
  if (typeof message !== 'string') return false;

  return FILTER_PATTERNS.some((pattern) => pattern.test(message));
}

/**
 * Prepends timestamp to messages with log prefixes
 * @param {string} message - Message to process
 * @returns {string} Message with timestamp prepended if applicable
 */
function addTimestamp(message) {
  if (typeof message === 'string' && LOG_PREFIX_PATTERN.test(message)) {
    return `${getTimestamp()} ${message.trim()}`;
  }
  return message;
}

/**
 * Override console methods to filter noisy logs and add timestamps
 */
export function setupConsoleFilters() {
  console.log = (...args) => {
    const msg = args[0];
    if (shouldFilter(msg)) return;
    const processedArgs = args.map((arg) => addTimestamp(arg));
    originalLog.apply(console, processedArgs);
  };

  console.warn = (...args) => {
    const msg = args[0];
    if (shouldFilter(msg)) return;
    const processedArgs = args.map((arg) => addTimestamp(arg));
    originalWarn.apply(console, processedArgs);
  };

  console.error = (...args) => {
    const msg = args[0];
    if (shouldFilter(msg)) return;
    const processedArgs = args.map((arg) => addTimestamp(arg));
    originalError.apply(console, processedArgs);
  };
}

/**
 * Restores original console methods
 */
export function restoreConsole() {
  console.log = originalLog;
  console.warn = originalWarn;
  console.error = originalError;
}
