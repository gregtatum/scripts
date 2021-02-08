# Setup programming environments

#---------------------------------------------
# Set up pyenv.

  # This doesn't seem to work, and it's slow:
  # eval "$(pyenv init -)"
  # eval "$(pyenv virtualenv-init -)"
init-pyenv() {
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"
}


#---------------------------------------------
# Setup rust
export RUST_SRC_PATH=`brew --prefix`/Cellar/rust/src/src


#---------------------------------------------
# Setup npm
source ~/.bash_npm_completion

#--------------------------------------------------------------
# Lazy load nvm - https://blog.yo1.dog/better-nvm-lazy-loading/
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

  # This lazy loads nvm
  nvm() {
    unset -f nvm
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use # This loads nvm
    nvm $@
  }

  # This resolves the default node version
  DEFAULT_NODE_VER="$( (< "$NVM_DIR/alias/default" || < ~/.nvmrc) 2> /dev/null)"
  while [ -s "$NVM_DIR/alias/$DEFAULT_NODE_VER" ] && [ ! -z "$DEFAULT_NODE_VER" ]; do
    DEFAULT_NODE_VER="$(<"$NVM_DIR/alias/$DEFAULT_NODE_VER")"
  done

  # This adds the default node version to PATH
  if [ ! -z "$DEFAULT_NODE_VER" ]; then
    export PATH="$NVM_DIR/versions/node/v${DEFAULT_NODE_VER#v}/bin:$PATH"
  fi
#----------------------------
