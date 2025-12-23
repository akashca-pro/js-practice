/**
 * TOPIC: ASYNCHRONOUS ITERATION (for await...of)
 * DESCRIPTION:
 * Async iteration allows you to iterate over async data sources
 * using for await...of. This is powerful for streams, paginated APIs,
 * and any async sequences.
 */

// -------------------------------------------------------------------------------------------
// 1. ASYNC ITERATOR PROTOCOL
// -------------------------------------------------------------------------------------------

/**
 * An async iterator is like a regular iterator, but next() returns a Promise.
 * { value: Promise<{value, done}> } or async next() that returns {value, done}
 */

const asyncIterator = {
    current: 0,
    max: 3,
    
    async next() {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate async
        
        if (this.current < this.max) {
            return { value: this.current++, done: false };
        }
        return { value: undefined, done: true };
    }
};

// Manual iteration
(async () => {
    console.log(await asyncIterator.next()); // { value: 0, done: false }
    console.log(await asyncIterator.next()); // { value: 1, done: false }
    console.log(await asyncIterator.next()); // { value: 2, done: false }
    console.log(await asyncIterator.next()); // { value: undefined, done: true }
})();

// -------------------------------------------------------------------------------------------
// 2. ASYNC ITERABLE PROTOCOL
// -------------------------------------------------------------------------------------------

/**
 * An async iterable has [Symbol.asyncIterator]() that returns an async iterator.
 * for await...of works with async iterables.
 */

const asyncIterable = {
    data: ['a', 'b', 'c'],
    
    [Symbol.asyncIterator]() {
        let index = 0;
        const data = this.data;
        
        return {
            async next() {
                await new Promise(r => setTimeout(r, 50)); // Simulate delay
                
                if (index < data.length) {
                    return { value: data[index++], done: false };
                }
                return { value: undefined, done: true };
            }
        };
    }
};

// Using for await...of
(async () => {
    for await (const item of asyncIterable) {
        console.log("Async item:", item); // 'a', 'b', 'c' (with delays)
    }
})();

// -------------------------------------------------------------------------------------------
// 3. ASYNC GENERATOR FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * async function* creates an async generator.
 * Can use both await and yield.
 */

async function* asyncGenerator() {
    const data = [1, 2, 3, 4, 5];
    
    for (const item of data) {
        // Simulate async operation (e.g., fetching)
        await new Promise(r => setTimeout(r, 100));
        yield item * 2;
    }
}

(async () => {
    for await (const value of asyncGenerator()) {
        console.log("Async gen value:", value); // 2, 4, 6, 8, 10
    }
})();

// -------------------------------------------------------------------------------------------
// 4. PRACTICAL PATTERN: PAGINATED API
// -------------------------------------------------------------------------------------------

/**
 * Perfect for fetching paginated data lazily.
 */

async function* paginatedFetch(baseUrl, pageSize = 10) {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        // Simulate API call
        const response = await fakeFetch(`${baseUrl}?page=${page}&size=${pageSize}`);
        
        for (const item of response.items) {
            yield item;
        }
        
        hasMore = response.hasMore;
        page++;
    }
}

// Simulated fetch
async function fakeFetch(url) {
    await new Promise(r => setTimeout(r, 50));
    const page = parseInt(url.match(/page=(\d+)/)[1]);
    
    if (page <= 3) {
        return {
            items: Array.from({ length: 3 }, (_, i) => `Item ${(page - 1) * 3 + i + 1}`),
            hasMore: page < 3
        };
    }
    return { items: [], hasMore: false };
}

// Usage
(async () => {
    for await (const item of paginatedFetch('/api/items', 3)) {
        console.log("Paginated item:", item);
        // Automatically fetches next page when needed
    }
})();

// -------------------------------------------------------------------------------------------
// 5. ASYNC ITERATION OVER STREAMS
// -------------------------------------------------------------------------------------------

/**
 * Node.js readable streams are async iterables.
 */

// Example with Node.js (conceptual):
// const fs = require('fs');
// 
// async function processFile() {
//     const stream = fs.createReadStream('large-file.txt');
//     
//     for await (const chunk of stream) {
//         console.log('Chunk:', chunk.toString());
//     }
// }

