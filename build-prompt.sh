black="\[\033[0;30m\]"
blue="\[\033[0;34m\]"
green="\[\033[0;32m\]"
cyan="\[\033[0;36m\]"
red="\[\033[0;31m\]"
purple="\[\033[0;35m\]"
brownorange="\[\033[0;33m\]"
lightgray="\[\033[0;37m\]"
darkgray="\[\033[1;30m\]"
lightblue="\[\033[1;34m\]"
lightgreen="\[\033[1;32m\]"
lightcyan="\[\033[1;36m\]"
lightred="\[\033[1;31m\]"
lightpurple="\[\033[1;35m\]"
yellow="\[\033[1;33m\]"
white="\[\033[1;37m\]"
clear="\[\033[0m\]"


newlines='\n\n\n'
currpath="${cyan}\w${clear}"
user="${brownorange}\u${clear}"


echo -n ${newlines}
echo -n ${currpath}
# echo -n " ${darkgray}as${clear} ${user}"
echo -n "\$(git_branch)"
# if [ -d "./.hg" ]; then
  # I accidentally deleted this.
  # echo -n "\$(hg_bookmark)"
# fi
# echo -n "\$(hg_bug)"
echo -n " ${darkgray}at${clear} \t"
echo -n "\n"
echo -n "${red}➤${clear} "
