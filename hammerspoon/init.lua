hs.loadSpoon("ShiftIt")
spoon.ShiftIt:bindHotkeys({})

-- Close all visible notifications in Notification Center.
hs.hotkey.bind({"ctrl", "cmd"}, "delete", function()
  hs.task
    .new("/usr/bin/osascript", nil, {
      "-l",
      "JavaScript",
      os.getenv("HOME") .. "/me/scripts/dismiss-macos-notifications.js",
    })
    :start()
end)
