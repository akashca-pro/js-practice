/**
 * TOPIC: 'this' CONTEXT (Binding, Lexical 'this' in Arrow Functions)
 * DESCRIPTION:
 * 'this' in JavaScript is determined by HOW a function is called,
 * not where it's defined. Arrow functions are the exception, using
 * lexical 'this' from their enclosing scope.
 */

// -------------------------------------------------------------------------------------------
// 1. DEFAULT BINDING
// -------------------------------------------------------------------------------------------

/**
 * In non-strict mode: 'this' = global object (window/global)
 * In strict mode: 'this' = undefined
 */

function showThis() {
    console.log(this);
}

showThis(); // window (non-strict) or undefined (strict)

// -------------------------------------------------------------------------------------------
// 2. IMPLICIT BINDING
// -------------------------------------------------------------------------------------------

/**
 * When a function is called as a method, 'this' = the object.
 */

const user = {
    name: "Alice",
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

user.greet(); // "Hello, I'm Alice" (this = user)

// DANGER: Losing implicit binding
const greetFn = user.greet;
greetFn(); // "Hello, I'm undefined" (this = global/undefined)

// -------------------------------------------------------------------------------------------
// 3. EXPLICIT BINDING (call, apply, bind)
// -------------------------------------------------------------------------------------------

function introduce(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: "Bob" };

// call - pass arguments individually
introduce.call(person, "Hi", "!");      // "Hi, I'm Bob!"

// apply - pass arguments as array
introduce.apply(person, ["Hello", "."]); // "Hello, I'm Bob."

// bind - returns new function with 'this' bound
const boundIntroduce = introduce.bind(person, "Hey");
boundIntroduce("?");                     // "Hey, I'm Bob?"

// -------------------------------------------------------------------------------------------
// 4. NEW BINDING
// -------------------------------------------------------------------------------------------

/**
 * With 'new', 'this' = newly created object.
 */

function Animal(name) {
    this.name = name;
    // 'this' is the new object being created
}

const dog = new Animal("Buddy");
console.log(dog.name); // "Buddy"

// -------------------------------------------------------------------------------------------
// 5. ARROW FUNCTIONS - LEXICAL 'this'
// -------------------------------------------------------------------------------------------

/**
 * Arrow functions don't have their own 'this'.
 * They inherit 'this' from the enclosing lexical scope.
 */

const obj = {
    name: "Object",
    
    regularMethod() {
        console.log("Regular:", this.name); // "Object"
        
        // Regular function loses 'this'
        function innerRegular() {
            console.log("Inner regular:", this.name); // undefined
        }
        
        // Arrow function inherits 'this' from regularMethod
        const innerArrow = () => {
            console.log("Inner arrow:", this.name);   // "Object"
        };
        
        innerRegular();
        innerArrow();
    },
    
    arrowMethod: () => {
        // Arrow defined in global/module scope - 'this' is global
        console.log("Arrow method:", this.name);     // undefined
    }
};

obj.regularMethod();
obj.arrowMethod();

// -------------------------------------------------------------------------------------------
// 6. 'this' IN EVENT HANDLERS
// -------------------------------------------------------------------------------------------

/*
// In DOM event handlers, 'this' = element that fired the event
button.addEventListener('click', function() {
    console.log(this); // the button element
});

// Arrow functions inherit from surrounding scope
button.addEventListener('click', () => {
    console.log(this); // NOT the button! Lexical 'this' (likely window)
});
*/

// -------------------------------------------------------------------------------------------
// 7. 'this' IN CLASSES
// -------------------------------------------------------------------------------------------

class Counter {
    constructor() {
        this.count = 0;
    }
    
    increment() {
        this.count++;
        console.log(this.count);
    }
    
    // Arrow as class field - always bound to instance
    incrementArrow = () => {
        this.count++;
        console.log(this.count);
    }
}

const counter = new Counter();
counter.increment();     // 1 (this = counter)

const inc = counter.increment;
// inc();                // Error! 'this' is undefined

const incArrow = counter.incrementArrow;
incArrow();              // 2 (this still = counter, thanks to arrow)

// -------------------------------------------------------------------------------------------
// 8. BINDING PRECEDENCE
// -------------------------------------------------------------------------------------------

/**
 * Precedence (highest to lowest):
 * 1. new binding
 * 2. Explicit binding (call, apply, bind)
 * 3. Implicit binding (method call)
 * 4. Default binding (global/undefined)
 * 
 * Arrow functions ignore all of these - always lexical.
 */

// -------------------------------------------------------------------------------------------
// 9. COMMON PATTERNS
// -------------------------------------------------------------------------------------------

// Pattern 1: that/self (legacy)
const legacyObj = {
    data: [1, 2, 3],
    process() {
        const self = this;
        this.data.forEach(function(item) {
            console.log(self.data.length); // Works
        });
    }
};

// Pattern 2: Arrow function (modern)
const modernObj = {
    data: [1, 2, 3],
    process() {
        this.data.forEach((item) => {
            console.log(this.data.length); // Works - lexical this
        });
    }
};

// Pattern 3: bind (explicit)
const bindObj = {
    data: [1, 2, 3],
    process() {
        this.data.forEach(function(item) {
            console.log(this.data.length);
        }.bind(this));
    }
};

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * RULES:
 * 1. Default: global (non-strict) or undefined (strict)
 * 2. Implicit: object.method() -> this = object
 * 3. Explicit: call/apply/bind set 'this'
 * 4. new: 'this' = new object
 * 
 * ARROW FUNCTIONS:
 * - No own 'this' - inherit from enclosing scope
 * - Cannot be changed with call/apply/bind
 * - Perfect for callbacks that need parent's 'this'
 * - Don't use as methods if you need 'this' = object
 */
