DIR=~/dev/worktrees/$1

# create worktree directory if it doesn't exist
if [ ! -d $DIR ]; then
  echo "Creating the worktree"
  git worktree add -b $1 $DIR origin/fx-team
fi

cd ~/dev/worktrees/$1
