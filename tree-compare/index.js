#!/opt/homebrew/bin/node
'use strict';

import ArgParse from 'argparse'
import { execSync } from 'child_process'
import tempfile from 'tempfile';
import fs from 'fs/promises';

const { ArgumentParser } = ArgParse;

const parser = new ArgumentParser({
  description: 'Takes two treeherder raw log URLs, fetch the contents, and diffs them.'
});

parser.add_argument(
  '--red',
  {
    type: 'str',
    help: 'The "from" raw log, which is displayed in red.',
    required: true
  }
)
parser.add_argument(
  '--green',
  {
    type: 'str',
    help: 'The "to" raw log, which is displayed in green.',
    required: true
  }
)
parser.add_argument(
  '--test',
  {
    type: 'str',
    help: 'The test name in the suite to compare',
    required: true
  }
)

async function processLog(url, test) {
  const response = await fetch(url);
  const rawLog = await response.text();

  let isFound = false;
  const testStart = `TEST-START | ${test}`;
  const testEnd = `TEST-OK | ${test}`;
  const result = ["\n"];

  const processLine = line => {
    line = line.replace(/\[.*\] [\d:\w]+/, "")
    line = line.replace(/GECKO\(\d+\) \| +/, "")

    // Project specific replaces:
    line = line.replace(/\d+\.\d+ seconds/, "--- seconds")
    line = line.replace(/innerWindowId:\d+/, "innerWindowId:-----")


    line = line.trim()
    result.push(line);
  }

  for (const line of rawLog.split("\n")) {
    if (isFound) {
      processLine(line)

      if (line.includes(testEnd)) {
        break;
      }
    } else {
      if (line.includes(testStart)) {
        isFound = true;
        processLine(line);
      }
    }
  }
  result.push("\n");

  const processedPath = await tempfile();
  await fs.writeFile(processedPath, result.join("\n"));

  const rawPath = await tempfile();
  await fs.writeFile(rawPath, rawLog);

  return { processedPath, rawLog, rawPath };
}

/**
 * @param {string} text
 * @returns {Set<string>}
 */
function findTestStarts(text) {
  const tests = new Set();
  for (const [_, capture] of text.matchAll(/TEST-START \| (.*)/g)) {
    tests.add(capture.trim())
  }
  return tests;
}

function compareTests(red, green) {
  const redTests = findTestStarts(red.rawLog);
  const greenTests = findTestStarts(green.rawLog);

  for (const testName of redTests) {
    let text = "🟥";
    if (greenTests.has(testName)) {
      text += "⬛️"
    } else {
      text += "🟩";
    }
    greenTests.delete(testName);
    console.log(text + " " + testName);
  }

  for (const testName of greenTests) {
    let text = ""

    if (redTests.has(testName)) {
      text += "🟥";
    } else {
      text += "⬛️"
    }
    console.log(text + "🟩 " + testName);
  }
}

async function main(args) {
  const red = await processLog(args.red, args.test);
  const green = await processLog(args.green, args.test);

  // compareTests(red, green)

  console.log();
  console.log(args.test);
  
  try {
    const command = `git diff --no-index ${red.processedPath} ${green.processedPath}`;
    const options = { encoding: 'utf8', stdio: [0, 0, 0] };
    execSync(command, options);
  } catch (error) {
    // Ignore this? It's weird because the command has a 1 exit code with no reason why.
  }

  console.log();
  console.log("Red:");
  console.log("  processed:", red.processedPath);
  console.log("  raw:", red.rawPath);
  console.log("  url:", args.red);
  console.log();
  console.log("Green:");
  console.log("  processed:", green.processedPath);
  console.log("  raw:", green.rawPath);
  console.log("  raw log url:", args.green);
}

main(parser.parse_args());
