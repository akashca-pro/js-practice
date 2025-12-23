/**
 * TOPIC: DEEP CLONING VS SHALLOW CLONING (Structured Clone API)
 * DESCRIPTION:
 * Shallow cloning copies only the first level; nested objects are
 * still references. Deep cloning creates independent copies at all
 * levels. ES2022 introduced structuredClone for native deep cloning.
 */

// -------------------------------------------------------------------------------------------
// 1. SHALLOW CLONING METHODS
// -------------------------------------------------------------------------------------------

const original = {
    name: "Alice",
    address: { city: "NYC", zip: "10001" },
    hobbies: ["reading", "gaming"]
};

// Method 1: Spread operator
const spreadClone = { ...original };

// Method 2: Object.assign
const assignClone = Object.assign({}, original);

// Both are SHALLOW - nested objects are still references
spreadClone.address.city = "LA";
console.log(original.address.city); // "LA" - Original modified!

// -------------------------------------------------------------------------------------------
// 2. THE PROBLEM WITH SHALLOW CLONES
// -------------------------------------------------------------------------------------------

const data = {
    user: { name: "Bob" },
    items: [1, 2, 3]
};

const shallow = { ...data };

shallow.user.name = "Changed";
shallow.items.push(4);

console.log(data.user.name);  // "Changed" - Affected!
console.log(data.items);       // [1, 2, 3, 4] - Affected!

// -------------------------------------------------------------------------------------------
// 3. JSON.PARSE(JSON.STRINGIFY()) - Legacy Deep Clone
// -------------------------------------------------------------------------------------------

const obj = {
    name: "Test",
    nested: { deep: { value: 42 } }
};

const jsonClone = JSON.parse(JSON.stringify(obj));
jsonClone.nested.deep.value = 100;

console.log(obj.nested.deep.value); // 42 - Original unchanged!

/**
 * LIMITATIONS:
 * - Functions are lost
 * - undefined becomes null
 * - Date becomes string
 * - Map, Set, RegExp lost
 * - Circular references throw error
 * - Symbol keys ignored
 * - Prototype chain lost
 */

const problematic = {
    fn: () => "hello",
    date: new Date(),
    undef: undefined,
    regex: /abc/g,
    map: new Map([["a", 1]]),
    set: new Set([1, 2, 3])
};

const jsonBroken = JSON.parse(JSON.stringify(problematic));
console.log(jsonBroken);
// { date: "2024-...", regex: {}, map: {}, set: {} }
// fn and undef are gone!

// -------------------------------------------------------------------------------------------
// 4. STRUCTUREDCLONE() - Modern Deep Clone (ES2022)
// -------------------------------------------------------------------------------------------

/**
 * structuredClone is the native deep cloning solution.
 * Uses the structured clone algorithm.
 */

const complex = {
    name: "Test",
    date: new Date(),
    map: new Map([["key", "value"]]),
    set: new Set([1, 2, 3]),
    nested: { deep: { array: [1, 2, 3] } },
    regex: /pattern/gi,
    buffer: new ArrayBuffer(8)
};

const cloned = structuredClone(complex);

cloned.nested.deep.array.push(4);
console.log(complex.nested.deep.array); // [1, 2, 3] - Unchanged!
console.log(cloned.map.get("key"));      // "value" - Map works!

// -------------------------------------------------------------------------------------------
// 5. STRUCTUREDCLONE LIMITATIONS
// -------------------------------------------------------------------------------------------

/**
 * CANNOT clone:
 * - Functions
 * - DOM nodes
 * - Property descriptors (getters/setters)
 * - Prototype chain
 * - Symbol keys
 * - WeakMap, WeakSet
 */

const cannotClone = {
    fn: function() {},           // Error
    // element: document.body,   // Error (in browser)
};

// structuredClone(cannotClone); // Throws DataCloneError

// -------------------------------------------------------------------------------------------
// 6. TRANSFER OPTION
// -------------------------------------------------------------------------------------------

/**
 * structuredClone can transfer ownership of some objects
 * (like ArrayBuffer) instead of copying.
 */

const buffer = new ArrayBuffer(1024);
console.log("Before:", buffer.byteLength); // 1024

const transferred = structuredClone(buffer, { transfer: [buffer] });
console.log("After original:", buffer.byteLength);     // 0 (detached!)
console.log("After clone:", transferred.byteLength);   // 1024

// -------------------------------------------------------------------------------------------
// 7. CUSTOM DEEP CLONE FUNCTION
// -------------------------------------------------------------------------------------------

function deepClone(obj, seen = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (seen.has(obj)) {
        return seen.get(obj);
    }
    
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    
    // Handle Map
    if (obj instanceof Map) {
        const clone = new Map();
        seen.set(obj, clone);
        obj.forEach((value, key) => {
            clone.set(deepClone(key, seen), deepClone(value, seen));
        });
        return clone;
    }
    
    // Handle Set
    if (obj instanceof Set) {
        const clone = new Set();
        seen.set(obj, clone);
        obj.forEach(value => {
            clone.add(deepClone(value, seen));
        });
        return clone;
    }
    
    // Handle Array
    if (Array.isArray(obj)) {
        const clone = [];
        seen.set(obj, clone);
        obj.forEach((item, index) => {
            clone[index] = deepClone(item, seen);
        });
        return clone;
    }
    
    // Handle Object
    const clone = Object.create(Object.getPrototypeOf(obj));
    seen.set(obj, clone);
    
    for (const key of Reflect.ownKeys(obj)) {
        clone[key] = deepClone(obj[key], seen);
    }
    
    return clone;
}

// Test circular reference
const circular = { name: "circular" };
circular.self = circular;

const clonedCircular = deepClone(circular);
console.log(clonedCircular.self === clonedCircular); // true (properly handled)

// -------------------------------------------------------------------------------------------
// 8. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Method              | Deep? | Circular? | Functions? | Date/Map/Set? |
 * |---------------------|-------|-----------|------------|---------------|
 * | Spread/Assign       | No    | N/A       | Yes        | Refs only     |
 * | JSON.parse/stringify| Yes   | Error     | No         | No            |
 * | structuredClone     | Yes   | Yes       | No         | Yes           |
 * | Custom function     | Yes   | Depends   | Can add    | Depends       |
 * | lodash.cloneDeep    | Yes   | Yes       | No         | Yes           |
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SHALLOW CLONING:
 * - Spread (...) or Object.assign
 * - Only first level is copied
 * - Nested objects are still references
 * 
 * DEEP CLONING:
 * - JSON.parse(JSON.stringify) - Simple but lossy
 * - structuredClone() - Best native option (ES2022)
 * - Custom function - Full control
 * - Libraries (lodash.cloneDeep) - Battle-tested
 * 
 * USE structuredClone WHEN:
 * - You need a true deep copy
 * - Object contains Date, Map, Set, typed arrays
 * - You have circular references
 * - You don't need to clone functions
 */
