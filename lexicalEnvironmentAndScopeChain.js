/**
 * TOPIC: LEXICAL ENVIRONMENT & SCOPE CHAIN
 * DESCRIPTION:
 * The Lexical Environment is an internal data structure that holds
 * variable bindings and maintains a reference to the outer environment.
 * The Scope Chain is the chain of these environments used for variable lookup.
 */

// -------------------------------------------------------------------------------------------
// 1. WHAT IS A LEXICAL ENVIRONMENT?
// -------------------------------------------------------------------------------------------

/**
 * Every execution context (global, function, block) has an associated
 * Lexical Environment with two components:
 * 
 * 1. Environment Record: Stores local variables and functions.
 * 2. Outer Reference: Points to the parent lexical environment (or null for global).
 * 
 * "Lexical" means it's determined by WHERE code is written, not where it's called.
 */

const globalVar = "I'm global";

function outer() {
    const outerVar = "I'm in outer";
    
    function inner() {
        const innerVar = "I'm in inner";
        
        // inner's Lexical Environment:
        // - Environment Record: { innerVar: "I'm in inner" }
        // - Outer Reference: -> outer's Lexical Environment
        
        console.log(globalVar); // Found via scope chain
        console.log(outerVar);  // Found in outer's environment
        console.log(innerVar);  // Found in own environment
    }
    
    inner();
}

outer();

// -------------------------------------------------------------------------------------------
// 2. SCOPE CHAIN RESOLUTION
// -------------------------------------------------------------------------------------------

/**
 * When accessing a variable, JS follows the scope chain:
 * 1. Look in current Environment Record.
 * 2. If not found, follow Outer Reference to parent.
 * 3. Repeat until found or reach global (null outer = ReferenceError).
 */

const a = 1;

function level1() {
    const b = 2;
    
    function level2() {
        const c = 3;
        
        function level3() {
            const d = 4;
            
            // Variable lookup chain:
            // 'd' -> Found in level3 (1 step)
            // 'c' -> Not in level3 -> Found in level2 (2 steps)
            // 'b' -> Not in level3 -> Not in level2 -> Found in level1 (3 steps)
            // 'a' -> ... -> Found in global (4 steps)
            
            console.log(a + b + c + d); // 10
        }
        
        level3();
    }
    
    level2();
}

level1();

// -------------------------------------------------------------------------------------------
// 3. BLOCK SCOPE (LET/CONST)
// -------------------------------------------------------------------------------------------

/**
 * 'let' and 'const' create block-scoped variables.
 * Each block {} creates a new Lexical Environment.
 */

function blockScopeDemo() {
    const x = 1;
    
    if (true) {
        const x = 2; // New binding in block's Lexical Environment
        console.log("Inside block:", x); // 2
    }
    
    console.log("Outside block:", x); // 1
}

blockScopeDemo();

// -------------------------------------------------------------------------------------------
// 4. FUNCTION SCOPE (VAR)
// -------------------------------------------------------------------------------------------

/**
 * 'var' is function-scoped, not block-scoped.
 * It's attached to the nearest function's Environment Record.
 */

function varScopeDemo() {
    var y = 1;
    
    if (true) {
        var y = 2; // Same binding! Not a new variable.
        console.log("Inside block:", y); // 2
    }
    
    console.log("Outside block:", y); // 2 (modified)
}

varScopeDemo();

// -------------------------------------------------------------------------------------------
// 5. LEXICAL VS DYNAMIC SCOPE
// -------------------------------------------------------------------------------------------

/**
 * LEXICAL SCOPE (JavaScript uses this):
 * Scope is determined at write-time by location in source code.
 * 
 * DYNAMIC SCOPE (Some languages like Bash):
 * Scope is determined at run-time by the call stack.
 */

const value = "global";

function printValue() {
    console.log(value); // Lexically bound to global 'value'
}

function wrapper() {
    const value = "wrapper local";
    printValue(); // Prints "global" (lexical), NOT "wrapper local" (dynamic)
}

wrapper();

// -------------------------------------------------------------------------------------------
// 6. CLOSURES AND LEXICAL ENVIRONMENT
// -------------------------------------------------------------------------------------------

/**
 * A closure is a function that "remembers" its lexical environment.
 * When a function is created, it captures a reference to its outer environment.
 */

function createMultiplier(factor) {
    // When returned function is created, it captures this environment
    return function(number) {
        return number * factor; // 'factor' accessed via scope chain
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// Each returned function has its own closure with a different 'factor'

// -------------------------------------------------------------------------------------------
// 7. THE TEMPORAL DEAD ZONE (TDZ)
// -------------------------------------------------------------------------------------------

/**
 * Variables declared with 'let' and 'const' exist in TDZ from
 * block start until declaration is reached. Accessing them throws.
 */

function tdzDemo() {
    // console.log(myVar); // ReferenceError: Cannot access before initialization
    
    let myVar = "initialized";
    console.log(myVar); // Works fine
}

// TDZ exists because let/const ARE hoisted (space is reserved),
// but NOT initialized until the declaration line.

// -------------------------------------------------------------------------------------------
// 8. VISUALIZING THE ENVIRONMENT CHAIN
// -------------------------------------------------------------------------------------------

/**
 * Consider this code structure:
 * 
 * Global Environment
 * ├── globalVar: "global"
 * └── outer() Environment (when called)
 *     ├── outerVar: "outer"
 *     └── inner() Environment (when called)
 *         └── innerVar: "inner"
 * 
 * Each environment has an [[OuterEnv]] pointing UP the chain.
 */

// -------------------------------------------------------------------------------------------
// SUMMARY & KEY POINTS
// -------------------------------------------------------------------------------------------

/**
 * 1. Lexical Environment = Environment Record + Outer Reference
 * 2. Scope Chain = Linked list of Lexical Environments
 * 3. Variable Lookup = Walk up the chain until found
 * 4. 'let'/'const' = Block-scoped (new env per block)
 * 5. 'var' = Function-scoped (attached to function env)
 * 6. Closures = Functions capturing their lexical environment
 * 7. TDZ = let/const are hoisted but not initialized
 * 8. Lexical = Static (write-time), not Dynamic (run-time)
 */
