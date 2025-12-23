/**
 * TOPIC: SYMBOLS (Well-known Symbols)
 * DESCRIPTION:
 * Symbol is a primitive type for creating unique identifiers.
 * Well-known Symbols allow customizing built-in JavaScript behaviors.
 */

// -------------------------------------------------------------------------------------------
// 1. SYMBOL BASICS
// -------------------------------------------------------------------------------------------

/**
 * Symbols are unique and immutable.
 * Two Symbols are never equal, even with same description.
 */

const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2);  // false (always unique)
console.log(typeof sym1);     // "symbol"
console.log(sym1.description);  // "description"

// -------------------------------------------------------------------------------------------
// 2. SYMBOLS AS PROPERTY KEYS
// -------------------------------------------------------------------------------------------

/**
 * Symbols can be object property keys.
 * They don't appear in for...in, Object.keys, etc.
 */

const SECRET = Symbol('secret');

const user = {
    name: "Alice",
    [SECRET]: "hidden value"
};

console.log(user.name);     // "Alice"
console.log(user[SECRET]);  // "hidden value"

console.log(Object.keys(user));  // ['name'] - SECRET not included
console.log(JSON.stringify(user));  // '{"name":"Alice"}' - SECRET not included

// Get symbol properties
console.log(Object.getOwnPropertySymbols(user));  // [Symbol(secret)]
console.log(Reflect.ownKeys(user));  // ['name', Symbol(secret)]

// -------------------------------------------------------------------------------------------
// 3. SYMBOL.FOR() - GLOBAL SYMBOL REGISTRY
// -------------------------------------------------------------------------------------------

/**
 * Symbol.for(key) returns same symbol for same key (globally shared).
 * Symbol.keyFor(sym) returns the key for a global symbol.
 */

const global1 = Symbol.for('app.id');
const global2 = Symbol.for('app.id');

console.log(global1 === global2);  // true (same symbol!)

console.log(Symbol.keyFor(global1));  // 'app.id'
console.log(Symbol.keyFor(sym1));     // undefined (not global)

// -------------------------------------------------------------------------------------------
// 4. WELL-KNOWN SYMBOLS
// -------------------------------------------------------------------------------------------

/**
 * JavaScript uses well-known symbols to customize built-in behavior.
 */

// -------------------------------------------------------------------------------------------
// 5. SYMBOL.ITERATOR
// -------------------------------------------------------------------------------------------

/**
 * Makes an object iterable with for...of.
 */

const range = {
    start: 1,
    end: 5,
    
    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;
        
        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log([...range]);  // [1, 2, 3, 4, 5]

for (const n of range) {
    console.log(n);  // 1, 2, 3, 4, 5
}

// -------------------------------------------------------------------------------------------
// 6. SYMBOL.TOSTRINGTAG
// -------------------------------------------------------------------------------------------

/**
 * Customizes Object.prototype.toString() result.
 */

class Collection {
    get [Symbol.toStringTag]() {
        return 'Collection';
    }
}

const coll = new Collection();
console.log(Object.prototype.toString.call(coll));  // '[object Collection]'

// -------------------------------------------------------------------------------------------
// 7. SYMBOL.TOPRIMITIVE
// -------------------------------------------------------------------------------------------

/**
 * Controls type conversion.
 */

const money = {
    amount: 100,
    currency: 'USD',
    
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.amount;
        }
        if (hint === 'string') {
            return `${this.currency} ${this.amount}`;
        }
        return this.amount;  // default
    }
};

console.log(+money);           // 100 (number)
console.log(`${money}`);       // "USD 100" (string)
console.log(money + 50);       // 150 (default -> number)

// -------------------------------------------------------------------------------------------
// 8. SYMBOL.HASINSTANCE
// -------------------------------------------------------------------------------------------

/**
 * Customizes instanceof behavior.
 */

class MyArray {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance);
    }
}

console.log([] instanceof MyArray);     // true
console.log({} instanceof MyArray);     // false

// -------------------------------------------------------------------------------------------
// 9. SYMBOL.SPECIES
// -------------------------------------------------------------------------------------------

/**
 * Controls constructor for derived objects.
 */

class CustomArray extends Array {
    static get [Symbol.species]() {
        return Array;  // map/filter return regular Array, not CustomArray
    }
}

const custom = new CustomArray(1, 2, 3);
const mapped = custom.map(x => x * 2);

console.log(mapped instanceof CustomArray);  // false
console.log(mapped instanceof Array);        // true

// -------------------------------------------------------------------------------------------
// 10. SYMBOL.ISCONCATSPREADABLE
// -------------------------------------------------------------------------------------------

/**
 * Controls how Array.concat treats an object.
 */

const arr = [1, 2];
const spreadable = { 0: 'a', 1: 'b', length: 2, [Symbol.isConcatSpreadable]: true };
const notSpreadable = { 0: 'x', 1: 'y', length: 2 };

console.log(arr.concat(spreadable));    // [1, 2, 'a', 'b']
console.log(arr.concat(notSpreadable)); // [1, 2, { 0: 'x', 1: 'y', length: 2 }]

// -------------------------------------------------------------------------------------------
// 11. SYMBOL.MATCH, SYMBOL.REPLACE, SYMBOL.SEARCH, SYMBOL.SPLIT
// -------------------------------------------------------------------------------------------

/**
 * Customize string method behavior.
 */

const customMatcher = {
    [Symbol.match](str) {
        return str.includes('hello') ? ['hello'] : null;
    }
};

console.log('say hello'.match(customMatcher));  // ['hello']
console.log('goodbye'.match(customMatcher));     // null

// -------------------------------------------------------------------------------------------
// 12. ALL WELL-KNOWN SYMBOLS
// -------------------------------------------------------------------------------------------

/**
 * Symbol.iterator      - Make object iterable
 * Symbol.asyncIterator - Make object async iterable
 * Symbol.toStringTag   - Customize toString
 * Symbol.toPrimitive   - Type conversion
 * Symbol.hasInstance   - instanceof behavior
 * Symbol.species       - Constructor for derived objects
 * Symbol.isConcatSpreadable - Array.concat behavior
 * Symbol.match/replace/search/split - String methods
 * Symbol.unscopables   - 'with' statement (legacy)
 */

// -------------------------------------------------------------------------------------------
// 13. PRACTICAL USES
// -------------------------------------------------------------------------------------------

// Private-ish properties
const _private = Symbol('private');

class MyClass {
    constructor() {
        this[_private] = 'hidden';
        this.public = 'visible';
    }
    
    getPrivate() {
        return this[_private];
    }
}

// Type identification
const TYPE = Symbol.for('myapp.type');

function createUser() {
    return { [TYPE]: 'User', name: '' };
}

function isUser(obj) {
    return obj[TYPE] === 'User';
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SYMBOLS:
 * - Unique, immutable primitive type
 * - Hidden from for...in, Object.keys, JSON
 * - Symbol.for() for global registry
 * 
 * WELL-KNOWN SYMBOLS:
 * - Customize built-in JavaScript behavior
 * - Symbol.iterator: make iterable
 * - Symbol.toStringTag: custom type string
 * - Symbol.toPrimitive: type conversion
 * - Symbol.hasInstance: instanceof
 * - Symbol.species: derived constructors
 * 
 * USE CASES:
 * - Private/hidden properties
 * - Custom iterators
 * - Type identification
 * - Extending built-in behavior
 */
