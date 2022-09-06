revs() {
  # List all current things in my review queue
  node ~/scripts/my-reviews/phab "$HOME/dev/gecko" 'PHID-USER-hch2p624jejt4kddoqow'
  node ~/scripts/my-reviews/github 'unicode-org' 'icu4x' 'gregtatum'
  node ~/scripts/my-reviews/github 'firefox-devtools' 'profiler' 'gregtatum'
  node ~/scripts/my-reviews/github 'firefox-devtools' 'profiler-server' 'gregtatum'
  # node ~/scripts/my-reviews/github 'mozilla' 'treeherder' 'gregtatum'
  node ~/scripts/my-reviews/github 'projectfluent' 'fluent.js' 'gregtatum'
}

export MACH_NOTIFY_MINTIME=0 # Make mach notify every time

if [[ "$OSTYPE" == "darwin"* ]]; then
  alias mach="caffeinate -i ./mach" # caffeinate will keep longer builds alive.
else
  # ignore caffeinate for the desktop machine.
  alias mach="./mach"
  builtin cd ~/dev/gecko
fi
alias mb="mach build"
alias mbb="mach build binaries"
alias mbf="mach build faster"
alias mc="mach clobber"
alias mcb="mc && mb"
# MOZ_QUIET will produce fewer logs, but some leaktests may fail that process
# the stdout.
alias mt="MOZ_QUIET=1 mach test"
alias mochi="MOZ_QUIET=1 ./mach mochitest"
alias xpc="MOZ_QUIET=1 mach xpcshell-test"
alias mtd="MOZ_QUIET=1 mach mochitest --jsdebugger"
alias mbfr="mbf && mr"
alias mbr="mb && mr"
alias mlint="mach lint -wo --fix"
alias mboot="mach --no-interactive bootstrap --application-choice 'Firefox for Desktop'"
alias mdb="mach build-backend -b CompileDB"
alias msubmit="mach lint --warnings --outgoing && moz-phab submit"
alias mide="mach ide vscode"
alias build-release="change_mozconfig release"
alias build-art-release="change_mozconfig artifact-release"
alias build-art-debug="change_mozconfig artifact-debug"
alias build-debug="change_mozconfig debug"
alias build-android="change_mozconfig android"
alias ph="moz-phab"
alias ph-stack="moz-phab submit main HEAD"
change_mozconfig() {
  ln -sf ~/dev/gecko/mozconfig-$1 ~/dev/gecko/mozconfig
  echo "Changed the mozconfig to $1"
}

mpull() {
  if [[ $(git diff --stat) != '' ]]; then
      echo "Current branch is dirty..."
      echo
      git status
      echo
      echo "Please resolve these changes before continuing..."
  else
    git cinnabar fsck
    git fetch --tags hg::tags: tag "*"
    git fetch --all
    git checkout origin/bookmarks/central
  fi
}

mreup() {
  if [[ $(git diff --stat) != '' ]]; then
      echo "Current branch is dirty..."
      echo
      git status
      echo
      echo "Please resolve these changes before continuing..."
  else
    git cinnabar fsck
    git fetch --tags hg::tags: tag "*"
    git fetch --all
    git rebase origin/bookmarks/central
  fi
}

mtx() {
  unbuffer mach test $* | cut -c -$COLUMNS
}

try() {
  echo "DevTools:"
  echo "Targeted: 'test-linux1804-64/ | test-windows10-64/ | test-macosx64/ !shippable xpcshell | mochitest-devtools !-fis- !-sw- !-asan"
  echo ""
  echo "Profiler:"
  echo "'mochitest-devtools-chrome-e10s | 'xpcshell-e10s | 'gtest | 'mochitest-browser-chrome-e10s 'test-linux1804-64/ | 'test-macosx1014-64 | 'test-windows10-64/  !-fis- !-sw- !-qr !shippable"
  echo ""
  echo "Profiler linux:"
  echo "'mochitest-devtools-chrome-e10s | 'xpcshell-e10s | 'gtest | 'mochitest-browser-chrome-e10s 'test-linux1804-64/   !-fis- !-sw- !-qr"
}

alias nightly="/Applications/FirefoxNightly.app/Contents/MacOS/firefox-bin --ProfileManager"

mtf() {
  mtfh --headless "$@"
}
mtfd() {
  mtfh --jsdebugger "$@"
}
mtfh() {
  clear
  mach mochitest "$@" | node ~/scripts/mochitest-formatter/index.js
}
mr() {
  if [ "$(pwd)" == "~/dev/spidermonkey" ]; then
    mach run
    return
  fi

  if [ "$1" == "divs" ]; then
    url='file://~/Desktop/html/divs.html'
  elif [ "$1" == "lines" ]; then
    url='http://gregtatum.com/poems/wandering-lines/3/'
  elif [ "$1" != "" ]; then
    url=$1
  else
    url='about:blank'
    # url='http://localhost:4242'
    # url='about:debugging'
  fi

  rest="${@:2}"

  # MOZ_ALLOW_DOWNGRADE doesn't warn me about profile versions being wrong.
  MOZ_ALLOW_DOWNGRADE=1 MOZ_QUIET=1 mach run \
    --profile ~/firefox-profile/dev2 \
    --url $url $rest
}

mr-history-plus() {
  echo "Open: chrome://browser/content/history-plus/index.html"
  MOZ_ALLOW_DOWNGRADE=1 \
  MOZ_QUIET=1 \
  mach run \
    --profile ~/firefox-profile/history-plus
}

