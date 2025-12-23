/**
 * TOPIC: NULLISH COALESCING & OPTIONAL CHAINING INTERNALS
 * DESCRIPTION:
 * Nullish coalescing (??) and optional chaining (?.) are ES2020 features
 * for safely handling null/undefined values. Understanding their
 * internals helps write cleaner, safer code.
 */

// -------------------------------------------------------------------------------------------
// 1. NULLISH COALESCING (??)
// -------------------------------------------------------------------------------------------

/**
 * ?? returns right side only if left is null or undefined.
 * Unlike ||, it doesn't treat 0, '', or false as "falsy defaults".
 */

const value1 = null ?? 'default';      // 'default'
const value2 = undefined ?? 'default'; // 'default'
const value3 = 0 ?? 'default';         // 0 (NOT 'default'!)
const value4 = '' ?? 'default';        // '' (NOT 'default'!)
const value5 = false ?? 'default';     // false (NOT 'default'!)

// Compare with ||
const or1 = 0 || 'default';     // 'default' (0 is falsy)
const or2 = '' || 'default';    // 'default' ('' is falsy)
const or3 = false || 'default'; // 'default' (false is falsy)

// -------------------------------------------------------------------------------------------
// 2. HOW ?? WORKS INTERNALLY
// -------------------------------------------------------------------------------------------

/**
 * a ?? b is equivalent to:
 * (a !== null && a !== undefined) ? a : b
 */

function nullishCoalesce(left, right) {
    return (left !== null && left !== undefined) ? left : right;
}

console.log(nullishCoalesce(null, 'fallback'));      // 'fallback'
console.log(nullishCoalesce(undefined, 'fallback')); // 'fallback'
console.log(nullishCoalesce(0, 'fallback'));         // 0

// -------------------------------------------------------------------------------------------
// 3. OPTIONAL CHAINING (?.)
// -------------------------------------------------------------------------------------------

/**
 * ?. short-circuits to undefined if left side is null/undefined.
 * Works with properties, methods, and array indices.
 */

const user = {
    name: 'Alice',
    address: {
        city: 'NYC'
    },
    greet() {
        return 'Hello!';
    }
};

// Property access
console.log(user?.name);            // 'Alice'
console.log(user?.address?.city);   // 'NYC'
console.log(user?.contact?.email);  // undefined (no error!)

// Method calls
console.log(user?.greet?.());       // 'Hello!'
console.log(user?.missing?.());     // undefined

// Array/bracket notation
const arr = [1, 2, 3];
console.log(arr?.[0]);              // 1
console.log(arr?.[10]);             // undefined

// -------------------------------------------------------------------------------------------
// 4. HOW ?. WORKS INTERNALLY
// -------------------------------------------------------------------------------------------

/**
 * a?.b is equivalent to:
 * (a === null || a === undefined) ? undefined : a.b
 */

function optionalChain(obj, ...keys) {
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined) {
            return undefined;
        }
        result = result[key];
    }
    return result;
}

console.log(optionalChain(user, 'address', 'city'));  // 'NYC'
console.log(optionalChain(user, 'contact', 'email')); // undefined

// -------------------------------------------------------------------------------------------
// 5. SHORT-CIRCUITING
// -------------------------------------------------------------------------------------------

/**
 * ?. short-circuits - right side is NOT evaluated if left is nullish.
 */

let callCount = 0;
function getProperty() {
    callCount++;
    return 'value';
}

const obj = null;
const result = obj?.prop?.[getProperty()];  // getProperty NOT called!
console.log(callCount);  // 0

// -------------------------------------------------------------------------------------------
// 6. COMBINING ?? AND ?.
// -------------------------------------------------------------------------------------------

/**
 * Common pattern: Use ?. to safely access, ?? for defaults.
 */

const config = {
    settings: {
        theme: 'dark'
    }
};

// Safe access with default
const theme = config?.settings?.theme ?? 'light';
const fontSize = config?.settings?.fontSize ?? 16;

console.log(theme);     // 'dark' (exists)
console.log(fontSize);  // 16 (default, didn't exist)

// -------------------------------------------------------------------------------------------
// 7. OPTIONAL METHOD CALLS
// -------------------------------------------------------------------------------------------

const api = {
    fetch: null,  // Not implemented
    save(data) { return 'saved'; }
};

// Safe method call
api.fetch?.('url');     // undefined (no error)
api.save?.('data');     // 'saved'

// Practical example
function callCallback(options) {
    options?.onSuccess?.();
    options?.onError?.();
}

callCallback({
    onSuccess: () => console.log('Success!')
    // onError not provided - no crash
});

// -------------------------------------------------------------------------------------------
// 8. DELETE WITH OPTIONAL CHAINING
// -------------------------------------------------------------------------------------------

const data = { user: { name: 'Bob' } };

// Delete only if path exists
delete data?.user?.name;  // Works
delete data?.missing?.prop;  // No error

// -------------------------------------------------------------------------------------------
// 9. PRECEDENCE AND GROUPING
// -------------------------------------------------------------------------------------------

/**
 * ?? has lower precedence than most operators.
 * Cannot mix with && or || without parentheses.
 */

// This is a syntax error:
// const x = a || b ?? c;

// Must use parentheses:
const a = null, b = false, c = 'default';
const result1 = (a || b) ?? c;  // 'default'
const result2 = a || (b ?? c);  // false

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Config with defaults
function getConfig(options) {
    return {
        host: options?.host ?? 'localhost',
        port: options?.port ?? 3000,
        debug: options?.debug ?? false
    };
}

console.log(getConfig({ port: 8080 }));
// { host: 'localhost', port: 8080, debug: false }

// Safe array access
function getFirstItem(arr) {
    return arr?.[0] ?? 'empty';
}

console.log(getFirstItem([1, 2, 3]));  // 1
console.log(getFirstItem(null));       // 'empty'
console.log(getFirstItem([]));         // 'empty'

// Nested API response
function processResponse(response) {
    const users = response?.data?.users ?? [];
    const total = response?.meta?.total ?? 0;
    const error = response?.error?.message ?? null;
    
    return { users, total, error };
}

// Event handler with optional callback
function handleClick(event, options) {
    options?.onClick?.(event);
    options?.analytics?.track?.('click', event.target);
}

// -------------------------------------------------------------------------------------------
// 11. NULLISH ASSIGNMENT (??=)
// -------------------------------------------------------------------------------------------

/**
 * ES2021: Assign only if current value is nullish.
 */

let x = null;
x ??= 'default';
console.log(x);  // 'default'

let y = 0;
y ??= 'default';
console.log(y);  // 0 (not replaced!)

// Practical: Initialize if missing
const settings = {};
settings.theme ??= 'light';
settings.theme ??= 'dark';  // Doesn't change - already set
console.log(settings.theme);  // 'light'

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * NULLISH COALESCING (??):
 * - Returns right side only if left is null/undefined
 * - Unlike ||, keeps 0, '', false
 * - Use for defaults that allow falsy values
 * 
 * OPTIONAL CHAINING (?.):
 * - Short-circuits to undefined on null/undefined
 * - Works with: obj?.prop, obj?.[key], fn?.()
 * - Prevents "Cannot read property of undefined" errors
 * 
 * BEST PRACTICES:
 * - Combine ?. and ?? for safe access with defaults
 * - Use ??= for conditional assignment
 * - Prefer ?? over || when 0/false are valid values
 * - Use ?. instead of && chains for property access
 */
