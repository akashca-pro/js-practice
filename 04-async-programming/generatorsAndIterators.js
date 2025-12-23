/**
 * TOPIC: GENERATOR FUNCTIONS & ITERATORS
 * DESCRIPTION:
 * Generators are functions that can pause and resume execution.
 * They implement the Iterator protocol, enabling lazy evaluation
 * and custom iteration patterns.
 */

// -------------------------------------------------------------------------------------------
// 1. ITERATOR PROTOCOL
// -------------------------------------------------------------------------------------------

/**
 * An iterator is an object with a next() method that returns:
 * { value: <any>, done: <boolean> }
 * 
 * When done is true, iteration is complete.
 */

// Manual iterator implementation
function createArrayIterator(arr) {
    let index = 0;
    
    return {
        next() {
            if (index < arr.length) {
                return { value: arr[index++], done: false };
            } else {
                return { value: undefined, done: true };
            }
        }
    };
}

const iterator = createArrayIterator([1, 2, 3]);
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }

// -------------------------------------------------------------------------------------------
// 2. ITERABLE PROTOCOL
// -------------------------------------------------------------------------------------------

/**
 * An iterable is an object with a [Symbol.iterator]() method
 * that returns an iterator.
 * 
 * Arrays, Strings, Maps, Sets are all built-in iterables.
 */

