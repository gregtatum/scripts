#!/usr/bin/env node
// @ts-check

import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";
import { color } from "./ansi.js";
import { applyShiftPlan, parseTwoDotRange, readCommits } from "./git.js";
import { printShiftPlan } from "./list.js";
import { assertPossiblePlan, buildShiftPlan, hasChanges } from "./shift-plan.js";
import { parseShift, parseWhenRule } from "./time-rules.js";

function usage() {
  return [
    "Usage:",
    '  git shift <range> --when "mon-fri 2-10" --by "+5h" --list',
    '  git shift <range> --when "mon-fri 2-10" --by "+5h"',
    "",
    "Examples:",
    '  git shift HEAD~100..HEAD --when "tue-wed 2-10" --by "+5h" --list',
  ].join("\n");
}

/**
 * @param {string[]} args
 */
export function parseGitShiftArgs(args) {
  return parseArgs({
    args: normalizeArgs(args),
    allowPositionals: true,
    options: {
      when: { type: "string" },
      by: { type: "string" },
      list: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  });
}

/**
 * Node's parseArgs treats a value like "-2h" after "--by" as a possible
 * option, so normalize the specific signed-duration form that this CLI accepts.
 *
 * @param {string[]} args
 * @returns {string[]}
 */
function normalizeArgs(args) {
  const normalized = [];

  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    const nextArg = args[index + 1];

    if (arg === "--by" && typeof nextArg === "string" && /^-[1-9]\d*[hm]$/i.test(nextArg)) {
      normalized.push(`--by=${nextArg}`);
      index++;
      continue;
    }

    normalized.push(arg);
  }

  return normalized;
}

async function main() {
  const { values, positionals } = parseGitShiftArgs(process.argv.slice(2));

  if (values.help) {
    console.log(usage());
    return;
  }

  const [range] = positionals;
  if (!range || !values.when || !values.by) {
    throw new Error(`${usage()}\n\nMissing required range, --when, or --by.`);
  }

  parseTwoDotRange(range);
  const whenRule = parseWhenRule(values.when);
  const shiftMs = parseShift(values.by);
  const commits = readCommits(range);
  const plan = buildShiftPlan(commits, whenRule, shiftMs);
  assertPossiblePlan(plan);

  printShiftPlan(plan);

  if (values.list) {
    return;
  }

  if (!hasChanges(plan)) {
    console.log(color.dim("No commits matched the time rule; nothing to rewrite."));
    return;
  }

  const backupRef = applyShiftPlan(range, plan);
  printRewriteSuccess(backupRef);
}

/**
 * @param {string} backupRef
 */
function printRewriteSuccess(backupRef) {
  console.log();
  console.log(color.green("Rewritten successfully."));
  console.log();
  console.log("Backup ref:");
  console.log(`  ${backupRef}`);
  console.log();
  console.log("Inspect the old history:");
  console.log(`  git log --oneline ${backupRef}`);
  console.log();
  console.log("Compare old vs rewritten history:");
  console.log(`  git range-diff ${backupRef} HEAD`);
  console.log();
  console.log("Restore the branch to the backup:");
  console.log(`  git reset --hard ${backupRef}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(color.red(error instanceof Error ? error.message : String(error)));
    process.exit(1);
  });
}
