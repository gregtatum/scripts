// @flow
const { exec } = require('child_process')
const color = require('cli-color')

function run(cmd, options = {})/* Promise<string> */ {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        console.log(`Error running: ${cmd}`)
        console.log(stderr)
        return reject(error)
      }
      if (typeof stdout === 'string') {
        resolve(stdout)
      } else {
        reject(new Error("stdout was not a string"));
      }
    })
  })
}

function stringify (data/* :mixed */)/*: string */ {
  const string = JSON.stringify(data);
  if (!string) {
    throw new Error("JSON stringify returned nothing.")
  }
  // Escape the string for bash.
  return string.replace(`'`, `'"'"'`);
}

/*::
type Response<T> = {|
    +error: null,
    +errorMessage: null,
    +response: T,
  |}
  | {|
    +error: string,
    +errorMessage: string,
    +response: null,
  |};

type Cursor<T> = {
  data: T[],
  maps: [],
  query: string, // e.g. { queryKey: 'active' },
  cursor: { limit: number, after: null | mixed, before: null | mixed, order: null | mixed }
}

type Revision = {|
  id: number,
  type: string, // 'DREV',
  phid: string, //'PHID-DREV-walgqlk76cgxybqaz4xz',
  fields: {|
    title: string, // 'Bug 1576555 - doAtLeastOnePeriodicSample() relies on samples being recorded - r?gregtatum',
    authorPHID: 'PHID-USER-6gilzlesrxygczj5xep5',
    status: {
      value: string, // 'needs-review',
      name: string, // 'Needs Review',
      closed: boolean, // false,
      'color.ansi': string // 'magenta'
    },
    repositoryPHID: string, //'PHID-REPO-saax4qdxlbbhahhp2kg5',
    diffPHID: string, // 'PHID-DIFF-qbez3zynh5dko2xtwdzt',
    summary: string, // 'Some tests only care about markers...',
    testPlan: string, //'',
    isDraft: boolean,
    holdAsDraft: boolean,
    dateCreated: number, // 1567753331,
    dateModified: number, // 1567753702,
    policy: {|
      view: string, // 'public',
      edit: string, // 'PHID-PROJ-njo5uuqyyq3oijbkhy55'
    |},
    'bugzilla.bug-id': string // '1576555'
  |},
  attachments: []
|}

type CallConduit = <T>(string, mixed) => Promise<Response<T>>
*/
var callConduit/* :CallConduit */ = async function(
  endpoint,
  data
) {
  const results = await run(`echo '${stringify(data)}' | arc call-conduit ${endpoint}`);
  return JSON.parse(results);
}

function printRevision (revision/* :Revision */ ) {
  const maxStatusLength = 11;
  const statusName = revision.fields.status.name.replace("Needs Review", "Review");
  let status = statusName.padStart(maxStatusLength);
  status = statusName === 'Accepted' ? color.green(status) : color.red(status);
  console.log(`${status} - ${revision.fields.title}`);

  const indent = ''.padStart(maxStatusLength + 2);
  const url = color.blackBright.underline(`https://phabricator.services.mozilla.com/D${revision.id}`);

  console.log(`${indent} ${url}`)
}

function printBug(revision/* :Revision */) {
  const bugId = revision.fields['bugzilla.bug-id'];
  const bugLabel = color.yellow(`Bug ${bugId}`);
  const url = color.blue.underline(`https://bugzilla.mozilla.org/show_bug.cgi?id=${bugId}`);
  console.log(`\n${bugLabel} - ${url}\n`)
}

function printRevisionList(revisions/* :Revision[] */) {
  let prevBug = null;
  for (const revision of revisions) {
    const thisBug = revision.fields['bugzilla.bug-id'];
    if (prevBug !== thisBug) {
      printBug(revision)
    }
    prevBug = thisBug;
    printRevision(revision)
  }
}

function printHeader (text/* :string */) {
  console.log(color.cyan(`\n======= Phabricator ${text} =====================================================`));
}

(async () => {
  const [geckoDir, userId] = process.argv.slice(2);

  if (!geckoDir) {
    console.warn('This command requires the first argument to be the path the gecko directory where arcanist is configured.');
    process.exit(1);
  }
  try {
    process.chdir(geckoDir);
  } catch (error) {
    console.warn(`Unable to change the directory to your gecko repo from path "${geckoDir}"`);
    console.error(error);
    process.exit(1);
  }

  const response/* :Response<Cursor<Revision>> */ =
    await callConduit('differential.revision.search', {
      queryKey: "active",
    });

  if (response.error || response.response === null) {
    throw new Error(response.errorMessage);
  }
  const { data } = response.response;


  data.sort((a, b) =>
    Number(a.fields['bugzilla.bug-id']) - Number(b.fields['bugzilla.bug-id'])
  );

  printHeader('Mine');
  printRevisionList(data.filter(revision => {
    const { title, authorPHID } = revision.fields
    if (userId !== authorPHID) {
      return false;
    }
    if (!title) {
      return true;
    }
    return !title.match(/\bWIP\b/)
  }));

  if (!userId) {
    console.warn(data)
    console.warn("\n\nPlease provide the phid of a user as the first argument to this script. See the data dumped above to find yours.")
  }

  const others = data.filter(revision => (
    userId !== revision.fields.authorPHID
      && revision.fields.status.value === 'needs-review'
  ));
  if (others.length > 0) {
    printHeader('Others');
    printRevisionList(others);
  }
})();
