// @ts-check
import { Command } from "commander";
import { isValidGitRef, exit, run, tryRun, runInteractive, getStructuredCommits } from "./utils.js";

/**
 * @param {Command} program
 */
export function setupStack(program) {
  program.command('stack')
    .description('Use `git stack` to see your commit stack')
    .usage([
      "", "",
      "- See the full stack of commits:",
      "  git stack",
      "",
      "- Get a stack from a specific commit",
      "  git stack 4b6c22c86920a",
      "",
      "- Fixup a specific file or path:",
      "  git stack widgets/textrecognition.js",
    ].join("\n"))
    .argument('[base]', 'the base commit of the stack', 'main')
    .option('-l, --limit <limit>', 'the limit of commits for this command', '100')
    .action(action);
}

/**
 * @param {string} base
 * @param {{limit: string}} options
 * @returns {Promise<void>}
 */
async function action(base, options) {
  if (!isValidGitRef(base)) {
    throw exit("A valid git ref was not provided: " + base);
  }

  if (tryRun(`git cat-file -t ${base}`) !== 'commit') {
    throw exit("The base commit could not be found: " + base);
  }

  const hashes = run(`git rev-list ${base}..HEAD`).split('\n');

  if (hashes.length === 0) {
    throw exit("No commits were found.");
  }

  const limit = parseInt(options.limit, 10);
  if (Number.isNaN(limit)) {
    throw exit("The limit could not be parsed as a number.");
  }

  if (hashes.length > limit) {
    throw exit("More than 100 commits found, bailing out.");
  }

  const commits = getStructuredCommits(hashes);
  for (const commit of commits) {
    console.log(commit.choice);
  }
}
