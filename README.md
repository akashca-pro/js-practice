# JavaScript Reference Guide

A comprehensive collection of JavaScript reference files covering core concepts, APIs, patterns, and modern features. Each file includes detailed explanations, code examples, and best practices.

## Folder Structure

### 01-core-fundamentals/

Core JavaScript concepts and how the language works internally.

| File                                 | Description                                           |
| ------------------------------------ | ----------------------------------------------------- |
| `executionContext.js`                | Call stack, execution context creation, phases        |
| `lexicalEnvironmentAndScopeChain.js` | Scope chain, lexical environment, variable resolution |
| `hoisting.js`                        | Variable and function hoisting behavior               |
| `closure.js`                         | Closures, lexical scope, practical patterns           |
| `variableDeclarations.js`            | var vs let vs const, TDZ, scope                       |
| `strictMode.js`                      | Strict mode features and benefits                     |
| `coercionAndTypeConversion.js`       | Implicit/explicit coercion, falsy values              |
| `typeofAndInstanceof.js`             | Type checking operators and alternatives              |
| `thisContext.js`                     | How `this` works in different contexts                |
| `eventLoopAndTaskQueues.js`          | Event loop, microtasks, macrotasks                    |

---

### 02-functions/

Function concepts, patterns, and functional programming.

| File                                   | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `firstClassAndHigherOrderFunctions.js` | Functions as values, callbacks, HOFs       |
| `arrowFunctionsVsRegularFunctions.js`  | Differences and when to use each           |
| `callApplyBind.js`                     | Context manipulation methods               |
| `functionCompositionAndCurrying.js`    | compose, pipe, currying patterns           |
| `partialApplication.js`                | Partial function application               |
| `pureFunctionsAndImmutability.js`      | Pure functions, side effects, immutability |
| `recursionAndTailCallOptimization.js`  | Recursive patterns and optimization        |
| `iifePatterns.js`                      | Immediately Invoked Function Expressions   |

---

### 03-objects-and-classes/

Object-oriented programming and metaprogramming.

| File                                 | Description                                |
| ------------------------------------ | ------------------------------------------ |
| `classesAndOOPBasics.js`             | ES6 classes, inheritance, OOP principles   |
| `prototypeChainAndInheritance.js`    | Prototypal inheritance, prototype chain    |
| `objectCompositionVsInheritance.js`  | Composition patterns vs inheritance        |
| `proxyObject.js`                     | Proxy for interception and metaprogramming |
| `reflectAPI.js`                      | Reflect API methods and usage              |
| `symbols.js`                         | Symbols and well-known symbols             |
| `shadowingAndPropertyDescriptors.js` | Property descriptors, defineProperty       |
| `gettersAndSetters.js`               | Accessor properties, validation            |
| `objectPropertyShorthand.js`         | ES6 object syntax enhancements             |
| `deepCloningVsShallowCloning.js`     | Cloning strategies and structuredClone     |
| `decorators.js`                      | Decorator patterns and proposals           |

---

### 04-async-programming/

Asynchronous JavaScript and concurrency.

| File                             | Description                                |
| -------------------------------- | ------------------------------------------ |
| `promises.js`                    | Promise creation, chaining, error handling |
| `asyncAwait.js`                  | async/await syntax and patterns            |
| `promiseConcurrency.js`          | Promise.all, race, allSettled, any         |
| `generatorsAndIterators.js`      | Generator functions, iterators             |
| `asynchronousIteration.js`       | Async iterators, for-await-of              |
| `errorHandlingPatterns.js`       | Error types, Result pattern, retries       |
| `exceptionHandling.js`           | try/catch/finally basics                   |
| `abortController.js`             | Cancelling fetch and async operations      |
| `webWorkersAndMultithreading.js` | Web Workers for parallel execution         |

---

### 05-data-structures/

Built-in data structures and data handling.

| File                                | Description                           |
| ----------------------------------- | ------------------------------------- |
| `arrayMethods.js`                   | All array methods with examples       |
| `objectMethods.js`                  | Object static methods and patterns    |
| `stringMethods.js`                  | String manipulation methods           |
| `setAndMapDataStructures.js`        | Set, Map, WeakSet, WeakMap            |
| `jsonHandling.js`                   | JSON.parse/stringify, edge cases      |
| `typedArraysAndArrayBuffers.js`     | Binary data handling                  |
| `regularExpressions.js`             | Regex syntax, methods, patterns       |
| `destructuringAndSpreadRest.js`     | Destructuring, spread, rest operators |
| `bigInt.js`                         | Arbitrary precision integers          |
| `weakRefAndFinalizationRegistry.js` | Weak references and GC callbacks      |

