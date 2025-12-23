/**
 * TOPIC: NUMBER METHODS AND MATH OBJECT
 * DESCRIPTION:
 * JavaScript provides Number methods for parsing/checking numbers
 * and the Math object for mathematical operations. Essential for
 * calculations, validations, and numerical processing.
 */

// -------------------------------------------------------------------------------------------
// 1. NUMBER LITERALS
// -------------------------------------------------------------------------------------------

// Different formats
const decimal = 123;
const float = 123.456;
const exponential = 1.23e4;     // 12300
const binary = 0b1010;          // 10
const octal = 0o17;             // 15
const hex = 0xFF;               // 255

// Numeric separators (ES2021)
const billion = 1_000_000_000;
const bytes = 0xFF_FF_FF_FF;

// BigInt (for large integers)
const bigNum = 9007199254740991n;
const bigNum2 = BigInt('9007199254740991');

// -------------------------------------------------------------------------------------------
// 2. NUMBER PROPERTIES
// -------------------------------------------------------------------------------------------

Number.MAX_VALUE;              // ~1.8e+308
Number.MIN_VALUE;              // ~5e-324
Number.MAX_SAFE_INTEGER;       // 9007199254740991 (2^53 - 1)
Number.MIN_SAFE_INTEGER;       // -9007199254740991
Number.POSITIVE_INFINITY;      // Infinity
Number.NEGATIVE_INFINITY;      // -Infinity
Number.NaN;                    // NaN
Number.EPSILON;                // ~2.2e-16 (smallest difference)

// -------------------------------------------------------------------------------------------
// 3. NUMBER STATIC METHODS
// -------------------------------------------------------------------------------------------

// Parsing
Number.parseInt('123');        // 123
Number.parseInt('123.45');     // 123
Number.parseInt('ff', 16);     // 255
Number.parseInt('10', 2);      // 2 (binary)
Number.parseFloat('123.45');   // 123.45
Number.parseFloat('123.45px'); // 123.45

// Type checking
Number.isFinite(123);          // true
Number.isFinite(Infinity);     // false
Number.isFinite('123');        // false (vs global isFinite)

Number.isInteger(123);         // true
Number.isInteger(123.0);       // true
Number.isInteger(123.45);      // false

Number.isNaN(NaN);             // true
Number.isNaN('hello');         // false (vs global isNaN)

Number.isSafeInteger(123);     // true
Number.isSafeInteger(9007199254740992);  // false

// -------------------------------------------------------------------------------------------
// 4. NUMBER INSTANCE METHODS
// -------------------------------------------------------------------------------------------

const num = 123.456789;

// Fixed decimal places
num.toFixed(2);                // "123.46"
num.toFixed(0);                // "123"

// Exponential notation
num.toExponential(2);          // "1.23e+2"

// Precision (significant digits)
num.toPrecision(4);            // "123.5"
num.toPrecision(6);            // "123.457"

// String conversion
num.toString();                // "123.456789"
num.toString(2);               // Binary string
num.toString(16);              // Hex string

// Locale formatting
num.toLocaleString();          // "123.457" (locale-dependent)
num.toLocaleString('de-DE');   // "123,457"

// -------------------------------------------------------------------------------------------
// 5. MATH CONSTANTS
// -------------------------------------------------------------------------------------------

Math.E;                        // ~2.718 (Euler's number)
Math.PI;                       // ~3.14159
Math.LN2;                      // ~0.693
Math.LN10;                     // ~2.303
Math.LOG2E;                    // ~1.443
Math.LOG10E;                   // ~0.434
Math.SQRT2;                    // ~1.414
Math.SQRT1_2;                  // ~0.707

// -------------------------------------------------------------------------------------------
// 6. MATH ROUNDING
// -------------------------------------------------------------------------------------------

const n = 4.7;

Math.round(n);                 // 5 (nearest integer)
Math.floor(n);                 // 4 (round down)
Math.ceil(n);                  // 5 (round up)
Math.trunc(n);                 // 4 (remove decimal)

// Negative numbers
Math.floor(-4.7);              // -5
Math.ceil(-4.7);               // -4
Math.trunc(-4.7);              // -4

// Round to decimal places
function roundTo(num, decimals) {
    const factor = 10 ** decimals;
    return Math.round(num * factor) / factor;
}
roundTo(3.14159, 2);           // 3.14

