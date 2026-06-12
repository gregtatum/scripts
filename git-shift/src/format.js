// @ts-check

/**
 * @param {Date} date
 */
export function formatShortDateTime(date) {
  return [
    date.getFullYear(),
    "-",
    pad2(date.getMonth() + 1),
    "-",
    pad2(date.getDate()),
    " ",
    pad2(date.getHours()),
    ":",
    pad2(date.getMinutes()),
  ].join("");
}

/**
 * @param {Date} before
 * @param {Date} after
 */
export function formatTimeShift(before, after) {
  const beforeDate = formatShortDate(before);
  const afterDate = formatShortDate(after);
  const beforeTime = formatShortTime(before);
  const afterTime = formatShortTime(after);
  const afterText = beforeDate === afterDate ? afterTime : `${afterDate} ${afterTime}`;

  return `${beforeDate} ${beforeTime} -> ${afterText}`;
}

/**
 * @param {Date} date
 */
export function formatGitDate(date) {
  return date.toISOString();
}

/**
 * @param {Date} date
 */
function formatShortDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * @param {Date} date
 */
function formatShortTime(date) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * @param {number} value
 */
function pad2(value) {
  return String(value).padStart(2, "0");
}
