/**
 * TOPIC: WEB WORKERS & MULTITHREADING
 * DESCRIPTION:
 * JavaScript is single-threaded, but Web Workers enable true parallelism.
 * SharedArrayBuffer and Atomics allow threads to share memory safely.
 */

// -------------------------------------------------------------------------------------------
// 1. WEB WORKERS BASICS
// -------------------------------------------------------------------------------------------

/**
 * Web Workers run JavaScript in background threads.
 * - No access to DOM
 * - Communicate via message passing
 * - Have their own global scope (not window)
 */

// Main thread example:
// const worker = new Worker('worker.js');
// worker.postMessage({ type: 'compute', data: [1, 2, 3] });
// worker.onmessage = (e) => console.log('Result:', e.data);

// -------------------------------------------------------------------------------------------
// 2. TYPES OF WORKERS
// -------------------------------------------------------------------------------------------

/**
 * DEDICATED WORKER: One-to-one with creating script
 * SHARED WORKER: Shared by multiple scripts
 * SERVICE WORKER: Network proxy, offline support
 */

// -------------------------------------------------------------------------------------------
// 3. TRANSFERABLE OBJECTS
// -------------------------------------------------------------------------------------------

/**
 * postMessage copies by default (slow for large data).
 * Transferable objects move ownership (zero-copy, fast).
 * 
 * Types: ArrayBuffer, MessagePort, ImageBitmap, OffscreenCanvas
 */

// worker.postMessage(buffer, [buffer]); // Transfer ownership

// -------------------------------------------------------------------------------------------
// 4. SHAREDARRAYBUFFER
// -------------------------------------------------------------------------------------------

/**
 * Allows multiple threads to access same memory.
 * Requires COOP/COEP headers for security.
 */

function sharedMemoryExample() {
    // Not transferred, truly shared
    const sab = new SharedArrayBuffer(16);
    const view = new Int32Array(sab);
    // worker.postMessage({ buffer: sab });
}

// -------------------------------------------------------------------------------------------
// 5. ATOMICS
// -------------------------------------------------------------------------------------------

/**
 * Thread-safe operations on SharedArrayBuffer.
 */

function atomicsExample() {
    const sab = new SharedArrayBuffer(4);
    const view = new Int32Array(sab);
    
    Atomics.store(view, 0, 100);       // Atomic write
    Atomics.load(view, 0);              // Atomic read
    Atomics.add(view, 0, 5);            // Atomic add
    Atomics.sub(view, 0, 3);            // Atomic subtract
    Atomics.compareExchange(view, 0, 102, 200); // CAS
    
    // Atomics.wait(view, 0, 0);        // Block until change (workers only)
    // Atomics.notify(view, 0, 1);      // Wake waiting threads
}

// -------------------------------------------------------------------------------------------
// 6. INLINE WORKERS
// -------------------------------------------------------------------------------------------

function createInlineWorker(code) {
    const blob = new Blob([code], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
}

// -------------------------------------------------------------------------------------------
// 7. WORKER POOL PATTERN
// -------------------------------------------------------------------------------------------

class WorkerPool {
    constructor(script, size = navigator.hardwareConcurrency || 4) {
        this.workers = Array.from({ length: size }, () => {
            const w = new Worker(script);
            w.busy = false;
            return w;
        });
        this.queue = [];
    }
    
    exec(data) {
        return new Promise((resolve, reject) => {
            const worker = this.workers.find(w => !w.busy);
            if (worker) this.run(worker, data, resolve, reject);
            else this.queue.push({ data, resolve, reject });
        });
    }
    
    run(worker, data, resolve, reject) {
        worker.busy = true;
        worker.onmessage = (e) => { worker.busy = false; resolve(e.data); this.next(); };
        worker.onerror = (e) => { worker.busy = false; reject(e); this.next(); };
        worker.postMessage(data);
    }
    
    next() {
        if (this.queue.length === 0) return;
        const worker = this.workers.find(w => !w.busy);
        if (worker) {
            const { data, resolve, reject } = this.queue.shift();
            this.run(worker, data, resolve, reject);
        }
    }
    
    terminate() { this.workers.forEach(w => w.terminate()); }
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * 1. Web Workers enable true parallelism.
 * 2. Use Transferable objects for zero-copy transfer.
 * 3. SharedArrayBuffer for shared memory (requires headers).
 * 4. Atomics for thread-safe operations.
 * 5. Worker pools for managing multiple parallel tasks.
 */
