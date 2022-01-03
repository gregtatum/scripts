# https://stackoverflow.com/questions/59895/how-can-i-get-the-source-directory-of-a-bash-script-from-within-the-script-itsel
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [[ "$OSTYPE" != "darwin"* ]]; then
  ~/scripts/bash-profile/update-repo.sh
fi

touch $DIR/.secrets
source $DIR/.secrets
source $DIR/git.sh
source $DIR/hg.sh
source $DIR/path.sh
source $DIR/commands.sh
source $DIR/environments.sh
source $DIR/gecko.sh

# I should probably upgrade at some point.
export BASH_SILENCE_DEPRECATION_WARNING=1
# Increase the bash file history size
export HISTFILESIZE=50000000
export HISTSIZE=1000000
export EDITOR="vim"
export CCACHE_COMPRESS=""
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
# Make bash history append
shopt -s histappend
# Save bash history immediately, not on session end
PROMPT_COMMAND='history -a'
# Don’t save lines matching the previous history entry
export HISTCONTROL=ignoredups
# Store multi-line commands in one history entry
shopt -s cmdhist
bind '"\e[A":history-search-backward'
bind '"\e[B":history-search-forward'

export PS1=$(build-prompt.sh)
