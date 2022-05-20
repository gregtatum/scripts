// @ts-check
import inquirer from 'inquirer';
import { isValidGitRef, exit, run, tryRun, runInteractive, getStructuredCommits } from "./utils.js";
import color from 'cli-color';
import { Command } from 'commander';


/**
 * @param {Command} program
 */
export function setupFixup(program) {
  program.command('fixup')
    .description('Interactively fix up a commit in a stack')
    .usage([
      "", "",
      "- Interactively stage and fixup a commit:",
      "  git fixup",
      "",
      "- Fixup from a given revision:",
      "  git fixup -s 4b6c22c86920a",
      "",
      "- Fixup a specific file or path:",
      "  git fixup widgets/textrecognition.js",
    ].join("\n"))
    .argument('[path]', 'file path to run git add -p')
    .option('-b, --base <rev>', 'The base commit to use the interactive tool from', 'main')
    .option('-l, --limit <limit>', 'Bails out if there are too many commits', '100')
    .action(action);
}

/**
 * @param {string} filePath
 * @param {{base: string, limit: string}} options
 * @returns {Promise<void>}
 */
async function action(filePath, options) {
  const { base } = options;
  if (!isValidGitRef(base)) {
    throw exit("A valid git ref was not provided: " + base);
  }

  if (tryRun(`git cat-file -t ${base}`) !== 'commit') {
    throw exit("The base commit could not be found: " + base);
  }

  const hashes = run(`git rev-list ${base}..HEAD`).split('\n');

  if (hashes.length === 0) {
    throw exit("No commits were found to edit.");
  }

  const limit = parseInt(options.limit, 10);
  if (Number.isNaN(limit)) {
    throw exit("The limit could not be parsed as a number.");
  }

  if (hashes.length > limit) {
    throw exit("More than 100 commits considered for fixup, bailing out.");
  }

  const commits = getStructuredCommits(hashes, "  ");

  // Stage things if a file path is provided
  if (filePath) {
    runInteractive("git add -p " + filePath)
    if (noStagedChanges()) {
      process.exit();
    }
  }

  // Is nothing staged for commit? Go ahead and stage something.
  if (!filePath && noStagedChanges()) {
    runInteractive("git add . -p");
    if (noStagedChanges()) {
      process.exit();
    }
  }

  const prompt = inquirer
    .prompt([{
      type: 'list',
      pageSize: 30,
      name: 'response',
      message: 'Which commit do you wish to fixup?',
      choices: commits.map(({choice}) => choice)
    }]);

  // Close inquirer with escape.
  /**
   * @param {any} _
   * @param {{name: string}} key
   */
  function closeOnEsc(_, key) {
    if (key.name === "escape" || key.name === 'q') {
      /** @type {any} - For some reason .close() isn't in the types. */
      const prompt2 = prompt;
      prompt2.ui.close()
    }
  }

  process.stdin.on('keypress', closeOnEsc);
  const answer = await prompt;
  process.stdin.off('keypress', closeOnEsc);

  const commit = commits.find(commit => commit.choice === answer.response)
  if (!commit) {
    throw new Error("Could not find a commit from the selection");
  }

  console.log(run(`git revise ${commit.hash}`));
}

function noStagedChanges() {
  return !run("git diff --cached").trim();
}
