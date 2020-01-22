// @flow
const Octokit = require("@octokit/rest");
const octokit = new Octokit();
const color = require('cli-color')

/*::

type Repo = {
  id: 70807123,
  node_id: 'MDEwOlJlcG9zaXRvcnk3MDgwNzEyMw==',
  name: 'perf.html',
  full_name: 'gregtatum/perf.html',
  private: false,
  owner: [Object],
  html_url: 'https://github.com/gregtatum/perf.html',
  description: 'perf.html fork',
  fork: true,
  url: 'https://api.github.com/repos/gregtatum/perf.html',
  forks_url: 'https://api.github.com/repos/gregtatum/perf.html/forks',
  keys_url: 'https://api.github.com/repos/gregtatum/perf.html/keys{/key_id}',
  collaborators_url: 'https://api.github.com/repos/gregtatum/perf.html/collaborators{/collaborator}',
  teams_url: 'https://api.github.com/repos/gregtatum/perf.html/teams',
  hooks_url: 'https://api.github.com/repos/gregtatum/perf.html/hooks',
  issue_events_url: 'https://api.github.com/repos/gregtatum/perf.html/issues/events{/number}',
  events_url: 'https://api.github.com/repos/gregtatum/perf.html/events',
  assignees_url: 'https://api.github.com/repos/gregtatum/perf.html/assignees{/user}',
  branches_url: 'https://api.github.com/repos/gregtatum/perf.html/branches{/branch}',
  tags_url: 'https://api.github.com/repos/gregtatum/perf.html/tags',
  blobs_url: 'https://api.github.com/repos/gregtatum/perf.html/git/blobs{/sha}',
  git_tags_url: 'https://api.github.com/repos/gregtatum/perf.html/git/tags{/sha}',
  git_refs_url: 'https://api.github.com/repos/gregtatum/perf.html/git/refs{/sha}',
  trees_url: 'https://api.github.com/repos/gregtatum/perf.html/git/trees{/sha}',
  statuses_url: 'https://api.github.com/repos/gregtatum/perf.html/statuses/{sha}',
  languages_url: 'https://api.github.com/repos/gregtatum/perf.html/languages',
  stargazers_url: 'https://api.github.com/repos/gregtatum/perf.html/stargazers',
  contributors_url: 'https://api.github.com/repos/gregtatum/perf.html/contributors',
  subscribers_url: 'https://api.github.com/repos/gregtatum/perf.html/subscribers',
  subscription_url: 'https://api.github.com/repos/gregtatum/perf.html/subscription',
  commits_url: 'https://api.github.com/repos/gregtatum/perf.html/commits{/sha}',
  git_commits_url: 'https://api.github.com/repos/gregtatum/perf.html/git/commits{/sha}',
  comments_url: 'https://api.github.com/repos/gregtatum/perf.html/comments{/number}',
  issue_comment_url: 'https://api.github.com/repos/gregtatum/perf.html/issues/comments{/number}',
  contents_url: 'https://api.github.com/repos/gregtatum/perf.html/contents/{+path}',
  compare_url: 'https://api.github.com/repos/gregtatum/perf.html/compare/{base}...{head}',
  merges_url: 'https://api.github.com/repos/gregtatum/perf.html/merges',
  archive_url: 'https://api.github.com/repos/gregtatum/perf.html/{archive_format}{/ref}',
  downloads_url: 'https://api.github.com/repos/gregtatum/perf.html/downloads',
  issues_url: 'https://api.github.com/repos/gregtatum/perf.html/issues{/number}',
  pulls_url: 'https://api.github.com/repos/gregtatum/perf.html/pulls{/number}',
  milestones_url: 'https://api.github.com/repos/gregtatum/perf.html/milestones{/number}',
  notifications_url: 'https://api.github.com/repos/gregtatum/perf.html/notifications{?since,all,participating}',
  labels_url: 'https://api.github.com/repos/gregtatum/perf.html/labels{/name}',
  releases_url: 'https://api.github.com/repos/gregtatum/perf.html/releases{/id}',
  deployments_url: 'https://api.github.com/repos/gregtatum/perf.html/deployments',
  created_at: '2016-10-13T13:04:07Z',
  updated_at: '2017-04-19T18:52:29Z',
  pushed_at: '2020-01-21T21:37:52Z',
  git_url: 'git://github.com/gregtatum/perf.html.git',
  ssh_url: 'git@github.com:gregtatum/perf.html.git',
  clone_url: 'https://github.com/gregtatum/perf.html.git',
  svn_url: 'https://github.com/gregtatum/perf.html',
  homepage: '',
  size: 25535,
  stargazers_count: 0,
  watchers_count: 0,
  language: 'JavaScript',
  has_issues: false,
  has_projects: true,
  has_downloads: true,
  has_wiki: true,
  has_pages: false,
  forks_count: 0,
  mirror_url: null,
  archived: false,
  disabled: false,
  open_issues_count: 0,
  license: null,
  forks: 0,
  open_issues: 0,
  watchers: 0,
  default_branch: 'cleopatra-react'
};

type User = {
  login: 'gregtatum',
  id: 1588648,
  node_id: 'MDQ6VXNlcjE1ODg2NDg=',
  avatar_url: 'https://avatars3.githubusercontent.com/u/1588648?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/gregtatum',
  html_url: 'https://github.com/gregtatum',
  followers_url: 'https://api.github.com/users/gregtatum/followers',
  following_url: 'https://api.github.com/users/gregtatum/following{/other_user}',
  gists_url: 'https://api.github.com/users/gregtatum/gists{/gist_id}',
  starred_url: 'https://api.github.com/users/gregtatum/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/gregtatum/subscriptions',
  organizations_url: 'https://api.github.com/users/gregtatum/orgs',
  repos_url: 'https://api.github.com/users/gregtatum/repos',
  events_url: 'https://api.github.com/users/gregtatum/events{/privacy}',
  received_events_url: 'https://api.github.com/users/gregtatum/received_events',
  type: 'User',
  site_admin: false
};

type PR = {
  url: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372',
  id: 365534683,
  node_id: 'MDExOlB1bGxSZXF1ZXN0MzY1NTM0Njgz',
  html_url: 'https://github.com/firefox-devtools/profiler/pull/2372',
  diff_url: 'https://github.com/firefox-devtools/profiler/pull/2372.diff',
  patch_url: 'https://github.com/firefox-devtools/profiler/pull/2372.patch',
  issue_url: 'https://api.github.com/repos/firefox-devtools/profiler/issues/2372',
  number: 2372,
  state: 'open',
  locked: false,
  title: 'Deallocated memory',
  user: User,
  // The body of the PR.
  body: string,
  created_at: '2020-01-21T21:52:31Z',
  updated_at: '2020-01-22T19:47:33Z',
  closed_at: null,
  merged_at: null,
  merge_commit_sha: '900a682ebedb6868b4e1112aac0cde896a38087c',
  assignee: null,
  assignees: [],
  requested_reviewers: Array<User>,
  requested_teams: [],
  labels: [],
  milestone: null,
  commits_url: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372/commits',
  review_comments_url: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372/comments',
  review_comment_url: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/comments{/number}',
  comments_url: 'https://api.github.com/repos/firefox-devtools/profiler/issues/2372/comments',
  statuses_url: 'https://api.github.com/repos/firefox-devtools/profiler/statuses/109bc7f016aeeb2bfa16274532c76602fe1c6fd9',
  head: {
    label: 'gregtatum:deallocated-memory',
    ref: 'deallocated-memory',
    sha: '109bc7f016aeeb2bfa16274532c76602fe1c6fd9',
    user: User,
    repo: Repo,
  },
  base: {
    label: 'firefox-devtools:master',
    ref: 'master',
    sha: 'e65c2b5c44a3ee7426b5f3df7aa678f507a82047',
    user: User,
    repo: Repo,
  },
  _links: {
    self: { href: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372' },
    html: { href: 'https://github.com/firefox-devtools/profiler/pull/2372' },
    issue: { href: 'https://api.github.com/repos/firefox-devtools/profiler/issues/2372' },
    comments: { href: 'https://api.github.com/repos/firefox-devtools/profiler/issues/2372/comments' },
    review_comments: { href: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372/comments' },
    review_comment: { href: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/comments{/number}' },
    commits: { href: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2372/commits' },
    statuses: { href: 'https://api.github.com/repos/firefox-devtools/profiler/statuses/109bc7f016aeeb2bfa16274532c76602fe1c6fd9' }
  },
  author_association: 'MEMBER'
}

type PullsResponse = {
  'status': any,
  'url': any,
  'headers': any,
  'data': PR[],
}

type Review = {|
  id: 333305802,
  node_id: 'MDE3OlB1bGxSZXF1ZXN0UmV2aWV3MzMzMzA1ODAy',
  user: User,
  body: string,
  state: 'APPROVED',
  html_url: 'https://github.com/firefox-devtools/profiler/pull/2334#pullrequestreview-333305802',
  pull_request_url: 'https://api.github.com/repos/firefox-devtools/profiler/pulls/2334',
  author_association: 'CONTRIBUTOR',
  _links: { html: Object, pull_request: Object },
  submitted_at: '2019-12-18T18:07:16Z',
  commit_id: 'e2780bd71c9ec15640b0ede22062e89b7ce5a6b7'
|};

type ReviewResponse = {|
  status: any,
  url: any,
  headers: any,
  data: Review[]
|}
*/

