#!/bin/zsh

# https://stackoverflow.com/questions/59895/how-can-i-get-the-source-directory-of-a-bash-script-from-within-the-script-itsel
DIR="$(cd "$(dirname "$0")" && pwd)"

# I should probably upgrade at some point.
export BASH_SILENCE_DEPRECATION_WARNING=1
# Increase the bash file history size
export HISTFILESIZE=50000000
export HISTSIZE=1000000
export EDITOR="vim"
export CCACHE_COMPRESS=""
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced

# Setup autocomplete before compinit
zstyle ':completion:*:*:git:*' script ~/.zsh/git-completion.bash
fpath=(~/.zsh $fpath)

autoload -Uz +X compinit && compinit
autoload -Uz +X bashcompinit && bashcompinit

# Share history across multiple terminals
setopt inc_append_history

# Don’t save lines matching the previous history entry
setopt histignoredups

# Store multi-line commands in one history entry
bindkey "^[[A" history-beginning-search-backward
bindkey "^[[B" history-beginning-search-forward

# Allow inline comments
setopt interactive_comments

# Load version control information
autoload -Uz vcs_info
precmd() {
  vcs_info
}
# zstyle ':vcs_info:git:*' formats 'on %b'

export PROMPT=$(zsh $DIR/build-prompt.sh)

touch $DIR/.secrets
source $DIR/.secrets
source $DIR/git.sh
source $DIR/path.sh
source $DIR/commands.sh
source $DIR/environments.sh
source $DIR/gecko.sh

# Enable auto completions.
# https://github.com/zsh-users/zsh-autosuggestions
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
# ZSH_AUTOSUGGEST_STRATEGY=completion

bindkey '^[' autosuggest-accept
