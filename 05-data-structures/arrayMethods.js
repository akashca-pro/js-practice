/**
 * TOPIC: ARRAY METHODS
 * DESCRIPTION:
 * JavaScript arrays have powerful built-in methods for iteration,
 * transformation, searching, and manipulation. Mastering these
 * methods leads to cleaner, more functional code.
 */

// -------------------------------------------------------------------------------------------
// 1. ITERATION METHODS
// -------------------------------------------------------------------------------------------

const numbers = [1, 2, 3, 4, 5];

// forEach - iterate without returning
numbers.forEach((value, index, array) => {
    console.log(`Index ${index}: ${value}`);
});

// for...of - modern iteration
for (const num of numbers) {
    console.log(num);
}

// entries, keys, values
for (const [index, value] of numbers.entries()) {
    console.log(index, value);
}

// -------------------------------------------------------------------------------------------
// 2. TRANSFORMATION METHODS
// -------------------------------------------------------------------------------------------

// map - transform each element
const doubled = numbers.map(n => n * 2);  // [2, 4, 6, 8, 10]

// flatMap - map + flatten one level
const nested = [[1, 2], [3, 4]];
const flattened = nested.flatMap(arr => arr);  // [1, 2, 3, 4]

// flat - flatten nested arrays
const deepNested = [1, [2, [3, [4]]]];
console.log(deepNested.flat(1));    // [1, 2, [3, [4]]]
console.log(deepNested.flat(2));    // [1, 2, 3, [4]]
console.log(deepNested.flat(Infinity));  // [1, 2, 3, 4]

// -------------------------------------------------------------------------------------------
// 3. FILTERING METHODS
// -------------------------------------------------------------------------------------------

// filter - select matching elements
const evens = numbers.filter(n => n % 2 === 0);  // [2, 4]

// find - first matching element
const found = numbers.find(n => n > 3);  // 4

// findIndex - index of first match
const foundIndex = numbers.findIndex(n => n > 3);  // 3

// findLast, findLastIndex (ES2023)
const lastEven = numbers.findLast(n => n % 2 === 0);  // 4
const lastEvenIndex = numbers.findLastIndex(n => n % 2 === 0);  // 3

// -------------------------------------------------------------------------------------------
// 4. TESTING METHODS
// -------------------------------------------------------------------------------------------

// every - all elements pass test?
const allPositive = numbers.every(n => n > 0);  // true

// some - any element passes test?
const hasEven = numbers.some(n => n % 2 === 0);  // true

// includes - contains value?
const hasThree = numbers.includes(3);  // true

// -------------------------------------------------------------------------------------------
// 5. REDUCTION METHODS
// -------------------------------------------------------------------------------------------

// reduce - accumulate to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);  // 15

const max = numbers.reduce((a, b) => Math.max(a, b));  // 5

// Group by property (reduce pattern)
const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 30 }
];

const byAge = people.reduce((groups, person) => {
    const age = person.age;
    if (!groups[age]) groups[age] = [];
    groups[age].push(person);
    return groups;
}, {});

// reduceRight - reduce from right to left
const reversed = numbers.reduceRight((acc, n) => acc.concat(n), []);

// -------------------------------------------------------------------------------------------
// 6. ADDING/REMOVING ELEMENTS
// -------------------------------------------------------------------------------------------

const arr = [1, 2, 3];

// push - add to end (mutates)
arr.push(4);        // [1, 2, 3, 4]

// pop - remove from end (mutates)
const last = arr.pop();  // 4, arr = [1, 2, 3]

// unshift - add to beginning (mutates)
arr.unshift(0);     // [0, 1, 2, 3]

// shift - remove from beginning (mutates)
const first = arr.shift();  // 0, arr = [1, 2, 3]

// concat - combine arrays (immutable)
const combined = [1, 2].concat([3, 4], [5]);  // [1, 2, 3, 4, 5]

// -------------------------------------------------------------------------------------------
// 7. SLICING AND SPLICING
// -------------------------------------------------------------------------------------------

const items = [1, 2, 3, 4, 5];

// slice - extract portion (immutable)
const sliced = items.slice(1, 4);  // [2, 3, 4]
const copy = items.slice();         // Full copy

