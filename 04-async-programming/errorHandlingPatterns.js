/**
 * TOPIC: ERROR HANDLING PATTERNS
 * DESCRIPTION:
 * Proper error handling improves code reliability and debugging.
 * JavaScript provides try/catch for synchronous code and various
 * patterns for async error handling.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC TRY/CATCH/FINALLY
// -------------------------------------------------------------------------------------------

function divide(a, b) {
    try {
        if (b === 0) {
            throw new Error('Division by zero');
        }
        return a / b;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    } finally {
        console.log('Division operation completed');
        // Always runs, even if there's a return in try/catch
    }
}

// -------------------------------------------------------------------------------------------
// 2. ERROR TYPES
// -------------------------------------------------------------------------------------------

// Built-in error types
const types = {
    error: new Error('Generic error'),
    type: new TypeError('Type mismatch'),
    range: new RangeError('Value out of range'),
    reference: new ReferenceError('Reference not found'),
    syntax: new SyntaxError('Syntax error'),
    uri: new URIError('URI malformed')
};

// Error properties
const err = new Error('Something went wrong');
console.log(err.name);       // 'Error'
console.log(err.message);    // 'Something went wrong'
console.log(err.stack);      // Stack trace

// -------------------------------------------------------------------------------------------
// 3. CUSTOM ERRORS
// -------------------------------------------------------------------------------------------

class ValidationError extends Error {
    constructor(field, message) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
    }
}

class NotFoundError extends Error {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`);
        this.name = 'NotFoundError';
        this.resource = resource;
        this.id = id;
    }
}

class ApiError extends Error {
    constructor(status, message, data = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// Usage
function validateUser(user) {
    if (!user.email) {
        throw new ValidationError('email', 'Email is required');
    }
    if (!user.email.includes('@')) {
        throw new ValidationError('email', 'Invalid email format');
    }
}

// -------------------------------------------------------------------------------------------
// 4. ERROR HANDLING BY TYPE
// -------------------------------------------------------------------------------------------

function handleOperation() {
    try {
        // Some operation
    } catch (error) {
        if (error instanceof ValidationError) {
            console.log(`Validation failed on ${error.field}: ${error.message}`);
        } else if (error instanceof NotFoundError) {
            console.log(`${error.resource} not found`);
        } else if (error instanceof TypeError) {
            console.log('Type error occurred');
        } else {
            // Re-throw unknown errors
            throw error;
        }
    }
}

// -------------------------------------------------------------------------------------------
// 5. ASYNC ERROR HANDLING
// -------------------------------------------------------------------------------------------

// With promises
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new ApiError(response.status, 'Request failed');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;  // Re-throw or handle
        });
}

// With async/await
async function fetchDataAsync(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new ApiError(response.status, 'Request failed');
        }
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            console.error(`API Error ${error.status}: ${error.message}`);
        } else {
            console.error('Network error:', error);
        }
        throw error;
    }
}

// -------------------------------------------------------------------------------------------
// 6. RESULT PATTERN (TUPLE)
// -------------------------------------------------------------------------------------------

/**
 * Return [error, result] tuple instead of throwing.
 * Common in Go, useful for explicit error handling.
 */

async function safeFetch(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return [null, data];
    } catch (error) {
        return [error, null];
    }
}

// Usage
async function loadData() {
    const [error, data] = await safeFetch('/api/data');
    
    if (error) {
        console.error('Failed to load:', error);
        return;
    }
    
    console.log('Data:', data);
}

// -------------------------------------------------------------------------------------------
// 7. RESULT CLASS PATTERN
// -------------------------------------------------------------------------------------------

class Result {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    }
    
    static ok(value) {
        return new Result(value, null);
    }
    
    static fail(error) {
        return new Result(null, error);
    }
    
    isOk() {
        return this.error === null;
    }
    
    isFail() {
        return this.error !== null;
    }
    
    map(fn) {
        if (this.isOk()) {
            return Result.ok(fn(this.value));
        }
        return this;
    }
    
    unwrap() {
        if (this.isFail()) {
            throw this.error;
        }
        return this.value;
    }
}

// Usage
function parseJSON(json) {
    try {
        return Result.ok(JSON.parse(json));
    } catch (e) {
        return Result.fail(e);
    }
}

const result = parseJSON('{"valid": true}');
if (result.isOk()) {
    console.log(result.value);
} else {
    console.error(result.error);
}

// -------------------------------------------------------------------------------------------
// 8. GLOBAL ERROR HANDLERS
// -------------------------------------------------------------------------------------------

// Browser - unhandled errors
window.onerror = (message, source, line, col, error) => {
    console.error('Global error:', { message, source, line, col, error });
    // Return true to prevent default browser error handling
    return true;
};

// Browser - unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason);
    event.preventDefault();  // Prevent default logging
});

// Node.js
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    process.exit(1);  // Exit after logging
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason);
});

// -------------------------------------------------------------------------------------------
// 9. RETRY PATTERN
// -------------------------------------------------------------------------------------------

async function withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < maxRetries) {
                await new Promise(r => setTimeout(r, delay * attempt));
            }
        }
    }
    
    throw lastError;
}

// Usage
const data = await withRetry(
    () => fetch('/api/data').then(r => r.json()),
    3,
    1000
);

// -------------------------------------------------------------------------------------------
// 10. ERROR BOUNDARY PATTERN
// -------------------------------------------------------------------------------------------

function createErrorBoundary(fn, fallback) {
    return async function(...args) {
        try {
            return await fn(...args);
        } catch (error) {
            console.error('Error boundary caught:', error);
            if (typeof fallback === 'function') {
                return fallback(error);
            }
            return fallback;
        }
    };
}

const safeDivide = createErrorBoundary(
    (a, b) => {
        if (b === 0) throw new Error('Division by zero');
        return a / b;
    },
    0  // fallback value
);

console.log(await Number(safeDivide(10, 0)) || 0);  // 0 (fallback)

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SYNC ERRORS:
 * - try/catch/finally
 * - throw new Error()
 * - Custom error classes
 * 
 * ASYNC ERRORS:
 * - .catch() for promises
 * - try/catch in async functions
 * - Global handlers
 * 
 * PATTERNS:
 * - Result tuple [error, data]
 * - Result class with isOk/isFail
 * - Retry with exponential backoff
 * - Error boundaries
 * 
 * BEST PRACTICES:
 * - Create custom error types
 * - Include context in errors
 * - Handle specific error types
 * - Always handle promise rejections
 * - Log errors with stack traces
 */
