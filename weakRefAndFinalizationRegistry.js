/**
 * TOPIC: WEAKREF AND FINALIZATIONREGISTRY
 * DESCRIPTION:
 * WeakRef holds a weak reference to an object (doesn't prevent GC).
 * FinalizationRegistry runs callbacks when objects are garbage collected.
 * Use with caution - GC timing is unpredictable.
 */

// -------------------------------------------------------------------------------------------
// 1. WEAKREF BASICS
// -------------------------------------------------------------------------------------------

/**
 * WeakRef creates a weak reference to an object.
 * The referenced object can be garbage collected.
 */

let target = { name: 'Alice', data: new Array(1000000) };
const weakRef = new WeakRef(target);

// Access the referenced object
const obj = weakRef.deref();
if (obj) {
    console.log('Object still exists:', obj.name);
} else {
    console.log('Object was garbage collected');
}

// After target is no longer referenced
target = null;
// Object MAY be collected (timing is unpredictable)

// -------------------------------------------------------------------------------------------
// 2. DEREF() METHOD
// -------------------------------------------------------------------------------------------

const ref = new WeakRef({ id: 1 });

// deref() returns the object or undefined
const derefResult = ref.deref();

if (derefResult !== undefined) {
    // Object is still alive
    console.log(derefResult.id);
} else {
    // Object was garbage collected
    console.log('Object no longer available');
}

// -------------------------------------------------------------------------------------------
// 3. FINALIZATIONREGISTRY BASICS
// -------------------------------------------------------------------------------------------

/**
 * FinalizationRegistry allows cleanup when objects are GC'd.
 */

const registry = new FinalizationRegistry((heldValue) => {
    console.log(`Object with value "${heldValue}" was garbage collected`);
});

let someObject = { data: 'important' };

// Register the object with a held value
registry.register(someObject, 'my-identifier');

// When someObject is no longer referenced and GC runs,
// the callback will be called with 'my-identifier'

// -------------------------------------------------------------------------------------------
// 4. UNREGISTER FROM REGISTRY
// -------------------------------------------------------------------------------------------

const registry2 = new FinalizationRegistry((heldValue) => {
    console.log('Cleaned up:', heldValue);
});

let obj2 = { name: 'Bob' };
const unregisterToken = {};  // Any object as token

registry2.register(obj2, 'bob-data', unregisterToken);

// Later, if we don't want the callback anymore
registry2.unregister(unregisterToken);

// -------------------------------------------------------------------------------------------
// 5. WEAK CACHE PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Cache that allows entries to be garbage collected.
 */

class WeakCache {
    #cache = new Map();  // key -> WeakRef
    #registry;
    
    constructor() {
        this.#registry = new FinalizationRegistry((key) => {
            // Clean up map entry when value is GC'd
            const ref = this.#cache.get(key);
            if (ref && ref.deref() === undefined) {
                this.#cache.delete(key);
                console.log(`Cache entry "${key}" was cleaned up`);
            }
        });
    }
    
    set(key, value) {
        const existingRef = this.#cache.get(key);
        if (existingRef) {
            const existing = existingRef.deref();
            if (existing) {
                this.#registry.unregister(existing);
            }
        }
        
        this.#cache.set(key, new WeakRef(value));
        this.#registry.register(value, key, value);
    }
    
    get(key) {
        const ref = this.#cache.get(key);
        if (!ref) return undefined;
        
        const value = ref.deref();
        if (value === undefined) {
            this.#cache.delete(key);
        }
        return value;
    }
    
    has(key) {
        return this.get(key) !== undefined;
    }
}

// Usage
const cache = new WeakCache();

function getExpensiveData(id) {
    let data = cache.get(id);
    
    if (!data) {
        data = { id, payload: new Array(100000).fill(id) };
        cache.set(id, data);
        console.log(`Created new data for ${id}`);
    } else {
        console.log(`Cache hit for ${id}`);
    }
    
    return data;
}

// -------------------------------------------------------------------------------------------
// 6. RESOURCE CLEANUP
// -------------------------------------------------------------------------------------------

/**
 * Auto-cleanup external resources when JS objects are GC'd.
 */

