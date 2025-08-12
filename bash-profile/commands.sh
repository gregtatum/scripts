if [[ "$OSTYPE" == "darwin"* ]]; then
  alias ls="gls -ahlX --color --group-directories-first"
  alias think="ssh -i $THINK_KEY $THINK_HOST"
  alias dancecam1="ssh -i $DANCECAM_KEY dancecam1.local"
else
  alias ls="ls -ahlX --color"
  alias think="Already on the 🐧"
  alias code="~/scripts/remote-code.sh"
fi


# Echo out something as if it was a prompt command.
echoprompt() {
  echo -e "\n\033[1;31m➤\033[0m $*\n"
}

alias ltst="gls -ahlX --color -t | head -15"
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
alias ccat="pygmentize"
alias serve="http-server -c-1"
alias pserve="php -S localhost:8000 router.php"
alias edit-hosts="sudo vim /private/etc/hosts"
alias edit-profile="code ~/scripts"
alias edit-scripts="code ~/scripts"
alias edit-cron="env EDITOR=vim crontab -e"
alias nr="npm run"
alias jest="clear && jest"
alias ytmp4="yt-dlp -f mp4"
alias ytmp3="yt-dlp -x --audio-format mp3 --output 'chapter:%(section_number)s %(section_title)s.%(ext)s'"
alias ytmp3-chapters="ytmp3 --split-chapters --output 'chapter:%(section_number)s %(section_title)s.%(ext)s'"
alias ytmp3-playlist="ytmp3 --output '%(playlist_index)s - %(title)s.%(ext)s'"

alias folder-size="du -d 1 -h ."
alias cargo-test-debug="node ~/scripts/rust-scripts/cargo-test-debug.js"
alias porp="poetry run python -W ignore"
alias por="poetry run"
alias network-scan="nmap -sn 192.168.1.0/24 --system-dns"
hf-clone() {
  git clone https://huggingface.co/datasets/$*
}
type() {
  builtin type $*
  whence -f $*
}
find() {
  /usr/bin/find $* \
  -not -path '*/.git/*' \
  -not -path '*/.hg/*' \
  -not -path '*/node_modules/*' \
  -not -path '*/target/*' \
  -not -path '*/obj-ff-artifact/*' \
  -not -path '*/obj-ff-debug/*' \
  -not -path '*/obj-ff-release/*' \
  -not -path '*/thirdparty/*'
}
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
alias tree="$__tree -L 3 -C -I 'node_modules|.git|.hg|target|__pycache__'"

# alias _tree="$__tree -L 2 -C -I 'node_modules|.git|.hg|target|__pycache__'"
# # Display a shallow tree of files. Pass an argument to match a specific file
# tree() {
#   if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
#     _tree $@
#   else
#     _tree --matchdirs --prune -P $1 ${@:2}
#   fi
# }
# alias _tree-size="_tree -s -h --du -i"
# tree-size() {
#   if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
#     _tree-size $@
#   else
#     _tree-size --matchdirs --prune -P $1 ${@:2}
#   fi
# }
# alias _files="_tree -s -h --du -i -f"
# files() {
#   if [ -z "$1" ] || [ ${1:0:1} == "-" ]; then
#     _files $@
#   else
#     _files --matchdirs --prune -P $1 ${@:2}
#   fi
# }

rcat() {
  curl -s $1 -o - -L
}

rhead() {
  rcat $1 | head ${@:2} -n 40
}


