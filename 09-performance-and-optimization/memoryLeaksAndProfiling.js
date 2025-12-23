/**
 * TOPIC: MEMORY LEAKS AND PROFILING
 * DESCRIPTION:
 * Memory leaks occur when allocated memory is not released even though
 * it's no longer needed. This guide covers common leak patterns and
 * how to detect them using browser DevTools and Node.js profiling.
 */

// -------------------------------------------------------------------------------------------
// 1. COMMON MEMORY LEAK PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * PATTERN A: Accidental Global Variables
 * Variables without 'let/const/var' become global and never get collected.
 */
function createGlobalLeak() {
    // BAD: This creates window.leakedData (or global.leakedData in Node)
    leakedData = new Array(1000000).fill("leak");
}

/**
 * PATTERN B: Forgotten Timers and Callbacks
 */
class LeakyComponent {
    constructor() {
        this.data = new Array(100000).fill("component data");
        
        // This interval keeps 'this' alive forever
        this.intervalId = setInterval(() => {
            console.log(this.data.length);
        }, 1000);
    }
    
    // FIX: Always provide a cleanup method
    destroy() {
        clearInterval(this.intervalId);
        this.data = null;
    }
}

/**
 * PATTERN C: Closures Holding Large Data
 */
function closureLeak() {
    const hugeArray = new Array(1000000).fill("🔥");
    
    // This returned function keeps hugeArray in memory
    return function() {
        return hugeArray.length;
    };
}

const leakyFn = closureLeak(); // hugeArray cannot be garbage collected

/**
 * PATTERN D: Detached DOM References
 */
function domLeak() {
    const elements = [];
    
    for (let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        elements.push(div); // Keep reference in array
        document.body.appendChild(div);
    }
    
    // Removing from DOM but array still holds references
    elements.forEach(el => el.remove());
    
    // FIX: Clear the array
    // elements.length = 0;
}

/**
 * PATTERN E: Event Listeners Not Removed
 */
function eventListenerLeak() {
    const button = document.getElementById('myButton');
    const handler = (e) => {
        console.log('Button clicked', e);
    };
    
    button.addEventListener('click', handler);
    
    // FIX: Remove listener before removing element
    // button.removeEventListener('click', handler);
    // button.remove();
}

// -------------------------------------------------------------------------------------------
// 2. DETECTING LEAKS WITH BROWSER DEVTOOLS
// -------------------------------------------------------------------------------------------

/**
 * CHROME DEVTOOLS MEMORY TAB:
 * 
 * 1. Heap Snapshot:
 *    - Take baseline snapshot.
 *    - Perform suspected leaky action.
 *    - Take another snapshot.
 *    - Compare using "Objects allocated between Snapshot 1 and 2".
 * 
 * 2. Allocation Timeline:
 *    - Records memory allocation over time.
 *    - Blue bars = allocated, Gray bars = freed.
 *    - Growing blue area = potential leak.
 * 
 * 3. Allocation Sampling:
 *    - Lower overhead than timeline.
 *    - Shows which functions allocated memory.
 */

// -------------------------------------------------------------------------------------------
// 3. NODE.JS MEMORY PROFILING
// -------------------------------------------------------------------------------------------

/**
 * USING --inspect FLAG:
 * $ node --inspect yourScript.js
 * Open chrome://inspect in Chrome
 * 
 * USING process.memoryUsage():
 */
function checkMemory() {
    const used = process.memoryUsage();
    console.log({
        heapTotal: `${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
        external: `${(used.external / 1024 / 1024).toFixed(2)} MB`,
        rss: `${(used.rss / 1024 / 1024).toFixed(2)} MB` // Resident Set Size
    });
}

/**
 * USING v8.getHeapStatistics():
 */
// const v8 = require('v8');
// console.log(v8.getHeapStatistics());

// -------------------------------------------------------------------------------------------
// 4. HEAP SNAPSHOTS IN NODE.JS
// -------------------------------------------------------------------------------------------

/**
 * Using heapdump package:
 * $ npm install heapdump
 * 
 * const heapdump = require('heapdump');
 * heapdump.writeSnapshot('./heap-' + Date.now() + '.heapsnapshot');
 * 
 * Then load .heapsnapshot file in Chrome DevTools Memory tab.
 */

// -------------------------------------------------------------------------------------------
// 5. MEMORY LEAK DETECTION PATTERNS
// -------------------------------------------------------------------------------------------

/**
 * PATTERN: Track Object Creation
 */
class TrackedObject {
    static instances = new Set();
    
    constructor(id) {
        this.id = id;
        TrackedObject.instances.add(this);
    }
    
    destroy() {
        TrackedObject.instances.delete(this);
    }
    
    static getActiveCount() {
        return TrackedObject.instances.size;
    }
}

/**
 * PATTERN: WeakRef for Optional References (ES2021)
 */
class Cache {
    constructor() {
        this.cache = new Map();
    }
    
    set(key, value) {
        // WeakRef allows the value to be garbage collected
        this.cache.set(key, new WeakRef(value));
    }
    
    get(key) {
        const ref = this.cache.get(key);
        if (ref) {
            const value = ref.deref(); // Returns undefined if collected
            if (value === undefined) {
                this.cache.delete(key); // Clean up stale entry
            }
            return value;
        }
        return undefined;
    }
}

// -------------------------------------------------------------------------------------------
// 6. FINALIZATION REGISTRY (ES2021)
// -------------------------------------------------------------------------------------------

/**
 * FinalizationRegistry lets you run cleanup code when an object is garbage collected.
 */
const registry = new FinalizationRegistry((heldValue) => {
    console.log(`Object with ID ${heldValue} was garbage collected`);
});

function createTrackedObject(id) {
    const obj = { id, data: new Array(10000) };
    registry.register(obj, id); // Register for cleanup notification
    return obj;
}

// let tracked = createTrackedObject(1);
// tracked = null; // Eventually logs: "Object with ID 1 was garbage collected"

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * PREVENTION:
 * 1. Use 'const' and 'let' - Never declare without keyword.
 * 2. Clear timers and intervals - Store IDs and clear on cleanup.
 * 3. Remove event listeners - Before removing DOM elements.
 * 4. Nullify references - Set large objects to null when done.
 * 5. Use WeakMap/WeakSet - For caches that shouldn't prevent GC.
 * 
 * DETECTION:
 * 1. Chrome DevTools Memory tab - Heap snapshots and allocation timeline.
 * 2. Node.js --inspect - Connect to Chrome DevTools.
 * 3. process.memoryUsage() - Monitor heap size over time.
 * 4. heapdump package - Generate snapshots for analysis.
 * 
 * DEBUGGING:
 * 1. Compare heap snapshots - Find growing object counts.
 * 2. Look for "Detached" nodes - DOM elements not in tree.
 * 3. Check closure scopes - What variables are being held.
 */
