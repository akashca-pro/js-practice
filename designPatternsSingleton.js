/**
 * TOPIC: DESIGN PATTERNS - SINGLETON
 * DESCRIPTION:
 * Singleton ensures a class has only one instance and provides
 * a global point of access to it. Useful for managing shared
 * resources like configuration, logging, or database connections.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC SINGLETON WITH CLOSURE
// -------------------------------------------------------------------------------------------

const Singleton = (function() {
    let instance;
    
    function createInstance() {
        return {
            name: 'Singleton Instance',
            timestamp: Date.now(),
            getData() {
                return 'Some data';
            }
        };
    }
    
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

const s1 = Singleton.getInstance();
const s2 = Singleton.getInstance();
console.log(s1 === s2);  // true

// -------------------------------------------------------------------------------------------
// 2. SINGLETON CLASS (ES6+)
// -------------------------------------------------------------------------------------------

class Database {
    static #instance = null;
    
    constructor() {
        if (Database.#instance) {
            return Database.#instance;
        }
        
        this.connection = 'Connected';
        this.queryCount = 0;
        Database.#instance = this;
    }
    
    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }
    
    query(sql) {
        this.queryCount++;
        console.log(`Executing: ${sql}`);
    }
}

const db1 = Database.getInstance();
const db2 = new Database();  // Returns same instance
console.log(db1 === db2);    // true

// -------------------------------------------------------------------------------------------
// 3. SINGLETON WITH LAZY INITIALIZATION
// -------------------------------------------------------------------------------------------

class Logger {
    static instance;
    
    constructor() {
        if (Logger.instance) {
            throw new Error('Use Logger.getInstance()');
        }
        this.logs = [];
    }
    
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    
    log(message) {
        const entry = `[${new Date().toISOString()}] ${message}`;
        this.logs.push(entry);
        console.log(entry);
    }
    
    getLogs() {
        return [...this.logs];
    }
}

const logger = Logger.getInstance();
logger.log('Application started');

// -------------------------------------------------------------------------------------------
// 4. MODULE PATTERN (SIMPLER SINGLETON)
// -------------------------------------------------------------------------------------------

/**
 * ES Modules are singletons by default.
 * The module is evaluated once and cached.
 */

// config.js
/*
const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};

export default Object.freeze(config);
*/

// Usage - same instance everywhere
// import config from './config.js';

// -------------------------------------------------------------------------------------------
// 5. CONFIGURATION MANAGER
// -------------------------------------------------------------------------------------------

class ConfigManager {
    static #instance = null;
    #config = {};
    
    constructor() {
        if (ConfigManager.#instance) {
            return ConfigManager.#instance;
        }
        ConfigManager.#instance = this;
    }
    
    static getInstance() {
        if (!ConfigManager.#instance) {
            ConfigManager.#instance = new ConfigManager();
        }
        return ConfigManager.#instance;
    }
    
    set(key, value) {
        this.#config[key] = value;
    }
    
    get(key, defaultValue = null) {
        return this.#config[key] ?? defaultValue;
    }
    
    getAll() {
        return { ...this.#config };
    }
}

const config = ConfigManager.getInstance();
config.set('apiUrl', 'https://api.example.com');
console.log(config.get('apiUrl'));

// -------------------------------------------------------------------------------------------
// 6. STATE MANAGER SINGLETON
// -------------------------------------------------------------------------------------------

class StateManager {
    static #instance = null;
    #state = {};
    #listeners = [];
    
    static getInstance() {
        if (!StateManager.#instance) {
            StateManager.#instance = new StateManager();
        }
        return StateManager.#instance;
    }
    
    getState() {
        return { ...this.#state };
    }
    
    setState(newState) {
        this.#state = { ...this.#state, ...newState };
        this.#notify();
    }
    
    subscribe(listener) {
        this.#listeners.push(listener);
        return () => {
            this.#listeners = this.#listeners.filter(l => l !== listener);
        };
    }
    
    #notify() {
        this.#listeners.forEach(listener => listener(this.#state));
    }
}

const state = StateManager.getInstance();
state.subscribe(console.log);
state.setState({ user: 'Alice' });

// -------------------------------------------------------------------------------------------
// 7. PROS AND CONS
// -------------------------------------------------------------------------------------------

/**
 * PROS:
 * - Controlled access to sole instance
 * - Lazy initialization possible
 * - Shared state across application
 * 
 * CONS:
 * - Global state (hard to test)
 * - Hidden dependencies
 * - Can make parallel testing difficult
 * - Violates Single Responsibility Principle
 */

// -------------------------------------------------------------------------------------------
// 8. TESTING SINGLETONS
// -------------------------------------------------------------------------------------------

// Add reset method for testing
class TestableLogger {
    static instance;
    
    static getInstance() {
        if (!TestableLogger.instance) {
            TestableLogger.instance = new TestableLogger();
        }
        return TestableLogger.instance;
    }
    
    static resetInstance() {
        TestableLogger.instance = null;
    }
}

// In tests:
// beforeEach(() => TestableLogger.resetInstance());

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SINGLETON PATTERN:
 * - Ensures single instance
 * - Global access point
 * 
 * IMPLEMENTATIONS:
 * - IIFE with closure (traditional)
 * - ES6 class with static property
 * - ES Modules (natural singleton)
 * 
 * USE CASES:
 * - Configuration management
 * - Logging
 * - Database connections
 * - Caching
 * - State management
 * 
 * ALTERNATIVES:
 * - Dependency injection
 * - Module pattern
 * - Factory with caching
 */
