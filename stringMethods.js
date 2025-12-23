/**
 * TOPIC: STRING METHODS
 * DESCRIPTION:
 * JavaScript strings are immutable sequences of characters. String methods
 * provide powerful ways to search, extract, transform, and manipulate text.
 */

// -------------------------------------------------------------------------------------------
// 1. ACCESSING CHARACTERS
// -------------------------------------------------------------------------------------------

const str = 'Hello World';

// Character access
str.charAt(0);      // 'H'
str[0];             // 'H'
str.charCodeAt(0);  // 72 (Unicode code point)
str.codePointAt(0); // 72 (supports emojis/surrogates)

// String.fromCharCode
String.fromCharCode(72, 101, 108, 108, 111);  // 'Hello'

// String.fromCodePoint (ES6)
String.fromCodePoint(128512);  // '😀'

// -------------------------------------------------------------------------------------------
// 2. SEARCHING
// -------------------------------------------------------------------------------------------

const text = 'The quick brown fox jumps over the lazy dog';

// indexOf - first occurrence
text.indexOf('fox');        // 16
text.indexOf('cat');        // -1 (not found)
text.indexOf('o', 10);      // 12 (start from index 10)

// lastIndexOf - last occurrence
text.lastIndexOf('o');      // 41

// includes - contains substring?
text.includes('quick');     // true
text.includes('Quick');     // false (case-sensitive)

// startsWith, endsWith
text.startsWith('The');     // true
text.endsWith('dog');       // true
text.startsWith('quick', 4);  // true (start from index 4)

// search - with regex
text.search(/fox/);         // 16
text.search(/\d/);          // -1 (no digits)

// -------------------------------------------------------------------------------------------
// 3. EXTRACTING SUBSTRINGS
// -------------------------------------------------------------------------------------------

const sample = 'JavaScript';

// slice(start, end) - start to end (exclusive)
sample.slice(0, 4);     // 'Java'
sample.slice(4);        // 'Script'
sample.slice(-6);       // 'Script' (from end)
sample.slice(-6, -3);   // 'Scr'

// substring(start, end) - similar to slice, no negative indices
sample.substring(0, 4); // 'Java'
sample.substring(4, 0); // 'Java' (swaps if start > end)

// substr(start, length) - DEPRECATED
sample.substr(4, 6);    // 'Script'

// at(index) - ES2022, supports negative indices
sample.at(0);           // 'J'
sample.at(-1);          // 't'

// -------------------------------------------------------------------------------------------
// 4. TRANSFORMING CASE
// -------------------------------------------------------------------------------------------

const mixed = 'Hello World';

mixed.toLowerCase();     // 'hello world'
mixed.toUpperCase();     // 'HELLO WORLD'

// Locale-aware
'i'.toLocaleUpperCase('tr-TR');  // 'İ' (Turkish)

// -------------------------------------------------------------------------------------------
// 5. TRIMMING AND PADDING
// -------------------------------------------------------------------------------------------

const padded = '   hello   ';

// trim - both ends
padded.trim();          // 'hello'

// trimStart / trimEnd
padded.trimStart();     // 'hello   '
padded.trimEnd();       // '   hello'

// padStart / padEnd
'5'.padStart(3, '0');   // '005'
'5'.padEnd(3, '0');     // '500'
'abc'.padStart(5);      // '  abc' (default pad is space)

// -------------------------------------------------------------------------------------------
// 6. REPLACING
// -------------------------------------------------------------------------------------------

const sentence = 'cat cat cat';

// replace - first occurrence
sentence.replace('cat', 'dog');   // 'dog cat cat'

// replaceAll (ES2021)
sentence.replaceAll('cat', 'dog');  // 'dog dog dog'

// With regex
sentence.replace(/cat/g, 'dog');    // 'dog dog dog'

// With function
'hello'.replace(/./g, char => char.toUpperCase());  // 'HELLO'

