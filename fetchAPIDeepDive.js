/**
 * TOPIC: FETCH API DEEP DIVE
 * DESCRIPTION:
 * Fetch is the modern API for making HTTP requests. It's Promise-based,
 * more powerful than XMLHttpRequest, and supports streaming, CORS,
 * and many configuration options.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC GET REQUEST
// -------------------------------------------------------------------------------------------

// Simple fetch
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// Async/await version
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}

// -------------------------------------------------------------------------------------------
// 2. THE RESPONSE OBJECT
// -------------------------------------------------------------------------------------------

async function examineResponse() {
    const response = await fetch('https://api.example.com/data');
    
    // Response properties
    console.log(response.ok);           // true if status 200-299
    console.log(response.status);       // 200, 404, 500, etc.
    console.log(response.statusText);   // "OK", "Not Found", etc.
    console.log(response.url);          // Final URL (after redirects)
    console.log(response.redirected);   // Was there a redirect?
    console.log(response.type);         // "basic", "cors", "opaque"
    console.log(response.headers);      // Headers object
    
    // Read headers
    response.headers.get('Content-Type');
    response.headers.get('Content-Length');
    
    // Iterate headers
    for (const [key, value] of response.headers) {
        console.log(`${key}: ${value}`);
    }
}

// -------------------------------------------------------------------------------------------
// 3. RESPONSE BODY METHODS
// -------------------------------------------------------------------------------------------

async function responseBodyMethods(response) {
    // JSON
    const json = await response.json();
    
    // Text
    const text = await response.text();
    
    // Blob (binary)
    const blob = await response.blob();
    
    // ArrayBuffer
    const buffer = await response.arrayBuffer();
    
    // FormData
    const formData = await response.formData();
    
    // Note: Body can only be read ONCE!
    // To read multiple times, clone first:
    const clone = response.clone();
    const json2 = await clone.json();
}

// -------------------------------------------------------------------------------------------
// 4. REQUEST METHODS
// -------------------------------------------------------------------------------------------

// GET (default)
fetch('/api/users');

// POST
fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'Alice', email: 'alice@example.com' })
});

// PUT
fetch('/api/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Updated' })
});

// PATCH
fetch('/api/users/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Patched' })
});

// DELETE
fetch('/api/users/1', {
    method: 'DELETE'
});

// -------------------------------------------------------------------------------------------
// 5. REQUEST OPTIONS
// -------------------------------------------------------------------------------------------

fetch('/api/data', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123',
        'X-Custom-Header': 'value'
    },
    body: JSON.stringify({ data: 'value' }),
    
    // Credentials
    credentials: 'same-origin',  // or 'include', 'omit'
    
    // CORS mode
    mode: 'cors',  // or 'same-origin', 'no-cors'
    
    // Cache
    cache: 'default',  // or 'no-store', 'reload', 'no-cache', 'force-cache'
    
    // Redirect handling
    redirect: 'follow',  // or 'manual', 'error'
    
    // Referrer
    referrer: 'client',
    referrerPolicy: 'no-referrer-when-downgrade',
    
    // Integrity check
    integrity: 'sha256-abc123...',
    
    // Keepalive (for analytics on page unload)
    keepalive: false,
    
    // Abort signal
    signal: new AbortController().signal
});

// -------------------------------------------------------------------------------------------
// 6. SENDING DIFFERENT DATA TYPES
// -------------------------------------------------------------------------------------------

// JSON
fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
});

// Form data
const formData = new FormData();
formData.append('name', 'Alice');
formData.append('file', fileInput.files[0]);

fetch('/api/upload', {
    method: 'POST',
    body: formData  // Content-Type set automatically
});

// URL-encoded
const params = new URLSearchParams();
params.append('name', 'Alice');
params.append('age', '25');

fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
});

// Blob
fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: blob
});

// -------------------------------------------------------------------------------------------
// 7. ERROR HANDLING
// -------------------------------------------------------------------------------------------

/**
 * IMPORTANT: Fetch only rejects on network errors.
 * 404, 500, etc. are NOT rejections!
 */

