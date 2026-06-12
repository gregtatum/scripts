// @ts-check

const dayIndexes = new Map([
  ["sun", 0],
  ["mon", 1],
  ["tue", 2],
  ["wed", 3],
  ["thu", 4],
  ["fri", 5],
  ["sat", 6],
]);

const dayLabels = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * @typedef {{
 *   days: Set<number>,
 *   startHour: number,
 *   endHour: number,
 *   source: string,
 * }} WhenRule
 */

/**
 * @param {string} text
 * @returns {WhenRule}
 */
export function parseWhenRule(text) {
  const source = text.trim().toLowerCase();
  const match = source.match(/^([a-z]{3})(?:-([a-z]{3}))?\s+(\d{1,2})-(\d{1,2})$/);
  if (!match) {
    throw new Error('Expected --when to look like "mon-fri 2-10".');
  }

  const [, startDayText, endDayText = startDayText, startHourText, endHourText] = match;
  const startDay = dayIndexes.get(startDayText);
  const endDay = dayIndexes.get(endDayText);
  if (startDay === undefined || endDay === undefined) {
    throw new Error(`Unknown day in --when: "${startDayText}-${endDayText}".`);
  }

  const startHour = Number.parseInt(startHourText, 10);
  const endHour = Number.parseInt(endHourText, 10);
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour)) {
    throw new Error("Hour range must contain whole numbers.");
  }
  if (startHour < 0 || startHour > 23 || endHour < 1 || endHour > 24) {
    throw new Error("Hour range must stay within 0-24.");
  }
  if (startHour >= endHour) {
    throw new Error("Hour range must be start-inclusive and end-exclusive, for example 2-10.");
  }

  const days = new Set();
  let day = startDay;
  while (true) {
    days.add(day);
    if (day === endDay) {
      break;
    }
    day = (day + 1) % 7;
  }

  return { days, startHour, endHour, source };
}

/**
 * @param {Date} date
 * @param {WhenRule} rule
 */
export function matchesWhenRule(date, rule) {
  const day = date.getDay();
  const hour = date.getHours();
  return rule.days.has(day) && hour >= rule.startHour && hour < rule.endHour;
}

/**
 * @param {WhenRule} rule
 */
export function describeWhenRule(rule) {
  const days = [...rule.days].map(day => dayLabels[day]).join(",");
  return `${days} ${rule.startHour}-${rule.endHour}`;
}

/**
 * @param {string} text
 * @returns {number} milliseconds
 */
export function parseShift(text) {
  const match = text.trim().match(/^([+-])(\d+)([hm])$/i);
  if (!match) {
    throw new Error('Expected --by to look like "+5h", "-2h", or "+30m".');
  }

  const [, signText, amountText, unitText] = match;
  const amount = Number.parseInt(amountText, 10);
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Shift amount must be a positive whole number with a sign.");
  }

  const unit = unitText.toLowerCase();
  const multiplier = unit === "h" ? 60 * 60 * 1000 : 60 * 1000;
  return (signText === "-" ? -1 : 1) * amount * multiplier;
}
