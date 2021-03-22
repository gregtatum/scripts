alias ls="gls -ahlX --color --group-directories-first"
alias ltst="ls -t | head -15"
alias clear="echo -ne '\033]50;ClearScrollback\a'"
alias showhidden="bash ~/hidden-show.sh"
alias hidehidden="bash ~/hidden-hide.sh"
alias myip="ifconfig | grep 192"
alias flushcache="sudo killall -HUP mDNSResponder"
alias bug="node ~/scripts/bug.js"
alias co-bug="node ~/scripts/co-bug.js"
alias review="node ~/scripts/review.js"
alias bugs="open 'https://fitzgen.github.io/bugzilla-todos/'"
alias bz-file="node ~/scripts/bz-file"
alias gist-patch="git diff | gist -o -t patch"
alias ssh-perf="ssh-add ~/.ssh/perf-html; ssh cleopatra@perf-html.io"
alias jest-debug="echo 'Open chrome://inspect'; node --inspect-brk node_modules/.bin/jest --runInBand"
alias brew-upgrade="brew update && brew upgrade"
alias kill-flow="pkill -f flow-bin"
alias kill-audio="sudo killall coreaudiod"
alias pngquant="pngquant --ext .tiny.png"
alias serve="echo 'http://localhost:8000'; python3 -m http.server"
alias pserve="php -S localhost:8000 router.php"
alias edit-hosts="code /private/etc/hosts"
alias edit-profile="code ~/scripts/bash-profile"
alias edit-cron="env EDITOR=vim crontab -e"
alias ccat="/Users/greg/Library/Python/3.7/bin/pygmentize -O style=monokai -f console256 -g"
alias nr="npm run"
alias jest="clear && jest"
alias ytdl="youtube-dl -f mp4"
alias folder-size="du -d 1 -h ."
alias cargo-test-debug="node ~/scripts/rust-scripts/cargo-test-debug.js"
alias find="find . \
  -not -path '*/.git/*' \
  -not -path '*/.hg/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/target/*' \
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

#--------------------------------------------------------------------
# Shortcuts
me() {
  if [ $1 == "gl-engine" ] ; then
    cd ~/me/gl-engine/node_modules/gl-engine
  else
  	cd ~/me/$1
  fi
}
_me() {
  local cur
  if [ $COMP_CWORD -eq 1 ] ; then
    cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -f /Users/greg/me/$cur | cut -d"/" -f5 ) )
  fi
}
complete -o filenames -F _me me
#----------------------------
lem() {
	cd ~/lem/$1
}
_lem() {
  local cur
  if [ $COMP_CWORD -eq 1 ] ; then
    cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -f /Users/greg/lem/$cur | cut -d"/" -f5 ) )
  fi
}
complete -o filenames -F _lem lem
#----------------------------
dev() {
	cd ~/dev/$1
}
_dev() {
  local cur
  if [ $COMP_CWORD -eq 1 ] ; then
    cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -f /Users/greg/dev/$cur | cut -d"/" -f5 ) )
  fi
}
complete -o filenames -F _dev dev
#----------------------------
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
