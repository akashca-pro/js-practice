/**
 * TOPIC: DOM TRAVERSAL & MANIPULATION
 * DESCRIPTION:
 * The Document Object Model (DOM) represents HTML as a tree of nodes.
 * JavaScript can traverse this tree and manipulate elements to create
 * dynamic, interactive web pages.
 */

// -------------------------------------------------------------------------------------------
// 1. SELECTING ELEMENTS
// -------------------------------------------------------------------------------------------

// By ID
const header = document.getElementById('header');

// By class name (returns HTMLCollection)
const buttons = document.getElementsByClassName('btn');

// By tag name (returns HTMLCollection)
const paragraphs = document.getElementsByTagName('p');

// Query selector (returns first match)
const firstBtn = document.querySelector('.btn');
const navLink = document.querySelector('nav a.active');

// Query selector all (returns NodeList)
const allBtns = document.querySelectorAll('.btn');

// -------------------------------------------------------------------------------------------
// 2. TRAVERSING THE DOM
// -------------------------------------------------------------------------------------------

const element = document.querySelector('.item');

// Parent
const parent = element.parentElement;
const parentNode = element.parentNode;  // Includes text nodes

// Children
const children = element.children;  // HTMLCollection
const childNodes = element.childNodes;  // NodeList (includes text)
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;

// Siblings
const nextSibling = element.nextElementSibling;
const prevSibling = element.previousElementSibling;

// Closest ancestor matching selector
const closestContainer = element.closest('.container');

// -------------------------------------------------------------------------------------------
// 3. CREATING ELEMENTS
// -------------------------------------------------------------------------------------------

// Create element
const div = document.createElement('div');
div.id = 'myDiv';
div.className = 'container active';
div.textContent = 'Hello World';

// Create text node
const text = document.createTextNode('Some text');

// Create from HTML string
const template = '<div class="card"><h2>Title</h2></div>';
const tempContainer = document.createElement('div');
tempContainer.innerHTML = template;
const cardElement = tempContainer.firstElementChild;

// -------------------------------------------------------------------------------------------
// 4. INSERTING ELEMENTS
// -------------------------------------------------------------------------------------------

const container = document.querySelector('.container');
const newElement = document.createElement('div');

// Append (adds to end)
container.appendChild(newElement);
container.append(newElement, 'text');  // Can add multiple, including text

// Prepend (adds to beginning)
container.prepend(newElement);

// Insert before specific element
const reference = document.querySelector('.reference');
container.insertBefore(newElement, reference);

// Insert adjacent (more flexible)
element.insertAdjacentElement('beforebegin', newElement);  // Before element
element.insertAdjacentElement('afterbegin', newElement);   // First child
element.insertAdjacentElement('beforeend', newElement);    // Last child
element.insertAdjacentElement('afterend', newElement);     // After element

// Insert HTML string
element.insertAdjacentHTML('beforeend', '<span>New</span>');

// -------------------------------------------------------------------------------------------
// 5. REMOVING ELEMENTS
// -------------------------------------------------------------------------------------------

// Remove element
element.remove();

// Remove child
parent.removeChild(child);

// Remove all children
parent.innerHTML = '';
// or
while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
}

// -------------------------------------------------------------------------------------------
// 6. REPLACING ELEMENTS
// -------------------------------------------------------------------------------------------

const oldElement = document.querySelector('.old');
const replacement = document.createElement('div');

// Replace with replaceWith
oldElement.replaceWith(replacement);

// Replace child
parent.replaceChild(replacement, oldElement);

// -------------------------------------------------------------------------------------------
// 7. CLONING ELEMENTS
// -------------------------------------------------------------------------------------------

// Shallow clone (just the element)
const shallowClone = element.cloneNode(false);

// Deep clone (includes all descendants)
const deepClone = element.cloneNode(true);

// -------------------------------------------------------------------------------------------
// 8. MODIFYING ATTRIBUTES
// -------------------------------------------------------------------------------------------

// Get attribute
const href = link.getAttribute('href');

// Set attribute
element.setAttribute('data-id', '123');

// Remove attribute
element.removeAttribute('disabled');

// Check if attribute exists
const hasDisabled = element.hasAttribute('disabled');

// Direct property access
element.id = 'newId';
element.className = 'new-class';
element.href = 'https://example.com';

// Data attributes
element.dataset.userId = '42';        // Sets data-user-id="42"
console.log(element.dataset.userId);  // Reads data-user-id

// -------------------------------------------------------------------------------------------
// 9. MODIFYING CLASSES
// -------------------------------------------------------------------------------------------

// Add class
element.classList.add('active');
element.classList.add('one', 'two', 'three');

// Remove class
element.classList.remove('active');

// Toggle class
element.classList.toggle('visible');
element.classList.toggle('visible', condition);  // Force add/remove

// Check for class
const hasActive = element.classList.contains('active');

// Replace class
element.classList.replace('old-class', 'new-class');

// -------------------------------------------------------------------------------------------
// 10. MODIFYING STYLES
// -------------------------------------------------------------------------------------------

// Inline styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';  // camelCase for CSS properties
element.style.cssText = 'color: red; background: blue;';  // Multiple at once

// Get computed styles
const styles = getComputedStyle(element);
console.log(styles.color);
console.log(styles.getPropertyValue('background-color'));

// CSS custom properties
element.style.setProperty('--main-color', 'red');
const mainColor = element.style.getPropertyValue('--main-color');

// -------------------------------------------------------------------------------------------
// 11. CONTENT MODIFICATION
// -------------------------------------------------------------------------------------------

// Text content (only text, no HTML)
element.textContent = 'Plain text';

// Inner HTML (parses HTML)
element.innerHTML = '<strong>Bold</strong> text';

// Outer HTML (includes the element itself)
console.log(element.outerHTML);
element.outerHTML = '<div class="replaced">New content</div>';

// -------------------------------------------------------------------------------------------
// 12. DOCUMENT FRAGMENTS
// -------------------------------------------------------------------------------------------

/**
 * DocumentFragment is a lightweight container for batch DOM operations.
 * Avoids multiple reflows.
 */

const fragment = document.createDocumentFragment();

for (let i = 0; i < 100; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);
}

// Single DOM operation
document.querySelector('ul').appendChild(fragment);

// -------------------------------------------------------------------------------------------
// 13. PRACTICAL PATTERNS
// -------------------------------------------------------------------------------------------

// Create element helper
function createElement(tag, attributes = {}, children = []) {
    const el = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') el.className = value;
        else if (key === 'style') Object.assign(el.style, value);
        else if (key.startsWith('data')) el.dataset[key.slice(4).toLowerCase()] = value;
        else el.setAttribute(key, value);
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(child);
        }
    });
    
    return el;
}

// Usage
const card = createElement('div', { className: 'card' }, [
    createElement('h2', {}, ['Title']),
    createElement('p', {}, ['Description'])
]);

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SELECTING:
 * - getElementById, getElementsByClassName, getElementsByTagName
 * - querySelector, querySelectorAll
 * 
 * TRAVERSING:
 * - parentElement, children, siblings
 * - closest() for ancestor matching
 * 
 * MANIPULATING:
 * - createElement, appendChild, insertBefore
 * - remove, replaceWith, cloneNode
 * - setAttribute, classList, style
 * 
 * PERFORMANCE:
 * - Use DocumentFragment for batch operations
 * - Minimize reflows (batch style changes)
 * - Cache DOM references
 */
