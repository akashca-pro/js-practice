/**
 * TOPIC: REFLECT API
 * DESCRIPTION:
 * Reflect is a built-in object providing methods for interceptable
 * JavaScript operations. It works alongside Proxy and provides
 * cleaner ways to perform object operations.
 */

// -------------------------------------------------------------------------------------------
// 1. WHY REFLECT?
// -------------------------------------------------------------------------------------------

/**
 * Before Reflect, we used operators and Object methods:
 * - 'key' in obj (for has)
 * - delete obj.key (for deleteProperty)
 * - Object.defineProperty (throws on failure)
 * 
 * Reflect provides:
 * - Function-based API for all operations
 * - Returns boolean for success/failure (no exceptions)
 * - Perfect companion for Proxy traps
 */

// -------------------------------------------------------------------------------------------
// 2. REFLECT METHODS
// -------------------------------------------------------------------------------------------

const obj = { name: "Alice", age: 25 };

// Reflect.get - Get property value
console.log(Reflect.get(obj, 'name'));  // "Alice"

// Reflect.set - Set property value (returns boolean)
Reflect.set(obj, 'age', 26);
console.log(obj.age);  // 26

// Reflect.has - Check if property exists (like 'in')
console.log(Reflect.has(obj, 'name'));  // true
console.log(Reflect.has(obj, 'foo'));   // false

// Reflect.deleteProperty - Delete property (like 'delete')
Reflect.deleteProperty(obj, 'age');
console.log(obj.age);  // undefined

// Reflect.ownKeys - Get all keys (own properties)
const allKeys = { a: 1, [Symbol('b')]: 2 };
console.log(Reflect.ownKeys(allKeys)); // ['a', Symbol(b)]

// -------------------------------------------------------------------------------------------
// 3. REFLECT.DEFINEPROPERTY
// -------------------------------------------------------------------------------------------

/**
 * Unlike Object.defineProperty which throws, Reflect returns boolean.
 */

const target = {};

// Object.defineProperty - throws on failure
try {
    Object.defineProperty(Object.freeze({}), 'prop', { value: 1 });
} catch (e) {
    console.log("Object.defineProperty threw:", e.message);
}

// Reflect.defineProperty - returns false on failure
const success = Reflect.defineProperty(Object.freeze({}), 'prop', { value: 1 });
console.log("Reflect.defineProperty returned:", success); // false

// -------------------------------------------------------------------------------------------
// 4. REFLECT.CONSTRUCT
// -------------------------------------------------------------------------------------------

/**
 * Invoke constructor with 'new', optionally with different prototype.
 */

class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    bark() { console.log("Woof!"); }
}

// Create Animal using Animal constructor
const animal = Reflect.construct(Animal, ["Buddy"]);
console.log(animal.name);  // "Buddy"
console.log(animal instanceof Animal);  // true

// Create using Animal constructor but with Dog prototype
const weird = Reflect.construct(Animal, ["Max"], Dog);
console.log(weird.name);  // "Max"
console.log(weird instanceof Dog);  // true
weird.bark();  // "Woof!"

// -------------------------------------------------------------------------------------------
// 5. REFLECT.APPLY
// -------------------------------------------------------------------------------------------

/**
 * Call function with specific 'this' and arguments.
 * Cleaner than Function.prototype.apply.
 */

function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "Bob" };

// Using Reflect.apply
const message = Reflect.apply(greet, person, ["Hello", "!"]);
console.log(message);  // "Hello, Bob!"

// Safer than greet.apply (protects against modified apply)

// -------------------------------------------------------------------------------------------
// 6. REFLECT WITH PROXY
// -------------------------------------------------------------------------------------------

/**
 * Reflect methods map 1:1 to Proxy traps.
 * Use Reflect inside traps for default behavior.
 */

const user = { name: "Alice", age: 25 };

const proxy = new Proxy(user, {
    get(target, prop, receiver) {
        console.log(`Accessing: ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        console.log(`Setting: ${prop} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
    },
    has(target, prop) {
        console.log(`Checking: ${prop}`);
        return Reflect.has(target, prop);
    },
    deleteProperty(target, prop) {
        console.log(`Deleting: ${prop}`);
        return Reflect.deleteProperty(target, prop);
    }
});

proxy.name;          // Logs: Accessing: name
proxy.age = 26;      // Logs: Setting: age = 26
'name' in proxy;     // Logs: Checking: name
delete proxy.age;    // Logs: Deleting: age

// -------------------------------------------------------------------------------------------
// 7. REFLECT.GETPROTOTYPEOF / SETPROTOTYPEOF
// -------------------------------------------------------------------------------------------

const proto = { greet() { return "Hello"; } };
const child = Object.create(proto);

console.log(Reflect.getPrototypeOf(child) === proto);  // true

const newProto = { farewell() { return "Goodbye"; } };
Reflect.setPrototypeOf(child, newProto);

console.log(Reflect.getPrototypeOf(child) === newProto);  // true

// -------------------------------------------------------------------------------------------
// 8. REFLECT.PREVENTEXTENSIONS / ISEXTENSIBLE
// -------------------------------------------------------------------------------------------

const extensible = { a: 1 };

console.log(Reflect.isExtensible(extensible));  // true

Reflect.preventExtensions(extensible);

console.log(Reflect.isExtensible(extensible));  // false
console.log(Reflect.set(extensible, 'b', 2));   // false (can't add new)
console.log(Reflect.set(extensible, 'a', 10));  // true (can modify existing)

// -------------------------------------------------------------------------------------------
// 9. FULL LIST OF REFLECT METHODS
// -------------------------------------------------------------------------------------------

/**
 * Reflect.apply(target, thisArg, args)
 * Reflect.construct(target, args, newTarget?)
 * Reflect.defineProperty(target, prop, descriptor)
 * Reflect.deleteProperty(target, prop)
 * Reflect.get(target, prop, receiver?)
 * Reflect.getOwnPropertyDescriptor(target, prop)
 * Reflect.getPrototypeOf(target)
 * Reflect.has(target, prop)
 * Reflect.isExtensible(target)
 * Reflect.ownKeys(target)
 * Reflect.preventExtensions(target)
 * Reflect.set(target, prop, value, receiver?)
 * Reflect.setPrototypeOf(target, proto)
 */

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL EXAMPLE: PROPERTY ACCESS LOGGING
// -------------------------------------------------------------------------------------------

function createTrackedObject(obj, onAccess) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            onAccess('get', prop);
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            onAccess('set', prop, value);
            return Reflect.set(target, prop, value, receiver);
        }
    });
}

const tracked = createTrackedObject(
    { count: 0 },
    (operation, prop, value) => {
        console.log(`${operation}: ${prop}${value !== undefined ? ` = ${value}` : ''}`);
    }
);

tracked.count;      // get: count
tracked.count = 5;  // set: count = 5

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * REFLECT API:
 * - Function-based object operations
 * - Returns booleans instead of throwing
 * - Maps 1:1 to Proxy traps
 * 
 * KEY METHODS:
 * - get, set, has, deleteProperty
 * - ownKeys, defineProperty
 * - apply, construct
 * - getPrototypeOf, setPrototypeOf
 * 
 * BENEFITS:
 * - Consistent API for metaprogramming
 * - Error handling via return values
 * - Perfect for Proxy handlers
 * - Safer than operator-based operations
 */
