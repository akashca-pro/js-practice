/**
 * TOPIC: GETTERS AND SETTERS
 * DESCRIPTION:
 * Getters and setters are accessor properties that allow you to
 * define methods that are accessed like properties. They enable
 * computed properties, validation, and encapsulation.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC GETTER AND SETTER
// -------------------------------------------------------------------------------------------

const user = {
    firstName: 'John',
    lastName: 'Doe',
    
    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },
    
    // Setter
    set fullName(value) {
        const parts = value.split(' ');
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
};

// Access like property (not a method call)
console.log(user.fullName);  // "John Doe"

// Set like property
user.fullName = 'Jane Smith';
console.log(user.firstName);  // "Jane"
console.log(user.lastName);   // "Smith"

// -------------------------------------------------------------------------------------------
// 2. GETTER ONLY (READ-ONLY)
// -------------------------------------------------------------------------------------------

const circle = {
    radius: 5,
    
    get diameter() {
        return this.radius * 2;
    },
    
    get area() {
        return Math.PI * this.radius ** 2;
    },
    
    get circumference() {
        return 2 * Math.PI * this.radius;
    }
};

console.log(circle.diameter);      // 10
console.log(circle.area);          // ~78.54
console.log(circle.circumference); // ~31.42

// Attempting to set throws in strict mode
// circle.diameter = 20;  // Silently fails or throws

// -------------------------------------------------------------------------------------------
// 3. SETTER ONLY (WRITE-ONLY)
// -------------------------------------------------------------------------------------------

const logger = {
    _logs: [],
    
    // Write-only setter
    set log(message) {
        this._logs.push({
            message,
            timestamp: Date.now()
        });
    },
    
    get logs() {
        return [...this._logs];  // Return copy
    }
};

logger.log = 'First message';
logger.log = 'Second message';
console.log(logger.logs);

// -------------------------------------------------------------------------------------------
// 4. VALIDATION WITH SETTERS
// -------------------------------------------------------------------------------------------

const person = {
    _age: 0,
    
    get age() {
        return this._age;
    },
    
    set age(value) {
        if (typeof value !== 'number') {
            throw new TypeError('Age must be a number');
        }
        if (value < 0 || value > 150) {
            throw new RangeError('Age must be between 0 and 150');
        }
        this._age = value;
    }
};

person.age = 25;  // OK
// person.age = -5;  // RangeError!
// person.age = 'twenty';  // TypeError!

// -------------------------------------------------------------------------------------------
// 5. CLASS GETTERS AND SETTERS
// -------------------------------------------------------------------------------------------

class Rectangle {
    #width;
    #height;
    
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
    }
    
    // Getters
    get width() {
        return this.#width;
    }
    
    get height() {
        return this.#height;
    }
    
    get area() {
        return this.#width * this.#height;
    }
    
    get perimeter() {
        return 2 * (this.#width + this.#height);
    }
    
    // Setters
    set width(value) {
        if (value <= 0) throw new Error('Width must be positive');
        this.#width = value;
    }
    
    set height(value) {
        if (value <= 0) throw new Error('Height must be positive');
        this.#height = value;
    }
}

const rect = new Rectangle(10, 5);
console.log(rect.area);      // 50
rect.width = 20;
console.log(rect.area);      // 100

// -------------------------------------------------------------------------------------------
// 6. LAZY EVALUATION WITH GETTERS
// -------------------------------------------------------------------------------------------

const config = {
    _cachedData: null,
    
    get data() {
        if (this._cachedData === null) {
            console.log('Computing data...');
            this._cachedData = this.computeExpensiveData();
        }
        return this._cachedData;
    },
    
    computeExpensiveData() {
        // Expensive computation
        return { result: 42 };
    }
};

console.log(config.data);  // "Computing data..." then { result: 42 }
console.log(config.data);  // Just { result: 42 } (cached)

// -------------------------------------------------------------------------------------------
// 7. OBJECT.DEFINEPROPERTY
// -------------------------------------------------------------------------------------------

/**
 * Define getters/setters after object creation.
 */

const obj = { _value: 0 };

Object.defineProperty(obj, 'value', {
    get() {
        return this._value;
    },
    set(v) {
        console.log('Setting value to:', v);
        this._value = v;
    },
    enumerable: true,
    configurable: true
});

