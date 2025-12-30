/**
 * TOPIC: ERROR TYPES
 * DESCRIPTION:
 * JavaScript has several built-in error types, each representing
 * different categories of problems. Understanding error types enables
 * proper error handling, informative debugging, and creation of
 * custom errors. Essential for building robust applications.
 */

// -------------------------------------------------------------------------------------------
// 1. BUILT-IN ERROR TYPES
// -------------------------------------------------------------------------------------------

/**
 * JavaScript has 7 built-in error types:
 * - Error (base class)
 * - SyntaxError
 * - TypeError
 * - ReferenceError
 * - RangeError
 * - URIError
 * - EvalError (deprecated, rarely used)
 */

// Error - base error type
try {
    throw new Error('Something went wrong');
} catch (e) {
    console.log('Error:', e.message);
    console.log('Name:', e.name);
    console.log('Stack:', e.stack?.split('\n')[0]);
}

// TypeError - wrong type operation
try {
    const obj = null;
    obj.method();  // Cannot read property of null
} catch (e) {
    console.log('\nTypeError:', e.message);
}

// ReferenceError - accessing undefined variable
try {
    console.log(undefinedVariable);
} catch (e) {
    console.log('\nReferenceError:', e.message);
}

// RangeError - value outside allowed range
try {
    const arr = new Array(-1);  // Invalid array length
} catch (e) {
    console.log('\nRangeError:', e.message);
}

// URIError - malformed URI
try {
    decodeURIComponent('%');  // Invalid percent-encoding
} catch (e) {
    console.log('\nURIError:', e.message);
}

// SyntaxError - invalid JavaScript syntax
try {
    eval('const x = {');  // Unexpected end of input
} catch (e) {
    console.log('\nSyntaxError:', e.message);
}

// -------------------------------------------------------------------------------------------
// 2. ERROR PROPERTIES
// -------------------------------------------------------------------------------------------

/**
 * Standard error properties.
 */

const error = new Error('Test error message');

console.log('\nError Properties:');
console.log('name:', error.name);           // "Error"
console.log('message:', error.message);     // "Test error message"
console.log('stack:', error.stack);         // Stack trace

// Additional properties (non-standard but common)
// error.fileName   - File where error occurred (Firefox)
// error.lineNumber - Line number (Firefox)
// error.columnNumber - Column number (Firefox)

// -------------------------------------------------------------------------------------------
// 3. CREATING CUSTOM ERRORS
// -------------------------------------------------------------------------------------------

/**
 * Extend Error class for domain-specific errors.
 */

class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        
        // Maintains proper stack trace in V8 engines
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}

class NotFoundError extends Error {
    constructor(resource, id) {
        super(`${resource} with id ${id} not found`);
        this.name = 'NotFoundError';
        this.resource = resource;
        this.id = id;
        this.statusCode = 404;
    }
}

class AuthenticationError extends Error {
    constructor(message = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
    }
}

class AuthorizationError extends Error {
    constructor(action, resource) {
        super(`Not authorized to ${action} ${resource}`);
        this.name = 'AuthorizationError';
        this.action = action;
        this.resource = resource;
        this.statusCode = 403;
    }
}

// Usage
try {
    throw new ValidationError('Email is invalid', 'email');
} catch (e) {
    if (e instanceof ValidationError) {
        console.log(`\nValidation failed on field: ${e.field}`);
    }
}

// -------------------------------------------------------------------------------------------
// 4. ERROR CAUSE (ES2022+)
// -------------------------------------------------------------------------------------------

/**
 * Error.cause allows chaining errors to preserve original context.
 */

async function fetchUser(id) {
    try {
        // Simulate API error
        throw new Error('Network timeout');
    } catch (originalError) {
        throw new Error(`Failed to fetch user ${id}`, { 
            cause: originalError 
        });
    }
}

async function processUser(id) {
    try {
        await fetchUser(id);
    } catch (e) {
        console.log('\nError with cause:');
        console.log('Message:', e.message);
        console.log('Cause:', e.cause?.message);
    }
}

processUser(123);

// Manual cause implementation for older environments
class ErrorWithCause extends Error {
    constructor(message, options = {}) {
        super(message);
        this.cause = options.cause;
    }
}

// -------------------------------------------------------------------------------------------
// 5. ERROR HIERARCHY FOR APPLICATIONS
// -------------------------------------------------------------------------------------------

/**
 * Create a comprehensive error hierarchy.
 */

