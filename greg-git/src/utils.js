// @ts-check
import { execSync } from 'child_process';
import color from 'cli-color';

/**
 * @param {string} name
 */
export function isValidGitRef(name) {
 // Modified by Greg Tatum.

 // https://github.com/vweevers/is-git-ref-name-valid
 // The MIT License (MIT)
 //
 // Copyright © Vincent Weevers
 //
 // Permission is hereby granted, free of charge, to any person obtaining a copy
 // of this software and associated documentation files (the "Software"), to deal
 // in the Software without restriction, including without limitation the rights
 // to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 // copies of the Software, and to permit persons to whom the Software is
 // furnished to do so, subject to the following conditions:
 //
 // The above copyright notice and this permission notice shall be included in all
 // copies or substantial portions of the Software.
 //
 // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 // IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 // FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 // AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 // LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 // OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 // SOFTWARE.

  // Last updated for git 2.29.0.
  // eslint-disable-next-line no-control-regex
  const bad = /(^|[/.])([/.]|$)|^@$|@{|[\x00-\x20\x7f~^:?*[\\]|\.lock(\/|$)/
  return !bad.test(name)
}

/**
 * @param {string} message
 */
export function exit(message) {
  console.error(message);
  process.exit(1);
}

/**
 * @param {string} command
 * @returns {string}
 */
export function run(command) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: [
      'pipe', // stdin
      'pipe', // stdout
      'pipe', // stderr
    ]
  })?.trim();
}

/**
 * @param {string} command
 */
export function runInteractive(command) {
  return execSync(command, {stdio: 'inherit'});
}

/**
 * @param {string} command
 * @returns {string | null}
 */
export function tryRun(command) {
  try {
    return run(command);
  } catch (error) {
  }
  return null;
}

/**
 * @param {string[]} hashes
 * @returns {Array<{
 *    hash: string,
 *    shorthash: string,
 *    message: string,
 *    choice: string,
 * }>}
 */
export function getStructuredCommits(hashes, indent = "") {
  return hashes.map(hash => {
    const shorthash = hash.slice(0, 13);
    const message = run(`git log -n 1 --pretty=format:%s ${hash}`);
    const fullMessage = run(`git log -n 1 --pretty=format:%B ${hash}`);
    let choice = [
      color.yellow(shorthash),
      " ",
      color.white(message),
    ].join('');

    for (const line of fullMessage.split('\n')) {
      const url = line.match(/^Differential Revision: (https:\/\/.*)$/);
      if (url) {
        choice += [
          "\n              ",
          indent,
          color.blackBright.underline(url[1]),
        ].join('');
        break;
      }
    }
    return {
      hash,
      shorthash,
      message,
      choice,
    }
  });
}
