import moment from 'moment-hijri';
import {
  hijriMonthsArabic,
  hijriMonthsTranslit,
  hijriWeekdaysArabic,
  hijriWeekdaysTranslit,
} from '~/constants/calendarConstants';
import HijriDate from 'hijri-date/lib/safe';
/**
 * Returns the emoji and English label for the current moon phase,
 * based on the Hijri calendar day of the month (1–30).
 *
 * The Hijri (Islamic) calendar is lunar-based, so each month’s
 * phases closely follow this cycle:
 *   1          - New Moon         🌑
 *   2–6        - Waxing Crescent  🌒
 *   7          - First Quarter    🌓
 *   8–14       - Waxing Gibbous   🌔
 *   15         - Full Moon        🌕
 *   16–21      - Waning Gibbous   🌖
 *   22         - Last Quarter     🌗
 *   23–29      - Waning Crescent  🌘
 *   30 (or any other) - New Moon  🌑
 *
 * @param {number} hijriDay - Day of the Hijri month (1–30).
 * @returns {{ icon: string, label: string }} The corresponding moon phase as an emoji and English label.
 *
 * @example
 *   getMoonPhaseInfo(1);   // { icon: '🌑', label: 'New Moon' }
 *   getMoonPhaseInfo(10);  // { icon: '🌔', label: 'Waxing Gibbous' }
 *   getMoonPhaseInfo(22);  // { icon: '🌗', label: 'Last Quarter' }
 */
export function getMoonPhaseInfo(hijriDay: number) {
  // hijriDay: integer 1-30
  if (hijriDay === 1) return { icon: '🌑', label: 'New Moon' };
  if (hijriDay < 7) return { icon: '🌒', label: 'Waxing Crescent' };
  if (hijriDay === 7) return { icon: '🌓', label: 'First Quarter' };
  if (hijriDay < 15) return { icon: '🌔', label: 'Waxing Gibbous' };
  if (hijriDay === 15) return { icon: '🌕', label: 'Full Moon' };
  if (hijriDay < 22) return { icon: '🌖', label: 'Waning Gibbous' };
  if (hijriDay === 22) return { icon: '🌗', label: 'Last Quarter' };
  if (hijriDay < 30) return { icon: '🌘', label: 'Waning Crescent' };
  return { icon: '🌑', label: 'New Moon' };
}

type CalendarEvent = {
  month: number;
  day: number;
  name: string;
  description: string;
  dateLabel: string;
  imageUrl: string;
  quote: string;
  todos: {
    icon: string;
    label: string;
  }[];
  facts: string[];
  // [key: string]: any; // To allow other properties if needed
};

/**
 * Finds the next upcoming event after the given Hijri date.
 * @param events - Array of events with at least 'month' and 'day' (Hijri calendar).
 * @param today - JS Date or moment instance (default: now)
 * @returns The next event object with an added 'daysLeft' property, or null if none found.
 */
export function getNextEvent(
  events: CalendarEvent[],
  today: Date = new Date()
): (CalendarEvent & { daysLeft: number }) | null {
  // Get today's Hijri year, month, and day
  const mToday = moment(today);
  const hijriYear = mToday.iYear();

  // For each event, calculate its next occurrence (this year or next if already passed)
  const withDates = events.map((event) => {
    // Build Hijri date for event this year
    let eventDateHijri = moment(`${hijriYear}/${event.month + 1}/${event.day}`, 'iYYYY/iM/iD');
    // If event already passed this year, use next year
    if (eventDateHijri.isBefore(mToday, 'day')) {
      eventDateHijri = moment(`${hijriYear + 1}/${event.month + 1}/${event.day}`, 'iYYYY/iM/iD');
    }
    const daysLeft = eventDateHijri.diff(mToday, 'days');
    return { ...event, eventDateHijri, daysLeft };
  });

  // Filter for future events only
  const futureEvents = withDates.filter((e) => e.daysLeft >= 0);

  // Find the soonest
  if (!futureEvents.length) return null;
  futureEvents.sort((a, b) => a.daysLeft - b.daysLeft);
  const next = futureEvents[0];

  // Remove eventDateHijri from the return (not needed)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { eventDateHijri, ...nextEvent } = next;
  return nextEvent;
}

/**
 * Returns the weekday name for a given date in either Arabic or transliterated format,
 * depending on the current Moment.js locale.
 *
 * - If the locale starts with 'ar', returns the weekday in Arabic script.
 * - Otherwise, returns the transliterated Arabic weekday name (e.g. "Al-Ithnayn").
 *
 * @param {import('moment').Moment} [date=moment()] - The date to get the weekday for. Defaults to the current date.
 * @returns {string} The localized Hijri weekday name.
 *
 * @example
 *   moment.locale('en');
 *   getHijriWeekdayLocalized(moment()); // "Al-Jumu‘ah"
 *
 *   moment.locale('ar');
 *   getHijriWeekdayLocalized(moment()); // "الجمعة"
 */
