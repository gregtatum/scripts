# Setup programming environments

#--------------------------------------------------------------
# Work around glean issues where python doesn't know my locale.
# e.g.

# ➤ moz-phab --help
# Glean error
# Traceback (most recent call last):
#   File "~/Library/Python/3.7/lib/python/site-packages/glean/_dispatcher.py", line 123, in _worker
#     task(*args, **kwargs)
#   File "~/Library/Python/3.7/lib/python/site-packages/glean/glean.py", line 208, in initialize
#     cls._initialize_core_metrics()
#   File "~/Library/Python/3.7/lib/python/site-packages/glean/glean.py", line 533, in _initialize_core_metrics
#     metrics.glean.internal.metrics.locale._set_sync(_util.get_locale_tag())
#   File "~/Library/Python/3.7/lib/python/site-packages/glean/_util.py", line 23, in get_locale_tag
#     value = locale.getdefaultlocale()[0]
#   File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/locale.py", line 568, in getdefaultlocale
#     return _parse_localename(localename)
#   File "/Library/Frameworks/Python.framework/Versions/3.7/lib/python3.7/locale.py", line 495, in _parse_localename
#     raise ValueError('unknown locale: %s' % localename)

export LC_ALL=en_US.UTF-8
export LANG=en_US.UTF-8
export LC_CTYPE=en_US.UTF-8

#---------------------------------------------
# Set up pyenv.

pyenv() {
  echo "Setting up pyenv."
  unset -f pyenv
  eval "$(pyenv init -)"
  eval "$(pyenv virtualenv-init -)"
  echo "Done, passing command to pyenv..."
  echo ""
  pyenv $@
}


if [[ "$OSTYPE" == "darwin"* ]]; then
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
fi
