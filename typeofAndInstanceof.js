/**
 * TOPIC: TYPEOF AND INSTANCEOF
 * DESCRIPTION:
 * JavaScript provides typeof for primitive type checking and
 * instanceof for checking prototype chain. Understanding their
 * quirks is essential for proper type checking.
 */

// -------------------------------------------------------------------------------------------
// 1. TYPEOF OPERATOR
// -------------------------------------------------------------------------------------------

/**
 * typeof returns a string indicating the type.
 * Works on primitives and functions.
 */

typeof undefined;       // "undefined"
typeof null;            // "object" (historical bug!)
typeof true;            // "boolean"
typeof 42;              // "number"
typeof 42n;             // "bigint"
typeof 'hello';         // "string"
typeof Symbol('s');     // "symbol"
typeof function() {};   // "function"
typeof {};              // "object"
typeof [];              // "object" (arrays are objects)
typeof new Date();      // "object"
typeof /regex/;         // "object"
typeof new Map();       // "object"

// -------------------------------------------------------------------------------------------
// 2. TYPEOF QUIRKS
// -------------------------------------------------------------------------------------------

// null returns "object" (legacy bug)
typeof null === 'object';  // true

// Check for null specifically
const value = null;
value === null;  // true

// Arrays are "object"
typeof [] === 'object';  // true
typeof {} === 'object';  // true

// Use Array.isArray for arrays
Array.isArray([]);       // true
Array.isArray({});       // false

// Functions are special
typeof function() {};    // "function"
typeof (() => {});       // "function"
typeof class {};         // "function"

// -------------------------------------------------------------------------------------------
// 3. SAFE TYPEOF FOR UNDEFINED
// -------------------------------------------------------------------------------------------

// typeof is safe for undeclared variables
typeof undeclaredVar === 'undefined';  // true (no error)

// Direct check would throw
// undeclaredVar === undefined;  // ReferenceError!

// Check if variable exists
if (typeof someVar !== 'undefined') {
    // someVar is declared and defined
}

// In modern code, use optional chaining instead
// window?.someVar

// -------------------------------------------------------------------------------------------
// 4. INSTANCEOF OPERATOR
// -------------------------------------------------------------------------------------------

/**
 * instanceof checks if an object's prototype chain
 * contains a constructor's prototype.
 */

class Animal {}
class Dog extends Animal {}

const dog = new Dog();

dog instanceof Dog;      // true
dog instanceof Animal;   // true
dog instanceof Object;   // true
dog instanceof Array;    // false

// With built-in types
[] instanceof Array;           // true
[] instanceof Object;          // true
new Date() instanceof Date;    // true
/regex/ instanceof RegExp;     // true

// Primitives are NOT instances
'hello' instanceof String;     // false
42 instanceof Number;          // false

// Wrapped primitives are
new String('hello') instanceof String;  // true
new Number(42) instanceof Number;       // true

// -------------------------------------------------------------------------------------------
// 5. INSTANCEOF QUIRKS
// -------------------------------------------------------------------------------------------

// Cross-frame arrays
// Arrays from different iframes fail instanceof
// const otherArray = iframe.contentWindow.Array;
// myArray instanceof otherArray;  // false!

// Use Array.isArray instead
Array.isArray([]);      // true (works across frames)

// Primitive wrappers
'hello' instanceof String;  // false
new String('hello') instanceof String;  // true

// null and undefined throw
// null instanceof Object;  // false (not an error)
// undefined instanceof Object;  // false

// -------------------------------------------------------------------------------------------
// 6. SYMBOL.HASINSTANCE
// -------------------------------------------------------------------------------------------

/**
 * Customize instanceof behavior.
 */

class EvenNumber {
    static [Symbol.hasInstance](value) {
        return typeof value === 'number' && value % 2 === 0;
    }
}

4 instanceof EvenNumber;   // true
5 instanceof EvenNumber;   // false
6 instanceof EvenNumber;   // true
'4' instanceof EvenNumber; // false

// -------------------------------------------------------------------------------------------
// 7. COMPREHENSIVE TYPE CHECKING
// -------------------------------------------------------------------------------------------

function getType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (value instanceof Map) return 'map';
    if (value instanceof Set) return 'set';
    if (value instanceof Error) return 'error';
    if (value instanceof Promise) return 'promise';
    return typeof value;
}

console.log(getType(null));           // 'null'
console.log(getType([]));             // 'array'
console.log(getType(new Date()));     // 'date'
console.log(getType(/regex/));        // 'regexp'
console.log(getType(() => {}));       // 'function'

