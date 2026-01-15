/**
 * TOPIC: VARIABLE SHADOWING
 * DESCRIPTION:
 * Variable shadowing occurs when a variable declared in an inner scope
 * has the same name as a variable in an outer scope, effectively "hiding"
 * or "shadowing" the outer variable within that inner scope.
 */

// -------------------------------------------------------------------------------------------
// 1. WHAT IS VARIABLE SHADOWING?
// -------------------------------------------------------------------------------------------

/**
 * Shadowing happens when:
 * - You declare a variable in an inner scope.
 * - It has the same name as a variable in an outer scope.
 * - The inner declaration "shadows" (hides) the outer one within that scope.
 * 
 * The outer variable is NOT modified or deleted - it's just inaccessible
 * in the inner scope because the inner variable takes precedence.
 */

let message = "Hello from outer scope";

function greet() {
    let message = "Hello from inner scope"; // Shadows the outer 'message'
    console.log(message); // "Hello from inner scope"
}

greet();
console.log(message); // "Hello from outer scope" (unchanged)

// -------------------------------------------------------------------------------------------
// 2. SHADOWING WITH DIFFERENT DECLARATION TYPES
// -------------------------------------------------------------------------------------------

/**
 * Variables declared with var, let, and const can all shadow each other,
 * but there are some rules about what can shadow what.
 */

// 2.1 let shadowing let (ALLOWED)
let count = 10;
{
    let count = 20; // Shadows outer 'count'
    console.log("Inner count:", count); // 20
}
console.log("Outer count:", count); // 10

// 2.2 const shadowing let (ALLOWED)
let name = "John";
{
    const name = "Jane"; // Shadows outer 'name'
    console.log("Inner name:", name); // "Jane"
}
console.log("Outer name:", name); // "John"

// 2.3 let shadowing var (ALLOWED)
var globalVar = "I am var";
{
    let globalVar = "I am let"; // Shadows the var
    console.log("Inner:", globalVar); // "I am let"
}
console.log("Outer:", globalVar); // "I am var"

// 2.4 var shadowing let (ILLEGAL SHADOWING - in same scope context)
/**
 * ILLEGAL SHADOWING:
 * A var CANNOT shadow a let/const in the same function scope if they
 * would end up in the same scope due to var's function-scoping.
 */

// This will cause an error:
// let value = 1;
// {
//     var value = 2; // SyntaxError: Identifier 'value' has already been declared
// }

// However, this is valid (var in a function creates new scope):
let value = 1;
function shadowWithVar() {
    var value = 2; // Different function scope - OK
    console.log("Function value:", value); // 2
}
shadowWithVar();
console.log("Outer value:", value); // 1

// -------------------------------------------------------------------------------------------
// 3. SHADOWING IN NESTED FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Each function creates its own scope, allowing multiple levels of shadowing.
 */

let level = "Global";

function outer() {
    let level = "Outer function";
    
    function middle() {
        let level = "Middle function";
        
        function inner() {
            let level = "Inner function";
            console.log(level); // "Inner function"
        }
        
        inner();
        console.log(level); // "Middle function"
    }
    
    middle();
    console.log(level); // "Outer function"
}

outer();
console.log(level); // "Global"

// -------------------------------------------------------------------------------------------
// 4. SHADOWING IN BLOCK SCOPE
// -------------------------------------------------------------------------------------------

/**
 * With let and const, each block creates a new scope where
 * shadowing can occur.
 */

let x = 1;
console.log("Global x:", x); // 1

{
    let x = 2;
    console.log("Block 1 x:", x); // 2
    
    {
        let x = 3;
        console.log("Block 2 x:", x); // 3
        
        {
            let x = 4;
            console.log("Block 3 x:", x); // 4
        }
    }
}

console.log("Back to global x:", x); // 1

// -------------------------------------------------------------------------------------------
// 5. SHADOWING IN LOOPS
// -------------------------------------------------------------------------------------------

/**
 * Loop variables can shadow outer variables.
 * This is actually very common and useful.
 */

let i = 100;
console.log("Before loop, i:", i); // 100

for (let i = 0; i < 3; i++) {
    console.log("Loop i:", i); // 0, 1, 2
}

console.log("After loop, i:", i); // 100 (unchanged, because loop used let)

// With var, no shadowing occurs (same function scope):
var j = 100;
for (var j = 0; j < 3; j++) {
    // Same 'j' variable
}
console.log("After var loop, j:", j); // 3 (modified!)

// -------------------------------------------------------------------------------------------
// 6. SHADOWING FUNCTION PARAMETERS
// -------------------------------------------------------------------------------------------

/**
 * Parameters act as local variables and can shadow outer variables.
 * Variables declared inside can also shadow parameters.
 */

let user = "Global User";

function processUser(user) { // Parameter shadows global 'user'
    console.log("Parameter user:", user);
    
    // You can even shadow the parameter with a block variable
    {
        let user = "Block User";
        console.log("Block user:", user); // "Block User"
    }
    
    console.log("Still parameter user:", user);
}

processUser("Passed User");
// Output:
// "Parameter user: Passed User"
// "Block user: Block User"
// "Still parameter user: Passed User"

console.log("Global user:", user); // "Global User"

// -------------------------------------------------------------------------------------------
// 7. SHADOWING AND THE TEMPORAL DEAD ZONE (TDZ)
// -------------------------------------------------------------------------------------------

/**
 * When let/const shadow an outer variable, the inner variable
 * exists in the TDZ until its declaration is reached.
 * 
 * This proves that shadowing variables are hoisted but not initialized.
 */

let outer = "Outer";

