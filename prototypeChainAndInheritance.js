/**
 * TOPIC: PROTOTYPE CHAIN & INHERITANCE
 * DESCRIPTION:
 * JavaScript uses prototypal inheritance. Every object has an internal
 * [[Prototype]] link to another object, forming a chain used for
 * property lookup.
 */

// -------------------------------------------------------------------------------------------
// 1. THE PROTOTYPE CHAIN
// -------------------------------------------------------------------------------------------

/**
 * When accessing a property, JavaScript:
 * 1. Checks the object itself.
 * 2. Checks [[Prototype]] (accessible via __proto__ or Object.getPrototypeOf).
 * 3. Continues up the chain until null.
 */

const animal = {
    eats: true,
    walk() { console.log("Animal walks"); }
};

const rabbit = {
    jumps: true,
    __proto__: animal // Set prototype (use Object.create in practice)
};

console.log(rabbit.jumps);  // true (own property)
console.log(rabbit.eats);   // true (inherited from animal)
rabbit.walk();              // "Animal walks" (inherited method)

// -------------------------------------------------------------------------------------------
// 2. OBJECT.CREATE()
// -------------------------------------------------------------------------------------------

/**
 * Preferred way to set up prototype chain.
 */

const dog = Object.create(animal);
dog.barks = true;

console.log(dog.eats);   // true (from animal)
console.log(dog.barks);  // true (own property)

// Create object with null prototype (no inherited methods)
const pureObject = Object.create(null);
// pureObject.toString(); // Error! No inherited methods

// -------------------------------------------------------------------------------------------
// 3. CONSTRUCTOR FUNCTIONS
// -------------------------------------------------------------------------------------------

/**
 * Functions used with 'new' create objects with prototype set to
 * Constructor.prototype.
 */

function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    console.log(`Hello, I'm ${this.name}`);
};

const alice = new Person("Alice");
alice.greet(); // "Hello, I'm Alice"

// Chain: alice -> Person.prototype -> Object.prototype -> null

// -------------------------------------------------------------------------------------------
// 4. ES6 CLASSES (Syntactic Sugar)
// -------------------------------------------------------------------------------------------

class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(`${this.name} makes a sound.`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        console.log(`${this.name} barks.`);
    }
}

const buddy = new Dog("Buddy", "Golden Retriever");
buddy.speak(); // "Buddy barks."

// Chain: buddy -> Dog.prototype -> Animal.prototype -> Object.prototype -> null

// -------------------------------------------------------------------------------------------
// 5. PROPERTY SHADOWING
// -------------------------------------------------------------------------------------------

/**
 * Setting a property on an object creates it on that object,
 * not on the prototype (shadowing the prototype property).
 */

const parent = { value: 1 };
const child = Object.create(parent);

console.log(child.value);  // 1 (inherited)

child.value = 2;           // Creates own property
console.log(child.value);  // 2 (own property shadows inherited)
console.log(parent.value); // 1 (unchanged)

// -------------------------------------------------------------------------------------------
// 6. CHECKING PROTOTYPE RELATIONSHIPS
// -------------------------------------------------------------------------------------------

console.log(buddy instanceof Dog);    // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true

console.log(Dog.prototype.isPrototypeOf(buddy));    // true
console.log(Animal.prototype.isPrototypeOf(buddy)); // true

console.log(Object.getPrototypeOf(buddy) === Dog.prototype); // true

// -------------------------------------------------------------------------------------------
// 7. HASOWNPROPERTY VS IN
// -------------------------------------------------------------------------------------------

const proto = { inherited: true };
const obj = Object.create(proto);
obj.own = true;

console.log('own' in obj);       // true
console.log('inherited' in obj); // true

console.log(obj.hasOwnProperty('own'));       // true
console.log(obj.hasOwnProperty('inherited')); // false

// Object.hasOwn (ES2022) - safer alternative
console.log(Object.hasOwn(obj, 'own'));       // true

// -------------------------------------------------------------------------------------------
// 8. MODIFYING PROTOTYPES
// -------------------------------------------------------------------------------------------

/**
 * Changes to prototype reflect on all instances.
 * WARNING: Don't modify built-in prototypes!
 */

function Cat(name) { this.name = name; }

const cat1 = new Cat("Whiskers");

// Add method after instance creation
Cat.prototype.meow = function() { console.log("Meow!"); };

cat1.meow(); // "Meow!" - Works! Live lookup.

// -------------------------------------------------------------------------------------------
// 9. PROTOTYPE CHAIN PERFORMANCE
// -------------------------------------------------------------------------------------------

/**
 * Deep prototype chains slow down property lookup.
 * Keep chains shallow for performance-critical code.
 * 
 * Own properties: Fastest
 * Prototype properties: Slightly slower (chain traversal)
 * Missing properties: Slowest (traverse entire chain)
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * 1. Objects have [[Prototype]] link forming a chain.
 * 2. Property lookup traverses the chain until found or null.
 * 3. Object.create() sets up prototype properly.
 * 4. Constructor.prototype becomes [[Prototype]] of instances.
 * 5. ES6 classes are syntactic sugar over prototypes.
 * 6. Use hasOwnProperty/Object.hasOwn for own properties.
 * 7. Modifying prototypes affects all existing instances.
 */
