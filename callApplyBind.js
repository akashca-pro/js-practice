/**
 * TOPIC: CALL, APPLY, AND BIND
 * DESCRIPTION:
 * These methods control the 'this' context when calling functions.
 * call and apply invoke immediately; bind returns a new function.
 * Essential for function borrowing and context manipulation.
 */

// -------------------------------------------------------------------------------------------
// 1. CALL METHOD
// -------------------------------------------------------------------------------------------

/**
 * call(thisArg, arg1, arg2, ...)
 * Invokes function with specified 'this' and individual arguments.
 */

function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'Alice' };

// Using call
const result = greet.call(person, 'Hello', '!');
console.log(result);  // "Hello, Alice!"

// Without call
// greet('Hello', '!');  // 'this' would be undefined/global

// -------------------------------------------------------------------------------------------
// 2. APPLY METHOD
// -------------------------------------------------------------------------------------------

/**
 * apply(thisArg, [argsArray])
 * Same as call, but arguments as array.
 * Useful when you have arguments in an array.
 */

const args = ['Hi', '?'];
const result2 = greet.apply(person, args);
console.log(result2);  // "Hi, Alice?"

// Practical use: Math with arrays
const numbers = [5, 6, 2, 3, 7];
const max = Math.max.apply(null, numbers);  // 7
const min = Math.min.apply(null, numbers);  // 2

// Modern alternative: spread operator
Math.max(...numbers);  // 7

// -------------------------------------------------------------------------------------------
// 3. BIND METHOD
// -------------------------------------------------------------------------------------------

/**
 * bind(thisArg, arg1, arg2, ...)
 * Returns NEW function with fixed 'this' and optional preset args.
 * Does NOT invoke immediately.
 */

const boundGreet = greet.bind(person, 'Welcome');
console.log(boundGreet('!'));  // "Welcome, Alice!"

// 'this' is permanently bound
const greetFn = boundGreet;
console.log(greetFn('!!'));  // "Welcome, Alice!!"

// -------------------------------------------------------------------------------------------
// 4. COMPARISON
// -------------------------------------------------------------------------------------------

/**
 * | Method | Invokes Now | Args Format    | Returns        |
 * |--------|-------------|----------------|----------------|
 * | call   | Yes         | Individual     | Function result|
 * | apply  | Yes         | Array          | Function result|
 * | bind   | No          | Individual     | New function   |
 */

function showThis() {
    console.log(this);
}

const obj = { name: 'Object' };

showThis.call(obj);   // Logs: { name: 'Object' }
showThis.apply(obj);  // Logs: { name: 'Object' }
const bound = showThis.bind(obj);
bound();              // Logs: { name: 'Object' }

// -------------------------------------------------------------------------------------------
// 5. FUNCTION BORROWING
// -------------------------------------------------------------------------------------------

const person1 = {
    name: 'Alice',
    introduce() {
        return `I am ${this.name}`;
    }
};

const person2 = { name: 'Bob' };

// Borrow introduce method
console.log(person1.introduce.call(person2));  // "I am Bob"

// Array methods on array-like objects
function logArguments() {
    // arguments is array-like, not a real array
    const args = Array.prototype.slice.call(arguments);
    console.log(args);
    
    // Modern alternative
    const args2 = [...arguments];
    const args3 = Array.from(arguments);
}

logArguments(1, 2, 3);  // [1, 2, 3]

// -------------------------------------------------------------------------------------------
// 6. PARTIAL APPLICATION WITH BIND
// -------------------------------------------------------------------------------------------

function multiply(a, b, c) {
    return a * b * c;
}

// Preset first argument
const double = multiply.bind(null, 2);
console.log(double(3, 4));  // 24 (2 * 3 * 4)

// Preset first two arguments
const multiplyBy6 = multiply.bind(null, 2, 3);
console.log(multiplyBy6(4));  // 24 (2 * 3 * 4)

// -------------------------------------------------------------------------------------------
// 7. EVENT HANDLERS WITH BIND
// -------------------------------------------------------------------------------------------

class Button {
    constructor(label) {
        this.label = label;
        this.clicks = 0;
    }
    
    handleClick() {
        this.clicks++;
        console.log(`${this.label} clicked ${this.clicks} times`);
    }
}

const btn = new Button('Submit');

// Without bind: 'this' would be the DOM element
// button.addEventListener('click', btn.handleClick);  // Wrong!

// With bind: 'this' is the Button instance
// button.addEventListener('click', btn.handleClick.bind(btn));

// Alternative: Arrow function in class field
class ButtonAlt {
    handleClick = () => {
        // 'this' is always the instance
    };
}

// -------------------------------------------------------------------------------------------
// 8. SOFTBIND
// -------------------------------------------------------------------------------------------

/**
 * Unlike bind which is permanent, softBind allows 'this' override.
 */

Function.prototype.softBind = function(obj, ...args) {
    const fn = this;
    return function(...laterArgs) {
        return fn.apply(
            (!this || this === globalThis) ? obj : this,
            [...args, ...laterArgs]
        );
    };
};

// -------------------------------------------------------------------------------------------
// 9. POLYFILL FOR BIND
// -------------------------------------------------------------------------------------------

/**
 * Understanding bind by implementing it.
 */

Function.prototype.myBind = function(context, ...boundArgs) {
    const fn = this;
    
    return function(...callArgs) {
        return fn.apply(context, [...boundArgs, ...callArgs]);
    };
};

// Usage
const myBoundFn = greet.myBind(person, 'Hey');
console.log(myBoundFn('!'));  // "Hey, Alice!"

// -------------------------------------------------------------------------------------------
// 10. USING WITH CONSTRUCTORS
// -------------------------------------------------------------------------------------------

function Point(x, y) {
    this.x = x;
    this.y = y;
}

// Create from array
const coords = [10, 20];

// Using apply with 'new' (pre-ES6)
function construct(Ctor, args) {
    return new (Ctor.bind.apply(Ctor, [null, ...args]))();
}

// Modern approach: spread with new
const point = new Point(...coords);

// -------------------------------------------------------------------------------------------
// 11. COMMON PATTERNS
// -------------------------------------------------------------------------------------------

// Logging with context
const logger = {
    prefix: '[LOG]',
    log(message) {
        console.log(`${this.prefix} ${message}`);
    }
};

// Loses context when passed as callback
// setTimeout(logger.log, 100, 'Test');  // Wrong!

// Fix with bind
setTimeout(logger.log.bind(logger), 100, 'Test');

// Max in array with apply
const maximum = Math.max.apply(null, [1, 2, 3, 4, 5]);

// Convert NodeList to Array
const nodeList = document.querySelectorAll('div');
const divArray = Array.prototype.slice.call(nodeList);
// Modern: Array.from(nodeList) or [...nodeList]

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * CALL:
 * - fn.call(thisArg, arg1, arg2)
 * - Invokes immediately
 * - Individual arguments
 * 
 * APPLY:
 * - fn.apply(thisArg, [args])
 * - Invokes immediately
 * - Arguments as array
 * - Use with Math.max/min on arrays
 * 
 * BIND:
 * - fn.bind(thisArg, arg1, arg2)
 * - Returns new function
 * - Permanent 'this' binding
 * - Partial application
 * - Event handlers
 * 
 * USE CASES:
 * - Function borrowing
 * - Method as callback (needs context)
 * - Partial application
 * - Array-like to array conversion
 */
