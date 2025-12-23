/**
 * TOPIC: REGULAR EXPRESSIONS
 * DESCRIPTION:
 * Regular expressions (regex) are patterns for matching text.
 * JavaScript provides regex literals and RegExp constructor
 * with powerful methods for searching and replacing text.
 */

// -------------------------------------------------------------------------------------------
// 1. CREATING REGEX
// -------------------------------------------------------------------------------------------

// Literal syntax
const regex1 = /hello/;

// Constructor syntax (for dynamic patterns)
const pattern = 'hello';
const regex2 = new RegExp(pattern);
const regex3 = new RegExp('hello', 'gi');  // With flags

// -------------------------------------------------------------------------------------------
// 2. FLAGS
// -------------------------------------------------------------------------------------------

/**
 * g - Global: Find all matches
 * i - Case-insensitive
 * m - Multiline: ^ and $ match line start/end
 * s - Dotall: . matches newlines
 * u - Unicode: Enable Unicode features
 * y - Sticky: Match from lastIndex only
 * d - Indices: Capture group indices
 */

const text = 'Hello hello HELLO';

/hello/.test(text);    // true (first match)
/hello/g.test(text);   // true (all matches)
/hello/i.test(text);   // true (case-insensitive)
/hello/gi.test(text);  // true (all, case-insensitive)

// -------------------------------------------------------------------------------------------
// 3. CHARACTER CLASSES
// -------------------------------------------------------------------------------------------

/**
 * .     - Any character except newline
 * \d    - Digit [0-9]
 * \D    - Non-digit
 * \w    - Word character [a-zA-Z0-9_]
 * \W    - Non-word character
 * \s    - Whitespace
 * \S    - Non-whitespace
 * [abc] - Any of a, b, or c
 * [^abc]- Not a, b, or c
 * [a-z] - Range a to z
 */

/\d+/.test('price: 100');      // true
/[aeiou]/.test('hello');       // true
/[^0-9]/.test('abc');          // true
/^[a-z]+$/i.test('Hello');     // true

// -------------------------------------------------------------------------------------------
// 4. QUANTIFIERS
// -------------------------------------------------------------------------------------------

/**
 * *     - 0 or more
 * +     - 1 or more
 * ?     - 0 or 1
 * {n}   - Exactly n
 * {n,}  - n or more
 * {n,m} - Between n and m
 */

/a*/.test('');        // true (0 or more a's)
/a+/.test('aaa');     // true (1 or more a's)
/a?/.test('b');       // true (0 or 1 a)
/a{3}/.test('aaa');   // true (exactly 3)
/a{2,4}/.test('aaa'); // true (2 to 4)

// Greedy vs Lazy
'<div>text</div>'.match(/<.*>/);   // '<div>text</div>' (greedy)
'<div>text</div>'.match(/<.*?>/);  // '<div>' (lazy/non-greedy)

// -------------------------------------------------------------------------------------------
// 5. ANCHORS
// -------------------------------------------------------------------------------------------

/**
 * ^     - Start of string (or line with m flag)
 * $     - End of string (or line with m flag)
 * \b    - Word boundary
 * \B    - Not word boundary
 */

/^hello/.test('hello world');  // true
/world$/.test('hello world');  // true
/\bword\b/.test('a word here'); // true
/\bword\b/.test('keyword');    // false

// -------------------------------------------------------------------------------------------
// 6. GROUPS AND CAPTURING
// -------------------------------------------------------------------------------------------

// Capturing groups ()
const dateRegex = /(\d{4})-(\d{2})-(\d{2})/;
const match = '2024-01-15'.match(dateRegex);
// ['2024-01-15', '2024', '01', '15']
console.log(match[1]);  // '2024' (year)

// Named capturing groups
const namedRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const namedMatch = '2024-01-15'.match(namedRegex);
console.log(namedMatch.groups.year);   // '2024'
console.log(namedMatch.groups.month);  // '01'

// Non-capturing group (?:)
const nonCapturing = /(?:https?|ftp):\/\//;
// Groups but doesn't capture

