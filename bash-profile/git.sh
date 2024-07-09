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
alias gswc="git switch --create"
alias gc="git commit -m"
alias gca="git commit --amend --no-edit; git status"
alias gcf="git commit --fixup"
alias gcpa="git cherry-pick --abort"
alias gcpc="git cherry-pick --continue"
alias grvi="git revise -i"
alias grvim="git revise -i main"
alias gri="git rebase -i"
alias grim="git rebase -i main"
alias grc="git rebase --continue"
alias gra="git rebase --abort"
alias gp="git push"
alias gr="git remote -v"
alias gl="git oneline"
alias gd="git diff"
alias gdf="git diff --name-only" # git diff "files"
alias gcm="git commit -m"
alias screwit="gaaca; gp -f --no-verify"

submodule-reset() {
  git submodule deinit -f .
  git submodule update --init
}

# Run git absorb
gabs() {
  echoprompt "git absorb --base main"
  git absorb --base main

  echoprompt "git status"
  git status
}

alias pr="gh pr"
alias gdh="git diff HEAD"
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
  git push -u gregtatum $branch $@ && gh browse
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

ta() {
	if [ "$1" == "" ]
	then
    tmux attach
	else
    tmux attach -t $1
  fi
}

if [[ "$OSTYPE" == "darwin"* ]]; then
  # TODO - This is not working.
  # source ~/git-completion.zsh
fi

gstats() {
  git shortlog \
    --summary \
    --numbered \
    --no-merges \
    --since="Jan 01 2024" \
    --invert-grep \
    --grep "Vendor libwebrtc" \
    --grep "Backed out" \
    --perl-regexp --author='^((?!(moz-wptsync-bot|Mozilla Releng Treescript|dependabot|MickeyMoz|github-actions)).*)$' \
  | nl \
  | head --lines 1000 \
  | tac
}

gstats-all() {
  git shortlog \
    --summary \
    --numbered \
    --no-merges \
  | nl \
  | head --lines 100 \
  | tac
}
