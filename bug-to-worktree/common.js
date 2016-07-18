const fetch = require('node-fetch')
const toSlug = require('slug')
const exec = require('child_process').exec
const path = require('path')
const c = require('cli-color')

const BASE_BRANCH = "default-central"
const TRACK_UPSTREAM = "central/branches/default/tip"
const DEV_PATH = "/Users/gregorytatum/dev"
const GECKO_PATH = path.resolve(DEV_PATH, "gecko")
const WORKTREES_PATH = path.resolve(DEV_PATH, "worktrees")

function run(cmd, options = {}) {
  console.log(`${c.xterm(123)('   running')}: ${cmd} `)
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error running: ${cmd}`)
        console.log(stderr)
        return reject(error)
      }
      console.log(stdout)
      resolve()
    })
  })
}

function getAndSanitizeBugId() {
  var bugId = parseInt(process.argv[2], 10);
  if(!(bugId > 0)) {
    console.error('Provide a valid Bugzilla bug ID, e.g. `bug-to-worktree 1234`')
    process.exit(1)
  }
  return bugId
}

function fetchBug(bugId) {
  return fetch(`https://bugzilla.mozilla.org/rest/bug/${bugId}`)
  .then(response => response.json())
  .then(json => {
    if(json.error) {
      return Promise.reject(json.message)
    }
    if(json.bugs.length === 0) {
      return Promise.reject('No bug was found')
    }
    return json.bugs[0]
  })
}

function askFor(value, key) {
  return new Promise((resolve) => {
    process.stdout.write(`  ${c.xterm(123)(key)} ➤  (${c.xterm(241)(value)}) `, 40)
    function handleResponse(text = "") {
      process.stdin.removeListener('data', handleResponse)
      resolve(text.trim())
    }
    process.stdin.on('data', handleResponse);
  })
}

function bugToSlug(bug) {
  var component = (bug.component.match(/^Developer Tools: (.+)/) || [])[1]
  var summary = bug.summary.split(" ").slice(0,2).join(" ")

  if(component === "Performance Tools (Profiler/Timeline)") {
    component = "perf"
  }

  return toSlug([component, summary].join(' ')).toLowerCase()
}

function escape(string) {
  return string.replace(/"/g, `\\"`)
}

module.exports = {
  run,
  getAndSanitizeBugId,
  fetchBug,
  askFor,
  bugToSlug,
  escape,
  BASE_BRANCH,
  TRACK_UPSTREAM,
  DEV_PATH,
  GECKO_PATH,
  WORKTREES_PATH
}
