#!/bin/sh
# This file should be .git/hooks/pre-commit, and it will stop you from committing
# code that isn't properly linted.

LIST=`git diff --cached --name-only --diff-filter=ACM | egrep '\.jsm?$'`
if [ ! -z "$LIST" ]; then
  ./mach eslint -s
  ./mach eslint $LIST
  exit $?
fi
