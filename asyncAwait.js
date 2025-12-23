/**
 * TOPIC: ASYNC/AWAIT INTERNALS
 * DESCRIPTION:
 * async/await is syntactic sugar over Promises that makes asynchronous
 * code look and behave more like synchronous code. Understanding the
 * internals helps write better async code.
 */

// -------------------------------------------------------------------------------------------
// 1. ASYNC FUNCTIONS BASICS
// -------------------------------------------------------------------------------------------

/**
 * An async function ALWAYS returns a Promise.
 * - Return a value? Wrapped in Promise.resolve().
 * - Throw an error? Wrapped in Promise.reject().
 */

async function returnValue() {
    return 42; // Same as: return Promise.resolve(42);
}

async function throwError() {
    throw new Error("Oops!"); // Same as: return Promise.reject(new Error("Oops!"));
}

returnValue().then(console.log); // 42
throwError().catch(e => console.log(e.message)); // "Oops!"

// -------------------------------------------------------------------------------------------
// 2. AWAIT - PAUSING EXECUTION
// -------------------------------------------------------------------------------------------

/**
 * 'await' pauses the async function execution until the Promise settles.
 * 
 * IMPORTANT: It doesn't block the main thread!
 * The function is suspended, and control returns to the caller.
 */

async function fetchData() {
    console.log("1. Before await");
    
    const result = await Promise.resolve("Data loaded");
    // Function pauses here, execution returns to caller
    
    console.log("2. After await:", result);
    return result;
}

console.log("Start");
fetchData().then(() => console.log("4. fetchData done"));
console.log("3. After calling fetchData");

// Output order: "Start", "1. Before await", "3. After calling fetchData", 
//              "2. After await: Data loaded", "4. fetchData done"

// -------------------------------------------------------------------------------------------
// 3. HOW ASYNC/AWAIT WORKS INTERNALLY
// -------------------------------------------------------------------------------------------

/**
 * async/await is transformed into state machine + Promises by the engine.
 * 
 * This async function:
 */
async function example() {
    const a = await Promise.resolve(1);
    const b = await Promise.resolve(2);
    return a + b;
}

/**
 * Is roughly equivalent to:
 */
function exampleDesugared() {
    return Promise.resolve(1)
        .then(a => {
            return Promise.resolve(2)
                .then(b => {
                    return a + b;
                });
        });
}

// -------------------------------------------------------------------------------------------
// 4. ERROR HANDLING WITH TRY/CATCH
// -------------------------------------------------------------------------------------------

/**
 * Use try/catch to handle rejected promises.
 * This is cleaner than .catch() chains.
 */

async function handleErrors() {
    try {
        const result = await Promise.reject(new Error("Failed!"));
        console.log(result); // Never reached
    } catch (error) {
        console.error("Caught:", error.message); // "Caught: Failed!"
    } finally {
        console.log("Cleanup"); // Always runs
    }
}

handleErrors();

/**
 * PATTERN: Catching specific errors
 */
async function handleSpecificErrors() {
    try {
        await riskyOperation();
    } catch (error) {
        if (error.code === 'NETWORK_ERROR') {
            await retryOperation();
        } else if (error.code === 'AUTH_ERROR') {
            await redirectToLogin();
        } else {
            throw error; // Re-throw unknown errors
        }
    }
}

async function riskyOperation() {}
async function retryOperation() {}
async function redirectToLogin() {}

// -------------------------------------------------------------------------------------------
// 5. PARALLEL EXECUTION
// -------------------------------------------------------------------------------------------

/**
 * SEQUENTIAL (Slow) - Each await waits for previous:
 */
async function sequential() {
    const a = await delay(1000); // Wait 1s
    const b = await delay(1000); // Wait 1s
    const c = await delay(1000); // Wait 1s
    // Total: 3 seconds
}

function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(ms), ms));
}

/**
 * PARALLEL (Fast) - Start all at once, await together:
 */
