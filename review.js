/**
 * Command line tool open up a commit in Phabricactors differential
 */
function exec(cmd, cb) {
  console.log('> ' + cmd)
  require('child_process').exec(cmd, function(err, stdout, stderr) {
    if(err) throw new Error(stderr)
    if(cb) cb(stdout)
  })
}

{
  let rev = process.argv[2];
  if (!rev) {
    exec('hg id', function(text) {
      const match = text.match(/^[0-9a-f]+/)
      if (!match) {
        throw new Error('The command "hg id" did not work');
      }
      const rev = match[0];
      if (!rev) {
        console.error(text);
        throw new Error('Could not extract the rev from "hg id"')
      }
      openUrl(rev);
    })
  } else if (!rev.match(/^[0-9a-f]+$/)) {
    console.error(`An invalid rev number was received "${rev}"`);
    process.exit(1);
  } else {
    openUrl(rev);
  }
}

function openUrl (rev) {
  exec(`hg log -r ${rev} -v`, function(text) {
    const match = text.match(/Differential Revision: (https:\/\/.*)/);
    if (!match) {
      console.error(text);
      console.error(`Unable to find a differential review for revision "${rev}".`);
      process.exit(1);
    } else {
      const url = match[1];
      console.log(text);
      exec(`open '${url}'`);
    }
  })
}
