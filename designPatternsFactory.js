/**
 * TOPIC: DESIGN PATTERNS - FACTORY
 * DESCRIPTION:
 * Factory patterns create objects without specifying exact classes.
 * They provide flexibility in object creation, enabling cleaner
 * code and easier testing.
 */

// -------------------------------------------------------------------------------------------
// 1. SIMPLE FACTORY
// -------------------------------------------------------------------------------------------

/**
 * A function that creates and returns objects.
 */

function createUser(name, role) {
    return {
        name,
        role,
        permissions: getPermissions(role),
        createdAt: new Date()
    };
}

function getPermissions(role) {
    const permissions = {
        admin: ['read', 'write', 'delete'],
        editor: ['read', 'write'],
        viewer: ['read']
    };
    return permissions[role] || [];
}

const admin = createUser('Alice', 'admin');
const viewer = createUser('Bob', 'viewer');

// -------------------------------------------------------------------------------------------
// 2. FACTORY FUNCTION (Object Creation)
// -------------------------------------------------------------------------------------------

function createCounter(initialValue = 0) {
    let count = initialValue;
    
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; },
        reset() { count = initialValue; }
    };
}

const counter = createCounter(10);
counter.increment();  // 11
counter.getCount();   // 11

// -------------------------------------------------------------------------------------------
// 3. FACTORY METHOD PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Define an interface for creating objects, but let subclasses
 * decide which classes to instantiate.
 */

class Vehicle {
    constructor(type) {
        this.type = type;
    }
    
    describe() {
        return `This is a ${this.type}`;
    }
}

class Car extends Vehicle {
    constructor() {
        super('car');
        this.wheels = 4;
    }
}

class Motorcycle extends Vehicle {
    constructor() {
        super('motorcycle');
        this.wheels = 2;
    }
}

class VehicleFactory {
    static create(type) {
        switch (type) {
            case 'car':
                return new Car();
            case 'motorcycle':
                return new Motorcycle();
            default:
                throw new Error(`Unknown vehicle type: ${type}`);
        }
    }
}

const car = VehicleFactory.create('car');
const moto = VehicleFactory.create('motorcycle');

// -------------------------------------------------------------------------------------------
// 4. ABSTRACT FACTORY
// -------------------------------------------------------------------------------------------

/**
 * Creates families of related objects without
 * specifying their concrete classes.
 */

// Abstract products
class Button {
    render() { throw new Error('Must implement'); }
}

class Checkbox {
    render() { throw new Error('Must implement'); }
}

// Concrete products - Light theme
class LightButton extends Button {
    render() { return 'Light Theme Button'; }
}

class LightCheckbox extends Checkbox {
    render() { return 'Light Theme Checkbox'; }
}

// Concrete products - Dark theme
class DarkButton extends Button {
    render() { return 'Dark Theme Button'; }
}

class DarkCheckbox extends Checkbox {
    render() { return 'Dark Theme Checkbox'; }
}

// Abstract Factory
class UIFactory {
    createButton() { throw new Error('Must implement'); }
    createCheckbox() { throw new Error('Must implement'); }
}

// Concrete factories
class LightThemeFactory extends UIFactory {
    createButton() { return new LightButton(); }
    createCheckbox() { return new LightCheckbox(); }
}

class DarkThemeFactory extends UIFactory {
    createButton() { return new DarkButton(); }
    createCheckbox() { return new DarkCheckbox(); }
}

// Usage
function createUI(factory) {
    const button = factory.createButton();
    const checkbox = factory.createCheckbox();
    return { button, checkbox };
}

const lightUI = createUI(new LightThemeFactory());
const darkUI = createUI(new DarkThemeFactory());

// -------------------------------------------------------------------------------------------
// 5. REGISTRATION-BASED FACTORY
// -------------------------------------------------------------------------------------------

class ShapeFactory {
    static registry = new Map();
    
    static register(type, creator) {
        ShapeFactory.registry.set(type, creator);
    }
    