obj.value = 10;  // "Setting value to: 10"
console.log(obj.value);  // 10

// Multiple properties
Object.defineProperties(obj, {
    doubled: {
        get() { return this._value * 2; }
    },
    squared: {
        get() { return this._value ** 2; }
    }
});

// -------------------------------------------------------------------------------------------
// 8. INHERITED GETTERS AND SETTERS
// -------------------------------------------------------------------------------------------

class Animal {
    constructor(name) {
        this._name = name;
    }
    
    get name() {
        return this._name;
    }
    
    set name(value) {
        this._name = value;
    }
}

class Dog extends Animal {
    get name() {
        return `Dog: ${super.name}`;  // Can call parent getter
    }
    
    set name(value) {
        super.name = value.toLowerCase();
    }
}

const dog = new Dog('BUDDY');
console.log(dog.name);  // "Dog: buddy"

// -------------------------------------------------------------------------------------------
// 9. PROPERTY DESCRIPTORS
// -------------------------------------------------------------------------------------------

const example = {
    regularProperty: 'value',
    
    get accessorProperty() {
        return 'accessor value';
    }
};

// Check property descriptor
console.log(Object.getOwnPropertyDescriptor(example, 'regularProperty'));
// { value: 'value', writable: true, enumerable: true, configurable: true }

console.log(Object.getOwnPropertyDescriptor(example, 'accessorProperty'));
// { get: [Function], set: undefined, enumerable: true, configurable: true }

// -------------------------------------------------------------------------------------------
// 10. PRACTICAL EXAMPLES
// -------------------------------------------------------------------------------------------

// Temperature converter
class Temperature {
    constructor(celsius) {
        this._celsius = celsius;
    }
    
    get celsius() {
        return this._celsius;
    }
    
    set celsius(value) {
        this._celsius = value;
    }
    
    get fahrenheit() {
        return this._celsius * 9/5 + 32;
    }
    
    set fahrenheit(value) {
        this._celsius = (value - 32) * 5/9;
    }
    
    get kelvin() {
        return this._celsius + 273.15;
    }
    
    set kelvin(value) {
        this._celsius = value - 273.15;
    }
}

const temp = new Temperature(0);
console.log(temp.fahrenheit);  // 32
temp.fahrenheit = 212;
console.log(temp.celsius);     // 100

// Form field with validation
class FormField {
    #value = '';
    #errors = [];
    #validators = [];
    
    constructor(validators = []) {
        this.#validators = validators;
    }
    
    get value() {
        return this.#value;
    }
    
    set value(v) {
        this.#value = v;
        this.#validate();
    }
    
    get isValid() {
        return this.#errors.length === 0;
    }
    
    get errors() {
        return [...this.#errors];
    }
    
    #validate() {
        this.#errors = this.#validators
            .map(validator => validator(this.#value))
            .filter(error => error !== null);
    }
}

// -------------------------------------------------------------------------------------------
// 11. COMMON PATTERNS
// -------------------------------------------------------------------------------------------

// Singleton pattern
class Singleton {
    static #instance = null;
    
    static get instance() {
        if (!Singleton.#instance) {
            Singleton.#instance = new Singleton();
        }
        return Singleton.#instance;
    }
    
    constructor() {
        if (Singleton.#instance) {
            return Singleton.#instance;
        }
    }
}

// Observable property
function observable(obj, prop, callback) {
    let value = obj[prop];
    
    Object.defineProperty(obj, prop, {
        get() {
            return value;
        },
        set(newValue) {
            const oldValue = value;
            value = newValue;
            callback(newValue, oldValue);
        }
    });
}

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * SYNTAX:
 * - get propertyName() { return value; }
 * - set propertyName(value) { ... }
 * 
 * KEY POINTS:
 * - Accessed like properties, not methods
 * - Can be in objects, classes, or via defineProperty
 * - Setter can validate input
 * - Getter can compute values
 * 
 * USE CASES:
 * - Computed properties
 * - Validation
 * - Encapsulation (private + public accessor)
 * - Lazy evaluation
 * - Observable properties
 * 
 * BEST PRACTICES:
 * - Keep getters simple and fast
 * - Use _ or # prefix for backing fields
 * - Avoid side effects in getters
 * - Document write-only or read-only properties
 */
