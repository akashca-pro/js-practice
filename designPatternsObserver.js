/**
 * TOPIC: DESIGN PATTERNS - OBSERVER
 * DESCRIPTION:
 * Observer pattern defines a one-to-many dependency between objects.
 * When one object (subject) changes state, all dependents (observers)
 * are notified automatically. Foundation for event systems.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC OBSERVER PATTERN
// -------------------------------------------------------------------------------------------

class Subject {
    constructor() {
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

// Usage
const subject = new Subject();

const observer1 = data => console.log('Observer 1:', data);
const observer2 = data => console.log('Observer 2:', data);

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify('Hello!');  // Both observers receive 'Hello!'

subject.unsubscribe(observer1);
subject.notify('Goodbye!');  // Only observer2 receives

// -------------------------------------------------------------------------------------------
// 2. TYPE-SAFE OBSERVABLE
// -------------------------------------------------------------------------------------------

class Observable {
    #observers = new Set();
    
    subscribe(observer) {
        this.#observers.add(observer);
        
        // Return unsubscribe function
        return () => {
            this.#observers.delete(observer);
        };
    }
    
    notify(data) {
        this.#observers.forEach(observer => {
            try {
                observer(data);
            } catch (error) {
                console.error('Observer error:', error);
            }
        });
    }
    
    get observerCount() {
        return this.#observers.size;
    }
}

const observable = new Observable();
const unsubscribe = observable.subscribe(console.log);
observable.notify('Test');
unsubscribe();  // Clean way to unsubscribe

// -------------------------------------------------------------------------------------------
// 3. EVENT EMITTER PATTERN
// -------------------------------------------------------------------------------------------

class EventEmitter {
    #events = new Map();
    
    on(event, listener) {
        if (!this.#events.has(event)) {
            this.#events.set(event, new Set());
        }
        this.#events.get(event).add(listener);
        return this;  // Chainable
    }
    
    off(event, listener) {
        if (this.#events.has(event)) {
            this.#events.get(event).delete(listener);
        }
        return this;
    }
    
    once(event, listener) {
        const wrapper = (...args) => {
            listener(...args);
            this.off(event, wrapper);
        };
        return this.on(event, wrapper);
    }
    
    emit(event, ...args) {
        if (this.#events.has(event)) {
            this.#events.get(event).forEach(listener => {
                listener(...args);
            });
        }
        return this;
    }
    
    removeAllListeners(event) {
        if (event) {
            this.#events.delete(event);
        } else {
            this.#events.clear();
        }
        return this;
    }
}

// Usage
const emitter = new EventEmitter();

emitter.on('message', data => console.log('Received:', data));
emitter.once('connect', () => console.log('Connected once'));

emitter.emit('connect');  // 'Connected once'
emitter.emit('connect');  // Nothing (once already fired)
emitter.emit('message', 'Hello');  // 'Received: Hello'

// -------------------------------------------------------------------------------------------
// 4. REACTIVE STATE
// -------------------------------------------------------------------------------------------

class ReactiveState {
    #state;
    #observers = new Map();
    
    constructor(initialState = {}) {
        this.#state = initialState;
    }
    
    get(key) {
        return this.#state[key];
    }
    
    set(key, value) {
        const oldValue = this.#state[key];
        this.#state[key] = value;
        
        if (oldValue !== value) {
            this.#notify(key, value, oldValue);
        }
    }
    
    subscribe(key, observer) {
        if (!this.#observers.has(key)) {
            this.#observers.set(key, new Set());
        }
        this.#observers.get(key).add(observer);
        
        return () => this.#observers.get(key).delete(observer);
    }
    
    #notify(key, newValue, oldValue) {
        if (this.#observers.has(key)) {
            this.#observers.get(key).forEach(observer => {
                observer(newValue, oldValue);
            });
        }
    }
}

const state = new ReactiveState({ count: 0 });

state.subscribe('count', (newVal, oldVal) => {
    console.log(`count changed: ${oldVal} -> ${newVal}`);
});

state.set('count', 1);  // 'count changed: 0 -> 1'

// -------------------------------------------------------------------------------------------
// 5. PUB/SUB PATTERN
// -------------------------------------------------------------------------------------------

class PubSub {
    static #channels = new Map();
    
    static subscribe(channel, handler) {
        if (!PubSub.#channels.has(channel)) {
            PubSub.#channels.set(channel, new Set());
        }
        PubSub.#channels.get(channel).add(handler);
        
        return () => {
            PubSub.#channels.get(channel).delete(handler);
        };
    }
    
    static publish(channel, data) {
        if (PubSub.#channels.has(channel)) {
            PubSub.#channels.get(channel).forEach(handler => {
                handler(data);
            });
        }
    }
    
    static unsubscribeAll(channel) {
        PubSub.#channels.delete(channel);
    }
}

// Global pub/sub
PubSub.subscribe('user:login', user => console.log('User logged in:', user));
PubSub.subscribe('user:logout', () => console.log('User logged out'));

PubSub.publish('user:login', { id: 1, name: 'Alice' });

// -------------------------------------------------------------------------------------------
// 6. ASYNC OBSERVABLE
// -------------------------------------------------------------------------------------------

class AsyncObservable {
    #observers = new Set();
    
    subscribe(observer) {
        this.#observers.add(observer);
        return () => this.#observers.delete(observer);
    }
    
    async notify(data) {
        const promises = [...this.#observers].map(async observer => {
            try {
                await observer(data);
            } catch (error) {
                console.error('Async observer error:', error);
            }
        });
        await Promise.all(promises);
    }
}

// -------------------------------------------------------------------------------------------
// 7. PROXY-BASED REACTIVE OBJECT
// -------------------------------------------------------------------------------------------

function reactive(target, onChange) {
    return new Proxy(target, {
        set(obj, prop, value) {
            const oldValue = obj[prop];
            obj[prop] = value;
            
            if (oldValue !== value) {
                onChange(prop, value, oldValue);
            }
            return true;
        },
        
        deleteProperty(obj, prop) {
            const oldValue = obj[prop];
            delete obj[prop];
            onChange(prop, undefined, oldValue);
            return true;
        }
    });
}

const user = reactive({ name: 'Alice', age: 25 }, (prop, newVal, oldVal) => {
    console.log(`${prop}: ${oldVal} -> ${newVal}`);
});

user.name = 'Bob';  // 'name: Alice -> Bob'
user.age = 26;      // 'age: 25 -> 26'

// -------------------------------------------------------------------------------------------
// 8. REAL-WORLD: STORE PATTERN
// -------------------------------------------------------------------------------------------

class Store {
    #state;
    #listeners = new Set();
    #reducers = new Map();
    
    constructor(initialState = {}) {
        this.#state = initialState;
    }
    
    getState() {
        return { ...this.#state };
    }
    
    dispatch(action) {
        const reducer = this.#reducers.get(action.type);
        if (reducer) {
            this.#state = reducer(this.#state, action);
            this.#notify();
        }
    }
    
    addReducer(type, reducer) {
        this.#reducers.set(type, reducer);
    }
    
    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }
    
    #notify() {
        this.#listeners.forEach(listener => listener(this.#state));
    }
}

const store = new Store({ count: 0 });

store.addReducer('INCREMENT', (state, action) => ({
    ...state,
    count: state.count + (action.payload || 1)
}));

store.subscribe(state => console.log('State:', state));
store.dispatch({ type: 'INCREMENT', payload: 5 });

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * OBSERVER PATTERN:
 * - Subject maintains list of observers
 * - Notifies all observers on state change
 * 
 * VARIATIONS:
 * - Event Emitter: Named events
 * - Pub/Sub: Decoupled via channels
 * - Reactive: Auto-notification on property change
 * 
 * KEY CONCEPTS:
 * - subscribe/unsubscribe
 * - notify/emit/publish
 * - Cleanup (return unsubscribe function)
 * 
 * USE CASES:
 * - Event systems
 * - State management
 * - Real-time updates
 * - UI binding
 */
