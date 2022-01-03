if [[ "$OSTYPE" == "darwin"* ]]; then
  export PATH=/usr/local/Cellar/vim/8.0.1700/bin:$PATH
  export PATH=~/.cargo/bin:$PATH
  export PATH=/Applications/Postgres.app/Contents/Versions/10/bin:$PATH

  export PATH=~/Library/Android/sdk/emulator:$PATH
  export PATH=~/Library/Android/sdk/platform-tools:$PATH
  # Use the brew-installed python
  export PATH=~/Library/Python/3.7/bin:$PATH
  export PATH=/usr/local/opt/python/libexec/bin:$PATH
fi

export PATH=~/scripts:$PATH
export PATH=~/scripts/git-cinnabar:$PATH
export PATH=~/scripts/moz-git-tools:$PATH
export PATH=~/scripts/version-control-tools/git/commands:$PATH
export PATH=./node_modules/.bin:$PATH
export PATH=~/dev/gecko-dev:$PATH
export PATH=~/scripts/phabricator/arcanist/bin:$PATH
