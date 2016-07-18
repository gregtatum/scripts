DIR=~/dev/worktrees/$1

# remove worktree directory if it exists
if [ -d $DIR ]; then
  git bd $1;
  rm $DIR;
fi
