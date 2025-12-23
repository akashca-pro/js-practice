/**
 * TOPIC: PARTIAL APPLICATION
 * DESCRIPTION:
 * Partial application is fixing some arguments of a function,
 * producing another function with fewer arguments.
 * Different from currying which always takes one argument at a time.
 */

// -------------------------------------------------------------------------------------------
// 1. PARTIAL APPLICATION BASICS
// -------------------------------------------------------------------------------------------

/**
 * Partial application: Pre-fill some arguments, return new function
 * waiting for the rest.
 */

function greet(greeting, name, punctuation) {
    return `${greeting}, ${name}${punctuation}`;
}

// Create partially applied functions
const sayHello = greet.bind(null, "Hello");
const sayHelloExcited = greet.bind(null, "Hello", "World");

console.log(sayHello("Alice", "!"));      // "Hello, Alice!"
console.log(sayHelloExcited("!!!"));      // "Hello, World!!!"

// -------------------------------------------------------------------------------------------
// 2. PARTIAL UTILITY FUNCTION
// -------------------------------------------------------------------------------------------

function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

const multiply = (a, b, c) => a * b * c;

const multiplyBy2 = partial(multiply, 2);
const multiplyBy2And3 = partial(multiply, 2, 3);

console.log(multiplyBy2(3, 4));    // 24 (2 * 3 * 4)
console.log(multiplyBy2And3(4));   // 24 (2 * 3 * 4)

// -------------------------------------------------------------------------------------------
// 3. PARTIAL RIGHT (Apply from the right)
// -------------------------------------------------------------------------------------------

function partialRight(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...laterArgs, ...presetArgs);
    };
}

const divide = (a, b) => a / b;

const divideBy2 = partialRight(divide, 2);
const divideInto10 = partial(divide, 10);

console.log(divideBy2(10));    // 5 (10 / 2)
console.log(divideInto10(2));  // 5 (10 / 2)

// -------------------------------------------------------------------------------------------
// 4. PLACEHOLDER PARTIAL APPLICATION
// -------------------------------------------------------------------------------------------

/**
 * Use placeholders to skip arguments.
 */

const _ = Symbol('placeholder');

function partialWithPlaceholder(fn, ...presetArgs) {
    return function(...laterArgs) {
        const args = presetArgs.map(arg => 
            arg === _ ? laterArgs.shift() : arg
        );
        return fn(...args, ...laterArgs);
    };
}

const format = (prefix, value, suffix) => `${prefix}${value}${suffix}`;

const htmlTag = partialWithPlaceholder(format, '<', _, '>');
console.log(htmlTag('h1'));  // "<h1>"

const money = partialWithPlaceholder(format, '$', _, '.00');
console.log(money(99));      // "$99.00"

// -------------------------------------------------------------------------------------------
// 5. CURRYING VS PARTIAL APPLICATION
// -------------------------------------------------------------------------------------------

/**
 * CURRYING:
 * - Transforms f(a,b,c) to f(a)(b)(c)
 * - Always one argument at a time
 * - Returns functions until all args received
 * 
 * PARTIAL APPLICATION:
 * - Fixes some arguments, returns function for rest
 * - Can fix any number of arguments at once
 * - One step of reduction
 */

// Curried
const curriedAdd = a => b => c => a + b + c;
const add1 = curriedAdd(1);     // Needs (b)(c)
const add1And2 = add1(2);       // Needs (c)
console.log(add1And2(3));       // 6

// Partially applied
const addThree = (a, b, c) => a + b + c;
const add1Partial = partial(addThree, 1);            // Needs (b, c)
const add1And2Partial = partial(addThree, 1, 2);     // Needs (c)
console.log(add1And2Partial(3));  // 6

// -------------------------------------------------------------------------------------------
// 6. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// API request builder
function request(method, baseURL, endpoint, data) {
    console.log(`${method} ${baseURL}${endpoint}`, data);
    // return fetch(...)
}

const apiRequest = partial(request, 'GET', 'https://api.example.com');
const getUsers = partial(apiRequest, '/users');
const getPosts = partial(apiRequest, '/posts');

getUsers(null);           // GET https://api.example.com/users null
getPosts({ limit: 10 });  // GET https://api.example.com/posts {limit: 10}

// Event handlers
function handleEvent(eventType, handler, element) {
    element.addEventListener(eventType, handler);
}

const onClick = partial(handleEvent, 'click');
const onSubmit = partial(handleEvent, 'submit');

// onClick(myHandler, buttonElement);
// onSubmit(formHandler, formElement);

// String formatting
function template(strings, ...keys) {
    return function(data) {
        return strings.reduce((result, str, i) => {
            const key = keys[i - 1];
            const value = key ? data[key] : '';
            return result + value + str;
        });
    };
}

// -------------------------------------------------------------------------------------------
// 7. USING BIND FOR PARTIAL APPLICATION
// -------------------------------------------------------------------------------------------

/**
 * Function.prototype.bind is built-in partial application.
 */

function log(level, timestamp, message) {
    console.log(`[${level}] ${timestamp}: ${message}`);
}

const now = () => new Date().toISOString();

const logInfo = log.bind(null, 'INFO');
const logError = log.bind(null, 'ERROR');
const logInfoNow = log.bind(null, 'INFO', now());

logInfo(now(), 'Server started');
logError(now(), 'Connection failed');

// With context
const obj = {
    multiplier: 2,
    multiply(a, b) {
        return a * b * this.multiplier;
    }
};

const multiplyWithContext = obj.multiply.bind(obj, 3);
console.log(multiplyWithContext(4)); // 24 (3 * 4 * 2)

// -------------------------------------------------------------------------------------------
// 8. PARTIAL APPLICATION WITH ASYNC
// -------------------------------------------------------------------------------------------

async function fetchData(baseURL, endpoint, options) {
    // const response = await fetch(baseURL + endpoint, options);
    // return response.json();
    return { url: baseURL + endpoint, options };
}

const fetchFromAPI = partial(fetchData, 'https://api.example.com');
const fetchUsers = partial(fetchFromAPI, '/users');

// fetchUsers({ headers: { auth: 'token' } });

// -------------------------------------------------------------------------------------------
// 9. COMPOSITION WITH PARTIAL APPLICATION
// -------------------------------------------------------------------------------------------

const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

const map = (fn, arr) => arr.map(fn);
const filter = (pred, arr) => arr.filter(pred);
const sort = (compareFn, arr) => [...arr].sort(compareFn);

const mapWith = fn => arr => map(fn, arr);
const filterWith = pred => arr => filter(pred, arr);
const sortBy = compareFn => arr => sort(compareFn, arr);

const processNumbers = pipe(
    filterWith(n => n > 0),
    mapWith(n => n * 2),
    sortBy((a, b) => b - a)
);

console.log(processNumbers([-1, 3, 1, -2, 2])); // [6, 4, 2]

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * PARTIAL APPLICATION:
 * - Fix some arguments of a function
 * - Returns new function for remaining arguments
 * - Use bind(), custom partial(), or closures
 * 
 * VS CURRYING:
 * - Currying: one arg at a time, chain of unary functions
 * - Partial: any number of args, one step
 * 
 * USE CASES:
 * - Configuration (API base URLs, log levels)
 * - Event handlers (pre-filled event types)
 * - Factory functions with defaults
 * - Building specialized functions
 */
