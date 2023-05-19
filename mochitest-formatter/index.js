const split = require('split')
const x256 = require('x256')
const hexCode = require('colornames')
const through2 = require('through2')

const PASS_COLOR = color('green')
const ERROR_COLOR = color('red')
const FAIL_COLOR = color('black') + color('red', true)
const TASK = color('yellow')
const DIM_COLOR = color([ 'bright', [91,127,127] ])
const SUMMARY_COLOR = color([ 'bright', [255,255,255] ])
const INFO_COLOR = color([ 'bright', [182,255,255] ])
const DEBUG_COLOR = color([ 'bright', [255,0,255] ])
const RESET_COLOR = '\x1b[00m'

let inTask = false;
let overallSummary = false;

;(function() {
  process.stdin
    .pipe(split())
    .pipe(through2.obj(function(line, _, done) {
      const outputCapture = (prefix, regexp, prefixColor, captureColor) => {
        const match = line.match(regexp);
        if (!match || !match[1]) {
          // There was no capture.
          if (prefix.trim()) {
            // Only ouptut if there is something to output.
            this.push(prefixColor + prefix + RESET_COLOR + "\n")
          }
          done();
          return;
        }

        const capture = match[1];
        if (prefix.length + capture.length < process.stdout.columns) {
          // The capture fits on the screen.
          this.push(prefixColor + prefix + RESET_COLOR + captureColor + capture + RESET_COLOR + "\n")
          done();
          return
        }

        // The capture does not fit on the screen, format it to.
        this.push(prefixColor + prefix + RESET_COLOR)
        this.push(captureColor + splitLine(capture, prefix.length).trim() + RESET_COLOR + "\n")
        done()
      }

      if (line === "Overall Summary") {
        overallSummary = true;
        this.push("\n");
      }

      if (overallSummary) {
        this.push(line + "\n");
        done();
        return;
      }

      // False positive errors
      if (line.includes("XULStore.sys.mjs")) {
        // 0:05.86 INFO Console message: [JavaScript Error: "Error: Can't find profile directory." {file: "resource://gre/modules/XULStore.sys.mjs" line: 58}]
        // load@resource://gre/modules/XULStore.sys.mjs:58:15
        // XULStore@resource://gre/modules/XULStore.sys.mjs:17:10
        return done();
      }

      // The start of the suite.
      if (line.includes("SUITE_START: ")) {
        //  0:02.20 SUITE_START: mochitest-browser - running 1 tests
        return outputCapture("Suite start:      ", /SUITE_START: (.*)/, SUMMARY_COLOR, DIM_COLOR);
      }

      if (line.includes("INFO Running manifest:")) {
        // "0:02.20 INFO Running manifest: browser/components/translations/tests/browser/browser.ini"
        return outputCapture("Running manifest: ", /INFO Running manifest: (.*)/, SUMMARY_COLOR, DIM_COLOR);
      }

      if (line.includes("TEST_START: ")) {
        // " 0:05.42 TEST_START: browser/components/translations/tests/browser/browser_translations_panel.js"
        return outputCapture("\nRunning: ", /TEST_START: (.*)/, PASS_COLOR, TASK);
      }

      if (line.includes("INFO Entering test bound")) {
        // " 0:12.71 INFO Entering test bound test_about_translations_enabled"
        inTask = true;
        line = line + '\n';
        return outputCapture("\n ", /INFO Entering test bound (.*)/, TASK, TASK);
      }

      if (line.includes("INFO Leaving test bound")) {
        // " 0:19.70 INFO Leaving test bound test_translated_textnode"
        inTask = false;
        return done();
      }

      if (!inTask) {
        // Not in a task, ignore the output.
        return done();
      }

      if (/\d+:\d+\.\d+ INFO/.test(line)) {
        // " 0:04.47 INFO Start at a page in Spanish."
        return outputCapture("   ℹ ", /\d+:\d+\.\d+ INFO (.*)/, SUMMARY_COLOR, INFO_COLOR)
      }

      if (/\d+:\d+\.\d+ PASS/.test(line)) {
        // " 0:04.47 PASS The button should be visible since the page can"
        return outputCapture("   ✓ ", /\d+:\d+\.\d+ PASS (.*)/, PASS_COLOR, PASS_COLOR)
      }

      if (/\d+:\d+\.\d+ FAIL/.test(line)) {
        // " 0:06.58 FAIL This is an error -"
        return outputCapture("   ✕ FAIL ", /\d+:\d+\.\d+ FAIL (.*)/, FAIL_COLOR, ERROR_COLOR)
      }

      if (/\d+:\d+\.\d+ GECKO\(\d+\) JavaScript error: /.test(line)) {
        // " 0:12.37 GECKO(28885) JavaScript error: , line 0: TypeError: can't access dead object"
        const regex = /\d+:\d+\.\d+ GECKO\(\d+\) JavaScript error:\w*(.*)/
        return outputCapture("   JS Error: ", regex, ERROR_COLOR, DIM_COLOR)
      }

      if (/\d+:\d+\.\d+ INFO Console message: \[JavaScript Error:/.test(line)) {
        // " 0:06.42 INFO Console message: [JavaScript Error: "TypeError: can't access property "isOpenIn", panelView is undefined" {file: "resource:///modules/PanelMultiView.jsm" line: 894}]"
        const regex = /\[JavaScript Error: (.*)\]/
        return outputCapture("   JS Error: ", regex, ERROR_COLOR, DIM_COLOR)
      }

      if (/\d+:\d+\.\d+ GECKO\(\d+\) console\.log: /.test(line)) {
        // "0:03.89 GECKO(26343) console.log: Translations: "Loading wasm simd detector worker.""
        const regex = /\d+:\d+\.\d+ GECKO\(\d+\) console\.log: (.*)/
        return outputCapture("   ℒ ", regex, INFO_COLOR, line.includes("!!!") ? DEBUG_COLOR : DIM_COLOR)
      }

      // Stack reporting.
      if (/^[a-zA-Z_].*[a-zA-Z\d_/<]+@.*:\d+:\d+$/.test(line)) {
        // "promise callback*openPopup@resource:///modules/PanelMultiView.jsm:526:55"
        const [, fnName, url, lineRow] = line.match(/^(.*)@(.*?):([0-9:]+)$/);
        this.push(
          DIM_COLOR     + '     - ' + fnName +
          SUMMARY_COLOR + ' @ ' +
          INFO_COLOR    + url +
          DIM_COLOR     + ":" + lineRow +
          RESET_COLOR   + "\n"
        )
        done()
        return;
      }

      done();
      this.push(DIM_COLOR + line + RESET_COLOR + "\n")
    }))
    .pipe(process.stdout)
})()

function color (parts, background = false) {
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
    else s += parseColor(parts[i], background)
  }
  return s
}

function parseColor (rgb, background = false) {
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
  const code = background ? '\x1b[48;5;' : '\x1b[38;5;';
  return code + x256(rgb) + 'm'
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

function splitLine(line, prefixSize) {
  const width = Math.max(1, process.stdout.columns - prefixSize);

  let result = '';
  let startIndex = 0;

  while (startIndex < line.length) {
    result += ' '.repeat(prefixSize);
    result += line.substring(startIndex, startIndex + width);
    result += '\n';
    startIndex += width;
  }

  return result;
}