    static create(type, ...args) {
        const creator = ShapeFactory.registry.get(type);
        if (!creator) {
            throw new Error(`Unknown shape: ${type}`);
        }
        return creator(...args);
    }
}

// Register shapes
ShapeFactory.register('circle', (radius) => ({
    type: 'circle',
    radius,
    area: () => Math.PI * radius ** 2
}));

ShapeFactory.register('rectangle', (width, height) => ({
    type: 'rectangle',
    width,
    height,
    area: () => width * height
}));

// Create shapes
const circle = ShapeFactory.create('circle', 5);
const rect = ShapeFactory.create('rectangle', 4, 6);

// -------------------------------------------------------------------------------------------
// 6. CONFIGURATION-BASED FACTORY
// -------------------------------------------------------------------------------------------

class NotificationFactory {
    static create(config) {
        const { type, ...options } = config;
        
        const notifications = {
            email: EmailNotification,
            sms: SMSNotification,
            push: PushNotification
        };
        
        const NotificationClass = notifications[type];
        if (!NotificationClass) {
            throw new Error(`Unknown notification type: ${type}`);
        }
        
        return new NotificationClass(options);
    }
}

class EmailNotification {
    constructor({ to, subject }) {
        this.to = to;
        this.subject = subject;
    }
    send(message) {
        console.log(`Email to ${this.to}: ${message}`);
    }
}

class SMSNotification {
    constructor({ phone }) {
        this.phone = phone;
    }
    send(message) {
        console.log(`SMS to ${this.phone}: ${message}`);
    }
}

class PushNotification {
    constructor({ token }) {
        this.token = token;
    }
    send(message) {
        console.log(`Push to ${this.token}: ${message}`);
    }
}

const email = NotificationFactory.create({ type: 'email', to: 'user@example.com', subject: 'Hi' });
const sms = NotificationFactory.create({ type: 'sms', phone: '+1234567890' });

// -------------------------------------------------------------------------------------------
// 7. FACTORY WITH DEPENDENCY INJECTION
// -------------------------------------------------------------------------------------------

class ServiceFactory {
    constructor(dependencies = {}) {
        this.dependencies = dependencies;
    }
    
    create(serviceName) {
        const services = {
            userService: () => new UserService(this.dependencies.db),
            authService: () => new AuthService(this.dependencies.cache),
            logService: () => new LogService(this.dependencies.logger)
        };
        
        const creator = services[serviceName];
        if (!creator) {
            throw new Error(`Unknown service: ${serviceName}`);
        }
        
        return creator();
    }
}

class UserService {
    constructor(db) { this.db = db; }
}
class AuthService {
    constructor(cache) { this.cache = cache; }
}
class LogService {
    constructor(logger) { this.logger = logger; }
}

// -------------------------------------------------------------------------------------------
// 8. ASYNC FACTORY
// -------------------------------------------------------------------------------------------

class AsyncConnectionFactory {
    static async create(type) {
        switch (type) {
            case 'database':
                const conn = new DatabaseConnection();
                await conn.connect();
                return conn;
            case 'cache':
                const cache = new CacheConnection();
                await cache.connect();
                return cache;
            default:
                throw new Error(`Unknown connection: ${type}`);
        }
    }
}

class DatabaseConnection {
    async connect() { /* ... */ }
}
class CacheConnection {
    async connect() { /* ... */ }
}

// Usage
// const db = await AsyncConnectionFactory.create('database');

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * FACTORY PATTERNS:
 * 
 * SIMPLE FACTORY:
 * - Function that creates objects
 * - Hides creation complexity
 * 
 * FACTORY METHOD:
 * - Subclasses decide which class to create
 * - Promotes loose coupling
 * 
 * ABSTRACT FACTORY:
 * - Creates families of related objects
 * - Theme/platform-specific UI components
 * 
 * REGISTRATION-BASED:
 * - Extensible with register/create
 * - Plugin systems
 * 
 * BENEFITS:
 * - Encapsulates object creation
 * - Promotes loose coupling
 * - Easier testing (mock factories)
 * - Single Responsibility Principle
 */