function tdzExample() {
    // If inner 'outer' wasn't hoisted, this would print "Outer"
    // Instead, it throws ReferenceError because inner 'outer' is in TDZ
    
    // console.log(outer); // ReferenceError: Cannot access 'outer' before initialization
    
    let outer = "Inner"; // Declaration here ends the TDZ
    console.log(outer); // "Inner"
}

tdzExample();
console.log(outer); // "Outer" (global unchanged)

// -------------------------------------------------------------------------------------------
// 8. SHADOWING VS REASSIGNMENT
// -------------------------------------------------------------------------------------------

/**
 * Shadowing creates a NEW variable.
 * Reassignment modifies the EXISTING variable.
 * 
 * This is a critical distinction!
 */

// Reassignment (modifies the same variable):
let score = 100;
{
    score = 200; // Reassignment - changes the outer variable
}
console.log("score after reassignment:", score); // 200

// Shadowing (creates a new variable):
let points = 100;
{
    let points = 200; // Shadowing - creates new variable
}
console.log("points after shadowing:", points); // 100

// -------------------------------------------------------------------------------------------
// 9. SHADOWING CLASSES AND FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * You can shadow class and function declarations too.
 */

class Animal {
    speak() {
        return "Generic animal sound";
    }
}

{
    class Animal {
        speak() {
            return "Shadowed animal sound";
        }
    }
    
    const a = new Animal();
    console.log(a.speak()); // "Shadowed animal sound"
}

const animal = new Animal();
console.log(animal.speak()); // "Generic animal sound" (outer class)

// Function shadowing
function calculate() {
    return 42;
}

{
    function calculate() {
        return 100;
    }
    console.log(calculate()); // 100
}

console.log(calculate()); // 42 (Note: behavior may vary in strict mode)

// -------------------------------------------------------------------------------------------
// 10. CLOSURE AND SHADOWING
// -------------------------------------------------------------------------------------------

/**
 * Closures capture the variable from their lexical scope.
 * Shadowing affects which variable the closure sees.
 */

let counter = 0;

function createCounter() {
    let counter = 10; // Shadows global counter
    
    return function increment() {
        counter++; // References the local 'counter', not global
        console.log(counter);
    };
}

const inc = createCounter();
inc(); // 11
inc(); // 12
inc(); // 13

console.log("Global counter:", counter); // 0 (unchanged)

// -------------------------------------------------------------------------------------------
// 11. COMMON PITFALLS
// -------------------------------------------------------------------------------------------

/**
 * PITFALL 1: Accidental shadowing
 * You might unintentionally shadow a variable you meant to use.
 */

let data = { important: true };

function process() {
    let data = [1, 2, 3]; // Oops! Accidentally shadowed
    // Now you can't access the outer 'data' object
    console.log(data); // [1, 2, 3] - not the object!
}

process();

/**
 * PITFALL 2: Assuming modification when shadowing
 */

let config = { debug: true };

function setup() {
    let config = { debug: false }; // This creates a new variable!
    // The global config is unchanged
}

setup();
console.log(config.debug); // true (unchanged!)

// To actually modify, don't use let:
function setupCorrect() {
    config = { debug: false }; // Reassignment - modifies outer
    // OR: config.debug = false; // Modify property
}

setupCorrect();
console.log(config.debug); // false (now changed)

// -------------------------------------------------------------------------------------------
// 12. ACCESSING SHADOWED GLOBAL VARIABLES
// -------------------------------------------------------------------------------------------

/**
 * In browsers, you can still access global variables through the window object.
 * This is a way to bypass shadowing for global scope.
 */

// In browser environment:
var browserGlobal = "I'm global";

function accessGlobal() {
    var browserGlobal = "I'm local";
    console.log(browserGlobal); // "I'm local"
    // console.log(window.browserGlobal); // "I'm global" (in browser)
}

// In Node.js, you can use global:
// global.myGlobal = "I'm global";
// function accessGlobal() {
//     let myGlobal = "I'm local";
//     console.log(global.myGlobal); // Still accessible
// }

// -------------------------------------------------------------------------------------------
// SHADOWING RULES SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * | Outer Variable | Inner Variable | Allowed?                    |
 * |----------------|----------------|------------------------------|
 * | var            | var            | Yes (same variable if same scope) |
 * | var            | let            | Yes                          |
 * | var            | const          | Yes                          |
 * | let            | var            | No (if block is in same function scope) |
 * | let            | let            | Yes                          |
 * | let            | const          | Yes                          |
 * | const          | var            | No (if block is in same function scope) |
 * | const          | let            | Yes                          |
 * | const          | const          | Yes                          |
 */

// -------------------------------------------------------------------------------------------
// BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. AVOID UNINTENTIONAL SHADOWING:
 *    Use descriptive variable names to avoid accidentally shadowing.
 * 
 * 2. USE LINTER RULES:
 *    Enable the 'no-shadow' ESLint rule to catch accidental shadowing.
 * 
 * 3. INTENTIONAL SHADOWING:
 *    When intentional (like in loops), it's a valid pattern.
 *    Loop counters (i, j, k) commonly shadow safely.
 * 
 * 4. PREFER let/const:
 *    Block-scoping makes shadowing behavior more predictable.
 * 
 * 5. BE CAREFUL WITH CLOSURES:
 *    Understand which variable your closure captures.
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * 1. Shadowing = inner variable hides outer variable with same name.
 * 2. The outer variable is NOT modified, just inaccessible in inner scope.
 * 3. let/const create block scope, allowing fine-grained shadowing.
 * 4. var can't shadow let/const in the same function scope (illegal shadowing).
 * 5. Shadowing variables are hoisted (TDZ applies for let/const).
 * 6. Closures capture the variable from their defining scope.
 * 7. Use descriptive names to avoid accidental shadowing.
 */
