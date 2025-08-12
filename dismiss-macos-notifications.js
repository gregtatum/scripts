// Modified from
// https://gist.github.com/lancethomps/a5ac103f334b171f70ce2ff983220b4f
"use strict";

function run() {
  const CurrentApplication = (() => {
    const app = Application.currentApplication();
    app.includeStandardAdditions = true;
    return app;
  })();
  const SystemEvents = Application("System Events");
  const NotificationCenter =
    SystemEvents.processes.byName("NotificationCenter");
  const macOSSequoiaOrGreater =
    parseFloat(CurrentApplication.systemInfo().systemVersion) >= 15.0;
  const notificationGroups = () => {
    const windows = NotificationCenter.windows;
    if (windows.length === 0) {
      return [];
    }

    return macOSSequoiaOrGreater
      ? windows // "Clear all" heirarchy
          .at(0)
          .groups.at(0)
          .groups.at(0)
          .scrollAreas.at(0)
          .groups()
          .at(0)
          .uiElements()
          .concat(
            windows // "Close" heirarchy
              .at(0)
              .groups.at(0)
              .groups.at(0)
              .scrollAreas.at(0)
              .groups()
          )
      : windows.at(0).groups.at(0).scrollAreas.at(0).uiElements.at(0).groups();
  };

  const findCloseAction = group => {
    const [closeAllAction, closeAction] = group.actions().reduce(
      (matches, action) => {
        switch (action.description()) {
          case "Clear All":
            return [action, matches[1]];
          case "Close":
            return [matches[0], action];
          default:
            return matches;
        }
      },
      [null, null]
    );
    return closeAllAction ?? closeAction;
  };

  const actions = notificationGroups().map(findCloseAction);
  for (const action of actions) {
    action?.perform();
  }
}