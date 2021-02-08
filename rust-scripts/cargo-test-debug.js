// @ts-check
const ndjson = require('ndjson');
const { spawn } = require('child_process');
const toml = require('toml');
const fs = require('fs')

/**
 * @typedef {import('./types').CargoTestRow} CargoTestRow
 */

// Provide a nicer way of reporting errors, that don't include stacks from this script.
function reportError(message, error) {
  if (error) {
    console.error(message, error);
  } else {
    console.error(message);
  }
  process.exit(1);
}

const functionName = process.argv[2]
{
  // Sanitize the input arguments.
  if (!functionName) {
    reportError([
      "This script automatically runs a cargo test for a specific function with lldb and",
      "sets a breakpoint for that function. It assumes to be running in the current",
      "working directory of the Cargo.toml for that project.",
      "",
      "Usage:",
      "",
      "cargo-test-debug test_function_name"
    ].join('\n'));
  }

  if (process.argv.length !== 3) {
    reportError("This command assumes that there is only one additional argument to the command.")
  }

  if (!functionName.match(/^\w+$/)) {
    reportError("The function name provided has unrecognized characters: " + functionName);
  }
}

/** @type {string} */
let projectName;
try {
  const cargoTomlText = fs.readFileSync('Cargo.toml', 'utf8');
  try {
    const cargoToml = toml.parse(cargoTomlText);
    try {
      projectName = cargoToml.package.name
    } catch (error) {
      reportError("The Cargo.toml did not have a package name", cargoToml)
    }
  } catch (error) {
    reportError('Unable to parse the Cargo.toml', error);
  }
} catch (error) {
  reportError("Could not find a Cargo.toml in the current working directory.", error);
}

console.log('🏃‍♂️ Running cargo test to find the test binary.');

let testBinary;

// Spawn "cargo test" with the output as JSON. This will give us all of the compiler
// artifacts, which includes the test runner binary.
spawn('cargo', ['test', '--message-format=json', functionName])
  .stdout
  .pipe(ndjson.parse())
  .on('data', (data) => {
    /** @type {CargoTestRow} */
    const row = data;
    switch (row.reason) {
      case 'compiler-artifact':
        const { target, executable } = row;
        if (target.test && target.name === projectName && executable) {
          testBinary = executable;
        }
        break;
      default:
        // Do nothing.
    }
  })
  .on('error', () => {
    // The end of the test run doesn't do JSON, which causes a stream error.
    runTestWithDebugger();
  })
  .on('close', () => {
    runTestWithDebugger();
  });

// After getting the test binary location, run the test using lldb.
function runTestWithDebugger() {
  if (!testBinary) {
    reportError("Could not find the test binary.")
  }
  console.log('👀 Test binary found:', testBinary);
  const cargoTestArgs = [
    functionName
  ].join(' ');

  const lldbArgs = [
    testBinary,
    // Pass on some args to the cargo test binary.
    '-o', `settings set target.run-args ${cargoTestArgs}`,
    // Set the initial breakpoint.
    '-o', `b ${functionName}`,
    // Begin running lldb
    '-o', `run`,
  ];

  const cmd = 'rust-lldb'

  const config = { stdio: [process.stdin, process.stdout, process.stderr] };
  console.log("🚀 Launching lldb");
  console.log();
  console.log('➤', [cmd, ...lldbArgs].join(' '));
  console.log();
  spawn(cmd, lldbArgs, config);
}
