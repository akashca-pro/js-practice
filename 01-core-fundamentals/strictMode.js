/**
 * TOPIC: STRICT MODE
 * DESCRIPTION:
 * Strict mode opts into a restricted variant of JavaScript,
 * catching common errors and preventing unsafe actions.
 * Use 'use strict' to enable.
 */

// -------------------------------------------------------------------------------------------
// 1. ENABLING STRICT MODE
// -------------------------------------------------------------------------------------------

// Entire script
'use strict';

// Or just a function
function strictFunction() {
    'use strict';
    // Strict mode only in this function
}

// ES6 modules and classes are automatically strict

// -------------------------------------------------------------------------------------------
// 2. PREVENTS ACCIDENTAL GLOBALS
// -------------------------------------------------------------------------------------------

'use strict';

function example() {
    // Without strict mode: creates global variable
    // With strict mode: ReferenceError
    // undeclaredVar = 10;  // Error!
    
    // Correct way
    let declaredVar = 10;
}

// -------------------------------------------------------------------------------------------
// 3. DISALLOWS DUPLICATE PARAMETERS
// -------------------------------------------------------------------------------------------

'use strict';

// Without strict: second 'a' shadows first
// With strict: SyntaxError
// function duplicate(a, b, a) { }  // Error!

// Correct
function noDuplicate(a, b, c) { }

// -------------------------------------------------------------------------------------------
// 4. DISALLOWS OCTAL LITERALS
// -------------------------------------------------------------------------------------------

'use strict';

// Without strict: octal number
// With strict: SyntaxError
// const octal = 010;  // Error!

// Use modern syntax for octals
const octal = 0o10;  // OK, equals 8

// -------------------------------------------------------------------------------------------
// 5. PREVENTS DELETING UNDELETABLE PROPERTIES
// -------------------------------------------------------------------------------------------

'use strict';

// Without strict: fails silently
// With strict: TypeError
// delete Object.prototype;  // Error!

// -------------------------------------------------------------------------------------------
// 6. WITH STATEMENT PROHIBITED
// -------------------------------------------------------------------------------------------

'use strict';

const obj = { a: 1, b: 2 };

// Without strict mode (confusing, deprecated)
// with (obj) { console.log(a + b); }  // Error in strict!

// Correct approach
const { a, b } = obj;
console.log(a + b);

// -------------------------------------------------------------------------------------------
// 7. EVAL CHANGES
// -------------------------------------------------------------------------------------------

'use strict';

// In strict mode, eval doesn't introduce variables
eval('var evalVar = 10');
// console.log(evalVar);  // ReferenceError in strict!

// Variables stay inside eval's scope

// -------------------------------------------------------------------------------------------
// 8. THIS BINDING CHANGES
// -------------------------------------------------------------------------------------------

'use strict';

function showThis() {
    console.log(this);
}

showThis();  // undefined (not global object)

// Without strict mode, this would be the global object (window/global)

// -------------------------------------------------------------------------------------------
// 9. RESERVED WORDS
// -------------------------------------------------------------------------------------------

'use strict';

// These are reserved in strict mode:
// implements, interface, let, package, private, protected, public, static, yield

// Cannot use as identifiers
// let implements = 10;  // Error!

// -------------------------------------------------------------------------------------------
// 10. ARGUMENTS OBJECT CHANGES
// -------------------------------------------------------------------------------------------

'use strict';

function args(a) {
    a = 100;
    // In non-strict: arguments[0] would also be 100
    // In strict: arguments[0] stays at original value
    console.log(arguments[0]);  // Original value, not 100
}

// Callee and caller not allowed
function noCallee() {
    // console.log(arguments.callee);  // Error in strict!
}

// -------------------------------------------------------------------------------------------
// 11. ASSIGNMENT TO READ-ONLY PROPERTIES
// -------------------------------------------------------------------------------------------

'use strict';

const obj2 = {};
Object.defineProperty(obj2, 'readOnly', {
    value: 42,
    writable: false
});

// Without strict: fails silently
// With strict: TypeError
// obj2.readOnly = 99;  // Error!

// Assignment to getter-only property
const obj3 = {
    get value() { return 42; }
};

// obj3.value = 99;  // Error in strict mode!

// -------------------------------------------------------------------------------------------
// 12. ASSIGNMENT TO NON-EXTENSIBLE OBJECTS
// -------------------------------------------------------------------------------------------

'use strict';

const frozen = Object.freeze({ a: 1 });
// frozen.b = 2;  // Error in strict mode!

const sealed = Object.seal({ a: 1 });
// sealed.b = 2;  // Error in strict mode!
sealed.a = 2;     // OK, can modify existing

const nonExtensible = Object.preventExtensions({ a: 1 });
// nonExtensible.b = 2;  // Error in strict mode!

// -------------------------------------------------------------------------------------------
// 13. WHY USE STRICT MODE?
// -------------------------------------------------------------------------------------------

/**
 * BENEFITS:
 * ✓ Converts mistakes into errors
 * ✓ Prevents accidental globals
 * ✓ Throws on silent failures
 * ✓ Disables confusing features (with, arguments.callee)
 * ✓ Makes eval and arguments simpler
 * ✓ Secures JavaScript (this not global by default)
 * ✓ Enables future JavaScript features
 * 
 * WHEN TO USE:
 * - Always in modern code
 * - ES6 modules/classes are strict by default
 * - Be careful with legacy code (may break)
 */

// -------------------------------------------------------------------------------------------
// 14. STRICT MODE IN CLASSES AND MODULES
// -------------------------------------------------------------------------------------------

/**
 * ES6 classes are always strict.
 */

class StrictClass {
    constructor() {
        // 'use strict' is implicit
        // undeclared = 10;  // ReferenceError
    }
}

/**
 * ES Modules are always strict.
 */

// module.js
// 'use strict' is implicit
// export const value = 10;

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * STRICT MODE:
 * - 'use strict' at start of script or function
 * - Automatic in ES6 classes and modules
 * 
 * PREVENTS:
 * - Accidental global variables
 * - Duplicate parameters
 * - Octal literals
 * - Deleting undeletables
 * - with statement
 * - eval variable leakage
 * 
 * CHANGES:
 * - this is undefined in global functions
 * - arguments doesn't track parameter changes
 * - Throws on read-only assignments
 * - More reserved words
 * 
 * BEST PRACTICE:
 * - Use strict mode in all new code
 * - Use ES Modules (auto strict)
 * - Lint tools enforce strict patterns
 */
