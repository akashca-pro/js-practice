/**
 * TOPIC: LAZY LOADING PATTERNS
 * DESCRIPTION:
 * Lazy loading defers the initialization or loading of resources until
 * they are actually needed. This improves initial load time, reduces
 * memory usage, and optimizes perceived performance. Essential for
 * large applications, images, modules, and computed properties.
 */

// -------------------------------------------------------------------------------------------
// 1. LAZY PROPERTY INITIALIZATION
// -------------------------------------------------------------------------------------------

/**
 * Properties that are computed/initialized only when first accessed.
 */

class ExpensiveResource {
    constructor() {
        console.log('ExpensiveResource created');
        // Simulate expensive initialization
        this.data = Array.from({ length: 1000 }, (_, i) => i * 2);
    }

    process() {
        return this.data.reduce((a, b) => a + b, 0);
    }
}

// Lazy property using getter
class LazyExample {
    #expensiveResource = null;

    // Lazy initialization - only created when accessed
    get expensiveResource() {
        if (!this.#expensiveResource) {
            console.log('Initializing expensive resource...');
            this.#expensiveResource = new ExpensiveResource();
        }
        return this.#expensiveResource;
    }
}

const lazy = new LazyExample();
console.log('Object created, resource not yet initialized');
// Resource is only created when we access it
console.log(lazy.expensiveResource.process());

// -------------------------------------------------------------------------------------------
// 2. LAZY FUNCTION EVALUATION
// -------------------------------------------------------------------------------------------

/**
 * Defer function execution until result is needed.
 */

function createLazy(fn) {
    let value;
    let initialized = false;

    return {
        get value() {
            if (!initialized) {
                value = fn();
                initialized = true;
            }
            return value;
        },
        reset() {
            initialized = false;
            value = undefined;
        }
    };
}

const lazyValue = createLazy(() => {
    console.log('Computing expensive value...');
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
        sum += Math.random();
    }
    return sum;
});

console.log('Lazy created, not computed yet');
console.log('First access:', lazyValue.value);  // Computes
console.log('Second access:', lazyValue.value); // Cached

// -------------------------------------------------------------------------------------------
// 3. LAZY MODULE/CODE LOADING
// -------------------------------------------------------------------------------------------

/**
 * Load modules only when needed (code splitting).
 */

class ModuleLoader {
    constructor() {
        this.modules = new Map();
    }

    async load(moduleName) {
        if (this.modules.has(moduleName)) {
            console.log(`Module ${moduleName} already loaded`);
            return this.modules.get(moduleName);
        }

        console.log(`Loading module: ${moduleName}`);  
        // In real app: const module = await import(`./modules/${moduleName}.js`);
        
        // Simulated module loading
        const module = await new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    name: moduleName, 
                    loaded: true,
                    run: () => console.log(`Running ${moduleName}`)
                });
            }, 100);
        });

        this.modules.set(moduleName, module);
        return module;
    }

    unload(moduleName) {
        this.modules.delete(moduleName);
    }
}

const loader = new ModuleLoader();

// Modules loaded only when needed
async function loadOnDemand() {
    const analytics = await loader.load('analytics');
    analytics.run();
    
    // Won't reload - uses cached version
    const analytics2 = await loader.load('analytics');
}

loadOnDemand();

// -------------------------------------------------------------------------------------------
// 4. LAZY COLLECTION/ITERATOR
// -------------------------------------------------------------------------------------------

/**
 * Generate values on demand instead of all at once.
 */

function* lazyRange(start, end) {
    for (let i = start; i <= end; i++) {
        console.log(`Generating ${i}`);
        yield i;
    }
}

// Values generated only when iterated
const range = lazyRange(1, 5);
console.log('Range created, nothing generated yet');

for (const num of range) {
    console.log('Received:', num);
    if (num === 3) break;  // Stops generation early
}

