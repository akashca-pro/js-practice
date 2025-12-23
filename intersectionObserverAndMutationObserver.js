/**
 * TOPIC: INTERSECTION OBSERVER & MUTATION OBSERVER
 * DESCRIPTION:
 * IntersectionObserver detects when elements enter/exit the viewport.
 * MutationObserver watches for DOM changes. Both are more performant
 * than manual checking.
 */

// -------------------------------------------------------------------------------------------
// 1. INTERSECTION OBSERVER BASICS
// -------------------------------------------------------------------------------------------

/**
 * IntersectionObserver watches elements for viewport intersection.
 * More efficient than scroll event listeners.
 */

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        console.log('Element:', entry.target);
        console.log('Is intersecting:', entry.isIntersecting);
        console.log('Intersection ratio:', entry.intersectionRatio);
        console.log('Bounding rect:', entry.boundingClientRect);
    });
}, {
    root: null,           // null = viewport, or specify element
    rootMargin: '0px',    // margin around root
    threshold: 0          // 0-1 or array [0, 0.5, 1]
});

// Observe an element
// observer.observe(document.querySelector('.target'));

// Stop observing
// observer.unobserve(element);
// observer.disconnect();  // Stop all

// -------------------------------------------------------------------------------------------
// 2. LAZY LOADING IMAGES
// -------------------------------------------------------------------------------------------

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);  // Stop watching once loaded
            }
        });
    }, {
        rootMargin: '50px 0px'  // Start loading 50px before visible
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// HTML: <img data-src="actual-image.jpg" src="placeholder.jpg">

// -------------------------------------------------------------------------------------------
// 3. INFINITE SCROLL
// -------------------------------------------------------------------------------------------

function setupInfiniteScroll(sentinel, loadMore) {
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadMore();
        }
    }, {
        rootMargin: '100px'  // Trigger before reaching sentinel
    });
    
    observer.observe(sentinel);
    return observer;
}

// Usage:
// setupInfiniteScroll(
//     document.querySelector('.load-more-sentinel'),
//     () => fetchMoreData()
// );

// -------------------------------------------------------------------------------------------
// 4. ANIMATE ON SCROLL
// -------------------------------------------------------------------------------------------

function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);  // One-time animation
            }
        });
    }, {
        threshold: 0.2  // 20% visible before triggering
    });
    
    elements.forEach(el => observer.observe(el));
}

// -------------------------------------------------------------------------------------------
// 5. STICKY HEADER DETECTION
// -------------------------------------------------------------------------------------------

function setupStickyHeader(header) {
    // Create a sentinel above the header
    const sentinel = document.createElement('div');
    header.parentElement.insertBefore(sentinel, header);
    
    const observer = new IntersectionObserver((entries) => {
        header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    });
    
    observer.observe(sentinel);
}

// -------------------------------------------------------------------------------------------
// 6. MUTATION OBSERVER BASICS
// -------------------------------------------------------------------------------------------

/**
 * MutationObserver watches for DOM changes.
 * Replaces deprecated Mutation Events.
 */

const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        console.log('Type:', mutation.type);
        console.log('Target:', mutation.target);
        
        if (mutation.type === 'childList') {
            console.log('Added nodes:', mutation.addedNodes);
            console.log('Removed nodes:', mutation.removedNodes);
        }
        
        if (mutation.type === 'attributes') {
            console.log('Attribute:', mutation.attributeName);
            console.log('Old value:', mutation.oldValue);
        }
    });
});

// Configuration options
const config = {
    childList: true,      // Watch for child additions/removals
    subtree: true,        // Watch descendants too
    attributes: true,     // Watch attribute changes
    attributeOldValue: true,  // Record old attribute values
    attributeFilter: ['class', 'data-*'],  // Only these attributes
    characterData: true,  // Watch text content changes
    characterDataOldValue: true
};

// Start observing
// mutationObserver.observe(document.body, config);

// Stop observing
// mutationObserver.disconnect();

// Get pending mutations immediately
// const pending = mutationObserver.takeRecords();

// -------------------------------------------------------------------------------------------
// 7. WATCH FOR DYNAMIC CONTENT
// -------------------------------------------------------------------------------------------

function watchForElements(selector, callback) {
    // Check existing elements
    document.querySelectorAll(selector).forEach(callback);
    
    // Watch for new elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches(selector)) {
                        callback(node);
                    }
                    node.querySelectorAll(selector).forEach(callback);
                }
            });
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    return observer;
}

// Watch for new videos and auto-play
// watchForElements('video', (video) => {
//     video.play();
// });

// -------------------------------------------------------------------------------------------
// 8. ATTRIBUTE CHANGE DETECTION
// -------------------------------------------------------------------------------------------

function watchAttributes(element, callback) {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes') {
                callback(
                    mutation.attributeName,
                    element.getAttribute(mutation.attributeName),
                    mutation.oldValue
                );
            }
        });
    });
    
    observer.observe(element, {
        attributes: true,
        attributeOldValue: true
    });
    
    return observer;
}

// -------------------------------------------------------------------------------------------
// 9. RESIZE OBSERVER (BONUS)
// -------------------------------------------------------------------------------------------

/**
 * ResizeObserver watches for element size changes.
 */

const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        console.log(`${entry.target.id}: ${width}x${height}`);
    });
});

// resizeObserver.observe(document.querySelector('.resizable'));

// -------------------------------------------------------------------------------------------
// 10. COMBINING OBSERVERS
// -------------------------------------------------------------------------------------------

class ElementWatcher {
    constructor(element) {
        this.element = element;
        this.observers = [];
    }
    
    onVisible(callback, options = {}) {
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) callback(entries[0]);
        }, options);
        io.observe(this.element);
        this.observers.push(io);
        return this;
    }
    
    onMutate(callback, options = { childList: true }) {
        const mo = new MutationObserver(callback);
        mo.observe(this.element, options);
        this.observers.push(mo);
        return this;
    }
    
    onResize(callback) {
        const ro = new ResizeObserver(callback);
        ro.observe(this.element);
        this.observers.push(ro);
        return this;
    }
    
    disconnect() {
        this.observers.forEach(o => o.disconnect());
    }
}

// Usage:
// new ElementWatcher(element)
//     .onVisible(() => console.log('Visible!'))
//     .onResize((entries) => console.log('Resized!'))
//     .onMutate((mutations) => console.log('Changed!'));

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * INTERSECTION OBSERVER:
 * - Detects viewport intersection
 * - Use for: Lazy loading, infinite scroll, animations
 * - Options: root, rootMargin, threshold
 * 
 * MUTATION OBSERVER:
 * - Detects DOM changes
 * - Use for: Dynamic content, attribute changes
 * - Options: childList, attributes, characterData, subtree
 * 
 * RESIZE OBSERVER:
 * - Detects element size changes
 * - Use for: Responsive components
 * 
 * BENEFITS:
 * - More performant than scroll/resize events
 * - Batched updates
 * - No polling needed
 */
