/**
 * TOPIC: DEBOUNCING AND THROTTLING
 * DESCRIPTION:
 * Debouncing and throttling are techniques to control how often a
 * function executes. Essential for performance optimization with
 * events like scrolling, resizing, and typing.
 */

// -------------------------------------------------------------------------------------------
// 1. DEBOUNCING BASICS
// -------------------------------------------------------------------------------------------

/**
 * DEBOUNCE: Wait until action stops for X ms, then execute once.
 * 
 * Use case: Search input - wait until user stops typing.
 */

function debounce(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}

// Example
const searchInput = debounce((query) => {
    console.log('Searching for:', query);
    // Make API call
}, 300);

// Simulating rapid typing
searchInput('h');
searchInput('he');
searchInput('hel');
searchInput('hell');
searchInput('hello');
// Only logs "Searching for: hello" after 300ms pause

// -------------------------------------------------------------------------------------------
// 2. DEBOUNCE WITH LEADING EDGE
// -------------------------------------------------------------------------------------------

/**
 * Execute on leading edge (immediately), then debounce.
 */

function debounceLeading(fn, delay) {
    let timeoutId;
    let isFirstCall = true;
    
    return function(...args) {
        if (isFirstCall) {
            fn.apply(this, args);
            isFirstCall = false;
        }
        
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            isFirstCall = true;
        }, delay);
    };
}

// -------------------------------------------------------------------------------------------
// 3. DEBOUNCE WITH LEADING AND TRAILING
// -------------------------------------------------------------------------------------------

function debounceAdvanced(fn, delay, options = {}) {
    let timeoutId;
    let lastArgs;
    let lastThis;
    let lastCallTime;
    let result;
    const { leading = false, trailing = true } = options;
    
    function invokeFunc() {
        const args = lastArgs;
        const thisArg = lastThis;
        lastArgs = lastThis = undefined;
        result = fn.apply(thisArg, args);
        return result;
    }
    
    function leadingEdge() {
        if (leading) {
            result = invokeFunc();
        }
    }
    
    function trailingEdge() {
        if (trailing && lastArgs) {
            result = invokeFunc();
        }
    }
    
    return function(...args) {
        const time = Date.now();
        const isFirstCall = !lastCallTime;
        
        lastArgs = args;
        lastThis = this;
        lastCallTime = time;
        
        if (isFirstCall) {
            leadingEdge();
        }
        
        clearTimeout(timeoutId);
        
        timeoutId = setTimeout(() => {
            trailingEdge();
            lastCallTime = undefined;
        }, delay);
        
        return result;
    };
}

// -------------------------------------------------------------------------------------------
// 4. THROTTLING BASICS
// -------------------------------------------------------------------------------------------

/**
 * THROTTLE: Execute at most once per X ms.
 * 
 * Use case: Scroll events - fire at regular intervals.
 */

function throttle(fn, limit) {
    let inThrottle = false;
    
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// Example
const handleScroll = throttle(() => {
    console.log('Scroll position:', window.scrollY);
}, 100);

// window.addEventListener('scroll', handleScroll);

// -------------------------------------------------------------------------------------------
// 5. THROTTLE WITH TRAILING CALL
// -------------------------------------------------------------------------------------------

/**
 * Ensure the last call during throttle period is executed.
 */

function throttleWithTrailing(fn, limit) {
    let lastFunc;
    let lastRan;
    
    return function(...args) {
        if (!lastRan) {
            fn.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    fn.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// -------------------------------------------------------------------------------------------
// 6. REQUESTANIMATIONFRAME THROTTLE
// -------------------------------------------------------------------------------------------

/**
 * Use requestAnimationFrame for visual updates (smoother animation).
 */

function throttleRAF(fn) {
    let rafId = null;
    
    return function(...args) {
        if (rafId) return;
        
        rafId = requestAnimationFrame(() => {
            fn.apply(this, args);
            rafId = null;
        });
    };
}

const handleAnimation = throttleRAF(() => {
    // Update visual element positions
    console.log('Animation frame');
});

// -------------------------------------------------------------------------------------------
// 7. COMPARISON: DEBOUNCE VS THROTTLE
// -------------------------------------------------------------------------------------------

/**
 * DEBOUNCE:
 * - Waits until action stops
 * - Good for: search input, form validation, resize end
 * - Fire count: Once (after activity stops)
 * 
 * THROTTLE:
 * - Limits rate of execution
 * - Good for: scroll, mousemove, resize during
 * - Fire count: Regular intervals during activity
 * 
 * 
 * Timeline (each | is a call, X is execution):
 * 
 * Rapid calls:    | | | | | |       | | | |
 * Debounce:                   X              X
 * Throttle:       X     X     X     X     X
 */

// -------------------------------------------------------------------------------------------
// 8. CANCELLABLE DEBOUNCE/THROTTLE
// -------------------------------------------------------------------------------------------

function debounceWithCancel(fn, delay) {
    let timeoutId;
    
    function debounced(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    }
    
    debounced.cancel = function() {
        clearTimeout(timeoutId);
    };
    
    debounced.flush = function() {
        clearTimeout(timeoutId);
        fn.apply(this, []);
    };
    
    return debounced;
}

const debouncedFn = debounceWithCancel(() => console.log('Executed'), 1000);
debouncedFn();
debouncedFn.cancel();  // Cancel pending execution

// -------------------------------------------------------------------------------------------
// 9. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Search input
const handleSearch = debounce(async (query) => {
    const results = await fetch(`/api/search?q=${query}`);
    displayResults(await results.json());
}, 300);

function displayResults(results) { console.log(results); }

// Window resize
const handleResize = debounce(() => {
    console.log('Window resized to:', window.innerWidth, window.innerHeight);
    // Recalculate layout
}, 250);

// Scroll position update
const updateScrollPosition = throttle(() => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    console.log('Scroll progress:', Math.round(progress * 100) + '%');
}, 100);

// Button click (prevent double-click)
const handleSubmit = throttle(() => {
    console.log('Form submitted');
    // Submit form
}, 1000);

// Mouse move tracking
const trackMouse = throttle((e) => {
    console.log('Mouse at:', e.clientX, e.clientY);
}, 50);

// -------------------------------------------------------------------------------------------
// 10. ASYNC DEBOUNCE
// -------------------------------------------------------------------------------------------

function debounceAsync(fn, delay) {
    let timeoutId;
    
    return function(...args) {
        return new Promise((resolve, reject) => {
            clearTimeout(timeoutId);
            
            timeoutId = setTimeout(async () => {
                try {
                    const result = await fn.apply(this, args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, delay);
        });
    };
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * DEBOUNCE:
 * - Delays execution until pause in activity
 * - Best for: Search, validation, resize end
 * - Options: leading, trailing
 * 
 * THROTTLE:
 * - Limits execution to once per interval
 * - Best for: Scroll, mousemove, resize during
 * - Options: leading, trailing
 * 
 * TIPS:
 * - Use RAF throttle for animations
 * - Add cancel/flush methods for control
 * - Consider leading edge for immediate feedback
 * - Test timing values for best UX
 */
