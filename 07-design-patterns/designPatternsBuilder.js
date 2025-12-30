/**
 * TOPIC: DESIGN PATTERNS - BUILDER
 * DESCRIPTION:
 * Builder pattern separates the construction of a complex object from
 * its representation, allowing the same construction process to create
 * different representations. Perfect for creating complex objects
 * step-by-step, query builders, form builders, and configuration objects.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC BUILDER PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Builder provides a fluent interface for constructing objects.
 */

class User {
    constructor(builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = builder.email;
        this.age = builder.age;
        this.phone = builder.phone;
        this.address = builder.address;
    }
}

class UserBuilder {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    setEmail(email) {
        this.email = email;
        return this;
    }

    setAge(age) {
        this.age = age;
        return this;
    }

    setPhone(phone) {
        this.phone = phone;
        return this;
    }

    setAddress(address) {
        this.address = address;
        return this;
    }

    build() {
        return new User(this);
    }
}

// Usage: fluent interface
const user = new UserBuilder('John', 'Doe')
    .setEmail('john@example.com')
    .setAge(30)
    .setPhone('555-1234')
    .setAddress('123 Main St')
    .build();

console.log(user);

// -------------------------------------------------------------------------------------------
// 2. QUERY BUILDER
// -------------------------------------------------------------------------------------------

/**
 * SQL-like query builder - common real-world use case.
 */

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this._select = ['*'];
        this._where = [];
        this._orderBy = [];
        this._limit = null;
        this._offset = null;
        this._joins = [];
        this._groupBy = [];
    }

    static from(table) {
        return new QueryBuilder(table);
    }

    select(...columns) {
        this._select = columns;
        return this;
    }

    where(column, operator, value) {
        this._where.push({ column, operator, value, type: 'AND' });
        return this;
    }

    orWhere(column, operator, value) {
        this._where.push({ column, operator, value, type: 'OR' });
        return this;
    }

    whereIn(column, values) {
        this._where.push({ 
            column, 
            operator: 'IN', 
            value: values, 
            type: 'AND' 
        });
        return this;
    }

    join(table, leftCol, operator, rightCol) {
        this._joins.push({ type: 'INNER', table, leftCol, operator, rightCol });
        return this;
    }

    leftJoin(table, leftCol, operator, rightCol) {
        this._joins.push({ type: 'LEFT', table, leftCol, operator, rightCol });
        return this;
    }

    orderBy(column, direction = 'ASC') {
        this._orderBy.push({ column, direction });
        return this;
    }

    groupBy(...columns) {
        this._groupBy = columns;
        return this;
    }

    limit(count) {
        this._limit = count;
        return this;
    }

    offset(count) {
        this._offset = count;
        return this;
    }

    toSQL() {
        let sql = `SELECT ${this._select.join(', ')} FROM ${this.table}`;

        // Joins
        for (const join of this._joins) {
            sql += ` ${join.type} JOIN ${join.table} ON ${join.leftCol} ${join.operator} ${join.rightCol}`;
        }

        // Where
        if (this._where.length > 0) {
            const conditions = this._where.map((w, i) => {
                const prefix = i === 0 ? 'WHERE' : w.type;
                const value = Array.isArray(w.value) 
                    ? `(${w.value.map(v => `'${v}'`).join(', ')})` 
                    : `'${w.value}'`;
                return `${prefix} ${w.column} ${w.operator} ${value}`;
            });
            sql += ` ${conditions.join(' ')}`;
        }

        // Group By
        if (this._groupBy.length > 0) {
            sql += ` GROUP BY ${this._groupBy.join(', ')}`;
        }

        // Order By
        if (this._orderBy.length > 0) {
            const orders = this._orderBy.map(o => `${o.column} ${o.direction}`);
            sql += ` ORDER BY ${orders.join(', ')}`;
        }

        // Limit & Offset
        if (this._limit !== null) {
            sql += ` LIMIT ${this._limit}`;
        }
        if (this._offset !== null) {
            sql += ` OFFSET ${this._offset}`;
        }

        return sql;
    }
}

// Usage
const query = QueryBuilder.from('users')
    .select('id', 'name', 'email')
    .where('status', '=', 'active')
    .where('age', '>', '18')
    .orderBy('name', 'ASC')
    .limit(10)
    .toSQL();

