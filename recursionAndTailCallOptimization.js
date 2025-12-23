/**
 * TOPIC: RECURSION & TAIL CALL OPTIMIZATION
 * DESCRIPTION:
 * Recursion is when a function calls itself to solve a problem.
 * Tail Call Optimization (TCO) is an optimization where tail-recursive
 * calls don't add stack frames, preventing stack overflow.
 */

// -------------------------------------------------------------------------------------------
// 1. RECURSION BASICS
// -------------------------------------------------------------------------------------------

/**
 * Every recursive function needs:
 * 1. Base case(s) - when to stop
 * 2. Recursive case(s) - calls itself with smaller problem
 */

function factorial(n) {
    // Base case
    if (n <= 1) return 1;
    
    // Recursive case
    return n * factorial(n - 1);
}

console.log(factorial(5)); // 120 (5 * 4 * 3 * 2 * 1)

// Call stack for factorial(5):
// factorial(5) -> 5 * factorial(4)
// factorial(4) -> 4 * factorial(3)
// factorial(3) -> 3 * factorial(2)
// factorial(2) -> 2 * factorial(1)
// factorial(1) -> 1
// Then unwind: 2*1=2, 3*2=6, 4*6=24, 5*24=120

// -------------------------------------------------------------------------------------------
// 2. COMMON RECURSIVE PATTERNS
// -------------------------------------------------------------------------------------------

// Fibonacci (naive - exponential time)
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Sum of array
function sum(arr) {
    if (arr.length === 0) return 0;
    return arr[0] + sum(arr.slice(1));
}

// Flatten nested array
function flatten(arr) {
    return arr.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}

console.log(flatten([1, [2, [3, [4]]]])); // [1, 2, 3, 4]

// Deep clone
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }
    
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
    );
}

// -------------------------------------------------------------------------------------------
// 3. THE STACK OVERFLOW PROBLEM
// -------------------------------------------------------------------------------------------

/**
 * Each recursive call adds a frame to the call stack.
 * Too many calls = stack overflow.
 */

function countDown(n) {
    if (n === 0) return;
    console.log(n);
    countDown(n - 1);
}

// countDown(100000); // RangeError: Maximum call stack size exceeded

// -------------------------------------------------------------------------------------------
// 4. TAIL CALL OPTIMIZATION (TCO)
// -------------------------------------------------------------------------------------------

/**
 * A TAIL CALL is when a function call is the LAST thing before return.
 * With TCO, the engine reuses the current stack frame.
 * 
 * NOTE: TCO is only implemented in Safari. V8/Node don't support it.
 */

// NOT a tail call - operation happens after recursive call
function factorialNotTail(n) {
    if (n <= 1) return 1;
    return n * factorialNotTail(n - 1); // multiply AFTER call returns
}

// IS a tail call - recursive call IS the last operation
function factorialTail(n, accumulator = 1) {
    if (n <= 1) return accumulator;
    return factorialTail(n - 1, n * accumulator); // Nothing after the call
}

console.log(factorialTail(5)); // 120

// -------------------------------------------------------------------------------------------
// 5. CONVERTING TO TAIL RECURSION
// -------------------------------------------------------------------------------------------

/**
 * General pattern: Use an accumulator parameter.
 */

// Non-tail: Sum
function sumNonTail(arr) {
    if (arr.length === 0) return 0;
    return arr[0] + sumNonTail(arr.slice(1)); // addition after call
}

// Tail: Sum
function sumTail(arr, acc = 0) {
    if (arr.length === 0) return acc;
    return sumTail(arr.slice(1), acc + arr[0]); // tail call
}

// Non-tail: Fibonacci
function fibNonTail(n) {
    if (n <= 1) return n;
    return fibNonTail(n - 1) + fibNonTail(n - 2);
}

// Tail: Fibonacci (using two accumulators)
function fibTail(n, current = 0, next = 1) {
    if (n === 0) return current;
    return fibTail(n - 1, next, current + next);
}

console.log(fibTail(10)); // 55

// -------------------------------------------------------------------------------------------
// 6. TRAMPOLINING (TCO Alternative)
// -------------------------------------------------------------------------------------------

/**
 * Trampoline: Convert recursion to iteration.
 * Return a function to continue, or a value to stop.
 */

function trampoline(fn) {
    return function trampolined(...args) {
        let result = fn(...args);
        while (typeof result === 'function') {
            result = result();
        }
        return result;
    };
}

// Recursive version - will overflow
function sumRecursive(n, acc = 0) {
    if (n === 0) return acc;
    return sumRecursive(n - 1, acc + n);
}

// Trampolined version - won't overflow
function sumTrampoline(n, acc = 0) {
    if (n === 0) return acc;
    return () => sumTrampoline(n - 1, acc + n); // Return thunk
}

const sum2 = trampoline(sumTrampoline);
console.log(sum2(10000)); // 50005000 - No stack overflow!

// -------------------------------------------------------------------------------------------
// 7. ITERATION VS RECURSION
// -------------------------------------------------------------------------------------------

/**
 * Any recursion can be converted to iteration (and vice versa).
 * Iteration is often more performant in JS due to lack of TCO.
 */

// Recursive factorial
const factorialRec = n => n <= 1 ? 1 : n * factorialRec(n - 1);

// Iterative factorial
function factorialIter(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Recursive tree traversal
function traverseRecursive(node, visit) {
    if (!node) return;
    visit(node);
    node.children?.forEach(child => traverseRecursive(child, visit));
}

// Iterative tree traversal (using stack)
function traverseIterative(root, visit) {
    const stack = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        visit(node);
        stack.push(...(node.children || []).reverse());
    }
}

// -------------------------------------------------------------------------------------------
// 8. MEMOIZATION WITH RECURSION
// -------------------------------------------------------------------------------------------

/**
 * Cache results to avoid redundant calculations.
 */

function memoize(fn) {
    const cache = new Map();
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) return cache.get(key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

const fibMemo = memoize(function(n) {
    if (n <= 1) return n;
    return fibMemo(n - 1) + fibMemo(n - 2);
});

console.log(fibMemo(40)); // Fast! (without memo would take forever)

// -------------------------------------------------------------------------------------------
// 9. MUTUAL RECURSION
// -------------------------------------------------------------------------------------------

/**
 * Functions that call each other.
 */

function isEven(n) {
    if (n === 0) return true;
    return isOdd(n - 1);
}

function isOdd(n) {
    if (n === 0) return false;
    return isEven(n - 1);
}

console.log(isEven(4)); // true
console.log(isOdd(5));  // true

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * RECURSION:
 * - Function calls itself with smaller problem
 * - Needs base case and recursive case
 * - Elegant for tree-like/nested data
 * 
 * TAIL CALL OPTIMIZATION:
 * - Recursive call must be the LAST operation
 * - Use accumulator pattern
 * - Only works in Safari (not V8/Node)
 * 
 * ALTERNATIVES:
 * - Trampolining: Convert to iteration with thunks
 * - Iteration: Use loops instead
 * - Memoization: Cache results for performance
 * 
 * WHEN TO USE RECURSION:
 * - Trees, graphs, nested structures
 * - Divide-and-conquer algorithms
 * - When recursive solution is clearer
 * - With memoization for overlapping subproblems
 */