const me = "gregtatum";
const owner = "firefox-devtools";
const repo = "profiler";

async function run () {
  const [owner, repo, me] = process.argv.slice(2);

  if (!owner || !repo || !me) {
    owner, repo, me
    console.warn('This command requires 3 arguments, The GitHub owner, repo, and user respectively.');
    console.warn(`For instance: node github.js 'firefox-devtools' 'profiler' 'gregtatum'`);
    process.exit(1);
  }

  const response /* :PullsResponse */ = await octokit.pulls.list({
    owner,
    repo
  });
  const openPrs = response.data.filter(({title}) =>
    !title.includes("[wip]") && !title.includes("(wip)") &&
    !title.includes("[deploy-preview]") && !title.includes("(deploy-preview)") &&
    !title.includes("[deploy preview]") && !title.includes("(deploy preview)")
  );

  const prsToHandle = []
  const myPrs = []
  for (const pr of openPrs) {
    if (pr.user.login === me) {
      myPrs.push(pr);
    }
    for (const reviewer of pr.requested_reviewers) {
      if (reviewer.login === me) {
        prsToHandle.push(pr);
        break;;
      }
    }
  }

  if (prsToHandle.length > 0) {
    printHeader("To Review");
    for (const pr of prsToHandle) {
      await printPR(pr);
    }
  }

  if (myPrs.length > 0) {
    printHeader("My PRs");
    for (const pr of myPrs) {
      await printPR(pr);
    }
  }
}

async function printPR(pr/* :PR */) {

  console.log('')
  const gray = color.xterm(8);
  console.log(color.yellow(`PR #${pr.number}: `) +  color.whiteBright(pr.title))
  console.log(gray('     url: ') + color.blue.underline(pr.html_url))
  console.log(gray('  author: ') + pr.user.login);

  const reviewResponse/* :ReviewResponse */ = await octokit.pulls.listReviews({
    owner,
    repo,
    pull_number: pr.number
  })

  for (const review of reviewResponse.data) {
    let state = review.state;
    switch (review.state) {
      case 'APPROVED':
        state = color.green(state);
        break;
      case 'COMMENTED':
        state = color.cyan(state);
        // TODO
      default:
    }
    console.log(gray('reviewer: ') + state + ' ' + review.user.login);
  }

  // Print out the requested reviewers.
  for (const reviewer of pr.requested_reviewers) {
    console.log(gray('reviewer: ') + color.magenta("REQUESTED ") + reviewer.login);
  }


}

run().catch(error => console.error(error));

function printHeader (text/* :string */) {
  console.log(color.cyan(`\n======= GitHub ${text} =====================================================`));
}