async function fetchWithErrorHandling(url) {
    try {
        const response = await fetch(url);
        
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was aborted');
        } else if (error.name === 'TypeError') {
            console.log('Network error');
        } else {
            console.log('Error:', error.message);
        }
        throw error;
    }
}

// Wrapper function
async function safeFetch(url, options = {}) {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        const error = new Error(`HTTP ${response.status}`);
        error.response = response;
        error.status = response.status;
        throw error;
    }
    
    const contentType = response.headers.get('Content-Type');
    if (contentType?.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

// -------------------------------------------------------------------------------------------
// 8. TIMEOUT IMPLEMENTATION
// -------------------------------------------------------------------------------------------

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Using AbortSignal.timeout (modern browsers)
fetch('/api/data', { signal: AbortSignal.timeout(5000) });

// -------------------------------------------------------------------------------------------
// 9. PROGRESS TRACKING
// -------------------------------------------------------------------------------------------

async function fetchWithProgress(url, onProgress) {
    const response = await fetch(url);
    const contentLength = response.headers.get('Content-Length');
    const total = parseInt(contentLength, 10);
    
    const reader = response.body.getReader();
    let received = 0;
    const chunks = [];
    
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        received += value.length;
        
        onProgress?.({
            loaded: received,
            total,
            percent: total ? (received / total) * 100 : 0
        });
    }
    
    const allChunks = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
    }
    
    return new TextDecoder().decode(allChunks);
}

// Usage
// fetchWithProgress('/api/large-file', progress => {
//     console.log(`${progress.percent.toFixed(1)}% complete`);
// });

// -------------------------------------------------------------------------------------------
// 10. RETRY LOGIC
// -------------------------------------------------------------------------------------------

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            
            if (!response.ok && response.status >= 500) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            return response;
        } catch (error) {
            if (attempt === retries) {
                throw error;
            }
            
            console.log(`Attempt ${attempt + 1} failed, retrying...`);
            await new Promise(r => setTimeout(r, delay * (attempt + 1)));
        }
    }
}

// -------------------------------------------------------------------------------------------
// 11. REQUEST OBJECT
// -------------------------------------------------------------------------------------------

// Create reusable Request object
const request = new Request('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
});

// Use with fetch
fetch(request);

// Clone to reuse
fetch(request.clone());

// Request properties
console.log(request.method);      // 'POST'
console.log(request.url);         // Full URL
console.log(request.headers);     // Headers object
console.log(request.mode);        // 'cors'
console.log(request.credentials); // 'same-origin'

// -------------------------------------------------------------------------------------------
// 12. PRACTICAL API CLIENT
// -------------------------------------------------------------------------------------------

class APIClient {
    constructor(baseURL, defaultHeaders = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = defaultHeaders;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...this.defaultHeaders,
                ...options.headers
            }
        };
        
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const error = new Error(`API Error: ${response.status}`);
            error.response = response;
            throw error;
        }
        
        return response.json();
    }
    
    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }
    
    post(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    }
    
    put(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    }
    
    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

const api = new APIClient('https://api.example.com', {
    'Authorization': 'Bearer token123'
});

// Usage
// api.get('/users');
// api.post('/users', { name: 'Alice' });

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * BASIC USAGE:
 * - fetch(url) returns Promise<Response>
 * - Check response.ok for success
 * - Use .json(), .text(), .blob() for body
 * 
 * REQUEST OPTIONS:
 * - method, headers, body
 * - credentials, mode, cache
 * - signal (AbortController)
 * 
 * ERROR HANDLING:
 * - fetch only rejects on network errors
 * - Check response.ok for HTTP errors
 * - Handle AbortError separately
 * 
 * PATTERNS:
 * - Timeout with AbortController
 * - Retry with exponential backoff
 * - Progress tracking with ReadableStream
 * - API client wrapper
 */
