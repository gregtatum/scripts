export MOZILLA_TRANSLATIONS_PATH="/Users/greg/dev/translations"

# Pick the latest JDK you can find after sorting it.
# export JAVA_HOME="$(LS -1dr -- $HOME/.mozbuild/jdk/jdk-* | head -n 1)/Contents/Home"
# export ANDROID_SDK_ROOT="$HOME/.mozbuild/android-sdk-macosx"
# Pick the latest NDK you can find after sorting it.
# export ANDROID_NDK_HOME=`ls -1dr -- $HOME/.mozbuild/android-ndk-* | head -n 1`


# ANDROID_STUDIO="/Applications/Android\ Studio.app/Contents/MacOS/studio"
# alias android-studio="$ANDROID_STUDIO"
# if [ ! -d "$JAVA_HOME" ]; then
#   echo "Warning: JAVA_HOME does not exist at $JAVA_HOME"
# fi
# if [ ! -d "$ANDROID_SDK_ROOT" ]; then
#   echo "Warning: ANDROID_SDK_ROOT does not exist at $ANDROID_SDK_ROOT"
# fi
# if [ ! -d "$ANDROID_NDK_HOME" ]; then
#   echo "Warning: ANDROID_NDK_HOME does not exist at $ANDROID_NDK_HOME"
# fi


revs() {
  # List all current things in my review queue
  node ~/scripts/my-reviews/phab "$HOME/dev/gecko" 'PHID-USER-hch2p624jejt4kddoqow'
  # node ~/scripts/my-reviews/github 'unicode-org' 'icu4x' 'gregtatum'
  node ~/scripts/my-reviews/github 'firefox-devtools' 'profiler' 'gregtatum'
  # node ~/scripts/my-reviews/github 'firefox-devtools' 'profiler-server' 'gregtatum'
  # node ~/scripts/my-reviews/github 'mozilla' 'treeherder' 'gregtatum'
  node ~/scripts/my-reviews/github 'projectfluent' 'fluent.js' 'gregtatum'
  node ~/scripts/my-reviews/github 'projectfluent' 'fluent-rs' 'gregtatum'
  node ~/scripts/my-reviews/github 'mozilla' 'firefox-translations-training' 'gregtatum'
  node ~/scripts/my-reviews/github 'mozilla' 'firefox-translations-models' 'gregtatum'
}

export MACH_NOTIFY_MINTIME=0 # Make mach notify every time

if [[ "$OSTYPE" == "darwin"* ]]; then
  alias mach="caffeinate -i ./mach" # caffeinate will keep longer builds alive.
  alias m="caffeinate -i ./mach"
elif [ "$(hostname)" = "greg-lambda" ]; then
  # Customize here.
else
  # ignore caffeinate for the desktop machine.
  alias mach="./mach"
  builtin cd ~/dev
