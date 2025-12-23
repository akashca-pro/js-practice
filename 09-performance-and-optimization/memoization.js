/**
 * TOPIC: MEMOIZATION
 * DESCRIPTION:
 * Memoization is an optimization technique that caches function results.
 * When called with the same arguments, the cached result is returned
 * instead of recomputing.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC MEMOIZATION
// -------------------------------------------------------------------------------------------

function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            console.log('Cache hit for:', key);
            return cache.get(key);
        }
        
        console.log('Computing for:', key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Example: Expensive calculation
const expensiveAdd = memoize((a, b) => {
    // Simulate expensive computation
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += a + b;
    return a + b;
});

console.log(expensiveAdd(1, 2));  // Computing: 3
console.log(expensiveAdd(1, 2));  // Cache hit: 3

// -------------------------------------------------------------------------------------------
// 2. FIBONACCI WITH MEMOIZATION
// -------------------------------------------------------------------------------------------

/**
 * Classic example: Fibonacci is exponential without memoization,
 * linear with memoization.
 */

// Without memoization - O(2^n)
function fibSlow(n) {
    if (n <= 1) return n;
    return fibSlow(n - 1) + fibSlow(n - 2);
}

// With memoization - O(n)
const fibMemo = memoize(function fib(n) {
    if (n <= 1) return n;
    return fibMemo(n - 1) + fibMemo(n - 2);
});

console.log(fibMemo(40));  // Fast!
// console.log(fibSlow(40));  // Very slow!

// -------------------------------------------------------------------------------------------
// 3. MEMOIZATION WITH SINGLE ARGUMENT
// -------------------------------------------------------------------------------------------

/**
 * Simpler memoization for single-argument functions.
 */

function memoizeSingle(fn) {
    const cache = new Map();
    
    return function(arg) {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}

const factorial = memoizeSingle(function fact(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
});

// -------------------------------------------------------------------------------------------
// 4. CUSTOM KEY FUNCTION
// -------------------------------------------------------------------------------------------

/**
 * For complex arguments, provide custom key generation.
 */

function memoizeWithKey(fn, keyFn) {
    const cache = new Map();
    
    return function(...args) {
        const key = keyFn ? keyFn(...args) : JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Custom key for user objects
const getUserData = memoizeWithKey(
    (user) => {
        // Expensive API call
        return { ...user, data: 'fetched' };
    },
    (user) => user.id  // Use user.id as cache key
);

// -------------------------------------------------------------------------------------------
// 5. LRU CACHE (Least Recently Used)
// -------------------------------------------------------------------------------------------

/**
 * Limit cache size to prevent memory issues.
 */

function memoizeLRU(fn, maxSize = 100) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn.apply(this, args);
        
        // Evict oldest if cache is full
        if (cache.size >= maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }
        
        cache.set(key, result);
        return result;
    };
}

// -------------------------------------------------------------------------------------------
// 6. TTL CACHE (Time To Live)
// -------------------------------------------------------------------------------------------

/**
 * Cache entries expire after timeout.
 */

function memoizeTTL(fn, ttlMs = 60000) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        const now = Date.now();
        
        if (cache.has(key)) {
            const { value, timestamp } = cache.get(key);
            if (now - timestamp < ttlMs) {
                return value;
            }
            cache.delete(key);  // Expired
        }
        
        const result = fn.apply(this, args);
        cache.set(key, { value: result, timestamp: now });
        return result;
    };
}

const fetchData = memoizeTTL(async (url) => {
    const response = await fetch(url);
    return response.json();
}, 30000);  // Cache for 30 seconds

// -------------------------------------------------------------------------------------------
// 7. ASYNC MEMOIZATION
// -------------------------------------------------------------------------------------------

function memoizeAsync(fn) {
    const cache = new Map();
    
    return async function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        // Store the promise, not the result
        // This prevents duplicate calls while first is pending
        const promise = fn.apply(this, args);
        cache.set(key, promise);
        
        try {
            return await promise;
        } catch (error) {
            cache.delete(key);  // Don't cache errors
            throw error;
        }
    };
}

// -------------------------------------------------------------------------------------------
// 8. MEMOIZATION WITH WEAKMAP
// -------------------------------------------------------------------------------------------

/**
 * For object arguments, WeakMap allows garbage collection.
 */

function memoizeWeak(fn) {
    const cache = new WeakMap();
    
    return function(obj) {
        if (cache.has(obj)) {
            return cache.get(obj);
        }
        
        const result = fn(obj);
        cache.set(obj, result);
        return result;
    };
}

const computeHash = memoizeWeak((obj) => {
    return JSON.stringify(obj).split('').reduce(
        (hash, char) => ((hash << 5) - hash) + char.charCodeAt(0), 0
    );
});

// -------------------------------------------------------------------------------------------
// 9. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// DOM element computation
const getElementStyles = memoizeSingle((selector) => {
    const element = document.querySelector(selector);
    return element ? window.getComputedStyle(element) : null;
});

// API call deduplication
const fetchUser = memoizeAsync(async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
});

// Expensive string operations
const parseTemplate = memoize((template, data) => {
    // Complex template parsing...
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
});

// -------------------------------------------------------------------------------------------
// 10. WHEN TO USE MEMOIZATION
// -------------------------------------------------------------------------------------------

/**
 * GOOD USE CASES:
 * - Pure functions with expensive computations
 * - Recursive functions with overlapping subproblems
 * - API calls that can be cached
 * - DOM computations
 * 
 * BAD USE CASES:
 * - Functions with side effects
 * - Functions with many unique arguments
 * - Simple/fast functions (overhead not worth it)
 * - Functions where results change over time
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * MEMOIZATION:
 * - Cache function results based on arguments
 * - Trade memory for speed
 * - Use JSON.stringify for key by default
 * - Custom keys for complex arguments
 * 
 * VARIATIONS:
 * - LRU: Limit cache size
 * - TTL: Expire old entries
 * - WeakMap: Allow garbage collection
 * - Async: Handle promises properly
 * 
 * REMEMBER:
 * - Only for pure functions
 * - Consider memory impact
 * - Clear cache when data becomes stale
 */
