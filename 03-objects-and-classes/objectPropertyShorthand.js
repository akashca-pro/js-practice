/**
 * TOPIC: OBJECT PROPERTY SHORTHAND & COMPUTED PROPERTIES
 * DESCRIPTION:
 * ES6 introduced cleaner syntax for object creation including
 * property shorthand, method shorthand, and computed property
 * names. These features make code more concise and expressive.
 */

// -------------------------------------------------------------------------------------------
// 1. PROPERTY SHORTHAND
// -------------------------------------------------------------------------------------------

/**
 * When property name matches variable name, use shorthand.
 */

const name = 'Alice';
const age = 25;
const city = 'NYC';

// Before ES6
const personOld = {
    name: name,
    age: age,
    city: city
};

// ES6 shorthand
const person = { name, age, city };

console.log(person);  // { name: 'Alice', age: 25, city: 'NYC' }

// Mixed usage
const role = 'admin';
const user = {
    name,
    role,
    isActive: true,  // Regular property
    createdAt: new Date()
};

// -------------------------------------------------------------------------------------------
// 2. METHOD SHORTHAND
// -------------------------------------------------------------------------------------------

// Before ES6
const calculatorOld = {
    add: function(a, b) {
        return a + b;
    }
};

// ES6 shorthand
const calculator = {
    add(a, b) {
        return a + b;
    },
    
    subtract(a, b) {
        return a - b;
    },
    
    // With async
    async fetchData() {
        return await fetch('/api/data');
    },
    
    // Generator
    *generateNumbers() {
        yield 1;
        yield 2;
        yield 3;
    }
};

// -------------------------------------------------------------------------------------------
// 3. COMPUTED PROPERTY NAMES
// -------------------------------------------------------------------------------------------

/**
 * Use expressions as property names with [expression].
 */

const propName = 'dynamicKey';

const obj = {
    [propName]: 'value',              // 'dynamicKey': 'value'
    ['key' + 2]: 'value2',            // 'key2': 'value2'
    [1 + 2]: 'value3',                // '3': 'value3'
    [`computed_${Date.now()}`]: true
};

console.log(obj.dynamicKey);  // 'value'
console.log(obj.key2);        // 'value2'

// With variables
function createObject(key, value) {
    return {
        [key]: value
    };
}

createObject('name', 'Alice');  // { name: 'Alice' }

// -------------------------------------------------------------------------------------------
// 4. COMPUTED METHOD NAMES
// -------------------------------------------------------------------------------------------

const prefix = 'get';

const methods = {
    [`${prefix}User`]() {
        return { id: 1, name: 'Alice' };
    },
    
    [`${prefix}Posts`]() {
        return [];
    }
};

methods.getUser();   // { id: 1, name: 'Alice' }
methods.getPosts();  // []

// Symbol as method name
const methodSymbol = Symbol('myMethod');

const objWithSymbol = {
    [methodSymbol]() {
        return 'Symbol method called';
    }
};

objWithSymbol[methodSymbol]();  // 'Symbol method called'

// -------------------------------------------------------------------------------------------
// 5. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Redux action creators
const actionType = 'ADD_TODO';
const actionCreator = {
    [actionType]: (payload) => ({
        type: actionType,
        payload
    })
};

// Dynamic object creation
function createUser({ firstName, lastName, email }) {
    const fullName = `${firstName} ${lastName}`;
    
    return {
        firstName,
        lastName,
        fullName,
        email,
        createdAt: new Date(),
        
        sendEmail(message) {
            console.log(`Sending to ${email}: ${message}`);
        }
    };
}

// State update helper
function updateState(state, updates) {
    return {
        ...state,
        ...updates,
        lastUpdated: Date.now()
    };
}

// -------------------------------------------------------------------------------------------
// 6. OBJECT DESTRUCTURING WITH RENAME
// -------------------------------------------------------------------------------------------

const data = { a: 1, b: 2, c: 3 };

// Destructure with rename
const { a: first, b: second } = data;
console.log(first);   // 1
console.log(second);  // 2

