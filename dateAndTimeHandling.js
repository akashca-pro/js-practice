/**
 * TOPIC: DATE AND TIME HANDLING
 * DESCRIPTION:
 * JavaScript's Date object handles dates and times. While
 * functional, it has quirks. Understanding these plus modern
 * alternatives is essential for date manipulation.
 */

// -------------------------------------------------------------------------------------------
// 1. CREATING DATES
// -------------------------------------------------------------------------------------------

// Current date/time
const now = new Date();

// From timestamp (milliseconds since Jan 1, 1970 UTC)
const fromTimestamp = new Date(1704067200000);

// From string
const fromString = new Date('2024-01-01');
const fromISO = new Date('2024-01-01T10:30:00Z');

// From components (month is 0-indexed!)
const fromComponents = new Date(2024, 0, 1);  // Jan 1, 2024
const withTime = new Date(2024, 0, 1, 10, 30, 0);  // + 10:30:00

// Date.now() - just the timestamp
const timestamp = Date.now();

// Date.parse() - parse to timestamp
const parsed = Date.parse('2024-01-01');

// -------------------------------------------------------------------------------------------
// 2. GETTING DATE COMPONENTS
// -------------------------------------------------------------------------------------------

const date = new Date('2024-06-15T14:30:45.123Z');

// Local time getters
date.getFullYear();      // 2024
date.getMonth();         // 5 (June, 0-indexed!)
date.getDate();          // 15 (day of month)
date.getDay();           // 6 (Saturday, 0=Sunday)
date.getHours();         // Local hours
date.getMinutes();       // 30
date.getSeconds();       // 45
date.getMilliseconds();  // 123

// UTC getters
date.getUTCFullYear();   // 2024
date.getUTCMonth();      // 5
date.getUTCHours();      // 14

// Timestamp
date.getTime();          // Milliseconds since epoch
date.valueOf();          // Same as getTime()

// Timezone offset (minutes)
date.getTimezoneOffset(); // e.g., -330 for IST

// -------------------------------------------------------------------------------------------
// 3. SETTING DATE COMPONENTS
// -------------------------------------------------------------------------------------------

const d = new Date();

d.setFullYear(2025);
d.setMonth(11);          // December (0-indexed)
d.setDate(25);
d.setHours(10);
d.setMinutes(30);
d.setSeconds(0);
d.setMilliseconds(0);

// Chain-set with multiple values
d.setHours(10, 30, 0, 0);  // hours, minutes, seconds, ms

// Set from timestamp
d.setTime(1704067200000);

// UTC setters
d.setUTCHours(12);

// -------------------------------------------------------------------------------------------
// 4. FORMATTING DATES
// -------------------------------------------------------------------------------------------

const formatDate = new Date('2024-06-15T14:30:00Z');

// Built-in string methods
formatDate.toString();        // "Sat Jun 15 2024 20:00:00 GMT+0530"
formatDate.toDateString();    // "Sat Jun 15 2024"
formatDate.toTimeString();    // "20:00:00 GMT+0530"
formatDate.toISOString();     // "2024-06-15T14:30:00.000Z"
formatDate.toUTCString();     // "Sat, 15 Jun 2024 14:30:00 GMT"
formatDate.toLocaleDateString();  // "6/15/2024" (locale dependent)
formatDate.toLocaleTimeString();  // "8:00:00 PM"
formatDate.toLocaleString();      // "6/15/2024, 8:00:00 PM"

// Locale-specific formatting
formatDate.toLocaleDateString('en-US');  // "6/15/2024"
formatDate.toLocaleDateString('en-GB');  // "15/06/2024"
formatDate.toLocaleDateString('de-DE');  // "15.6.2024"

// With options
formatDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});  // "Saturday, June 15, 2024"

// -------------------------------------------------------------------------------------------
// 5. DATE ARITHMETIC
// -------------------------------------------------------------------------------------------

const baseDate = new Date('2024-01-15');

