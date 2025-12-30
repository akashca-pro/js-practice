/**
 * TOPIC: STORAGE APIS
 * DESCRIPTION:
 * Browser storage APIs provide mechanisms to store data on the client.
 * Each has different use cases: localStorage for persistent simple data,
 * sessionStorage for session-scoped data, IndexedDB for complex data,
 * and Cache API for network responses. Understanding when to use each
 * is crucial for building performant web applications.
 */

// -------------------------------------------------------------------------------------------
// 1. LOCAL STORAGE
// -------------------------------------------------------------------------------------------

/**
 * localStorage persists data across browser sessions.
 * - Synchronous API
 * - ~5-10MB storage limit
 * - Stores strings only (use JSON for objects)
 * - Shared across tabs/windows for same origin
 */

// Note: localStorage is only available in browser environments
const localStorageDemo = {
    // Basic operations
    set(key, value) {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    },

    get(key, defaultValue = null) {
        if (typeof localStorage === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    },

    remove(key) {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(key);
    },

    clear() {
        if (typeof localStorage === 'undefined') return;
        localStorage.clear();
    },

    // Get all keys
    keys() {
        if (typeof localStorage === 'undefined') return [];
        return Object.keys(localStorage);
    },

    // Storage size
    getSize() {
        if (typeof localStorage === 'undefined') return 0;
        let total = 0;
        for (const key of Object.keys(localStorage)) {
            total += localStorage.getItem(key).length * 2;  // UTF-16
        }
        return (total / 1024).toFixed(2) + ' KB';
    }
};

// Usage example (simulated in Node.js)
console.log('LocalStorage API demo:');
console.log('- set(key, value): Store data');
console.log('- get(key): Retrieve data');
console.log('- remove(key): Delete item');

// -------------------------------------------------------------------------------------------
// 2. SESSION STORAGE
// -------------------------------------------------------------------------------------------

/**
 * sessionStorage is similar to localStorage but:
 * - Data cleared when tab/window closes
 * - Not shared between tabs (even same origin)
 * - Useful for sensitive temporary data
 */

const sessionStorageDemo = {
    set(key, value) {
        if (typeof sessionStorage === 'undefined') return;
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    get(key, defaultValue = null) {
        if (typeof sessionStorage === 'undefined') return defaultValue;
        const item = sessionStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    },

    remove(key) {
        if (typeof sessionStorage === 'undefined') return;
        sessionStorage.removeItem(key);
    }
};

// Use cases
console.log('\nSessionStorage use cases:');
console.log('- Form data backup during session');
console.log('- Shopping cart before login');
console.log('- Temporary user preferences');
console.log('- One-time wizard/tutorial state');

// -------------------------------------------------------------------------------------------
// 3. STORAGE WITH EXPIRATION
// -------------------------------------------------------------------------------------------

/**
 * localStorage doesn't have built-in expiration.
 * Implement expiry wrapper.
 */

class StorageWithExpiry {
    constructor(storage = 'localStorage') {
        this.storageType = storage;
    }

    getStorage() {
        if (typeof window === 'undefined') return null;
        return this.storageType === 'localStorage' 
            ? localStorage 
            : sessionStorage;
    }

    set(key, value, ttlMs) {
        const storage = this.getStorage();
        if (!storage) return;

        const item = {
            value,
            expiry: ttlMs ? Date.now() + ttlMs : null
        };
        storage.setItem(key, JSON.stringify(item));
    }

    get(key) {
        const storage = this.getStorage();
        if (!storage) return null;

        const itemStr = storage.getItem(key);
        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            
            // Check expiration
            if (item.expiry && Date.now() > item.expiry) {
                storage.removeItem(key);
                return null;
            }

            return item.value;
        } catch {
            return null;
        }
    }

    remove(key) {
        const storage = this.getStorage();
        if (storage) storage.removeItem(key);
    }
}

const expiringStorage = new StorageWithExpiry();
// expiringStorage.set('token', 'abc123', 60 * 60 * 1000); // 1 hour
// expiringStorage.get('token'); // Returns null after 1 hour

// -------------------------------------------------------------------------------------------
// 4. INDEXED DB
// -------------------------------------------------------------------------------------------

/**
 * IndexedDB is a low-level API for structured data storage.
 * - Asynchronous (Promise-based wrapper shown)
 * - Supports indexes for fast queries
 * - Can store large amounts of data
 * - Stores complex objects (not just strings)
 */

class IndexedDBStore {
    constructor(dbName, storeName, version = 1) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
        this.db = null;
    }

    async init() {
        if (typeof indexedDB === 'undefined') {
            console.log('IndexedDB not available');
            return false;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve(true);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    
                    // Create indexes
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };
        });
    }

    async add(data) {
        return this.transaction('readwrite', store => {
            const request = store.add({
                ...data,
                createdAt: new Date().toISOString()
            });
            return this.promisifyRequest(request);
        });
    }

    async get(id) {
        return this.transaction('readonly', store => {
            const request = store.get(id);
            return this.promisifyRequest(request);
        });
    }

    async getAll() {
        return this.transaction('readonly', store => {
            const request = store.getAll();
            return this.promisifyRequest(request);
        });
    }

    async update(id, data) {
        return this.transaction('readwrite', store => {
            const request = store.put({ ...data, id });
            return this.promisifyRequest(request);
        });
    }

    async delete(id) {
        return this.transaction('readwrite', store => {
            const request = store.delete(id);
            return this.promisifyRequest(request);
        });
    }

    async clear() {
        return this.transaction('readwrite', store => {
            const request = store.clear();
            return this.promisifyRequest(request);
        });
    }

    async query(indexName, value) {
        return this.transaction('readonly', store => {
            const index = store.index(indexName);
            const request = index.getAll(value);
            return this.promisifyRequest(request);
        });
    }

    // Utility methods
    transaction(mode, callback) {
        if (!this.db) throw new Error('Database not initialized');
        const transaction = this.db.transaction([this.storeName], mode);
        const store = transaction.objectStore(this.storeName);
        return callback(store);
    }

    promisifyRequest(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }
}

