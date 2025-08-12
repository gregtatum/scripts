#!/bin/zsh

# https://stackoverflow.com/questions/59895/how-can-i-get-the-source-directory-of-a-bash-script-from-within-the-script-itsel
DIR="$(cd "$(dirname "$0")" && pwd)"

# Increase the bash file history size
export HISTSIZE=10000000
export SAVEHIST=10000000
# export HISTFILE="~/.zsh_history"

setopt BANG_HIST                 # Treat the '!' character specially during expansion.
setopt EXTENDED_HISTORY          # Write the history file in the ":start:elapsed;command" format.
setopt INC_APPEND_HISTORY        # Write to the history file immediately, not when the shell exits.
setopt SHARE_HISTORY             # Share history between all sessions.
setopt APPEND_HISTORY            # Append history to the history file (no overwriting)
setopt HIST_EXPIRE_DUPS_FIRST    # Expire duplicate entries first when trimming history.
setopt HIST_IGNORE_DUPS          # Don't record an entry that was just recorded again.
setopt HIST_IGNORE_ALL_DUPS      # Delete old recorded entry if new entry is a duplicate.
setopt HIST_FIND_NO_DUPS         # Do not display a line previously found.
setopt HIST_IGNORE_SPACE         # Don't record an entry starting with a space.
setopt HIST_SAVE_NO_DUPS         # Don't write duplicate entries in the history file.
setopt HIST_REDUCE_BLANKS        # Remove superfluous blanks before recording entry.
setopt HIST_VERIFY               # Don't execute immediately upon history expansion.
setopt HIST_BEEP                 # Beep when accessing nonexistent history.

export EDITOR="vim"
export CCACHE_COMPRESS=""
export CLICOLOR=1
export LSCOLORS=GxFxCxDxBxegedabagaced
# Normally this is '%', which shows when some output doesn't end with a newline.
export PROMPT_EOL_MARK=''

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

if [[ "$OSTYPE" == "darwin"* ]]; then
  # Enable auto completions.
  # https://github.com/zsh-users/zsh-autosuggestions
  source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
  # ZSH_AUTOSUGGEST_STRATEGY=completion
fi


bindkey '^[' autosuggest-accept