talos-log() {
  curl -s --compressed $1 | node ~/scripts/mochitest-formatter/from-talos-log.js
}

perf-html-blame() {
  git ls-files src/test \
    | grep -v src/types/libdef \
    | grep -v .snap \
    | grep -v .json \
    | grep .js \
    | grep src/test/ \
    | xargs -n1 git blame --line-porcelain HEAD \
    | grep  "^author " \
    | sort \
    | uniq -c \
    | sort -nr
}

alias firefox-release="/Applications/Firefox\ Release.app/Contents/MacOS/firefox -P release-profile"
alias firefox-release-debug="firefox-release --start-debugger-server"
alias firefox-esr="/Applications/Firefox\ ESR.app/Contents/MacOS/firefox -P"
alias firefox-esr-debug="firefox-esr --start-debugger-server"
alias firefox-nightly="/Applications/FirefoxNightly.app/Contents/MacOS/firefox"
alias firefox-nightly-debug="firefox-nightly --start-debugger-server"
alias firefox-beta="/Applications/Beta.app/Contents/MacOS/firefox"
alias firefox-beta-debug="firefox-beta --start-debugger-server"


firefox-nightly-profile() {
  export MOZ_PROFILER_STARTUP=1
  export MOZ_PROFILER_STARTUP_ENTRIES=5000000
  export MOZ_PROFILER_STARTUP_FEATURES="js,stackwalk,threads,leaf,mainthreadio"
  firefox-nightly
}

mozup() {
  # Look to see if central is currently checked out.
  hg log -v -r . | grep -E "^fxtree:\s+central$" &> /dev/null
  if [ $? != 0 ]; then
    hg status
    hg stack
    echo ""
    echo "Please check out central"
    return
  fi

  # This is central
  echo "➤ Pulling the latest"
  echo ""
  hg pull
  if [ $? != 0 ]; then
    echo "Unable to pull the latest, quitting mozup"
    return 1
  fi

  echo ""
  echo "➤ Checking out central"
  echo ""
  hg co central
  if [ $? != 0 ]; then
    echo "Unable to check out central, quitting mozup"
    return 1
  fi

  echo ""
  echo "➤ Here is the latest commit"
  echo ""
  hg stack

  echo ""
  echo "➤ Running mach bootstrap"
  echo ""
  mboot
  if [ $? != 0 ]; then
    echo "There was an issue with mach bootstrap, but keep going."
  fi

  echo ""
  echo "➤ Running mach clobber"
  echo ""
  mach clobber

  echo ""
  echo "➤ Running mach clobber"
  echo ""
  if [ $? != 0 ]; then
    echo "There was an issue with mach clobber, quitting mozup"
  fi

  echo ""
  echo "➤ Running mach build"
  echo ""
  mb
}

test-profiler() {
  xpc tools/profiler/tests && \
  obj-ff-release/dist/bin/TestBaseProfiler && \
  mach gtest *Profiler.* && \
  mochi tools/profiler/test --headless && \
  echo "✨ Everything passed! ✨"
}

# Mach run live language reloading.
mr-ll() {
  if [[ "$1" == "build" || "$1" == "build-only" ]]; then
    ./mach build faster
    # ./mach npm run bundle --prefix=browser/components/newtab
  fi

  if [[ "$1" != "build-only" ]]; then
    ./mach run \
      --temp-profile \
      `# General preferences` \
      --setpref "browser.warnOnQuitShortcut=false" \
      --setpref "datareporting.policy.dataSubmissionPolicyBypassNotification=true" \
      --setpref "devtools.toolbox.host=right" \
      --setpref "devtools.toolbox.sidebar.width=500" \
      --setpref "devtools.theme.show-auto-theme-info=false" \
      `#These enable about:preferences live language switching:` \
      --setpref "extensions.getAddons.langpacks.url=https://mock-amo-language-tools.glitch.me/?app=firefox&type=language&appversion=%VERSION%" \
      --setpref "intl.multilingual.enabled=true" \
      --setpref "intl.multilingual.downloadEnabled=true" \
      --setpref "intl.multilingual.liveReload=true" \
      --setpref "intl.multilingual.liveReloadBidirectional=true" \
      --setpref "intl.multilingual.aboutWelcome.languageMismatchEnabled=true"
      -- \
      --new-tab about:preferences
  fi
}

# Mach run content caching
mr-cc() {
  echo "Open: chrome://browser/content/history-plus/index.html";

  if [[ "$1" == "fixed" ]]; then
    echo "Using profile obj-ff-dbg/tmp/profile-_ywnd37f"
    ./mach run \
      --profile obj-ff-dbg/tmp/profile-_ywnd37f \
      -- \
      --new-tab https://en.wikipedia.org/wiki/Cat
    return
  fi

  ./mach run \
    --temp-profile \
    `# General preferences` \
    --setpref "browser.warnOnQuitShortcut=false" \
    --setpref "datareporting.policy.dataSubmissionPolicyBypassNotification=true" \
    --setpref "devtools.toolbox.host=right" \
    --setpref "devtools.toolbox.sidebar.width=500" \
    --setpref "devtools.theme.show-auto-theme-info=false" \
    `# Enable content caching:` \
    --setpref "extensions.getAddons.langpacks.url=https://mock-amo-language-tools.glitch.me/?app=firefox&type=language&appversion=%VERSION%" \
    --setpref "browser.contentCache.enabled=true" \
    --setpref "browser.contentCache.logLevel=All" \
    -- \
    --new-tab https://en.wikipedia.org/wiki/Cat
}
