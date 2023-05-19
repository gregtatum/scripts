// This file is for spitting out something nicely formatted from the Treeherder logs.

// treeherder-log {
//   curl -s --compressed $1 | node /Users/gregorytatum/scripts/mochitest-formatter/from-treeherder-log.js
// }

// Usage: `treeherder-log URL`

const split = require('split')
const x256 = require('x256')
const hexCode = require('colornames')
const through2 = require('through2')

const PASS_COLOR = color('green')
const START_COLOR = color('blue')
const FAIL_COLOR = color('red')
const TEST_BOUND = color('yellow')
const OTHER_COLOR = color('white')
const DIM_COLOR = color([ 'dim', [91,127,127] ])
const INFO_COLOR = color([ 'bright', [91,127,127] ])
const SUMMARY_COLOR = color([ 'bright', [255,255,255] ])
const DEBUG_COLOR = color([ 'bright', [255,0,255] ])
const RESET_COLOR = '\x1b[00m'

let indent = '';
let isTest = false;
;(function() {
  process.stdin
    .pipe(split())
    .pipe(through2.obj(function(line, _, callback) {
      // if (/INFO - GECKO\(\d+\)/.test(line)) {}
      // if (unhelpfulCssErrors(line)) {}
      // if (unhelpfulJsErrors(line)) {}
      // if (isTestingPreamble(line)) {}
      // if (isTestingPostamble(line)) {}
      // if (isTestingPostamble(line)) {}

      if (/Leaving test bound/.test(line)) {
        isTest = false;
        indent = indent.slice(0, -4);
      }
      if (indent) {
        line = indent + line;
      }
      if (/Entering test bound/.test(line)) {
        isTest = true;
        indent += '    ';
      }


      // Skip these:
      if (!isTest) {}
      else if (/DocShellAndDOMWindowLeak/.test(line)) {}
      else if (/zombiecheck \|/.test(line)) {}
      else if (/leakcheck \|/.test(line)) {}
      else if (/XPCOM_MEM_BLOAT_LOG/.test(line)) {}
      else if (/\d+ Marionette/.test(line)) {}
      else if (/Buffered messages logged/.test(line)) {}
      else if (/Buffered messages finished/.test(line)) {}

      // Color these:
      else if (/INFO - TEST-(OK)|(PASS)/.test(line))
        output(this, line, PASS_COLOR)
      else if (/INFO - TEST-UNEXPECTED-FAIL/.test(line))
        output(this, line, FAIL_COLOR)
      else if (/INFO - TEST-START/.test(line))
        output(this, line, START_COLOR)
      else if (/INFO - TEST-/.test(line))
        output(this, line, OTHER_COLOR)
      else if (/test bound/.test(line))
        output(this, line, TEST_BOUND)
      else if (/ERROR - /.test(line))
        output(this, line, FAIL_COLOR)
      else if (/!!!/.test(line))
        output(this, line, DEBUG_COLOR)
      else if (/Browser Chrome Test Summary$/.test(line))
        output(this, line, SUMMARY_COLOR)
      else if (/((INFO -)|([\s]+))(Passed|Failed|Todo):/.test(line))
        output(this, line, SUMMARY_COLOR)
      else if (/INFO/.test(line))
        output(this, line, INFO_COLOR)
      else
        output(this, line, DIM_COLOR)
      callback()
    }))
    .pipe(process.stdout)
})()

function output (stream, line, color) {
  // line = line.replace(/^\d+ INFO/, "⎮ ");

  // [task 2023-04-06T19:11:05.550Z] 19:11:05     INFO - TEST-INFO | started process GECKO(1623)
  line = line.replace(/\[task .*?\]\s*[\d:]*\s*/, '');
  //                   \[        \]   |     |
  //                     task .*?     |     \s*                Match trailing whitespace
  //                                  [\d:]*                   Match the "19:11:05"
  //

  // | INFO - GECKO(2771) |
  line = line.replace(/\|? ?INFO - GECKO\(\d+\) \|/, '');
  //                       INFO - GECKO(2771) |
  // INFO - TEST-PASS |
  line = line.replace(/INFO - TEST-PASS \|/, '✓');

  // INFO - TEST-UNEXPECTED-FAIL |
  line = line.replace(/INFO - TEST-UNEXPECTED-FAIL \|/, '✕ TEST-UNEXPECTED-FAIL |');

  line = line.replace(/^\w*INFO -\w*/, '');

  stream.push(color + line + RESET_COLOR + "\n")
}

function color (parts) {
  if (typeof parts === 'string') parts = parts.split(/\s+/)
  if (typeof parts === 'object' && /^\d+$/.test(parts[0])) {
    parts = [parts]
  }

  var s = ''
  for (var i = 0; i < parts.length; i++) {
    var c = {
      bright: 1, dim: 2, underscore: 4, blink: 5,
      reverse: 7, hidden: 8
    }[parts[i]]

    if (c) s += '\x1b[' + c + 'm'
    else s += parseColor(parts[i])
  }
  return s
}

function parseColor (rgb) {
  if (typeof rgb === 'string' && /,/.test(rgb)) {
    rgb = rgb.split(',')
  }
  else if (typeof rgb === 'string' && /^#/.test(rgb)) {
    rgb = parseHex(rgb)
  }
  else if (typeof rgb === 'string') {
    rgb = hexCode(rgb)
    if (rgb) rgb = parseHex(rgb)
    else rgb = [ 127, 127, 127 ]
  }
  return '\x1b[38;5;' + x256(rgb) + 'm'
}

function fromHex (s) {
  return parseInt(s, 16)
}

function parseHex (s) {
  var xs = s.replace(/^#/, '').match(/\w{2}/g)
  var res = []
  for (var i = 0; i < xs.length; i++) {
    res.push(fromHex(xs[i]))
  }
  return res
}
