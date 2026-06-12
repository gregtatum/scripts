#!/usr/bin/env node
// @ts-check

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const planPath = process.env.GIT_SHIFT_PLAN;
const todoHash = process.argv[2];
if (!planPath || !todoHash) {
  console.error("git-shift amend step was not configured.");
  process.exit(1);
}

const plan = JSON.parse(readFileSync(planPath, "utf8"));
const fullHash = Object.keys(plan).find(hash => hash.startsWith(todoHash));
if (!fullHash) {
  process.exit(0);
}

const dates = plan[fullHash];
const result = spawnSync(
  "git",
  ["-c", "core.fsmonitor=false", "commit", "--amend", "--no-edit", "--date", dates.authorDate],
  {
    encoding: "utf8",
    stdio: "inherit",
    env: {
      ...process.env,
      GIT_COMMITTER_DATE: dates.committerDate,
    },
  }
);

process.exit(result.status ?? 1);