fi
alias mb="mach build"
alias mbb="mach build binaries"
alias mbf="mach build faster"
alias mc="mach clobber"
alias mcb="mc && mb"
# MOZ_QUIET will produce fewer logs, but some leaktests may fail that process
# the stdout.
alias mt="clear; MOZ_QUIET=1 mach test"
_echoprompt() {
  red='\033[0;31m'
  clear='\033[0m'
  echo -n -e "${red}➤${clear} "
}
mochii() {
  clear
  _echoprompt
  echo "mochii $*"
  echo ""
  MOZ_QUIET=1 ./mach mochitest --setpref=remote.log.level=Error --max-timeouts 1000 --timeout 10000 --log-mach-verbose $*
}
mochi() {
  clear
  _echoprompt

  # Echo out the command in a readable format.
  echo "mochi \\"
  last_index=$(($# - 1))
  index=0

  for arg in "$@"; do
      if [ "$index" -eq "$last_index" ]; then
          echo "    $arg"
      else
          echo "    $arg \\"
      fi
      index=$((index + 1))
  done

  # MOZ_QUIET=1 ./mach mochitest --max-timeouts 1000 --timeout 10000 --log-mach-verbose $* | node ~/scripts/mochitest-formatter
  MOZ_QUIET=1 ./mach mochitest --headless --setpref=remote.log.level=Error --log-mach-verbose $* | node ~/scripts/mochitest-formatter
  # MOZ_QUIET=1 ./mach mochitest --setpref=remote.log.level=Error --log-focused=- $*
}
xpc() {
  clear
  _echoprompt
  echo "./mach xpcshell-test $*"
  echo ""
  MOZ_QUIET=1 ./mach xpcshell-test $*
}

alias mr="mach run"
alias mbfr="mbf && mr"
alias mbr="mb && mr"
alias mlint="mach lint -wo --fix"
alias meslint="mach lint --linter eslint"
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

mr-contentcache() {
  echo "Open: chrome://browser/content/contentcache/contentcache.html"
  MOZ_ALLOW_DOWNGRADE=1 \
  MOZ_QUIET=1 \
  mach run \
    --profile ~/firefox-profile/contentcache
}

treeherder-log() {
  curl -s --compressed $1 | node ~/scripts/mochitest-formatter/from-treeherder-log.js
}

treeherder-compare() {
  ~/scripts/tree-compare/index.js $@
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

test-translations() {
  mochi \
    $(find toolkit/components/translations/tests -type f -name "browser_*.js") \
    $(find browser/components/translations/tests -type f -name "browser_*.js" \
      ! -path "browser/components/translations/tests/browser/browser_translations_perf_*" \
      ! -path "browser/components/translations/tests/browser/browser_translations_e2e_*" \
      ! -path "browser/components/translations/tests/browser/browser_translations_select_*" \
    )
}

test-translations-full() {
  mochi \
    $(find toolkit/components/translations/tests -type f -name "browser_*.js") \
    $(find browser/components/translations/tests -type f -name "browser_*.js" \
      ! -path "browser/components/translations/tests/browser/browser_translations_perf_*" \
      ! -path "browser/components/translations/tests/browser/browser_translations_e2e_*" \
    ) \
    $(find toolkit/components/ml/tests -type f -name "browser_*.js" \
      ! -path toolkit/components/ml/tests/browser/browser_ml_end_to_end.js \
    )
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

mr-cc() {
  echo "I broke this, copy over the places db and the content cache db to a new profile."
  echo "Open: chrome://browser/content/contentcache/contentcache.html";
  echo "Using profile ~/firefox-profile/content-cache"
  echo ""

  ./mach run \
    --profile ~/firefox-profile/content-cache \
    -- \
    --new-tab https://en.wikipedia.org/wiki/Cat
}

mr-cc-temp() {
  ./mach run \
    --temp-profile \
    `# General preferences` \
    --setpref "browser.warnOnQuitShortcut=false" \
    --setpref "datareporting.policy.dataSubmissionPolicyBypassNotification=true" \
    --setpref "devtools.toolbox.host=right" \
    --setpref "devtools.toolbox.sidebar.width=500" \
    --setpref "devtools.theme.show-auto-theme-info=false" \
    `# Enable content caching:` \
    --setpref "browser.contentCache.enabled=true" \
    --setpref "browser.contentCache.logLevel=All" \
    -- \
    --new-tab https://en.wikipedia.org/wiki/Dog
}

mr-fxt() {
  PROFILE=~/firefox-profile/translations
  echo "Using profile $PROFILE"
  echo ""

  ./mach run \
    --profile $PROFILE \
    -- \
    `#--new-tab about:translations` \
    `#--new-tab https://elpais.com/ciencia` \
    `#--new-tab about:preferences` \
    $*
}

mr-verify() {
  ./mach run \
    --temp-profile \
    `# General prefs:` \
    --setpref 'browser.warnOnQuitShortcut=false' \
    `# Enable logging:` \
    --setpref 'browser.translations.logLevel=All' \
    `# Auto-translate spanish:` \
    --setpref 'browser.translations.alwaysTranslateLanguages=es' \
    `# Load a site for translations` \
    --new-tab https://elpais.com/ciencia \
    `# Use the preview bucket:` \
    `# Keep up to date with: https://github.com/mozilla-extensions/remote-settings-devtools/blob/master/extension/experiments/remotesettings/api.js:` \
    --setpref "services.settings.preview_enabled=true"
}

mr-verify2() {
  ./mach run \
    --temp-profile \
    `# General prefs:` \
    --setpref 'browser.warnOnQuitShortcut=false' \
    `# Enable logging:` \
    --setpref 'browser.translations.logLevel=Info' \
    `# Auto-translate spanish:` \
    --setpref 'browser.translations.alwaysTranslateLanguages=es' \
    `# Load a site for translations` \
    --new-tab https://elpais.com/ciencia
}

mr-ml() {
  PROFILE=~/firefox-profile/ml
  echo "Using profile $PROFILE"
  echo ""

  ./mach run \
    --profile $PROFILE \
    -- \
    `#--new-tab https://gregtatum.com` \
    $*
}

try-mochi() {
  mach try fuzzy \
    --push-to-lando \
    --query "'test-linux1804-64-qr/debug-mochitest-browser-chrome-spi-nw"
}

try-translations() {
  mach try fuzzy \
    --full --push-to-lando \
    --query "'test-linux1804-64-qr 'mochitest-browser-chrome-spi-nw" \
    --query "'x86_64-qr/opt-geckoview-junit-fis | 'x86_64-qr/debug-geckoview-junit-fis gv-junit-fis"
}

clean-logs() {
  # 0:05.09 INFO Entering test bound test_translations_engine_destroy_pending
  # ^^^^^^^^
  sed -i .bak -E 's/ ?[0-9]:[0-9]+\.[0-9]+ //g' $*

  # 0:05.41 GECKO(42355) console.log: Translations: "Mocking RemoteSettings for the translations engine."
  #         ^^^^^^^^^^^^
  sed -i .bak -E 's/GECKO\([0-9]+\)/REPLACE/g' $*

  # 0:05.41 GECKO(42355) console.log: Translations: "Mocking RemoteSettings for the translations engine."
  #         ^^^^^^^^^^^^
  sed -i .bak -E 's/GECKO\([0-9]+\)/REPLACE/g' $*

  #  Remote language models loaded in 0.001 seconds."
  #                                   ^^^^^^^^^^^^^
  sed -i .bak -E 's/[0-9]+\.[0-9]+ seconds/NNN seconds/g' $*

  cat $*
}

fxt-test() {
  PYTHONPATH=/Users/greg/dev/fxt-training poetry run pytest -vv -W ignore $*
}
