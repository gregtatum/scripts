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

exec("git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/'", function(branch) {
  var [,bugId] = branch.match(/\/(\d*)/) || []
  if(bugId) {
    var cmd = `open 'https://bugzilla.mozilla.org/show_bug.cgi?id=${bugId}'`
    console.log(cmd)
    exec(cmd)
  } else {
    console.log('Could not find bug id in ' + branch)
  }
})
