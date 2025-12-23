/**
 * TOPIC: DYNAMIC IMPORTS
 * DESCRIPTION:
 * Dynamic imports allow loading modules on demand at runtime.
 * Essential for code splitting, lazy loading, and conditional
 * module loading. Returns a Promise that resolves to the module.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC DYNAMIC IMPORT
// -------------------------------------------------------------------------------------------

/**
 * import() returns a Promise that resolves to the module.
 */

// Static import (hoisted, synchronous)
// import { helper } from './utils.js';

// Dynamic import (runtime, async)
import('./utils.js')
    .then(module => {
        console.log(module.helper());
    })
    .catch(error => {
        console.error('Failed to load module:', error);
    });

// Async/await version
async function loadModule() {
    const module = await import('./utils.js');
    module.helper();
}

// -------------------------------------------------------------------------------------------
// 2. ACCESSING EXPORTS
// -------------------------------------------------------------------------------------------

// Named exports
async function loadNamed() {
    const { add, subtract, multiply } = await import('./math.js');
    console.log(add(2, 3));
}

// Default export
async function loadDefault() {
    const module = await import('./calculator.js');
    const Calculator = module.default;
    // or
    const { default: Calc } = await import('./calculator.js');
}

// All exports
async function loadAll() {
    const mathModule = await import('./math.js');
    console.log(Object.keys(mathModule));  // All exported names
}

// -------------------------------------------------------------------------------------------
// 3. CONDITIONAL LOADING
// -------------------------------------------------------------------------------------------

/**
 * Load modules based on conditions.
 */

async function loadFeature(featureName) {
    if (featureName === 'charts') {
        const { Chart } = await import('./features/charts.js');
        return new Chart();
    } else if (featureName === 'maps') {
        const { Map } = await import('./features/maps.js');
        return new Map();
    }
}

// Environment-based loading
async function loadConfig() {
    const env = process.env.NODE_ENV;
    const config = await import(`./config/${env}.js`);
    return config.default;
}

// Feature detection
async function loadPolyfill() {
    if (!window.IntersectionObserver) {
        await import('intersection-observer');
    }
}

// -------------------------------------------------------------------------------------------
// 4. LAZY LOADING COMPONENTS
// -------------------------------------------------------------------------------------------

/**
 * Load components only when needed.
 */

// UI component lazy loading
async function showModal() {
    const { Modal } = await import('./components/Modal.js');
    const modal = new Modal();
    modal.open();
}

// Route-based loading
const routes = {
    '/': () => import('./pages/Home.js'),
    '/about': () => import('./pages/About.js'),
    '/contact': () => import('./pages/Contact.js')
};

async function navigateTo(path) {
    const loader = routes[path];
    if (loader) {
        const { default: Page } = await loader();
        render(Page);
    }
}

function render(component) {
    // Render logic
}

// -------------------------------------------------------------------------------------------
// 5. CODE SPLITTING
// -------------------------------------------------------------------------------------------

/**
 * Bundlers (Webpack, Vite, Rollup) automatically
 * split code at dynamic import boundaries.
 */

// Main bundle
console.log('App starting...');

// Split into separate chunk
document.getElementById('heavyFeature').onclick = async () => {
    // This code is in a separate chunk
    const { HeavyFeature } = await import('./HeavyFeature.js');
    new HeavyFeature().init();
};

// Webpack magic comments
/*
const module = await import(
    /* webpackChunkName: "heavy-feature" */
    /* webpackPrefetch: true */
    // './HeavyFeature.js'
// );
*/

// -------------------------------------------------------------------------------------------
// 6. ERROR HANDLING
// -------------------------------------------------------------------------------------------

async function safeImport(modulePath) {
    try {
        return await import(modulePath);
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error(`Module not found: ${modulePath}`);
        } else {
            console.error(`Failed to load module: ${error.message}`);
        }
        return null;
    }
}

