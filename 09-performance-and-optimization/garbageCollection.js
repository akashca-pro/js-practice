/**
 * TOPIC: GARBAGE COLLECTION
 * DESCRIPTION:
 * JavaScript uses automatic memory management. The garbage collector
 * identifies and frees memory that is no longer reachable by the program.
 * Understanding this is crucial for writing memory-efficient code.
 */

// -------------------------------------------------------------------------------------------
// 1. REACHABILITY - THE CORE CONCEPT
// -------------------------------------------------------------------------------------------

/**
 * The garbage collector uses "reachability" to decide what to keep.
 * ROOTS: Global variables, currently executing functions, and their local variables.
 * Any object reachable from a root (directly or via chain) stays in memory.
 */

let user = { name: "Alice" }; // 'user' is a root, object is reachable
user = null; // Object is now unreachable and will be garbage collected

// -------------------------------------------------------------------------------------------
// 2. MARK-AND-SWEEP ALGORITHM
// -------------------------------------------------------------------------------------------

/**
 * Modern JS engines (V8, SpiderMonkey) use variations of Mark-and-Sweep:
 * 
 * PHASE 1 - MARK:
 * 1. GC starts from roots and "marks" all reachable objects.
 * 2. It traverses object references recursively.
 * 
 * PHASE 2 - SWEEP:
 * 1. GC scans heap memory.
 * 2. Unmarked objects are considered garbage and freed.
 * 
 * OPTIMIZATION: Generational GC
 * - Young Generation: Newly created objects (collected frequently).
 * - Old Generation: Long-lived objects (collected less often).
 */

function demonstrateGC() {
    let localData = { large: new Array(10000).fill("data") };
    // 'localData' is reachable here
    return localData.large.length;
    // After function returns, 'localData' becomes unreachable
}

demonstrateGC(); // Memory is freed after this call

// -------------------------------------------------------------------------------------------
// 3. REFERENCE COUNTING (Legacy Approach)
// -------------------------------------------------------------------------------------------

/**
 * Older browsers used Reference Counting:
 * - Each object tracks how many references point to it.
 * - When count reaches 0, object is freed.
 * 
 * PROBLEM: Circular References
 */

function circularReferenceProblem() {
    let objA = {};
    let objB = {};
    
    objA.ref = objB; // objB refCount = 1
    objB.ref = objA; // objA refCount = 1
    
    // Even after function ends, both objects reference each other.
    // Reference Counting can't collect them. (Mark-and-Sweep CAN)
}

// -------------------------------------------------------------------------------------------
// 4. WEAK REFERENCES (WeakMap & WeakSet)
// -------------------------------------------------------------------------------------------

/**
 * WeakMap and WeakSet hold "weak" references that don't prevent GC.
 * Perfect for caching or storing metadata about objects.
 */

let cache = new WeakMap();

function processUser(user) {
    if (cache.has(user)) {
        return cache.get(user); // Return cached result
    }
    const result = { processed: true, timestamp: Date.now() };
    cache.set(user, result);
    return result;
}

let tempUser = { id: 1 };
processUser(tempUser);

// When 'tempUser = null', the entry in WeakMap is automatically removed
// No manual cleanup needed!

// -------------------------------------------------------------------------------------------
// 5. COMMON GC-RELATED ISSUES
// -------------------------------------------------------------------------------------------

/**
 * [A] Accidental Globals:
 */
function accidentalGlobal() {
    // Missing 'let/const' creates a global variable (memory leak!)
    leakedVar = "I'm global forever!"; // BAD
}

/**
 * [B] Forgotten Timers:
 */
function forgottenTimer() {
    const data = { heavy: new Array(100000) };
    
    setInterval(() => {
        // This closure keeps 'data' alive indefinitely
        console.log(data.heavy.length);
    }, 1000);
    
    // SOLUTION: Store interval ID and call clearInterval when done
}

/**
 * [C] Detached DOM Nodes:
 */
function detachedDOMNodes() {
    const button = document.createElement('button');
    const handler = () => console.log('Clicked!');
    
    button.addEventListener('click', handler);
    document.body.appendChild(button);
    
    // Later: button.remove() doesn't free memory if handler still references button
    // SOLUTION: button.removeEventListener('click', handler) before removal
}

// -------------------------------------------------------------------------------------------
// 6. FORCING GARBAGE COLLECTION (Development Only)
// -------------------------------------------------------------------------------------------

/**
 * In Node.js with --expose-gc flag, you can manually trigger GC:
 * 
 * $ node --expose-gc script.js
 */

// if (global.gc) {
//     global.gc(); // Forces garbage collection
// }

/**
 * WARNING: Never rely on manual GC in production code.
 * The engine knows better when to collect.
 */

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Nullify References: Set large objects to null when no longer needed.
 * 2. Use WeakMap/WeakSet: For caches and metadata that shouldn't prevent GC.
 * 3. Clean Up Timers: Always clear setInterval/setTimeout when done.
 * 4. Remove Event Listeners: Before removing DOM elements.
 * 5. Avoid Closures Over Large Data: Be mindful of what closures capture.
 * 6. Use 'let' and 'const': Prevents accidental global variables.
 */
