/**
 * TOPIC: EXECUTION CONTEXT (Creation vs. Execution Phase)
 * DESCRIPTION:
 * An Execution Context is the environment where JavaScript code is evaluated
 * and executed. Understanding its two phases is essential for grasping
 * hoisting, variable behavior, and the 'this' keyword.
 */

// -------------------------------------------------------------------------------------------
// 1. TYPES OF EXECUTION CONTEXTS
// -------------------------------------------------------------------------------------------

/**
 * 1. GLOBAL EXECUTION CONTEXT:
 *    - Created when script starts.
 *    - Only one per program.
 *    - Creates the global object (window/global) and 'this'.
 * 
 * 2. FUNCTION EXECUTION CONTEXT:
 *    - Created each time a function is invoked.
 *    - Has its own variable environment and 'this' binding.
 * 
 * 3. EVAL EXECUTION CONTEXT:
 *    - Created when eval() is called (avoid using eval!).
 */

// -------------------------------------------------------------------------------------------
// 2. THE TWO PHASES OF EXECUTION CONTEXT
// -------------------------------------------------------------------------------------------

/**
 * PHASE 1: CREATION PHASE
 * -----------------------
 * Before any code runs, JavaScript:
 * 1. Creates the Variable Environment (VE).
 * 2. Creates the Lexical Environment (LE).
 * 3. Determines the value of 'this'.
 * 
 * During creation:
 * - Function declarations are fully hoisted (stored in memory).
 * - 'var' variables are hoisted and initialized to 'undefined'.
 * - 'let'/'const' variables are hoisted but NOT initialized (TDZ).
 */

/**
 * PHASE 2: EXECUTION PHASE
 * ------------------------
 * Code is executed line by line:
 * - Variables are assigned their actual values.
 * - Functions are called.
 * - Expressions are evaluated.
 */

// -------------------------------------------------------------------------------------------
// 3. CREATION PHASE VISUALIZATION
// -------------------------------------------------------------------------------------------

console.log(hoistedVar);       // undefined (hoisted, initialized to undefined)
// console.log(hoistedLet);    // ReferenceError (in TDZ)
hoistedFunction();             // "I work!" (fully hoisted)

var hoistedVar = "I'm a var";
let hoistedLet = "I'm a let";

function hoistedFunction() {
    console.log("I work!");
}

/**
 * CREATION PHASE creates:
 * {
 *   hoistedVar: undefined,
 *   hoistedLet: <uninitialized>,  // TDZ
 *   hoistedFunction: [Function object]
 * }
 */

// -------------------------------------------------------------------------------------------
// 4. EXECUTION CONTEXT COMPONENTS
// -------------------------------------------------------------------------------------------

/**
 * Each Execution Context contains:
 * 
 * 1. Variable Environment (VE):
 *    - Stores 'var' declarations and function declarations.
 *    - Used for hoisting.
 * 
 * 2. Lexical Environment (LE):
 *    - Stores 'let' and 'const' bindings.
 *    - Holds reference to outer environment (scope chain).
 * 
 * 3. This Binding:
 *    - Determined by how function is called.
 *    - Global context: 'this' = window (browser) / global (Node).
 */

// -------------------------------------------------------------------------------------------
// 5. THE CALL STACK
// -------------------------------------------------------------------------------------------

/**
 * JavaScript maintains a Call Stack of Execution Contexts.
 * - When a function is called, its context is PUSHED onto the stack.
 * - When function returns, its context is POPPED from the stack.
 */

function first() {
    console.log("First function - start");
    second();
    console.log("First function - end");
}

function second() {
    console.log("Second function - start");
    third();
    console.log("Second function - end");
}

function third() {
    console.log("Third function");
}

first();

/**
 * CALL STACK EVOLUTION:
 * 
 * [Global]                          <- Start
 * [Global, first]                   <- first() called
 * [Global, first, second]           <- second() called
 * [Global, first, second, third]    <- third() called
 * [Global, first, second]           <- third() returns
 * [Global, first]                   <- second() returns
 * [Global]                          <- first() returns
 */

// -------------------------------------------------------------------------------------------
// 6. DETAILED EXAMPLE OF BOTH PHASES
// -------------------------------------------------------------------------------------------

var globalName = "Global";

function outer(outerParam) {
    var outerVar = "Outer Variable";
    
    function inner(innerParam) {
        var innerVar = "Inner Variable";
        console.log(globalName, outerParam, outerVar, innerParam, innerVar);
    }
    
    inner("Inner Param");
}

outer("Outer Param");

/**
 * EXECUTION FLOW:
 * 
 * 1. GLOBAL CREATION PHASE:
 *    - globalName: undefined
 *    - outer: [Function]
 *    - this: window/global
 * 
 * 2. GLOBAL EXECUTION PHASE:
 *    - globalName = "Global"
 *    - outer("Outer Param") is called
 * 
 * 3. OUTER CREATION PHASE:
 *    - outerParam: "Outer Param" (from arguments)
 *    - outerVar: undefined
 *    - inner: [Function]
 *    - this: window/global (or undefined in strict mode)
 * 
 * 4. OUTER EXECUTION PHASE:
 *    - outerVar = "Outer Variable"
 *    - inner("Inner Param") is called
 * 
 * 5. INNER CREATION PHASE:
 *    - innerParam: "Inner Param"
 *    - innerVar: undefined
 *    - this: window/global
 * 
 * 6. INNER EXECUTION PHASE:
 *    - innerVar = "Inner Variable"
 *    - console.log() executes
 */

// -------------------------------------------------------------------------------------------
// 7. 'this' BINDING IN EXECUTION CONTEXT
// -------------------------------------------------------------------------------------------

/**
 * 'this' is determined DURING the creation phase based on how 
 * the function is invoked:
 */

const obj = {
    name: "Object",
    method: function() {
        console.log("Method 'this':", this.name); // "Object"
        
        // Regular function - 'this' is global/undefined
        function regular() {
            console.log("Regular 'this':", this); // window or undefined
        }
        
        // Arrow function - inherits 'this' from enclosing context
        const arrow = () => {
            console.log("Arrow 'this':", this.name); // "Object"
        };
        
        regular();
        arrow();
    }
};

obj.method();

// -------------------------------------------------------------------------------------------
// 8. STRICT MODE DIFFERENCES
// -------------------------------------------------------------------------------------------

/**
 * In strict mode:
 * - 'this' in functions is undefined (not global object).
 * - Assigning to undeclared variables throws an error.
 */

function strictDemo() {
    "use strict";
    // console.log(this); // undefined (not window)
    // undeclaredVar = 1; // ReferenceError
}

// -------------------------------------------------------------------------------------------
// SUMMARY & KEY POINTS
// -------------------------------------------------------------------------------------------

/**
 * 1. Every code execution happens inside an Execution Context.
 * 
 * 2. CREATION PHASE:
 *    - Memory is allocated for variables and functions.
 *    - var = undefined, let/const = TDZ, functions = fully hoisted.
 *    - 'this' binding is determined.
 * 
 * 3. EXECUTION PHASE:
 *    - Code runs line by line.
 *    - Variables get their actual values.
 * 
 * 4. Call Stack manages the order of execution contexts.
 * 
 * 5. Each context has: Variable Environment, Lexical Environment, and 'this'.
 */