async function parallel() {
    const [a, b, c] = await Promise.all([
        delay(1000),
        delay(1000),
        delay(1000)
    ]);
    // Total: ~1 second
}

/**
 * PARALLEL WITH IMMEDIATE START:
 * Start promises immediately, await later.
 */
async function parallelImmediate() {
    // All three start immediately
    const promiseA = delay(1000);
    const promiseB = delay(1000);
    const promiseC = delay(1000);
    
    // Now await them
    const a = await promiseA;
    const b = await promiseB;
    const c = await promiseC;
    // Total: ~1 second
}

// -------------------------------------------------------------------------------------------
// 6. COMMON PITFALLS
// -------------------------------------------------------------------------------------------

/**
 * PITFALL 1: Forgetting await
 */
async function forgotAwait() {
    const promise = fetch('https://api.example.com/data');
    // promise.json(); // Wrong! promise is not a Response
    
    const response = await fetch('https://api.example.com/data');
    const data = await response.json(); // Correct
}

/**
 * PITFALL 2: await in forEach (doesn't work as expected)
 */
async function awaitInForEach() {
    const items = [1, 2, 3];
    
    // BAD - forEach doesn't wait for async callbacks!
    items.forEach(async (item) => {
        await delay(100);
        console.log(item);
    });
    console.log("Done"); // Prints BEFORE the items!
    
    // GOOD - Use for...of for sequential
    for (const item of items) {
        await delay(100);
        console.log(item);
    }
    console.log("Done"); // Prints AFTER all items
    
    // GOOD - Use Promise.all for parallel
    await Promise.all(items.map(async (item) => {
        await delay(100);
        console.log(item);
    }));
    console.log("Done"); // Prints AFTER all items
}

/**
 * PITFALL 3: Unhandled rejections
 */
async function unhandledRejection() {
    // If no try/catch and no .catch(), rejection is unhandled
    await Promise.reject(new Error("Unhandled!"));
}

// unhandledRejection(); // Causes UnhandledPromiseRejection warning

// -------------------------------------------------------------------------------------------
// 7. TOP-LEVEL AWAIT (ES2022)
// -------------------------------------------------------------------------------------------

/**
 * In ES Modules, you can use await at the top level.
 * The module becomes async and delays dependent modules.
 */

// In an ES Module (.mjs or type: "module"):
// const data = await fetch('https://api.example.com/config').then(r => r.json());
// export default data;

// -------------------------------------------------------------------------------------------
// 8. ASYNC ITERATORS & FOR AWAIT...OF
// -------------------------------------------------------------------------------------------

/**
 * for await...of works with async iterables.
 * See "Asynchronous Iteration" file for details.
 */

async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

async function useAsyncIterator() {
    for await (const value of asyncGenerator()) {
        console.log(value);
    }
}

// -------------------------------------------------------------------------------------------
// 9. PERFORMANCE CONSIDERATIONS
// -------------------------------------------------------------------------------------------

/**
 * 1. Microtask Queue: await schedules continuation as microtask.
 * 2. Avoid unnecessary await: Don't await non-promise values.
 * 3. Batch operations: Use Promise.all for independent operations.
 * 4. Consider streaming: For large data, use async iterators.
 */

// BAD: Awaiting a non-Promise (still works, but unnecessary)
async function unnecessary() {
    const x = await 42; // Wraps in promise, adds microtask delay
    return x;
}

// GOOD: Just return the value
async function necessary() {
    const x = 42;
    return x;
}

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. async functions always return Promises.
 * 2. await pauses function, not the thread.
 * 3. Use try/catch for error handling.
 * 4. Use Promise.all() for parallel operations.
 * 5. Don't use await in forEach - use for...of or map + Promise.all.
 * 6. Always handle rejections (try/catch or .catch()).
 * 7. Start promises early if you want parallelism.
 * 8. async/await is syntactic sugar - understand Promises first!
 */
