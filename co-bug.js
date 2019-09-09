/**
 * Command line tool to checkout a changeset in mercurial based on a
 * bugzilla bug number.
 */
function exec(cmd, cb) {
  require('child_process').exec(cmd, function(err, stdout, stderr) {
    if(err) throw new Error(stderr)
    if(cb) cb(stdout)
  })
}

const bug = process.argv[2];
if (!bug.match(/^\d+$/)) {
  console.log(`An invalid bug number was received "${bug}"`);
  process.exit(1);
}

// Try mercurial now.
exec(`hg log --keyword ${bug} --limit 1`, function(log) {
  const match = log.match(/^changeset:\s+(\d+):/);
  if (!match) {
    console.log(`Unable to find Bug ${bug} in the changesets.`);
    process.exit(1);
  } else {
    const cmd = `hg checkout ${match[1]}`
    console.log(log);
    console.log('> ' + cmd)
    exec(cmd, function() {
      console.log('> hg stack')
      exec('hg stack', output => {
        console.log(output)
      });
    });
  }
})
