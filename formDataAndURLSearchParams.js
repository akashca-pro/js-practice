/**
 * TOPIC: FORMDATA AND URLSEARCHPARAMS
 * DESCRIPTION:
 * FormData handles form data for submission, especially file uploads.
 * URLSearchParams provides utilities for working with query strings.
 * Essential for form handling and URL manipulation.
 */

// -------------------------------------------------------------------------------------------
// 1. FORMDATA BASICS
// -------------------------------------------------------------------------------------------

// Create empty FormData
const formData = new FormData();

// Append data
formData.append('name', 'Alice');
formData.append('email', 'alice@example.com');

// From form element
const form = document.querySelector('form');
const formDataFromForm = new FormData(form);

// -------------------------------------------------------------------------------------------
// 2. FORMDATA METHODS
// -------------------------------------------------------------------------------------------

const fd = new FormData();

// append() - adds value (can have multiple with same name)
fd.append('hobby', 'reading');
fd.append('hobby', 'coding');  // Both values kept

// set() - replaces all values with same name
fd.set('name', 'Alice');
fd.set('name', 'Bob');  // Only 'Bob' remains

// get() - get first value
fd.get('name');  // 'Bob'

// getAll() - get all values
fd.getAll('hobby');  // ['reading', 'coding']

// has() - check if key exists
fd.has('name');  // true
fd.has('age');   // false

// delete() - remove all values with key
fd.delete('hobby');

// entries(), keys(), values()
for (const [key, value] of fd.entries()) {
    console.log(`${key}: ${value}`);
}

for (const key of fd.keys()) {
    console.log(key);
}

for (const value of fd.values()) {
    console.log(value);
}

// -------------------------------------------------------------------------------------------
// 3. FILE UPLOADS WITH FORMDATA
// -------------------------------------------------------------------------------------------

// Single file
const fileInput = document.querySelector('input[type="file"]');
const uploadData = new FormData();
uploadData.append('file', fileInput.files[0]);

// Multiple files
const multipleInput = document.querySelector('input[multiple]');
for (const file of multipleInput.files) {
    uploadData.append('files', file);
}

// With metadata
uploadData.append('description', 'My uploaded files');

// Send with fetch
async function uploadFiles(formData) {
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
        // Note: Don't set Content-Type header - browser sets it with boundary
    });
    return response.json();
}

// -------------------------------------------------------------------------------------------
// 4. BLOB AND FILE HANDLING
// -------------------------------------------------------------------------------------------

// Create file from blob
const blob = new Blob(['Hello, World!'], { type: 'text/plain' });
const file = new File([blob], 'hello.txt', { type: 'text/plain' });

const fd2 = new FormData();
fd2.append('document', file);

// Create blob from canvas
const canvas = document.querySelector('canvas');
canvas.toBlob(blob => {
    const imageData = new FormData();
    imageData.append('image', blob, 'drawing.png');
    // Upload imageData
});

// -------------------------------------------------------------------------------------------
// 5. SENDING JSON WITH FORMDATA
// -------------------------------------------------------------------------------------------

// Convert FormData to object
function formDataToObject(formData) {
    const obj = {};
    for (const [key, value] of formData.entries()) {
        if (obj[key]) {
            // Handle multiple values
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]];
            }
            obj[key].push(value);
        } else {
            obj[key] = value;
        }
    }
    return obj;
}

// Convert object to FormData
function objectToFormData(obj, form = new FormData(), namespace = '') {
    for (const key in obj) {
        const formKey = namespace ? `${namespace}[${key}]` : key;
        
        if (obj[key] instanceof File || obj[key] instanceof Blob) {
            form.append(formKey, obj[key]);
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            objectToFormData(obj[key], form, formKey);
        } else {
            form.append(formKey, obj[key]);
        }
    }
    return form;
}

// -------------------------------------------------------------------------------------------
// 6. URLSEARCHPARAMS BASICS
// -------------------------------------------------------------------------------------------

// Create from string
const params = new URLSearchParams('?name=Alice&age=25');

// Create from object
const params2 = new URLSearchParams({ name: 'Alice', age: '25' });

// Create from entries
const params3 = new URLSearchParams([['name', 'Alice'], ['age', '25']]);

// From URL
const url = new URL('https://example.com?name=Alice&age=25');
const urlParams = url.searchParams;

