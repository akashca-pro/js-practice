/**
 * TOPIC: PROMISE CONCURRENCY (all, allSettled, race, any)
 * DESCRIPTION:
 * JavaScript provides four static methods for handling multiple promises
 * concurrently. Each has different behavior for success and failure cases.
 */

// -------------------------------------------------------------------------------------------
// 1. PROMISE.ALL() - All Must Succeed
// -------------------------------------------------------------------------------------------

/**
 * Promise.all() takes an iterable of promises and:
 * - Resolves when ALL promises fulfill (with array of results).
 * - Rejects when ANY promise rejects (with first rejection reason).
 * 
 * Use case: Multiple dependent operations that all must succeed.
 */

async function allExample() {
    const promise1 = Promise.resolve(1);
    const promise2 = Promise.resolve(2);
    const promise3 = Promise.resolve(3);
    
    // All succeed - returns array of results in order
    const results = await Promise.all([promise1, promise2, promise3]);
    console.log("all success:", results); // [1, 2, 3]
}

async function allFailExample() {
    try {
        await Promise.all([
            Promise.resolve(1),
            Promise.reject(new Error("Failed!")),
            Promise.resolve(3)
        ]);
    } catch (error) {
        console.log("all failure:", error.message); // "Failed!"
        // NOTE: We don't know which other promises succeeded/failed
    }
}

/**
 * OPTIMIZATION: Non-promise values are wrapped in Promise.resolve()
 */
const mixed = await Promise.all([1, Promise.resolve(2), 3]);
console.log(mixed); // [1, 2, 3]

// -------------------------------------------------------------------------------------------
// 2. PROMISE.ALLSETTLED() - Wait for All, Regardless of Outcome
// -------------------------------------------------------------------------------------------

/**
 * Promise.allSettled() waits for ALL promises to settle (fulfill OR reject).
 * Never short-circuits. Returns array of result objects.
 * 
 * Each result has { status: 'fulfilled', value } or { status: 'rejected', reason }
 * 
 * Use case: Multiple independent operations where you want all results.
 */

async function allSettledExample() {
    const results = await Promise.allSettled([
        Promise.resolve("Success 1"),
        Promise.reject(new Error("Error 1")),
        Promise.resolve("Success 2"),
        Promise.reject(new Error("Error 2"))
    ]);
    
    console.log("allSettled results:");
    results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
            console.log(`  ${i}: SUCCESS -`, result.value);
        } else {
            console.log(`  ${i}: FAILED -`, result.reason.message);
        }
    });
    
    // Filter successes and failures
    const successes = results.filter(r => r.status === 'fulfilled').map(r => r.value);
    const failures = results.filter(r => r.status === 'rejected').map(r => r.reason);
    
    console.log("Successes:", successes);
    console.log("Failures:", failures.map(e => e.message));
}

allSettledExample();

// -------------------------------------------------------------------------------------------
// 3. PROMISE.RACE() - First to Settle Wins
// -------------------------------------------------------------------------------------------

/**
 * Promise.race() returns the result of the FIRST promise to settle.
 * Can be fulfillment OR rejection.
 * 
 * Use case: Timeouts, first available resource.
 */

async function raceExample() {
    const slow = new Promise(resolve => setTimeout(() => resolve("Slow"), 100));
    const fast = new Promise(resolve => setTimeout(() => resolve("Fast"), 50));
    
    const winner = await Promise.race([slow, fast]);
    console.log("race winner:", winner); // "Fast"
}

/**
 * PRACTICAL USE: Timeout Pattern
 */
function fetchWithTimeout(url, timeout) {
    const fetchPromise = fetch(url);
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), timeout);
    });
    
    return Promise.race([fetchPromise, timeoutPromise]);
}

// Usage:
// fetchWithTimeout('https://api.example.com/data', 5000)
//     .then(response => response.json())
//     .catch(error => console.log(error.message));

/**
 * NOTE: race() with rejection first
 */
async function raceFail() {
    try {
        await Promise.race([
            new Promise((_, reject) => setTimeout(() => reject(new Error("Fast Fail")), 50)),
            new Promise(resolve => setTimeout(() => resolve("Slow Success"), 100))
        ]);
    } catch (error) {
        console.log("race rejected:", error.message); // "Fast Fail"
    }
}