class ResourceHandle {
    static #registry = new FinalizationRegistry((resourceId) => {
        console.log(`Releasing external resource: ${resourceId}`);
        // Close file, release memory, disconnect, etc.
    });
    
    #resourceId;
    
    constructor(resourceId) {
        this.#resourceId = resourceId;
        ResourceHandle.#registry.register(this, resourceId, this);
    }
    
    // Explicit cleanup (preferred)
    close() {
        ResourceHandle.#registry.unregister(this);
        console.log(`Explicitly closed: ${this.#resourceId}`);
    }
    
    use() {
        console.log(`Using resource: ${this.#resourceId}`);
    }
}

// -------------------------------------------------------------------------------------------
// 7. WEAK REFERENCE WITH REVIVAL
// -------------------------------------------------------------------------------------------

class ResilientRef {
    #ref;
    #factory;
    
    constructor(factory) {
        this.#factory = factory;
        this.#ref = new WeakRef(factory());
    }
    
    get() {
        let obj = this.#ref.deref();
        
        if (!obj) {
            // Recreate if garbage collected
            obj = this.#factory();
            this.#ref = new WeakRef(obj);
        }
        
        return obj;
    }
}

// Usage
const ref2 = new ResilientRef(() => ({ data: 'computed' }));

// -------------------------------------------------------------------------------------------
// 8. CAVEATS AND WARNINGS
// -------------------------------------------------------------------------------------------

/**
 * IMPORTANT: WeakRef and FinalizationRegistry should be used sparingly.
 * 
 * 1. GC timing is unpredictable - callbacks may never run
 * 2. Don't rely on finalizers for critical cleanup
 * 3. May cause hard-to-debug issues
 * 4. Performance overhead
 * 5. Different behavior across engines/environments
 */

// DON'T do this for critical resources
const badRegistry = new FinalizationRegistry((file) => {
    // This may never run!
    // file.close();  // Don't rely on this
});

// DO provide explicit cleanup
class BetterResource {
    close() {
        // Explicit cleanup - always called
    }
    
    // Symbol.dispose for using declarations (ES2023+)
    [Symbol.dispose]() {
        this.close();
    }
}

// -------------------------------------------------------------------------------------------
// 9. WHEN TO USE
// -------------------------------------------------------------------------------------------

/**
 * GOOD USE CASES:
 * - Secondary cache (ok if entries disappear)
 * - Observing GC for debugging/profiling
 * - Cleanup of associated external resources (as backup)
 * - Memory-sensitive applications
 * 
 * BAD USE CASES:
 * - Primary resource cleanup (use explicit close/dispose)
 * - Critical business logic
 * - Anything where timing matters
 * - Cross-realm references
 */

// -------------------------------------------------------------------------------------------
// 10. COMPARISON WITH WEAKMAP
// -------------------------------------------------------------------------------------------

/**
 * WeakMap vs WeakRef:
 * 
 * WeakMap:
 * - Key is weak (can be GC'd)
 * - Value is strong (won't be GC'd while key exists)
 * - Auto-removes entries when key is GC'd
 * - No finalizer callback
 * 
 * WeakRef:
 * - Holds weak reference to any object
 * - Must explicitly check with deref()
 * - Can combine with FinalizationRegistry
 * - More control, more complexity
 */

// WeakMap example
const metadata = new WeakMap();
let user = { name: 'Alice' };
metadata.set(user, { lastAccess: Date.now() });
// When user is GC'd, metadata entry is auto-removed

// WeakRef example
let user2 = { name: 'Bob' };
const userRef = new WeakRef(user2);
// Must check: userRef.deref()

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * WEAKREF:
 * - new WeakRef(object)
 * - ref.deref() returns object or undefined
 * - Object can be garbage collected
 * 
 * FINALIZATIONREGISTRY:
 * - new FinalizationRegistry(callback)
 * - registry.register(object, heldValue, unregisterToken)
 * - registry.unregister(token)
 * - Callback runs when object is GC'd
 * 
 * BEST PRACTICES:
 * - Use sparingly
 * - Don't rely on for critical cleanup
 * - Always provide explicit cleanup methods
 * - Good for caches and debugging
 * - Be aware of unpredictable timing
 */
