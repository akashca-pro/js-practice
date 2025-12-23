/**
 * TOPIC: LOGICAL ASSIGNMENT OPERATORS
 * DESCRIPTION:
 * ES2021 introduced logical assignment operators that combine
 * logical operators with assignment. They provide concise ways
 * to conditionally assign values.
 */

// -------------------------------------------------------------------------------------------
// 1. LOGICAL OR ASSIGNMENT (||=)
// -------------------------------------------------------------------------------------------

/**
 * a ||= b is equivalent to: a || (a = b)
 * Assigns if 'a' is falsy.
 */

let name = '';
name ||= 'Anonymous';
console.log(name);  // 'Anonymous' (empty string is falsy)

let count = 0;
count ||= 10;
console.log(count);  // 10 (0 is falsy!)

let active = false;
active ||= true;
console.log(active);  // true (false is falsy)

// Common use: Default values
function greet(options) {
    options.message ||= 'Hello';
    options.name ||= 'Guest';
    return `${options.message}, ${options.name}!`;
}

// -------------------------------------------------------------------------------------------
// 2. LOGICAL AND ASSIGNMENT (&&=)
// -------------------------------------------------------------------------------------------

/**
 * a &&= b is equivalent to: a && (a = b)
 * Assigns if 'a' is truthy.
 */

let user = { name: 'Alice', role: 'admin' };
user.role &&= 'superadmin';
console.log(user.role);  // 'superadmin' (was truthy)

let disabled = false;
disabled &&= true;
console.log(disabled);  // false (wasn't truthy, no assignment)

// Common use: Conditional update
let config = { debug: true };
config.debug &&= process.env.NODE_ENV === 'development';

// Transform only if exists
let data = { name: 'alice' };
data.name &&= data.name.toUpperCase();
console.log(data.name);  // 'ALICE'

// -------------------------------------------------------------------------------------------
// 3. LOGICAL NULLISH ASSIGNMENT (??=)
// -------------------------------------------------------------------------------------------

/**
 * a ??= b is equivalent to: a ?? (a = b)
 * Assigns ONLY if 'a' is null or undefined.
 */

let value = null;
value ??= 'default';
console.log(value);  // 'default'

let count2 = 0;
count2 ??= 10;
console.log(count2);  // 0 (not null/undefined, so no change!)

let flag = false;
flag ??= true;
console.log(flag);  // false (not nullish, no change)

let missing;
missing ??= 'filled';
console.log(missing);  // 'filled'

// -------------------------------------------------------------------------------------------
// 4. COMPARISON: ||= VS ??=
// -------------------------------------------------------------------------------------------

/**
 * ||= assigns if falsy (false, 0, '', null, undefined, NaN)
 * ??= assigns if nullish (null, undefined only)
 */

// With 0
let a = 0;
a ||= 5;   // a = 5 (0 is falsy)

let b = 0;
b ??= 5;   // b = 0 (0 is not nullish)

// With empty string
let c = '';
c ||= 'default';  // c = 'default'

let d = '';
d ??= 'default';  // d = '' (not nullish)

// With false
let e = false;
e ||= true;  // e = true

let f = false;
f ??= true;  // f = false (not nullish)

// -------------------------------------------------------------------------------------------
// 5. SHORT-CIRCUIT BEHAVIOR
// -------------------------------------------------------------------------------------------

/**
 * These operators short-circuit - RHS is evaluated
 * ONLY when the condition is met.
 */

let obj = { count: 0 };

// This doesn't call expensiveComputation() because obj exists
obj ||= expensiveComputation();

// This DOES call it because count is 0 (falsy)
obj.count ||= expensiveComputation();

function expensiveComputation() {
    console.log('Computing...');
    return 42;
}

// With getters
const target = {
    _value: null,
    get value() {
        console.log('Getter called');
        return this._value;
    },
    set value(v) {
        console.log('Setter called');
        this._value = v;
    }
};

// Getter called, value is null, setter called
target.value ??= 'default';

// Getter called, value is 'default', setter NOT called
target.value ??= 'another';

// -------------------------------------------------------------------------------------------
// 6. PRACTICAL USE CASES
// -------------------------------------------------------------------------------------------

// Initialize nested objects
const settings = {};
settings.theme ??= {};
settings.theme.color ??= 'blue';
settings.theme.font ??= 'Arial';

// Lazy initialization
class LazyLoader {
    #data = null;
    
    getData() {
        return this.#data ??= this.#loadData();
    }
    
    #loadData() {
        console.log('Loading data...');
        return { items: [] };
    }
}

// Counter with default
function incrementCounter(counters, key) {
    counters[key] ??= 0;
    counters[key]++;
    return counters[key];
}

// Config merging
function configure(options) {
    options.timeout ??= 5000;
    options.retries ??= 3;
    options.debug ??= false;
    return options;
}

// DOM element caching
const elements = {};
function getElement(id) {
    return elements[id] ??= document.getElementById(id);
}

// -------------------------------------------------------------------------------------------
// 7. CHAINING ASSIGNMENTS
// -------------------------------------------------------------------------------------------

const config = {};

// Initialize defaults
config.api ??= {};
config.api.baseUrl ??= 'https://api.example.com';
config.api.timeout ??= 5000;
config.api.headers ??= {};
config.api.headers['Content-Type'] ??= 'application/json';

console.log(config);
// {
//   api: {
//     baseUrl: 'https://api.example.com',
//     timeout: 5000,
//     headers: { 'Content-Type': 'application/json' }
//   }
// }

// -------------------------------------------------------------------------------------------
// 8. COMPARISON WITH TRADITIONAL PATTERNS
// -------------------------------------------------------------------------------------------

// Before: Traditional ||
if (!value) {
    value = 'default';
}
// or
value = value || 'default';

// After: ||=
value ||= 'default';

// Before: Nullish check
if (value === null || value === undefined) {
    value = 'default';
}
// or
value = value ?? 'default';

// After: ??=
value ??= 'default';

// Before: Conditional update
if (value) {
    value = transform(value);
}

// After: &&=
value &&= transform(value);

function transform(v) {
    return v.toUpperCase();
}

// -------------------------------------------------------------------------------------------
// 9. GOTCHAS
// -------------------------------------------------------------------------------------------

// Be careful with 0 and empty strings
let port = 0;
port ||= 3000;  // port = 3000 (probably not intended!)
// Use ??= instead:
let port2 = 0;
port2 ??= 3000;  // port2 = 0

// Property existence vs value
const obj2 = {};
obj2.prop ||= 'default';  // Works, adds property

// This might throw in some cases
// undefined.prop ??= 'value';  // TypeError!

// Check for object first
const safe = obj2?.nested;
if (safe) {
    safe.prop ??= 'default';
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * LOGICAL ASSIGNMENT OPERATORS:
 * 
 * ||= (Or Assignment)
 * - Assigns if left side is FALSY
 * - a ||= b  ≡  a || (a = b)
 * 
 * &&= (And Assignment)
 * - Assigns if left side is TRUTHY
 * - a &&= b  ≡  a && (a = b)
 * 
 * ??= (Nullish Assignment)
 * - Assigns if left side is NULLISH (null/undefined)
 * - a ??= b  ≡  a ?? (a = b)
 * 
 * KEY DIFFERENCE:
 * - ||= treats 0, '', false as falsy (assigns)
 * - ??= only treats null/undefined as nullish
 * 
 * USE CASES:
 * - Default values: value ??= 'default'
 * - Initialization: cache[key] ??= compute()
 * - Conditional update: name &&= name.trim()
 */