---

### 06-dom-and-browser/

Browser APIs and DOM manipulation.

| File                                         | Description                        |
| -------------------------------------------- | ---------------------------------- |
| `domTraversalAndManipulation.js`             | Selecting, creating, modifying DOM |
| `eventsAndEventDelegation.js`                | Event handling and delegation      |
| `basicWebAPIs.js`                            | fetch, storage, history, etc.      |
| `fetchAPIDeepDive.js`                        | Advanced fetch patterns            |
| `formDataAndURLSearchParams.js`              | Form handling and URL manipulation |
| `intersectionObserverAndMutationObserver.js` | DOM observation APIs               |
| `shadowDOMAndWebComponents.js`               | Custom elements, Shadow DOM        |
| `serviceWorkersAndCaching.js`                | SW lifecycle, caching strategies   |
| `webStreamsAPI.js`                           | ReadableStream, WritableStream     |
| `timers.js`                                  | setTimeout, setInterval, RAF       |

---

### 07-design-patterns/

Common JavaScript design patterns.

| File                         | Description                         |
| ---------------------------- | ----------------------------------- |
| `designPatternsSingleton.js` | Singleton pattern implementations   |
| `designPatternsFactory.js`   | Factory patterns (simple, abstract) |
| `designPatternsObserver.js`  | Observer, EventEmitter, Pub/Sub     |
| `designPatternsModule.js`    | Module pattern, namespacing         |

---

### 08-modern-features/

ES6+ features and modern JavaScript.

| File                                      | Description                            |
| ----------------------------------------- | -------------------------------------- |
| `moduleSystems.js`                        | ES Modules vs CommonJS                 |
| `dynamicImports.js`                       | Lazy loading and code splitting        |
| `treeShakingAndDeadCodeElimination.js`    | Bundle optimization                    |
| `nullishCoalescingAndOptionalChaining.js` | ??, ?. operators                       |
| `logicalAssignmentOperators.js`           | \|\|=, &&=, ??= operators              |
| `templateLiterals.js`                     | String interpolation, tagged templates |
| `es2023PlusFeatures.js`                   | Recent JS additions                    |

---

### 09-performance-and-optimization/

Performance patterns and memory management.

| File                         | Description                     |
| ---------------------------- | ------------------------------- |
| `memoization.js`             | Caching function results        |
| `debouncingAndThrottling.js` | Rate limiting patterns          |
| `garbageCollection.js`       | How GC works in JavaScript      |
| `memoryLeaksAndProfiling.js` | Finding and fixing memory leaks |

---

### 10-utilities-and-debugging/

Utility APIs and debugging tools.

| File                      | Description                     |
| ------------------------- | ------------------------------- |
| `consoleAPIDeepDive.js`   | All console methods             |
| `dateAndTimeHandling.js`  | Date object and time utilities  |
| `intlAPI.js`              | Internationalization formatters |
| `numberMethodsAndMath.js` | Number and Math operations      |
| `bitwiseOperators.js`     | Bitwise operations and tricks   |

---

## How to Use

Each file is self-contained with:

- **TOPIC** header describing the concept
- **DESCRIPTION** explaining why it matters
- **Numbered sections** with detailed examples
- **SUMMARY** with key takeaways

```javascript
// Example: Run any file directly
node 01-core-fundamentals/closure.js
```

## Learning Path

1. Start with **01-core-fundamentals** for language basics
2. Move to **02-functions** for functional concepts
3. Learn **03-objects-and-classes** for OOP
4. Master **04-async-programming** for async patterns
5. Explore other folders based on your needs

## Topics Covered

- 78 comprehensive reference files
- Core JS internals (execution context, closures, this)
- Async programming (Promises, async/await, generators)
- OOP and prototypes
- Functional programming patterns
- DOM and Browser APIs
- Modern ES6+ features
- Design patterns
- Performance optimization
