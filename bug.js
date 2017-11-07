/**
 * Command line tool to open up a bug in bugzilla based on a branch name of the following
 * format: bug-name-1289425 where 1289425 is the bug ID.
 */
function exec(cmd, cb) {
  require('child_process').exec(cmd, function(err, stdout, stderr) {
    if(err) throw new Error(stderr)
    if(cb) cb(stdout)
  })
}

// Try git first.
exec("git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'", function(branch) {
  var [,bugId] = branch.match(/\/(\d*)/) || []

  if(bugId) {
    // Hey, we found the bug, let's go!
    openBug(bugId)
  } else {

    // Try mercurial now.
    exec("hg log -l 1", function(log) {
      var [, bugId] = log.split('\n')[4].match(/Bug (\d+)/) || []
      if (bugId) {
        // Yup, the bug was found!
        openBug(bugId)
      } else {
        console.log('Could not find bug number.')
      }
    })

  }
})

function openBug (bugId) {
  var cmd = `open 'https://bugzilla.mozilla.org/show_bug.cgi?id=${bugId}'`
  console.log(cmd)
  exec(cmd)
}
