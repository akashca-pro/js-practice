/**
 * TOPIC: PROMISES (Chaining, Error Handling, Optimization)
 * DESCRIPTION:
 * Promises represent the eventual completion (or failure) of an
 * asynchronous operation. They provide a cleaner alternative to
 * callbacks and enable powerful patterns for async programming.
 */

// -------------------------------------------------------------------------------------------
// 1. PROMISE BASICS
// -------------------------------------------------------------------------------------------

/**
 * A Promise has three states:
 * - PENDING: Initial state, neither fulfilled nor rejected.
 * - FULFILLED: Operation completed successfully.
 * - REJECTED: Operation failed.
 * 
 * Once settled (fulfilled or rejected), a promise is immutable.
 */

const basicPromise = new Promise((resolve, reject) => {
    const success = true;
    
    setTimeout(() => {
        if (success) {
            resolve("Operation succeeded!");
        } else {
            reject(new Error("Operation failed!"));
        }
    }, 1000);
});

basicPromise
    .then(result => console.log(result))
    .catch(error => console.error(error));

// -------------------------------------------------------------------------------------------
// 2. PROMISE CHAINING
// -------------------------------------------------------------------------------------------

/**
 * Each .then() returns a NEW promise, allowing chaining.
 * The returned value becomes the input for the next .then().
 */

function fetchUser(id) {
    return Promise.resolve({ id, name: "Alice" });
}

function fetchPosts(user) {
    return Promise.resolve([
        { id: 1, title: "Post by " + user.name },
        { id: 2, title: "Another post" }
    ]);
}

function fetchComments(posts) {
    return Promise.resolve(
        posts.map(post => ({ postId: post.id, comment: "Great!" }))
    );
}

// Flat chain - much cleaner than nested callbacks!
fetchUser(1)
    .then(user => {
        console.log("User:", user);
        return fetchPosts(user);
    })
    .then(posts => {
        console.log("Posts:", posts);
        return fetchComments(posts);
    })
    .then(comments => {
        console.log("Comments:", comments);
    })
    .catch(error => {
        console.error("Error in chain:", error);
    });

// -------------------------------------------------------------------------------------------
// 3. RETURNING VALUES VS PROMISES IN CHAINS
// -------------------------------------------------------------------------------------------

/**
 * .then() can return:
 * 1. A plain value - Wrapped in resolved promise automatically.
 * 2. A promise - Chain waits for it to settle.
 * 3. throw - Rejects the chain (goes to .catch).
 */

Promise.resolve(1)
    .then(x => x + 1)           // Returns 2
    .then(x => Promise.resolve(x * 2))  // Returns Promise that resolves to 4
    .then(x => {
        console.log("Result:", x);  // 4
        return x;
    });

// -------------------------------------------------------------------------------------------
// 4. ERROR HANDLING
// -------------------------------------------------------------------------------------------

/**
 * Errors propagate down the chain until caught.
 * .catch() handles any error in the chain above it.
 */

Promise.resolve()
    .then(() => {
        throw new Error("Step 1 failed!");
    })
    .then(() => {
        console.log("This never runs");
    })
    .catch(error => {
        console.error("Caught:", error.message); // "Step 1 failed!"
        return "Recovered"; // Chain can continue after catch
    })
    .then(result => {
        console.log("After recovery:", result); // "Recovered"
    });

/**
 * UNHANDLED REJECTIONS:
 * Always end chains with .catch() to prevent unhandled rejections.
 */

// Bad - unhandled rejection:
// Promise.reject(new Error("Oops!"));

// Good:
Promise.reject(new Error("Oops!")).catch(e => console.error("Handled:", e.message));

// -------------------------------------------------------------------------------------------
// 5. .FINALLY()
// -------------------------------------------------------------------------------------------

/**
 * .finally() runs regardless of success or failure.
 * Perfect for cleanup operations.
 */

