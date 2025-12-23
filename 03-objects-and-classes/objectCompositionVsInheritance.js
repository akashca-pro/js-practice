/**
 * TOPIC: OBJECT COMPOSITION VS INHERITANCE
 * DESCRIPTION:
 * Composition favors building objects from smaller, reusable pieces
 * rather than extending a class hierarchy. "Favor composition over
 * inheritance" is a common design principle.
 */

// -------------------------------------------------------------------------------------------
// 1. CLASSICAL INHERITANCE PROBLEMS
// -------------------------------------------------------------------------------------------

/**
 * PROBLEM 1: Gorilla/Banana Problem
 * You want a banana, but you get a gorilla holding the banana
 * and the entire jungle.
 */

class Animal {
    constructor(name) { this.name = name; }
    eat() { console.log(`${this.name} eats`); }
}

class Dog extends Animal {
    bark() { console.log(`${this.name} barks`); }
}

// Dog carries ALL of Animal, even if you only need bark()

/**
 * PROBLEM 2: Fragile Base Class
 * Changes to parent class can break children.
 */

/**
 * PROBLEM 3: Multiple Inheritance
 * JavaScript classes only extend ONE parent.
 * What if Dog needs behaviors from multiple sources?
 */

// -------------------------------------------------------------------------------------------
// 2. COMPOSITION BASICS
// -------------------------------------------------------------------------------------------

/**
 * Instead of IS-A (inheritance), use HAS-A (composition).
 * Build objects by combining capabilities.
 */

const canEat = (state) => ({
    eat: () => console.log(`${state.name} eats`)
});

const canWalk = (state) => ({
    walk: () => console.log(`${state.name} walks`)
});

const canBark = (state) => ({
    bark: () => console.log(`${state.name} barks`)
});

const canFly = (state) => ({
    fly: () => console.log(`${state.name} flies`)
});

function createDog(name) {
    const state = { name };
    return {
        ...state,
        ...canEat(state),
        ...canWalk(state),
        ...canBark(state)
    };
}

function createBird(name) {
    const state = { name };
    return {
        ...state,
        ...canEat(state),
        ...canWalk(state),
        ...canFly(state)
    };
}

const myDog = createDog("Buddy");
myDog.bark(); // "Buddy barks"
myDog.eat();  // "Buddy eats"

const myBird = createBird("Tweety");
myBird.fly(); // "Tweety flies"

// -------------------------------------------------------------------------------------------
// 3. MIXIN PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Mixins add functionality to objects/classes without inheritance.
 */

const swimMixin = {
    swim() { console.log(`${this.name} swims`); }
};

const flyMixin = {
    fly() { console.log(`${this.name} flies`); }
};

class Duck {
    constructor(name) { this.name = name; }
    quack() { console.log(`${this.name} quacks`); }
}

// Apply mixins
Object.assign(Duck.prototype, swimMixin, flyMixin);

const duck = new Duck("Donald");
duck.quack(); // "Donald quacks"
duck.swim();  // "Donald swims"
duck.fly();   // "Donald flies"

// -------------------------------------------------------------------------------------------
// 4. FUNCTIONAL MIXIN PATTERN
// -------------------------------------------------------------------------------------------

const withLogging = (Base) => class extends Base {
    log(message) {
        console.log(`[${this.constructor.name}] ${message}`);
    }
};

const withTimestamp = (Base) => class extends Base {
    getTimestamp() {
        return new Date().toISOString();
    }
};

class BaseService {
    constructor(name) { this.name = name; }
}

// Compose mixins
class EnhancedService extends withTimestamp(withLogging(BaseService)) {
    process() {
        this.log(`Processing at ${this.getTimestamp()}`);
    }
}

const service = new EnhancedService("MyService");
service.process();

// -------------------------------------------------------------------------------------------
// 5. STRATEGY PATTERN (Composition at Runtime)
// -------------------------------------------------------------------------------------------

/**
 * Change behavior at runtime by swapping composed parts.
 */

const strategies = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b
};

function createCalculator(strategy) {
    return {
        setStrategy(newStrategy) {
            strategy = newStrategy;
        },
        execute(a, b) {
            return strategy(a, b);
        }
    };
}

const calc = createCalculator(strategies.add);
console.log(calc.execute(5, 3));     // 8

calc.setStrategy(strategies.multiply);
console.log(calc.execute(5, 3));     // 15

// -------------------------------------------------------------------------------------------
// 6. COMPARISON
// -------------------------------------------------------------------------------------------

/**
 * INHERITANCE:
 * ✓ Natural for true IS-A relationships
 * ✓ Polymorphism built-in
 * ✗ Tight coupling
 * ✗ Single inheritance only
 * ✗ Fragile base class problem
 * 
 * COMPOSITION:
 * ✓ Loose coupling
 * ✓ Flexible - combine any behaviors
 * ✓ Easy to test (mock individual parts)
 * ✓ Change behavior at runtime
 * ✗ More boilerplate sometimes
 * ✗ No automatic instanceof
 */

// -------------------------------------------------------------------------------------------
// 7. WHEN TO USE EACH
// -------------------------------------------------------------------------------------------

/**
 * USE INHERITANCE WHEN:
 * - True IS-A relationship (Dog IS-A Animal)
 * - You need polymorphism with instanceof
 * - Behavior is unlikely to change
 * - Sharing implementation makes sense
 * 
 * USE COMPOSITION WHEN:
 * - Mixing behaviors from multiple sources
 * - Behavior might change at runtime
 * - You want loose coupling
 * - Building from reusable pieces
 */

// -------------------------------------------------------------------------------------------
// 8. REAL-WORLD EXAMPLE: UI COMPONENTS
// -------------------------------------------------------------------------------------------

// Behaviors
const withClickable = (component) => ({
    ...component,
    onClick(handler) { console.log("Click handler attached"); }
});

const withDraggable = (component) => ({
    ...component,
    onDrag(handler) { console.log("Drag handler attached"); }
});

const withResizable = (component) => ({
    ...component,
    onResize(handler) { console.log("Resize handler attached"); }
});

// Base component
const createComponent = (type) => ({
    type,
    render() { console.log(`Rendering ${this.type}`); }
});

// Compose different component types
const button = withClickable(createComponent('button'));
const window = withDraggable(withResizable(createComponent('window')));
const modal = withClickable(withDraggable(createComponent('modal')));

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * 1. Inheritance creates tight coupling and rigid hierarchies.
 * 2. Composition builds objects from reusable, independent pieces.
 * 3. "Favor composition over inheritance" for flexibility.
 * 4. Use mixins to add behaviors to classes.
 * 5. Strategy pattern enables runtime behavior changes.
 * 6. Choose inheritance for true IS-A; composition for HAS-A.
 */
