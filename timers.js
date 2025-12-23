/**
 * TOPIC: TIMERS
 * DESCRIPTION:
 * JavaScript provides timer functions for scheduling code execution.
 * Understanding how they work with the event loop is essential for
 * proper async programming.
 */

// -------------------------------------------------------------------------------------------
// 1. SETTIMEOUT - DELAYED EXECUTION
// -------------------------------------------------------------------------------------------

/**
 * setTimeout(callback, delay, ...args)
 * Executes callback once after delay milliseconds.
 * Returns a timer ID for cancellation.
 */

const timeoutId = setTimeout(() => {
    console.log('Executed after 1 second');
}, 1000);

// With arguments
setTimeout((name, greeting) => {
    console.log(`${greeting}, ${name}!`);
}, 500, 'Alice', 'Hello');

// Cancel timeout
clearTimeout(timeoutId);

// -------------------------------------------------------------------------------------------
// 2. SETINTERVAL - REPEATED EXECUTION
// -------------------------------------------------------------------------------------------

/**
 * setInterval(callback, interval, ...args)
 * Executes callback repeatedly every interval milliseconds.
 * Returns a timer ID for cancellation.
 */

let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Tick ${count}`);
    
    if (count >= 5) {
        clearInterval(intervalId);  // Stop after 5 ticks
        console.log('Interval stopped');
    }
}, 1000);

// -------------------------------------------------------------------------------------------
// 3. MINIMUM DELAY
// -------------------------------------------------------------------------------------------

/**
 * Browsers enforce a minimum delay of ~4ms.
 * Nested timeouts may have higher minimum (~4ms after 5 nesting levels).
 */

console.time('timeout');
setTimeout(() => {
    console.timeEnd('timeout');  // Usually 4-5ms, not 0ms
}, 0);

// -------------------------------------------------------------------------------------------
// 4. TIMING ACCURACY
// -------------------------------------------------------------------------------------------

/**
 * setTimeout/setInterval are NOT guaranteed to be precise.
 * - Callback is added to macrotask queue after delay.
 * - Actual execution depends on event loop being free.
 * - Heavy computation can delay execution.
 */

// For precise timing, use timestamps
function preciseTiming(callback, interval) {
    let expected = Date.now() + interval;
    
    function step() {
        const drift = Date.now() - expected;
        callback();
        expected += interval;
        setTimeout(step, Math.max(0, interval - drift));
    }
    
    setTimeout(step, interval);
}

// -------------------------------------------------------------------------------------------
// 5. SETIMMEDIATE (NODE.JS) / QUEUEMICROTASK
// -------------------------------------------------------------------------------------------

/**
 * setImmediate (Node.js only): Executes after I/O events.
 * queueMicrotask: Executes as microtask (before next macrotask).
 */

// queueMicrotask - runs before setTimeout(0)
setTimeout(() => console.log('setTimeout'), 0);
queueMicrotask(() => console.log('queueMicrotask'));
console.log('sync');

// Output: sync, queueMicrotask, setTimeout

// Node.js
// setImmediate(() => console.log('immediate'));
// process.nextTick(() => console.log('nextTick'));

// -------------------------------------------------------------------------------------------
// 6. REQUESTANIMATIONFRAME
// -------------------------------------------------------------------------------------------

/**
 * requestAnimationFrame(callback)
 * Executes before next repaint (~60 fps = every 16.67ms).
 * Best for animations - syncs with display refresh rate.
 */

function animate(element) {
    let position = 0;
    
    function step() {
        position += 2;
        element.style.left = position + 'px';
        
        if (position < 300) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

// Cancel animation
let animationId = requestAnimationFrame(() => {});
cancelAnimationFrame(animationId);

// -------------------------------------------------------------------------------------------
// 7. PROMISE-BASED DELAY
// -------------------------------------------------------------------------------------------

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
    console.log('Start');
    await delay(1000);
    console.log('After 1 second');
    await delay(500);
    console.log('After 500ms more');
}

// Delay with value
function delayWithValue(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// -------------------------------------------------------------------------------------------
// 8. CANCELLABLE TIMEOUT
// -------------------------------------------------------------------------------------------

function cancellableTimeout(callback, delay) {
    let timeoutId;
    let reject;
    
    const promise = new Promise((resolve, rej) => {
        reject = rej;
        timeoutId = setTimeout(() => {
            callback();
            resolve();
        }, delay);
    });
    
    return {
        promise,
        cancel() {
            clearTimeout(timeoutId);
            reject(new Error('Cancelled'));
        }
    };
}

const { promise, cancel } = cancellableTimeout(() => {
    console.log('Executed');
}, 1000);

// cancel();  // Cancel before execution

// -------------------------------------------------------------------------------------------
// 9. DEBOUNCE AND THROTTLE WITH TIMERS
// -------------------------------------------------------------------------------------------

function debounce(fn, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, limit) {
    let inThrottle = false;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// -------------------------------------------------------------------------------------------
// 10. POLLING PATTERN
// -------------------------------------------------------------------------------------------

function poll(fn, interval, timeout) {
    const endTime = Date.now() + timeout;
    
    return new Promise((resolve, reject) => {
        function check() {
            const result = fn();
            
            if (result) {
                resolve(result);
            } else if (Date.now() < endTime) {
                setTimeout(check, interval);
            } else {
                reject(new Error('Polling timeout'));
            }
        }
        
        check();
    });
}

// Usage: Wait for condition
// poll(() => document.querySelector('.loaded'), 100, 5000);

// -------------------------------------------------------------------------------------------
// 11. TIMER MEMORY MANAGEMENT
// -------------------------------------------------------------------------------------------

/**
 * Always clear timers when no longer needed to prevent memory leaks.
 */

class Component {
    constructor() {
        this.intervalId = setInterval(() => {
            this.update();
        }, 1000);
    }
    
    update() {
        console.log('Updating...');
    }
    
    destroy() {
        // Clean up timer when component is removed
        clearInterval(this.intervalId);
    }
}

// -------------------------------------------------------------------------------------------
// 12. COMPARISON TABLE
// -------------------------------------------------------------------------------------------

/**
 * | Function              | When                    | Use Case               |
 * |-----------------------|-------------------------|------------------------|
 * | setTimeout            | After delay             | Delayed execution      |
 * | setInterval           | Every interval          | Polling, clocks        |
 * | requestAnimationFrame | Before repaint          | Animations             |
 * | queueMicrotask        | Before next macrotask   | High-priority async    |
 * | setImmediate (Node)   | After I/O               | Heavy computation      |
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * TIMERS:
 * - setTimeout: One-time delayed execution
 * - setInterval: Repeated execution
 * - requestAnimationFrame: Animation-optimized
 * 
 * KEY POINTS:
 * - Minimum delay of ~4ms (browser enforced)
 * - Not precise - depends on event loop
 * - Always clear timers to prevent leaks
 * - Use RAF for animations, not setInterval
 * 
 * PATTERNS:
 * - Promise-based delay for async/await
 * - Debounce/throttle for rate limiting
 * - Polling for waiting on conditions
 */
