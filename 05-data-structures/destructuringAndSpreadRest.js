/**
 * TOPIC: DESTRUCTURING & SPREAD/REST OPERATORS
 * DESCRIPTION:
 * Destructuring extracts values from arrays/objects into variables.
 * Spread (...) expands iterables. Rest (...) collects remaining elements.
 * These ES6 features make code more concise and readable.
 */

// -------------------------------------------------------------------------------------------
// 1. ARRAY DESTRUCTURING
// -------------------------------------------------------------------------------------------

const colors = ['red', 'green', 'blue'];

// Basic destructuring
const [first, second, third] = colors;
console.log(first);   // 'red'
console.log(second);  // 'green'

// Skip elements
const [, , blue] = colors;
console.log(blue);    // 'blue'

// Default values
const [a, b, c, d = 'yellow'] = colors;
console.log(d);       // 'yellow' (default, not in array)

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);    // 2, 1

// -------------------------------------------------------------------------------------------
// 2. OBJECT DESTRUCTURING
// -------------------------------------------------------------------------------------------

const person = {
    name: 'Alice',
    age: 25,
    city: 'NYC'
};

// Basic destructuring
const { name, age } = person;
console.log(name);    // 'Alice'

// Rename variables
const { name: userName, age: userAge } = person;
console.log(userName); // 'Alice'

// Default values
const { name: n, country = 'USA' } = person;
console.log(country); // 'USA'

// Rename with default
const { zip: zipCode = '00000' } = person;
console.log(zipCode); // '00000'

// -------------------------------------------------------------------------------------------
// 3. NESTED DESTRUCTURING
// -------------------------------------------------------------------------------------------

const user = {
    id: 1,
    profile: {
        name: 'Bob',
        address: {
            city: 'LA',
            zip: '90001'
        }
    }
};

// Nested object destructuring
const { profile: { name: profileName, address: { city } } } = user;
console.log(profileName);  // 'Bob'
console.log(city);         // 'LA'

// Nested array
const matrix = [[1, 2], [3, 4]];
const [[a1, b1], [c1, d1]] = matrix;

// Mixed nesting
const data = [{ id: 1 }, { id: 2 }];
const [{ id: firstId }, { id: secondId }] = data;

// -------------------------------------------------------------------------------------------
// 4. REST IN DESTRUCTURING
// -------------------------------------------------------------------------------------------

// Rest with arrays
const nums = [1, 2, 3, 4, 5];
const [head, ...tail] = nums;
console.log(head);  // 1
console.log(tail);  // [2, 3, 4, 5]

// Rest with objects
const { name: personName, ...rest } = person;
console.log(rest);  // { age: 25, city: 'NYC' }

// -------------------------------------------------------------------------------------------
// 5. SPREAD OPERATOR - ARRAYS
// -------------------------------------------------------------------------------------------

const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// Copy array
const copy = [...arr1];

// Add elements
const withMore = [0, ...arr1, 4];  // [0, 1, 2, 3, 4]

// Convert iterable to array
const chars = [...'hello'];  // ['h', 'e', 'l', 'l', 'o']
const setToArray = [...new Set([1, 1, 2])];  // [1, 2]

// -------------------------------------------------------------------------------------------
// 6. SPREAD OPERATOR - OBJECTS
// -------------------------------------------------------------------------------------------

const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };

// Combine objects
const merged = { ...obj1, ...obj2 };  // { a: 1, b: 2, c: 3, d: 4 }

// Override properties
const updated = { ...obj1, b: 10 };   // { a: 1, b: 10 }

// Copy object
const clone = { ...obj1 };

// Add properties
const extended = { ...obj1, e: 5 };

// -------------------------------------------------------------------------------------------
// 7. SPREAD IN FUNCTION CALLS
// -------------------------------------------------------------------------------------------

function sum(a, b, c) {
    return a + b + c;
}

const numbers2 = [1, 2, 3];
console.log(sum(...numbers2));  // 6

// Instead of apply
Math.max(...numbers2);  // 3
Math.min(...numbers2);  // 1

// -------------------------------------------------------------------------------------------
// 8. REST PARAMETERS
// -------------------------------------------------------------------------------------------

// Collect all arguments
function logAll(...args) {
    console.log(args);  // Array of all arguments
}
logAll(1, 2, 3);  // [1, 2, 3]

// Rest after required params
function showFirst(first, ...rest) {
    console.log('First:', first);
    console.log('Rest:', rest);
}
showFirst(1, 2, 3, 4);  // First: 1, Rest: [2, 3, 4]

// -------------------------------------------------------------------------------------------
// 9. FUNCTION PARAMETER DESTRUCTURING
// -------------------------------------------------------------------------------------------

// Object parameter destructuring
function createUser({ name, age, role = 'user' }) {
    return { name, age, role };
}
createUser({ name: 'Alice', age: 25 });

// With defaults for the whole object
function greet({ name = 'Guest', greeting = 'Hello' } = {}) {
    console.log(`${greeting}, ${name}!`);
}
greet();  // 'Hello, Guest!'
greet({ name: 'Bob' });  // 'Hello, Bob!'

// Array parameter destructuring
function getXY([x, y]) {
    return { x, y };
}
getXY([10, 20]);  // { x: 10, y: 20 }

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Extract specific properties
function processUser(user) {
    const { name, email } = user;
    // Only work with name and email
}

// Clone and modify
const updateUser = (user, updates) => ({
    ...user,
    ...updates,
    updatedAt: new Date()
});

// Remove property
const removeProperty = ({ propToRemove, ...rest }) => rest;

// Pick specific properties
const pick = (obj, keys) => {
    return keys.reduce((result, key) => {
        if (key in obj) result[key] = obj[key];
        return result;
    }, {});
};

// Omit specific properties
const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

// Merge with deep clone
const deepMerge = (target, source) => {
    return Object.keys(source).reduce((result, key) => {
        if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
        return result;
    }, { ...target });
};

// -------------------------------------------------------------------------------------------
// 11. COMMON USE CASES
// -------------------------------------------------------------------------------------------

// API response handling
async function fetchData() {
    const response = await fetch('/api/user');
    const { data: { user, token }, status } = await response.json();
}

// React-style props
function Component({ title, children, onClick, ...props }) {
    // title, children, onClick extracted
    // props contains remaining properties
}

// Import subset
// const { map, filter, reduce } = require('lodash');

// Array operations
const [first2, ...remaining] = [1, 2, 3, 4];
const last = [...array].pop();  // Get last without mutation

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * DESTRUCTURING:
 * - Extract values from arrays/objects
 * - Default values: [a = 1] or { a = 1 }
 * - Rename: { oldName: newName }
 * - Nested: { outer: { inner } }
 * 
 * SPREAD (...):
 * - Expand arrays: [...arr1, ...arr2]
 * - Expand objects: { ...obj1, ...obj2 }
 * - Function calls: fn(...args)
 * 
 * REST (...):
 * - Collect remaining elements: [first, ...rest]
 * - Collect remaining properties: { a, ...rest }
 * - Function parameters: function(...args)
 * 
 * SPREAD vs REST:
 * - Spread: Expands (in array/object/call)
 * - Rest: Collects (in destructuring/params)
 */
