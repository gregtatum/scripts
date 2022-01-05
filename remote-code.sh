#! /usr/bin/env zsh

local script=$(echo ~/.vscode-server/bin/*/bin/code(*oc[1]N))
if [[ -z ${script} ]]
then
    echo "VSCode remote script not found"
    exit 1
fi
local socket=$(echo /run/user/$UID/vscode-ipc-*.sock(=oc[1]N))
if [[ -z ${socket} ]]
then
    echo "VSCode IPC socket not found"
    exit 1
fi
export VSCODE_IPC_HOOK_CLI=${socket}
echo $script $@
${script} $@
