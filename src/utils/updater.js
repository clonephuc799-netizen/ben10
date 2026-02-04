/**
 * Update Checker Utility Module
 * Checks for updates from GitHub repository and prompts user to upgrade
 */

import { execSync } from 'child_process';
import { createInterface } from 'readline';
import https from 'https';

const REPO_OWNER = 'cloudy-network';
const REPO_NAME = 'bedrock-bot';
const GITHUB_COMMITS_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/main`;

/**
 * Performs a GET request and returns the parsed JSON body.
 * @param {string} url
 * @param {Record<string, string>} [headers={}]
 * @returns {Promise<object|null>} Parsed response or null on failure
 */
function fetchJSON(url, headers = {}) {
  return new Promise((resolve) => {
    https
      .get(url, { headers }, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.error(`> GitHub API returned status ${res.statusCode}`);
            return resolve(null);
          }
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            console.error('> Failed to parse GitHub API response:', err.message);
            resolve(null);
          }
        });
      })
      .on('error', (err) => {
        console.error('> Failed to fetch from GitHub:', err.message);
        resolve(null);
      });
  });
}

/**
 * Git CLI commands utility.
 * Methods return null instead of throwing when git is unavailable.
 */
class GitClient {
  /** @returns {string|null} Full commit hash of HEAD */
  static commit() {
    return GitClient.#run('rev-parse HEAD');
  }

  /** @returns {string|null} Current branch name */
  static branch() {
    return GitClient.#run('rev-parse --abbrev-ref HEAD');
  }

  /**
   * Fetches and hard-resets to origin/main.
   * @returns {boolean} Whether the update succeeded
   */
  static update() {
    try {
      console.log('> Fetching latest changes...');
      execSync('git fetch origin', { stdio: 'pipe' });

      const output = execSync('git reset --hard origin/main', { encoding: 'utf-8' });
      // Add prefix to each line of git output
      if (output.trim()) {
        output
          .trim()
          .split('\n')
          .forEach((line) => console.log(`> ${line}`));
      }

      console.log('> Update completed successfully!');
      console.log('> Please restart the bot to apply changes.');
      return true;
    } catch (err) {
      console.error('> Update failed:', err.message);
      return false;
    }
  }

  /** @returns {string|null} Trimmed stdout or null on error */
  static #run(args) {
    try {
      return execSync(`git ${args}`, { encoding: 'utf-8' }).trim();
    } catch {
      return null;
    }
  }
}

/**
 * Asks a yes/no question on the terminal.
 * @param {string} question
 * @returns {Promise<boolean>}
 */
function promptYesNo(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => {
      rl.close();
      resolve(/^(y|yes)$/i.test(answer));
    });
  });
}

/**
 * Builds the multi-line update-available banner.
 * @param {{ local: string, branch: string, remote: string, message: string, date: string }} info
 * @returns {string}
 */
function buildBanner({ local, branch, remote, message, date }) {
  return `
  ╔═══════════════════╗
  ║ UPDATE AVAILABLE! ║
  ╚═══════════════════╝

  Local version:  ${local} (${branch})
  Remote version: ${remote} (main)

  Latest commit:  ${message}
  Committed at:   ${date}
`;
}

/**
 * Checks for updates and prompts the user to upgrade if one is available.
 * @returns {Promise<void>}
 */
export async function checkForUpdates() {
  const localCommit = GitClient.commit();
  if (!localCommit) return; // Not a git repo — nothing to do

  console.log('> Checking for updates...');

  const commitData = await fetchJSON(GITHUB_COMMITS_URL, {
    'User-Agent': 'bedrock-bot-update-checker',
  });

  if (!commitData) {
    console.log('> Could not check for updates. Continuing...\n');
    return;
  }

  const local = localCommit.slice(0, 7);
  const remote = commitData.sha.slice(0, 7);

  if (local === remote) {
    console.log('> Bot is up to date!\n');
    return;
  }

  console.log(
    buildBanner({
      local,
      branch: GitClient.branch() ?? 'unknown',
      remote,
      message: commitData.commit.message.split('\n')[0],
      date: commitData.commit.committer.date,
    }),
  );

  if (await promptYesNo('> Do you want to upgrade the bot? (y/N): ')) {
    if (GitClient.update()) {
      process.exit(0); // Exit so the user can restart with the new code
    }
  } else {
    console.log('> Skipping update. Continuing with current version...');
  }

  console.log('');
}
