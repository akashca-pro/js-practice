/**
 * TOPIC: TYPED ARRAYS & ARRAYBUFFERS
 * DESCRIPTION:
 * ArrayBuffer is a fixed-length binary data buffer. Typed Arrays provide
 * views into ArrayBuffers for specific numeric types. Essential for
 * binary data, WebGL, audio processing, and file handling.
 */

// -------------------------------------------------------------------------------------------
// 1. ARRAYBUFFER BASICS
// -------------------------------------------------------------------------------------------

/**
 * ArrayBuffer represents a fixed-length raw binary data buffer.
 * You cannot directly read/write - use views (Typed Arrays or DataView).
 */

// Create 16-byte buffer
const buffer = new ArrayBuffer(16);
console.log(buffer.byteLength);  // 16

// Cannot access bytes directly
// buffer[0] = 1;  // Does nothing!

// -------------------------------------------------------------------------------------------
// 2. TYPED ARRAYS
// -------------------------------------------------------------------------------------------

/**
 * Typed Array types:
 * - Int8Array, Uint8Array, Uint8ClampedArray (1 byte)
 * - Int16Array, Uint16Array (2 bytes)
 * - Int32Array, Uint32Array (4 bytes)
 * - Float32Array (4 bytes)
 * - Float64Array (8 bytes)
 * - BigInt64Array, BigUint64Array (8 bytes)
 */

// Create view into buffer
const int32View = new Int32Array(buffer);
console.log(int32View.length);  // 4 (16 bytes / 4 bytes per int32)

int32View[0] = 42;
console.log(int32View[0]);  // 42

// Create typed array directly (creates its own buffer)
const float64 = new Float64Array(4);  // 4 elements = 32 bytes
float64[0] = 3.14159;

// -------------------------------------------------------------------------------------------
// 3. MULTIPLE VIEWS ON SAME BUFFER
// -------------------------------------------------------------------------------------------

const sharedBuffer = new ArrayBuffer(8);
const uint8View = new Uint8Array(sharedBuffer);
const uint32View = new Uint32Array(sharedBuffer);

uint32View[0] = 0x12345678;

// Same memory, different interpretation
console.log(uint8View[0].toString(16));  // 78 (little-endian)
console.log(uint8View[1].toString(16));  // 56
console.log(uint8View[2].toString(16));  // 34
console.log(uint8View[3].toString(16));  // 12

// -------------------------------------------------------------------------------------------
// 4. DATAVIEW - FLEXIBLE ACCESS
// -------------------------------------------------------------------------------------------

/**
 * DataView allows reading/writing at any byte offset with
 * explicit endianness control.
 */

const dataBuffer = new ArrayBuffer(8);
const view = new DataView(dataBuffer);

// Write with explicit endianness
view.setInt32(0, 0x12345678, true);   // little-endian
view.setInt32(0, 0x12345678, false);  // big-endian

// Read at any offset
const value = view.getUint16(2, true);  // Read 2 bytes at offset 2

// -------------------------------------------------------------------------------------------
// 5. CREATING TYPED ARRAYS
// -------------------------------------------------------------------------------------------

// From length
const arr1 = new Int32Array(4);  // 4 zeros

// From array-like
const arr2 = new Float32Array([1.1, 2.2, 3.3]);

// From another typed array
const arr3 = new Uint8Array(arr2);  // Converts values

// From buffer with offset and length
const buf = new ArrayBuffer(16);
const arr4 = new Int32Array(buf, 4, 2);  // Start at byte 4, 2 elements

// -------------------------------------------------------------------------------------------
// 6. COMMON OPERATIONS
// -------------------------------------------------------------------------------------------

const numbers = new Int32Array([5, 2, 8, 1, 9]);

// Standard array methods work
numbers.forEach((n, i) => console.log(i, n));
const doubled = numbers.map(n => n * 2);
const filtered = numbers.filter(n => n > 3);
const sum = numbers.reduce((a, b) => a + b, 0);

// Sort (modifies in place)
numbers.sort((a, b) => a - b);

// Slice (creates new typed array)
const slice = numbers.slice(1, 3);

// Set (copy from another array)
numbers.set([10, 20], 2);  // Set at index 2

// Subarray (view into same buffer)
const sub = numbers.subarray(1, 3);  // Shares memory!

// -------------------------------------------------------------------------------------------
// 7. WORKING WITH BINARY DATA
// -------------------------------------------------------------------------------------------

// Convert string to bytes
function stringToBytes(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);  // Returns Uint8Array
}

// Convert bytes to string
function bytesToString(bytes) {
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
}

const bytes = stringToBytes("Hello");
console.log(bytes);  // Uint8Array(5) [72, 101, 108, 108, 111]
console.log(bytesToString(bytes));  // "Hello"

// -------------------------------------------------------------------------------------------
// 8. FILE HANDLING
// -------------------------------------------------------------------------------------------

async function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

// Usage:
// const buffer = await readFileAsArrayBuffer(file);
// const bytes = new Uint8Array(buffer);

// -------------------------------------------------------------------------------------------
// 9. BLOB AND ARRAYBUFFER
// -------------------------------------------------------------------------------------------

// ArrayBuffer to Blob
function bufferToBlob(buffer, type = 'application/octet-stream') {
    return new Blob([buffer], { type });
}

// Blob to ArrayBuffer
async function blobToBuffer(blob) {
    return await blob.arrayBuffer();
}

// Create downloadable file
function downloadBuffer(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// -------------------------------------------------------------------------------------------
// 10. ENDIANNESS
// -------------------------------------------------------------------------------------------

/**
 * Endianness: Byte order for multi-byte values.
 * - Little-endian: Least significant byte first (x86, ARM)
 * - Big-endian: Most significant byte first (network order)
 */

function isLittleEndian() {
    const buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);  // Little-endian
    return new Int16Array(buffer)[0] === 256;
}

console.log('Little-endian system:', isLittleEndian());

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Image manipulation (Canvas ImageData)
function invertColors(imageData) {
    const data = new Uint8ClampedArray(imageData.data);
    for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];         // R
        data[i + 1] = 255 - data[i + 1]; // G
        data[i + 2] = 255 - data[i + 2]; // B
        // Alpha (data[i + 3]) unchanged
    }
    return new ImageData(data, imageData.width, imageData.height);
}

// Audio processing
function generateSineWave(frequency, duration, sampleRate = 44100) {
    const samples = duration * sampleRate;
    const buffer = new Float32Array(samples);
    
    for (let i = 0; i < samples; i++) {
        buffer[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
    }
    
    return buffer;
}

// Binary protocol parsing
function parseHeader(buffer) {
    const view = new DataView(buffer);
    return {
        magic: view.getUint32(0, false),      // Big-endian
        version: view.getUint16(4, true),     // Little-endian
        length: view.getUint32(6, true)
    };
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * ARRAYBUFFER:
 * - Raw binary data container
 * - Fixed length, cannot resize
 * - Cannot access directly
 * 
 * TYPED ARRAYS:
 * - Views into ArrayBuffer
 * - Type-specific (Int32Array, Float64Array, etc.)
 * - Standard array methods work
 * 
 * DATAVIEW:
 * - Flexible byte-level access
 * - Explicit endianness control
 * - Read/write at any offset
 * 
 * USE CASES:
 * - Binary file processing
 * - WebGL buffers
 * - Audio/video processing
 * - Network protocols
 * - Canvas image data
 */
