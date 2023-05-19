darkgray='\033[1;30m'
clear='%f%k'
newlines='\n\n\n'
current_path="%~"
date_time=$(date +%H:%M:%S)

# Pick colors here:
# for i in {1..100}; do
#   echo "%F{$i}Color $i"
# done

function git_prompt_branch() {
  ref=$(git symbolic-ref HEAD 2> /dev/null) || return
  branch="${ref#refs/heads/}"
  echo " ${darkgray}on$clear\c"
  echo " %F{green}$branch$clear\c"
}

echo "$newlines\c"
# Current path.
echo "%F{cyan}$current_path$clear\c"
echo '$(git_branch)\c'
echo " ${darkgray}at$clear\c"
echo " $date_time\c"

if [[ "$OSTYPE" == "darwin"* ]]; then
  echo " 🍏\c"
else
  echo " 🐧\c"
fi

echo ""
echo "%F{red}➤$clear \c"