// Browser Streams (Fetch body):
async function readStream(url) {
    const response = await fetch(url);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    // Create async generator from reader
    async function* streamGenerator() {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            yield decoder.decode(value);
        }
    }
    
    for await (const chunk of streamGenerator()) {
        console.log("Stream chunk:", chunk);
    }
}

// -------------------------------------------------------------------------------------------
// 6. COMBINING ASYNC GENERATORS
// -------------------------------------------------------------------------------------------

/**
 * yield* works with async iterables too.
 */

async function* source1() {
    yield 1;
    await delay(50);
    yield 2;
}

async function* source2() {
    yield 3;
    await delay(50);
    yield 4;
}

async function* combined() {
    yield* source1();
    yield* source2();
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

(async () => {
    const results = [];
    for await (const value of combined()) {
        results.push(value);
    }
    console.log("Combined:", results); // [1, 2, 3, 4]
})();

// -------------------------------------------------------------------------------------------
// 7. ERROR HANDLING
// -------------------------------------------------------------------------------------------

async function* errorGenerator() {
    yield 1;
    throw new Error("Something went wrong!");
    yield 2; // Never reached
}

(async () => {
    try {
        for await (const value of errorGenerator()) {
            console.log("Value:", value);
        }
    } catch (error) {
        console.log("Caught error:", error.message);
    }
})();

// -------------------------------------------------------------------------------------------
// 8. PARALLEL ASYNC ITERATION
// -------------------------------------------------------------------------------------------

/**
 * for await...of is sequential. For parallel processing:
 */

async function parallelAsyncIteration() {
    const urls = ['/api/1', '/api/2', '/api/3'];
    
    // Sequential (slow)
    // for await (const result of asyncMap(urls, fetch)) { ... }
    
    // Parallel (fast)
    const promises = urls.map(url => fakeFetch(url));
    const results = await Promise.all(promises);
    
    for (const result of results) {
        console.log(result);
    }
}

// -------------------------------------------------------------------------------------------
// 9. UTILITY FUNCTIONS FOR ASYNC ITERABLES
// -------------------------------------------------------------------------------------------

/**
 * Map over async iterable
 */
async function* asyncMap(iterable, fn) {
    for await (const item of iterable) {
        yield fn(item);
    }
}

/**
 * Filter async iterable
 */
async function* asyncFilter(iterable, predicate) {
    for await (const item of iterable) {
        if (await predicate(item)) {
            yield item;
        }
    }
}

/**
 * Take first N items
 */
async function* asyncTake(iterable, n) {
    let count = 0;
    for await (const item of iterable) {
        if (count >= n) break;
        yield item;
        count++;
    }
}

/**
 * Convert async iterable to array
 */
async function asyncToArray(iterable) {
    const result = [];
    for await (const item of iterable) {
        result.push(item);
    }
    return result;
}

// Usage example
(async () => {
    async function* numbers() {
        for (let i = 1; i <= 10; i++) {
            await delay(10);
            yield i;
        }
    }
    
    const doubled = asyncMap(numbers(), x => x * 2);
    const evens = asyncFilter(doubled, x => x % 4 === 0);
    const firstThree = asyncTake(evens, 3);
    
    console.log("Utility result:", await asyncToArray(firstThree)); // [4, 8, 12]
})();

// -------------------------------------------------------------------------------------------
// 10. FOR AWAIT WITH REGULAR ITERABLES
// -------------------------------------------------------------------------------------------

/**
 * for await...of also works with regular iterables of promises.
 */

(async () => {
    const arrayOfPromises = [
        Promise.resolve(1),
        delay(50).then(() => 2),
        Promise.resolve(3)
    ];
    
    for await (const value of arrayOfPromises) {
        console.log("Promise value:", value); // 1, 2, 3 (in order)
    }
})();

// -------------------------------------------------------------------------------------------
// SUMMARY & KEY POINTS
// -------------------------------------------------------------------------------------------

/**
 * 1. Async iterators: next() returns Promise<{value, done}>.
 * 2. Async iterables: [Symbol.asyncIterator]() returns async iterator.
 * 3. for await...of: Awaits each value, processes sequentially.
 * 4. async function*: Creates async generators with await + yield.
 * 5. Perfect for: Streams, paginated APIs, event sources.
 * 6. Error handling: Use try/catch around for await...of.
 * 7. Parallel: for await is sequential; use Promise.all for parallel.
 * 8. yield*: Works with async iterables for delegation.
 */
