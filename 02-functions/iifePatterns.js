/**
 * TOPIC: IIFE (IMMEDIATELY INVOKED FUNCTION EXPRESSION)
 * DESCRIPTION:
 * IIFE is a function that runs immediately after it's defined.
 * Historically used for scope isolation and module patterns.
 * Still useful for specific scenarios in modern JavaScript.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC IIFE SYNTAX
// -------------------------------------------------------------------------------------------

// Standard IIFE
(function() {
    console.log('I run immediately!');
})();

// Arrow function IIFE
(() => {
    console.log('Arrow IIFE');
})();

// With parameters
(function(message) {
    console.log(message);
})('Hello, World!');

// Named IIFE (useful for recursion and debugging)
(function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n - 1);
})(5);  // 120

// -------------------------------------------------------------------------------------------
// 2. ALTERNATIVE SYNTAX
// -------------------------------------------------------------------------------------------

// Parentheses around everything
(function() {
    console.log('Style 1');
}());

// Parentheses just around function
(function() {
    console.log('Style 2');
})();

// Using operators (less common)
!function() {
    console.log('Bang');
}();

+function() {
    console.log('Plus');
}();

void function() {
    console.log('Void');
}();

// -------------------------------------------------------------------------------------------
// 3. SCOPE ISOLATION
// -------------------------------------------------------------------------------------------

/**
 * IIFE creates a new scope, preventing variable pollution.
 */

// Without IIFE - pollutes global scope
var name = 'Alice';  // Global variable

// With IIFE - variables stay private
(function() {
    var privateVar = 'Not accessible outside';
    let anotherPrivate = 'Also private';
})();

// console.log(privateVar);  // ReferenceError

// -------------------------------------------------------------------------------------------
// 4. MODULE PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Classic module pattern using IIFE.
 */

const Counter = (function() {
    // Private state
    let count = 0;
    
    // Private function
    function logCount() {
        console.log(`Current count: ${count}`);
    }
    
    // Public API
    return {
        increment() {
            count++;
            logCount();
        },
        decrement() {
            count--;
            logCount();
        },
        getCount() {
            return count;
        }
    };
})();

Counter.increment();  // Current count: 1
Counter.increment();  // Current count: 2
Counter.getCount();   // 2
// Counter.count;     // undefined (private)

// -------------------------------------------------------------------------------------------
// 5. REVEALING MODULE PATTERN
// -------------------------------------------------------------------------------------------

const Calculator = (function() {
    // All functions defined as private
    function add(a, b) {
        return a + b;
    }
    
    function subtract(a, b) {
        return a - b;
    }
    
    function multiply(a, b) {
        return a * b;
    }
    
    function divide(a, b) {
        if (b === 0) throw new Error('Cannot divide by zero');
        return a / b;
    }
    
    // Reveal public API
    return {
        add,
        subtract,
        multiply,
        divide
    };
})();

// -------------------------------------------------------------------------------------------
// 6. NAMESPACE PATTERN
// -------------------------------------------------------------------------------------------

const MyApp = MyApp || {};

MyApp.utils = (function() {
    return {
        formatDate(date) {
            return date.toISOString();
        },
        capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    };
})();

MyApp.api = (function() {
    const baseUrl = 'https://api.example.com';
    
    return {
        get(endpoint) {
            return fetch(`${baseUrl}${endpoint}`);
        }
    };
})();

// -------------------------------------------------------------------------------------------
// 7. CLOSURES AND LOOPS
// -------------------------------------------------------------------------------------------

/**
 * Classic problem: var in loops.
 */

// Problem: all callbacks log 3
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log('Problem:', i);  // 3, 3, 3
    }, 100);
}

// IIFE solution
for (var i = 0; i < 3; i++) {
    (function(index) {
        setTimeout(function() {
            console.log('IIFE fix:', index);  // 0, 1, 2
        }, 100);
    })(i);
}

// Modern solution: let
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log('Let fix:', i);  // 0, 1, 2
    }, 100);
}

// -------------------------------------------------------------------------------------------
// 8. ASYNC IIFE
// -------------------------------------------------------------------------------------------

/**
 * Async IIFE for top-level await alternative.
 */

(async function() {
    const response = await fetch('/api/data');
    const data = await response.json();
    console.log(data);
})();

// Arrow function version
(async () => {
    try {
        const data = await fetchData();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();

async function fetchData() {
    return 'data';
}

// -------------------------------------------------------------------------------------------
// 9. INITIALIZATION
// -------------------------------------------------------------------------------------------

/**
 * IIFE for one-time initialization.
 */

const config = (function() {
    const env = process.env.NODE_ENV || 'development';
    
    const configs = {
        development: {
            apiUrl: 'http://localhost:3000',
            debug: true
        },
        production: {
            apiUrl: 'https://api.example.com',
            debug: false
        }
    };
    
    return Object.freeze(configs[env]);
})();

// Singleton with initialization
const Database = (function() {
    let instance = null;
    
    function createConnection() {
        return {
            host: 'localhost',
            port: 5432,
            connected: true
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createConnection();
            }
            return instance;
        }
    };
})();

// -------------------------------------------------------------------------------------------
// 10. DEPENDENCY INJECTION
// -------------------------------------------------------------------------------------------

const MyModule = (function($, _) {
    // Use jQuery and Lodash internally
    return {
        init() {
            // $('.element').hide();
            // _.debounce(...);
        }
    };
})(jQuery, lodash);

// With window/document/undefined safety
(function(window, document, undefined) {
    // window and document are local references
    // undefined can't be overwritten
})(window, document);

// -------------------------------------------------------------------------------------------
// 11. WHEN TO USE IIFE TODAY
// -------------------------------------------------------------------------------------------

/**
 * With ES6 modules, IIFE is less needed, but still useful for:
 * 
 * 1. Inline scripts in HTML
 * 2. Quick one-time initialization
 * 3. Wrapping third-party code
 * 4. Creating isolated scope in global scripts
 * 5. Async initialization (before top-level await)
 */

// Inline script in HTML
/*
<script>
(function() {
    const data = document.getElementById('data').dataset;
    initApp(data);
})();
</script>
*/

// -------------------------------------------------------------------------------------------
// 12. MODERN ALTERNATIVES
// -------------------------------------------------------------------------------------------

// Block scope with let/const
{
    const privateVar = 'scoped';
    let anotherVar = 'also scoped';
}
// privateVar not accessible here

// ES Modules
// export const module = { ... };

// Top-level await (ES2022)
// const data = await fetch('/api/data');

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * IIFE:
 * - (function() { ... })()
 * - Immediately executes
 * - Creates private scope
 * 
 * USE CASES:
 * - Module pattern (pre-ES6)
 * - Scope isolation
 * - Loop closures with var
 * - Async initialization
 * - Inline scripts
 * 
 * MODERN ALTERNATIVES:
 * - Block scope with { let/const }
 * - ES Modules
 * - Top-level await
 * - Class with private fields
 * 
 * STILL USEFUL FOR:
 * - Inline HTML scripts
 * - Quick initialization
 * - Wrapping non-module code
 */
