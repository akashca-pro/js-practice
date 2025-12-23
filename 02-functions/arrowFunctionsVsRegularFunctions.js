/**
 * TOPIC: ARROW FUNCTIONS VS REGULAR FUNCTIONS
 * DESCRIPTION:
 * Arrow functions (=>) are a concise syntax introduced in ES6.
 * They differ from regular functions in key ways, especially
 * regarding 'this' binding and their use as methods.
 */

// -------------------------------------------------------------------------------------------
// 1. SYNTAX COMPARISON
// -------------------------------------------------------------------------------------------

// Regular function declaration
function add(a, b) {
    return a + b;
}

// Regular function expression
const multiply = function(a, b) {
    return a * b;
};

// Arrow function
const subtract = (a, b) => {
    return a - b;
};

// Arrow function - concise body (implicit return)
const divide = (a, b) => a / b;

// Single parameter - no parentheses needed
const double = x => x * 2;

// No parameters
const greet = () => 'Hello';

// -------------------------------------------------------------------------------------------
// 2. 'THIS' BINDING - KEY DIFFERENCE
// -------------------------------------------------------------------------------------------

/**
 * REGULAR FUNCTION: 'this' is determined by HOW function is called.
 * ARROW FUNCTION: 'this' is lexical (inherited from enclosing scope).
 */

const obj = {
    name: 'Object',
    
    regularMethod() {
        console.log(this.name);  // 'Object' (this = obj)
    },
    
    arrowMethod: () => {
        console.log(this.name);  // undefined (this = enclosing scope)
    }
};

obj.regularMethod();  // 'Object'
obj.arrowMethod();    // undefined (or window.name in browser)

// -------------------------------------------------------------------------------------------
// 3. 'THIS' IN CALLBACKS
// -------------------------------------------------------------------------------------------

const timer = {
    seconds: 0,
    
    // Problem with regular function
    startRegular() {
        setInterval(function() {
            this.seconds++;  // 'this' is NOT timer!
            console.log(this.seconds);  // NaN
        }, 1000);
    },
    
    // Solution with arrow function
    startArrow() {
        setInterval(() => {
            this.seconds++;  // 'this' IS timer (lexical)
            console.log(this.seconds);  // Works!
        }, 1000);
    },
    
    // Alternative: bind
    startBind() {
        setInterval(function() {
            this.seconds++;
            console.log(this.seconds);
        }.bind(this), 1000);
    }
};

// -------------------------------------------------------------------------------------------
// 4. ARGUMENTS OBJECT
// -------------------------------------------------------------------------------------------

// Regular function has 'arguments'
function sum() {
    return Array.from(arguments).reduce((a, b) => a + b, 0);
}
console.log(sum(1, 2, 3));  // 6

// Arrow function has NO 'arguments'
const arrowSum = () => {
    // console.log(arguments);  // ReferenceError!
};

// Arrow function: use rest parameters
const arrowSumRest = (...args) => args.reduce((a, b) => a + b, 0);
console.log(arrowSumRest(1, 2, 3));  // 6

// -------------------------------------------------------------------------------------------
// 5. CANNOT BE USED AS CONSTRUCTORS
// -------------------------------------------------------------------------------------------

function Person(name) {
    this.name = name;
}
const p1 = new Person('Alice');  // Works

const PersonArrow = (name) => {
    this.name = name;
};
// const p2 = new PersonArrow('Bob');  // TypeError!

// -------------------------------------------------------------------------------------------
// 6. NO PROTOTYPE PROPERTY
// -------------------------------------------------------------------------------------------

function RegularFn() {}
console.log(RegularFn.prototype);  // { constructor: f }

const ArrowFn = () => {};
console.log(ArrowFn.prototype);  // undefined

// -------------------------------------------------------------------------------------------
// 7. CANNOT USE YIELD (NOT GENERATORS)
// -------------------------------------------------------------------------------------------

function* regularGenerator() {
    yield 1;
    yield 2;
}

// Arrow functions cannot be generators
// const arrowGenerator = *() => { yield 1; };  // SyntaxError!

// -------------------------------------------------------------------------------------------
// 8. METHODS: WHEN NOT TO USE ARROWS
// -------------------------------------------------------------------------------------------

const user = {
    name: 'Alice',
    
    // DON'T use arrow for method (no this binding)
    greetArrow: () => {
        return `Hello, ${this.name}`;  // undefined
    },
    
    // DO use regular function for method
    greetRegular() {
        return `Hello, ${this.name}`;  // 'Alice'
    }
};

// Also problematic in prototype methods
class Counter {
    count = 0;
    
    // Arrow: each instance gets own function (memory overhead)
    incrementArrow = () => {
        this.count++;
    };
    
    // Regular: shared via prototype (more efficient)
    incrementRegular() {
        this.count++;
    }
}

// -------------------------------------------------------------------------------------------
// 9. WHEN ARROWS ARE BEST
// -------------------------------------------------------------------------------------------

// Callbacks (maintains outer this)
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);

// Inline functions
const sorted = numbers.sort((a, b) => a - b);

// Functional programming
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

// Event handlers in classes
class Button {
    handleClick = () => {
        // 'this' is always the Button instance
        console.log('Button clicked');
    };
}

// Short operations
const isEven = n => n % 2 === 0;
const square = x => x * x;

// -------------------------------------------------------------------------------------------
// 10. IMPLICIT VS EXPLICIT RETURN
// -------------------------------------------------------------------------------------------

// Explicit return (with braces)
const addExplicit = (a, b) => {
    return a + b;
};

// Implicit return (no braces)
const addImplicit = (a, b) => a + b;

// Returning object literal (needs parentheses)
const createObj = (name) => ({ name: name });
// Without parens: { name } is treated as function body!

// Multi-line implicit return (rare, avoid)
const complex = (a, b) => (
    a + b + 1
);

// -------------------------------------------------------------------------------------------
// 11. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Feature              | Regular Function    | Arrow Function     |
 * |----------------------|--------------------|--------------------|
 * | this                 | Dynamic (caller)   | Lexical (enclosing)|
 * | arguments            | Yes                | No                 |
 * | new (constructor)    | Yes                | No                 |
 * | prototype            | Yes                | No                 |
 * | Can be generator     | Yes                | No                 |
 * | Has own name         | Yes                | Inferred from var  |
 * | Hoisted (declaration)| Yes                | No (expression)    |
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * USE ARROW FUNCTIONS FOR:
 * - Callbacks in map/filter/reduce
 * - Short inline functions
 * - When you need lexical 'this'
 * - Functional programming patterns
 * 
 * USE REGULAR FUNCTIONS FOR:
 * - Object methods
 * - Prototype methods
 * - Constructors (or use class)
 * - When you need 'arguments'
 * - Generators
 * 
 * KEY DIFFERENCE:
 * - Arrow: 'this' from where function is DEFINED
 * - Regular: 'this' from how function is CALLED
 */
