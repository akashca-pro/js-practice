/**
 * TOPIC: JSON HANDLING
 * DESCRIPTION:
 * JSON (JavaScript Object Notation) is a lightweight data format.
 * JavaScript provides built-in methods to parse and stringify JSON,
 * with options for customization.
 */

// -------------------------------------------------------------------------------------------
// 1. JSON BASICS
// -------------------------------------------------------------------------------------------

/**
 * JSON supports:
 * - Strings (double quotes only)
 * - Numbers
 * - Booleans (true/false)
 * - null
 * - Arrays
 * - Objects
 * 
 * JSON does NOT support:
 * - undefined
 * - Functions
 * - Symbol
 * - BigInt
 * - Date (serializes as string)
 * - Map, Set
 * - Circular references
 */

// -------------------------------------------------------------------------------------------
// 2. JSON.STRINGIFY
// -------------------------------------------------------------------------------------------

const obj = {
    name: 'Alice',
    age: 25,
    hobbies: ['reading', 'gaming']
};

// Basic stringify
const json = JSON.stringify(obj);
// '{"name":"Alice","age":25,"hobbies":["reading","gaming"]}'

// With indentation (pretty print)
const pretty = JSON.stringify(obj, null, 2);
/*
{
  "name": "Alice",
  "age": 25,
  "hobbies": [
    "reading",
    "gaming"
  ]
}
*/

// With tab indentation
const tabbed = JSON.stringify(obj, null, '\t');

// -------------------------------------------------------------------------------------------
// 3. REPLACER FUNCTION
// -------------------------------------------------------------------------------------------

/**
 * Second parameter can filter/transform values.
 */

// Filter properties
const filtered = JSON.stringify(obj, ['name', 'age']);
// '{"name":"Alice","age":25}'

// Transform values
const transformed = JSON.stringify(obj, (key, value) => {
    if (typeof value === 'string') {
        return value.toUpperCase();
    }
    return value;
});
// '{"name":"ALICE","age":25,"hobbies":["READING","GAMING"]}'

// Remove properties
const hidden = JSON.stringify(obj, (key, value) => {
    if (key === 'age') return undefined;  // Omit
    return value;
});

// -------------------------------------------------------------------------------------------
// 4. JSON.PARSE
// -------------------------------------------------------------------------------------------

const jsonString = '{"name":"Bob","age":30}';

// Basic parse
const parsed = JSON.parse(jsonString);
console.log(parsed.name);  // "Bob"

// Parse with reviver
const withDate = '{"created":"2024-01-15T10:30:00.000Z"}';
const revived = JSON.parse(withDate, (key, value) => {
    if (key === 'created') {
        return new Date(value);
    }
    return value;
});
console.log(revived.created instanceof Date);  // true

// -------------------------------------------------------------------------------------------
// 5. HANDLING SPECIAL VALUES
// -------------------------------------------------------------------------------------------

// undefined, functions, symbols are excluded
const special = {
    a: undefined,
    b: function() {},
    c: Symbol('sym'),
    d: 'kept'
};
console.log(JSON.stringify(special));  // '{"d":"kept"}'

// Date becomes string
const dateObj = { date: new Date('2024-01-01') };
console.log(JSON.stringify(dateObj));
// '{"date":"2024-01-01T00:00:00.000Z"}'

// BigInt throws error
// JSON.stringify({ big: 10n });  // TypeError

// Handle BigInt
const bigIntReplacer = (key, value) => {
    if (typeof value === 'bigint') {
        return value.toString() + 'n';
    }
    return value;
};

// -------------------------------------------------------------------------------------------
// 6. TOJSON METHOD
// -------------------------------------------------------------------------------------------

/**
 * Objects can define custom toJSON() for serialization.
 */

class User {
    constructor(name, password) {
        this.name = name;
        this.password = password;
    }
    
    toJSON() {
        return {
            name: this.name
            // Exclude password
        };
    }
}

const user = new User('Alice', 'secret123');
console.log(JSON.stringify(user));  // '{"name":"Alice"}'

// -------------------------------------------------------------------------------------------
// 7. CIRCULAR REFERENCE HANDLING
// -------------------------------------------------------------------------------------------

const parent = { name: 'Parent' };
const child = { name: 'Child', parent: parent };
parent.child = child;  // Circular!

// JSON.stringify(parent);  // TypeError: circular structure

// Solution: Custom replacer
function circularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    };
}

console.log(JSON.stringify(parent, circularReplacer()));

// -------------------------------------------------------------------------------------------
// 8. DEEP CLONE WITH JSON
// -------------------------------------------------------------------------------------------

function jsonClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Limitations:
// - Loses Date (becomes string)
// - Loses undefined, functions, symbols
// - Fails on circular references
// - Loses prototype chain

// Better alternative: structuredClone()
// const clone = structuredClone(obj);

// -------------------------------------------------------------------------------------------
// 9. SAFE PARSING
// -------------------------------------------------------------------------------------------

function safeParse(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error('JSON parse error:', e.message);
        return fallback;
    }
}

safeParse('{"valid": true}');  // { valid: true }
safeParse('invalid json');      // null
safeParse('null');              // null
safeParse('{bad: json}', {});   // {}

// -------------------------------------------------------------------------------------------
// 10. JSON SCHEMA VALIDATION (Pattern)
// -------------------------------------------------------------------------------------------

function validateShape(data, schema) {
    for (const [key, type] of Object.entries(schema)) {
        if (typeof data[key] !== type) {
            return false;
        }
    }
    return true;
}

const userSchema = { name: 'string', age: 'number' };
validateShape({ name: 'Alice', age: 25 }, userSchema);  // true
validateShape({ name: 'Alice', age: '25' }, userSchema); // false

// -------------------------------------------------------------------------------------------
// 11. JSONL (JSON Lines) HANDLING
// -------------------------------------------------------------------------------------------

// Parse JSONL (newline-delimited JSON)
function parseJSONL(text) {
    return text.trim().split('\n').map(line => JSON.parse(line));
}

// Create JSONL
function toJSONL(array) {
    return array.map(item => JSON.stringify(item)).join('\n');
}

const records = [{ id: 1 }, { id: 2 }];
console.log(toJSONL(records));
// '{"id":1}\n{"id":2}'

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// API response handling
async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// Local storage helpers
const storage = {
    get(key, fallback = null) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    },
    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        localStorage.removeItem(key);
    }
};

// Pretty log objects
function prettyLog(label, obj) {
    console.log(label + ':\n' + JSON.stringify(obj, null, 2));
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * JSON.stringify(value, replacer, space):
 * - Convert to JSON string
 * - replacer: Filter/transform
 * - space: Indentation
 * 
 * JSON.parse(text, reviver):
 * - Parse JSON string
 * - reviver: Transform values
 * 
 * LIMITATIONS:
 * - No undefined, functions, symbols
 * - No circular references
 * - Date becomes string
 * - No Map/Set
 * 
 * PATTERNS:
 * - Use toJSON() for custom serialization
 * - Handle circular refs with WeakSet replacer
 * - Use structuredClone for deep cloning
 * - Always wrap parse in try-catch
 */