// -------------------------------------------------------------------------------------------
// 7. MATH MIN/MAX
// -------------------------------------------------------------------------------------------

Math.max(1, 5, 3, 2);          // 5
Math.min(1, 5, 3, 2);          // 1

// With arrays
const arr = [1, 5, 3, 2];
Math.max(...arr);              // 5
Math.min(...arr);              // 1

// Empty arguments
Math.max();                    // -Infinity
Math.min();                    // Infinity

// -------------------------------------------------------------------------------------------
// 8. MATH POWER AND ROOTS
// -------------------------------------------------------------------------------------------

Math.pow(2, 10);               // 1024
2 ** 10;                       // 1024 (exponentiation operator)

Math.sqrt(16);                 // 4
Math.cbrt(27);                 // 3 (cube root)
Math.hypot(3, 4);              // 5 (hypotenuse)

// Nth root
function nthRoot(x, n) {
    return x ** (1 / n);
}

// -------------------------------------------------------------------------------------------
// 9. MATH ABSOLUTE AND SIGN
// -------------------------------------------------------------------------------------------

Math.abs(-5);                  // 5
Math.abs(5);                   // 5

Math.sign(-5);                 // -1
Math.sign(0);                  // 0
Math.sign(5);                  // 1

// -------------------------------------------------------------------------------------------
// 10. MATH LOGARITHMS
// -------------------------------------------------------------------------------------------

Math.log(Math.E);              // 1 (natural log)
Math.log10(100);               // 2
Math.log2(8);                  // 3
Math.log1p(0);                 // 0 (log(1 + x))

Math.exp(1);                   // ~2.718 (e^x)
Math.expm1(0);                 // 0 (e^x - 1)

// -------------------------------------------------------------------------------------------
// 11. MATH TRIGONOMETRY
// -------------------------------------------------------------------------------------------

// Arguments in radians
Math.sin(Math.PI / 2);         // 1
Math.cos(0);                   // 1
Math.tan(Math.PI / 4);         // ~1

// Inverse trig
Math.asin(1);                  // ~1.57 (π/2)
Math.acos(0);                  // ~1.57 (π/2)
Math.atan(1);                  // ~0.785 (π/4)
Math.atan2(1, 1);              // ~0.785 (angle to point)

// Hyperbolic
Math.sinh(0);                  // 0
Math.cosh(0);                  // 1
Math.tanh(0);                  // 0

// Degrees to radians
const toRadians = deg => deg * (Math.PI / 180);
const toDegrees = rad => rad * (180 / Math.PI);

// -------------------------------------------------------------------------------------------
// 12. MATH RANDOM
// -------------------------------------------------------------------------------------------

// 0 <= x < 1
Math.random();

// Random integer in range [min, max]
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random float in range [min, max)
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

// Random element from array
function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Shuffle array
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// -------------------------------------------------------------------------------------------
// 13. MATH MISCELLANEOUS
// -------------------------------------------------------------------------------------------

Math.fround(1.337);            // 32-bit float representation

// Clamp value to range
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

// Linear interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Map value from one range to another
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// -------------------------------------------------------------------------------------------
// 14. FLOATING POINT PRECISION
// -------------------------------------------------------------------------------------------

// Famous precision issue
0.1 + 0.2;                     // 0.30000000000000004

// Compare with epsilon
function almostEqual(a, b) {
    return Math.abs(a - b) < Number.EPSILON;
}

// Or use fixed precision comparison
function closeEnough(a, b, tolerance = 0.0001) {
    return Math.abs(a - b) < tolerance;
}

// For currency: work in cents
const price = 19.99;
const priceCents = Math.round(price * 100);  // 1999

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * NUMBER METHODS:
 * - parseInt, parseFloat, isFinite, isNaN, isInteger
 * - toFixed, toPrecision, toExponential
 * 
 * MATH OPERATIONS:
 * - round, floor, ceil, trunc, abs, sign
 * - min, max, pow/**, sqrt, cbrt
 * - random
 * 
 * MATH CONSTANTS:
 * - PI, E, LN2, LOG10E, SQRT2
 * 
 * BEST PRACTICES:
 * - Use Number.isNaN() not global isNaN()
 * - Use Number.EPSILON for float comparison
 * - Work in integers for currency
 * - Use BigInt for large integers
 */
