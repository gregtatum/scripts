#!/usr/bin/env node
// @ts-check

import { readFileSync, writeFileSync } from "node:fs";

const todoPath = process.argv[2];
const amendPath = process.env.GIT_SHIFT_AMEND;
if (!todoPath || !amendPath) {
  console.error("git-shift rebase editor was not configured.");
  process.exit(1);
}

const lines = readFileSync(todoPath, "utf8").split("\n");
const edited = [];

for (const line of lines) {
  edited.push(line);
  const match = line.match(/^pick\s+([0-9a-f]+)\s+/);
  if (match) {
    edited.push(`exec node ${shellQuote(amendPath)} ${match[1]}`);
  }
}

writeFileSync(todoPath, edited.join("\n"));

/**
 * @param {string} text
 */
function shellQuote(text) {
  return `'${text.replaceAll("'", "'\\''")}'`;
}
