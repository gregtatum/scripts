const split = require('split')
const x256 = require('x256')
const hexCode = require('colornames')
const through2 = require('through2')

const PASS_COLOR = color('green')
const FAIL_COLOR = color('red')
const DIM_COLOR = color([ 'dim', [91,127,127] ])
const INFO_COLOR = color([ 'bright', [91,127,127] ])
const SUMMARY_COLOR = color([ 'bright', [255,255,255] ])
const DEBUG_COLOR = color([ 'bright', [255,0,255] ])
const RESET_COLOR = '\x1b[00m'

;(function() {
  process.stdin
    .pipe(split())
    .pipe(through2.obj(function(line, _, callback) {
      if (unhelpfulCssErrors(line)) {}
      else if (unhelpfulJsErrors(line)) {}
      else if (isTestingPreamble(line)) {}
      else if (isTestingPostamble(line)) {}
      else if (isTestingPostamble(line)) {}
      else if (/^\d+ INFO TEST-(OK)|(PASS)/.test(line))
        output(this, line, PASS_COLOR)
      else if (/^\d+ INFO TEST-UNEXPECTED-FAIL/.test(line))
        output(this, line, FAIL_COLOR)
      else if (/!!!/.test(line))
        output(this, line, DEBUG_COLOR)
      else if (/Browser Chrome Test Summary$/.test(line))
        output(this, line, SUMMARY_COLOR)
      else if (/^((\d+ INFO )|([\s]+))(Passed|Failed|Todo):/.test(line))
        output(this, line, SUMMARY_COLOR)
      else if (/^\d+ INFO/.test(line))
        output(this, line, INFO_COLOR)
      else
        output(this, line, DIM_COLOR)
      callback()
    }))
    .pipe(process.stdout)
})()

function output (stream, line, color) {
  line = line.replace(/^\d+ INFO/, "⎮ ")
  stream.push(color + line + RESET_COLOR + "\n")
}

function unhelpfulCssErrors (line) {
  return (
    /\d+ INFO Console message: \[JavaScript Warning: "Property contained reference to invalid variable./.test(line) ||
    /\d+ INFO Console message: \[JavaScript Warning: "Expected declaration but found ‘\*’/.test(line) ||
    /\d+ INFO Console message: \[JavaScript Warning: "Unknown property ‘/.test(line) ||
    /\d+ INFO Console message: \[JavaScript Warning: "Unknown pseudo-class/.test(line)
  )
}

function unhelpfulJsErrors (line) {
  return (
    /DebuggeeWouldRun: debuggee/.test(line)
  )
}

function isTestingPreamble (line) {
  return (
    /runtests\.py \|/.test(line) ||
    /Marionette\s+INFO/.test(line) ||
    /MochitestServer : launching/.test(line) ||
    line === "######" ||
    line === "Checking for orphan ssltunnel processes..." ||
    line === "Checking for orphan xpcshell processes..." ||
    line === "SUITE-START | Running 1 tests" ||
    line === "dir: devtools/client/inspector/rules/test" ||
    line === "pk12util: PKCS12 IMPORT SUCCESSFUL" ||
    line === "TEST-INFO | started process Main app process"
  )
}

function isTestingPostamble (line) {
  return (
    /^SUITE-END \| took /.test(line) ||
    /\=\=\> process \d+ launched child process \d+/.test(line) ||
    /^MEMORY STAT /.test(line) ||
    /zombiecheck \|/.test(line) ||
    /Completed ShutdownLeaks collections in process/.test(line) ||
    line === "-*- PresentationControlService.js: PresentationControlService - close" ||
    line === "TEST-INFO | checking window state" ||
    line === "TEST-INFO | Main app process: exit 0" ||
    line === "Stopping web server" ||
    line === "Stopping web socket server" ||
    line === "Stopping ssltunnel" ||
    line === "WARNING | leakcheck | refcount logging is off, so leaks can't be detected!"
  )
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
