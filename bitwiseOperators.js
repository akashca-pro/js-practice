/**
 * TOPIC: BITWISE OPERATORS
 * DESCRIPTION:
 * Bitwise operators work on 32-bit integers at the binary level.
 * While rarely needed, they're useful for flags, permissions,
 * low-level operations, and performance optimizations.
 */

// -------------------------------------------------------------------------------------------
// 1. BINARY NUMBER BASICS
// -------------------------------------------------------------------------------------------

/**
 * JavaScript numbers are 64-bit floats, but bitwise operators
 * convert them to 32-bit signed integers.
 */

// Binary literals (ES6)
const binary = 0b1010;      // 10 in decimal
const hex = 0xFF;           // 255 in decimal
const octal = 0o17;         // 15 in decimal

// Convert to binary string
(10).toString(2);           // "1010"
(255).toString(2);          // "11111111"
(255).toString(16);         // "ff"

// Parse binary/hex string
parseInt('1010', 2);        // 10
parseInt('ff', 16);         // 255

// -------------------------------------------------------------------------------------------
// 2. BITWISE AND (&)
// -------------------------------------------------------------------------------------------

/**
 * 1 & 1 = 1
 * 1 & 0 = 0
 * 0 & 1 = 0
 * 0 & 0 = 0
 */

console.log(5 & 3);          // 1
// 5 = 101
// 3 = 011
// -------
//     001 = 1

// Check if even/odd
const isEven = num => (num & 1) === 0;
console.log(isEven(4));      // true
console.log(isEven(7));      // false

// Extract specific bit
const getBit = (num, pos) => (num >> pos) & 1;
console.log(getBit(0b1010, 1)); // 1 (second bit from right)

// -------------------------------------------------------------------------------------------
// 3. BITWISE OR (|)
// -------------------------------------------------------------------------------------------

/**
 * 1 | 1 = 1
 * 1 | 0 = 1
 * 0 | 1 = 1
 * 0 | 0 = 0
 */

console.log(5 | 3);          // 7
// 5 = 101
// 3 = 011
// -------
//     111 = 7

// Set a bit
const setBit = (num, pos) => num | (1 << pos);
console.log(setBit(0b1000, 1).toString(2)); // "1010"

// -------------------------------------------------------------------------------------------
// 4. BITWISE XOR (^)
// -------------------------------------------------------------------------------------------

/**
 * 1 ^ 1 = 0
 * 1 ^ 0 = 1
 * 0 ^ 1 = 1
 * 0 ^ 0 = 0
 */

console.log(5 ^ 3);          // 6
// 5 = 101
// 3 = 011
// -------
//     110 = 6

// Toggle a bit
const toggleBit = (num, pos) => num ^ (1 << pos);
console.log(toggleBit(0b1010, 1).toString(2)); // "1000"

// Swap without temp variable
let a = 5, b = 3;
a = a ^ b;
b = a ^ b;
a = a ^ b;
console.log(a, b);           // 3, 5

// -------------------------------------------------------------------------------------------
// 5. BITWISE NOT (~)
// -------------------------------------------------------------------------------------------

/**
 * Flips all bits. Result is -(n + 1)
 */

console.log(~5);             // -6
console.log(~-6);            // 5
console.log(~~3.7);          // 3 (fast Math.floor for positive)

// Check if in string (old pattern)
const str = 'hello';
if (~str.indexOf('h')) {     // -1 becomes 0 (falsy)
    console.log('Found');
}

// Modern alternative: includes()
if (str.includes('h')) {
    console.log('Found');
}

// -------------------------------------------------------------------------------------------
// 6. LEFT SHIFT (<<)
// -------------------------------------------------------------------------------------------

/**
 * Shifts bits left, fills with 0s.
 * Equivalent to multiplying by 2^n
 */

console.log(5 << 1);         // 10 (5 * 2)
console.log(5 << 2);         // 20 (5 * 4)
console.log(5 << 3);         // 40 (5 * 8)

// Create bit mask
const createMask = pos => 1 << pos;
console.log(createMask(3).toString(2)); // "1000"

// -------------------------------------------------------------------------------------------
// 7. RIGHT SHIFT (>>)
// -------------------------------------------------------------------------------------------

/**
 * Shifts bits right, preserves sign bit.
 * Equivalent to dividing by 2^n (rounds toward -infinity)
 */

