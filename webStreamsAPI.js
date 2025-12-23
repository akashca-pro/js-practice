/**
 * TOPIC: WEB STREAMS API
 * DESCRIPTION:
 * The Streams API provides a standard way to handle streaming data.
 * It enables reading/writing data in chunks rather than all at once,
 * reducing memory usage and enabling faster processing.
 */

// -------------------------------------------------------------------------------------------
// 1. STREAM TYPES
// -------------------------------------------------------------------------------------------

/**
 * THREE TYPES:
 * - ReadableStream: Source of data (you read from it)
 * - WritableStream: Destination for data (you write to it)
 * - TransformStream: Modifies data in between
 */

// -------------------------------------------------------------------------------------------
// 2. READABLE STREAM BASICS
// -------------------------------------------------------------------------------------------

// Create a simple readable stream
const readableStream = new ReadableStream({
    start(controller) {
        // Called when stream is created
        controller.enqueue('Hello');
        controller.enqueue('World');
        controller.close();  // No more data
    },
    
    pull(controller) {
        // Called when consumer wants more data
    },
    
    cancel(reason) {
        // Called when stream is cancelled
        console.log('Stream cancelled:', reason);
    }
});

// -------------------------------------------------------------------------------------------
// 3. READING FROM A STREAM
// -------------------------------------------------------------------------------------------

async function readStream(stream) {
    const reader = stream.getReader();
    
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            console.log('Chunk:', value);
        }
    } finally {
        reader.releaseLock();
    }
}

// Using for await...of (if stream is async iterable)
async function readWithForAwait(stream) {
    for await (const chunk of stream) {
        console.log('Chunk:', chunk);
    }
}

// -------------------------------------------------------------------------------------------
// 4. FETCH WITH STREAMS
// -------------------------------------------------------------------------------------------

async function fetchWithProgress(url, onProgress) {
    const response = await fetch(url);
    const contentLength = response.headers.get('Content-Length');
    const total = parseInt(contentLength, 10);
    
    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (onProgress && total) {
            onProgress(loaded / total * 100);
        }
    }
    
    // Combine chunks into single array
    const allChunks = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
    }
    
    return new TextDecoder().decode(allChunks);
}

// fetchWithProgress('/large-file', (progress) => {
//     console.log(`Downloaded: ${progress.toFixed(1)}%`);
// });

// -------------------------------------------------------------------------------------------
// 5. WRITABLE STREAM
// -------------------------------------------------------------------------------------------

const writableStream = new WritableStream({
    start(controller) {
        console.log('Writable stream started');
    },
    
    write(chunk, controller) {
        console.log('Writing:', chunk);
    },
    
    close() {
        console.log('Writable stream closed');
    },
    
    abort(reason) {
        console.error('Writable stream aborted:', reason);
    }
});

// Write to a stream
async function writeToStream(stream, data) {
    const writer = stream.getWriter();
    
    for (const chunk of data) {
        await writer.write(chunk);
    }
    
    await writer.close();
}

// -------------------------------------------------------------------------------------------
// 6. TRANSFORM STREAM
// -------------------------------------------------------------------------------------------

// Create a transform stream that uppercases text
const uppercaseTransform = new TransformStream({
    transform(chunk, controller) {
        controller.enqueue(chunk.toUpperCase());
    }
});

// Pipe through transform
async function transformExample() {
    const input = new ReadableStream({
        start(controller) {
            controller.enqueue('hello');
            controller.enqueue('world');
            controller.close();
        }
    });
    
    const transformed = input.pipeThrough(uppercaseTransform);
    
    const reader = transformed.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log(value);  // 'HELLO', 'WORLD'
    }
}

// -------------------------------------------------------------------------------------------
// 7. PIPING STREAMS
// -------------------------------------------------------------------------------------------

async function pipeExample() {
    const source = new ReadableStream({
        start(controller) {
            controller.enqueue('data1');
            controller.enqueue('data2');
            controller.close();
        }
    });
    
    const destination = new WritableStream({
        write(chunk) {
            console.log('Received:', chunk);
        }
    });
    
    // Pipe source to destination
    await source.pipeTo(destination);
}

// -------------------------------------------------------------------------------------------
// 8. TEXT ENCODING/DECODING STREAMS
// -------------------------------------------------------------------------------------------

// TextEncoderStream - string to bytes
const encoderStream = new TextEncoderStream();

// TextDecoderStream - bytes to string
const decoderStream = new TextDecoderStream();

async function encodeDecodeExample() {
    const textStream = new ReadableStream({
        start(controller) {
            controller.enqueue('Hello, Streams!');
            controller.close();
        }
    });
    
    // Encode text to bytes, then decode back
    const pipeline = textStream
        .pipeThrough(new TextEncoderStream())
        .pipeThrough(new TextDecoderStream());
    
    const reader = pipeline.getReader();
    const { value } = await reader.read();
    console.log(value);  // 'Hello, Streams!'
}

// -------------------------------------------------------------------------------------------
// 9. COMPRESSION STREAMS
// -------------------------------------------------------------------------------------------

async function compressData(data) {
    const stream = new Blob([data]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    return await new Response(compressedStream).blob();
}

async function decompressData(blob) {
    const stream = blob.stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    return await new Response(decompressedStream).text();
}

// -------------------------------------------------------------------------------------------
// 10. CREATING A READABLE STREAM FROM ASYNC GENERATOR
// -------------------------------------------------------------------------------------------

function streamFromAsyncGenerator(generator) {
    return new ReadableStream({
        async pull(controller) {
            const { value, done } = await generator.next();
            if (done) {
                controller.close();
            } else {
                controller.enqueue(value);
            }
        }
    });
}

async function* dataGenerator() {
    yield 'chunk1';
    yield 'chunk2';
    yield 'chunk3';
}

const generatorStream = streamFromAsyncGenerator(dataGenerator());

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL: FILE STREAMING
// -------------------------------------------------------------------------------------------

async function streamFileToServer(file, url) {
    const response = await fetch(url, {
        method: 'POST',
        body: file.stream(),  // Stream file directly!
        headers: {
            'Content-Length': file.size,
            'Content-Type': file.type
        }
    });
    return response.json();
}

// -------------------------------------------------------------------------------------------
// 12. TEEMING (Splitting a Stream)
// -------------------------------------------------------------------------------------------

async function teeExample() {
    const original = new ReadableStream({
        start(controller) {
            controller.enqueue('data');
            controller.close();
        }
    });
    
    // Split into two independent streams
    const [stream1, stream2] = original.tee();
    
    // Both can be read independently
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * STREAM TYPES:
 * - ReadableStream: Read data
 * - WritableStream: Write data
 * - TransformStream: Transform data
 * 
 * KEY METHODS:
 * - getReader() / getWriter(): Get lock on stream
 * - pipeTo(): Pipe to writable stream
 * - pipeThrough(): Pipe through transform
 * - tee(): Split into two streams
 * 
 * USE CASES:
 * - Large file downloads with progress
 * - Real-time data processing
 * - Video/audio streaming
 * - Compression/decompression
 * - Memory-efficient data handling
 * 
 * BENEFITS:
 * - Process data incrementally
 * - Lower memory usage
 * - Start processing before download completes
 */
