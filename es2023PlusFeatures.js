/**
 * TOPIC: ES2023+ FEATURES
 * DESCRIPTION:
 * Modern JavaScript additions that improve array manipulation,
 * object handling, and async patterns. These features make
 * code more readable and functional.
 */

// -------------------------------------------------------------------------------------------
// 1. ARRAY.FINDLAST() AND FINDLASTINDEX() (ES2023)
// -------------------------------------------------------------------------------------------

const numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

// Find from the end
const lastEven = numbers.findLast(n => n % 2 === 0);
console.log(lastEven);  // 2 (last even number)

const lastEvenIndex = numbers.findLastIndex(n => n % 2 === 0);
console.log(lastEvenIndex);  // 7

// Compare with find/findIndex (from start)
const firstEven = numbers.find(n => n % 2 === 0);
console.log(firstEven);  // 2 (first even number)

const firstEvenIndex = numbers.findIndex(n => n % 2 === 0);
console.log(firstEvenIndex);  // 1

// -------------------------------------------------------------------------------------------
// 2. ARRAY.TOREVERSED(), TOSORTED(), TOSPLICED() (ES2023)
// -------------------------------------------------------------------------------------------

/**
 * Non-mutating versions of reverse, sort, and splice.
 * Return new arrays instead of modifying in place.
 */

const original = [3, 1, 4, 1, 5, 9, 2, 6];

// toReversed() - non-mutating reverse
const reversed = original.toReversed();
console.log(reversed);   // [6, 2, 9, 5, 1, 4, 1, 3]
console.log(original);   // [3, 1, 4, 1, 5, 9, 2, 6] (unchanged)

// toSorted() - non-mutating sort
const sorted = original.toSorted((a, b) => a - b);
console.log(sorted);     // [1, 1, 2, 3, 4, 5, 6, 9]
console.log(original);   // [3, 1, 4, 1, 5, 9, 2, 6] (unchanged)

// toSpliced() - non-mutating splice
const spliced = original.toSpliced(2, 2, 'a', 'b');
console.log(spliced);    // [3, 1, 'a', 'b', 5, 9, 2, 6]
console.log(original);   // [3, 1, 4, 1, 5, 9, 2, 6] (unchanged)

// -------------------------------------------------------------------------------------------
// 3. ARRAY.WITH() (ES2023)
// -------------------------------------------------------------------------------------------

/**
 * Non-mutating way to change a single element.
 */

const arr = ['a', 'b', 'c', 'd'];

// Replace at index
const newArr = arr.with(1, 'X');
console.log(newArr);  // ['a', 'X', 'c', 'd']
console.log(arr);     // ['a', 'b', 'c', 'd'] (unchanged)

// Negative index
const fromEnd = arr.with(-1, 'Z');
console.log(fromEnd);  // ['a', 'b', 'c', 'Z']

// Chaining
const chained = arr
    .with(0, 'A')
    .with(1, 'B')
    .with(2, 'C');

// -------------------------------------------------------------------------------------------
// 4. OBJECT.GROUPBY() (ES2024)
// -------------------------------------------------------------------------------------------

/**
 * Group array elements by key.
 */

const people = [
    { name: 'Alice', age: 25, role: 'developer' },
    { name: 'Bob', age: 30, role: 'designer' },
    { name: 'Charlie', age: 25, role: 'developer' },
    { name: 'David', age: 35, role: 'manager' }
];

// Group by role
const byRole = Object.groupBy(people, person => person.role);
console.log(byRole);
// {
//   developer: [{ name: 'Alice', ... }, { name: 'Charlie', ... }],
//   designer: [{ name: 'Bob', ... }],
//   manager: [{ name: 'David', ... }]
// }

// Group by age range
const byAgeRange = Object.groupBy(people, person => {
    if (person.age < 30) return 'young';
    if (person.age < 40) return 'middle';
    return 'senior';
});

// Map.groupBy for Map result
const asMap = Map.groupBy(people, person => person.role);
console.log(asMap.get('developer'));

// -------------------------------------------------------------------------------------------
// 5. PROMISE.WITHRESOLVERS() (ES2024)
// -------------------------------------------------------------------------------------------

/**
 * Create promise with external resolve/reject.
 */

// Before
/*
let resolve, reject;
const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
});
*/

// After
const { promise, resolve, reject } = Promise.withResolvers();

// Use externally
setTimeout(() => resolve('Done!'), 1000);

// Practical use: deferred pattern
function createDeferred() {
    return Promise.withResolvers();
}

const deferred = createDeferred();
// Later...
deferred.resolve('Result');

// -------------------------------------------------------------------------------------------
// 6. ARRAY.AT() (ES2022 - REVIEW)
// -------------------------------------------------------------------------------------------