console.log(20 >> 1);        // 10
console.log(20 >> 2);        // 5
console.log(-20 >> 2);       // -5 (sign preserved)

// Fast division by 2
const halfOf = num => num >> 1;
console.log(halfOf(100));    // 50

// -------------------------------------------------------------------------------------------
// 8. UNSIGNED RIGHT SHIFT (>>>)
// -------------------------------------------------------------------------------------------

/**
 * Shifts right, fills with 0s (treats as unsigned).
 */

console.log(-1 >>> 0);       // 4294967295 (max 32-bit unsigned)
console.log(-1 >> 0);        // -1

// Convert to unsigned 32-bit integer
const toUint32 = num => num >>> 0;
console.log(toUint32(-1));   // 4294967295

// -------------------------------------------------------------------------------------------
// 9. FLAGS AND PERMISSIONS
// -------------------------------------------------------------------------------------------

// Define permission flags
const READ    = 0b0001;  // 1
const WRITE   = 0b0010;  // 2
const EXECUTE = 0b0100;  // 4
const DELETE  = 0b1000;  // 8

// Combine permissions
const userPermissions = READ | WRITE;  // 3 (0b0011)
const adminPermissions = READ | WRITE | EXECUTE | DELETE;  // 15

// Check permission
function hasPermission(user, permission) {
    return (user & permission) === permission;
}

console.log(hasPermission(userPermissions, READ));     // true
console.log(hasPermission(userPermissions, EXECUTE));  // false

// Add permission
function addPermission(user, permission) {
    return user | permission;
}

// Remove permission
function removePermission(user, permission) {
    return user & ~permission;
}

// Toggle permission
function togglePermission(user, permission) {
    return user ^ permission;
}

// -------------------------------------------------------------------------------------------
// 10. BIT MANIPULATION TECHNIQUES
// -------------------------------------------------------------------------------------------

// Count set bits (population count)
function countBits(n) {
    let count = 0;
    while (n) {
        count += n & 1;
        n >>>= 1;
    }
    return count;
}
console.log(countBits(0b1011));  // 3

// Check if power of 2
function isPowerOf2(n) {
    return n > 0 && (n & (n - 1)) === 0;
}
console.log(isPowerOf2(8));   // true
console.log(isPowerOf2(6));   // false

// Clear lowest set bit
const clearLowestBit = n => n & (n - 1);
console.log(clearLowestBit(0b1010).toString(2));  // "1000"

// Isolate lowest set bit
const lowestBit = n => n & (-n);
console.log(lowestBit(0b1010).toString(2));  // "10"

// -------------------------------------------------------------------------------------------
// 11. RGB COLOR MANIPULATION
// -------------------------------------------------------------------------------------------

// Pack RGB into single number
function packRGB(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

// Unpack RGB
function unpackRGB(color) {
    return {
        r: (color >> 16) & 0xFF,
        g: (color >> 8) & 0xFF,
        b: color & 0xFF
    };
}

const purple = packRGB(128, 0, 128);
console.log(purple.toString(16));  // "800080"
console.log(unpackRGB(purple));    // { r: 128, g: 0, b: 128 }

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Fast multiply/divide by powers of 2
const multiply8 = n => n << 3;
const divide4 = n => n >> 2;

// Round down to nearest power of 2
function floorPow2(n) {
    n |= n >> 1;
    n |= n >> 2;
    n |= n >> 4;
    n |= n >> 8;
    n |= n >> 16;
    return n - (n >> 1);
}

// Sign of number (-1, 0, 1)
const sign = n => (n >> 31) | ((-n) >>> 31);

// Absolute value (only for 32-bit integers)
const abs = n => (n ^ (n >> 31)) - (n >> 31);

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * OPERATORS:
 * & (AND), | (OR), ^ (XOR), ~ (NOT)
 * << (left shift), >> (right shift), >>> (unsigned right)
 * 
 * COMMON USES:
 * - Flags/permissions system
 * - Fast math operations
 * - Color manipulation
 * - Low-level bit manipulation
 * 
 * TRICKS:
 * - n & 1: Check odd/even
 * - n & (n-1): Clear lowest bit / check power of 2
 * - n | (1 << pos): Set bit
 * - n ^ (1 << pos): Toggle bit
 * - ~~n: Fast floor (positive numbers)
 */
