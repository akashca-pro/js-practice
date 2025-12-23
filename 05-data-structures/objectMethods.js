/**
 * TOPIC: OBJECT METHODS
 * DESCRIPTION:
 * JavaScript provides static methods on Object for creating, inspecting,
 * and manipulating objects. These methods are essential for working
 * with data structures and implementing patterns.
 */

// -------------------------------------------------------------------------------------------
// 1. CREATING OBJECTS
// -------------------------------------------------------------------------------------------

// Object.create - create with specific prototype
const proto = { greet() { return 'Hello'; } };
const obj = Object.create(proto);
console.log(obj.greet());  // "Hello"

// Create with no prototype
const pureObject = Object.create(null);  // No inherited methods like toString

// Object.assign - copy properties
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);  // { a: 1, b: 2, c: 3 }

// Object.fromEntries - entries array to object
const entries = [['a', 1], ['b', 2]];
const fromEntries = Object.fromEntries(entries);  // { a: 1, b: 2 }

// -------------------------------------------------------------------------------------------
// 2. GETTING OBJECT INFORMATION
// -------------------------------------------------------------------------------------------

const person = { name: 'Alice', age: 25 };

// Object.keys - array of keys
Object.keys(person);  // ['name', 'age']

// Object.values - array of values
Object.values(person);  // ['Alice', 25]

// Object.entries - array of [key, value] pairs
Object.entries(person);  // [['name', 'Alice'], ['age', 25]]

// Iteration with entries
for (const [key, value] of Object.entries(person)) {
    console.log(`${key}: ${value}`);
}

// -------------------------------------------------------------------------------------------
// 3. PROPERTY DESCRIPTORS
// -------------------------------------------------------------------------------------------

// Object.getOwnPropertyDescriptor
const desc = Object.getOwnPropertyDescriptor(person, 'name');
// { value: 'Alice', writable: true, enumerable: true, configurable: true }

// Object.getOwnPropertyDescriptors
Object.getOwnPropertyDescriptors(person);

// Object.defineProperty - define/modify single property
Object.defineProperty(person, 'id', {
    value: 1,
    writable: false,
    enumerable: true,
    configurable: false
});

// Object.defineProperties - define multiple
Object.defineProperties(person, {
    email: { value: 'alice@example.com', writable: true },
    role: { value: 'user', writable: false }
});

// -------------------------------------------------------------------------------------------
// 4. PROTOTYPE METHODS
// -------------------------------------------------------------------------------------------

// Object.getPrototypeOf
const proto2 = Object.getPrototypeOf(obj);  // Returns prototype

// Object.setPrototypeOf (use sparingly - slow!)
Object.setPrototypeOf(obj, { newMethod() {} });

// Object.prototype.isPrototypeOf
proto.isPrototypeOf(obj);  // true

// -------------------------------------------------------------------------------------------
// 5. CHECKING PROPERTIES
// -------------------------------------------------------------------------------------------

const sample = { a: 1 };

// hasOwn (ES2022) - preferred over hasOwnProperty
Object.hasOwn(sample, 'a');  // true
Object.hasOwn(sample, 'toString');  // false (inherited)

// hasOwnProperty (older method)
sample.hasOwnProperty('a');  // true

// in operator (includes inherited)
'a' in sample;  // true
'toString' in sample;  // true

// Object.prototype.propertyIsEnumerable
sample.propertyIsEnumerable('a');  // true

// -------------------------------------------------------------------------------------------
// 6. OBJECT IMMUTABILITY
// -------------------------------------------------------------------------------------------

const config = { apiKey: 'secret', port: 3000 };

// Object.preventExtensions - no new properties
Object.preventExtensions(config);
config.newProp = 'test';  // Fails silently (or throws in strict)
Object.isExtensible(config);  // false

// Object.seal - no add/delete, can modify existing
const sealed = Object.seal({ a: 1 });
sealed.a = 2;  // OK
delete sealed.a;  // Fails
sealed.b = 3;  // Fails
Object.isSealed(sealed);  // true

// Object.freeze - completely immutable (shallow)
const frozen = Object.freeze({ a: 1 });
frozen.a = 2;  // Fails
Object.isFrozen(frozen);  // true

// Deep freeze utility
function deepFreeze(obj) {
    Object.freeze(obj);
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (value && typeof value === 'object') {
            deepFreeze(value);
        }
    }
    return obj;
}

// -------------------------------------------------------------------------------------------
// 7. GETTING ALL PROPERTIES
// -------------------------------------------------------------------------------------------

const complex = { a: 1 };
Object.defineProperty(complex, 'hidden', { value: 2, enumerable: false });
complex[Symbol('sym')] = 3;

// Object.keys - only enumerable string keys
Object.keys(complex);  // ['a']

// Object.getOwnPropertyNames - all string keys
Object.getOwnPropertyNames(complex);  // ['a', 'hidden']

// Object.getOwnPropertySymbols - symbol keys
Object.getOwnPropertySymbols(complex);  // [Symbol(sym)]

// Reflect.ownKeys - all keys (strings + symbols)
Reflect.ownKeys(complex);  // ['a', 'hidden', Symbol(sym)]

// -------------------------------------------------------------------------------------------
// 8. OBJECT COMPARISON
// -------------------------------------------------------------------------------------------

// Object.is - strict equality with special handling
Object.is(NaN, NaN);   // true (unlike ===)
Object.is(0, -0);      // false (unlike ===)
Object.is(1, 1);       // true

// Shallow equality check
function shallowEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }
    
    return true;
}

// -------------------------------------------------------------------------------------------
// 9. OBJECT GROUPING (ES2024)
// -------------------------------------------------------------------------------------------

const items = [
    { type: 'fruit', name: 'apple' },
    { type: 'vegetable', name: 'carrot' },
    { type: 'fruit', name: 'banana' }
];

// Object.groupBy (ES2024)
// const grouped = Object.groupBy(items, item => item.type);
// { fruit: [{...}, {...}], vegetable: [{...}] }

// Polyfill pattern
function groupBy(arr, keyFn) {
    return arr.reduce((groups, item) => {
        const key = keyFn(item);
        (groups[key] ??= []).push(item);
        return groups;
    }, {});
}

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Pick specific keys
function pick(obj, keys) {
    return Object.fromEntries(
        keys.filter(key => key in obj).map(key => [key, obj[key]])
    );
}

// Omit specific keys
function omit(obj, keys) {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => !keys.includes(key))
    );
}

// Rename keys
function renameKeys(obj, keyMap) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [keyMap[key] || key, value])
    );
}

// Invert key-value pairs
function invert(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [v, k])
    );
}

// Merge deep
function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object') {
            if (!target[key]) target[key] = {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    
    return mergeDeep(target, ...sources);
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * CREATION:
 * Object.create, Object.assign, Object.fromEntries
 * 
 * INSPECTION:
 * Object.keys, Object.values, Object.entries
 * Object.getOwnPropertyDescriptor(s)
 * 
 * PROTECTION:
 * Object.freeze, Object.seal, Object.preventExtensions
 * Object.isFrozen, Object.isSealed, Object.isExtensible
 * 
 * PROPERTIES:
 * Object.defineProperty, Object.defineProperties
 * Object.hasOwn, Object.getOwnPropertyNames/Symbols
 * 
 * PROTOTYPE:
 * Object.getPrototypeOf, Object.setPrototypeOf
 */