console.log(query);

// Complex query
const complexQuery = QueryBuilder.from('orders')
    .select('orders.id', 'users.name', 'products.title')
    .join('users', 'orders.user_id', '=', 'users.id')
    .leftJoin('products', 'orders.product_id', '=', 'products.id')
    .where('orders.status', '=', 'completed')
    .whereIn('orders.category', ['electronics', 'books'])
    .orderBy('orders.created_at', 'DESC')
    .limit(50)
    .toSQL();

console.log(complexQuery);

// -------------------------------------------------------------------------------------------
// 3. HTTP REQUEST BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Building HTTP request configurations.
 */

class RequestBuilder {
    constructor(baseUrl = '') {
        this.config = {
            method: 'GET',
            url: baseUrl,
            headers: {},
            body: null,
            timeout: 30000,
            retries: 0
        };
    }

    static create(baseUrl) {
        return new RequestBuilder(baseUrl);
    }

    get(path) {
        this.config.method = 'GET';
        this.config.url += path;
        return this;
    }

    post(path) {
        this.config.method = 'POST';
        this.config.url += path;
        return this;
    }

    put(path) {
        this.config.method = 'PUT';
        this.config.url += path;
        return this;
    }

    delete(path) {
        this.config.method = 'DELETE';
        this.config.url += path;
        return this;
    }

    header(key, value) {
        this.config.headers[key] = value;
        return this;
    }

    auth(token) {
        this.config.headers['Authorization'] = `Bearer ${token}`;
        return this;
    }

    contentType(type) {
        this.config.headers['Content-Type'] = type;
        return this;
    }

    json(data) {
        this.config.body = JSON.stringify(data);
        this.config.headers['Content-Type'] = 'application/json';
        return this;
    }

    formData(data) {
        // In browser: this.config.body = new FormData();
        this.config.body = data;
        return this;
    }

    timeout(ms) {
        this.config.timeout = ms;
        return this;
    }

    retry(count) {
        this.config.retries = count;
        return this;
    }

    build() {
        return { ...this.config };
    }

    async execute() {
        console.log('Executing request:', this.config);
        // In real app: return fetch(this.config.url, this.config);
        return { status: 200, data: 'response' };
    }
}

// Usage
const request = RequestBuilder.create('https://api.example.com')
    .post('/users')
    .auth('my-token')
    .json({ name: 'Alice', email: 'alice@example.com' })
    .timeout(5000)
    .retry(3)
    .build();

console.log(request);

// -------------------------------------------------------------------------------------------
// 4. HTML/DOM BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Building HTML elements programmatically.
 */

class ElementBuilder {
    constructor(tagName) {
        this.element = {
            tag: tagName,
            attributes: {},
            classes: [],
            styles: {},
            children: [],
            text: ''
        };
    }

    static create(tagName) {
        return new ElementBuilder(tagName);
    }

    id(id) {
        this.element.attributes.id = id;
        return this;
    }

    class(...classNames) {
        this.element.classes.push(...classNames);
        return this;
    }

    attr(name, value) {
        this.element.attributes[name] = value;
        return this;
    }

    style(property, value) {
        this.element.styles[property] = value;
        return this;
    }

    text(content) {
        this.element.text = content;
        return this;
    }

    child(elementBuilder) {
        this.element.children.push(elementBuilder.build());
        return this;
    }

    children(...builders) {
        builders.forEach(b => this.child(b));
        return this;
    }

    build() {
        return { ...this.element };
    }

    toHTML() {
        const { tag, attributes, classes, styles, children, text } = this.element;
        
        let attrs = '';
        if (classes.length > 0) {
            attrs += ` class="${classes.join(' ')}"`;
        }
        for (const [key, value] of Object.entries(attributes)) {
            attrs += ` ${key}="${value}"`;
        }
        if (Object.keys(styles).length > 0) {
            const styleStr = Object.entries(styles)
                .map(([k, v]) => `${k}: ${v}`)
                .join('; ');
            attrs += ` style="${styleStr}"`;
        }

        const childrenHTML = children
            .map(c => new ElementBuilder(c.tag).build = () => c)
            .join('');

        return `<${tag}${attrs}>${text}${childrenHTML}</${tag}>`;
    }
}

