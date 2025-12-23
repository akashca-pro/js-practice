/**
 * TOPIC: PURE FUNCTIONS & IMMUTABILITY
 * DESCRIPTION:
 * Pure functions always produce the same output for the same input
 * and have no side effects. Immutability means not modifying data
 * after creation. Both are core functional programming concepts.
 */

// -------------------------------------------------------------------------------------------
// 1. PURE FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * A pure function:
 * 1. Given same inputs, always returns same output (deterministic)
 * 2. Has no side effects (doesn't modify external state)
 */

// PURE - same input = same output, no side effects
function add(a, b) {
    return a + b;
}

function calculateArea(radius) {
    return Math.PI * radius * radius;
}

// IMPURE - uses external state
let counter = 0;
function impureIncrement() {
    counter++;        // Side effect: modifies external state
    return counter;
}

// IMPURE - non-deterministic
function impureRandom(max) {
    return Math.random() * max;  // Different each call
}

// IMPURE - side effects
function impureLog(message) {
    console.log(message);  // Side effect: I/O
    return message;
}

// -------------------------------------------------------------------------------------------
// 2. SIDE EFFECTS
// -------------------------------------------------------------------------------------------

/**
 * Side effects include:
 * - Modifying external variables
 * - Mutating input arguments
 * - Console logging
 * - Writing to files/database
 * - Making HTTP requests
 * - DOM manipulation
 * - Throwing exceptions
 */

// IMPURE - mutates input
function impurePush(arr, item) {
    arr.push(item);  // Modifies original array
    return arr;
}

// PURE - returns new array
function purePush(arr, item) {
    return [...arr, item];  // Creates new array
}

const original = [1, 2, 3];
const result = purePush(original, 4);
console.log(original);  // [1, 2, 3] - unchanged
console.log(result);    // [1, 2, 3, 4]

// -------------------------------------------------------------------------------------------
// 3. IMMUTABILITY BASICS
// -------------------------------------------------------------------------------------------

/**
 * Immutable data cannot be changed after creation.
 * Instead, create new copies with modifications.
 */

// MUTABLE operations (BAD for FP)
const mutableArray = [1, 2, 3];
mutableArray.push(4);
mutableArray[0] = 0;

// IMMUTABLE operations (GOOD for FP)
const immutableArray = [1, 2, 3];
const newArray = [...immutableArray, 4];
const modifiedArray = [0, ...immutableArray.slice(1)];

// Object immutability
const user = { name: "Alice", age: 25 };

// MUTABLE (BAD)
user.age = 26;

// IMMUTABLE (GOOD)
const updatedUser = { ...user, age: 26 };

// -------------------------------------------------------------------------------------------
// 4. IMMUTABLE ARRAY OPERATIONS
// -------------------------------------------------------------------------------------------

const numbers = [1, 2, 3, 4, 5];

// Add item
const added = [...numbers, 6];           // [1,2,3,4,5,6]
const prepended = [0, ...numbers];       // [0,1,2,3,4,5]

// Remove item
const withoutThird = numbers.filter((_, i) => i !== 2);  // [1,2,4,5]
const withoutValue = numbers.filter(n => n !== 3);        // [1,2,4,5]

// Update item at index
const updatedAt2 = numbers.map((n, i) => i === 2 ? 30 : n); // [1,2,30,4,5]

// Insert at position
const insertAt2 = [
    ...numbers.slice(0, 2),
    99,
    ...numbers.slice(2)
]; // [1,2,99,3,4,5]

// -------------------------------------------------------------------------------------------
// 5. IMMUTABLE OBJECT OPERATIONS
// -------------------------------------------------------------------------------------------

const person = {
    name: "Bob",
    address: {
        city: "NYC",
        zip: "10001"
    },
    hobbies: ["reading"]
};

// Shallow update
const updated = { ...person, name: "Robert" };

// Deep update (nested)
const movedPerson = {
    ...person,
    address: {
        ...person.address,
        city: "LA"
    }
};

// Add property
const withEmail = { ...person, email: "bob@example.com" };

// Remove property
const { name, ...withoutName } = person;

// Update array in object
const withHobby = {
    ...person,
    hobbies: [...person.hobbies, "gaming"]
};

// -------------------------------------------------------------------------------------------
// 6. OBJECT.FREEZE & OBJECT.SEAL
// -------------------------------------------------------------------------------------------

/**
 * Enforce immutability at runtime.
 */

// Object.freeze - shallow freeze
const frozen = Object.freeze({ a: 1, nested: { b: 2 } });
// frozen.a = 10;          // Fails silently (or throws in strict)
frozen.nested.b = 20;       // Works! freeze is shallow

// Deep freeze utility
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.values(obj).forEach(value => {
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    });
    return obj;
}

// -------------------------------------------------------------------------------------------
// 7. BENEFITS OF PURE FUNCTIONS & IMMUTABILITY
// -------------------------------------------------------------------------------------------

/**
 * PURE FUNCTIONS:
 * ✓ Easy to test (no mocking needed)
 * ✓ Predictable behavior
 * ✓ Safe to memoize
 * ✓ Can be parallelized
 * ✓ Easy to debug
 * 
 * IMMUTABILITY:
 * ✓ Predictable state changes
 * ✓ Easy to track changes (reference comparison)
 * ✓ Safe to share data between functions
 * ✓ Time-travel debugging possible
 * ✓ Concurrency-safe
 */

// -------------------------------------------------------------------------------------------
// 8. PURE FUNCTION PATTERNS
// -------------------------------------------------------------------------------------------

// Instead of mutation, return new state
function addTodo(todos, newTodo) {
    return [...todos, newTodo];
}

function removeTodo(todos, id) {
    return todos.filter(todo => todo.id !== id);
}

function toggleTodo(todos, id) {
    return todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
    );
}

// Reducer pattern (pure state management)
function reducer(state, action) {
    switch (action.type) {
        case 'ADD':
            return { ...state, items: [...state.items, action.item] };
        case 'REMOVE':
            return { ...state, items: state.items.filter(i => i.id !== action.id) };
        default:
            return state;
    }
}

// -------------------------------------------------------------------------------------------
// 9. HANDLING SIDE EFFECTS
// -------------------------------------------------------------------------------------------

/**
 * Real apps need side effects. Strategy: isolate them.
 * Core logic = pure functions
 * Edge/boundary = side effects
 */

// Pure calculation
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price, 0);
}

// Impure - isolated at boundary
async function processOrder(items) {
    const total = calculateTotal(items);  // Pure core
    await saveToDatabase(items, total);    // Impure edge
    console.log("Order processed");        // Impure edge
    return total;
}

async function saveToDatabase(items, total) { /* ... */ }

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * PURE FUNCTIONS:
 * - Same input = same output
 * - No side effects
 * - Easier to test, debug, and reason about
 * 
 * IMMUTABILITY:
 * - Never modify data in place
 * - Create new copies with changes
 * - Use spread operator for objects/arrays
 * - Object.freeze for runtime enforcement
 * 
 * PATTERN:
 * - Keep core logic pure
 * - Push side effects to the edges
 * - Use immutable data transformations
 */
