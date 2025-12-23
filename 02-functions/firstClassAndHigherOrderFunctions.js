/**
 * TOPIC: FIRST-CLASS & HIGHER-ORDER FUNCTIONS
 * DESCRIPTION:
 * In JavaScript, functions are first-class citizens - they can be
 * assigned to variables, passed as arguments, and returned from
 * other functions. Higher-order functions take or return functions.
 */

// -------------------------------------------------------------------------------------------
// 1. FIRST-CLASS FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Functions can be:
 * - Assigned to variables
 * - Stored in data structures
 * - Passed as arguments
 * - Returned from functions
 * - Have properties
 */

// Assigned to variable
const greet = function(name) {
    return `Hello, ${name}!`;
};

// Stored in array
const operations = [
    (a, b) => a + b,
    (a, b) => a - b,
    (a, b) => a * b
];

console.log(operations[0](5, 3)); // 8

// Stored in object
const calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
};

// Functions have properties
greet.description = "A greeting function";
console.log(greet.name);        // "greet"
console.log(greet.length);      // 1 (number of parameters)

// -------------------------------------------------------------------------------------------
// 2. HIGHER-ORDER FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Higher-order functions either:
 * - Take one or more functions as arguments, OR
 * - Return a function
 */

// Takes function as argument
function repeat(n, action) {
    for (let i = 0; i < n; i++) {
        action(i);
    }
}

repeat(3, console.log); // 0, 1, 2

// Returns a function
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15

// -------------------------------------------------------------------------------------------
// 3. BUILT-IN HIGHER-ORDER FUNCTIONS
// -------------------------------------------------------------------------------------------

const numbers = [1, 2, 3, 4, 5];

// map - transform each element
const doubled = numbers.map(n => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - select elements
const evens = numbers.filter(n => n % 2 === 0);
console.log(evens); // [2, 4]

// reduce - accumulate to single value
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum); // 15

// find - first matching element
const firstEven = numbers.find(n => n % 2 === 0);
console.log(firstEven); // 2

// every - all elements match?
const allPositive = numbers.every(n => n > 0);
console.log(allPositive); // true

// some - any element matches?
const hasEven = numbers.some(n => n % 2 === 0);
console.log(hasEven); // true

// forEach - iterate (no return value)
numbers.forEach((n, i) => console.log(`Index ${i}: ${n}`));

// sort - with comparison function
const sorted = [...numbers].sort((a, b) => b - a);
console.log(sorted); // [5, 4, 3, 2, 1]

// -------------------------------------------------------------------------------------------
// 4. FUNCTION COMPOSITION
// -------------------------------------------------------------------------------------------

/**
 * Combining simple functions to build complex operations.
 */

const addOne = x => x + 1;
const square = x => x * x;
const negate = x => -x;

// Manual composition
const result = negate(square(addOne(2))); // -(((2+1)^2)) = -9
console.log(result);

// Compose function (right to left)
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const transform = compose(negate, square, addOne);
console.log(transform(2)); // -9

// Pipe function (left to right)
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const pipeline = pipe(addOne, square, negate);
console.log(pipeline(2)); // -9

// -------------------------------------------------------------------------------------------
// 5. CALLBACKS
// -------------------------------------------------------------------------------------------

/**
 * Functions passed to be called later.
 */

function fetchData(callback) {
    setTimeout(() => {
        callback({ data: "Sample data" });
    }, 100);
}

fetchData((result) => {
    console.log("Received:", result.data);
});

// Callback with error handling pattern
function readFile(path, callback) {
    setTimeout(() => {
        if (path === "error") {
            callback(new Error("File not found"), null);
        } else {
            callback(null, "File contents");
        }
    }, 100);
}

readFile("test.txt", (error, data) => {
    if (error) console.error(error.message);
    else console.log(data);
});

// -------------------------------------------------------------------------------------------
// 6. FACTORY FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Functions that return other functions or objects.
 */

function createLogger(prefix) {
    return function(message) {
        console.log(`[${prefix}] ${message}`);
    };
}

const infoLogger = createLogger("INFO");
const errorLogger = createLogger("ERROR");

infoLogger("Application started");   // [INFO] Application started
errorLogger("Something went wrong"); // [ERROR] Something went wrong

// -------------------------------------------------------------------------------------------
// 7. FUNCTION DECORATORS
// -------------------------------------------------------------------------------------------

/**
 * Wrap functions to add behavior.
 */

function withLogging(fn) {
    return function(...args) {
        console.log(`Calling ${fn.name} with:`, args);
        const result = fn.apply(this, args);
        console.log(`Result:`, result);
        return result;
    };
}

function add(a, b) {
    return a + b;
}

const loggedAdd = withLogging(add);
loggedAdd(2, 3);
// Calling add with: [2, 3]
// Result: 5

// -------------------------------------------------------------------------------------------
// 8. PREDICATES
// -------------------------------------------------------------------------------------------

/**
 * Functions that return boolean - used with filter, find, etc.
 */

const isEven = n => n % 2 === 0;
const isPositive = n => n > 0;
const isAdult = person => person.age >= 18;

// Combine predicates
const and = (pred1, pred2) => x => pred1(x) && pred2(x);
const or = (pred1, pred2) => x => pred1(x) || pred2(x);
const not = pred => x => !pred(x);

const isOdd = not(isEven);
const isEvenAndPositive = and(isEven, isPositive);

console.log([1, 2, 3, 4, -2].filter(isEvenAndPositive)); // [2, 4]

// -------------------------------------------------------------------------------------------
// 9. REAL-WORLD PATTERNS
// -------------------------------------------------------------------------------------------

// Event handler factory
function createClickHandler(message) {
    return function(event) {
        console.log(message, event.target);
    };
}

// Validation builder
function createValidator(rules) {
    return function(value) {
        return rules.every(rule => rule(value));
    };
}

const isValidPassword = createValidator([
    pwd => pwd.length >= 8,
    pwd => /[A-Z]/.test(pwd),
    pwd => /[0-9]/.test(pwd)
]);

console.log(isValidPassword("Test1234")); // true
console.log(isValidPassword("weak"));      // false

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * FIRST-CLASS FUNCTIONS:
 * - Treated like any other value
 * - Can be variables, arguments, return values
 * - Have properties (name, length)
 * 
 * HIGHER-ORDER FUNCTIONS:
 * - Take functions as arguments (map, filter, reduce)
 * - Return functions (factories, decorators)
 * 
 * BENEFITS:
 * - Abstraction and code reuse
 * - Composition of simple functions
 * - Declarative programming style
 * - Powerful patterns (decorators, factories, predicates)
 */
