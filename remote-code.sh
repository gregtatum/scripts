#! /usr/bin/env zsh

local max_retry=10

for i in {1..$max_retry}
do
    local script=$(echo ~/.vscode-server/bin/*/bin/remote-cli/code(*oc[$i]N))
    if [[ -z ${script} ]]
    then
        echo "VSCode remote script not found"
        exit 1
    fi
    local socket=$(echo /run/user/$UID/vscode-ipc-*.sock(=oc[$i]N))
    if [[ -z ${socket} ]]
    then
        echo "VSCode IPC socket not found"
        exit 1
    fi
    export VSCODE_IPC_HOOK_CLI=${socket}
    ${script} $@ > /dev/null 2>&1
    if [ "$?" -eq "0" ]; then
        exit 0
    fi
done

echo "Failed to find valid VS Code window"
