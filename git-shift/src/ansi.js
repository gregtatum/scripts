// @ts-check

const enabled = process.stdout.isTTY && process.env.NO_COLOR === undefined;

/**
 * @param {number} code
 * @param {string} text
 */
function wrap(code, text) {
  return enabled ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const color = {
  cyan: text => wrap(36, text),
  dim: text => wrap(2, text),
  green: text => wrap(32, text),
  red: text => wrap(31, text),
  white: text => wrap(37, text),
  yellow: text => wrap(33, text),
};