// Backreference
/(['"]).*?\1/.test('"quoted"');  // true (\1 refers to first group)

// -------------------------------------------------------------------------------------------
// 7. LOOKAHEAD AND LOOKBEHIND
// -------------------------------------------------------------------------------------------

/**
 * (?=...)  - Positive lookahead
 * (?!...)  - Negative lookahead
 * (?<=...) - Positive lookbehind
 * (?<!...) - Negative lookbehind
 */

// Positive lookahead: Match 'foo' followed by 'bar'
/foo(?=bar)/.test('foobar');  // true
/foo(?=bar)/.test('foobaz');  // false

// Negative lookahead: Match 'foo' NOT followed by 'bar'
/foo(?!bar)/.test('foobaz');  // true

// Positive lookbehind: Match 'bar' preceded by 'foo'
/(?<=foo)bar/.test('foobar'); // true

// Negative lookbehind: Match 'bar' NOT preceded by 'foo'
/(?<!foo)bar/.test('bazbar'); // true

// Password validation example
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
// Must contain uppercase, lowercase, digit, min 8 chars

// -------------------------------------------------------------------------------------------
// 8. REGEX METHODS
// -------------------------------------------------------------------------------------------

const str = 'The quick brown fox';

// test() - returns boolean
/fox/.test(str);  // true

// exec() - returns match array with details
const execResult = /(\w+)/.exec(str);
// ['The', 'The', index: 0, input: 'The quick brown fox', groups: undefined]

// match() - returns matches
str.match(/\w+/g);  // ['The', 'quick', 'brown', 'fox']

// matchAll() - returns iterator (ES2020)
for (const m of str.matchAll(/\w+/g)) {
    console.log(m[0], m.index);
}

// search() - returns index
str.search(/quick/);  // 4

// replace() - replace matches
str.replace(/fox/, 'dog');  // 'The quick brown dog'

// replaceAll() - replace all matches (ES2021)
'a-b-c'.replaceAll('-', '_');  // 'a_b_c'

// split() - split by pattern
'a, b,  c'.split(/,\s*/);  // ['a', 'b', 'c']

// -------------------------------------------------------------------------------------------
// 9. REPLACE WITH FUNCTIONS
// -------------------------------------------------------------------------------------------

// Replace callback
'hello world'.replace(/\w+/g, (match, offset) => {
    return match.toUpperCase();
});
// 'HELLO WORLD'

// With captured groups
'John Smith'.replace(/(\w+) (\w+)/, (_, first, last) => {
    return `${last}, ${first}`;
});
// 'Smith, John'

// Replace patterns
// $& - entire match
// $1, $2, etc - captured groups
// $` - before match
// $' - after match

// -------------------------------------------------------------------------------------------
// 10. COMMON PATTERNS
// -------------------------------------------------------------------------------------------

// Email (basic)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL
const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

// Phone (US)
const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;

// IP Address
const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

// Hex color
const hexColorRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;

// Slug
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// -------------------------------------------------------------------------------------------
// 11. ESCAPING SPECIAL CHARACTERS
// -------------------------------------------------------------------------------------------

// Characters that need escaping: \ ^ $ . | ? * + ( ) [ ] { }

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const userInput = 'file.txt';
const escaped = escapeRegex(userInput);
const dynamicRegex = new RegExp(escaped);

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Extract all numbers
function extractNumbers(str) {
    return (str.match(/\d+\.?\d*/g) || []).map(Number);
}
extractNumbers('Price: $19.99, Qty: 3');  // [19.99, 3]

// Validate and extract email parts
function parseEmail(email) {
    const match = email.match(/^([^@]+)@([^@]+)$/);
    if (!match) return null;
    return { local: match[1], domain: match[2] };
}

// Highlight search term
function highlight(text, term) {
    const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Template variable replacement
function template(str, data) {
    return str.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
}
template('Hello {{name}}!', { name: 'Alice' });  // 'Hello Alice!'

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SYNTAX:
 * - /pattern/flags or new RegExp(pattern, flags)
 * - Flags: g (global), i (case), m (multiline)
 * 
 * CHARACTER CLASSES:
 * - \d, \w, \s, [abc], [^abc], [a-z], .
 * 
 * QUANTIFIERS:
 * - *, +, ?, {n}, {n,}, {n,m}, *? (lazy)
 * 
 * GROUPS:
 * - (capture), (?:non-capture), (?<name>named)
 * - (?=lookahead), (?!neg lookahead)
 * 
 * METHODS:
 * - test(), exec(), match(), matchAll()
 * - replace(), replaceAll(), split(), search()
 */
