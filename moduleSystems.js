/**
 * TOPIC: MODULE SYSTEMS (ESM vs CommonJS)
 * DESCRIPTION:
 * JavaScript has two main module systems: ES Modules (ESM) is the
 * standard, CommonJS (CJS) is used by Node.js traditionally.
 * Understanding both is crucial for modern JavaScript development.
 */

// -------------------------------------------------------------------------------------------
// 1. COMMONJS (CJS) - Node.js Traditional
// -------------------------------------------------------------------------------------------

/**
 * CommonJS uses require() and module.exports.
 * Synchronous loading, primarily for Node.js.
 */

// Exporting in CommonJS (math.js)
/*
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;

module.exports = { add, subtract };
// or
module.exports.add = add;
// or
exports.add = add;
*/

// Importing in CommonJS
/*
const math = require('./math');
console.log(math.add(2, 3));

// Destructuring
const { add, subtract } = require('./math');
*/

// -------------------------------------------------------------------------------------------
// 2. ES MODULES (ESM) - The Standard
// -------------------------------------------------------------------------------------------

/**
 * ESM uses import/export keywords.
 * Async loading, works in browsers and Node.js.
 */

// Named exports (utils.js)
export const PI = 3.14159;
export function double(x) { return x * 2; }
export class Calculator {
    add(a, b) { return a + b; }
}

// Default export (logger.js)
/*
export default class Logger {
    log(msg) { console.log(msg); }
}
*/

// Importing
/*
// Named imports
import { PI, double } from './utils.js';

// Default import
import Logger from './logger.js';

// Both
import Logger, { PI, double } from './module.js';

// All as namespace
import * as utils from './utils.js';
console.log(utils.PI);

// Rename on import
import { double as dbl } from './utils.js';
*/

// -------------------------------------------------------------------------------------------
// 3. KEY DIFFERENCES
// -------------------------------------------------------------------------------------------

/**
 * | Feature         | CommonJS          | ES Modules        |
 * |-----------------|-------------------|-------------------|
 * | Syntax          | require/exports   | import/export     |
 * | Loading         | Synchronous       | Asynchronous      |
 * | Parsing         | Runtime           | Static (compile)  |
 * | Top-level await | No                | Yes               |
 * | this at top     | module.exports    | undefined         |
 * | File extension  | .js, .cjs         | .js, .mjs         |
 * | Browser support | No (bundler)      | Yes (native)      |
 * | Tree shaking    | Difficult         | Easy              |
 */

// -------------------------------------------------------------------------------------------
// 4. STATIC VS DYNAMIC IMPORTS
// -------------------------------------------------------------------------------------------

/**
 * ESM imports are static - analyzed at compile time.
 * This enables tree shaking and better optimization.
 */

// Static import (must be at top level)
// import { utils } from './utils.js';

// Dynamic import (returns promise, works anywhere)
async function loadModule() {
    const module = await import('./utils.js');
    console.log(module.PI);
}

// Conditional import
async function conditionalLoad(condition) {
    if (condition) {
        const { feature } = await import('./feature.js');
        feature();
    }
}

// -------------------------------------------------------------------------------------------
// 5. NODE.JS MODULE CONFIGURATION
// -------------------------------------------------------------------------------------------

/**
 * In package.json:
 * 
 * { "type": "module" }     -> .js files are ESM
 * { "type": "commonjs" }   -> .js files are CJS (default)
 * 
 * Or use extensions:
 * .mjs -> Always ESM
 * .cjs -> Always CJS
 */

/**
 * Dual package support (package.json):
 * 
 * {
 *   "main": "./dist/index.cjs",      // CJS entry
 *   "module": "./dist/index.mjs",    // ESM entry
 *   "exports": {
 *     "import": "./dist/index.mjs",
 *     "require": "./dist/index.cjs"
 *   }
 * }
 */

// -------------------------------------------------------------------------------------------
// 6. INTEROPERABILITY
// -------------------------------------------------------------------------------------------

/**
 * ESM can import CJS, but with caveats.
 */

// From ESM, importing CJS
/*
import pkg from './cjs-module.cjs';  // Get default export
const { named } = pkg;                // Destructure after

// Some bundlers support direct named imports from CJS
import { named } from './cjs-module.cjs';
*/

// From CJS, importing ESM (must use dynamic import)
/*
async function loadESM() {
    const module = await import('./esm-module.mjs');
    console.log(module.default);
}
*/

// -------------------------------------------------------------------------------------------
// 7. RE-EXPORTING
// -------------------------------------------------------------------------------------------

// Re-export everything
// export * from './utils.js';

// Re-export specific items
// export { add, subtract } from './math.js';

// Re-export with rename
// export { default as MathUtils } from './math.js';

// Aggregate exports (barrel file - index.js)
/*
export * from './user.js';
export * from './product.js';
export * from './order.js';

// Consumer can then:
import { User, Product, Order } from './models/index.js';
*/

// -------------------------------------------------------------------------------------------
// 8. MODULE SCOPE
// -------------------------------------------------------------------------------------------

/**
 * Each module has its own scope.
 * Top-level variables are NOT global.
 */

// module-a.js
const privateVar = "I'm private to this module";
export const publicVar = "I'm exported";

// module-b.js
/*
import { publicVar } from './module-a.js';
// privateVar is not accessible
*/

// -------------------------------------------------------------------------------------------
// 9. TOP-LEVEL AWAIT (ESM Only)
// -------------------------------------------------------------------------------------------

/**
 * ESM supports await at the top level.
 */

// config.js
/*
const response = await fetch('/api/config');
export const config = await response.json();
*/

// consumer.js
/*
import { config } from './config.js';
// config is already resolved when this runs
*/

// -------------------------------------------------------------------------------------------
// 10. CIRCULAR DEPENDENCIES
// -------------------------------------------------------------------------------------------

/**
 * Both systems handle circular imports, but differently.
 * ESM gives you live bindings (values update).
 * CJS gives you a snapshot (values at time of require).
 */

// ESM - live bindings
// a.js
/*
import { b } from './b.js';
export let a = 'initial';
setTimeout(() => { a = 'updated'; }, 100);
*/

// b.js
/*
import { a } from './a.js';
export const b = 'from b';
setTimeout(() => console.log(a), 200); // 'updated' (live!)
*/

// -------------------------------------------------------------------------------------------
// 11. BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * 1. Prefer ESM for new projects.
 * 2. Use named exports for utilities (better tree shaking).
 * 3. Use default export for main class/function.
 * 4. Create barrel files (index.js) for clean imports.
 * 5. Avoid circular dependencies when possible.
 * 6. Use dynamic import for code splitting.
 * 7. Add file extensions in ESM imports.
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * COMMONJS:
 * - require() / module.exports
 * - Synchronous, runtime resolution
 * - Default in Node.js
 * 
 * ES MODULES:
 * - import / export
 * - Async, static analysis
 * - The JavaScript standard
 * - Tree-shakable
 * - Top-level await
 * 
 * CHOOSING:
 * - New projects: Use ESM
 * - Libraries: Support both (dual package)
 * - Legacy Node.js: CJS still works
 */