// With fallback
async function loadWithFallback(primary, fallback) {
    try {
        return await import(primary);
    } catch {
        console.warn(`Falling back from ${primary} to ${fallback}`);
        return await import(fallback);
    }
}

// -------------------------------------------------------------------------------------------
// 7. LOADING INDICATORS
// -------------------------------------------------------------------------------------------

async function loadWithIndicator(modulePath) {
    showSpinner();
    
    try {
        const module = await import(modulePath);
        hideSpinner();
        return module;
    } catch (error) {
        hideSpinner();
        showError('Failed to load feature');
        throw error;
    }
}

function showSpinner() {
    document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
}

function showError(message) {
    alert(message);
}

// -------------------------------------------------------------------------------------------
// 8. PARALLEL LOADING
// -------------------------------------------------------------------------------------------

async function loadMultiple() {
    // Sequential (slower)
    const mod1 = await import('./mod1.js');
    const mod2 = await import('./mod2.js');
    const mod3 = await import('./mod3.js');
    
    // Parallel (faster)
    const [module1, module2, module3] = await Promise.all([
        import('./mod1.js'),
        import('./mod2.js'),
        import('./mod3.js')
    ]);
    
    return { module1, module2, module3 };
}

// -------------------------------------------------------------------------------------------
// 9. REACT LAZY PATTERN
// -------------------------------------------------------------------------------------------

/**
 * React's lazy() wraps dynamic imports.
 */

/*
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <LazyComponent />
        </Suspense>
    );
}
*/

// Custom lazy implementation
function createLazy(importFn) {
    let component = null;
    let promise = null;
    
    return {
        load() {
            if (!promise) {
                promise = importFn().then(mod => {
                    component = mod.default;
                });
            }
            return promise;
        },
        get() {
            return component;
        }
    };
}

// -------------------------------------------------------------------------------------------
// 10. CACHING IMPORTS
// -------------------------------------------------------------------------------------------

/**
 * Dynamic imports are cached - subsequent imports
 * return the same module instance.
 */

async function testCaching() {
    const mod1 = await import('./module.js');
    const mod2 = await import('./module.js');
    
    console.log(mod1 === mod2);  // true - same instance
}

// Module registry pattern
const moduleCache = new Map();

async function loadCached(modulePath) {
    if (!moduleCache.has(modulePath)) {
        moduleCache.set(modulePath, await import(modulePath));
    }
    return moduleCache.get(modulePath);
}

// Preload for later
function preload(modulePath) {
    import(modulePath);  // No await, just triggers load
}

// -------------------------------------------------------------------------------------------
// 11. DYNAMIC MODULE PATH
// -------------------------------------------------------------------------------------------

// Variable in path
async function loadLocale(lang) {
    const translations = await import(`./locales/${lang}.js`);
    return translations.default;
}

// Template literal
async function loadTheme(theme) {
    return await import(`./themes/${theme}/index.js`);
}

// Note: Bundlers need some static analysis
// This may not work: import(variablePath)
// This works: import(`./known-prefix/${variable}.js`)

// -------------------------------------------------------------------------------------------
// 12. IMPORT ATTRIBUTES (Stage 3)
// -------------------------------------------------------------------------------------------

/**
 * Import attributes (formerly assertions) for special imports.
 */

// JSON import
// const config = await import('./config.json', { with: { type: 'json' } });

// CSS import
// const styles = await import('./styles.css', { with: { type: 'css' } });

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * DYNAMIC IMPORT:
 * - import() returns Promise<Module>
 * - Enables code splitting
 * - Conditional/lazy loading
 * 
 * ACCESSING EXPORTS:
 * - Named: const { a, b } = await import('...')
 * - Default: const { default: X } = await import('...')
 * 
 * USE CASES:
 * - Lazy loading components
 * - Route-based code splitting
 * - Conditional features
 * - Polyfill loading
 * 
 * BEST PRACTICES:
 * - Use for large/optional features
 * - Combine with loading indicators
 * - Handle errors gracefully
 * - Preload anticipated imports
 * - Use Promise.all for parallel loading
 */