// Lazy infinite sequence
function* fibonacci() {
    let [a, b] = [0, 1];
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Take only what you need
function take(generator, n) {
    const result = [];
    for (const value of generator) {
        if (result.length >= n) break;
        result.push(value);
    }
    return result;
}

console.log(take(fibonacci(), 10));

// -------------------------------------------------------------------------------------------
// 5. LAZY MAP/FILTER/TRANSFORM
// -------------------------------------------------------------------------------------------

/**
 * Lazy transformation pipeline - process only what's needed.
 */

class LazySequence {
    constructor(iterable) {
        this.iterable = iterable;
    }

    *[Symbol.iterator]() {
        yield* this.iterable;
    }

    map(fn) {
        const self = this;
        return new LazySequence(function* () {
            for (const item of self) {
                yield fn(item);
            }
        }());
    }

    filter(predicate) {
        const self = this;
        return new LazySequence(function* () {
            for (const item of self) {
                if (predicate(item)) {
                    yield item;
                }
            }
        }());
    }

    take(n) {
        const self = this;
        return new LazySequence(function* () {
            let count = 0;
            for (const item of self) {
                if (count >= n) return;
                yield item;
                count++;
            }
        }());
    }

    toArray() {
        return [...this];
    }
}

// Chain lazy operations
const result = new LazySequence([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .map(x => {
        console.log('Mapping:', x);
        return x * 2;
    })
    .filter(x => {
        console.log('Filtering:', x);
        return x > 5;
    })
    .take(3)
    .toArray();

console.log('Result:', result);
// Only processes enough items to get 3 results!

// -------------------------------------------------------------------------------------------
// 6. LAZY IMAGE LOADING (BROWSER)
// -------------------------------------------------------------------------------------------

/**
 * Load images only when they enter viewport.
 * Uses Intersection Observer API.
 */

// Note: This code is for browser environments
const lazyImageLoader = {
    init() {
        // Check for browser environment
        if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
            console.log('Intersection Observer not available (Node.js environment)');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',  // Start loading 50px before visible
            threshold: 0.01
        });

        // Observe all lazy images
        // document.querySelectorAll('img.lazy').forEach(img => observer.observe(img));
        console.log('Lazy image loader initialized');
    }
};

// HTML usage:
// <img class="lazy" data-src="image.jpg" src="placeholder.jpg">

// -------------------------------------------------------------------------------------------
// 7. LAZY SINGLETON
// -------------------------------------------------------------------------------------------

/**
 * Singleton that's only created when first accessed.
 */

class DatabaseConnection {
    static #instance = null;

    constructor() {
        // Simulate expensive connection
        console.log('Establishing database connection...');
        this.connected = true;
        this.connectionTime = Date.now();
    }

    static getInstance() {
        if (!DatabaseConnection.#instance) {
            DatabaseConnection.#instance = new DatabaseConnection();
        }
        return DatabaseConnection.#instance;
    }

    query(sql) {
        return `Result for: ${sql}`;
    }
}

// Connection not created until getInstance() is called
console.log('App started, no DB connection yet');
// ... later when needed:
// const db = DatabaseConnection.getInstance();

// -------------------------------------------------------------------------------------------
// 8. LAZY PROXY
// -------------------------------------------------------------------------------------------

/**
 * Use Proxy to intercept property access and lazy load.
 */

function createLazyProxy(loader) {
    const cache = {};
    const loading = {};

    return new Proxy({}, {
        get(target, prop) {
            // Return cached value
            if (prop in cache) {
                return cache[prop];
            }

            // Avoid duplicate loading
            if (loading[prop]) {
                return loading[prop];
            }

            // Load on demand
            loading[prop] = loader(prop).then(value => {
                cache[prop] = value;
                delete loading[prop];
                return value;
            });

            return loading[prop];
        }
    });
}

// Create a lazy data loader
const lazyData = createLazyProxy(async (key) => {
    console.log(`Loading data for key: ${key}`);
    await new Promise(r => setTimeout(r, 100));
    return { key, data: `Data for ${key}` };
});

// Data loaded only when accessed
// lazyData.user.then(console.log);
// lazyData.settings.then(console.log);

// -------------------------------------------------------------------------------------------
// 9. MEMOIZATION AS LAZY CACHING
// -------------------------------------------------------------------------------------------

/**
 * Cache computed values lazily.
 */

function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (!cache.has(key)) {
            console.log(`Computing for args: ${key}`);
            cache.set(key, fn.apply(this, args));
        }

        return cache.get(key);
    };
}

const expensiveCalculation = memoize((n) => {
    let result = 0;
    for (let i = 0; i < n * 1000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
});

console.log(expensiveCalculation(10));  // Computes
console.log(expensiveCalculation(10));  // Cached

// -------------------------------------------------------------------------------------------
// 10. VIRTUAL PROXY FOR LARGE OBJECTS
// -------------------------------------------------------------------------------------------

/**
 * Proxy that represents a large object but only loads portions as needed.
 */

class VirtualList {
    constructor(fetchFn, pageSize = 100) {
        this.fetchFn = fetchFn;
        this.pageSize = pageSize;
        this.pages = new Map();
        this.totalItems = null;
    }

    async getItem(index) {
        const pageNumber = Math.floor(index / this.pageSize);
        
        if (!this.pages.has(pageNumber)) {
            console.log(`Loading page ${pageNumber}`);
            const page = await this.fetchFn(pageNumber, this.pageSize);
            this.pages.set(pageNumber, page.items);
            this.totalItems = page.total;
        }

        const pageItems = this.pages.get(pageNumber);
        const indexInPage = index % this.pageSize;
        return pageItems[indexInPage];
    }

    async getRange(start, end) {
        const items = [];
        for (let i = start; i <= end; i++) {
            items.push(await this.getItem(i));
        }
        return items;
    }
}

// Simulated API
async function fetchFromAPI(page, size) {
    await new Promise(r => setTimeout(r, 50));
    return {
        items: Array.from({ length: size }, (_, i) => ({ 
            id: page * size + i 
        })),
        total: 10000
    };
}

const virtualList = new VirtualList(fetchFromAPI, 100);

async function demo() {
    // Only loads the page containing item 150
    const item = await virtualList.getItem(150);
    console.log('Item 150:', item);
}

demo();

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * LAZY LOADING PATTERNS:
 * - Defer work until results are needed
 * - Reduce initial load time
 * - Optimize memory usage
 *
 * TYPES OF LAZY LOADING:
 * - Lazy properties (getter-based)
 * - Lazy modules (dynamic import)
 * - Lazy iterators (generators)
 * - Lazy images (Intersection Observer)
 * - Lazy data (virtual/proxy)
 *
 * USE CASES:
 * - Heavy computations
 * - Large data sets
 * - Module/code splitting
 * - Image loading
 * - API data fetching
 * - Database connections
 *
 * BENEFITS:
 * - Faster initial load
 * - Lower memory footprint
 * - Better perceived performance
 * - Reduced bandwidth usage
 *
 * BEST PRACTICES:
 * - Cache lazy values after first load
 * - Handle loading states properly
 * - Use Intersection Observer for viewport-based loading
 * - Consider preloading for critical resources
 * - Avoid lazy loading critical above-the-fold content
 */
