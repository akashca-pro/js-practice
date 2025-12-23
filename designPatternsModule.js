/**
 * TOPIC: DESIGN PATTERNS - MODULE
 * DESCRIPTION:
 * Module pattern encapsulates code into reusable units with
 * private and public parts. ES Modules are now the standard,
 * but understanding the pattern helps with legacy code.
 */

// -------------------------------------------------------------------------------------------
// 1. CLASSIC MODULE PATTERN (IIFE)
// -------------------------------------------------------------------------------------------

const Calculator = (function() {
    // Private
    let history = [];
    
    function addToHistory(operation, result) {
        history.push({ operation, result, timestamp: Date.now() });
    }
    
    // Public API
    return {
        add(a, b) {
            const result = a + b;
            addToHistory(`${a} + ${b}`, result);
            return result;
        },
        
        subtract(a, b) {
            const result = a - b;
            addToHistory(`${a} - ${b}`, result);
            return result;
        },
        
        getHistory() {
            return [...history];  // Return copy
        },
        
        clearHistory() {
            history = [];
        }
    };
})();

Calculator.add(2, 3);        // 5
Calculator.subtract(10, 4);  // 6
Calculator.getHistory();     // [{ operation: '2 + 3', ... }, ...]

// -------------------------------------------------------------------------------------------
// 2. REVEALING MODULE PATTERN
// -------------------------------------------------------------------------------------------

const UserModule = (function() {
    // Private
    const users = [];
    
    function findById(id) {
        return users.find(u => u.id === id);
    }
    
    function generateId() {
        return Date.now().toString(36);
    }
    
    // Public (all at the end, clearly visible)
    function addUser(name, email) {
        const user = { id: generateId(), name, email };
        users.push(user);
        return user;
    }
    
    function getUser(id) {
        return findById(id);
    }
    
    function getAllUsers() {
        return [...users];
    }
    
    function removeUser(id) {
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
        return null;
    }
    
    // Reveal public API
    return {
        add: addUser,
        get: getUser,
        getAll: getAllUsers,
        remove: removeUser
    };
})();

// -------------------------------------------------------------------------------------------
// 3. ES6 MODULE PATTERN (USING CLOSURE)
// -------------------------------------------------------------------------------------------

function createModule() {
    // Private state
    const state = {
        items: [],
        count: 0
    };
    
    // Private functions
    const validateItem = item => item && item.name;
    
    // Public interface
    return {
        addItem(item) {
            if (!validateItem(item)) {
                throw new Error('Invalid item');
            }
            state.items.push({ ...item, id: ++state.count });
        },
        
        getItems() {
            return [...state.items];
        },
        
        getCount() {
            return state.count;
        }
    };
}

const myModule = createModule();

// -------------------------------------------------------------------------------------------
// 4. MODULE WITH CONFIGURATION
// -------------------------------------------------------------------------------------------

const ConfigurableModule = (function() {
    // Defaults
    let config = {
        debug: false,
        apiUrl: 'https://api.example.com',
        timeout: 5000
    };
    
    return {
        configure(options) {
            config = { ...config, ...options };
        },
        
        getConfig() {
            return { ...config };
        },
        
        log(message) {
            if (config.debug) {
                console.log(`[DEBUG] ${message}`);
            }
        },
        
        getApiUrl() {
            return config.apiUrl;
        }
    };
})();

ConfigurableModule.configure({ debug: true });
ConfigurableModule.log('Test');  // Logs in debug mode

// -------------------------------------------------------------------------------------------
// 5. NAMESPACE PATTERN
// -------------------------------------------------------------------------------------------

const App = App || {};

App.Utils = (function() {
    return {
        formatDate(date) {
            return date.toISOString().split('T')[0];
        },
        formatCurrency(amount) {
            return `$${amount.toFixed(2)}`;
        }
    };
})();

App.API = (function() {
    const baseUrl = 'https://api.example.com';
    
    return {
        async get(endpoint) {
            const response = await fetch(`${baseUrl}${endpoint}`);
            return response.json();
        }
    };
})();

// Usage
App.Utils.formatDate(new Date());
App.Utils.formatCurrency(99.99);

// -------------------------------------------------------------------------------------------
// 6. MODULE WITH DEPENDENCIES
// -------------------------------------------------------------------------------------------

const DataModule = (function(utils, api) {
    let cache = new Map();
    
    return {
        async fetchData(id) {
            if (cache.has(id)) {
                utils.log('Cache hit');
                return cache.get(id);
            }
            
            utils.log('Fetching from API');
            const data = await api.get(`/data/${id}`);
            cache.set(id, data);
            return data;
        },
        
        clearCache() {
            cache.clear();
        }
    };
})(App.Utils, App.API);  // Inject dependencies

// -------------------------------------------------------------------------------------------
// 7. ES MODULES (NATIVE APPROACH)
// -------------------------------------------------------------------------------------------

/**
 * Modern JavaScript uses native ES Modules.
 */

// utils.js
/*
const privateHelper = () => { ... };

export const formatDate = (date) => { ... };
export const formatCurrency = (amount) => { ... };
export default { formatDate, formatCurrency };
*/

// app.js
/*
import { formatDate, formatCurrency } from './utils.js';
import utils from './utils.js';
*/

// -------------------------------------------------------------------------------------------
// 8. MODULE AUGMENTATION
// -------------------------------------------------------------------------------------------

// Original module
const BaseModule = (function() {
    return {
        greet(name) {
            return `Hello, ${name}!`;
        }
    };
})();

// Augment with new features
const ExtendedModule = (function(base) {
    const originalGreet = base.greet;
    
    base.greet = function(name) {
        return originalGreet(name).toUpperCase();
    };
    
    base.farewell = function(name) {
        return `Goodbye, ${name}!`;
    };
    
    return base;
})(BaseModule);

// -------------------------------------------------------------------------------------------
// 9. SERVICE LOCATOR PATTERN
// -------------------------------------------------------------------------------------------

const ServiceLocator = (function() {
    const services = new Map();
    
    return {
        register(name, service) {
            services.set(name, service);
        },
        
        get(name) {
            if (!services.has(name)) {
                throw new Error(`Service not found: ${name}`);
            }
            return services.get(name);
        },
        
        has(name) {
            return services.has(name);
        }
    };
})();

// Register services
ServiceLocator.register('logger', {
    log: console.log,
    error: console.error
});

ServiceLocator.register('storage', {
    get: key => localStorage.getItem(key),
    set: (key, value) => localStorage.setItem(key, value)
});

// Use services
const logger = ServiceLocator.get('logger');
logger.log('Hello');

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * MODULE PATTERN:
 * - Encapsulation via closure
 * - Private and public parts
 * - IIFE for immediate creation
 * 
 * VARIATIONS:
 * - Classic Module (IIFE)
 * - Revealing Module (clearer API)
 * - Namespace Pattern (avoid globals)
 * - Module with Dependencies (DI)
 * 
 * MODERN APPROACH:
 * - Use ES Modules (import/export)
 * - Native browser/Node.js support
 * - Static analysis and tree shaking
 * 
 * BENEFITS:
 * - Encapsulation
 * - Clean public API
 * - Dependency management
 * - Avoid global pollution
 */