zcat () {
  if [[ -f "$1" ]]; then
    zstd --decompress --stdout "$1"
  else
    curl -sL "$1" | zstd --decompress --stdout
  fi
}
zhead() {
  zcat $1 | head ${@:2} -n 40
}
gzcat () {
  if [[ -f "$1" ]]; then
    gzip --decompress --stdout "$1"
  else
    curl -sL "$1" | gzip --decompress --stdout
  fi
}
gzhead() {
  gzcat $1 | head ${@:2} -n 40
}
zipcat() {
  unzip =( curl -s $1 -o - -L )
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

alias venv-up="python -m venv venv && source venv/bin/activate"

#!/bin/bash
function tmpd {
  d="$HOME/tmp/`date +%Y-%m-%d`"
  if [[ ! -d "$d" ]]; then
      mkdir "$d"
  fi
  echo $d
}

xxd-head() {
  local location="$1"
  local num_bytes="${2:-1024}"

    # Help documentation
  if [[ "$location" == "-h" || "$location" == "--help" || -z "$location" ]]; then
    echo "Usage: xxd-head LOCATION [NUM_BYTES]"
    echo
    echo "Display the binary head of a file or URL using xxd."
    echo
    echo "Arguments:"
    echo "  LOCATION    File path or URL (http:// or https://) to read from."
    echo "  NUM_BYTES   Number of bytes to display from the beginning (default: 16)."
    echo
    echo "Examples:"
    echo "  xxd-head /path/to/file.bin 32"
    echo "  xxd-head https://example.com/file.bin 64"
    return 0
  fi

  if [[ "$location" =~ ^https?:// ]]; then
    # If the location is a URL
    if ! curl -s "$location" | xxd -l "$num_bytes"; then
      echo "Error: Failed to process URL."
      return 1
    fi
  elif [[ -f "$location" ]]; then
    # If the location is a local file
    xxd -l "$num_bytes" "$location"
  else
    echo "Error: '$location' is neither a valid URL nor a file."
    return 1
  fi
}

greg-hash() {
  local location="$1"
  local hash_algo="${2:-sha256}" # Default to sha256 if not specified

  # Help documentation
  if [[ "$location" == "-h" || "$location" == "--help" ]]; then
    echo "Usage: greg-hash LOCATION [HASH_ALGO]"
    echo
    echo "Calculate the hash and byte size of a file or URL."
    echo
    echo "Arguments:"
    echo "  LOCATION    File path or URL (http:// or https://) to read from."
    echo "  HASH_ALGO   Hash algorithm to use (default: sha256). Options include sha1, sha256, md5, etc."
    echo
    echo "Examples:"
    echo "  greg-hash /path/to/file.bin sha1"
    echo "  greg-hash https://example.com/file.bin sha256"
    return 0
  fi

  if [[ -z "$location" ]]; then
    echo "Error: Location (URL or file path) is required. Use -h for help."
    return 1
  fi

  if [[ "$location" =~ ^https?:// ]]; then
    # If the location is a URL
    echo "Processing URL: $location"
    if ! curl -s "$location" | tee >(wc -c > /tmp/byte_size) | openssl dgst -"$hash_algo"; then
      echo "Error: Failed to process URL."
      return 1
    fi
    echo "Byte size: $(cat /tmp/byte_size)"
    rm -f /tmp/byte_size
  elif [[ -f "$location" ]]; then
    # If the location is a local file
    echo "Processing file: $location"
    local byte_size
    byte_size=$(wc -c < "$location")
    echo "Hash ($hash_algo): $(openssl dgst -"$hash_algo" "$location" | awk '{print $2}')"
    echo "Byte size: $byte_size"
  else
    echo "Error: '$location' is neither a valid URL nor a file. Use -h for help."
    return 1
  fi
}

CAFFEINATE_PID=0

awaken() {
  # Trap SIGINT and SIGTERM to handle graceful exit
  trap _awaken_cleanup SIGINT SIGTERM

  while true; do
    if pmset -g ps | grep -q "AC Power"; then
      if [[ $CAFFEINATE_PID -eq 0 ]]; then
        echo "Power connected. Starting caffeinate..."
        caffeinate -d &  # Start caffeinate in the background
        CAFFEINATE_PID=$!
      fi
    else
      if [[ $CAFFEINATE_PID -ne 0 ]]; then
        echo "Running on battery. Stopping caffeinate..."
        kill $CAFFEINATE_PID
        wait $CAFFEINATE_PID 2>/dev/null
        CAFFEINATE_PID=0
      fi
    fi
    sleep 5  # Check every 5 seconds
  done
}

_awaken_cleanup() {
  echo "Exiting... Stopping caffeinate."
  if [[ $CAFFEINATE_PID -ne 0 ]]; then
    kill $CAFFEINATE_PID
    wait $CAFFEINATE_PID 2>/dev/null
  fi
  exit 0
}