// splice - add/remove in place (mutates)
const removed = items.splice(1, 2);        // Removes 2 elements at index 1
// items = [1, 4, 5], removed = [2, 3]

items.splice(1, 0, 'a', 'b');  // Insert at index 1
// items = [1, 'a', 'b', 4, 5]

// toSpliced (ES2023) - immutable splice
const newArray = [1, 2, 3].toSpliced(1, 1, 'a');  // [1, 'a', 3]

// -------------------------------------------------------------------------------------------
// 8. SORTING AND REVERSING
// -------------------------------------------------------------------------------------------

const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];

// sort - sorts in place (mutates)
unsorted.sort((a, b) => a - b);  // Ascending
unsorted.sort((a, b) => b - a);  // Descending

// toSorted (ES2023) - immutable sort
const sorted = [3, 1, 2].toSorted((a, b) => a - b);

// reverse - reverses in place (mutates)
const reversed2 = [1, 2, 3].reverse();  // [3, 2, 1]

// toReversed (ES2023) - immutable reverse
const reversedCopy = [1, 2, 3].toReversed();

// -------------------------------------------------------------------------------------------
// 9. SEARCHING
// -------------------------------------------------------------------------------------------

const searchArr = [1, 2, 3, 2, 1];

// indexOf - first index of value
searchArr.indexOf(2);       // 1
searchArr.indexOf(2, 2);    // 3 (start from index 2)

// lastIndexOf - last index of value
searchArr.lastIndexOf(2);   // 3

// -------------------------------------------------------------------------------------------
// 10. JOINING AND SPLITTING
// -------------------------------------------------------------------------------------------

// join - array to string
const joined = [1, 2, 3].join('-');  // "1-2-3"
const words = ['Hello', 'World'].join(' ');  // "Hello World"

// Array.from - create array from iterable
const fromString = Array.from('hello');  // ['h', 'e', 'l', 'l', 'o']
const fromSet = Array.from(new Set([1, 1, 2]));  // [1, 2]

// Array.from with map
const squares = Array.from({ length: 5 }, (_, i) => i * i);
// [0, 1, 4, 9, 16]

// -------------------------------------------------------------------------------------------
// 11. STATIC METHODS
// -------------------------------------------------------------------------------------------

// Array.isArray
Array.isArray([1, 2]);  // true
Array.isArray('hello'); // false

// Array.of - create array from arguments
Array.of(1, 2, 3);  // [1, 2, 3]
Array.of(3);        // [3] (not [undefined, undefined, undefined])

// -------------------------------------------------------------------------------------------
// 12. FILLING AND COPYING
// -------------------------------------------------------------------------------------------

// fill - fill with value (mutates)
new Array(3).fill(0);        // [0, 0, 0]
[1, 2, 3].fill('x', 1, 2);   // [1, 'x', 3]

// copyWithin - copy within array (mutates)
[1, 2, 3, 4, 5].copyWithin(0, 3);  // [4, 5, 3, 4, 5]

// with (ES2023) - immutable replacement at index
const withReplaced = [1, 2, 3].with(1, 'two');  // [1, 'two', 3]

// -------------------------------------------------------------------------------------------
// 13. ADVANCED PATTERNS
// -------------------------------------------------------------------------------------------

// Remove duplicates
const unique = [...new Set([1, 1, 2, 2, 3])];  // [1, 2, 3]

// Chunk array
function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    );
}

// Shuffle array
function shuffle(arr) {
    return arr.toSorted(() => Math.random() - 0.5);
}

// Intersection
const intersection = (a, b) => a.filter(x => b.includes(x));

// Difference
const difference = (a, b) => a.filter(x => !b.includes(x));

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * IMMUTABLE (return new array):
 * map, filter, flat, flatMap, concat, slice, toSorted, toReversed, toSpliced
 * 
 * MUTATING:
 * push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin
 * 
 * SEARCHING:
 * find, findIndex, indexOf, lastIndexOf, includes
 * 
 * TESTING:
 * every, some
 * 
 * REDUCING:
 * reduce, reduceRight
 */
