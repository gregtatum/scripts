const co = require('co')
const path = require('path')
const c = require('cli-color')

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

  let slug = bugToSlug(bug)

  // Ask for SLUG
  slug = (yield askFor(slug, 'slug           ')) || slug

  let branch = `${slug}/${bugId}`
  let worktreePath = path.resolve(WORKTREES_PATH, `${slug}-${bugId}`)

  // Ask to create an initial commit, only don't if the answer starts with "n"
  let initialCommit = !(yield askFor('y/n', 'initial commit?')).match(/^n/i)

  // Ask for SUMMARY
  let summary, commit, reviewer
  if (initialCommit) {
    summary = yield askFor('keep default', 'summary        ') || bug.summary
    commit = `Bug ${bugId} - ${summary}`
    reviewer = yield askFor('none', 'reviewer       ')
    if(reviewer) {
      commit += ` r=${reviewer}`
    }
  }

  // Create the branch
  yield run(`git branch ${branch} ${BASE_BRANCH}`,
            {cwd: GECKO_PATH})
  // Create the work-dir
  yield run(`git new-workdir ${GECKO_PATH} ${worktreePath} ${branch}`,
            {cwd: GECKO_PATH})
  // Create the initial commit
  if(initialCommit) {
    yield run(`git commit -m "${escape(commit)}" --allow-empty`,
              {cwd: worktreePath})
    yield run(`git branch --set-upstream-to=${TRACK_UPSTREAM}`,
              {cwd: worktreePath})
  }

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
