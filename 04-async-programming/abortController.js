/**
 * TOPIC: ABORTCONTROLLER
 * DESCRIPTION:
 * AbortController provides a way to abort web requests and other
 * async operations. Essential for cancelling fetch requests,
 * implementing timeouts, and cleaning up in React/Vue apps.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC USAGE
// -------------------------------------------------------------------------------------------

const controller = new AbortController();
const signal = controller.signal;

// Pass signal to fetch
fetch('/api/data', { signal })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Request was aborted');
        } else {
            console.error('Fetch error:', error);
        }
    });

// Abort the request
controller.abort();

// -------------------------------------------------------------------------------------------
// 2. CHECKING ABORT STATUS
// -------------------------------------------------------------------------------------------

const controller2 = new AbortController();

console.log(controller2.signal.aborted);  // false

controller2.abort();

console.log(controller2.signal.aborted);  // true

// Abort reason (ES2022+)
controller2.abort('User cancelled');
console.log(controller2.signal.reason);  // 'User cancelled'

// -------------------------------------------------------------------------------------------
// 3. ABORT EVENT LISTENER
// -------------------------------------------------------------------------------------------

const controller3 = new AbortController();

controller3.signal.addEventListener('abort', () => {
    console.log('Signal aborted!');
    console.log('Reason:', controller3.signal.reason);
});

controller3.abort('Operation cancelled');

// -------------------------------------------------------------------------------------------
// 4. IMPLEMENTING TIMEOUT
// -------------------------------------------------------------------------------------------

async function fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
        controller.abort('Request timeout');
    }, timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out after ${timeout}ms`);
        }
        throw error;
    }
}

// Usage
// const data = await fetchWithTimeout('/api/data', 3000);

// AbortSignal.timeout() shorthand (newer browsers)
// fetch('/api/data', { signal: AbortSignal.timeout(5000) });

// -------------------------------------------------------------------------------------------
// 5. CANCELLING MULTIPLE REQUESTS
// -------------------------------------------------------------------------------------------

class RequestManager {
    constructor() {
        this.controller = new AbortController();
    }
    
    fetch(url) {
        return fetch(url, { signal: this.controller.signal });
    }
    
    cancelAll() {
        this.controller.abort('Cancelled all requests');
        // Create new controller for future requests
        this.controller = new AbortController();
    }
}

const manager = new RequestManager();

// Multiple requests share same signal
Promise.all([
    manager.fetch('/api/users'),
    manager.fetch('/api/posts'),
    manager.fetch('/api/comments')
]).catch(error => {
    if (error.name === 'AbortError') {
        console.log('All requests cancelled');
    }
});

// Cancel all at once
manager.cancelAll();

// -------------------------------------------------------------------------------------------
// 6. ABORT IN CUSTOM ASYNC OPERATIONS
// -------------------------------------------------------------------------------------------

function longRunningOperation(signal) {
    return new Promise((resolve, reject) => {
        // Check if already aborted
        if (signal?.aborted) {
            reject(new DOMException('Operation aborted', 'AbortError'));
            return;
        }
        
        const items = [];
        let index = 0;
        
        const processNext = () => {
            // Check abort status during processing
            if (signal?.aborted) {
                reject(new DOMException('Operation aborted', 'AbortError'));
                return;
            }
            
            // Simulate work
            items.push(index++);
            
            if (index < 100) {
                setTimeout(processNext, 100);
            } else {
                resolve(items);
            }
        };
        
        // Listen for abort
        signal?.addEventListener('abort', () => {
            reject(new DOMException('Operation aborted', 'AbortError'));
        });
        
        processNext();
    });
}

// Usage
const opController = new AbortController();

longRunningOperation(opController.signal)
    .then(result => console.log('Completed:', result))
    .catch(error => console.log('Aborted:', error.message));

// Cancel after 2 seconds
setTimeout(() => opController.abort(), 2000);

// -------------------------------------------------------------------------------------------
// 7. REACT/VUE CLEANUP PATTERN
// -------------------------------------------------------------------------------------------

/**
 * React example:
 */
