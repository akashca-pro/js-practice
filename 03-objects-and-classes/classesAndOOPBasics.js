/**
 * TOPIC: CLASSES & OOP BASICS
 * DESCRIPTION:
 * ES6 classes provide syntactic sugar over prototypal inheritance.
 * They make OOP patterns more familiar and readable while still
 * using JavaScript's prototype system under the hood.
 */

// -------------------------------------------------------------------------------------------
// 1. CLASS DECLARATION
// -------------------------------------------------------------------------------------------

class Animal {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    speak() {
        console.log(`${this.name} makes a sound.`);
    }
    
    getInfo() {
        return `${this.name} is ${this.age} years old.`;
    }
}

const animal = new Animal('Leo', 5);
animal.speak();  // "Leo makes a sound."

// -------------------------------------------------------------------------------------------
// 2. INHERITANCE (EXTENDS)
// -------------------------------------------------------------------------------------------

class Dog extends Animal {
    constructor(name, age, breed) {
        super(name, age);  // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        console.log(`${this.name} barks!`);  // Override parent method
    }
    
    fetch() {
        console.log(`${this.name} fetches the ball.`);
    }
}

const dog = new Dog('Buddy', 3, 'Golden Retriever');
dog.speak();     // "Buddy barks!"
dog.getInfo();   // "Buddy is 3 years old." (inherited)
dog.fetch();     // "Buddy fetches the ball."

// -------------------------------------------------------------------------------------------
// 3. STATIC METHODS AND PROPERTIES
// -------------------------------------------------------------------------------------------

class MathUtils {
    static PI = 3.14159;
    
    static add(a, b) {
        return a + b;
    }
    
    static isEven(n) {
        return n % 2 === 0;
    }
}

// Called on class, not instance
console.log(MathUtils.PI);          // 3.14159
console.log(MathUtils.add(2, 3));   // 5
console.log(MathUtils.isEven(4));   // true

// -------------------------------------------------------------------------------------------
// 4. GETTERS AND SETTERS
// -------------------------------------------------------------------------------------------

class Circle {
    constructor(radius) {
        this._radius = radius;
    }
    
    get radius() {
        return this._radius;
    }
    
    set radius(value) {
        if (value <= 0) throw new Error('Radius must be positive');
        this._radius = value;
    }
    
    get area() {
        return Math.PI * this._radius ** 2;
    }
    
    get circumference() {
        return 2 * Math.PI * this._radius;
    }
}

const circle = new Circle(5);
console.log(circle.radius);        // 5
console.log(circle.area);          // 78.54...
circle.radius = 10;                // Uses setter
// circle.radius = -5;             // Throws error

// -------------------------------------------------------------------------------------------
// 5. PRIVATE FIELDS (#)
// -------------------------------------------------------------------------------------------

class BankAccount {
    #balance = 0;  // Private field
    
    constructor(initialBalance) {
        this.#balance = initialBalance;
    }
    
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
        }
    }
    
    withdraw(amount) {
        if (amount > 0 && amount <= this.#balance) {
            this.#balance -= amount;
            return amount;
        }
        throw new Error('Insufficient funds');
    }
    
    get balance() {
        return this.#balance;
    }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.balance);  // 150
// account.#balance;           // SyntaxError: Private field

// -------------------------------------------------------------------------------------------
// 6. PRIVATE METHODS
// -------------------------------------------------------------------------------------------

class SecureClass {
    #privateMethod() {
        return 'secret';
    }
    
    publicMethod() {
        return this.#privateMethod();
    }
}

// -------------------------------------------------------------------------------------------
// 7. INSTANCE VS STATIC
// -------------------------------------------------------------------------------------------

class Counter {
    static count = 0;  // Shared across all instances
    
    constructor() {
        Counter.count++;
        this.id = Counter.count;  // Instance property
    }
    
    static getTotal() {
        return Counter.count;
    }
}

new Counter();
new Counter();
console.log(Counter.getTotal());  // 2

// -------------------------------------------------------------------------------------------
// 8. ABSTRACT-LIKE CLASSES
// -------------------------------------------------------------------------------------------

/**
 * JavaScript doesn't have abstract classes, but we can simulate them.
 */

class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('Shape cannot be instantiated directly');
        }
    }
    
    area() {
        throw new Error('area() must be implemented');
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    area() {
        return this.width * this.height;
    }
}

// const shape = new Shape();  // Error!
const rect = new Rectangle(5, 3);
console.log(rect.area());  // 15

// -------------------------------------------------------------------------------------------
// 9. MIXINS
// -------------------------------------------------------------------------------------------

/**
 * Add functionality from multiple sources.
 */

const Flyable = (Base) => class extends Base {
    fly() {
        console.log(`${this.name} is flying!`);
    }
};

const Swimmable = (Base) => class extends Base {
    swim() {
        console.log(`${this.name} is swimming!`);
    }
};

class Duck extends Swimmable(Flyable(Animal)) {
    quack() {
        console.log(`${this.name} quacks!`);
    }
}

const duck = new Duck('Donald', 2);
duck.fly();   // "Donald is flying!"
duck.swim();  // "Donald is swimming!"
duck.quack(); // "Donald quacks!"

// -------------------------------------------------------------------------------------------
// 10. ENCAPSULATION PATTERNS
// -------------------------------------------------------------------------------------------

class User {
    #password;
    
    constructor(username, password) {
        this.username = username;
        this.#password = this.#hashPassword(password);
    }
    
    #hashPassword(password) {
        // Simple hash simulation
        return password.split('').reverse().join('');
    }
    
    validatePassword(input) {
        return this.#hashPassword(input) === this.#password;
    }
}

// -------------------------------------------------------------------------------------------
// 11. OOP PRINCIPLES
// -------------------------------------------------------------------------------------------

/**
 * ENCAPSULATION:
 * - Bundle data and methods that operate on it
 * - Hide internal state (private fields)
 * - Expose controlled interface (getters/setters)
 * 
 * INHERITANCE:
 * - Extend classes to create specialized versions
 * - Reuse code through prototype chain
 * - Override methods for specific behavior
 * 
 * POLYMORPHISM:
 * - Same interface, different implementations
 * - Child classes override parent methods
 * - Duck typing in JavaScript
 * 
 * ABSTRACTION:
 * - Hide complex implementation details
 * - Expose simple interface
 * - Focus on what, not how
 */

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * CLASSES:
 * - class, constructor, extends, super
 * - Methods, getters, setters
 * - static for class-level members
 * - # for private fields/methods
 * 
 * INHERITANCE:
 * - extends for subclasses
 * - super() to call parent constructor
 * - Override methods as needed
 * 
 * BEST PRACTICES:
 * - Use private fields for encapsulation
 * - Keep classes focused (single responsibility)
 * - Favor composition over deep inheritance
 * - Use static for utility methods
 */