// Add days
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Add months
function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

// Add years
function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

console.log(addDays(baseDate, 10));    // Jan 25
console.log(addMonths(baseDate, 2));   // Mar 15
console.log(addYears(baseDate, 1));    // Jan 15, 2025

// Difference between dates
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
}

// -------------------------------------------------------------------------------------------
// 6. COMPARING DATES
// -------------------------------------------------------------------------------------------

const date1 = new Date('2024-01-01');
const date2 = new Date('2024-06-15');

// Compare timestamps
date1 < date2;           // true
date1.getTime() === date2.getTime();  // Compare equality

// Same day check
function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
}

// Is before/after
function isBefore(d1, d2) {
    return d1.getTime() < d2.getTime();
}

function isAfter(d1, d2) {
    return d1.getTime() > d2.getTime();
}

// -------------------------------------------------------------------------------------------
// 7. UTILITY FUNCTIONS
// -------------------------------------------------------------------------------------------

// Start of day
function startOfDay(date) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}

// End of day
function endOfDay(date) {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
}

// Start of month
function startOfMonth(date) {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
}

// Days in month
function daysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Is leap year
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

// Is weekend
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}

// -------------------------------------------------------------------------------------------
// 8. TIMEZONE HANDLING
// -------------------------------------------------------------------------------------------

// Get timezone name
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(timezone);  // e.g., "Asia/Kolkata"

// Format in specific timezone
const options = {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
};
new Date().toLocaleString('en-US', options);

// Convert to different timezone
function toTimezone(date, timezone) {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}

// -------------------------------------------------------------------------------------------
// 9. RELATIVE TIME
// -------------------------------------------------------------------------------------------

function timeAgo(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}

// Using Intl.RelativeTimeFormat
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
rtf.format(-1, 'day');   // "yesterday"
rtf.format(2, 'hour');   // "in 2 hours"

// -------------------------------------------------------------------------------------------
// 10. COMMON PITFALLS
// -------------------------------------------------------------------------------------------

// Month is 0-indexed
new Date(2024, 1, 1);   // February 1st, not January!

// Parsing inconsistencies
new Date('2024-1-1');   // May fail in some browsers
new Date('2024-01-01'); // ISO format is safest

// Timezone issues
new Date('2024-01-01');         // Parsed as UTC
new Date('2024-01-01T00:00:00'); // Parsed as local

// Mutation
const original = new Date();
const copy = original;
copy.setFullYear(2000);  // original is also changed!

// Always clone
const safeCopy = new Date(original);

// -------------------------------------------------------------------------------------------
// 11. MODERN ALTERNATIVE: TEMPORAL API (PROPOSAL)
// -------------------------------------------------------------------------------------------

/**
 * Temporal is the upcoming modern date/time API.
 * Currently at Stage 3 proposal, available via polyfill.
 * 
 * Key types:
 * - Temporal.Instant - exact moment in time
 * - Temporal.PlainDate - calendar date
 * - Temporal.PlainTime - wall-clock time
 * - Temporal.PlainDateTime - date + time
 * - Temporal.ZonedDateTime - date + time + timezone
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * CREATION:
 * - new Date(), new Date(timestamp), new Date(string)
 * - new Date(year, month, day, ...) - month is 0-indexed!
 * 
 * GETTING VALUES:
 * - getFullYear, getMonth, getDate, getDay
 * - getHours, getMinutes, getSeconds
 * - getTime (timestamp)
 * 
 * SETTING VALUES:
 * - setFullYear, setMonth, setDate
 * - Always returns new Date, mutates original
 * 
 * FORMATTING:
 * - toISOString, toLocaleDateString
 * - Intl.DateTimeFormat for advanced
 * 
 * BEST PRACTICES:
 * - Use ISO 8601 format for parsing
 * - Clone dates before mutation
 * - Use libraries (date-fns, dayjs) for complex needs
 * - Consider Temporal API when available
 */
