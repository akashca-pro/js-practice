/**
 * TOPIC: SHADOWING AND PROPERTY DESCRIPTORS
 * DESCRIPTION:
 * Property descriptors control how properties behave (enumerable,
 * configurable, writable). Shadowing occurs when you create a
 * property with the same name on a derived object.
 */

// -------------------------------------------------------------------------------------------
// 1. PROPERTY DESCRIPTORS
// -------------------------------------------------------------------------------------------

/**
 * Every property has a descriptor with:
 * - value: The property value
 * - writable: Can value be changed?
 * - enumerable: Does it show in for...in / Object.keys?
 * - configurable: Can descriptor be changed? Can property be deleted?
 */

const obj = { name: "Alice" };

console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
// { value: "Alice", writable: true, enumerable: true, configurable: true }

// -------------------------------------------------------------------------------------------
// 2. DEFINING PROPERTIES WITH DESCRIPTORS
// -------------------------------------------------------------------------------------------

const person = {};

Object.defineProperty(person, 'id', {
    value: 1,
    writable: false,      // Cannot change
    enumerable: true,     // Shows in loops
    configurable: false   // Cannot delete or reconfigure
});

person.id = 2;            // Silently fails (or throws in strict mode)
console.log(person.id);   // 1

delete person.id;         // false - cannot delete
console.log(person.id);   // 1

// -------------------------------------------------------------------------------------------
// 3. WRITABLE: false
// -------------------------------------------------------------------------------------------

const config = {};

Object.defineProperty(config, 'API_KEY', {
    value: 'secret123',
    writable: false,
    enumerable: true,
    configurable: true
});

config.API_KEY = 'hacked'; // Fails
console.log(config.API_KEY); // 'secret123'

// -------------------------------------------------------------------------------------------
// 4. ENUMERABLE: false
// -------------------------------------------------------------------------------------------

const data = { visible: 1 };

Object.defineProperty(data, 'hidden', {
    value: 2,
    enumerable: false
});

console.log(Object.keys(data));        // ['visible']
console.log(Object.values(data));      // [1]
console.log(JSON.stringify(data));     // '{"visible":1}'

for (const key in data) {
    console.log(key);                  // Only 'visible'
}

// But direct access still works
console.log(data.hidden);              // 2

// -------------------------------------------------------------------------------------------
// 5. CONFIGURABLE: false
// -------------------------------------------------------------------------------------------

const settings = {};

Object.defineProperty(settings, 'locked', {
    value: true,
    writable: true,
    configurable: false
});

// Cannot change enumerable or configurable
Object.defineProperty(settings, 'locked', {
    enumerable: true // Error! Cannot reconfigure
});

// Can still change writable from true to false (one-way)
Object.defineProperty(settings, 'locked', {
    writable: false  // Allowed
});

// -------------------------------------------------------------------------------------------
// 6. ACCESSOR PROPERTIES (GETTERS/SETTERS)
// -------------------------------------------------------------------------------------------

const user = {
    firstName: "John",
    lastName: "Doe"
};

Object.defineProperty(user, 'fullName', {
    get() {
        return `${this.firstName} ${this.lastName}`;
    },
    set(value) {
        [this.firstName, this.lastName] = value.split(' ');
    },
    enumerable: true,
    configurable: true
});

console.log(user.fullName);    // "John Doe"
user.fullName = "Jane Smith";
console.log(user.firstName);   // "Jane"

// -------------------------------------------------------------------------------------------
// 7. DEFINEPROPERTIES (Multiple)
// -------------------------------------------------------------------------------------------

const account = {};

Object.defineProperties(account, {
    balance: {
        value: 1000,
        writable: true,
        enumerable: true
    },
    accountId: {
        value: 'ACC001',
        writable: false,
        enumerable: true
    }
});

// -------------------------------------------------------------------------------------------
// 8. PROPERTY SHADOWING
// -------------------------------------------------------------------------------------------

/**
 * Shadowing creates a property on the child that hides
 * the parent's property.
 */

const parent = { x: 1 };
const child = Object.create(parent);

console.log(child.x);      // 1 (inherited)

child.x = 2;               // Creates own property (shadows parent)

console.log(child.x);      // 2 (own property)
console.log(parent.x);     // 1 (unchanged)

console.log(child.hasOwnProperty('x'));  // true (now has own)

// -------------------------------------------------------------------------------------------
// 9. SHADOWING WITH NON-WRITABLE PARENT
// -------------------------------------------------------------------------------------------

const base = {};
Object.defineProperty(base, 'value', {
    value: 10,
    writable: false
});

const derived = Object.create(base);

// In strict mode, this throws. In non-strict, silently fails.
// derived.value = 20;

// To shadow, must use defineProperty
Object.defineProperty(derived, 'value', {
    value: 20,
    writable: true
});

console.log(derived.value); // 20

// -------------------------------------------------------------------------------------------
// 10. PREVENTING EXTENSION/MODIFICATION
// -------------------------------------------------------------------------------------------

// Object.preventExtensions - Cannot add new properties
const obj1 = { a: 1 };
Object.preventExtensions(obj1);
obj1.b = 2;              // Fails
obj1.a = 10;             // Works - existing properties still writable

// Object.seal - Cannot add/delete, but can modify existing
const obj2 = { a: 1 };
Object.seal(obj2);
obj2.a = 10;             // Works
delete obj2.a;           // Fails

// Object.freeze - Completely immutable (shallow)
const obj3 = { a: 1 };
Object.freeze(obj3);
obj3.a = 10;             // Fails

// Check state
console.log(Object.isExtensible(obj1)); // false
console.log(Object.isSealed(obj2));     // true
console.log(Object.isFrozen(obj3));     // true

// -------------------------------------------------------------------------------------------
// 11. DEEP FREEZE UTILITY
// -------------------------------------------------------------------------------------------

function deepFreeze(obj) {
    Object.freeze(obj);
    
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (value && typeof value === 'object' && !Object.isFrozen(value)) {
            deepFreeze(value);
        }
    });
    
    return obj;
}

const nested = deepFreeze({ a: { b: { c: 1 } } });
// nested.a.b.c = 2; // Fails at any level

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * PROPERTY DESCRIPTORS:
 * - writable: Can the value be changed?
 * - enumerable: Is it visible in loops/keys?
 * - configurable: Can it be deleted/reconfigured?
 * 
 * SHADOWING:
 * - Assignment creates new property on object
 * - Parent property is hidden, not modified
 * - Non-writable parent blocks direct assignment
 * 
 * IMMUTABILITY:
 * - preventExtensions: No new properties
 * - seal: No add/delete, can modify
 * - freeze: Complete shallow immutability
 */
