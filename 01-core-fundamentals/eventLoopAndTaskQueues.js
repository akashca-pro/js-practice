/**
 * TOPIC: EVENT LOOP & TASK QUEUES
 * DESCRIPTION:
 * The event loop is the heart of JavaScript's concurrency model.
 * Understanding how tasks, microtasks, and rendering work together
 * is essential for writing performant asynchronous code.
 */

// -------------------------------------------------------------------------------------------
// 1. JAVASCRIPT RUNTIME MODEL
// -------------------------------------------------------------------------------------------

/**
 * Components:
 * 1. Call Stack - Where code executes (LIFO)
 * 2. Heap - Memory allocation
 * 3. Task Queue (Macrotask Queue) - setTimeout, setInterval, I/O
 * 4. Microtask Queue - Promises, queueMicrotask, MutationObserver
 * 5. Event Loop - Coordinates execution
 */

// -------------------------------------------------------------------------------------------
// 2. EXECUTION ORDER
// -------------------------------------------------------------------------------------------

/**
 * Event Loop Order:
 * 1. Execute all synchronous code (call stack)
 * 2. Execute ALL microtasks
 * 3. Execute ONE macrotask
 * 4. Render (if needed)
 * 5. Repeat
 */

console.log('1. Sync');

setTimeout(() => console.log('4. Timeout (macrotask)'), 0);

Promise.resolve().then(() => console.log('3. Promise (microtask)'));

console.log('2. Sync');

// Output: 1. Sync, 2. Sync, 3. Promise, 4. Timeout

// -------------------------------------------------------------------------------------------
// 3. MACROTASKS VS MICROTASKS
// -------------------------------------------------------------------------------------------

// Below is an example for mutaionObserver

// const callback = (mutationList, observer) => {
//   for (const mutation of mutationList) {
//     if (mutation.type === 'childList') {
//       console.log('A child node has been added or removed.');
//     } else if (mutation.type === 'attributes') {
//       console.log(`The ${mutation.attributeName} attribute was modified.`);
//     }
//   }
// };

// const observer = new MutationObserver(callback);
// const targetNode = document.getElementById('my-element');
// const config = { 
//   attributes: true, 
//   childList: true, 
//   subtree: true,
//   attributeOldValue: true 
// };

// observer.observe();
// observer.disconnect();

/**
 * MACROTASKS (Task Queue):
 * - setTimeout, setInterval
 * - setImmediate (Node.js)
 * - I/O operations
 * - UI rendering
 * - requestAnimationFrame
 * 
 * MICROTASKS (Microtask Queue):
 * - Promise callbacks (.then, .catch, .finally)
 * - queueMicrotask()
 * - MutationObserver
 * - process.nextTick (Node.js) - even higher priority
 */

// Microtasks run before next macrotask
setTimeout(() => console.log('Macrotask 1'), 0);
setTimeout(() => console.log('Macrotask 2'), 0);

Promise.resolve().then(() => {
    console.log('Microtask 1');
    Promise.resolve().then(() => console.log('Microtask 2'));
});

// Output: Microtask 1, Microtask 2, Macrotask 1, Macrotask 2

// -------------------------------------------------------------------------------------------
// 4. QUEUEMICROTASK
// -------------------------------------------------------------------------------------------

/**
 * Explicitly queue a microtask.
 */

console.log('Start');

queueMicrotask(() => {
    console.log('Microtask');
});

console.log('End');

// Output: Start, End, Microtask

// Use case: Defer execution but before rendering
function scheduleUpdate(callback) {
    queueMicrotask(callback);
}

// -------------------------------------------------------------------------------------------
// 5. PROMISE CHAINS AND MICROTASKS
// -------------------------------------------------------------------------------------------

// Each .then creates a new microtask
Promise.resolve()
    .then(() => console.log('Then 1'))
    .then(() => console.log('Then 2'))
    .then(() => console.log('Then 3'));

Promise.resolve()
    .then(() => console.log('Other Then 1'))
    .then(() => console.log('Other Then 2'));

// Interleaved: Then 1, Other Then 1, Then 2, Other Then 2, Then 3

// -------------------------------------------------------------------------------------------
// 6. ASYNC/AWAIT AND MICROTASKS
// -------------------------------------------------------------------------------------------

async function asyncExample() {
    console.log('Async 1');  // Sync
    await Promise.resolve();
    console.log('Async 2');  // Microtask
    await Promise.resolve();
    console.log('Async 3');  // Microtask (after previous completes)
}

console.log('Start');
asyncExample();
console.log('End');

// Output: Start, Async 1, End, Async 2, Async 3

// -------------------------------------------------------------------------------------------
// 7. STARVING THE EVENT LOOP
// -------------------------------------------------------------------------------------------

// BAD: Infinite microtask loop starves macrotasks
/*
function infiniteMicrotasks() {
    Promise.resolve().then(infiniteMicrotasks);
}
infiniteMicrotasks();  // setTimeout will never run!
*/

