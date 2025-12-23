/**
 * TOPIC: COERCION & TYPE CONVERSION
 * DESCRIPTION:
 * JavaScript is dynamically typed and performs automatic type
 * conversion (coercion). Understanding implicit and explicit
 * coercion is essential for avoiding bugs.
 */

// -------------------------------------------------------------------------------------------
// 1. EXPLICIT TYPE CONVERSION
// -------------------------------------------------------------------------------------------

// To String
String(123);          // "123"
String(true);         // "true"
String(null);         // "null"
String(undefined);    // "undefined"
String([1, 2]);       // "1,2"
String({});           // "[object Object]"
(123).toString();     // "123"

// To Number
Number("123");        // 123
Number("123.45");     // 123.45
Number("abc");        // NaN
Number("");           // 0
Number("  ");         // 0
Number(true);         // 1
Number(false);        // 0
Number(null);         // 0
Number(undefined);    // NaN
Number([]);           // 0
Number([1]);          // 1
Number([1, 2]);       // NaN
parseInt("123px");    // 123
parseFloat("3.14");   // 3.14

// To Boolean
Boolean(0);           // false
Boolean("");          // false
Boolean(null);        // false
Boolean(undefined);   // false
Boolean(NaN);         // false
Boolean(1);           // true
Boolean("hello");     // true
Boolean([]);          // true (empty array is truthy!)
Boolean({});          // true (empty object is truthy!)

// -------------------------------------------------------------------------------------------
// 2. FALSY VALUES
// -------------------------------------------------------------------------------------------

/**
 * There are exactly 7 falsy values in JavaScript:
 */

const falsyValues = [
    false,      // Boolean false
    0,          // Number zero
    -0,         // Negative zero
    0n,         // BigInt zero
    "",         // Empty string
    null,       // null
    undefined,  // undefined
    NaN         // Not a Number
];

// Everything else is truthy, including:
Boolean([]);             // true (empty array)
Boolean({});             // true (empty object)
Boolean("false");        // true (non-empty string)
Boolean("0");            // true (non-empty string)
Boolean(new Boolean(false)); // true (object wrapper)

// -------------------------------------------------------------------------------------------
// 3. IMPLICIT COERCION
// -------------------------------------------------------------------------------------------

// String coercion with +
"Hello" + 123;        // "Hello123"
"Hello" + true;       // "Hellotrue"
"Hello" + null;       // "Hellonull"
"Hello" + undefined;  // "Helloundefined"
"Hello" + [1, 2];     // "Hello1,2"
"Hello" + {};         // "Hello[object Object]"

// Number coercion with operators
"5" - 2;              // 3 (string to number)
"5" * 2;              // 10
"5" / 2;              // 2.5
"5" - "2";            // 3
+"5";                 // 5 (unary plus)
-"5";                 // -5

// Boolean coercion in conditions
if ("hello") { }      // true (truthy string)
if ([]) { }           // true (truthy array)
!!"hello";            // true (double negation)
!!0;                  // false

// -------------------------------------------------------------------------------------------
// 4. EQUALITY COERCION
// -------------------------------------------------------------------------------------------

// == (loose equality) - allows coercion
1 == "1";             // true
true == 1;            // true
null == undefined;    // true
[] == false;          // true (!!!)
[] == "";             // true
[1] == 1;             // true

// === (strict equality) - no coercion
1 === "1";            // false
true === 1;           // false
null === undefined;   // false
// [] === false;         // false

// Special cases
NaN == NaN;           // false (NaN never equals itself!)
NaN === NaN;          // false

// Use Object.is for edge cases
Object.is(NaN, NaN);  // true
Object.is(0, -0);     // false (=== returns true)

// -------------------------------------------------------------------------------------------
// 5. THE ABSTRACT EQUALITY ALGORITHM (==)
// -------------------------------------------------------------------------------------------

/**
 * When types differ, == converts according to rules:
 * 1. null == undefined -> true
 * 2. Number == String -> String to Number
 * 3. Boolean == anything -> Boolean to Number first
 * 4. Object == primitive -> Object to primitive (valueOf/toString)
 */

// Examples traced:
// [] == false
// -> [] == 0        (boolean to number)
// -> "" == 0        (array to primitive)
// -> 0 == 0         (string to number)
// -> true

// -------------------------------------------------------------------------------------------
// 6. OBJECT TO PRIMITIVE CONVERSION
// -------------------------------------------------------------------------------------------

/**
 * Objects convert to primitives using:
 * 1. [Symbol.toPrimitive](hint) if defined
 * 2. valueOf() for "number" hint
 * 3. toString() for "string" hint
 */

const custom = {
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') return 100;
        if (hint === 'string') return 'custom';
        return true;  // default
    }
};

console.log(+custom);          // 100 (number hint)
console.log(`${custom}`);      // "custom" (string hint)
console.log(custom + "");      // "true" (default hint)

// Default behavior
const obj = {
    valueOf() { return 42; },
    toString() { return "object"; }
};

console.log(obj + 0);      // 42 (uses valueOf)
console.log(`${obj}`);     // "object" (uses toString)

// -------------------------------------------------------------------------------------------
// 7. COMMON GOTCHAS
// -------------------------------------------------------------------------------------------

// + with objects
[] + {};              // "[object Object]"
{} + [];              // 0 (varies by context!)

// Plus vs concatenation
1 + 2 + "3";          // "33" (left to right: 1+2=3, then "3")
"1" + 2 + 3;          // "123"

// Comparisons
null > 0;             // false
null == 0;            // false
null >= 0;            // true (!!! null coerces to 0 in comparison)

undefined > 0;        // false
undefined < 0;        // false
undefined == 0;       // false (undefined only == null)

// Arrays
[] == ![];            // true (![] is false, [] == false)

// -------------------------------------------------------------------------------------------
// 8. BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Use === instead of == (avoid implicit coercion)
 * 2. Explicitly convert types when needed
 * 3. Be careful with + operator (use parentheses)
 * 4. Never compare with true/false explicitly
 */

// BAD
if (x == true) { }

// GOOD
if (x) { }  // For truthiness
if (x === true) { }  // For strict boolean

// BAD
// const num = input + 0;

// GOOD
// const num = Number(input);
const num2 = parseInt(input, 10);

// -------------------------------------------------------------------------------------------
// 9. PRACTICAL CONVERSION FUNCTIONS
// -------------------------------------------------------------------------------------------

// Safe number conversion
function toNumber(value, fallback = 0) {
    const num = Number(value);
    return Number.isNaN(num) ? fallback : num;
}

// Safe integer conversion
function toInteger(value, fallback = 0) {
    const num = Number(value);
    return Number.isNaN(num) ? fallback : Math.trunc(num);
}

// Boolean normalization
function toBool(value) {
    if (typeof value === 'string') {
        return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * EXPLICIT CONVERSION:
 * - String(), Number(), Boolean()
 * - parseInt(), parseFloat()
 * - .toString()
 * 
 * IMPLICIT COERCION:
 * - + with string: concatenation
 * - -, *, /: to number
 * - if, &&, ||: to boolean
 * - ==: type coercion
 * 
 * FALSY VALUES:
 * - false, 0, -0, 0n, "", null, undefined, NaN
 * 
 * BEST PRACTICES:
 * - Use === over ==
 * - Explicit conversion
 * - Use Number.isNaN() not global isNaN()
 * - Watch out for [] and {} coercion
 */
