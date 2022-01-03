gitfindmerge() {
  git log $1..main --ancestry-path --merges
}
gitfindbranch() {
  # Based on: http://stackoverflow.com/a/13003854/170413
  local branch
  if branch=$(git rev-parse --abbrev-ref HEAD 2> /dev/null); then
    if [[ "$branch" == "HEAD" ]]; then
      branch='detached*'
    fi
    git_branch="($branch)"
  else
    git_branch=""
  fi
}
#git aliases
alias g="git"
alias gs='git status'
alias ga="git add"
alias gap="git add -p"
alias gaa="git add .; gs"
alias gcob="git checkout -b"
alias gc="git commit -m"
alias gca="git commit --amend --no-edit; git status"
alias gcpa="git cherry-pick --abort"
alias gcpc="git cherry-pick --continue"
alias gri="git rebase -i"
alias grim="git rebase -i main"
alias gric="git rebase -i central"
alias grc="git rebase --continue"
alias gra="git rebase --abort"
alias gp="git push"
alias gr="git remote -v"
alias gl="git oneline"
alias gd="git diff"
alias gcm="git commit -m"
alias screwit="gaaca; gp -f --no-verify"
# git absorb is hard to run, this will apply it and spit out messages that give
# more context.
alias gabsorb="git absorb && echo '' && git oneline && echo '' && git status && echo '' && echo 'Now run gapply'"
# Apply git absorb's commits.
alias gapply="git rebase -i --autosquash"
alias pr="gh pr"
gdh() {
  if [[ $1 =~ ^\^ ]] ; then
    CARETS=$1
    shift
    git diff head$CARETS $@
  else
    git diff head $*
  fi
}
gaaca() {
  git add .
  gca $@
  gs
}
grange() {
  echo "$(git merge-base main HEAD)..$(git rev-parse HEAD)"
}
gtime() {
  TIME="git changedate "'"'"$(git show -s --format=%ci)"'"'""
  echo $TIME
  echo $TIME | tr -d '\n' | pbcopy
}
gcontrib() {
  git remote add $1 git@github.com:$1/profiler.git
  git push --set-upstream $1 ${git branch --show-current}
}
gnot() {
  # List all notifications in an interactive CLI
  GITHUP_NOTIFICATIONS_ACCESS_TOKEN=$GITHUP_NOTIFICATIONS_ACCESS_TOKEN \
    node ~/scripts/my-reviews/notifications.js
}

firstpush() {
  branch=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')
  echo "git push -u gregtatum $branch"
  git push -u gregtatum $branch $@ && hub browse
}

git_branch() {

	branch=$(git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/\1/')

	if [ "$branch" != "" ]
	then

		darkgray='\033[1;30m'
		clear='\033[0m'
		lightgreen='\033[1;32m'
		green='\033[0;32m'

    # Check to see if we are in the gecko worktree
    repo_path=$(git rev-parse --show-toplevel)
    repo=$(basename "$repo_path")
		echo -e "${darkgray} on${clear} ${green}${repo}${clear}/${lightgreen}${branch}${clear}"
	fi
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  source ~/git-completion.bash
fi