// With default values
const { d: fourth = 4 } = data;
console.log(fourth);  // 4 (default)

// Combined
const response = { success: true, result: { items: [] } };
const { 
    success,
    result: { items = [] } = {} 
} = response;

// -------------------------------------------------------------------------------------------
// 7. REST IN OBJECTS
// -------------------------------------------------------------------------------------------

const full = { a: 1, b: 2, c: 3, d: 4 };

// Collect remaining properties
const { a, ...rest } = full;
console.log(a);     // 1
console.log(rest);  // { b: 2, c: 3, d: 4 }

// Practical: Omit properties
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}

// Or cleaner with destructuring
const { password, token, ...safeUserData } = userData;

// -------------------------------------------------------------------------------------------
// 8. OBJECT SPREAD
// -------------------------------------------------------------------------------------------

const defaults = { theme: 'light', fontSize: 14 };
const userSettings = { theme: 'dark' };

// Merge objects (later properties win)
const settings = { ...defaults, ...userSettings };
console.log(settings);  // { theme: 'dark', fontSize: 14 }

// Clone with modifications
const original = { x: 1, y: 2 };
const modified = { ...original, z: 3 };

// Conditional spreading
const showExtra = true;
const config = {
    base: true,
    ...(showExtra && { extra: true })
};

// -------------------------------------------------------------------------------------------
// 9. DYNAMIC PROPERTY ACCESS
// -------------------------------------------------------------------------------------------

const data2 = { name: 'Alice', age: 25 };
const key = 'name';

// Access
data2[key];  // 'Alice'

// Set
data2[key] = 'Bob';

// Check existence
key in data2;  // true

// Safe access (optional chaining)
const nested = { user: { profile: { name: 'Alice' } } };
const dynamicPath = 'profile';
nested?.user?.[dynamicPath]?.name;  // 'Alice'

// -------------------------------------------------------------------------------------------
// 10. GETTER/SETTER SHORTHAND
// -------------------------------------------------------------------------------------------

const counter = {
    _count: 0,
    
    // Getter shorthand
    get count() {
        return this._count;
    },
    
    // Setter shorthand
    set count(value) {
        if (value >= 0) {
            this._count = value;
        }
    },
    
    // Method shorthand
    increment() {
        this._count++;
    }
};

// -------------------------------------------------------------------------------------------
// 11. CLASS WITH SHORTHAND PATTERNS
// -------------------------------------------------------------------------------------------

class Config {
    static defaults = {
        timeout: 5000,
        retries: 3
    };
    
    constructor(options = {}) {
        const { timeout, retries } = { ...Config.defaults, ...options };
        Object.assign(this, { timeout, retries });
    }
    
    // Computed property in class
    static [Symbol.toStringTag] = 'Config';
}

// -------------------------------------------------------------------------------------------
// 12. UTILITY FUNCTIONS
// -------------------------------------------------------------------------------------------

// Pick specific properties
function pick(obj, keys) {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}

// Rename keys
function renameKeys(obj, keyMap) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        const newKey = keyMap[key] || key;
        return { ...result, [newKey]: value };
    }, {});
}

// Map values
function mapValues(obj, fn) {
    return Object.entries(obj).reduce((result, [key, value]) => ({
        ...result,
        [key]: fn(value, key)
    }), {});
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * PROPERTY SHORTHAND:
 * - { name, age } instead of { name: name, age: age }
 * 
 * METHOD SHORTHAND:
 * - { greet() { } } instead of { greet: function() { } }
 * 
 * COMPUTED PROPERTIES:
 * - { [expression]: value }
 * - Dynamic property names
 * - Symbol keys
 * 
 * RELATED FEATURES:
 * - Object destructuring with rename
 * - Rest properties (...rest)
 * - Spread operator ({...obj})
 * - Getter/setter shorthand
 * 
 * BENEFITS:
 * - Cleaner, more concise code
 * - Dynamic object creation
 * - Better expressiveness
 */