/*
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const controller = new AbortController();
        
        fetch(`/api/users/${userId}`, { signal: controller.signal })
            .then(response => response.json())
            .then(data => setUser(data))
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error('Failed to load user:', error);
                }
            });
        
        // Cleanup: abort on unmount or userId change
        return () => controller.abort();
    }, [userId]);
    
    return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
*/

// -------------------------------------------------------------------------------------------
// 8. ABORTSIGNAL.ANY() - COMBINE SIGNALS
// -------------------------------------------------------------------------------------------

/**
 * AbortSignal.any() creates a signal that aborts when ANY
 * of the provided signals abort (ES2024+).
 */

/*
const userController = new AbortController();
const timeoutSignal = AbortSignal.timeout(5000);

// Abort if user cancels OR timeout
const combinedSignal = AbortSignal.any([
    userController.signal,
    timeoutSignal
]);

fetch('/api/data', { signal: combinedSignal });
*/

// -------------------------------------------------------------------------------------------
// 9. ABORTSIGNAL.ABORT() - PRE-ABORTED SIGNAL
// -------------------------------------------------------------------------------------------

/**
 * Create an already-aborted signal.
 */

const abortedSignal = AbortSignal.abort('Pre-aborted');

console.log(abortedSignal.aborted);  // true
console.log(abortedSignal.reason);   // 'Pre-aborted'

// Useful for conditional fetching
function maybeFetch(url, shouldFetch) {
    const signal = shouldFetch 
        ? new AbortController().signal 
        : AbortSignal.abort('Skipped');
    
    return fetch(url, { signal });
}

// -------------------------------------------------------------------------------------------
// 10. ABORT WITH EVENT LISTENERS
// -------------------------------------------------------------------------------------------

const controller4 = new AbortController();

// Add event listener with abort signal
document.addEventListener('click', handleClick, { 
    signal: controller4.signal 
});

function handleClick(event) {
    console.log('Clicked:', event.target);
}

// Remove listener by aborting
controller4.abort();

// Multiple listeners, one abort
const navController = new AbortController();

document.addEventListener('scroll', onScroll, { signal: navController.signal });
document.addEventListener('resize', onResize, { signal: navController.signal });
document.addEventListener('click', onClick, { signal: navController.signal });

// Remove all at once
function cleanup() {
    navController.abort();
}

function onScroll() {}
function onResize() {}
function onClick() {}

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Debounced search with abort
function createSearchHandler() {
    let controller = null;
    
    return async function search(query) {
        // Abort previous request
        controller?.abort();
        controller = new AbortController();
        
        try {
            const response = await fetch(
                `/api/search?q=${encodeURIComponent(query)}`,
                { signal: controller.signal }
            );
            return await response.json();
        } catch (error) {
            if (error.name === 'AbortError') {
                return null;  // Silently ignore aborted
            }
            throw error;
        }
    };
}

const search = createSearchHandler();
// Each new search aborts the previous one

// Race with abort
async function fetchWithFallback(primaryUrl, fallbackUrl, timeout = 3000) {
    const controller = new AbortController();
    
    try {
        const response = await Promise.race([
            fetch(primaryUrl, { signal: controller.signal }),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
        return response;
    } catch (error) {
        controller.abort();
        return fetch(fallbackUrl);
    }
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * ABORTCONTROLLER:
 * - controller.abort() - abort the operation
 * - controller.signal - pass to fetch/listeners
 * 
 * ABORTSIGNAL:
 * - signal.aborted - boolean, is aborted?
 * - signal.reason - abort reason
 * - signal.addEventListener('abort', fn)
 * 
 * STATIC METHODS:
 * - AbortSignal.abort() - pre-aborted signal
 * - AbortSignal.timeout(ms) - auto-abort after ms
 * - AbortSignal.any([signals]) - combine signals
 * 
 * USE CASES:
 * - Cancel fetch requests
 * - Implement timeouts
 * - React/Vue cleanup on unmount
 * - Remove event listeners
 * - Cancel custom async operations
 */
