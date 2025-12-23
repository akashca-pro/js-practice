/**
 * TOPIC: SET AND MAP DATA STRUCTURES
 * DESCRIPTION:
 * Set and Map are ES6 data structures. Set stores unique values.
 * Map stores key-value pairs with any type as keys. Both maintain
 * insertion order and provide efficient operations.
 */

// -------------------------------------------------------------------------------------------
// 1. SET BASICS
// -------------------------------------------------------------------------------------------

/**
 * Set stores unique values of any type.
 * Duplicates are automatically ignored.
 */

const set = new Set();

// Add values
set.add(1);
set.add(2);
set.add(2);  // Duplicate - ignored
set.add('hello');
set.add({ id: 1 });

console.log(set.size);  // 4 (not 5)

// Initialize with array
const numbers = new Set([1, 2, 3, 3, 4]);  // [1, 2, 3, 4]

// -------------------------------------------------------------------------------------------
// 2. SET METHODS
// -------------------------------------------------------------------------------------------

const fruits = new Set(['apple', 'banana', 'cherry']);

// Check membership
fruits.has('apple');    // true
fruits.has('mango');    // false

// Delete element
fruits.delete('banana');  // true (deleted)
fruits.delete('mango');   // false (not found)

// Clear all
fruits.clear();

// Iteration
for (const fruit of fruits) {
    console.log(fruit);
}

// forEach
fruits.forEach(fruit => console.log(fruit));

// Get values (Set has no keys)
fruits.keys();    // Same as values()
fruits.values();  // SetIterator
fruits.entries(); // [value, value] pairs for compatibility

// -------------------------------------------------------------------------------------------
// 3. SET USE CASES
// -------------------------------------------------------------------------------------------

// Remove duplicates from array
const arr = [1, 1, 2, 2, 3, 3];
const unique = [...new Set(arr)];  // [1, 2, 3]

// Set operations
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// Union
const union = new Set([...a, ...b]);  // [1, 2, 3, 4, 5, 6]

// Intersection
const intersection = new Set([...a].filter(x => b.has(x)));  // [3, 4]

// Difference
const difference = new Set([...a].filter(x => !b.has(x)));  // [1, 2]

// Symmetric difference
const symDiff = new Set([...a].filter(x => !b.has(x))
    .concat([...b].filter(x => !a.has(x))));  // [1, 2, 5, 6]

// Check subset
const isSubset = (subset, superset) => 
    [...subset].every(x => superset.has(x));

// -------------------------------------------------------------------------------------------
// 4. MAP BASICS
// -------------------------------------------------------------------------------------------

/**
 * Map stores key-value pairs.
 * Any value (including objects) can be a key.
 */

const map = new Map();

// Set values
map.set('name', 'Alice');
map.set(42, 'number key');
map.set({ id: 1 }, 'object key');

// Initialize with entries
const users = new Map([
    ['john', { age: 25 }],
    ['jane', { age: 30 }]
]);

// -------------------------------------------------------------------------------------------
// 5. MAP METHODS
// -------------------------------------------------------------------------------------------

const config = new Map();
config.set('host', 'localhost');
config.set('port', 3000);

// Get value
config.get('host');    // 'localhost'
config.get('missing'); // undefined

// Check key
config.has('host');    // true
config.has('missing'); // false

// Delete
config.delete('port'); // true

// Size
config.size;           // 1

// Clear
config.clear();

// -------------------------------------------------------------------------------------------
// 6. MAP ITERATION
// -------------------------------------------------------------------------------------------

const settings = new Map([
    ['theme', 'dark'],
    ['language', 'en']
]);

// for...of
for (const [key, value] of settings) {
    console.log(`${key}: ${value}`);
}

// Destructured entries
for (const [key, value] of settings.entries()) {
    console.log(key, value);
}

// Keys only
for (const key of settings.keys()) {
    console.log(key);
}

// Values only
for (const value of settings.values()) {
    console.log(value);
}

// forEach
settings.forEach((value, key) => {
    console.log(key, value);
});

// -------------------------------------------------------------------------------------------
// 7. MAP VS OBJECT
// -------------------------------------------------------------------------------------------

/**
 * | Feature         | Map                    | Object               |
 * |-----------------|------------------------|----------------------|
 * | Key types       | Any (incl. objects)    | String/Symbol only   |
 * | Order           | Insertion order        | Not guaranteed       |
 * | Size            | map.size               | Object.keys().length |
 * | Iteration       | Directly iterable      | Object.keys/entries  |
 * | Performance     | Better for many K/V    | Better for few K/V   |
 * | JSON support    | No                     | Yes                  |
 */

// Object keys (using object as key)
const objKey = { id: 1 };
const mapWithObjKey = new Map();
mapWithObjKey.set(objKey, 'value');
console.log(mapWithObjKey.get(objKey));  // 'value'

// Can't do this with regular objects
const obj = {};
obj[objKey] = 'value';  // Key becomes "[object Object]"

// -------------------------------------------------------------------------------------------
// 8. WEAKSET
// -------------------------------------------------------------------------------------------

/**
 * WeakSet holds objects weakly - they can be garbage collected.
 * - Only objects as values (no primitives)
 * - Not iterable
 * - No size property
 */

const weakSet = new WeakSet();
let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1));  // true

// If obj1 is dereferenced, it can be garbage collected
obj1 = null;  // Object may now be GC'd

// Use case: Track processed objects
const processed = new WeakSet();
function process(obj) {
    if (processed.has(obj)) return;
    processed.add(obj);
    // Process object...
}

// -------------------------------------------------------------------------------------------
// 9. WEAKMAP
// -------------------------------------------------------------------------------------------

/**
 * WeakMap holds object keys weakly.
 * - Only objects as keys
 * - Not iterable
 * - No size property
 */

const weakMap = new WeakMap();
let key1 = { id: 1 };

weakMap.set(key1, 'data');
console.log(weakMap.get(key1));  // 'data'

key1 = null;  // Entry may now be GC'd

// Use case: Private data
const _private = new WeakMap();

class Person {
    constructor(name, secret) {
        this.name = name;
        _private.set(this, { secret });
    }
    
    getSecret() {
        return _private.get(this).secret;
    }
}

// Use case: DOM element metadata
const elementData = new WeakMap();
// When DOM element is removed, data is automatically cleaned up

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Counting occurrences
function countOccurrences(arr) {
    return arr.reduce((map, item) => {
        map.set(item, (map.get(item) || 0) + 1);
        return map;
    }, new Map());
}

// Grouping by key
function groupBy(arr, keyFn) {
    const map = new Map();
    for (const item of arr) {
        const key = keyFn(item);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
    }
    return map;
}

// LRU Cache with Map
class LRUCache {
    constructor(maxSize) {
        this.maxSize = maxSize;
        this.cache = new Map();
    }
    
    get(key) {
        if (!this.cache.has(key)) return undefined;
        const value = this.cache.get(key);
        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, value);
        return value;
    }
    
    set(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.maxSize) {
            // Delete oldest (first)
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SET:
 * - Unique values collection
 * - add, has, delete, clear
 * - Great for deduplication and set operations
 * 
 * MAP:
 * - Key-value pairs with any key type
 * - set, get, has, delete, clear
 * - Maintains insertion order
 * - Better than Object for dynamic keys
 * 
 * WEAKSET/WEAKMAP:
 * - Weak references (allow GC)
 * - Not iterable, no size
 * - Great for caching/private data
 */
