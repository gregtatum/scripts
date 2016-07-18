const c = require('cli-color')
const path = require('path')
const co = require('co')

const {
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
} = require('./common')

co(function* () {
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  let bugId = getAndSanitizeBugId()

  // Get the basic bug information
  let bug = yield fetchBug(bugId)
  console.log(c.xterm(160)(`\nCreating worktree branch for:`))
  console.log(c.xterm(172)(`Bug ${bugId} - ${bug.summary}`))
  console.log(c.xterm(160)(`----------------------------------------------------------`))

  // Ask for SLUG
  let slug = "rev-" + bugToSlug(bug)
  slug = (yield askFor(slug, 'slug')) || slug

  let branch = `${slug}/${bugId}`
  let worktreePath = path.resolve(WORKTREES_PATH, `${slug}-${bugId}`)

  // Create the branch
  yield run(`git branch ${branch} ${BASE_BRANCH}`, {cwd: GECKO_PATH})
  // Create the work-dir
  yield run(`git new-workdir ${GECKO_PATH} ${worktreePath} ${branch}`, {cwd: GECKO_PATH})

  console.log(c.xterm(123)('The following worktree has been created:'))
  console.log(worktreePath)
}).then(
  () => process.exit(0),
  error => {
    console.error('Something went wrong:\n', error)
    console.error(error.stack)
    process.exit(1)
  }
)