// Base application error
class AppError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = options.statusCode || 500;
        this.isOperational = options.isOperational ?? true;
        this.cause = options.cause;
        this.code = options.code;
        this.timestamp = new Date().toISOString();
        
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
            timestamp: this.timestamp
        };
    }
}

// HTTP errors
class HttpError extends AppError {
    constructor(message, statusCode, options = {}) {
        super(message, { ...options, statusCode });
    }
}

class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', options = {}) {
        super(message, 400, options);
    }
}

class UnauthorizedError extends HttpError {
    constructor(message = 'Unauthorized', options = {}) {
        super(message, 401, options);
    }
}

class ForbiddenError extends HttpError {
    constructor(message = 'Forbidden', options = {}) {
        super(message, 403, options);
    }
}

class NotFoundError2 extends HttpError {
    constructor(message = 'Not Found', options = {}) {
        super(message, 404, options);
    }
}

class ConflictError extends HttpError {
    constructor(message = 'Conflict', options = {}) {
        super(message, 409, options);
    }
}

class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error', options = {}) {
        super(message, 500, { ...options, isOperational: false });
    }
}

// Business logic errors
class BusinessError extends AppError {
    constructor(message, code, options = {}) {
        super(message, { ...options, code, statusCode: 400 });
    }
}

class InsufficientFundsError extends BusinessError {
    constructor(required, available) {
        super(
            `Insufficient funds: required ${required}, available ${available}`,
            'INSUFFICIENT_FUNDS'
        );
        this.required = required;
        this.available = available;
    }
}

// Usage
try {
    throw new InsufficientFundsError(100, 50);
} catch (e) {
    console.log('\nBusiness Error:', e.toJSON());
}

// -------------------------------------------------------------------------------------------
// 6. AGGREGATE ERROR (ES2021+)
// -------------------------------------------------------------------------------------------

/**
 * AggregateError holds multiple errors (used with Promise.any).
 */

const errors = [
    new Error('First error'),
    new TypeError('Second error'),
    new RangeError('Third error')
];

const aggregateError = new AggregateError(errors, 'Multiple errors occurred');

console.log('\nAggregateError:');
console.log('Message:', aggregateError.message);
console.log('Errors:', aggregateError.errors.map(e => e.message));