// Usage example (browser only)
async function indexedDBDemo() {
    const store = new IndexedDBStore('MyApp', 'users');
    await store.init();
    
    // Add item
    const id = await store.add({ name: 'Alice', email: 'alice@example.com' });
    
    // Get item
    const user = await store.get(id);
    
    // Get all
    const allUsers = await store.getAll();
    
    // Update
    await store.update(id, { name: 'Alice Updated', email: 'alice@example.com' });
    
    // Delete
    await store.delete(id);
}

console.log('\nIndexedDB features:');
console.log('- Stores structured data with indexes');
console.log('- Supports large data volumes');
console.log('- Asynchronous API');
console.log('- Full CRUD operations');

// -------------------------------------------------------------------------------------------
// 5. CACHE API
// -------------------------------------------------------------------------------------------

/**
 * Cache API stores Request/Response pairs.
 * Primarily used with Service Workers for offline support.
 */

class CacheManager {
    constructor(cacheName = 'app-cache-v1') {
        this.cacheName = cacheName;
    }

    async put(request, response) {
        if (typeof caches === 'undefined') return;
        const cache = await caches.open(this.cacheName);
        await cache.put(request, response);
    }

    async get(request) {
        if (typeof caches === 'undefined') return null;
        const cache = await caches.open(this.cacheName);
        return cache.match(request);
    }

    async addAll(urls) {
        if (typeof caches === 'undefined') return;
        const cache = await caches.open(this.cacheName);
        await cache.addAll(urls);
    }

    async delete(request) {
        if (typeof caches === 'undefined') return false;
        const cache = await caches.open(this.cacheName);
        return cache.delete(request);
    }

    async clear() {
        if (typeof caches === 'undefined') return false;
        return caches.delete(this.cacheName);
    }

    async keys() {
        if (typeof caches === 'undefined') return [];
        const cache = await caches.open(this.cacheName);
        return cache.keys();
    }
}

