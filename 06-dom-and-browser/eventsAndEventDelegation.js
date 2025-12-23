/**
 * TOPIC: EVENTS & EVENT DELEGATION
 * DESCRIPTION:
 * Events are signals that something has happened. Event delegation
 * leverages event bubbling to handle events efficiently on parent
 * elements instead of individual children.
 */

// -------------------------------------------------------------------------------------------
// 1. EVENT BASICS
// -------------------------------------------------------------------------------------------

const button = document.querySelector('#myButton');

// Add event listener
button.addEventListener('click', function(event) {
    console.log('Button clicked!');
    console.log('Event type:', event.type);
    console.log('Target:', event.target);
});

// Remove event listener (must use same function reference)
function handleClick(event) {
    console.log('Clicked');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick);

// -------------------------------------------------------------------------------------------
// 2. EVENT OBJECT
// -------------------------------------------------------------------------------------------

document.addEventListener('click', (event) => {
    // Common properties
    event.type;          // 'click'
    event.target;        // Element that triggered event
    event.currentTarget; // Element listener is attached to
    event.timeStamp;     // When event occurred
    
    // Position (for mouse events)
    event.clientX;       // X relative to viewport
    event.clientY;       // Y relative to viewport
    event.pageX;         // X relative to document
    event.pageY;         // Y relative to document
    
    // Keyboard/mouse state
    event.shiftKey;      // Shift held?
    event.ctrlKey;       // Ctrl held?
    event.altKey;        // Alt held?
    event.metaKey;       // Cmd (Mac) / Win key held?
    event.button;        // Which mouse button (0=left, 1=middle, 2=right)
});

// -------------------------------------------------------------------------------------------
// 3. EVENT PROPAGATION
// -------------------------------------------------------------------------------------------

/**
 * Events flow in 3 phases:
 * 1. CAPTURING: Window → Document → ... → Target
 * 2. TARGET: Event reaches target element
 * 3. BUBBLING: Target → ... → Document → Window
 */

const parent = document.querySelector('.parent');
const child = document.querySelector('.child');

// Bubbling (default)
parent.addEventListener('click', () => console.log('Parent (bubbling)'));
child.addEventListener('click', () => console.log('Child'));
// Click child: "Child" → "Parent (bubbling)"

// Capturing (third parameter true)
parent.addEventListener('click', () => console.log('Parent (capturing)'), true);
// Click child: "Parent (capturing)" → "Child" → "Parent (bubbling)"

// -------------------------------------------------------------------------------------------
// 4. STOPPING PROPAGATION
// -------------------------------------------------------------------------------------------

child.addEventListener('click', (event) => {
    event.stopPropagation();  // Stop bubbling up
    console.log('Child clicked, stopped propagation');
});

// stopImmediatePropagation - also stops other listeners on same element
child.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
});
child.addEventListener('click', (event) => {
    console.log('This will NOT run');
});

// -------------------------------------------------------------------------------------------
// 5. PREVENTING DEFAULT
// -------------------------------------------------------------------------------------------

const link = document.querySelector('a');
link.addEventListener('click', (event) => {
    event.preventDefault();  // Don't navigate
    console.log('Link clicked but not followed');
});

const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    event.preventDefault();  // Don't submit
    console.log('Form submission prevented');
});

// Check if default was prevented
if (!event.defaultPrevented) {
    // Handle normally
}

// -------------------------------------------------------------------------------------------
// 6. EVENT DELEGATION
// -------------------------------------------------------------------------------------------

/**
 * Instead of adding listeners to each child, add one to parent.
 * Uses event bubbling.
 */

// BAD: Listener on each item (memory inefficient)
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', handleItemClick);
});

// GOOD: Single listener on parent
const list = document.querySelector('.list');
list.addEventListener('click', (event) => {
    // Check if clicked element is an item
    if (event.target.matches('.item')) {
        handleItemClick(event);
    }
    
    // Or find closest matching parent
    const item = event.target.closest('.item');
    if (item) {
        handleItemClick(event);
    }
});

function handleItemClick(event) {
    console.log('Item clicked:', event.target);
}

// Benefits:
// - Less memory (fewer listeners)
// - Works with dynamically added elements
// - Single point of setup

// -------------------------------------------------------------------------------------------
// 7. COMMON EVENTS
// -------------------------------------------------------------------------------------------

