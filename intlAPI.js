/**
 * TOPIC: INTL API (INTERNATIONALIZATION)
 * DESCRIPTION:
 * The Intl object provides language-sensitive formatting for
 * numbers, dates, strings, and more. Essential for building
 * applications that work across different locales.
 */

// -------------------------------------------------------------------------------------------
// 1. INTL.NUMBERFORMAT
// -------------------------------------------------------------------------------------------

// Basic number formatting
const num = 1234567.89;

new Intl.NumberFormat('en-US').format(num);     // "1,234,567.89"
new Intl.NumberFormat('de-DE').format(num);     // "1.234.567,89"
new Intl.NumberFormat('en-IN').format(num);     // "12,34,567.89"

// Currency formatting
new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
}).format(1234.56);  // "$1,234.56"

new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
}).format(1234.56);  // "1.234,56 €"

new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
}).format(1234);     // "￥1,234"

// Percentage
new Intl.NumberFormat('en-US', {
    style: 'percent'
}).format(0.75);     // "75%"

// Compact notation
new Intl.NumberFormat('en-US', {
    notation: 'compact'
}).format(1500000);  // "1.5M"

new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'long'
}).format(1500000);  // "1.5 million"

// Unit formatting
new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'kilometer-per-hour'
}).format(100);      // "100 km/h"

new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'celsius'
}).format(25);       // "25°C"

// -------------------------------------------------------------------------------------------
// 2. INTL.DATETIMEFORMAT
// -------------------------------------------------------------------------------------------

const date = new Date('2024-06-15T14:30:00');

// Basic formatting
new Intl.DateTimeFormat('en-US').format(date);  // "6/15/2024"
new Intl.DateTimeFormat('de-DE').format(date);  // "15.6.2024"
new Intl.DateTimeFormat('ja-JP').format(date);  // "2024/6/15"

// With options
new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}).format(date);  // "Saturday, June 15, 2024"

// Time formatting
new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
}).format(date);  // "2:30:00 PM"

// Date styles (short, medium, long, full)
new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
}).format(date);  // "Saturday, June 15, 2024 at 2:30 PM"

// Timezone
new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short'
}).format(date);

// -------------------------------------------------------------------------------------------
// 3. INTL.RELATIVETIMEFORMAT
// -------------------------------------------------------------------------------------------

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

rtf.format(-1, 'day');      // "yesterday"
rtf.format(1, 'day');       // "tomorrow"
rtf.format(-2, 'day');      // "2 days ago"
rtf.format(3, 'week');      // "in 3 weeks"
rtf.format(-1, 'month');    // "last month"
rtf.format(0, 'day');       // "today"

// Always numeric
const rtfNumeric = new Intl.RelativeTimeFormat('en', { numeric: 'always' });
rtfNumeric.format(-1, 'day');  // "1 day ago" (not "yesterday")

// Different locales
new Intl.RelativeTimeFormat('es').format(-1, 'day');  // "hace 1 día"
new Intl.RelativeTimeFormat('ja').format(2, 'hour'); // "2 時間後"

// -------------------------------------------------------------------------------------------
// 4. INTL.LISTFORMAT
// -------------------------------------------------------------------------------------------

const items = ['Apple', 'Banana', 'Cherry'];

// Conjunction (and)
new Intl.ListFormat('en', { type: 'conjunction' }).format(items);
// "Apple, Banana, and Cherry"

// Disjunction (or)
new Intl.ListFormat('en', { type: 'disjunction' }).format(items);
// "Apple, Banana, or Cherry"

// Unit (no conjunction)
new Intl.ListFormat('en', { type: 'unit' }).format(items);
// "Apple, Banana, Cherry"

// Different locales
new Intl.ListFormat('de', { type: 'conjunction' }).format(items);
// "Apple, Banana und Cherry"

new Intl.ListFormat('ja', { type: 'conjunction' }).format(items);
// "Apple、Banana、Cherry"

// -------------------------------------------------------------------------------------------
// 5. INTL.PLURALRULES
// -------------------------------------------------------------------------------------------

const pr = new Intl.PluralRules('en');

pr.select(0);   // "other"
pr.select(1);   // "one"
pr.select(2);   // "other"
pr.select(21);  // "other" (in English)

// Create pluralized messages
function pluralize(count, singular, plural) {
    const rule = new Intl.PluralRules('en').select(count);
    return rule === 'one' ? singular : plural;
}

console.log(`You have 1 ${pluralize(1, 'message', 'messages')}`);
console.log(`You have 5 ${pluralize(5, 'message', 'messages')}`);