const myIterable = {
    data: ['a', 'b', 'c'],
    
    [Symbol.iterator]() {
        let index = 0;
        const data = this.data;
        
        return {
            next() {
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

// Can use for...of on iterables
for (const item of myIterable) {
    console.log(item); // 'a', 'b', 'c'
}

// Can spread iterables
console.log([...myIterable]); // ['a', 'b', 'c']

// -------------------------------------------------------------------------------------------
// 3. GENERATOR FUNCTIONS BASICS
// -------------------------------------------------------------------------------------------

/**
 * Generator functions use function* syntax.
 * - yield pauses execution and returns a value.
 * - Calling the function returns a generator object (iterator).
 */

function* simpleGenerator() {
    console.log("Start");
    yield 1;
    console.log("After 1");
    yield 2;
    console.log("After 2");
    yield 3;
    console.log("End");
}

const gen = simpleGenerator();
console.log(gen.next()); // "Start" then { value: 1, done: false }
console.log(gen.next()); // "After 1" then { value: 2, done: false }
console.log(gen.next()); // "After 2" then { value: 3, done: false }
console.log(gen.next()); // "End" then { value: undefined, done: true }

// -------------------------------------------------------------------------------------------
// 4. GENERATORS ARE ITERABLES
// -------------------------------------------------------------------------------------------

/**
 * Generator objects implement both Iterator and Iterable protocols.
 */

function* countTo(n) {
    for (let i = 1; i <= n; i++) {
        yield i;
    }
}

// Using for...of
for (const num of countTo(5)) {
    console.log(num); // 1, 2, 3, 4, 5
}

// Using spread
console.log([...countTo(3)]); // [1, 2, 3]

// Using destructuring
const [first, second] = countTo(10);
console.log(first, second); // 1, 2

// -------------------------------------------------------------------------------------------
// 5. PASSING VALUES INTO GENERATORS
// -------------------------------------------------------------------------------------------

/**
 * You can send values INTO a generator using next(value).
 * The value becomes the result of the yield expression.
 */

function* twoWayGenerator() {
    const a = yield "First yield";
    console.log("Received:", a);
    
    const b = yield "Second yield";
    console.log("Received:", b);
    
    return "Done";
}

const twoWay = twoWayGenerator();
console.log(twoWay.next());        // { value: "First yield", done: false }
console.log(twoWay.next("Hello")); // "Received: Hello", { value: "Second yield", done: false }
console.log(twoWay.next("World")); // "Received: World", { value: "Done", done: true }

// -------------------------------------------------------------------------------------------
// 6. YIELD* (DELEGATION)
// -------------------------------------------------------------------------------------------

/**
 * yield* delegates to another iterable or generator.
 * Values are yielded one at a time from the inner iterable.
 */

function* innerGenerator() {
    yield 'a';
    yield 'b';
}

function* outerGenerator() {
    yield 1;
    yield* innerGenerator(); // Delegate to inner
    yield* [2, 3];           // Delegate to array
    yield 4;
}

console.log([...outerGenerator()]); // [1, 'a', 'b', 2, 3, 4]

// -------------------------------------------------------------------------------------------
// 7. GENERATOR RETURN AND THROW
// -------------------------------------------------------------------------------------------

/**
 * generator.return(value): Forces completion with returned value.
 * generator.throw(error): Throws inside the generator at yield.
 */

function* controllableGenerator() {
    try {
        yield 1;
        yield 2;
        yield 3;
    } catch (e) {
        console.log("Caught:", e.message);
    } finally {
        console.log("Cleanup");
    }
}

const ctrl = controllableGenerator();
console.log(ctrl.next());           // { value: 1, done: false }
console.log(ctrl.throw(new Error("Stop!"))); // "Caught: Stop!", "Cleanup", { value: undefined, done: true }

const ctrl2 = controllableGenerator();
console.log(ctrl2.next());          // { value: 1, done: false }
console.log(ctrl2.return("Early")); // "Cleanup", { value: "Early", done: true }

// -------------------------------------------------------------------------------------------
// 8. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * PATTERN 1: Infinite Sequences
 */
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const infinite = infiniteSequence();
console.log(infinite.next().value); // 0
console.log(infinite.next().value); // 1
// Can continue forever...

/**
 * PATTERN 2: ID Generator
 */
function* idGenerator(prefix = 'id') {
    let id = 1;
    while (true) {
        yield `${prefix}_${id++}`;
    }
}

const userIds = idGenerator('user');
console.log(userIds.next().value); // "user_1"
console.log(userIds.next().value); // "user_2"

/**
 * PATTERN 3: Range Function
 */
function* range(start, end, step = 1) {
    for (let i = start; i < end; i += step) {
        yield i;
    }
}

console.log([...range(0, 10, 2)]); // [0, 2, 4, 6, 8]

/**
 * PATTERN 4: Lazy Map/Filter
 */
function* lazyMap(iterable, fn) {
    for (const item of iterable) {
        yield fn(item);
    }
}

function* lazyFilter(iterable, predicate) {
    for (const item of iterable) {
        if (predicate(item)) yield item;
    }
}

// Compose lazy operations - only processes what's needed
const squared = lazyMap(range(1, 100), x => x * x);
const filtered = lazyFilter(squared, x => x > 50);

for (const x of filtered) {
    if (x > 100) break; // Stops processing early
    console.log(x); // 64, 81
}

/**
 * PATTERN 5: State Machine
 */
function* trafficLight() {
    while (true) {
        yield "Green";
        yield "Yellow";
        yield "Red";
    }
}

const light = trafficLight();
console.log(light.next().value); // "Green"
console.log(light.next().value); // "Yellow"
console.log(light.next().value); // "Red"
console.log(light.next().value); // "Green" (cycles)

// -------------------------------------------------------------------------------------------
// 9. GENERATORS VS ARRAYS
// -------------------------------------------------------------------------------------------

/**
 * GENERATORS:
 * - Lazy evaluation (compute on demand)
 * - Memory efficient for large sequences
 * - Can represent infinite sequences
 * - Single iteration (can't go back)
 * 
 * ARRAYS:
 * - Eager evaluation (all at once)
 * - All values in memory
 * - Fixed, finite length
 * - Random access, multiple iterations
 */

// -------------------------------------------------------------------------------------------
// SUMMARY & KEY POINTS
// -------------------------------------------------------------------------------------------

/**
 * 1. Iterators: Objects with next() returning {value, done}.
 * 2. Iterables: Objects with [Symbol.iterator]() returning an iterator.
 * 3. Generators: Functions using function* and yield.
 * 4. yield pauses; next() resumes.
 * 5. yield* delegates to another iterable.
 * 6. next(value) passes values INTO the generator.
 * 7. return(value) and throw(error) control the generator.
 * 8. Perfect for lazy evaluation and infinite sequences.
 */