// GOOD: Yield to macrotask queue
function processLargeArray(items, callback) {
    let index = 0;
    
    function processChunk() {
        const start = Date.now();
        
        while (index < items.length && Date.now() - start < 16) {
            callback(items[index]);
            index++;
        }
        
        if (index < items.length) {
            setTimeout(processChunk, 0);  // Yield to event loop
        }
    }
    
    processChunk();
}

// -------------------------------------------------------------------------------------------
// 8. REQUESTANIMATIONFRAME
// -------------------------------------------------------------------------------------------

/**
 * RAF runs before repaint (not in task/microtask queue).
 * Ideal for animations - syncs with display refresh (~60fps).
 */

function animate() {
    // Update animation
    element.style.left = x + 'px';
    
    // Schedule next frame
    requestAnimationFrame(animate);
}

// RAF timing in event loop
console.log('Sync');
requestAnimationFrame(() => console.log('RAF'));
setTimeout(() => console.log('Timeout'), 0);
Promise.resolve().then(() => console.log('Promise'));

// Typically: Sync, Promise, RAF, Timeout
// (RAF order relative to timeout depends on timing)

// -------------------------------------------------------------------------------------------
// 9. NODE.JS SPECIFICS
// -------------------------------------------------------------------------------------------

/**
 * Node.js has additional phases:
 * 1. timers - setTimeout, setInterval
 * 2. pending callbacks - I/O callbacks
 * 3. idle, prepare - internal
 * 4. poll - retrieve I/O events
 * 5. check - setImmediate
 * 6. close callbacks
 * 
 * process.nextTick runs before any phase.
 */

// Node.js example
/*
setImmediate(() => console.log('Immediate'));
setTimeout(() => console.log('Timeout'), 0);
process.nextTick(() => console.log('NextTick'));
Promise.resolve().then(() => console.log('Promise'));

// Output: NextTick, Promise, Timeout/Immediate (order varies)
*/

// -------------------------------------------------------------------------------------------
// 10. BLOCKING THE EVENT LOOP
// -------------------------------------------------------------------------------------------

// BAD: Blocks everything
function heavyComputation() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
        // Block for 5 seconds
    }
}

// GOOD: Break into chunks
async function nonBlockingComputation(items) {
    for (let i = 0; i < items.length; i++) {
        processItem(items[i]);
        
        // Yield every 1000 items
        if (i % 1000 === 0) {
            await new Promise(r => setTimeout(r, 0));
        }
    }
}

function processItem(item) {
    // Process logic
}

// -------------------------------------------------------------------------------------------
// 11. DEBUGGING THE EVENT LOOP
// -------------------------------------------------------------------------------------------

// Visualize execution order
function logWithPhase(label, phase) {
    console.log(`[${phase}] ${label}`);
}

console.log('[SYNC] Start');

setTimeout(() => logWithPhase('Timeout 1', 'MACRO'), 0);
setTimeout(() => logWithPhase('Timeout 2', 'MACRO'), 0);

Promise.resolve().then(() => logWithPhase('Promise 1', 'MICRO'));
Promise.resolve().then(() => {
    logWithPhase('Promise 2', 'MICRO');
    queueMicrotask(() => logWithPhase('Nested Micro', 'MICRO'));
});

queueMicrotask(() => logWithPhase('Microtask 1', 'MICRO'));

console.log('[SYNC] End');

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Debounce using microtask
function microtaskDebounce(fn) {
    let scheduled = false;
    let lastArgs;
    
    return function(...args) {
        lastArgs = args;
        if (!scheduled) {
            scheduled = true;
            queueMicrotask(() => {
                scheduled = false;
                fn.apply(this, lastArgs);
            });
        }
    };
}

// Batch DOM updates
class DOMBatcher {
    constructor() {
        this.updates = [];
        this.scheduled = false;
    }
    
    schedule(update) {
        this.updates.push(update);
        
        if (!this.scheduled) {
            this.scheduled = true;
            queueMicrotask(() => this.flush());
        }
    }
    
    flush() {
        this.scheduled = false;
        const updates = this.updates;
        this.updates = [];
        updates.forEach(update => update());
    }
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * EVENT LOOP ORDER:
 * 1. Synchronous code (call stack)
 * 2. ALL microtasks (promises, queueMicrotask)
 * 3. ONE macrotask (setTimeout, I/O)
 * 4. Render (requestAnimationFrame)
 * 5. Repeat
 * 
 * MICROTASKS:
 * - Promise callbacks
 * - queueMicrotask()
 * - Run ALL before next macrotask
 * 
 * MACROTASKS:
 * - setTimeout/setInterval
 * - I/O operations
 * - Run ONE per loop iteration
 * 
 * BEST PRACTICES:
 * - Don't block the event loop
 * - Break heavy work into chunks
 * - Use queueMicrotask for high-priority deferred work
 * - Use setTimeout(0) to yield to event loop
 */