// Usage
const card = ElementBuilder.create('div')
    .class('card', 'shadow')
    .style('padding', '20px')
    .child(
        ElementBuilder.create('h2')
            .class('card-title')
            .text('Hello World')
    )
    .child(
        ElementBuilder.create('p')
            .class('card-body')
            .text('This is a card component')
    )
    .build();

console.log(JSON.stringify(card, null, 2));

// -------------------------------------------------------------------------------------------
// 5. CONFIGURATION BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Building application configuration objects.
 */

class AppConfigBuilder {
    constructor() {
        this.config = {
            env: 'development',
            port: 3000,
            database: null,
            logging: { level: 'info', format: 'json' },
            cache: null,
            security: { cors: true, helmet: true },
            features: []
        };
    }

    static create() {
        return new AppConfigBuilder();
    }

    environment(env) {
        this.config.env = env;
        return this;
    }

    port(port) {
        this.config.port = port;
        return this;
    }

    database(options) {
        this.config.database = {
            host: options.host || 'localhost',
            port: options.port || 5432,
            name: options.name,
            user: options.user,
            password: options.password,
            pool: options.pool || { min: 2, max: 10 }
        };
        return this;
    }

    logging(level, format = 'json') {
        this.config.logging = { level, format };
        return this;
    }

    cache(options) {
        this.config.cache = {
            type: options.type || 'memory',
            ttl: options.ttl || 3600,
            ...options
        };
        return this;
    }

    security(options) {
        this.config.security = { ...this.config.security, ...options };
        return this;
    }

    enableFeature(feature) {
        this.config.features.push(feature);
        return this;
    }

    production() {
        return this
            .environment('production')
            .logging('error', 'json')
            .security({ cors: true, helmet: true, rateLimit: true });
    }

    build() {
        // Validate required fields
        if (this.config.env === 'production' && !this.config.database) {
            throw new Error('Database configuration required for production');
        }
        return Object.freeze(this.config);
    }
}

// Usage
const devConfig = AppConfigBuilder.create()
    .environment('development')
    .port(3000)
    .database({ name: 'myapp_dev', user: 'dev', password: 'secret' })
    .logging('debug')
    .enableFeature('hot-reload')
    .build();

console.log(devConfig);

const prodConfig = AppConfigBuilder.create()
    .production()
    .port(8080)
    .database({ 
        host: 'prod-db.example.com', 
        name: 'myapp_prod', 
        user: 'admin', 
        password: 'secure-password' 
    })
    .cache({ type: 'redis', host: 'cache.example.com' })
    .build();

console.log(prodConfig);

// -------------------------------------------------------------------------------------------
// 6. FORM BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Building form schemas for validation and rendering.
 */

class FormBuilder {
    constructor(name) {
        this.form = {
            name,
            fields: [],
            validationRules: {},
            submitHandler: null
        };
    }

    static create(name) {
        return new FormBuilder(name);
    }

    field(config) {
        const field = {
            name: config.name,
            type: config.type || 'text',
            label: config.label || config.name,
            placeholder: config.placeholder || '',
            defaultValue: config.defaultValue || '',
            required: config.required || false,
            disabled: config.disabled || false,
            options: config.options || []  // For select/radio
        };
        this.form.fields.push(field);
        return this;
    }

    text(name, label) {
        return this.field({ name, label, type: 'text' });
    }

    email(name, label = 'Email') {
        return this.field({ name, label, type: 'email' });
    }

    password(name, label = 'Password') {
        return this.field({ name, label, type: 'password' });
    }

    number(name, label) {
        return this.field({ name, label, type: 'number' });
    }

    select(name, label, options) {
        return this.field({ name, label, type: 'select', options });
    }

    checkbox(name, label) {
        return this.field({ name, label, type: 'checkbox' });
    }

    textarea(name, label) {
        return this.field({ name, label, type: 'textarea' });
    }

    required() {
        const lastField = this.form.fields[this.form.fields.length - 1];
        if (lastField) {
            lastField.required = true;
            this.form.validationRules[lastField.name] = {
                ...this.form.validationRules[lastField.name],
                required: true
            };
        }
        return this;
    }

