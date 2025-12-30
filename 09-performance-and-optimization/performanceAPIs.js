/**
 * TOPIC: PERFORMANCE APIS
 * DESCRIPTION:
 * Browser Performance APIs provide precise timing measurements and
 * performance monitoring capabilities. Essential for identifying
 * bottlenecks, measuring user experience, and optimizing applications.
 * Includes Navigation Timing, Resource Timing, User Timing, and more.
 */

// -------------------------------------------------------------------------------------------
// 1. HIGH-RESOLUTION TIME (performance.now)
// -------------------------------------------------------------------------------------------

/**
 * performance.now() provides microsecond precision.
 * Unlike Date.now(), it's monotonically increasing (not affected by system clock changes).
 */

const startTime = performance.now();

// Simulate some work
let sum = 0;
for (let i = 0; i < 1000000; i++) {
    sum += Math.sqrt(i);
}

const endTime = performance.now();
const duration = endTime - startTime;

console.log(`Operation took ${duration.toFixed(3)} milliseconds`);

// Timing utility function
function measureTime(fn, label = 'Operation') {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(3)}ms`);
    return result;
}

// Async timing
async function measureTimeAsync(fn, label = 'Async Operation') {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${label}: ${(end - start).toFixed(3)}ms`);
    return result;
}

// Usage
measureTime(() => {
    const arr = Array.from({ length: 10000 }, () => Math.random());
    arr.sort((a, b) => a - b);
}, 'Array sort');

// -------------------------------------------------------------------------------------------
// 2. USER TIMING API (Marks and Measures)
// -------------------------------------------------------------------------------------------

/**
 * Create custom performance entries for your own timing needs.
 * Great for tracking specific application milestones.
 */

// Check for browser environment
if (typeof performance !== 'undefined' && performance.mark) {
    // Mark the start of an operation
    performance.mark('fetch-start');

    // Simulate async operation
    setTimeout(() => {
        // Mark the end
        performance.mark('fetch-end');

        // Create a measure between two marks
        performance.measure('fetch-duration', 'fetch-start', 'fetch-end');

        // Get the measure
        const measures = performance.getEntriesByName('fetch-duration');
        console.log('Fetch duration:', measures[0]?.duration.toFixed(3), 'ms');

        // Get all marks
        const marks = performance.getEntriesByType('mark');
        console.log('All marks:', marks.map(m => m.name));

        // Clear entries when done
        performance.clearMarks();
        performance.clearMeasures();
    }, 100);
}

// Wrapper for common timing patterns
class PerformanceTracker {
    constructor(name) {
        this.name = name;
        this.startMark = `${name}-start`;
        this.endMark = `${name}-end`;
    }

    start() {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(this.startMark);
        }
        this.startTime = performance.now();
    }

    end() {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(this.endMark);
            performance.measure(this.name, this.startMark, this.endMark);
        }
        this.endTime = performance.now();
        return this.getDuration();
    }

    getDuration() {
        return this.endTime - this.startTime;
    }

    getEntry() {
        if (typeof performance !== 'undefined' && performance.getEntriesByName) {
            const entries = performance.getEntriesByName(this.name);
            return entries[entries.length - 1];
        }
        return null;
    }
}

// Usage
const tracker = new PerformanceTracker('data-processing');
tracker.start();
// ... do work ...
const trackerDuration = tracker.end();
console.log(`Data processing took ${trackerDuration.toFixed(2)}ms`);

// -------------------------------------------------------------------------------------------
// 3. NAVIGATION TIMING API
// -------------------------------------------------------------------------------------------

/**
 * Detailed timing information about page load.
 * Only available in browser context.
 */

function getNavigationTiming() {
    if (typeof window === 'undefined' || !window.performance) {
        console.log('Navigation Timing not available (Node.js environment)');
        return null;
    }

    const timing = performance.getEntriesByType('navigation')[0];
    
    if (!timing) return null;

    return {
        // DNS lookup
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        
        // TCP connection
        tcp: timing.connectEnd - timing.connectStart,
        
        // TLS negotiation (if HTTPS)
        tls: timing.secureConnectionStart > 0 
            ? timing.connectEnd - timing.secureConnectionStart 
            : 0,
        
        // Time to First Byte (TTFB)
        ttfb: timing.responseStart - timing.requestStart,
        
        // Content download
        download: timing.responseEnd - timing.responseStart,
        
        // DOM parsing
        domParsing: timing.domInteractive - timing.responseEnd,
        
        // DOM content loaded
        domContentLoaded: timing.domContentLoadedEventEnd - timing.fetchStart,
        
        // Full page load
        pageLoad: timing.loadEventEnd - timing.fetchStart,
        
        // Time to interactive
        interactive: timing.domInteractive - timing.fetchStart
    };
}

console.log('Navigation Timing:', getNavigationTiming());

