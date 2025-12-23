/**
 * TOPIC: FUNCTION COMPOSITION & CURRYING
 * DESCRIPTION:
 * Function composition combines simple functions to build complex ones.
 * Currying transforms a function with multiple arguments into a sequence
 * of functions, each taking a single argument.
 */

// -------------------------------------------------------------------------------------------
// 1. FUNCTION COMPOSITION BASICS
// -------------------------------------------------------------------------------------------

/**
 * Composition: Combine functions so output of one is input to next.
 * f(g(x)) - apply g, then apply f to the result
 */

const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

// Manual composition
const manualResult = square(double(addOne(2))); // ((2+1)*2)^2 = 36
console.log("Manual:", manualResult);

// Compose function (right-to-left execution)
const compose = (...fns) => x => 
    fns.reduceRight((acc, fn) => fn(acc), x);

const composed = compose(square, double, addOne);
console.log("Composed:", composed(2)); // 36

// Pipe function (left-to-right execution)
const pipe = (...fns) => x =>
    fns.reduce((acc, fn) => fn(acc), x);

const piped = pipe(addOne, double, square);
console.log("Piped:", piped(2)); // 36

// -------------------------------------------------------------------------------------------
// 2. CURRYING BASICS
// -------------------------------------------------------------------------------------------

/**
 * Currying: Transform function(a, b, c) into function(a)(b)(c)
 */

// Non-curried
function add(a, b, c) {
    return a + b + c;
}

// Manually curried
function curriedAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

console.log(curriedAdd(1)(2)(3)); // 6

// Arrow function syntax
const curriedAddArrow = a => b => c => a + b + c;
console.log(curriedAddArrow(1)(2)(3)); // 6

// -------------------------------------------------------------------------------------------
// 3. CURRY UTILITY FUNCTION
// -------------------------------------------------------------------------------------------

function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...nextArgs) {
            return curried.apply(this, args.concat(nextArgs));
        };
    };
}

function multiply(a, b, c) {
    return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4));     // 24
console.log(curriedMultiply(2, 3)(4));     // 24
console.log(curriedMultiply(2)(3, 4));     // 24
console.log(curriedMultiply(2, 3, 4));     // 24

// -------------------------------------------------------------------------------------------
// 4. PRACTICAL CURRYING EXAMPLES
// -------------------------------------------------------------------------------------------

// Configurable formatter
const formatCurrency = curry((symbol, decimals, amount) => 
    `${symbol}${amount.toFixed(decimals)}`
);

const formatUSD = formatCurrency('$')(2);
const formatEUR = formatCurrency('€')(2);
const formatBTC = formatCurrency('₿')(8);

console.log(formatUSD(99.99));   // "$99.99"
console.log(formatEUR(149.5));   // "€149.50"
console.log(formatBTC(0.00123)); // "₿0.00123000"

// Logging with levels
const log = curry((level, timestamp, message) => 
    console.log(`[${level}] ${timestamp}: ${message}`)
);

const info = log('INFO');
const error = log('ERROR');

const now = new Date().toISOString();
info(now)('Application started');
error(now)('Something went wrong');

// -------------------------------------------------------------------------------------------
// 5. COMPOSING CURRIED FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Curried functions are perfect for composition.
 * Each function takes a single value and returns a single value.
 */

const map = curry((fn, arr) => arr.map(fn));
const filter = curry((predicate, arr) => arr.filter(predicate));
const prop = curry((key, obj) => obj[key]);

const users = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 17 },
    { name: 'Charlie', age: 30 }
];

// Compose a pipeline
const getAdultNames = pipe(
    filter(user => user.age >= 18),
    map(prop('name'))
);

console.log(getAdultNames(users)); // ['Alice', 'Charlie']

// -------------------------------------------------------------------------------------------
// 6. POINT-FREE STYLE
// -------------------------------------------------------------------------------------------

/**
 * Point-free: Function definitions that don't mention the data.
 * Made possible by currying and composition.
 */

// Not point-free
const squareNumbers = (numbers) => numbers.map(x => x * x);

// Point-free
const squareAll = map(x => x * x);

// More examples
const isEven = x => x % 2 === 0;
const getEvens = filter(isEven);

const getUserNames = map(prop('name'));

// Compose point-free functions
const getEvenUserAges = pipe(
    map(prop('age')),
    filter(isEven)
);

console.log(getEvenUserAges(users)); // [30]

// -------------------------------------------------------------------------------------------
// 7. FLIP AND PLACEHOLDER
// -------------------------------------------------------------------------------------------

// Flip - reverse argument order
const flip = fn => curry((a, b) => fn(b, a));

const divide = curry((a, b) => a / b);
const divideBy = flip(divide);

console.log(divide(10)(2));   // 5 (10 / 2)
console.log(divideBy(2)(10)); // 5 (10 / 2)

// Useful for composition
const halved = map(divideBy(2));
console.log(halved([10, 20, 30])); // [5, 10, 15]

// -------------------------------------------------------------------------------------------
// 8. ADVANCED COMPOSITION PATTERNS
// -------------------------------------------------------------------------------------------

// Compose async functions
const composeAsync = (...fns) => x =>
    fns.reduceRight((acc, fn) => acc.then(fn), Promise.resolve(x));

const addAsync = x => Promise.resolve(x + 1);
const doubleAsync = x => Promise.resolve(x * 2);

const asyncPipeline = composeAsync(doubleAsync, addAsync);
asyncPipeline(5).then(console.log); // 12

// Compose with error handling
const composeWithTry = (...fns) => x => {
    try {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    } catch (e) {
        return { error: e.message };
    }
};

// -------------------------------------------------------------------------------------------
// 9. COMMON CURRIED UTILITIES
// -------------------------------------------------------------------------------------------

const add2 = curry((a, b) => a + b);
const subtract = curry((a, b) => a - b);
const multiply2 = curry((a, b) => a * b);
const divBy = curry((divisor, num) => num / divisor);

const concat = curry((a, b) => a.concat(b));
const split = curry((sep, str) => str.split(sep));
const join = curry((sep, arr) => arr.join(sep));
const toLowerCase = str => str.toLowerCase();
const trim = str => str.trim();

// Build a slug generator
const slugify = pipe(
    toLowerCase,
    trim,
    split(' '),
    join('-')
);

console.log(slugify('  Hello World  ')); // "hello-world"

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * COMPOSITION:
 * - compose: Right-to-left (f(g(x)))
 * - pipe: Left-to-right (g then f)
 * - Build complex from simple functions
 * 
 * CURRYING:
 * - Transform f(a,b,c) to f(a)(b)(c)
 * - Partial application becomes natural
 * - Perfect for creating specialized functions
 * 
 * POINT-FREE:
 * - Define functions without mentioning data
 * - Cleaner, more declarative code
 * - Enabled by currying
 * 
 * BENEFITS:
 * - Reusable, focused functions
 * - Easy to test individual pieces
 * - Declarative code style
 * - Flexible function building
 */