// Russian has more plural forms
const prRu = new Intl.PluralRules('ru');
prRu.select(1);   // "one"
prRu.select(2);   // "few"
prRu.select(5);   // "many"
prRu.select(21);  // "one"

// -------------------------------------------------------------------------------------------
// 6. INTL.COLLATOR
// -------------------------------------------------------------------------------------------

/**
 * Language-sensitive string comparison.
 */

// Basic sorting
const words = ['Z', 'a', 'z', 'ä'];

// Default sort (code points)
words.sort();  // ['Z', 'a', 'z', 'ä']

// Locale-aware sort
words.sort(new Intl.Collator('de').compare);  // ['a', 'ä', 'z', 'Z']

// Case-insensitive sort
const collator = new Intl.Collator('en', { sensitivity: 'base' });
['Apple', 'apple', 'BANANA'].sort(collator.compare);

// Numeric sorting
const numCollator = new Intl.Collator('en', { numeric: true });
['item2', 'item10', 'item1'].sort(numCollator.compare);
// ['item1', 'item2', 'item10']

// -------------------------------------------------------------------------------------------
// 7. INTL.SEGMENTER
// -------------------------------------------------------------------------------------------

/**
 * Language-sensitive text segmentation.
 */

const segmenter = new Intl.Segmenter('en', { granularity: 'word' });

const text = "Hello, world! How are you?";
const segments = segmenter.segment(text);

for (const { segment, isWordLike } of segments) {
    if (isWordLike) {
        console.log(segment);  // "Hello", "world", "How", "are", "you"
    }
}

// Sentence segmentation
const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

// Grapheme segmentation (for emojis, etc.)
const graphemeSegmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const emoji = "👨‍👩‍👧‍👦";
[...graphemeSegmenter.segment(emoji)].length;  // 1 (family emoji)
[...emoji].length;  // Many (individual code points)

// -------------------------------------------------------------------------------------------
// 8. INTL.DISPLAYNAMES
// -------------------------------------------------------------------------------------------

// Get display names for languages, regions, currencies
const dn = new Intl.DisplayNames('en', { type: 'language' });
dn.of('de');     // "German"
dn.of('ja');     // "Japanese"
dn.of('en-GB');  // "British English"

// Region names
const regions = new Intl.DisplayNames('en', { type: 'region' });
regions.of('US');  // "United States"
regions.of('JP');  // "Japan"

// Currency names
const currencies = new Intl.DisplayNames('en', { type: 'currency' });
currencies.of('USD');  // "US Dollar"
currencies.of('EUR');  // "Euro"

// Script names
const scripts = new Intl.DisplayNames('en', { type: 'script' });
scripts.of('Latn');  // "Latin"
scripts.of('Cyrl');  // "Cyrillic"

// -------------------------------------------------------------------------------------------
// 9. GETTING LOCALE INFORMATION
// -------------------------------------------------------------------------------------------

// Get user's preferred locale
const userLocale = navigator.language;  // "en-US"
const userLocales = navigator.languages; // ["en-US", "en"]

// Resolve locale options
const options = Intl.DateTimeFormat('de', {
    dateStyle: 'full'
}).resolvedOptions();

console.log(options.locale);   // "de"
console.log(options.calendar); // "gregory"

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Format file size
function formatFileSize(bytes, locale = 'en') {
    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte'];
    let unitIndex = 0;
    let size = bytes;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return new Intl.NumberFormat(locale, {
        style: 'unit',
        unit: units[unitIndex],
        maximumFractionDigits: 2
    }).format(size);
}

console.log(formatFileSize(1536000));  // "1.46 megabytes"

// Smart date formatting
function formatSmartDate(date, locale = 'en') {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
        return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
            .format(-diffDays, 'day');
    }
    
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
        .format(date);
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * FORMATTERS:
 * - NumberFormat: Numbers, currency, percentages, units
 * - DateTimeFormat: Dates and times
 * - RelativeTimeFormat: "2 days ago", "in 3 hours"
 * - ListFormat: "A, B, and C"
 * 
 * UTILITIES:
 * - PluralRules: Choose correct plural form
 * - Collator: Locale-aware string comparison
 * - Segmenter: Text segmentation
 * - DisplayNames: "de" → "German"
 * 
 * BEST PRACTICES:
 * - Use navigator.language for user's locale
 * - Cache Intl objects (expensive to create)
 * - Test with different locales
 * - Use resolvedOptions() to check actual settings
 */
