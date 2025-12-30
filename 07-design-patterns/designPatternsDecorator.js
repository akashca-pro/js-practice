/**
 * TOPIC: DESIGN PATTERNS - DECORATOR
 * DESCRIPTION:
 * Decorator pattern attaches additional responsibilities to an object
 * dynamically. It provides a flexible alternative to subclassing for
 * extending functionality. Perfect for logging, caching, validation,
 * and cross-cutting concerns.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC FUNCTION DECORATOR
// -------------------------------------------------------------------------------------------

/**
 * The simplest form of decorator - wrapping a function.
 */

function withLogging(fn) {
    return function (...args) {
        console.log(`Calling ${fn.name} with args:`, args);
        const result = fn.apply(this, args);
        console.log(`${fn.name} returned:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3);

// -------------------------------------------------------------------------------------------
// 2. TIMING DECORATOR
// -------------------------------------------------------------------------------------------

/**
 * Measure function execution time.
 */

function withTiming(fn) {
    return function (...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`${fn.name} took ${(end - start).toFixed(2)}ms`);
        return result;
    };
}

function slowOperation() {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += i;
    }
    return sum;
}

const timedOperation = withTiming(slowOperation);
timedOperation();

// -------------------------------------------------------------------------------------------
// 3. MEMOIZATION DECORATOR
// -------------------------------------------------------------------------------------------

/**
 * Cache function results based on arguments.
 */

function withMemoization(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            console.log('Cache hit for:', key);
            return cache.get(key);
        }

        console.log('Cache miss for:', key);
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = withMemoization(function fib(n) {
    if (n <= 1) return n;
    return memoizedFib(n - 1) + memoizedFib(n - 2);
});

console.log(memoizedFib(10));

// -------------------------------------------------------------------------------------------
// 4. RETRY DECORATOR
// -------------------------------------------------------------------------------------------

/**
 * Automatically retry failed operations.
 */

function withRetry(fn, maxRetries = 3, delay = 1000) {
    return async function (...args) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                lastError = error;
                console.log(`Attempt ${attempt} failed:`, error.message);

                if (attempt < maxRetries) {
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
    };
}

// Simulating a flaky API call
let callCount = 0;
async function unreliableAPI() {
    callCount++;
    if (callCount < 3) {
        throw new Error('Network error');
    }
    return { data: 'Success!' };
}

const reliableAPI = withRetry(unreliableAPI, 3, 100);
reliableAPI().then(console.log).catch(console.error);

// -------------------------------------------------------------------------------------------
// 5. VALIDATION DECORATOR
// -------------------------------------------------------------------------------------------

/**
 * Validate function arguments before execution.
 */

function withValidation(fn, validators) {
    return function (...args) {
        for (let i = 0; i < validators.length; i++) {
            const validator = validators[i];
            const value = args[i];

            if (validator && !validator.validate(value)) {
                throw new Error(`Argument ${i}: ${validator.message}`);
            }
        }
        return fn.apply(this, args);
    };
}

const isNumber = {
    validate: (v) => typeof v === 'number' && !isNaN(v),
    message: 'Must be a valid number'
};

const isPositive = {
    validate: (v) => v > 0,
    message: 'Must be positive'
};

function divide(a, b) {
    return a / b;
}

const safeDivide = withValidation(divide, [isNumber, isPositive]);

try {
    console.log(safeDivide(10, 2));   // 5
    console.log(safeDivide(10, 0));   // Error: Must be positive
} catch (e) {
    console.log('Validation error:', e.message);
}

// -------------------------------------------------------------------------------------------
// 6. OBJECT DECORATOR PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Decorating objects by wrapping them.
 */

class Coffee {
    constructor() {
        this.description = 'Basic Coffee';
    }

    getDescription() {
        return this.description;
    }

    cost() {
        return 2.00;
    }
}

// Decorator base
class CoffeeDecorator {
    constructor(coffee) {
        this.coffee = coffee;
    }

    getDescription() {
        return this.coffee.getDescription();
    }

    cost() {
        return this.coffee.cost();
    }
}

class MilkDecorator extends CoffeeDecorator {
    getDescription() {
        return `${this.coffee.getDescription()}, Milk`;
    }

    cost() {
        return this.coffee.cost() + 0.50;
    }
}

class SugarDecorator extends CoffeeDecorator {
    getDescription() {
        return `${this.coffee.getDescription()}, Sugar`;
    }

    cost() {
        return this.coffee.cost() + 0.25;
    }
}

class WhippedCreamDecorator extends CoffeeDecorator {
    getDescription() {
        return `${this.coffee.getDescription()}, Whipped Cream`;
    }

    cost() {
        return this.coffee.cost() + 0.75;
    }
}

// Usage: stack decorators
let coffee = new Coffee();
coffee = new MilkDecorator(coffee);
coffee = new SugarDecorator(coffee);
coffee = new WhippedCreamDecorator(coffee);

console.log(coffee.getDescription());  // Basic Coffee, Milk, Sugar, Whipped Cream
console.log(`Total: $${coffee.cost().toFixed(2)}`);  // Total: $3.50

// -------------------------------------------------------------------------------------------
// 7. FLUENT DECORATOR BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Chainable decorator builder pattern.
 */

class RequestBuilder {
    constructor(baseRequest) {
        this.request = baseRequest;
    }

    withAuth(token) {
        const original = this.request;
        this.request = async (url, options = {}) => {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            };
            return original(url, options);
        };
        return this;
    }

    withLogging() {
        const original = this.request;
        this.request = async (url, options) => {
            console.log(`Request: ${options?.method || 'GET'} ${url}`);
            const result = await original(url, options);
            console.log('Response received');
            return result;
        };
        return this;
    }

    withTimeout(ms) {
        const original = this.request;
        this.request = async (url, options) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), ms);

            try {
                return await original(url, { ...options, signal: controller.signal });
            } finally {
                clearTimeout(timeoutId);
            }
        };
        return this;
    }

    build() {
        return this.request;
    }
}

// Usage
const baseRequest = async (url, options) => {
    // Simulated fetch
    console.log('Making request to:', url, 'with options:', options);
    return { data: 'response' };
};

const enhancedRequest = new RequestBuilder(baseRequest)
    .withAuth('my-token')
    .withLogging()
    .withTimeout(5000)
    .build();

enhancedRequest('/api/users');

// -------------------------------------------------------------------------------------------
// 8. ASYNC DECORATOR PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * Decorators for async functions.
 */

function withCache(fn, ttl = 60000) {
    const cache = new Map();

    return async function (...args) {
        const key = JSON.stringify(args);
        const cached = cache.get(key);

        if (cached && Date.now() - cached.timestamp < ttl) {
            console.log('Returning cached result');
            return cached.value;
        }

        const result = await fn.apply(this, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        return result;
    };
}

function withConcurrencyLimit(fn, limit = 3) {
    let running = 0;
    const queue = [];

    const runNext = async () => {
        if (queue.length === 0 || running >= limit) return;

        running++;
        const { resolve, reject, args, context } = queue.shift();

        try {
            const result = await fn.apply(context, args);
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            running--;
            runNext();
        }
    };

    return function (...args) {
        return new Promise((resolve, reject) => {
            queue.push({ resolve, reject, args, context: this });
            runNext();
        });
    };
}

// -------------------------------------------------------------------------------------------
// 9. PROPERTY DECORATORS (ES PROPOSAL)
// -------------------------------------------------------------------------------------------

/**
 * Property decorators for class fields (Stage 3 proposal).
 * Note: Requires transpiler or native support.
 */

// Simulated readonly decorator
function createReadonly(target, key, descriptor) {
    return {
        ...descriptor,
        writable: false
    };
}

// Simulated observable decorator
function createObservable(notifyFn) {
    return function (target, key, descriptor) {
        let value = descriptor.initializer ? descriptor.initializer() : undefined;

        return {
            get() {
                return value;
            },
            set(newValue) {
                const oldValue = value;
                value = newValue;
                notifyFn(key, oldValue, newValue);
            }
        };
    };
}

// Manual implementation without decorator syntax
class User {
    constructor(name) {
        this._name = name;

        // Make name observable
        Object.defineProperty(this, 'name', {
            get: () => this._name,
            set: (newValue) => {
                const oldValue = this._name;
                this._name = newValue;
                console.log(`name changed from ${oldValue} to ${newValue}`);
            }
        });
    }
}

const user = new User('Alice');
user.name = 'Bob';  // Logs: name changed from Alice to Bob

// -------------------------------------------------------------------------------------------
// 10. COMPOSING DECORATORS
// -------------------------------------------------------------------------------------------

/**
 * Compose multiple decorators into one.
 */

function compose(...decorators) {
    return function (fn) {
        return decorators.reduceRight((decorated, decorator) => {
            return decorator(decorated);
        }, fn);
    };
}

function withPrefix(prefix) {
    return function (fn) {
        return function (...args) {
            console.log(`${prefix}: Starting`);
            const result = fn.apply(this, args);
            console.log(`${prefix}: Completed`);
            return result;
        };
    };
}

function withErrorHandling(fn) {
    return function (...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error('Error caught:', error.message);
            return null;
        }
    };
}

// Compose multiple decorators
const enhance = compose(
    withLogging,
    withTiming,
    withErrorHandling,
    withPrefix('MyApp')
);

const enhancedFunction = enhance(function processData(data) {
    return data.map(x => x * 2);
});

enhancedFunction([1, 2, 3, 4, 5]);

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * DECORATOR PATTERN:
 * - Wraps objects/functions to extend behavior
 * - Adds responsibilities dynamically
 * - Alternative to inheritance
 *
 * TYPES OF DECORATORS:
 * - Function decorators (wrap functions)
 * - Object decorators (wrap objects)
 * - Class decorators (ES proposal)
 * - Property decorators (ES proposal)
 *
 * COMMON USE CASES:
 * - Logging and tracing
 * - Performance timing
 * - Caching/memoization
 * - Retry logic
 * - Validation
 * - Authentication/authorization
 * - Rate limiting
 * - Error handling
 *
 * BENEFITS:
 * - Single Responsibility Principle
 * - Open/Closed Principle
 * - Composable and stackable
 * - Easy to test individually
 *
 * BEST PRACTICES:
 * - Keep decorators focused on one concern
 * - Preserve the original function signature
 * - Use composition for multiple decorators
 * - Be mindful of decorator order (matters!)
 * - Handle both sync and async functions appropriately
 */
