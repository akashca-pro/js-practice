/**
 * TOPIC: BIGINT
 * DESCRIPTION:
 * BigInt is a built-in object for representing integers larger
 * than Number.MAX_SAFE_INTEGER. Essential for cryptography,
 * high-precision timestamps, and large number calculations.
 */

// -------------------------------------------------------------------------------------------
// 1. CREATING BIGINT
// -------------------------------------------------------------------------------------------

// Literal syntax (append 'n')
const big1 = 12345678901234567890n;

// Constructor
const big2 = BigInt(123);
const big3 = BigInt('12345678901234567890');

// From hex, binary, octal
const hex = BigInt('0xFF');
const binary = BigInt('0b1010');
const octal = BigInt('0o17');

// From number (within safe integer range)
const fromNum = BigInt(42);

// Note: Can't use BigInt() on non-integers
// BigInt(1.5);  // RangeError!

// -------------------------------------------------------------------------------------------
// 2. WHY BIGINT?
// -------------------------------------------------------------------------------------------

/**
 * Numbers lose precision beyond MAX_SAFE_INTEGER.
 */

console.log(Number.MAX_SAFE_INTEGER);  // 9007199254740991

// Loss of precision with Number
console.log(9007199254740992 === 9007199254740993);  // true! (both equal)

// BigInt maintains precision
console.log(9007199254740992n === 9007199254740993n);  // false (correct)

// Very large numbers
const reallyBig = 123456789012345678901234567890n;
console.log(reallyBig);

// -------------------------------------------------------------------------------------------
// 3. ARITHMETIC OPERATIONS
// -------------------------------------------------------------------------------------------

const a = 100n;
const b = 3n;

// Basic arithmetic
console.log(a + b);   // 103n
console.log(a - b);   // 97n
console.log(a * b);   // 300n
console.log(a / b);   // 33n (truncated, no decimals!)
console.log(a % b);   // 1n
console.log(a ** b);  // 1000000n

// Division truncates toward zero
console.log(5n / 2n);   // 2n (not 2.5)
console.log(-5n / 2n);  // -2n

// Unary minus
console.log(-a);  // -100n

// Unary plus NOT allowed
// +a;  // TypeError!

// Increment/decrement
let c = 5n;
c++;
console.log(c);  // 6n

// -------------------------------------------------------------------------------------------
// 4. COMPARISON
// -------------------------------------------------------------------------------------------

const x = 10n;
const y = 20n;

// BigInt to BigInt
console.log(x < y);   // true
console.log(x === y); // false

// BigInt to Number (== works, === doesn't)
console.log(10n == 10);   // true
console.log(10n === 10);  // false (different types)

// Sorting
const mixed = [4n, 2n, 10n, 1n];
mixed.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
console.log(mixed);  // [1n, 2n, 4n, 10n]

// -------------------------------------------------------------------------------------------
// 5. CANNOT MIX WITH NUMBERS
// -------------------------------------------------------------------------------------------

const bigInt = 10n;
const num = 5;

// This throws!
// bigInt + num;  // TypeError: can't mix BigInt and Number

// Convert explicitly
const sum1 = bigInt + BigInt(num);  // 15n
const sum2 = Number(bigInt) + num;  // 15

// Be careful with Number conversion (may lose precision)
const huge = 12345678901234567890n;
console.log(Number(huge));  // 12345678901234567000 (lost precision!)

// -------------------------------------------------------------------------------------------
// 6. BITWISE OPERATIONS
// -------------------------------------------------------------------------------------------

const p = 0b1100n;  // 12n
const q = 0b1010n;  // 10n

console.log(p & q);   // 8n (0b1000)
console.log(p | q);   // 14n (0b1110)
console.log(p ^ q);   // 6n (0b0110)
console.log(~p);      // -13n
console.log(p << 2n); // 48n
console.log(p >> 1n); // 6n

// No >>> (unsigned right shift) for BigInt

// -------------------------------------------------------------------------------------------
// 7. TYPE CHECKING
// -------------------------------------------------------------------------------------------

console.log(typeof 10n);              // "bigint"
console.log(typeof BigInt(10));       // "bigint"