// Common with Promise.any
async function demonstratePromiseAny() {
    const promises = [
        Promise.reject(new Error('Failed 1')),
        Promise.reject(new Error('Failed 2')),
        Promise.reject(new Error('Failed 3'))
    ];

    try {
        await Promise.any(promises);
    } catch (e) {
        if (e instanceof AggregateError) {
            console.log('\nAll promises failed:');
            e.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err.message}`));
        }
    }
}

demonstratePromiseAny();

// -------------------------------------------------------------------------------------------
// 7. ERROR HANDLING PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * Type-based error handling.
 */

function handleError(error) {
    // Type-based handling
    if (error instanceof ValidationError) {
        return { status: 400, body: { field: error.field, message: error.message } };
    }
    
    if (error instanceof NotFoundError) {
        return { status: 404, body: { resource: error.resource, message: error.message } };
    }
    
    if (error instanceof AuthenticationError) {
        return { status: 401, body: { message: error.message } };
    }
    
    if (error instanceof TypeError) {
        console.error('Programmer error:', error);
        return { status: 500, body: { message: 'Internal error' } };
    }
    
    // Unknown error
    console.error('Unknown error:', error);
    return { status: 500, body: { message: 'Something went wrong' } };
}

/**
 * Operational vs Programming errors.
 */

function isOperationalError(error) {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
}

function handleCriticalError(error) {
    if (isOperationalError(error)) {
        // Log and continue
        console.error('Operational error:', error.message);
    } else {
        // Programming error - might need restart
        console.error('Critical error:', error);
        // process.exit(1);  // In production, might restart process
    }
}

// -------------------------------------------------------------------------------------------
// 8. ASYNC ERROR HANDLING
// -------------------------------------------------------------------------------------------

/**
 * Patterns for async error handling.
 */

// Try-catch wrapper for async functions
function asyncHandler(fn) {
    return async function (...args) {
        try {
            return await fn(...args);
        } catch (error) {
            // Transform or rethrow
            if (error instanceof AppError) {
                throw error;
            }
            throw new InternalServerError('Unexpected error', { cause: error });
        }
    };
}

// Result pattern (no exceptions)
class Result {
    constructor(value, error) {
        this.value = value;
        this.error = error;
        this.isOk = !error;
        this.isErr = !!error;
    }

    static ok(value) {
        return new Result(value, null);
    }

    static err(error) {
        return new Result(null, error);
    }

    map(fn) {
        if (this.isOk) {
            return Result.ok(fn(this.value));
        }
        return this;
    }

    unwrap() {
        if (this.isErr) {
            throw this.error;
        }
        return this.value;
    }

    unwrapOr(defaultValue) {
        return this.isOk ? this.value : defaultValue;
    }
}

// Usage
async function divide(a, b) {
    if (b === 0) {
        return Result.err(new RangeError('Division by zero'));
    }
    return Result.ok(a / b);
}

async function demonstrateResult() {
    const result = await divide(10, 2);
    if (result.isOk) {
        console.log('\nResult pattern - Value:', result.value);
    }

    const errorResult = await divide(10, 0);
    console.log('Result pattern - Error:', errorResult.error?.message);
    console.log('Result pattern - With default:', errorResult.unwrapOr(0));
}

demonstrateResult();

// -------------------------------------------------------------------------------------------
// 9. ERROR SERIALIZATION
// -------------------------------------------------------------------------------------------

/**
 * Serialize errors for logging or transmission.
 */

function serializeError(error) {
    const serialized = {
        name: error.name,
        message: error.message,
        stack: error.stack
    };

    // Include custom properties
    if (error instanceof AppError) {
        serialized.code = error.code;
        serialized.statusCode = error.statusCode;
        serialized.timestamp = error.timestamp;
    }

    // Include cause
    if (error.cause) {
        serialized.cause = serializeError(error.cause);
    }

    // Include aggregate errors
    if (error instanceof AggregateError) {
        serialized.errors = error.errors.map(serializeError);
    }

    return serialized;
}

function deserializeError(data) {
    const ErrorClass = {
        Error,
        TypeError,
        ReferenceError,
        RangeError,
        SyntaxError,
        URIError,
        AggregateError
    }[data.name] || Error;

    const error = new ErrorClass(data.message);
    error.stack = data.stack;
    
    if (data.cause) {
        error.cause = deserializeError(data.cause);
    }

    return error;
}

const testError = new BadRequestError('Invalid input', { code: 'INVALID_INPUT' });
console.log('\nSerialized error:', JSON.stringify(serializeError(testError), null, 2));

// -------------------------------------------------------------------------------------------
// 10. STACK TRACE MANIPULATION
// -------------------------------------------------------------------------------------------

/**
 * Working with stack traces.
 */

function getCallerInfo() {
    const error = new Error();
    const stack = error.stack?.split('\n') || [];
    
    // Stack format varies by engine
    // V8: "    at functionName (file:line:column)"
    // SpiderMonkey: "functionName@file:line:column"
    
    // Get caller (skip getCallerInfo and its caller)
    const callerLine = stack[2] || '';
    
    // Parse V8 format
    const match = callerLine.match(/at (\S+) \((.+):(\d+):(\d+)\)/);
    if (match) {
        return {
            function: match[1],
            file: match[2],
            line: parseInt(match[3]),
            column: parseInt(match[4])
        };
    }
    
    return { raw: callerLine };
}

function testCaller() {
    console.log('\nCaller info:', getCallerInfo());
}

testCaller();

// Clean stack traces
function cleanStackTrace(error) {
    if (!error.stack) return error;
    
    const lines = error.stack.split('\n');
    const cleanedLines = lines.filter(line => {
        // Remove internal/node_modules frames
        return !line.includes('node_modules') && 
               !line.includes('internal/');
    });
    
    error.stack = cleanedLines.join('\n');
    return error;
}

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * BUILT-IN ERROR TYPES:
 * - Error: Base error class
 * - TypeError: Wrong type operations
 * - ReferenceError: Undefined variable access
 * - RangeError: Value out of range
 * - SyntaxError: Invalid syntax
 * - URIError: Malformed URI
 *
 * CUSTOM ERRORS:
 * - Extend Error class
 * - Set name property
 * - Use Error.captureStackTrace (V8)
 * - Add domain-specific properties
 * - Implement toJSON() for serialization
 *
 * ERROR CAUSE (ES2022):
 * - Chain errors with { cause: originalError }
 * - Preserves original error context
 * - Enables better debugging
 *
 * BEST PRACTICES:
 * - Create error hierarchy for your app
 * - Distinguish operational vs programming errors
 * - Include error codes for API responses
 * - Serialize errors properly for logging
 * - Use instanceof for type checking
 * - Include relevant context in error message
 * - Clean stack traces before logging
 *
 * ANTI-PATTERNS:
 * - Catching errors and ignoring them
 * - Throwing strings instead of Error objects
 * - Not preserving stack traces
 * - Generic error messages without context
 */