// -------------------------------------------------------------------------------------------
// 4. RESOURCE TIMING API
// -------------------------------------------------------------------------------------------

/**
 * Timing information for each resource loaded by the page.
 */

function getResourceTiming() {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
        console.log('Resource Timing not available');
        return [];
    }

    const resources = performance.getEntriesByType('resource');
    
    return resources.map(resource => ({
        name: resource.name.split('/').pop(),  // Just filename
        type: resource.initiatorType,
        size: resource.transferSize,
        duration: resource.duration.toFixed(2),
        dns: (resource.domainLookupEnd - resource.domainLookupStart).toFixed(2),
        tcp: (resource.connectEnd - resource.connectStart).toFixed(2),
        ttfb: (resource.responseStart - resource.requestStart).toFixed(2),
        download: (resource.responseEnd - resource.responseStart).toFixed(2),
        cached: resource.transferSize === 0
    }));
}

// Find slow resources
function findSlowResources(threshold = 500) {
    return getResourceTiming().filter(r => parseFloat(r.duration) > threshold);
}

console.log('Slow resources:', findSlowResources(100));

// -------------------------------------------------------------------------------------------
// 5. PERFORMANCE OBSERVER
// -------------------------------------------------------------------------------------------

/**
 * Observe performance entries as they happen.
 * Great for real-time monitoring.
 */

if (typeof PerformanceObserver !== 'undefined') {
    // Observe long tasks (tasks > 50ms)
    try {
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('Long task detected:', {
                    duration: entry.duration.toFixed(2) + 'ms',
                    startTime: entry.startTime.toFixed(2)
                });
            }
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
        console.log('Long task observation not supported');
    }

    // Observe layout shifts (CLS)
    try {
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    console.log('Layout shift:', entry.value);
                }
            }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
        console.log('Layout shift observation not supported');
    }

    // Observe largest contentful paint (LCP)
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry?.startTime.toFixed(2) + 'ms');
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('LCP observation not supported');
    }
}

// -------------------------------------------------------------------------------------------
// 6. CORE WEB VITALS
// -------------------------------------------------------------------------------------------

/**
 * Measure essential user experience metrics.
 */

class CoreWebVitals {
    constructor() {
        this.metrics = {
            lcp: null,   // Largest Contentful Paint
            fid: null,   // First Input Delay
            cls: 0,      // Cumulative Layout Shift
            fcp: null,   // First Contentful Paint
            ttfb: null   // Time to First Byte
        };
        
        this.init();
    }

    init() {
        if (typeof PerformanceObserver === 'undefined') {
            console.log('PerformanceObserver not available');
            return;
        }

        // LCP
        try {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                this.metrics.lcp = entries[entries.length - 1]?.startTime;
            }).observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {}

        // FID
        try {
            new PerformanceObserver((list) => {
                const entry = list.getEntries()[0];
                this.metrics.fid = entry?.processingStart - entry?.startTime;
            }).observe({ entryTypes: ['first-input'] });
        } catch (e) {}

        // CLS
        try {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.metrics.cls += entry.value;
                    }
                }
            }).observe({ entryTypes: ['layout-shift'] });
        } catch (e) {}

        // FCP
        try {
            new PerformanceObserver((list) => {
                const entry = list.getEntries()[0];
                this.metrics.fcp = entry?.startTime;
            }).observe({ entryTypes: ['paint'] });
        } catch (e) {}
    }

    getMetrics() {
        return { ...this.metrics };
    }

    getScore() {
        // Simplified scoring based on Core Web Vitals thresholds
        const scores = {
            lcp: this.metrics.lcp <= 2500 ? 'good' : this.metrics.lcp <= 4000 ? 'needs-improvement' : 'poor',
            fid: this.metrics.fid <= 100 ? 'good' : this.metrics.fid <= 300 ? 'needs-improvement' : 'poor',
            cls: this.metrics.cls <= 0.1 ? 'good' : this.metrics.cls <= 0.25 ? 'needs-improvement' : 'poor'
        };
        return scores;
    }
}

// -------------------------------------------------------------------------------------------
// 7. MEMORY API
// -------------------------------------------------------------------------------------------

/**
 * Monitor memory usage (Chrome only).
 */

function getMemoryInfo() {
    if (typeof performance === 'undefined' || !performance.memory) {
        console.log('Memory API not available');
        return null;
    }

    const memory = performance.memory;
    
    return {
        usedHeap: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
        totalHeap: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
        heapLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
        usagePercent: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1) + '%'
    };
}

console.log('Memory:', getMemoryInfo());

// Memory monitor
class MemoryMonitor {
    constructor(interval = 5000) {
        this.interval = interval;
        this.history = [];
        this.running = false;
    }

