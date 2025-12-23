/**
 * TOPIC: DECORATORS (TC39 Proposal)
 * DESCRIPTION:
 * Decorators are a proposal for adding metadata and modifying classes
 * and their members. They use the @ syntax. Note: Still a Stage 3
 * proposal, syntax may change. TypeScript has its own implementation.
 */

// -------------------------------------------------------------------------------------------
// 1. DECORATOR CONCEPT
// -------------------------------------------------------------------------------------------

/**
 * Decorators are functions that modify classes, methods, or properties.
 * They run at class definition time, not at runtime.
 * 
 * @decorator
 * class MyClass { ... }
 */

// Since decorators aren't standard JS yet, we'll show patterns
// that simulate decorator behavior.

// -------------------------------------------------------------------------------------------
// 2. CLASS DECORATOR PATTERN
// -------------------------------------------------------------------------------------------

/**
 * A class decorator receives the class and returns a modified version.
 */

function logged(Class) {
    return class extends Class {
        constructor(...args) {
            console.log(`Creating instance of ${Class.name}`);
            super(...args);
        }
    };
}

// Without decorator syntax:
class User {
    constructor(name) {
        this.name = name;
    }
}

const LoggedUser = logged(User);
const user = new LoggedUser("Alice");  // Logs: Creating instance of User

// With decorator syntax (proposal):
// @logged
// class User { ... }

// -------------------------------------------------------------------------------------------
// 3. METHOD DECORATOR PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Method decorators modify method behavior.
 */

function measureTime(target, name, descriptor) {
    const original = descriptor.value;
    
    descriptor.value = function(...args) {
        const start = performance.now();
        const result = original.apply(this, args);
        const end = performance.now();
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    };
    
    return descriptor;
}

// Manual application:
class Calculator {
    slowOperation() {
        let sum = 0;
        for (let i = 0; i < 1000000; i++) sum += i;
        return sum;
    }
}

// Apply decorator manually
const descriptor = Object.getOwnPropertyDescriptor(Calculator.prototype, 'slowOperation');
measureTime(Calculator.prototype, 'slowOperation', descriptor);
Object.defineProperty(Calculator.prototype, 'slowOperation', descriptor);

// With decorator syntax (proposal):
// class Calculator {
//     @measureTime
//     slowOperation() { ... }
// }

// -------------------------------------------------------------------------------------------
// 4. COMMON DECORATOR PATTERNS
// -------------------------------------------------------------------------------------------

// Readonly decorator
function readonly(target, name, descriptor) {
    descriptor.writable = false;
    return descriptor;
}

// Autobind decorator
function autobind(target, name, descriptor) {
    const original = descriptor.value;
    
    return {
        configurable: true,
        get() {
            return original.bind(this);
        }
    };
}

// Debounce decorator
function debounce(delay) {
    return function(target, name, descriptor) {
        const original = descriptor.value;
        let timeout;
        
        descriptor.value = function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => original.apply(this, args), delay);
        };
        
        return descriptor;
    };
}

// Memoize decorator
function memoize(target, name, descriptor) {
    const original = descriptor.value;
    const cache = new Map();
    
    descriptor.value = function(...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = original.apply(this, args);
        cache.set(key, result);
        return result;
    };
    
    return descriptor;
}

// -------------------------------------------------------------------------------------------
// 5. PROPERTY DECORATOR PATTERN
// -------------------------------------------------------------------------------------------

function validate(validator) {
    return function(target, name) {
        let value;
        
        Object.defineProperty(target, name, {
            get() { return value; },
            set(newValue) {
                if (!validator(newValue)) {
                    throw new Error(`Invalid value for ${name}`);
                }
                value = newValue;
            },
            enumerable: true,
            configurable: true
        });
    };
}

// Usage simulation
class Person {
    // @validate(v => typeof v === 'string' && v.length > 0)
    name = '';
}

// -------------------------------------------------------------------------------------------
// 6. DECORATOR FACTORIES
// -------------------------------------------------------------------------------------------

/**
 * Decorator factories are functions that return decorators.
 * They allow configuration.
 */

function log(prefix) {
    return function(target, name, descriptor) {
        const original = descriptor.value;
        
        descriptor.value = function(...args) {
            console.log(`[${prefix}] Calling ${name} with:`, args);
            return original.apply(this, args);
        };
        
        return descriptor;
    };
}

// @log('DEBUG')
// someMethod() { ... }

// -------------------------------------------------------------------------------------------
// 7. TC39 DECORATOR PROPOSAL (Stage 3)
// -------------------------------------------------------------------------------------------

/**
 * The current proposal defines decorators as:
 * 
 * function decorator(value, context) {
 *   // value: the decorated element
 *   // context: { kind, name, static, private, access, ... }
 *   return modifiedValue; // or initializer function
 * }
 * 
 * context.kind can be:
 * - 'class'
 * - 'method'
 * - 'getter' / 'setter'
 * - 'field'
 * - 'accessor'
 */

// Example of new proposal syntax (conceptual)
function proposalDecorator(value, context) {
    if (context.kind === 'method') {
        return function(...args) {
            console.log(`Calling ${context.name}`);
            return value.apply(this, args);
        };
    }
}

// -------------------------------------------------------------------------------------------
// 8. HELPER: CREATE DECORATOR
// -------------------------------------------------------------------------------------------

function createMethodDecorator(wrapper) {
    return function(target, name, descriptor) {
        const original = descriptor.value;
        descriptor.value = wrapper(original, name);
        return descriptor;
    };
}

const logCalls = createMethodDecorator((fn, name) => {
    return function(...args) {
        console.log(`${name} called with`, args);
        return fn.apply(this, args);
    };
});

// -------------------------------------------------------------------------------------------
// 9. COMBINING DECORATORS
// -------------------------------------------------------------------------------------------

function compose(...decorators) {
    return function(target, name, descriptor) {
        return decorators.reduceRight(
            (desc, decorator) => decorator(target, name, desc),
            descriptor
        );
    };
}

// @compose(logCalls, measureTime, memoize)
// expensiveOperation() { ... }

// -------------------------------------------------------------------------------------------
// 10. TYPESCRIPT DECORATORS
// -------------------------------------------------------------------------------------------

/**
 * TypeScript has experimental decorator support:
 * 
 * {
 *   "experimentalDecorators": true,
 *   "emitDecoratorMetadata": true
 * }
 * 
 * Popular libraries using TS decorators:
 * - NestJS (@Injectable, @Controller)
 * - TypeORM (@Entity, @Column)
 * - Angular (@Component, @Input)
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * DECORATORS:
 * - Functions that modify classes/methods/properties
 * - Use @ syntax (proposal, TypeScript)
 * - Currently Stage 3 in TC39
 * 
 * PATTERNS:
 * - Class decorators: Wrap/modify class
 * - Method decorators: Wrap/modify methods
 * - Property decorators: Add getters/setters
 * - Decorator factories: Configurable decorators
 * 
 * COMMON USES:
 * - Logging
 * - Timing/profiling
 * - Memoization
 * - Validation
 * - Access control
 * - Dependency injection
 * 
 * Currently, decorators work in:
 * - TypeScript (with config)
 * - Babel (with plugin)
 * - Native proposals coming to JavaScript
 */
