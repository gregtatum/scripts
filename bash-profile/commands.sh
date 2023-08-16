if [[ "$OSTYPE" == "darwin"* ]]; then
  alias ls="gls -ahlX --color --group-directories-first"
  alias think="ssh -i $THINK_STATION_KEY $THINK_STATION_IP"
else
  alias ls="ls -ahlX --color"
  alias think="Already on the 🐧"
  alias code="~/scripts/remote-code.sh"
fi

# Echo out something as if it was a prompt command.
echoprompt() {
  echo -e "\n\033[1;31m➤\033[0m $*\n"
}

alias ltst="ls -t | head -15"
alias clear="echo -ne '\033]50;ClearScrollback\a'"
alias showhidden="bash ~/hidden-show.sh"
alias hidehidden="bash ~/hidden-hide.sh"
alias myip="ifconfig | grep 192"
alias flushcache="sudo killall -HUP mDNSResponder"
alias bug="node ~/scripts/bug.js"
alias co-bug="node ~/scripts/co-bug.js"
alias review="node ~/scripts/review.js"
alias bz-file="node ~/scripts/bz-file"
alias gist-patch="git diff | gist -o -t patch"
alias ssh-perf="ssh-add ~/.ssh/perf-html; ssh cleopatra@perf-html.io"
alias jest-debug="echo 'Open chrome://inspect'; node --inspect-brk node_modules/.bin/jest --runInBand"
alias brew-upgrade="brew update && brew upgrade"
alias kill-flow="pkill -f flow-bin"
alias kill-audio="sudo killall coreaudiod"
alias pngquant="pngquant --ext .tiny.png"
alias ccat="pygmentize"
alias serve="http-server"
alias pserve="php -S localhost:8000 router.php"
alias edit-hosts="sudo vim /private/etc/hosts"
alias edit-profile="code ~/scripts"
alias edit-cron="env EDITOR=vim crontab -e"
alias nr="npm run"
alias jest="clear && jest"
alias ytmp4="youtube-dl -f mp4"
alias ytmp3="youtube-dl -x --audio-format mp3"
alias folder-size="du -d 1 -h ."
alias cargo-test-debug="node ~/scripts/rust-scripts/cargo-test-debug.js"
find() {
  FIND \
  $* \
  -not -path '*/.git/*' \
  -not -path '*/.hg/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/target/*' \
  -not -path '*/obj-ff-artifact/*' \
  -not -path '*/obj-ff-debug/*' \
  -not -path '*/obj-ff-release/*' \
  -not -path '*/thidparty/*'
}
alias search="find . \
  -not -path '*/.git/*' \
  -not -path '*/.hg/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/target/*' \
  -not -path '*/obj-ff-artifact/*' \
  -not -path '*/obj-ff-debug/*' \
  -not -path '*/obj-ff-release/*' \
  -not -path '*/thidparty/*' \
  -iname"
loop() {
  while clear && $@; do :; done
}
weather() {
  curl -4 http://wttr.in/${1:-Tulsa}
}
cd() {
  builtin cd "$*" && ls
}
alias ..="cd .."
alias ...="builtin cd .. && cd .."
alias ....="builtin cd .. && builtin cd .. && cd .."
alias .....="builtin cd .. && builtin cd .. && builtin cd .. && cd .."
alias ......="builtin cd .. && builtin cd .. && builtin cd .. && builtin cd .. && cd .."
fls() {
  ls | grep $1
}
findinfiles() {
	#findinfiles "text" "*.php"
	grep -rnwl . -e $1 --include=$2
}

__tree=$(which tree)
alias _tree="$__tree -L 2 -C -I 'node_modules|.git|.hg|target'"
# Display a shallow tree of files. Pass an argument to match a specific file
tree() {
  if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
    _tree $@
  else
    _tree --matchdirs --prune -P $1 ${@:2}
  fi
}
alias _tree-size="_tree -s -h --du -i"
tree-size() {
  if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
    _tree-size $@
  else
    _tree-size --matchdirs --prune -P $1 ${@:2}
  fi
}
alias _files="_tree -s -h --du -i -f"
files() {
  if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
    _files $@
  else
    _files --matchdirs --prune -P $1 ${@:2}
  fi
}


#--------------------------------------------------------------------
# Shortcuts
me() {
  cd ~/me/$1
}
compdef '_files -W ~/me' me

lem() {
	cd ~/lem/$1
}
compdef '_files -W ~/lem' lem

dev() {
	cd ~/dev/$1
}
compdef '_files -W ~/dev' dev
mme() {
  mkdir ~/me/$1
	cd ~/me/$1
}
mlem() {
  mkdir ~/lem/$1
	cd ~/lem/$1
}
mdev() {
  mkdir ~/dev/$1
	cd ~/dev/$1
}

function mtest {
  GLADOS_FILES=(/Users/greg/Dropbox/Resources/Sounds/Glados/*)
  afplay ${GLADOS_FILES[RANDOM % ${#GLADOS_FILES[@]}]};
}

function mdark {
  find /Users/greg/Dropbox/Resources/Sounds/Darkness/* \
    | sort --random-sort \
    | head -n 1 \
    | xargs afplay
}