// Replace captures
'John Smith'.replace(/(\w+) (\w+)/, '$2, $1');  // 'Smith, John'

// -------------------------------------------------------------------------------------------
// 7. SPLITTING AND JOINING
// -------------------------------------------------------------------------------------------

const csv = 'apple,banana,cherry';

// split
csv.split(',');         // ['apple', 'banana', 'cherry']
csv.split(',', 2);      // ['apple', 'banana'] (limit)
'hello'.split('');      // ['h', 'e', 'l', 'l', 'o']

// join (Array method, but related)
['a', 'b', 'c'].join('-');  // 'a-b-c'

// -------------------------------------------------------------------------------------------
// 8. REPEATING AND CONCATENATING
// -------------------------------------------------------------------------------------------

// repeat
'abc'.repeat(3);        // 'abcabcabc'

// concat
'Hello'.concat(' ', 'World');  // 'Hello World'

// Template literals (preferred)
const name = 'World';
`Hello ${name}`;        // 'Hello World'

// -------------------------------------------------------------------------------------------
// 9. MATCHING AND REGEX
// -------------------------------------------------------------------------------------------

const data = 'price: $100, discount: $20';

// match - returns matches
data.match(/\$\d+/g);   // ['$100', '$20']
'abc'.match(/x/);       // null

// matchAll (ES2020) - returns iterator with groups
for (const match of data.matchAll(/\$(\d+)/g)) {
    console.log(match[0], match[1]);  // '$100' '100', '$20' '20'
}

// -------------------------------------------------------------------------------------------
// 10. NORMALIZATION (Unicode)
// -------------------------------------------------------------------------------------------

// normalize - Unicode normalization
const a1 = '\u00F1';      // ñ (single code point)
const a2 = 'n\u0303';     // ñ (n + combining tilde)

a1 === a2;                        // false
a1.normalize() === a2.normalize();  // true

// -------------------------------------------------------------------------------------------
// 11. LOCALECOMPARE
// -------------------------------------------------------------------------------------------

// Locale-aware string comparison
'ä'.localeCompare('z', 'de');  // -1 (in German, ä comes before z)
'ä'.localeCompare('z', 'sv');  // 1 (in Swedish, ä comes after z)

// Case-insensitive sort
const words = ['Apple', 'apple', 'Banana'];
words.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Capitalize first letter
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Title case
function titleCase(str) {
    return str.split(' ').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}

// Truncate with ellipsis
function truncate(str, length) {
    return str.length > length ? str.slice(0, length - 3) + '...' : str;
}

// Slug generation
function slugify(str) {
    return str.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
}

// Count occurrences
function countOccurrences(str, substr) {
    return str.split(substr).length - 1;
}

// Reverse string
function reverse(str) {
    return [...str].reverse().join('');
}

// Check palindrome
function isPalindrome(str) {
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return clean === reverse(clean);
}

// -------------------------------------------------------------------------------------------
// 13. TEMPLATE LITERALS
// -------------------------------------------------------------------------------------------

const user = { name: 'Alice', age: 25 };

// Basic interpolation
`Name: ${user.name}, Age: ${user.age}`;

// Multi-line
const multiLine = `
    Line 1
    Line 2
    Line 3
`;

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] ? `<mark>${values[i]}</mark>` : '');
    }, '');
}

highlight`Hello ${user.name}!`;  // 'Hello <mark>Alice</mark>!'

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SEARCHING:
 * indexOf, lastIndexOf, includes, startsWith, endsWith, search
 * 
 * EXTRACTING:
 * slice, substring, at, charAt
 * 
 * TRANSFORMING:
 * toLowerCase, toUpperCase, trim, trimStart, trimEnd, padStart, padEnd
 * 
 * REPLACING:
 * replace, replaceAll
 * 
 * SPLITTING/JOINING:
 * split, concat, repeat
 * 
 * REGEX:
 * match, matchAll, search
 */