function fetchWithLoading() {
    console.log("Loading started...");
    
    return fetch("https://api.example.com/data")
        .then(response => response.json())
        .catch(error => {
            console.error("Fetch failed:", error);
            throw error; // Re-throw to propagate
        })
        .finally(() => {
            console.log("Loading finished."); // Always runs
        });
}

// -------------------------------------------------------------------------------------------
// 6. STATIC PROMISE METHODS
// -------------------------------------------------------------------------------------------

/**
 * Promise.resolve(value) - Creates a resolved promise.
 * Promise.reject(reason) - Creates a rejected promise.
 */

const resolved = Promise.resolve(42);
const rejected = Promise.reject(new Error("Rejected"));

resolved.then(console.log); // 42
rejected.catch(e => console.log(e.message)); // "Rejected"

// -------------------------------------------------------------------------------------------
// 7. PROMISE ANTI-PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * ANTI-PATTERN 1: Nested Promises (Callback Hell Redux)
 */
// BAD:
fetchUser(1).then(user => {
    fetchPosts(user).then(posts => {
        fetchComments(posts).then(comments => {
            console.log(comments);
        });
    });
});

// GOOD: Use flat chaining (see section 2)

/**
 * ANTI-PATTERN 2: The Explicit Construction Anti-pattern
 */
// BAD - Wrapping existing promise:
function badWrapper() {
    return new Promise((resolve, reject) => {
        fetchUser(1)
            .then(user => resolve(user))
            .catch(err => reject(err));
    });
}

// GOOD - Just return the promise:
function goodWrapper() {
    return fetchUser(1);
}

/**
 * ANTI-PATTERN 3: Not Returning Promises in Chains
 */
// BAD - Broken chain:
Promise.resolve()
    .then(() => {
        fetchUser(1); // Missing return! Promise result is lost.
    })
    .then(user => {
        console.log(user); // undefined!
    });

// GOOD:
Promise.resolve()
    .then(() => {
        return fetchUser(1); // Return the promise
    })
    .then(user => {
        console.log(user); // { id: 1, name: "Alice" }
    });

// -------------------------------------------------------------------------------------------
// 8. OPTIMIZATION TECHNIQUES
// -------------------------------------------------------------------------------------------

/**
 * TECHNIQUE 1: Early Bailout
 */
function getUser(id) {
    if (!id) {
        return Promise.reject(new Error("ID required")); // Early validation
    }
    return fetchUser(id);
}

/**
 * TECHNIQUE 2: Parallel Independent Operations
 */
async function fetchDashboard(userId) {
    // BAD - Sequential (slow):
    // const user = await fetchUser(userId);
    // const posts = await fetchPosts(user);
    // const notifications = await fetchNotifications();
    
    // GOOD - Parallel where possible:
    const [user, notifications] = await Promise.all([
        fetchUser(userId),
        Promise.resolve([]) // fetchNotifications()
    ]);
    const posts = await fetchPosts(user); // This depends on user
    
    return { user, posts, notifications };
}

/**
 * TECHNIQUE 3: Lazy Promise Creation
 */
function lazyFetch(url) {
    let promise = null;
    
    return function() {
        if (!promise) {
            promise = fetch(url); // Only creates promise when first called
        }
        return promise;
    };
}

const getLazyData = lazyFetch("https://api.example.com/data");
// Promise not created yet
// getLazyData(); // Now promise is created and cached

// -------------------------------------------------------------------------------------------
// 9. CONVERTING CALLBACKS TO PROMISES
// -------------------------------------------------------------------------------------------

/**
 * Promisify - Convert callback-based APIs to Promise-based
 */
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
    };
}

// Example with setTimeout:
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

delay(1000).then(() => console.log("1 second passed"));

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Always return Promises in chains.
 * 2. Always end chains with .catch().
 * 3. Use .finally() for cleanup.
 * 4. Avoid nesting - use flat chains or async/await.
 * 5. Don't wrap promises unnecessarily (explicit construction anti-pattern).
 * 6. Use Promise.all() for parallel operations.
 * 7. Validate early to avoid unnecessary async work.
 * 8. Consider async/await for complex chains (cleaner syntax).
 */
