/**
 * PATTERN: CLOSURES DEEP DIVE
 * DESCRIPTION:
 * A comprehensive guide to closures, covering memory mechanics, loops, 
 * factory patterns, async behavior, and comparisons with modern classes.
 */

// -------------------------------------------------------------------------------------------
// 1. UNDERSTANDING CLOSURES & MEMORY
// -------------------------------------------------------------------------------------------

/**
 * A closure is a function bundled together with its lexical environment.
 * It retains access to variables from its scope even after that scope has finished execution.
 */
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2

/**
 * MECHANICS & MEMORY:
 * 1. createCounter() execution context is created.
 * 2. 'count' is allocated in the lexical environment.
 * 3. Normally, the scope would be garbage-collected after execution.
 * 4. THE HEAP: Because the returned function still holds a reference to 'count',
 * JS preserves this environment on the Heap.
 * 5. GARBAGE COLLECTION: If 'counter = null', the reference is lost and the 
 * environment is finally cleaned up.
 */

// -------------------------------------------------------------------------------------------
// 2. CLOSURES IN LOOPS (VAR VS LET VS IIFE)
// -------------------------------------------------------------------------------------------

/**
 * VAR (Function Scoped):
 * There is only ONE instance of 'i'. By the time setTimeout runs (100ms later), 
 * the loop is finished and 'i' is 3. All closures point to the same final value.
 */
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var loop:", i), 100); // 3, 3, 3
}

/**
 * LET (Block Scoped):
 * JS creates a NEW BINDING for 'i' for every iteration.
 * Each closure captures a unique "snapshot" of 'i'.
 */
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let loop:", j), 100); // 0, 1, 2
}

/**
 * IIFE (Legacy Solution):
 * Manually forces a new scope to "capture" the current value of 'i'.
 */
for (var k = 0; k < 3; k++) {
  (function(capturedK) {
    setTimeout(() => console.log("IIFE loop:", capturedK), 100);
  })(k); 
}

// -------------------------------------------------------------------------------------------
// 3. FACTORY PATTERN (TRUE PRIVACY)
// -------------------------------------------------------------------------------------------

function createUser(email) {
  let passwordHash = "hashed-secret"; // Physically unreachable "Private State"

  return {
    getEmail() { return email; }, // Read-only access (No setter)
    verifyPassword(input) { return input === passwordHash; } // Data hiding
  };
}

const user = createUser("a@b.com");

// -------------------------------------------------------------------------------------------
// 4. CLOSURES VS. CLASSES
// -------------------------------------------------------------------------------------------

/**
 * CLOSURE (Factory):
 * - True Privacy: Variables are inaccessible.
 * - Context Safe: No 'this' binding issues.
 * - Best For: Functional programming, high-security modules.
 */
const createDogClosure = (name) => ({
  bark: () => console.log(`${name} barks!`)
});

/**
 * CLASS (Prototype):
 * - Prototype Sharing: Methods are shared across instances (memory efficient).
 * - Inheritance: Easier to use 'extends'.
 * - Best For: Large-scale OOP, performance-critical object creation.
 */
class DogClass {
  constructor(name) { this.name = name; }
  bark() { console.log(`${this.name} barks!`); }
}

/**
 * THE PERFORMANCE DIFFERENCE:
 * 1. Closure: Every new object creates a new function in memory.
 * 2. Class: Every new object points to the same prototype function.
 */

// -------------------------------------------------------------------------------------------
// 5. CLOSURES IN ASYNC OPERATIONS
// -------------------------------------------------------------------------------------------

/**
 * Closures are vital in async JS (Promises/Fetch) to maintain state 
 * during long-running tasks.
 */
function fetchUserData(userId) {
  const requestTime = new Date().toLocaleTimeString();

  return fetch(`https://api.example.com/user/${userId}`)
    .then(response => {
      // This callback is a closure! 
      // it remembers 'userId' and 'requestTime' even though fetchUserData() ended long ago.
      console.log(`Request for ${userId} (started at ${requestTime}) completed.`);
    });
}

/**
 * STEP EXPLANATION:
 * 1. fetchUserData is called and returns a Promise.
 * 2. The function context pops off the stack.
 * 3. Seconds later, the network request returns.
 * 4. The .then() callback is pushed to the Task Queue.
 * 5. Because of the Closure, the callback still sees the variables from the parent scope.
 */

// -------------------------------------------------------------------------------------------
// 6. DISADVANTAGES OF CLOSURES
// -------------------------------------------------------------------------------------------

/**
 * [A] Memory Consumption:
 * Since closures prevent garbage collection of their outer scope, keeping too 
 * many large closures active can lead to high memory usage.
 * * [B] Performance Overhead:
 * Creating functions inside functions (Factories) is slower than using prototypes 
 * because functions are re-created on every call.
 * * [C] Difficult Debugging:
 * Deeply nested closures can make stack traces harder to read and variables 
 * harder to inspect in some environments.
 */

// Example of a potential Memory Leak
function leak() {
  const hugeData = new Array(1000000).fill("💾");
  return function() {
    // This closure keeps 'hugeData' alive in the heap indefinitely
    // as long as the returned function is referenced.
    console.log(hugeData.length);
  };
}
const stayAlive = leak();