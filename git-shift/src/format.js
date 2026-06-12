// @ts-check

/**
 * @param {Date} date
 */
export function formatHumanDate(date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/**
 * @param {Date} date
 */
export function formatGitDate(date) {
  return date.toISOString();
}