export function getHijriWeekdayLocalized(date: import('moment').Moment = moment()): string {
  const weekdayIndex = date.day();
  const currentLocale = moment.locale(); // 'en', 'ar', etc.

  if (currentLocale.startsWith('ar')) {
    return hijriWeekdaysArabic[weekdayIndex];
  } else {
    return hijriWeekdaysTranslit[weekdayIndex];
  }
}

export function parseHijriString(str) {
  // Example: "1 Ramadan 1446 AH"
  const [dayStr, monthStr, yearStr] = str.replace(' AH', '').split(' ');
  const day = parseInt(dayStr, 10);
  const month = hijriMonthsTranslit.findIndex(
    (m) => m.toLowerCase().replace(/[‘’']/g, '') === monthStr.toLowerCase().replace(/[‘’']/g, '')
  );
  const year = parseInt(yearStr, 10);

  return { day, month, year };
}

/**
 * Converts a Hijri (Islamic) year, month, and day to the corresponding Gregorian Date.
 * @param hijriYear - The Hijri year (e.g., 1446)
 * @param hijriMonth - The Hijri month (0-based: 0=Muharram, ..., 11=Dhul-Hijjah)
 * @param hijriDay - The Hijri day (1-based: 1–30)
 * @returns {Date} The corresponding Gregorian date as a JS Date object
 *
 * @example
 *   getGregorianDateForHijri(1446, 8, 1) // 1 Ramadan 1446 AH
 */
export function getGregorianDateForHijri(
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number
): Date {
  // moment-hijri expects months as 1-based (iM: 1–12)
  const hijriDate = moment(`${hijriYear}/${hijriMonth + 1}/${hijriDay}`, 'iYYYY/iM/iD');
  return hijriDate.toDate();
}

/**
 * Convert a Hijri (Islamic) date to a Gregorian Date object.
 * Algorithm: Tabular Islamic calendar → Julian Day → Gregorian calendar
 *
 * @param {number} hDay   – Hijri day (1–30)
 * @param {number} hMonth – Hijri month (1–12)
 * @param {number} hYear  – Hijri year (e.g. 1446)
 * @returns {Date}        – JavaScript Date in UTC
 */
export function hijriToGregorian(hDay, hMonth, hYear) {
  // 1) Compute the day count since the Islamic epoch:
  //    n = day + ceil(29.5*(month−1)) + (year−1)*354 + floor((3 + 11*year)/30)
  const n =
    hDay + Math.ceil(29.5 * (hMonth - 1)) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30);

  // 2) Convert Islamic day count to Julian Day:
  //    JD = n + 1948439.5 − 1
  const jd = n + 1948439.5 - 1;

  // 3) Convert Julian Day to Gregorian calendar:
  let Z = Math.floor(jd + 0.5);
  let F = jd + 0.5 - Z;
  let A =
    Z < 2299161
      ? Z
      : (() => {
          const alpha = Math.floor((Z - 1867216.25) / 36524.25);
          return Z + 1 + alpha - Math.floor(alpha / 4);
        })();
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  // Extract hours/minutes/seconds from a fractional day:
  const dayFrac = day - Math.floor(day);
  const hours = Math.floor(dayFrac * 24);
  const mins = Math.floor((dayFrac * 24 - hours) * 60);
  const secs = Math.round(((dayFrac * 24 - hours) * 60 - mins) * 60);

  // Return a UTC Date object
  return new Date(Date.UTC(year, month - 1, Math.floor(day), hours, mins, secs));
}

export function getNextHijriHolidayOrSpecialDay(holidays, hijriYear, hijriMonth, hijriDay) {
  // Find the next holiday in the given hijri year after the given hijri month and day
  let todayValue = hijriMonth * 100 + hijriDay;
  let upcoming = holidays
    .map((h) => ({
      ...h,
      value: h.month * 100 + h.day,
    }))
    .filter((h) => h.value >= todayValue)
    .sort((a, b) => a.value - b.value);

  return upcoming[0] || holidays[0]; // If none left, return first holiday (next year)
}

export function daysBetweenHijriDates(hijriDateStr1, hijriDateStr2) {
  // Parse the date strings
  const [day1, month1, year1] = hijriDateStr1.split('-').map(Number);
  const [day2, month2, year2] = hijriDateStr2.split('-').map(Number);

  // Construct HijriDate objects
  const date1 = new HijriDate(year1, month1 - 1, day1); // month is 0-based
  const date2 = new HijriDate(year2, month2 - 1, day2);

  // Convert to Gregorian
  const gDate1 = date1.toGregorian();
  const gDate2 = date2.toGregorian();

  // Calculate the difference in days
  const diffInMs = gDate2 - gDate1;
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
}