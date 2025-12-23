/**
 * TOPIC: VARIABLE DECLARATIONS (VAR, LET, CONST)
 * DESCRIPTION:
 * JavaScript has three ways to declare variables: var (legacy),
 * let (block-scoped), and const (block-scoped, immutable binding).
 * Understanding their differences is crucial for writing correct code.
 */

// -------------------------------------------------------------------------------------------
// 1. VAR DECLARATION
// -------------------------------------------------------------------------------------------

/**
 * var is function-scoped (or global if outside function).
 * It's hoisted to the top of its scope.
 */

function varExample() {
    console.log(x);  // undefined (hoisted, but not initialized)
    var x = 10;
    console.log(x);  // 10
    
    if (true) {
        var x = 20;  // Same variable (function-scoped)
    }
    console.log(x);  // 20
}

// Global var creates property on window
var globalVar = 'global';
// window.globalVar === 'global' (in browser)

// -------------------------------------------------------------------------------------------
// 2. LET DECLARATION
// -------------------------------------------------------------------------------------------

/**
 * let is block-scoped.
 * Not accessible before declaration (Temporal Dead Zone).
 */

function letExample() {
    // console.log(y);  // ReferenceError: Cannot access 'y' before initialization
    let y = 10;
    console.log(y);  // 10
    
    if (true) {
        let y = 20;  // Different variable (block-scoped)
        console.log(y);  // 20
    }
    console.log(y);  // 10
}

// No global property
let globalLet = 'global';
// window.globalLet === undefined

// -------------------------------------------------------------------------------------------
// 3. CONST DECLARATION
// -------------------------------------------------------------------------------------------

/**
 * const is block-scoped like let.
 * The binding is immutable (can't be reassigned).
 * The value itself can be mutable (for objects/arrays).
 */

const PI = 3.14159;
// PI = 3.14;  // TypeError: Assignment to constant variable

// Object values CAN be mutated
const person = { name: 'Alice' };
person.name = 'Bob';      // OK - modifying property
person.age = 25;          // OK - adding property
// person = { name: 'Charlie' };  // Error - can't reassign

// Array values CAN be mutated
const numbers = [1, 2, 3];
numbers.push(4);          // OK
numbers[0] = 10;          // OK
// numbers = [5, 6, 7];   // Error - can't reassign

// -------------------------------------------------------------------------------------------
// 4. TEMPORAL DEAD ZONE (TDZ)
// -------------------------------------------------------------------------------------------

/**
 * let and const are hoisted but not initialized.
 * Accessing them before declaration causes ReferenceError.
 */

function tdzExample() {
    // TDZ starts here for x
    
    // console.log(x);  // ReferenceError
    
    let x = 10;  // TDZ ends
    console.log(x);  // 10
}

// TDZ in conditionals
function conditionalTDZ() {
    let value = 'outer';
    
    if (true) {
        // console.log(value);  // ReferenceError (shadowed)
        let value = 'inner';
        console.log(value);  // 'inner'
    }
}

// -------------------------------------------------------------------------------------------
// 5. SCOPE COMPARISON
// -------------------------------------------------------------------------------------------

function scopeDemo() {
    var a = 1;
    let b = 2;
    const c = 3;
    
    if (true) {
        var a = 10;   // Same variable
        let b = 20;   // New variable
        const c = 30; // New variable
        
        console.log(a);  // 10
        console.log(b);  // 20
        console.log(c);  // 30
    }
    
    console.log(a);  // 10 (changed)
    console.log(b);  // 2 (unchanged)
    console.log(c);  // 3 (unchanged)
}

// Loop scope
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log('var:', i), 100);
}
// Logs: var: 3, var: 3, var: 3

for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log('let:', j), 100);
}
// Logs: let: 0, let: 1, let: 2

// -------------------------------------------------------------------------------------------
// 6. REDECLARATION
// -------------------------------------------------------------------------------------------

// var allows redeclaration
var x = 1;
var x = 2;  // OK

// let and const do not
let y = 1;
// let y = 2;  // SyntaxError: Identifier 'y' has already been declared

const z = 1;
// const z = 2;  // SyntaxError

// -------------------------------------------------------------------------------------------
// 7. FUNCTION DECLARATIONS VS VAR
// -------------------------------------------------------------------------------------------

// Function declarations are fully hoisted
console.log(foo());  // "Hello" - works!

function foo() {
    return "Hello";
}

// Function expressions with var are partially hoisted
// console.log(bar());  // TypeError: bar is not a function

var bar = function() {
    return "World";
};

// -------------------------------------------------------------------------------------------
// 8. BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Default to const
 * 2. Use let when you need to reassign
 * 3. Avoid var in modern code
 * 4. Declare at the top of scope
 * 5. One declaration per line
 */

// GOOD
const MAX_SIZE = 100;
let counter = 0;
let isActive = false;

// BAD
var x = 1, y = 2, z = 3;

// Object/Array that will be mutated? Still use const
const config = {};
config.apiUrl = 'https://api.example.com';

const items = [];
items.push('item1');

// -------------------------------------------------------------------------------------------
// 9. FREEZING CONST OBJECTS
// -------------------------------------------------------------------------------------------

// Make truly immutable
const immutableConfig = Object.freeze({
    apiUrl: 'https://api.example.com',
    timeout: 5000
});

immutableConfig.apiUrl = 'changed';  // Silently fails (or throws in strict mode)
console.log(immutableConfig.apiUrl); // 'https://api.example.com'

// Deep freeze for nested objects
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            deepFreeze(obj[key]);
        }
    });
    return obj;
}

// -------------------------------------------------------------------------------------------
// 10. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Feature        | var           | let           | const         |
 * |----------------|---------------|---------------|---------------|
 * | Scope          | Function      | Block         | Block         |
 * | Hoisting       | Yes (undef)   | Yes (TDZ)     | Yes (TDZ)     |
 * | Redeclaration  | Allowed       | Not allowed   | Not allowed   |
 * | Reassignment   | Allowed       | Allowed       | Not allowed   |
 * | Global prop    | Yes           | No            | No            |
 * | TDZ            | No            | Yes           | Yes           |
 */

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Configuration
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// State that changes
let isLoading = false;
let errorMessage = null;

// Loop counter
for (let i = 0; i < 10; i++) {
    // i is scoped to loop
}

// Accumulator
let total = 0;
for (const item of items) {
    total += item.price;
}

// Conditional assignment
let result;
if (condition) {
    result = 'yes';
} else {
    result = 'no';
}

// Or use const with ternary
const result2 = condition ? 'yes' : 'no';

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * VAR:
 * - Function-scoped
 * - Hoisted with undefined
 * - Can redeclare
 * - Creates global property
 * - Legacy - avoid in modern code
 * 
 * LET:
 * - Block-scoped
 * - TDZ before declaration
 * - Cannot redeclare
 * - Use when reassignment needed
 * 
 * CONST:
 * - Block-scoped
 * - TDZ before declaration
 * - Cannot redeclare or reassign
 * - Object/array values still mutable
 * - Default choice for most declarations
 * 
 * RULE OF THUMB:
 * const > let > var
 */