// Instance check
console.log(10n instanceof BigInt);   // false (primitives)
console.log(Object(10n) instanceof BigInt);  // true

// Type guard
function isBigInt(value) {
    return typeof value === 'bigint';
}

// -------------------------------------------------------------------------------------------
// 8. MATH OBJECT DOESN'T WORK
// -------------------------------------------------------------------------------------------

// Math methods don't support BigInt
// Math.sqrt(4n);   // TypeError!
// Math.max(1n, 2n);  // TypeError!

// Implement manually
function bigIntSqrt(n) {
    if (n < 0n) throw new Error('Negative number');
    if (n < 2n) return n;
    
    let x = n;
    let y = (x + 1n) / 2n;
    
    while (y < x) {
        x = y;
        y = (x + n / x) / 2n;
    }
    
    return x;
}

function bigIntMax(...args) {
    return args.reduce((max, val) => val > max ? val : max);
}

function bigIntMin(...args) {
    return args.reduce((min, val) => val < min ? val : min);
}

function bigIntAbs(n) {
    return n < 0n ? -n : n;
}

// -------------------------------------------------------------------------------------------
// 9. JSON SERIALIZATION
// -------------------------------------------------------------------------------------------

// BigInt doesn't serialize to JSON by default
const obj = { value: 10n };
// JSON.stringify(obj);  // TypeError!

// Solution 1: Convert to string
const withString = { value: 10n.toString() };
JSON.stringify(withString);  // '{"value":"10"}'

// Solution 2: Custom replacer
function bigIntReplacer(key, value) {
    if (typeof value === 'bigint') {
        return value.toString() + 'n';
    }
    return value;
}

JSON.stringify({ big: 123n }, bigIntReplacer);  // '{"big":"123n"}'

// Custom reviver
function bigIntReviver(key, value) {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
    }
    return value;
}

JSON.parse('{"big":"123n"}', bigIntReviver);  // { big: 123n }

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL USE CASES
// -------------------------------------------------------------------------------------------

// Large IDs (e.g., Twitter snowflake IDs)
const tweetId = 1234567890123456789n;

// High-precision timestamps (nanoseconds)
const nanoTimestamp = 1704067200000000000n;

// Cryptographic values
const primeP = 104729n;
const primeQ = 104723n;
const product = primeP * primeQ;

// Financial calculations (work in cents)
const amountInCents = 1234567890123456789n;

// Factorial of large numbers
function factorial(n) {
    let result = 1n;
    for (let i = 2n; i <= n; i++) {
        result *= i;
    }
    return result;
}
console.log(factorial(50n));  // Very large number

// Fibonacci
function fibonacci(n) {
    let a = 0n, b = 1n;
    for (let i = 0n; i < n; i++) {
        [a, b] = [b, a + b];
    }
    return a;
}
console.log(fibonacci(100n));  // Works with huge Fibonacci numbers

// -------------------------------------------------------------------------------------------
// 11. CONVERSION FUNCTIONS
// -------------------------------------------------------------------------------------------

// Safe conversion to Number
function toNumberSafe(bigint) {
    if (bigint > Number.MAX_SAFE_INTEGER || bigint < Number.MIN_SAFE_INTEGER) {
        throw new Error('Value exceeds safe integer range');
    }
    return Number(bigint);
}

// Convert between bases
const decimal = 255n;
console.log(decimal.toString(16));  // "ff"
console.log(decimal.toString(2));   // "11111111"
console.log(decimal.toString(8));   // "377"

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * BIGINT:
 * - Arbitrary precision integers
 * - Created with 'n' suffix or BigInt()
 * - typeof returns "bigint"
 * 
 * OPERATIONS:
 * - All arithmetic: +, -, *, /, %, **
 * - Bitwise: &, |, ^, ~, <<, >>
 * - Comparison works with Numbers (== but not ===)
 * 
 * LIMITATIONS:
 * - Can't mix with Number in operations
 * - No Math methods
 * - No JSON serialization by default
 * - Division truncates (no decimals)
 * 
 * USE CASES:
 * - Large IDs
 * - High-precision timestamps
 * - Cryptography
 * - Financial calculations
 * - Scientific computing
 */