    min(value) {
        const lastField = this.form.fields[this.form.fields.length - 1];
        if (lastField) {
            this.form.validationRules[lastField.name] = {
                ...this.form.validationRules[lastField.name],
                min: value
            };
        }
        return this;
    }

    max(value) {
        const lastField = this.form.fields[this.form.fields.length - 1];
        if (lastField) {
            this.form.validationRules[lastField.name] = {
                ...this.form.validationRules[lastField.name],
                max: value
            };
        }
        return this;
    }

    onSubmit(handler) {
        this.form.submitHandler = handler;
        return this;
    }

    build() {
        return { ...this.form };
    }
}

// Usage
const loginForm = FormBuilder.create('loginForm')
    .email('email', 'Email Address').required()
    .password('password', 'Password').required().min(8)
    .checkbox('rememberMe', 'Remember me')
    .onSubmit((data) => console.log('Submitting:', data))
    .build();

console.log(JSON.stringify(loginForm, null, 2));

// -------------------------------------------------------------------------------------------
// 7. STEP BUILDER (FORCED ORDER)
// -------------------------------------------------------------------------------------------

/**
 * Builder that enforces a specific build order.
 */

class PizzaBuilder {
    constructor() {
        this.pizza = {};
    }

    // Step 1: Size (required first)
    static size(size) {
        const builder = new PizzaBuilder();
        builder.pizza.size = size;
        return new PizzaCrustStep(builder);
    }
}

class PizzaCrustStep {
    constructor(builder) {
        this.builder = builder;
    }

    // Step 2: Crust
    crust(type) {
        this.builder.pizza.crust = type;
        return new PizzaToppingsStep(this.builder);
    }
}

class PizzaToppingsStep {
    constructor(builder) {
        this.builder = builder;
        this.builder.pizza.toppings = [];
    }

    // Step 3: Toppings (can be chained)
    topping(item) {
        this.builder.pizza.toppings.push(item);
        return this;
    }

    // Final step
    build() {
        return this.builder.pizza;
    }
}

// Usage - must follow the order
const pizza = PizzaBuilder
    .size('large')           // Must start with size
    .crust('thin')           // Then crust
    .topping('pepperoni')    // Then toppings
    .topping('mushrooms')
    .topping('olives')
    .build();

console.log(pizza);

// -------------------------------------------------------------------------------------------
// 8. IMMUTABLE BUILDER
// -------------------------------------------------------------------------------------------

/**
 * Builder that returns new instances on each step (immutable).
 */

class ImmutableConfigBuilder {
    constructor(config = {}) {
        this.config = Object.freeze({ ...config });
    }

    set(key, value) {
        return new ImmutableConfigBuilder({
            ...this.config,
            [key]: value
        });
    }

    merge(partial) {
        return new ImmutableConfigBuilder({
            ...this.config,
            ...partial
        });
    }

    build() {
        return this.config;
    }
}

// Each method returns a new builder
const builder1 = new ImmutableConfigBuilder();
const builder2 = builder1.set('host', 'localhost');
const builder3 = builder2.set('port', 3000);
const builder4 = builder3.merge({ debug: true, timeout: 5000 });

console.log(builder1.build());  // {}
console.log(builder4.build());  // { host: 'localhost', port: 3000, debug: true, timeout: 5000 }

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * BUILDER PATTERN:
 * - Separates construction from representation
 * - Creates objects step-by-step
 * - Supports fluent/chainable interface
 *
 * TYPES OF BUILDERS:
 * - Classic Builder (with Director)
 * - Fluent Builder (most common in JS)
 * - Step Builder (enforced order)
 * - Immutable Builder
 *
 * USE CASES:
 * - Complex object construction
 * - Query builders (SQL, GraphQL)
 * - Request/Response builders
 * - Form schema builders
 * - Configuration objects
 * - DOM/HTML builders
 *
 * BENEFITS:
 * - Clear, readable code
 * - Prevents incomplete objects
 * - Easy to add new build steps
 * - Self-documenting API
 * - Flexible object creation
 *
 * BEST PRACTICES:
 * - Return 'this' for method chaining
 * - Validate in build() method
 * - Consider immutable builders for complex scenarios
 * - Use step builders when order matters
 * - Provide sensible defaults
 * - Make build() return immutable objects
 */
