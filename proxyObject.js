/**
 * TOPIC: PROXY OBJECT (Interception & Traps)
 * DESCRIPTION:
 * Proxy wraps an object and intercepts fundamental operations like
 * property access, assignment, and function calls using "traps".
 * It's powerful for validation, logging, and creating reactive systems.
 */

// -------------------------------------------------------------------------------------------
// 1. PROXY BASICS
// -------------------------------------------------------------------------------------------

/**
 * new Proxy(target, handler)
 * - target: The object to proxy
 * - handler: Object with trap functions
 */

const target = { name: "Alice", age: 25 };

const handler = {
    get(obj, prop) {
        console.log(`Getting "${prop}"`);
        return obj[prop];
    },
    set(obj, prop, value) {
        console.log(`Setting "${prop}" to "${value}"`);
        obj[prop] = value;
        return true; // Indicate success
    }
};

const proxy = new Proxy(target, handler);

console.log(proxy.name);  // Logs: Getting "name" -> "Alice"
proxy.age = 26;           // Logs: Setting "age" to "26"

// -------------------------------------------------------------------------------------------
// 2. COMMON TRAPS
// -------------------------------------------------------------------------------------------

const allTrapsHandler = {
    // Property access
    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    },
    
    // Property assignment
    set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    },
    
    // 'in' operator
    has(target, prop) {
        return Reflect.has(target, prop);
    },
    
    // delete operator
    deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    },
    
    // Object.keys, for...in, etc.
    ownKeys(target) {
        return Reflect.ownKeys(target);
    },
    
    // Object.getOwnPropertyDescriptor
    getOwnPropertyDescriptor(target, prop) {
        return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    
    // Object.defineProperty
    defineProperty(target, prop, descriptor) {
        return Reflect.defineProperty(target, prop, descriptor);
    },
    
    // Function calls (for function proxies)
    apply(target, thisArg, args) {
        return Reflect.apply(target, thisArg, args);
    },
    
    // new operator (for constructor proxies)
    construct(target, args, newTarget) {
        return Reflect.construct(target, args, newTarget);
    }
};

// -------------------------------------------------------------------------------------------
// 3. VALIDATION PROXY
// -------------------------------------------------------------------------------------------

function createValidatedObject(schema) {
    return new Proxy({}, {
        set(obj, prop, value) {
            if (schema[prop]) {
                const validator = schema[prop];
                if (!validator(value)) {
                    throw new TypeError(`Invalid value for ${prop}`);
                }
            }
            obj[prop] = value;
            return true;
        }
    });
}

const userSchema = {
    age: (v) => typeof v === 'number' && v >= 0 && v <= 150,
    email: (v) => typeof v === 'string' && v.includes('@'),
    name: (v) => typeof v === 'string' && v.length >= 1
};

const validatedUser = createValidatedObject(userSchema);
validatedUser.name = "Bob";      // OK
validatedUser.age = 25;          // OK
// validatedUser.age = -5;       // Throws TypeError

// -------------------------------------------------------------------------------------------
// 4. DEFAULT VALUES / NULL-SAFE ACCESS
// -------------------------------------------------------------------------------------------

function withDefaults(target, defaults) {
    return new Proxy(target, {
        get(obj, prop) {
            return prop in obj ? obj[prop] : defaults[prop];
        }
    });
}

const config = withDefaults(
    { host: "localhost" },
    { host: "0.0.0.0", port: 3000, debug: false }
);

console.log(config.host);  // "localhost" (from target)
console.log(config.port);  // 3000 (from defaults)
console.log(config.debug); // false (from defaults)

// -------------------------------------------------------------------------------------------
// 5. LOGGING/DEBUGGING PROXY
// -------------------------------------------------------------------------------------------