// -------------------------------------------------------------------------------------------
// 4. PROMISE.ANY() - First Success Wins (ES2021)
// -------------------------------------------------------------------------------------------

/**
 * Promise.any() returns the FIRST fulfilled promise.
 * Ignores rejections unless ALL promises reject.
 * 
 * Use case: Multiple fallback sources, first successful response.
 */

async function anyExample() {
    const result = await Promise.any([
        Promise.reject(new Error("Error 1")),
        new Promise(resolve => setTimeout(() => resolve("Success"), 100)),
        Promise.reject(new Error("Error 2"))
    ]);
    
    console.log("any success:", result); // "Success"
}

/**
 * ALL REJECTED: Throws AggregateError
 */
async function anyAllRejected() {
    try {
        await Promise.any([
            Promise.reject(new Error("Error 1")),
            Promise.reject(new Error("Error 2")),
            Promise.reject(new Error("Error 3"))
        ]);
    } catch (error) {
        console.log("any all rejected:", error.constructor.name); // "AggregateError"
        console.log("Errors:", error.errors.map(e => e.message));
        // ["Error 1", "Error 2", "Error 3"]
    }
}

/**
 * PRACTICAL USE: Multiple API Fallbacks
 */
async function fetchFromAnyMirror(mirrors) {
    try {
        const response = await Promise.any(
            mirrors.map(url => fetch(url))
        );
        return response.json();
    } catch (error) {
        throw new Error("All mirrors failed");
    }
}

// -------------------------------------------------------------------------------------------
// 5. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Method       | Resolves When        | Rejects When         | Short-circuits? |
 * |--------------|----------------------|----------------------|-----------------|
 * | all          | ALL fulfill          | ANY rejects          | Yes (on reject) |
 * | allSettled   | ALL settle           | Never                | No              |
 * | race         | FIRST settles        | FIRST settles        | Yes (first)     |
 * | any          | FIRST fulfills       | ALL reject           | Yes (on fulfill)|
 */

// -------------------------------------------------------------------------------------------
// 6. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * PATTERN 1: Batch Processing with allSettled
 */
async function batchProcess(items, processFn) {
    const results = await Promise.allSettled(
        items.map(item => processFn(item))
    );
    
    const successful = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failed = results
        .filter(r => r.status === 'rejected')
        .map((r, i) => ({ item: items[i], error: r.reason }));
    
    return { successful, failed };
}

/**
 * PATTERN 2: Race with Cancellation Token
 */
function createCancellablePromise(promise) {
    let cancel;
    const cancelPromise = new Promise((_, reject) => {
        cancel = () => reject(new Error("Cancelled"));
    });
    
    return {
        promise: Promise.race([promise, cancelPromise]),
        cancel
    };
}

/**
 * PATTERN 3: First N Results with any + Iteration
 */
async function firstNSuccessful(promises, n) {
    const results = [];
    const remaining = [...promises];
    
    while (results.length < n && remaining.length > 0) {
        try {
            const result = await Promise.any(remaining);
            results.push(result);
            // Remove the resolved promise (tricky in practice)
        } catch {
            break; // All remaining failed
        }
    }
    
    return results;
}

// -------------------------------------------------------------------------------------------
// 7. EMPTY ITERABLE BEHAVIOR
// -------------------------------------------------------------------------------------------

/**
 * Promise.all([]) - Resolves immediately with []
 * Promise.allSettled([]) - Resolves immediately with []
 * Promise.race([]) - NEVER settles (pending forever!)
 * Promise.any([]) - Rejects with AggregateError
 */

Promise.all([]).then(r => console.log("all empty:", r)); // []
Promise.allSettled([]).then(r => console.log("allSettled empty:", r)); // []
// Promise.race([]) - Would hang forever
Promise.any([]).catch(e => console.log("any empty:", e.constructor.name)); // AggregateError

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Promise.all: Use when ALL results are needed, any failure is fatal.
 * 2. Promise.allSettled: Use when you need to know outcome of ALL operations.
 * 3. Promise.race: Use for timeouts or first-response scenarios.
 * 4. Promise.any: Use when you need first success, failures are acceptable.
 * 
 * TIPS:
 * - allSettled is great for batch operations with partial success.
 * - race([]) never settles - be careful with dynamic arrays.
 * - any throws AggregateError when all fail - handle it appropriately.
 * - Always consider cancellation for race/any to clean up losing promises.
 */