    start() {
        if (typeof performance === 'undefined' || !performance.memory) {
            console.log('Memory monitoring not available');
            return;
        }

        this.running = true;
        this.timer = setInterval(() => {
            const info = getMemoryInfo();
            if (info) {
                this.history.push({
                    timestamp: Date.now(),
                    ...info
                });
                
                // Keep last 100 entries
                if (this.history.length > 100) {
                    this.history.shift();
                }
            }
        }, this.interval);
    }

    stop() {
        this.running = false;
        clearInterval(this.timer);
    }

    getHistory() {
        return [...this.history];
    }

    detectLeak() {
        if (this.history.length < 10) return null;
        
        const recent = this.history.slice(-10);
        const firstUsage = parseFloat(recent[0].usedHeap);
        const lastUsage = parseFloat(recent[recent.length - 1].usedHeap);
        
        const increase = lastUsage - firstUsage;
        return increase > 10 ? `Potential leak: +${increase.toFixed(2)} MB` : null;
    }
}

// -------------------------------------------------------------------------------------------
// 8. FRAME TIMING / ANIMATION PERFORMANCE
// -------------------------------------------------------------------------------------------

/**
 * Monitor rendering performance and frame drops.
 */

class FrameMonitor {
    constructor() {
        this.frames = [];
        this.running = false;
        this.lastTime = 0;
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.tick();
    }

    tick() {
        if (!this.running) return;

        const now = performance.now();
        const delta = now - this.lastTime;
        this.lastTime = now;

        this.frames.push({
            timestamp: now,
            delta,
            fps: 1000 / delta
        });

        // Keep last 60 frames
        if (this.frames.length > 60) {
            this.frames.shift();
        }

        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => this.tick());
        }
    }

    stop() {
        this.running = false;
    }

    getStats() {
        if (this.frames.length === 0) return null;

        const fpsList = this.frames.map(f => f.fps);
        const avg = fpsList.reduce((a, b) => a + b, 0) / fpsList.length;
        const min = Math.min(...fpsList);
        const max = Math.max(...fpsList);
        const droppedFrames = fpsList.filter(fps => fps < 50).length;

        return {
            averageFPS: avg.toFixed(1),
            minFPS: min.toFixed(1),
            maxFPS: max.toFixed(1),
            droppedFrames,
            frameCount: this.frames.length
        };
    }
}

// -------------------------------------------------------------------------------------------
// 9. CUSTOM PERFORMANCE PROFILER
// -------------------------------------------------------------------------------------------

/**
 * Full-featured performance profiler.
 */

class PerformanceProfiler {
    constructor() {
        this.profiles = new Map();
    }

    profile(name) {
        const profileData = {
            name,
            startTime: performance.now(),
            endTime: null,
            children: [],
            parent: null
        };
        
        this.profiles.set(name, profileData);

        return {
            end: () => {
                profileData.endTime = performance.now();
                return profileData.endTime - profileData.startTime;
            },
            child: (childName) => {
                const child = this.profile(childName);
                profileData.children.push(childName);
                return child;
            }
        };
    }

    getProfile(name) {
        const profile = this.profiles.get(name);
        if (!profile) return null;

        return {
            name: profile.name,
            duration: profile.endTime - profile.startTime,
            children: profile.children.map(c => this.getProfile(c))
        };
    }

    getAllProfiles() {
        return Array.from(this.profiles.values()).map(p => ({
            name: p.name,
            duration: p.endTime ? (p.endTime - p.startTime).toFixed(2) + 'ms' : 'running'
        }));
    }

    clear() {
        this.profiles.clear();
    }
}

// Usage
const profiler = new PerformanceProfiler();

const main = profiler.profile('main');

// Simulate work
const init = main.child('initialization');
let x = 0;
for (let i = 0; i < 100000; i++) x += i;
init.end();

const process = main.child('processing');
for (let i = 0; i < 200000; i++) x += Math.sqrt(i);
process.end();

main.end();

console.log('Profiler results:', profiler.getAllProfiles());

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * PERFORMANCE APIs:
 * - performance.now() - High-resolution timing
 * - User Timing API - Custom marks and measures
 * - Navigation Timing - Page load metrics
 * - Resource Timing - Per-resource metrics
 * - PerformanceObserver - Real-time observation
 *
 * CORE WEB VITALS:
 * - LCP (Largest Contentful Paint) - Loading
 * - FID (First Input Delay) - Interactivity
 * - CLS (Cumulative Layout Shift) - Visual stability
 *
 * USE CASES:
 * - Performance monitoring
 * - Bottleneck identification
 * - User experience tracking
 * - A/B testing impact
 * - Real User Monitoring (RUM)
 *
 * BEST PRACTICES:
 * - Use performance.now() over Date.now() for timing
 * - Clear marks/measures when done
 * - Use PerformanceObserver for non-blocking observation
 * - Monitor Core Web Vitals in production
 * - Set up alerting for performance regressions
 * - Sample data in high-traffic scenarios
 */