// Network-first with cache fallback pattern
async function fetchWithCache(url, options = {}) {
    const cacheManager = new CacheManager();
    
    try {
        // Try network first
        const response = await fetch(url, options);
        
        // Cache successful responses
        if (response.ok) {
            await cacheManager.put(url, response.clone());
        }
        
        return response;
    } catch (error) {
        // Fallback to cache
        const cached = await cacheManager.get(url);
        if (cached) {
            console.log('Returning cached response');
            return cached;
        }
        throw error;
    }
}

console.log('\nCache API patterns:');
console.log('- Cache-first: Check cache, then network');
console.log('- Network-first: Try network, fallback to cache');
console.log('- Stale-while-revalidate: Return cache, update in background');

// -------------------------------------------------------------------------------------------
// 6. COOKIES
// -------------------------------------------------------------------------------------------

/**
 * Cookies are the oldest storage mechanism.
 * Sent with every HTTP request to the same domain.
 */

class CookieManager {
    static set(name, value, options = {}) {
        if (typeof document === 'undefined') return;
        
        let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
        
        if (options.expires) {
            const date = options.expires instanceof Date 
                ? options.expires 
                : new Date(Date.now() + options.expires);
            cookie += `; expires=${date.toUTCString()}`;
        }
        
        if (options.maxAge) {
            cookie += `; max-age=${options.maxAge}`;
        }
        
        if (options.path) {
            cookie += `; path=${options.path}`;
        }
        
        if (options.domain) {
            cookie += `; domain=${options.domain}`;
        }
        
        if (options.secure) {
            cookie += '; secure';
        }
        
        if (options.sameSite) {
            cookie += `; samesite=${options.sameSite}`;
        }
        
        if (options.httpOnly) {
            cookie += '; httponly';  // Only works on server
        }
        
        document.cookie = cookie;
    }

    static get(name) {
        if (typeof document === 'undefined') return null;
        
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (decodeURIComponent(key) === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    static delete(name, options = {}) {
        this.set(name, '', { ...options, maxAge: 0 });
    }

    static getAll() {
        if (typeof document === 'undefined') return {};
        
        const cookies = {};
        document.cookie.split('; ').forEach(cookie => {
            const [key, value] = cookie.split('=');
            if (key) {
                cookies[decodeURIComponent(key)] = decodeURIComponent(value || '');
            }
        });
        return cookies;
    }
}

// Usage
// CookieManager.set('user', 'alice', { maxAge: 86400, secure: true, sameSite: 'strict' });
// CookieManager.get('user');
// CookieManager.delete('user');

console.log('\nCookie considerations:');
console.log('- Sent with every HTTP request (bandwidth impact)');
console.log('- Limited to ~4KB per cookie');
console.log('- Use Secure and HttpOnly flags for sensitive data');
console.log('- SameSite attribute prevents CSRF');

// -------------------------------------------------------------------------------------------
// 7. STORAGE COMPARISON
// -------------------------------------------------------------------------------------------

/**
 * When to use each storage mechanism.
 */

const storageComparison = {
    localStorage: {
        capacity: '5-10 MB',
        persistence: 'Until explicitly deleted',
        scope: 'Same origin, all tabs',
        api: 'Synchronous',
        dataType: 'Strings only',
        useCase: 'User preferences, app state, offline data'
    },
    sessionStorage: {
        capacity: '5-10 MB',
        persistence: 'Until tab closes',
        scope: 'Same origin, single tab',
        api: 'Synchronous',
        dataType: 'Strings only',
        useCase: 'Form data, temporary state, sensitive temp data'
    },
    indexedDB: {
        capacity: '50+ MB (browser may prompt)',
        persistence: 'Until explicitly deleted',
        scope: 'Same origin',
        api: 'Asynchronous',
        dataType: 'Structured objects, blobs, files',
        useCase: 'Large datasets, offline apps, complex queries'
    },
    cacheAPI: {
        capacity: 'Based on available space',
        persistence: 'Until explicitly deleted',
        scope: 'Same origin',
        api: 'Asynchronous (Promise-based)',
        dataType: 'Request/Response pairs',
        useCase: 'PWA caching, offline support, asset caching'
    },
    cookies: {
        capacity: '4 KB per cookie',
        persistence: 'Based on expiration',
        scope: 'Configurable (domain/path)',
        api: 'Synchronous (string parsing)',
        dataType: 'Strings only',
        useCase: 'Session IDs, auth tokens, server-readable data'
    }
};

console.log('\nStorage Comparison:');
console.table(storageComparison);

// -------------------------------------------------------------------------------------------
// 8. UNIFIED STORAGE WRAPPER
// -------------------------------------------------------------------------------------------

/**
 * Unified API for different storage mechanisms.
 */

class UnifiedStorage {
    constructor(options = {}) {
        this.prefix = options.prefix || 'app_';
        this.defaultTTL = options.defaultTTL || null;
        this.storage = options.storage || 'local'; // 'local', 'session', 'indexed'
    }

    async set(key, value, ttl = this.defaultTTL) {
        const prefixedKey = this.prefix + key;
        const item = {
            value,
            createdAt: Date.now(),
            expiresAt: ttl ? Date.now() + ttl : null
        };

        switch (this.storage) {
            case 'local':
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(prefixedKey, JSON.stringify(item));
                }
                break;
            case 'session':
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.setItem(prefixedKey, JSON.stringify(item));
                }
                break;
            // IndexedDB implementation would go here
        }
    }

