#!/usr/bin/env node
// @ts-check
import { Command } from 'commander'
import { setupFixup } from './fixup.js'
import { setupStack } from './stack.js'

const program = new Command();

program
  .name('git')
  .description('Greg\'s git tools')

setupFixup(program);
setupStack(program);

program.parse()
