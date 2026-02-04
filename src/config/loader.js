import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DEFAULT_CONFIG } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '../..');

/**
 * Loads configuration from config.json file
 * @returns {Object} Configuration object
 * @throws {Error} If config.json is invalid
 */
export function loadConfig() {
  const configPath = join(ROOT_DIR, 'config.json');

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configContent);

    // Validate required fields
    if (['host', 'port', 'gamertag'].some((k) => config[k] === undefined)) {
      throw new Error('[error] Missing required fields in config.json: host, port, gamertag');
    }

    return config;
  } catch (err) {
    const errorMsg = err.code === 'ENOENT' ? '[error] config.json file not found' : err instanceof SyntaxError ? '[error] Invalid JSON in config.json' : `[error] loading config.json: ${err.message}`;

    console.error(errorMsg);
    console.log('[warning] Using default configuration...');
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Gets the root directory path
 * @returns {string} Root directory path
 */
export function getRootDir() {
  return ROOT_DIR;
}