// -------------------------------------------------------------------------------------------
// 8. OBJECT.PROTOTYPE.TOSTRING
// -------------------------------------------------------------------------------------------

/**
 * Most reliable type detection.
 * Returns [object Type] format.
 */

const toString = Object.prototype.toString;

toString.call(null);          // "[object Null]"
toString.call(undefined);     // "[object Undefined]"
toString.call([]);            // "[object Array]"
toString.call({});            // "[object Object]"
toString.call('hello');       // "[object String]"
toString.call(42);            // "[object Number]"
toString.call(true);          // "[object Boolean]"
toString.call(() => {});      // "[object Function]"
toString.call(new Date());    // "[object Date]"
toString.call(/regex/);       // "[object RegExp]"
toString.call(new Map());     // "[object Map]"
toString.call(new Set());     // "[object Set]"
toString.call(Symbol('s'));   // "[object Symbol]"
toString.call(42n);           // "[object BigInt]"

// Extract type
function typeOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

typeOf([]);       // 'array'
typeOf(null);     // 'null'
typeOf(/regex/);  // 'regexp'

// -------------------------------------------------------------------------------------------
// 9. TYPE GUARDS
// -------------------------------------------------------------------------------------------

// Check functions
const isString = v => typeof v === 'string';
const isNumber = v => typeof v === 'number' && !Number.isNaN(v);
const isBoolean = v => typeof v === 'boolean';
const isFunction = v => typeof v === 'function';
const isObject = v => v !== null && typeof v === 'object';
const isArray = v => Array.isArray(v);
const isNull = v => v === null;
const isUndefined = v => v === undefined;
const isNullish = v => v == null;

// Check for plain object (not array, not null)
function isPlainObject(value) {
    if (typeof value !== 'object' || value === null) return false;
    
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
}

isPlainObject({});              // true
isPlainObject([]);              // false
isPlainObject(new Date());      // false
isPlainObject(Object.create(null));  // true

// -------------------------------------------------------------------------------------------
// 10. DUCK TYPING
// -------------------------------------------------------------------------------------------

/**
 * "If it walks like a duck and quacks like a duck..."
 * Check for behavior rather than type.
 */

// Check if iterable
function isIterable(value) {
    return value != null && typeof value[Symbol.iterator] === 'function';
}

isIterable([1, 2, 3]);    // true
isIterable('hello');      // true
isIterable(new Set());    // true
isIterable({});           // false

// Check if array-like
function isArrayLike(value) {
    return value != null &&
           typeof value !== 'function' &&
           typeof value.length === 'number' &&
           value.length >= 0 &&
           value.length % 1 === 0;
}

isArrayLike([1, 2, 3]);       // true
isArrayLike('hello');         // true
isArrayLike({ length: 3 });   // true

// Check if thenable (Promise-like)
function isThenable(value) {
    return value != null && typeof value.then === 'function';
}

// -------------------------------------------------------------------------------------------
// 11. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Value         | typeof      | instanceof Array | Array.isArray |
 * |---------------|-------------|------------------|---------------|
 * | []            | "object"    | true             | true          |
 * | {}            | "object"    | false            | false         |
 * | null          | "object"    | false            | false         |
 * | function(){}  | "function"  | false            | false         |
 * | 'hello'       | "string"    | false            | false         |
 */

// -------------------------------------------------------------------------------------------
// 12. BEST PRACTICES
// -------------------------------------------------------------------------------------------

// For null
value === null

// For undefined
value === undefined
// or
typeof value === 'undefined'  // (safe for undeclared)

// For null or undefined
value == null  // checks both

// For arrays
Array.isArray(value)

// For objects (excluding null)
value !== null && typeof value === 'object'

// For plain objects
isPlainObject(value)

// For functions
typeof value === 'function'

// For numbers (excluding NaN)
typeof value === 'number' && !Number.isNaN(value)

// For reliable type detection
Object.prototype.toString.call(value)

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * TYPEOF:
 * - Returns string: "undefined", "boolean", "number", etc.
 * - typeof null === "object" (bug)
 * - Safe for undeclared variables
 * - Arrays/objects both return "object"
 * 
 * INSTANCEOF:
 * - Checks prototype chain
 * - Works with classes and constructors
 * - Fails across frames/realms
 * - Primitives always return false
 * 
 * ALTERNATIVES:
 * - Array.isArray() for arrays
 * - Object.prototype.toString.call() for all types
 * - Custom type guards for specific needs
 * - Duck typing for behavior checks
 */