function createLoggingProxy(obj, name = 'Object') {
    return new Proxy(obj, {
        get(target, prop) {
            console.log(`[${name}] GET ${String(prop)}`);
            const value = target[prop];
            if (typeof value === 'object' && value !== null) {
                return createLoggingProxy(value, `${name}.${String(prop)}`);
            }
            return value;
        },
        set(target, prop, value) {
            console.log(`[${name}] SET ${String(prop)} = ${JSON.stringify(value)}`);
            target[prop] = value;
            return true;
        }
    });
}

const logged = createLoggingProxy({ user: { name: "Alice" } });
logged.user.name = "Bob";  // Logs access and modification

// -------------------------------------------------------------------------------------------
// 6. PRIVATE PROPERTIES
// -------------------------------------------------------------------------------------------

function createPrivate(obj, privateProps = []) {
    return new Proxy(obj, {
        get(target, prop) {
            if (privateProps.includes(prop)) {
                throw new Error(`Cannot access private property: ${prop}`);
            }
            return target[prop];
        },
        set(target, prop, value) {
            if (privateProps.includes(prop)) {
                throw new Error(`Cannot modify private property: ${prop}`);
            }
            target[prop] = value;
            return true;
        },
        ownKeys(target) {
            return Object.keys(target).filter(k => !privateProps.includes(k));
        },
        has(target, prop) {
            if (privateProps.includes(prop)) return false;
            return prop in target;
        }
    });
}

const user = createPrivate(
    { name: "Alice", _password: "secret123" },
    ['_password']
);

console.log(user.name);    // "Alice"
console.log('_password' in user); // false
// user._password;         // Throws Error

// -------------------------------------------------------------------------------------------
// 7. FUNCTION PROXY
// -------------------------------------------------------------------------------------------

function createTimedFunction(fn) {
    return new Proxy(fn, {
        apply(target, thisArg, args) {
            const start = performance.now();
            const result = target.apply(thisArg, args);
            const end = performance.now();
            console.log(`${target.name || 'anonymous'} took ${(end - start).toFixed(2)}ms`);
            return result;
        }
    });
}

const slowFn = createTimedFunction(function slowOperation() {
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += i;
    return sum;
});

slowFn(); // Logs execution time

// -------------------------------------------------------------------------------------------
// 8. REVOCABLE PROXY
// -------------------------------------------------------------------------------------------

/**
 * Proxy.revocable creates a proxy that can be disabled.
 */

const { proxy: revocableProxy, revoke } = Proxy.revocable(
    { data: "sensitive" },
    {
        get(target, prop) {
            return target[prop];
        }
    }
);

console.log(revocableProxy.data); // "sensitive"

revoke(); // Disable the proxy

// revocableProxy.data; // TypeError: Cannot perform 'get' on a proxy that has been revoked

// -------------------------------------------------------------------------------------------
// 9. REACTIVE SYSTEM (Simplified Vue-like)
// -------------------------------------------------------------------------------------------

function reactive(obj, callback) {
    return new Proxy(obj, {
        set(target, prop, value) {
            const oldValue = target[prop];
            target[prop] = value;
            if (oldValue !== value) {
                callback(prop, value, oldValue);
            }
            return true;
        }
    });
}

const state = reactive({ count: 0 }, (prop, newVal, oldVal) => {
    console.log(`${prop} changed from ${oldVal} to ${newVal}`);
    // Re-render UI here
});

state.count++;  // Logs: count changed from 0 to 1
state.count++;  // Logs: count changed from 1 to 2

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * PROXY:
 * - Intercepts fundamental operations on objects
 * - Uses handler with trap functions
 * - Traps: get, set, has, deleteProperty, ownKeys, etc.
 * 
 * USE CASES:
 * - Validation and type checking
 * - Default values
 * - Logging and debugging
 * - Access control (private properties)
 * - Observable/reactive systems
 * - Function timing/profiling
 * 
 * BEST PRACTICES:
 * - Use Reflect methods inside traps
 * - Return true from set to indicate success
 * - Use Proxy.revocable for temporary access
 */
