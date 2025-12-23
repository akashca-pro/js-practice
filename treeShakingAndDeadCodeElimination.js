/**
 * TOPIC: TREE SHAKING & DEAD CODE ELIMINATION
 * DESCRIPTION:
 * Tree shaking removes unused code from bundles. Dead code elimination
 * removes unreachable code. Both reduce bundle size and improve
 * performance. Works best with ES Modules.
 */

// -------------------------------------------------------------------------------------------
// 1. WHAT IS TREE SHAKING?
// -------------------------------------------------------------------------------------------

/**
 * Tree shaking = removing unused exports from modules.
 * 
 * Metaphor: Shake the dependency tree, dead leaves (unused code) fall off.
 * 
 * Requirements:
 * 1. ES Modules (import/export) - statically analyzable
 * 2. No side effects in module scope
 * 3. Bundler support (Webpack, Rollup, Vite, esbuild)
 */

// -------------------------------------------------------------------------------------------
// 2. ES MODULES ENABLE TREE SHAKING
// -------------------------------------------------------------------------------------------

// math.js - Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

// app.js - Only imports add
// import { add } from './math.js';
// 
// console.log(add(2, 3));

// Result: subtract, multiply, divide are NOT in final bundle

// -------------------------------------------------------------------------------------------
// 3. WHY COMMONJS CAN'T BE TREE SHAKEN
// -------------------------------------------------------------------------------------------

/**
 * CommonJS is dynamic - can't be analyzed statically.
 */

// Dynamic export
// if (condition) {
//     module.exports.foo = foo;
// }

// Dynamic import
// const fn = require(condition ? './a' : './b');

// Bundler can't know what's used at build time!

// -------------------------------------------------------------------------------------------
// 4. SIDE EFFECTS
// -------------------------------------------------------------------------------------------

/**
 * Side effects prevent tree shaking because bundler can't know
 * if removing the import would break something.
 */

// SIDE EFFECT IN MODULE SCOPE (bad for tree shaking)
/*
let counter = 0;
counter++;  // Side effect! Runs on import

export const getValue = () => counter;
*/

// SIDE EFFECT FREE (good for tree shaking)
/*
export function createCounter() {
    let counter = 0;
    return { getValue: () => counter, increment: () => counter++ };
}
*/

// -------------------------------------------------------------------------------------------
// 5. PACKAGE.JSON "SIDEEFFECTS"
// -------------------------------------------------------------------------------------------

/**
 * Tell bundler which files have side effects:
 * 
 * package.json:
 * {
 *   "sideEffects": false,  // All files are side-effect-free
 *   // or
 *   "sideEffects": [
 *     "*.css",
 *     "./src/polyfills.js"
 *   ]
 * }
 */

// -------------------------------------------------------------------------------------------
// 6. DEAD CODE ELIMINATION
// -------------------------------------------------------------------------------------------

/**
 * DCE removes code that can never execute.
 * Different from tree shaking (which removes unused exports).
 */

function example() {
    const a = 1;
    const b = 2;
    
    // Dead code - condition is always false
    if (false) {
        console.log('Never runs');
    }
    
    // Dead code - unreachable after return
    return a + b;
    console.log('Never runs');  // Removed by DCE
}

// -------------------------------------------------------------------------------------------
// 7. ENVIRONMENT-BASED DCE
// -------------------------------------------------------------------------------------------

/**
 * Bundlers replace process.env.NODE_ENV and eliminate dead branches.
 */

function logDebug(message) {
    if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG]', message);
    }
}

// After build with NODE_ENV=production:
// The entire if block is removed because condition is always false

// -------------------------------------------------------------------------------------------
// 8. PATTERNS THAT BREAK TREE SHAKING
// -------------------------------------------------------------------------------------------

// BAD: Re-exporting everything
// export * from './utils';  // Bundler may keep all

// BAD: Default export with object
// export default { add, subtract, multiply };
// import math from './math';  // Can't tree shake properties

// BAD: Class with unused methods
/*
class Utils {
    static add(a, b) { return a + b; }
    static subtract(a, b) { return a - b; }  // Can't remove even if unused
}
export default Utils;
*/

// GOOD: Named exports
export { add, subtract };

// GOOD: Separate modules
// import { add } from './math/add';

// -------------------------------------------------------------------------------------------
// 9. PATTERNS THAT HELP TREE SHAKING
// -------------------------------------------------------------------------------------------

// Use named exports
export function helper1() {}
export function helper2() {}

// Pure function annotations (for bundlers)
const result = /*#__PURE__*/ expensiveComputation();

// Inline re-exports
export { specificThing } from './module';

// Split into smaller modules
// Instead of one large utils.js, split into:
// - utils/strings.js
// - utils/arrays.js
// - utils/dates.js

// -------------------------------------------------------------------------------------------
// 10. CHECKING BUNDLE SIZE
// -------------------------------------------------------------------------------------------

/**
 * Tools to analyze what's in your bundle:
 * 
 * - webpack-bundle-analyzer
 * - source-map-explorer
 * - bundlephobia.com (check npm package size)
 * - Import Cost VSCode extension
 */

// -------------------------------------------------------------------------------------------
// 11. LIBRARY BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * If publishing a library:
 * 
 * 1. Use ES Modules as primary format
 * 2. Set "sideEffects": false in package.json
 * 3. Use named exports
 * 4. Split into submodules for granular imports
 * 5. Avoid side effects at module scope
 * 6. Provide "module" field in package.json
 */

/**
 * package.json for tree-shakeable library:
 * {
 *   "name": "my-lib",
 *   "main": "./dist/index.cjs",
 *   "module": "./dist/index.mjs",
 *   "sideEffects": false,
 *   "exports": {
 *     ".": {
 *       "import": "./dist/index.mjs",
 *       "require": "./dist/index.cjs"
 *     },
 *     "./submodule": {
 *       "import": "./dist/submodule.mjs",
 *       "require": "./dist/submodule.cjs"
 *     }
 *   }
 * }
 */

// -------------------------------------------------------------------------------------------
// 12. LODASH EXAMPLE
// -------------------------------------------------------------------------------------------

// BAD - imports entire lodash
// import _ from 'lodash';
// _.debounce(fn, 300);

// BETTER - named import (still may not tree shake)
// import { debounce } from 'lodash';

// BEST - import specific module
// import debounce from 'lodash/debounce';

// OR use lodash-es (ES module version)
// import { debounce } from 'lodash-es';

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * TREE SHAKING:
 * - Removes unused exports
 * - Requires ES Modules
 * - Use named exports
 * - Mark sideEffects in package.json
 * 
 * DEAD CODE ELIMINATION:
 * - Removes unreachable code
 * - Works with environment variables
 * - Happens during minification
 * 
 * BEST PRACTICES:
 * - Use named exports over default
 * - Avoid side effects in module scope
 * - Split large modules
 * - Use ES module versions of libraries
 * - Analyze your bundle regularly
 */