// -------------------------------------------------------------------------------------------
// 7. URLSEARCHPARAMS METHODS
// -------------------------------------------------------------------------------------------

const sp = new URLSearchParams();

// append() - add value
sp.append('color', 'red');
sp.append('color', 'blue');

// set() - replace value
sp.set('size', 'large');

// get() - get first value
sp.get('color');  // 'red'

// getAll() - get all values
sp.getAll('color');  // ['red', 'blue']

// has() - check existence
sp.has('color');  // true

// delete() - remove
sp.delete('color');

// toString() - serialize
sp.toString();  // 'size=large'

// sort() - sort alphabetically
sp.sort();

// entries(), keys(), values(), forEach()
sp.forEach((value, key) => {
    console.log(`${key}: ${value}`);
});

// -------------------------------------------------------------------------------------------
// 8. URL MANIPULATION
// -------------------------------------------------------------------------------------------

const pageUrl = new URL('https://example.com/page');

// Add query params
pageUrl.searchParams.append('page', '1');
pageUrl.searchParams.append('sort', 'date');
console.log(pageUrl.href);  // https://example.com/page?page=1&sort=date

// Modify existing
pageUrl.searchParams.set('page', '2');

// Get from current page
const currentParams = new URLSearchParams(window.location.search);
const currentPage = currentParams.get('page');

// Update URL without reload
function updateQueryParam(key, value) {
    const url = new URL(window.location);
    if (value === null) {
        url.searchParams.delete(key);
    } else {
        url.searchParams.set(key, value);
    }
    history.pushState({}, '', url);
}

// -------------------------------------------------------------------------------------------
// 9. ENCODING AND DECODING
// -------------------------------------------------------------------------------------------

// URLSearchParams handles encoding automatically
const encoded = new URLSearchParams({ message: 'Hello World!' });
encoded.toString();  // 'message=Hello+World%21'

// Manual encoding
encodeURIComponent('Hello World!');  // 'Hello%20World!'
decodeURIComponent('Hello%20World!');  // 'Hello World!'

// Difference: space encoding
// URLSearchParams uses + for spaces
// encodeURIComponent uses %20

// Parse query string manually
function parseQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Build API URL
function buildApiUrl(base, params) {
    const url = new URL(base);
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.append(key, value);
        }
    });
    return url.toString();
}

const apiUrl = buildApiUrl('https://api.example.com/search', {
    query: 'javascript',
    page: 1,
    limit: 20
});

// Form submission handler
async function handleSubmit(formElement) {
    const formData = new FormData(formElement);
    
    // Validate
    if (!formData.get('email')) {
        throw new Error('Email is required');
    }
    
    // Send
    const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}

// Filter form to URLSearchParams
function buildFilterUrl(baseUrl, filterForm) {
    const formData = new FormData(filterForm);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
        if (value) {  // Only non-empty values
            params.append(key, value);
        }
    }
    
    return `${baseUrl}?${params.toString()}`;
}

// -------------------------------------------------------------------------------------------
// 11. FORM VALIDATION PATTERN
// -------------------------------------------------------------------------------------------

function validateFormData(formData, rules) {
    const errors = {};
    
    for (const [field, validators] of Object.entries(rules)) {
        const value = formData.get(field);
        
        for (const validate of validators) {
            const error = validate(value);
            if (error) {
                errors[field] = error;
                break;
            }
        }
    }
    
    return Object.keys(errors).length ? errors : null;
}

const rules = {
    email: [
        v => !v && 'Email is required',
        v => !v.includes('@') && 'Invalid email format'
    ],
    password: [
        v => !v && 'Password is required',
        v => v.length < 8 && 'Password must be 8+ characters'
    ]
};

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * FORMDATA:
 * - Handles form submissions
 * - Supports file uploads
 * - Methods: append, set, get, getAll, delete, has
 * - Iterable with entries/keys/values
 * 
 * URLSEARCHPARAMS:
 * - Manipulates query strings
 * - Auto-encodes values
 * - Works with URL object
 * - Methods: append, set, get, getAll, delete, has, sort
 * 
 * KEY POINTS:
 * - FormData: Don't set Content-Type (browser sets boundary)
 * - URLSearchParams: Uses + for spaces, not %20
 * - Both are iterable
 * 
 * USE CASES:
 * - File uploads
 * - Form handling
 * - URL building
 * - Query string parsing
 */
