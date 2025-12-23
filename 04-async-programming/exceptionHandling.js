/**
 * TOPIC: EXCEPTION HANDLING & ERROR MANAGEMENT
 * * DESCRIPTION:
 * JavaScript utilizes a "Bubble Up" mechanism where errors travel up the call stack 
 * until they meet a catch block. If they reach the top without being caught, 
 * the process usually terminates or enters an unstable state.
 */

// -------------------------------------------------------------------------------------------
// 1. GLOBAL ERROR HANDLERS (The Last Line of Defense)
// -------------------------------------------------------------------------------------------

/**
 * process.on('uncaughtException'):
 * - Catches errors that were never wrapped in a try/catch.
 * - WARNING: The process is in an "inconsistent state." Use this for logging 
 * and graceful shutdown (closing DB connections), not for continuing execution.
 */
process.on('uncaughtException', (err) => {
    console.error("CRITICAL: Uncaught Exception - Shutting down...", err.message);
    // process.exit(1); // Standard practice: exit with failure code
});

/**
 * process.on('unhandledRejection'):
 * - Specifically for Promises that were rejected without a .catch() or try/catch block.
 */
process.on('unhandledRejection', (reason, promise) => {
    console.error("WARNING: Unhandled Promise Rejection at:", promise, "reason:", reason);
});

// -------------------------------------------------------------------------------------------
// 2. NATIVE ERROR TYPES
// -------------------------------------------------------------------------------------------

function demonstrateErrors() {
    try {
        // 1. ReferenceError: Using a variable that hasn't been declared
        // console.log(nonExistent);

        // 2. TypeError: Operating on a value of the wrong type
        // const x = null; x.foo(); 

        // 3. SyntaxError: Invalid JS syntax (usually caught at parse time)
        // eval('var = 10');

        // 4. RangeError: Numeric value out of valid range
        // new Array(-1);

        // 5. URIError: Misusing global URI handling functions
        // decodeURI('%');

    } catch (err) {
        if (err instanceof ReferenceError) console.error("Found ReferenceError");
        else if (err instanceof TypeError) console.error("Found TypeError");
        else console.error("Other Error:", err.name);
    }
}

// -------------------------------------------------------------------------------------------
// 3. CUSTOM ERROR CLASSES (Best Practice)
// -------------------------------------------------------------------------------------------

/**
 * Creating custom classes allows you to add metadata (like HTTP status codes) 
 * to your errors, making them more useful for API development.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor); // Removes this constructor from stack trace
    }
}

function validateAge(age) {
    if (age < 18) {
        throw new AppError("User must be an adult", 400);
    }
    return true;
}

// -------------------------------------------------------------------------------------------
// 4. ASYNC ERROR HANDLING (Try/Catch vs .catch)
// -------------------------------------------------------------------------------------------

/**
 * Async/Await handles errors synchronously within the block, making it 
 * much cleaner than nested callback error handling.
 */
async function performTask() {
    try {
        const data = await Promise.reject(new Error("Database Timeout"));
    } catch (err) {
        console.error("Async Error Captured:", err.message);
    } finally {
        console.log("Cleanup: Closing connections..."); // Always runs regardless of error
    }
}

// -------------------------------------------------------------------------------------------
// 5. THE "RESULT" PATTERN (Alternative to Throwing)
// -------------------------------------------------------------------------------------------

/**
 * Instead of throwing (which is expensive and disrupts flow), return an object.
 * This is popular in Go and Rust-style JavaScript.
 */
function safeDivision(a, b) {
    if (b === 0) {
        return { success: false, error: "Cannot divide by zero" };
    }
    return { success: true, data: a / b };
}

const result = safeDivision(10, 0);
if (!result.success) {
    console.log("Handled gracefully:", result.error);
}

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------
/**
 * 1. Never 'throw' strings: Always throw 'new Error()'. Errors contain stack traces; strings don't.
 * 2. Don't swallow errors: A 'catch' block that does nothing makes debugging impossible.
 * 3. Use 'finally': Use it to clear timers, close file descriptors, or stop loading spinners.
 * 4. Operational vs Programmer Errors: 
 * - Operational: Expected (Network down, invalid user input) -> Handle via Catch/Result.
 * - Programmer: Bugs (Syntax, TypeErrors) -> Fix the code.
 */