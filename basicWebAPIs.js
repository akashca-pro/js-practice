/**
 * TOPIC: BASIC WEB APIs
 * DESCRIPTION:
 * Modern browsers provide numerous APIs for interacting with the web,
 * storage, networking, and more. These are essential for building
 * interactive web applications.
 */

// -------------------------------------------------------------------------------------------
// 1. FETCH API
// -------------------------------------------------------------------------------------------

// GET request
async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

// POST request
async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return response.json();
}

// With options
fetch('/api/data', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify({ key: 'value' }),
    credentials: 'include',  // Send cookies
    mode: 'cors',
    cache: 'no-cache'
});

// -------------------------------------------------------------------------------------------
// 2. LOCAL STORAGE & SESSION STORAGE
// -------------------------------------------------------------------------------------------

// localStorage - persists until cleared
localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
const user = JSON.parse(localStorage.getItem('user'));
localStorage.removeItem('user');
localStorage.clear();

// sessionStorage - persists for session only
sessionStorage.setItem('temp', 'value');
sessionStorage.getItem('temp');

// Storage events (cross-tab)
window.addEventListener('storage', (e) => {
    console.log('Storage changed:', e.key, e.newValue);
});

// -------------------------------------------------------------------------------------------
// 3. URL & URLSearchParams
// -------------------------------------------------------------------------------------------

// URL parsing
const url = new URL('https://example.com/path?foo=bar#hash');
console.log(url.hostname);   // 'example.com'
console.log(url.pathname);   // '/path'
console.log(url.search);     // '?foo=bar'
console.log(url.hash);       // '#hash'

// URLSearchParams
const params = new URLSearchParams(url.search);
params.get('foo');           // 'bar'
params.set('baz', 'qux');
params.append('arr', '1');
params.append('arr', '2');
params.getAll('arr');        // ['1', '2']
params.toString();           // 'foo=bar&baz=qux&arr=1&arr=2'

// Building URLs
const newUrl = new URL('/api/search', 'https://example.com');
newUrl.searchParams.set('q', 'hello');
console.log(newUrl.toString());  // 'https://example.com/api/search?q=hello'

// -------------------------------------------------------------------------------------------
// 4. HISTORY API
// -------------------------------------------------------------------------------------------

// Push state (doesn't reload page)
history.pushState({ page: 1 }, 'Title', '/page1');

// Replace state
history.replaceState({ page: 2 }, 'Title', '/page2');

// Navigate
history.back();
history.forward();
history.go(-2);  // Go back 2 pages

// Listen for navigation
window.addEventListener('popstate', (e) => {
    console.log('State:', e.state);
});

// -------------------------------------------------------------------------------------------
// 5. CONSOLE API
// -------------------------------------------------------------------------------------------

console.log('Regular log');
console.info('Info message');
console.warn('Warning message');
console.error('Error message');

// Grouping
console.group('Group Name');
console.log('Inside group');
console.groupEnd();

// Table
console.table([{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]);

// Timing
console.time('operation');
// ... some code
console.timeEnd('operation');

// Stack trace
console.trace('Trace here');

// Assertions
console.assert(1 === 2, 'Assertion failed!');

// Styling
console.log('%cStyled text', 'color: blue; font-size: 20px');

// -------------------------------------------------------------------------------------------
// 6. GEOLOCATION API
// -------------------------------------------------------------------------------------------

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log('Latitude:', position.coords.latitude);
            console.log('Longitude:', position.coords.longitude);
        },
        (error) => {
            console.error('Geolocation error:', error.message);
        },
        { enableHighAccuracy: true, timeout: 5000 }
    );
    
    // Watch position
    const watchId = navigator.geolocation.watchPosition(callback);
    navigator.geolocation.clearWatch(watchId);
}

function callback() {}

// -------------------------------------------------------------------------------------------
// 7. CLIPBOARD API
// -------------------------------------------------------------------------------------------

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        console.log('Copied!');
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

async function paste() {
    const text = await navigator.clipboard.readText();
    return text;
}

// -------------------------------------------------------------------------------------------
// 8. NOTIFICATIONS API
// -------------------------------------------------------------------------------------------

async function showNotification() {
    if (Notification.permission === 'granted') {
        new Notification('Hello!', {
            body: 'This is a notification',
            icon: '/icon.png'
        });
    } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            showNotification();
        }
    }
}

// -------------------------------------------------------------------------------------------
// 9. FORM DATA API
// -------------------------------------------------------------------------------------------

// Create from form
const form = document.querySelector('form');
const formData = new FormData(form);

// Manual creation
const data = new FormData();
data.append('name', 'Alice');
data.append('file', fileInput.files[0]);

// Send with fetch
fetch('/upload', { method: 'POST', body: data });

// Iterate entries
for (const [key, value] of formData.entries()) {
    console.log(key, value);
}

// -------------------------------------------------------------------------------------------
// 10. BROADCAST CHANNEL API
// -------------------------------------------------------------------------------------------

// Communication between same-origin contexts
const channel = new BroadcastChannel('my-channel');

// Send message
channel.postMessage({ type: 'update', data: {} });

// Receive messages
channel.onmessage = (event) => {
    console.log('Received:', event.data);
};

channel.close();

// -------------------------------------------------------------------------------------------
// 11. PERFORMANCE API
// -------------------------------------------------------------------------------------------

// High-resolution timing
const start = performance.now();
// ... operation
const duration = performance.now() - start;

// Performance marks
performance.mark('start');
// ... operation
performance.mark('end');
performance.measure('operation', 'start', 'end');

// Get measurements
const measures = performance.getEntriesByType('measure');

// -------------------------------------------------------------------------------------------
// 12. CRYPTO API
// -------------------------------------------------------------------------------------------

// Random values
const randomBytes = crypto.getRandomValues(new Uint8Array(16));

// Random UUID
const uuid = crypto.randomUUID();

// Hashing (async)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// -------------------------------------------------------------------------------------------
// 13. MEDIA QUERIES (matchMedia)
// -------------------------------------------------------------------------------------------

const darkMode = window.matchMedia('(prefers-color-scheme: dark)');

if (darkMode.matches) {
    console.log('Dark mode is preferred');
}

darkMode.addEventListener('change', (e) => {
    console.log('Dark mode:', e.matches);
});

// Check viewport
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * NETWORKING:
 * - fetch: HTTP requests
 * - URL/URLSearchParams: URL manipulation
 * 
 * STORAGE:
 * - localStorage/sessionStorage: Key-value storage
 * 
 * NAVIGATION:
 * - History API: SPA routing
 * 
 * USER INTERACTION:
 * - Notifications: Push notifications
 * - Clipboard: Copy/paste
 * - Geolocation: User location
 * 
 * COMMUNICATION:
 * - BroadcastChannel: Cross-tab messaging
 * 
 * UTILITIES:
 * - Performance: Timing and profiling
 * - Crypto: Random values and hashing
 * - Console: Debugging
 */