    async get(key) {
        const prefixedKey = this.prefix + key;
        let itemStr;

        switch (this.storage) {
            case 'local':
                if (typeof localStorage !== 'undefined') {
                    itemStr = localStorage.getItem(prefixedKey);
                }
                break;
            case 'session':
                if (typeof sessionStorage !== 'undefined') {
                    itemStr = sessionStorage.getItem(prefixedKey);
                }
                break;
        }

        if (!itemStr) return null;

        try {
            const item = JSON.parse(itemStr);
            
            // Check expiration
            if (item.expiresAt && Date.now() > item.expiresAt) {
                await this.remove(key);
                return null;
            }

            return item.value;
        } catch {
            return null;
        }
    }

    async remove(key) {
        const prefixedKey = this.prefix + key;
        
        switch (this.storage) {
            case 'local':
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem(prefixedKey);
                }
                break;
            case 'session':
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem(prefixedKey);
                }
                break;
        }
    }

    async clear() {
        const storage = this.storage === 'local' ? localStorage : sessionStorage;
        if (typeof storage === 'undefined') return;

        const keysToRemove = [];
        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => storage.removeItem(key));
    }
}

// Usage
const storage = new UnifiedStorage({ prefix: 'myapp_', defaultTTL: 3600000 });
// await storage.set('user', { name: 'Alice' });
// await storage.get('user');

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * STORAGE APIs:
 * - localStorage: Persistent, synchronous, simple key-value
 * - sessionStorage: Session-scoped, tab-specific
 * - IndexedDB: Large structured data, async, indexed
 * - Cache API: Request/Response caching for PWAs
 * - Cookies: Server-readable, sent with requests
 *
 * BEST PRACTICES:
 * - Choose storage based on data characteristics
 * - Implement expiration for sensitive data
 * - Handle quota exceeded errors
 * - Use async APIs for large data
 * - Encrypt sensitive data before storing
 * - Clear old data periodically
 *
 * SECURITY CONSIDERATIONS:
 * - Never store passwords in client storage
 * - Use HttpOnly cookies for session tokens
 * - Consider encryption for sensitive data
 * - Be aware of XSS risks with localStorage
 * - Use SameSite cookie attribute
 *
 * COMMON PATTERNS:
 * - Prefix keys to avoid collisions
 * - Implement TTL/expiration wrapper
 * - Use unified API for flexibility
 * - Handle storage unavailability gracefully
 */
