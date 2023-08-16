if [[ "$OSTYPE" == "darwin"* ]]; then
  export PATH=/Users/greg/.mozbuild/git-cinnabar:$PATH
  export PATH=/opt/homebrew/bin:$PATH

  export PATH=~/Library/Android/sdk/emulator:$PATH
  export PATH=~/Library/Android/sdk/platform-tools:$PATH

  export PATH="/Applications/MuseScore 3.app/Contents/MacOS:$PATH"
  export PATH=/Applications/fceux.app/Contents/MacOS:$PATH
  export PATH=/Applications/VLC.app/Contents/MacOS:$PATH

  # Use the brew install python.
  export PATH="/opt/homebrew/opt/python@3.10/libexec/bin:$PATH"

  export PATH=/opt/homebrew/opt/llvm/bin:$PATH
  export LDFLAGS="-L/opt/homebrew/opt/llvm/lib"
  export CPPFLAGS="-I/opt/homebrew/opt/llvm/include"

  # https://github.com/emscripten-core/emsdk
  export PATH="/Users/greg/lem/emsdk:$PATH"
  export PATH="/Users/greg/lem/emsdk/upstream/emscripten:$PATH"
else
  export PATH=~/.local/bin:$PATH
  export PATH=~/.pyenv/bin:$PATH
fi

export PATH=~/.cargo/bin:$PATH
export PATH=~/scripts:$PATH
export PATH=~/scripts/moz-git-tools:$PATH
export PATH=~/scripts/version-control-tools/git/commands:$PATH
export PATH=./node_modules/.bin:$PATH
export PATH=~/dev/gecko-dev:$PATH
export PATH=~/scripts/phabricator/arcanist/bin:$PATH