const array = ['a', 'b', 'c', 'd', 'e'];

// Positive index
array.at(0);   // 'a'
array.at(2);   // 'c'

// Negative index (from end)
array.at(-1);  // 'e' (last element)
array.at(-2);  // 'd' (second to last)

// Better than array[array.length - 1]
const lastItem = array.at(-1);

// Works on strings too
'hello'.at(-1);  // 'o'

// -------------------------------------------------------------------------------------------
// 7. OBJECT.HASOWN() (ES2022)
// -------------------------------------------------------------------------------------------

/**
 * Safer alternative to hasOwnProperty.
 */

const obj = {
    name: 'Alice',
    hasOwnProperty: 'oops'  // Overwritten!
};

// Unsafe (method overwritten)
// obj.hasOwnProperty('name');  // TypeError!

// Safe
Object.prototype.hasOwnProperty.call(obj, 'name');  // true

// Best (ES2022)
Object.hasOwn(obj, 'name');  // true
Object.hasOwn(obj, 'age');   // false

// Works with Object.create(null)
const nullProto = Object.create(null);
nullProto.key = 'value';
Object.hasOwn(nullProto, 'key');  // true

// -------------------------------------------------------------------------------------------
// 8. ERROR.CAUSE (ES2022)
// -------------------------------------------------------------------------------------------

/**
 * Chain errors with cause.
 */

async function fetchData() {
    try {
        const response = await fetch('/api/data');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch data', { cause: error });
    }
}

// Accessing the cause
try {
    await fetchData();
} catch (error) {
    console.log(error.message);  // "Failed to fetch data"
    console.log(error.cause);    // Original fetch error
}

// Creating custom errors with cause
class DatabaseError extends Error {
    constructor(message, options) {
        super(message, options);
        this.name = 'DatabaseError';
    }
}

function queryDatabase() {
    try {
        // Database operation
    } catch (error) {
        throw new DatabaseError('Query failed', { cause: error });
    }
}

// -------------------------------------------------------------------------------------------
// 9. REGEXP /D, /S, /V FLAGS (ES2022/2024)
// -------------------------------------------------------------------------------------------

// /d flag - indices for matches
const re = /a+/d;
const match = re.exec('baaab');
console.log(match.indices);  // [[1, 4]]

// /v flag (ES2024) - Unicode sets
const emoji = /[\p{Emoji}--\p{ASCII}]/v;  // Set subtraction!
emoji.test('😀');  // true
emoji.test('1');   // false

// -------------------------------------------------------------------------------------------
// 10. HASHBANG GRAMMAR (ES2023)
// -------------------------------------------------------------------------------------------

/**
 * Official support for #!/usr/bin/env node
 */

// At the very start of a file:
// #!/usr/bin/env node
// console.log('Hello from CLI');

// -------------------------------------------------------------------------------------------
// 11. SYMBOL.DISPOSE AND USING (ES2024)
// -------------------------------------------------------------------------------------------

/**
 * Resource management with using declarations.
 */

class FileHandle {
    constructor(name) {
        this.name = name;
        console.log(`Opening ${name}`);
    }
    
    [Symbol.dispose]() {
        console.log(`Closing ${this.name}`);
    }
}

// Using declaration (explicit resource management)
// {
//     using file = new FileHandle('data.txt');
//     // Use file...
// }  // file[Symbol.dispose]() called automatically

// Async version
class AsyncResource {
    async [Symbol.asyncDispose]() {
        await this.close();
    }
    
    async close() {
        console.log('Async cleanup');
    }
}

// await using resource = new AsyncResource();

// -------------------------------------------------------------------------------------------
// 12. TOP-LEVEL AWAIT (ES2022)
// -------------------------------------------------------------------------------------------

/**
 * Await at module level without wrapping in async function.
 */

// In a module (.mjs or type="module"):
/*
const response = await fetch('/api/config');
const config = await response.json();

export { config };
*/

// Dynamic import with await
// const module = await import('./dynamic.js');

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * ES2023:
 * - findLast(), findLastIndex()
 * - toReversed(), toSorted(), toSpliced()
 * - Array.with()
 * - Hashbang (#!) support
 * 
 * ES2024:
 * - Object.groupBy(), Map.groupBy()
 * - Promise.withResolvers()
 * - Symbol.dispose, using declarations
 * - RegExp /v flag
 * 
 * ES2022:
 * - Array.at()
 * - Object.hasOwn()
 * - Error.cause
 * - Top-level await
 * - Private class fields (#)
 * - RegExp /d flag
 * 
 * BENEFITS:
 * - More functional (non-mutating methods)
 * - Cleaner syntax
 * - Better error handling
 * - Resource management
 */
