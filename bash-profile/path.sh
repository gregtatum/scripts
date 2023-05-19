if [[ "$OSTYPE" == "darwin"* ]]; then
  export PATH=/usr/local/Cellar/vim/8.0.1700/bin:$PATH
  export PATH=/Users/greg/.mozbuild/git-cinnabar:$PATH
  export PATH=~/.cargo/bin:$PATH
  export PATH=/opt/homebrew/bin:$PATH
  export PATH=/Applications/Postgres.app/Contents/Versions/10/bin:$PATH

  export PATH=~/Library/Android/sdk/emulator:$PATH
  export PATH=~/Library/Android/sdk/platform-tools:$PATH
  # Use the brew install python.
  export PATH=/usr/local/opt/python/libexec/bin:$PATH
else
  export PATH=~/.local/bin:$PATH
  export PATH=~/.pyenv/bin:$PATH
fi

export PATH=~/scripts:$PATH
export PATH=~/scripts/moz-git-tools:$PATH
export PATH=~/scripts/version-control-tools/git/commands:$PATH
export PATH=./node_modules/.bin:$PATH
export PATH=~/dev/gecko-dev:$PATH
export PATH=~/scripts/phabricator/arcanist/bin:$PATH
export PATH="/Applications/MuseScore 3.app/Contents/MacOS:$PATH"
export PATH=/usr/local/opt/llvm/bin:$PATH
export PATH=/Applications/fceux.app/Contents/MacOS:$PATH
export PATH=/Applications/VLC.app/Contents/MacOS:$PATH
