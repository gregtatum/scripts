# hg autocompletion
. /usr/local/Cellar/mercurial/5.8.1/etc/bash_completion.d/hg-completion.bash

#hg aliases
# alias hg="chg"
alias hgs="hg status"
alias hgd="hg diff"
alias hh="hg histedit"
alias hhc="hg histedit --continue"
alias hha="hg histedit --abort"
alias hrc="hg rebase --continue"

hresolve() {
 hg resolve --mark $1
 trash $1.orig
}

hg_bug() {
  darkgray='\033[1;30m'
  clear='\033[0m'
  green='\033[0;32m'
  commit=$(hg summary 2> /dev/null | grep -E 'Bug \d+' | sed -e 's/ Bug //' | cut -c 1-60)
  if [ "$commit" != "" ]
  then
    echo -e "${darkgray} on${clear} ${green}${commit}${clear}"
  fi
}