// Mouse events
element.addEventListener('click', handler);
element.addEventListener('dblclick', handler);
element.addEventListener('mousedown', handler);
element.addEventListener('mouseup', handler);
element.addEventListener('mousemove', handler);
element.addEventListener('mouseenter', handler);  // No bubbling
element.addEventListener('mouseleave', handler);  // No bubbling
element.addEventListener('mouseover', handler);   // Bubbles
element.addEventListener('mouseout', handler);    // Bubbles
element.addEventListener('contextmenu', handler); // Right-click

// Keyboard events
document.addEventListener('keydown', handler);
document.addEventListener('keyup', handler);
document.addEventListener('keypress', handler);  // Deprecated

// Form events
form.addEventListener('submit', handler);
input.addEventListener('input', handler);    // Every change
input.addEventListener('change', handler);   // On blur
input.addEventListener('focus', handler);
input.addEventListener('blur', handler);

// Window events
window.addEventListener('load', handler);      // Full page load
window.addEventListener('DOMContentLoaded', handler);  // DOM ready
window.addEventListener('resize', handler);
window.addEventListener('scroll', handler);
window.addEventListener('beforeunload', handler);

// Touch events (mobile)
element.addEventListener('touchstart', handler);
element.addEventListener('touchmove', handler);
element.addEventListener('touchend', handler);

// -------------------------------------------------------------------------------------------
// 8. KEYBOARD EVENT HANDLING
// -------------------------------------------------------------------------------------------

document.addEventListener('keydown', (event) => {
    // Key identification
    console.log('Key:', event.key);       // 'Enter', 'a', 'ArrowUp'
    console.log('Code:', event.code);     // 'Enter', 'KeyA', 'ArrowUp'
    
    // Shortcuts
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        console.log('Ctrl+S pressed');
    }
    
    // Arrow keys
    if (event.key === 'ArrowUp') console.log('Up');
    if (event.key === 'ArrowDown') console.log('Down');
    if (event.key === 'Escape') console.log('Escape');
    if (event.key === 'Enter') console.log('Enter');
});

// -------------------------------------------------------------------------------------------
// 9. CUSTOM EVENTS
// -------------------------------------------------------------------------------------------

// Create custom event
const customEvent = new CustomEvent('userLoggedIn', {
    detail: { userId: 123, username: 'alice' },
    bubbles: true,
    cancelable: true
});

// Listen for custom event
document.addEventListener('userLoggedIn', (event) => {
    console.log('User logged in:', event.detail);
});

// Dispatch custom event
document.dispatchEvent(customEvent);

// -------------------------------------------------------------------------------------------
// 10. EVENT LISTENER OPTIONS
// -------------------------------------------------------------------------------------------

element.addEventListener('click', handler, {
    once: true,         // Remove after first invocation
    passive: true,      // Won't call preventDefault (better scroll perf)
    capture: true,      // Use capture phase
    signal: controller.signal  // AbortController signal
});

// Using AbortController to remove listener
const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Later: remove listener
controller.abort();

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL DELEGATION PATTERNS
// -------------------------------------------------------------------------------------------

// Todo list example
document.querySelector('.todo-list').addEventListener('click', (event) => {
    const target = event.target;
    const todoItem = target.closest('.todo-item');
    
    if (!todoItem) return;
    
    if (target.matches('.delete-btn')) {
        todoItem.remove();
    } else if (target.matches('.toggle-btn')) {
        todoItem.classList.toggle('completed');
    } else if (target.matches('.edit-btn')) {
        startEditing(todoItem);
    }
});

function startEditing(item) {
    // Edit logic
}

// Tab navigation
document.querySelector('.tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('.tab');
    if (!tab) return;
    
    // Deactivate all
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    // Activate clicked
    tab.classList.add('active');
    const panelId = tab.dataset.panel;
    document.getElementById(panelId).classList.add('active');
});

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * EVENT FLOW:
 * - Capturing → Target → Bubbling
 * - stopPropagation() stops bubbling
 * - preventDefault() prevents default action
 * 
 * EVENT DELEGATION:
 * - Add listener to parent
 * - Use event.target or closest() to identify source
 * - Benefits: Less memory, works with dynamic elements
 * 
 * BEST PRACTICES:
 * - Use delegation for lists/dynamic content
 * - Use passive: true for scroll/touch
 * - Use once: true for one-time handlers
 * - Use AbortController for cleanup
 */
