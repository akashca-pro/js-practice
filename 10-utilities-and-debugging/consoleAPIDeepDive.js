/**
 * TOPIC: CONSOLE API DEEP DIVE
 * DESCRIPTION:
 * The Console API provides much more than console.log().
 * Master these methods for better debugging and performance
 * analysis during development.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC LOGGING METHODS
// -------------------------------------------------------------------------------------------

// Standard logging levels
console.log('Regular log message');
console.info('Informational message');
console.warn('Warning message');
console.error('Error message');
console.debug('Debug message');  // May be hidden by default

// -------------------------------------------------------------------------------------------
// 2. FORMATTED OUTPUT
// -------------------------------------------------------------------------------------------

// Format specifiers
console.log('String: %s', 'hello');
console.log('Integer: %d', 42);
console.log('Float: %f', 3.14159);
console.log('Object: %o', { name: 'Alice' });
console.log('Object (expandable): %O', { name: 'Bob' });

// CSS styling in browser
console.log(
    '%cStyled Text',
    'color: blue; font-size: 20px; font-weight: bold'
);

console.log(
    '%cError %cWarning %cInfo',
    'color: red',
    'color: orange',
    'color: blue'
);

// -------------------------------------------------------------------------------------------
// 3. CONSOLE.TABLE
// -------------------------------------------------------------------------------------------

// Display array of objects as table
const users = [
    { name: 'Alice', age: 25, role: 'Admin' },
    { name: 'Bob', age: 30, role: 'User' },
    { name: 'Charlie', age: 35, role: 'User' }
];

console.table(users);

// Show only specific columns
console.table(users, ['name', 'role']);

// Array display
console.table([1, 2, 3, 4, 5]);

// Object display
console.table({ a: 1, b: 2, c: 3 });

// -------------------------------------------------------------------------------------------
// 4. GROUPING
// -------------------------------------------------------------------------------------------

// Create collapsible groups
console.group('User Details');
console.log('Name: Alice');
console.log('Age: 25');
console.groupEnd();

// Collapsed by default
console.groupCollapsed('Server Config');
console.log('Host: localhost');
console.log('Port: 3000');
console.groupEnd();

// Nested groups
console.group('App');
console.log('Starting...');
console.group('Database');
console.log('Connecting...');
console.log('Connected');
console.groupEnd();
console.log('Ready');
console.groupEnd();

// -------------------------------------------------------------------------------------------
// 5. TIMING
// -------------------------------------------------------------------------------------------

// Measure execution time
console.time('Array creation');
const arr = Array.from({ length: 1000000 }, (_, i) => i);
console.timeEnd('Array creation');  // Array creation: X ms

// Multiple timers
console.time('Total');
console.time('Step 1');
// ... step 1 code
console.timeEnd('Step 1');
console.time('Step 2');
// ... step 2 code
console.timeEnd('Step 2');
console.timeEnd('Total');

// Log intermediate times
console.time('Process');
// ... some code
console.timeLog('Process', 'checkpoint 1');
// ... more code
console.timeLog('Process', 'checkpoint 2');
console.timeEnd('Process');

// -------------------------------------------------------------------------------------------
// 6. COUNTING
// -------------------------------------------------------------------------------------------

// Count how many times called
function processItem(item) {
    console.count('processItem called');
    // Process item
}

processItem('a');  // processItem called: 1
processItem('b');  // processItem called: 2
processItem('c');  // processItem called: 3

// Named counters
console.count('clicks');  // clicks: 1
console.count('clicks');  // clicks: 2
console.count('hovers');  // hovers: 1
console.count('clicks');  // clicks: 3

// Reset counter
console.countReset('clicks');
console.count('clicks');  // clicks: 1

// -------------------------------------------------------------------------------------------
// 7. ASSERTIONS
// -------------------------------------------------------------------------------------------

// Log only if condition is false
console.assert(1 === 1, 'This won\'t show');
console.assert(1 === 2, 'This will show!');  // Assertion failed: This will show!

// With objects
const user = { name: 'Alice', role: 'admin' };
console.assert(
    user.role === 'admin',
    'User is not admin:',
    user
);

// -------------------------------------------------------------------------------------------
// 8. STACK TRACES
// -------------------------------------------------------------------------------------------

// Print stack trace
function outer() {
    inner();
}

function inner() {
    console.trace('Trace from inner');
}

outer();
// Trace from inner
//   at inner (...)
//   at outer (...)

// -------------------------------------------------------------------------------------------
// 9. CLEARING
// -------------------------------------------------------------------------------------------

console.clear();  // Clear the console

// -------------------------------------------------------------------------------------------
// 10. MEMORY PROFILING (Browser)
// -------------------------------------------------------------------------------------------

// Check memory usage (Chrome)
console.memory;  // MemoryInfo object

// Log memory info
console.log('Memory:', console.memory);

// -------------------------------------------------------------------------------------------
// 11. DIRECTORY LISTING
// -------------------------------------------------------------------------------------------

// Display object with all properties
const element = document.body;
console.dir(element);  // Shows all properties

// Compared to log which shows HTML representation
console.log(element);  // Shows HTML

// For XML documents
console.dirxml(document);

// -------------------------------------------------------------------------------------------
// 12. PROFILING (Browser)
// -------------------------------------------------------------------------------------------

// Start CPU profiler
console.profile('My Profile');
// ... code to profile
console.profileEnd('My Profile');

// Timeline marker
console.timeStamp('Event occurred');

// -------------------------------------------------------------------------------------------
// 13. INTERACTIVE OBJECT INSPECTION
// -------------------------------------------------------------------------------------------

// Log with labels
const config = { debug: true, env: 'dev' };
console.log({ config });  // { config: { debug: true, env: 'dev' } }

// Multiple values
const a = 1, b = 2, c = 3;
console.log({ a, b, c });  // { a: 1, b: 2, c: 3 }

// -------------------------------------------------------------------------------------------
// 14. CUSTOM CONSOLE UTILITIES
// -------------------------------------------------------------------------------------------

// Custom logger
const logger = {
    log: (...args) => console.log('[LOG]', ...args),
    info: (...args) => console.info('[INFO]', ...args),
    warn: (...args) => console.warn('[WARN]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    
    json: (obj) => console.log(JSON.stringify(obj, null, 2)),
    
    highlight: (msg) => console.log(`%c${msg}`, 'background: yellow; color: black'),
    
    success: (msg) => console.log(`%c✓ ${msg}`, 'color: green'),
    failure: (msg) => console.log(`%c✗ ${msg}`, 'color: red')
};

// Production console silencer
function silenceConsole() {
    const methods = ['log', 'info', 'debug', 'warn'];
    methods.forEach(method => {
        console[method] = () => {};
    });
}

// -------------------------------------------------------------------------------------------
// 15. DEBUGGING PATTERNS
// -------------------------------------------------------------------------------------------

// Quick object inspection
const data = { users: [], config: {} };
console.log('Data:', JSON.stringify(data, null, 2));

// Conditional logging
const DEBUG = true;
DEBUG && console.log('Debug info');

// Value tracking
let counter = 0;
console.log('Counter:', counter++);  // Shows value before increment

// Promise debugging
fetch('/api/data')
    .then(r => (console.log('Response:', r), r))  // Log and pass through
    .then(r => r.json());

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * LOGGING:
 * - log, info, warn, error, debug
 * - Format specifiers: %s, %d, %o, %c
 * 
 * ORGANIZATION:
 * - table: Display data in table format
 * - group/groupEnd: Create collapsible groups
 * 
 * PERFORMANCE:
 * - time/timeEnd: Measure duration
 * - count: Track call frequency
 * 
 * DEBUGGING:
 * - assert: Conditional logging
 * - trace: Print stack trace
 * - dir: Inspect object properties
 * 
 * BEST PRACTICES:
 * - Use appropriate log levels
 * - Remove/disable console in production
 * - Use table for structured data
 * - Group related logs
 */
