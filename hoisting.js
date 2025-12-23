/**
 * TOPIC: HOISTING (Function vs. Variable)
 * DESCRIPTION:
 * Hoisting is JavaScript's behavior of moving declarations to the top
 * of their scope during the creation phase. Functions and variables
 * are hoisted differently.
 */

// -------------------------------------------------------------------------------------------
// 1. WHAT IS HOISTING?
// -------------------------------------------------------------------------------------------

/**
 * Hoisting is NOT physically moving code. It's about how JavaScript
 * allocates memory during the Creation Phase of the Execution Context.
 * 
 * - Declarations are processed first.
 * - Assignments happen during the Execution Phase.
 */

// This works because function declarations are fully hoisted
sayHello(); // "Hello!"

function sayHello() {
    console.log("Hello!");
}

// -------------------------------------------------------------------------------------------
// 2. VARIABLE HOISTING (VAR)
// -------------------------------------------------------------------------------------------

/**
 * 'var' declarations are hoisted and initialized to 'undefined'.
 * Only the declaration is hoisted, NOT the assignment.
 */

console.log(myVar); // undefined (not ReferenceError)
var myVar = "I am defined now";
console.log(myVar); // "I am defined now"

/**
 * JavaScript sees this as:
 * 
 * var myVar;                      // Hoisted (initialized to undefined)
 * console.log(myVar);             // undefined
 * myVar = "I am defined now";     // Assignment stays in place
 * console.log(myVar);             // "I am defined now"
 */

// -------------------------------------------------------------------------------------------
// 3. VARIABLE HOISTING (LET & CONST) - THE TEMPORAL DEAD ZONE
// -------------------------------------------------------------------------------------------

/**
 * 'let' and 'const' ARE hoisted, but NOT initialized.
 * They exist in a "Temporal Dead Zone" (TDZ) from the start of the
 * block until the declaration is reached.
 */

// console.log(myLet);  // ReferenceError: Cannot access 'myLet' before initialization
let myLet = "I am let";

// console.log(myConst); // ReferenceError
const myConst = "I am const";

/**
 * TDZ PROOF - The variable IS hoisted:
 */
let outerLet = "outer";

function tdzProof() {
    // If 'let' wasn't hoisted, this would print "outer"
    // But it throws ReferenceError, proving inner 'let' shadows outer
    // console.log(outerLet); // ReferenceError!
    let outerLet = "inner";
}

// -------------------------------------------------------------------------------------------
// 4. FUNCTION DECLARATION HOISTING
// -------------------------------------------------------------------------------------------

/**
 * Function DECLARATIONS are fully hoisted - both the name AND the body.
 * You can call them before the declaration appears in code.
 */

greet(); // "Hello from greet!"

function greet() {
    console.log("Hello from greet!");
}

// -------------------------------------------------------------------------------------------
// 5. FUNCTION EXPRESSION HOISTING
// -------------------------------------------------------------------------------------------

/**
 * Function EXPRESSIONS are NOT fully hoisted.
 * The variable is hoisted (like any var/let/const), but the function 
 * assignment is not.
 */

// Using var:
// console.log(expressionVar);  // undefined
// expressionVar();             // TypeError: expressionVar is not a function

var expressionVar = function() {
    console.log("I'm a function expression with var");
};

// Using let/const:
// expressionLet();  // ReferenceError: Cannot access before initialization

const expressionLet = function() {
    console.log("I'm a function expression with const");
};

// -------------------------------------------------------------------------------------------
// 6. ARROW FUNCTION HOISTING
// -------------------------------------------------------------------------------------------

/**
 * Arrow functions behave like function expressions.
 * They follow the hoisting rules of their variable declaration.
 */

// arrowFn(); // ReferenceError (const is in TDZ)

const arrowFn = () => {
    console.log("I'm an arrow function");
};

arrowFn(); // Works here

// -------------------------------------------------------------------------------------------
// 7. FUNCTION VS VARIABLE PRECEDENCE
// -------------------------------------------------------------------------------------------

/**
 * When a function and variable have the same name:
 * - Function declarations take precedence during hoisting.
 * - Variable assignments can overwrite during execution.
 */

console.log(typeof duplicate); // "function" (function hoisted first)

var duplicate = "I'm a variable";

function duplicate() {
    return "I'm a function";
}

console.log(typeof duplicate); // "string" (variable assignment overwrote)

// -------------------------------------------------------------------------------------------
// 8. HOISTING IN BLOCKS
// -------------------------------------------------------------------------------------------

/**
 * 'var' is function-scoped, so block doesn't affect hoisting.
 * 'let'/'const' are block-scoped, hoisted only within their block.
 */

// VAR - hoisted to function scope
function varBlock() {
    console.log(x); // undefined (hoisted)
    if (true) {
        var x = 10;
    }
    console.log(x); // 10
}

varBlock();

// LET - hoisted only within the block
function letBlock() {
    // console.log(y); // ReferenceError
    if (true) {
        // console.log(y); // ReferenceError (TDZ)
        let y = 20;
        console.log(y); // 20
    }
    // console.log(y); // ReferenceError (out of scope)
}

letBlock();

// -------------------------------------------------------------------------------------------
// 9. CLASS HOISTING
// -------------------------------------------------------------------------------------------

/**
 * Classes are hoisted but remain in TDZ, similar to let/const.
 */

// const instance = new MyClass(); // ReferenceError!

class MyClass {
    constructor() {
        this.name = "MyClass";
    }
}

const instance = new MyClass(); // Works here

// -------------------------------------------------------------------------------------------
// 10. BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Declare at the top: Even though hoisting exists, 
 *    always declare variables at the top for readability.
 * 
 * 2. Use const by default: Then let if you need reassignment.
 *    Avoid var to prevent hoisting confusion.
 * 
 * 3. Function declarations over expressions: If you need hoisting.
 *    Use expressions/arrows when you want strict ordering.
 * 
 * 4. Understand TDZ: Helps debug "Cannot access before initialization" errors.
 */

// -------------------------------------------------------------------------------------------
// HOISTING COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Declaration Type       | Hoisted? | Initialized? | Scope    |
 * |------------------------|----------|--------------|----------|
 * | var                    | Yes      | undefined    | Function |
 * | let                    | Yes      | TDZ          | Block    |
 * | const                  | Yes      | TDZ          | Block    |
 * | function declaration   | Yes      | Full body    | Function |
 * | function expression    | Depends* | Depends*     | Depends* |
 * | class                  | Yes      | TDZ          | Block    |
 * 
 * * Function expressions follow the rules of their variable (var/let/const)
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * 1. Hoisting = Memory allocation during Creation Phase.
 * 2. var is hoisted and initialized to undefined.
 * 3. let/const are hoisted but stay in TDZ until declaration.
 * 4. Function declarations are fully hoisted (name + body).
 * 5. Function expressions follow their variable's hoisting rules.
 * 6. Classes are hoisted into TDZ like let/const.
 */
