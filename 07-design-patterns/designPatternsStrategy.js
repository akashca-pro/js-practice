/**
 * TOPIC: DESIGN PATTERNS - STRATEGY
 * DESCRIPTION:
 * Strategy pattern defines a family of algorithms, encapsulates each one,
 * and makes them interchangeable. It lets the algorithm vary independently
 * from clients that use it. Perfect for payment processing, validation,
 * sorting, and any scenario where you need runtime algorithm selection.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC STRATEGY PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Traditional implementation with strategy interface.
 * Strategies are interchangeable objects that implement a common method.
 */

// Strategy implementations
const strategies = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b,
};

// Context that uses strategies
class Calculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(a, b) {
    return this.strategy(a, b);
  }
}

const calc = new Calculator(strategies.add);
console.log(calc.execute(5, 3)); // 8

calc.setStrategy(strategies.multiply);
console.log(calc.execute(5, 3)); // 15

// -------------------------------------------------------------------------------------------
// 2. PAYMENT PROCESSING EXAMPLE
// -------------------------------------------------------------------------------------------

/**
 * Real-world example: different payment methods as strategies.
 */

const paymentStrategies = {
  creditCard: {
    name: "Credit Card",
    validate(details) {
      return details.cardNumber && details.cvv && details.expiry;
    },
    process(amount, details) {
      console.log(
        `Processing $${amount} via Credit Card ending in ${details.cardNumber.slice(
          -4
        )}`
      );
      return { success: true, transactionId: `CC-${Date.now()}` };
    },
  },

  paypal: {
    name: "PayPal",
    validate(details) {
      return details.email && details.password;
    },
    process(amount, details) {
      console.log(`Processing $${amount} via PayPal for ${details.email}`);
      return { success: true, transactionId: `PP-${Date.now()}` };
    },
  },

  crypto: {
    name: "Cryptocurrency",
    validate(details) {
      return details.walletAddress && details.currency;
    },
    process(amount, details) {
      console.log(
        `Processing $${amount} in ${details.currency} to ${details.walletAddress}`
      );
      return { success: true, transactionId: `CRYPTO-${Date.now()}` };
    },
  },
};

class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  checkout(amount, details) {
    if (!this.strategy.validate(details)) {
      throw new Error(`Invalid details for ${this.strategy.name}`);
    }
    return this.strategy.process(amount, details);
  }
}

// Usage
const processor = new PaymentProcessor(paymentStrategies.creditCard);
const result = processor.checkout(99.99, {
  cardNumber: "4111111111111111",
  cvv: "123",
  expiry: "12/25",
});
console.log(result);

// -------------------------------------------------------------------------------------------
// 3. VALIDATION STRATEGIES
// -------------------------------------------------------------------------------------------

/**
 * Form validation with different validation strategies.
 */

const validators = {
  required: (value) => ({
    valid: value !== null && value !== undefined && value !== "",
    message: "This field is required",
  }),

  email: (value) => ({
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: "Invalid email format",
  }),

  minLength: (min) => (value) => ({
    valid: value && value.length >= min,
    message: `Minimum ${min} characters required`,
  }),

  maxLength: (max) => (value) => ({
    valid: !value || value.length <= max,
    message: `Maximum ${max} characters allowed`,
  }),

  pattern: (regex, message) => (value) => ({
    valid: regex.test(value),
    message,
  }),

  numeric: (value) => ({
    valid: /^\d+$/.test(value),
    message: "Only numbers allowed",
  }),
};

class FieldValidator {
  constructor() {
    this.strategies = [];
  }

  addRule(strategy) {
    this.strategies.push(strategy);
    return this; // Enable chaining
  }

  validate(value) {
    const errors = [];

    for (const strategy of this.strategies) {
      const result = strategy(value);
      if (!result.valid) {
        errors.push(result.message);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Usage
const emailValidator = new FieldValidator()
  .addRule(validators.required)
  .addRule(validators.email)
  .addRule(validators.maxLength(50));

console.log(emailValidator.validate(""));
console.log(emailValidator.validate("test@example.com"));
console.log(emailValidator.validate("invalid-email"));

// -------------------------------------------------------------------------------------------
// 4. SORTING STRATEGIES
// -------------------------------------------------------------------------------------------

/**
 * Different sorting strategies for various data types.
 */

const sortStrategies = {
  alphabetical: (a, b) => a.localeCompare(b),
  alphabeticalDesc: (a, b) => b.localeCompare(a),
  numeric: (a, b) => a - b,
  numericDesc: (a, b) => b - a,
  byLength: (a, b) => a.length - b.length,
  byDate: (a, b) => new Date(a) - new Date(b),
  byProperty: (prop) => (a, b) => {
    if (a[prop] < b[prop]) return -1;
    if (a[prop] > b[prop]) return 1;
    return 0;
  },
};

class SortableList {
  constructor(items) {
    this.items = [...items];
  }

  sort(strategy) {
    return [...this.items].sort(strategy);
  }
}

const numbers = new SortableList([3, 1, 4, 1, 5, 9, 2, 6]);
console.log(numbers.sort(sortStrategies.numeric));
console.log(numbers.sort(sortStrategies.numericDesc));

const users = new SortableList([
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 },
]);
console.log(users.sort(sortStrategies.byProperty("age")));

// -------------------------------------------------------------------------------------------
// 5. COMPRESSION STRATEGIES
// -------------------------------------------------------------------------------------------

/**
 * Different compression algorithms as strategies.
 */

const compressionStrategies = {
  none: {
    name: "None",
    compress: (data) => data,
    decompress: (data) => data,
  },

  base64: {
    name: "Base64",
    compress: (data) => Buffer.from(data).toString("base64"),
    decompress: (data) => Buffer.from(data, "base64").toString("utf8"),
  },

  runLength: {
    name: "Run-Length Encoding",
    compress: (data) => {
      let result = "";
      let count = 1;
      for (let i = 0; i < data.length; i++) {
        if (data[i] === data[i + 1]) {
          count++;
        } else {
          result += count > 1 ? `${count}${data[i]}` : data[i];
          count = 1;
        }
      }
      return result;
    },
    decompress: (data) => {
      return data.replace(/(\d+)(.)/g, (_, count, char) =>
        char.repeat(parseInt(count))
      );
    },
  },
};

class DataCompressor {
  constructor(strategy = compressionStrategies.none) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  compress(data) {
    console.log(`Compressing with ${this.strategy.name}`);
    return this.strategy.compress(data);
  }

  decompress(data) {
    return this.strategy.decompress(data);
  }
}

const compressor = new DataCompressor(compressionStrategies.base64);
const compressed = compressor.compress("Hello World");
console.log("Compressed:", compressed);
console.log("Decompressed:", compressor.decompress(compressed));

// -------------------------------------------------------------------------------------------
// 6. SHIPPING STRATEGIES
// -------------------------------------------------------------------------------------------

/**
 * E-commerce shipping calculation strategies.
 */

const shippingStrategies = {
  standard: {
    name: "Standard Shipping",
    calculate: (weight, distance) => {
      const base = 5.99;
      const weightCost = weight * 0.5;
      const distanceCost = distance * 0.01;
      return base + weightCost + distanceCost;
    },
    estimatedDays: () => "5-7 business days",
  },

  express: {
    name: "Express Shipping",
    calculate: (weight, distance) => {
      const base = 15.99;
      const weightCost = weight * 0.75;
      const distanceCost = distance * 0.02;
      return base + weightCost + distanceCost;
    },
    estimatedDays: () => "2-3 business days",
  },

  overnight: {
    name: "Overnight Shipping",
    calculate: (weight, distance) => {
      const base = 29.99;
      const weightCost = weight * 1.0;
      const distanceCost = distance * 0.03;
      return base + weightCost + distanceCost;
    },
    estimatedDays: () => "1 business day",
  },

  free: {
    name: "Free Shipping",
    calculate: () => 0,
    estimatedDays: () => "7-14 business days",
  },
};

class ShippingCalculator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  calculate(weight, distance) {
    const cost = this.strategy.calculate(weight, distance);
    return {
      method: this.strategy.name,
      cost: cost.toFixed(2),
      estimatedDelivery: this.strategy.estimatedDays(),
    };
  }

  getAllOptions(weight, distance) {
    return Object.values(shippingStrategies).map((strategy) => ({
      method: strategy.name,
      cost: strategy.calculate(weight, distance).toFixed(2),
      estimatedDelivery: strategy.estimatedDays(),
    }));
  }
}

const shipping = new ShippingCalculator(shippingStrategies.standard);
console.log(shipping.calculate(5, 100));
console.log("All options:", shipping.getAllOptions(5, 100));

// -------------------------------------------------------------------------------------------
// 7. STRATEGY WITH FACTORY
// -------------------------------------------------------------------------------------------

/**
 * Combining Strategy with Factory pattern for cleaner API.
 */

class AuthStrategy {
  authenticate(credentials) {
    throw new Error("authenticate() must be implemented");
  }
}

class LocalAuthStrategy extends AuthStrategy {
  authenticate({ username, password }) {
    // Simulate local auth
    return {
      success: username === "admin" && password === "password",
      user: { username, role: "user" },
    };
  }
}

class OAuthStrategy extends AuthStrategy {
  constructor(provider) {
    super();
    this.provider = provider;
  }

  authenticate({ token }) {
    // Simulate OAuth
    return {
      success: !!token,
      user: { provider: this.provider, token },
    };
  }
}

class JWTStrategy extends AuthStrategy {
  authenticate({ token }) {
    // Simulate JWT verification
    return {
      success: token && token.startsWith("eyJ"),
      user: { token },
    };
  }
}

// Strategy Factory
class AuthStrategyFactory {
  static create(type, options = {}) {
    switch (type) {
      case "local":
        return new LocalAuthStrategy();
      case "oauth":
        return new OAuthStrategy(options.provider || "google");
      case "jwt":
        return new JWTStrategy();
      default:
        throw new Error(`Unknown auth strategy: ${type}`);
    }
  }
}

class AuthService {
  constructor(strategyType, options) {
    this.strategy = AuthStrategyFactory.create(strategyType, options);
  }

  login(credentials) {
    return this.strategy.authenticate(credentials);
  }

  switchStrategy(type, options) {
    this.strategy = AuthStrategyFactory.create(type, options);
  }
}

const auth = new AuthService("local");
console.log(auth.login({ username: "admin", password: "password" }));

auth.switchStrategy("jwt");
console.log(auth.login({ token: "eyJhbGciOiJIUzI1NiJ9..." }));

// -------------------------------------------------------------------------------------------
// 8. FUNCTIONAL STRATEGY PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Using closures for a more functional approach.
 */

const createFormatter = (strategies) => {
  let currentStrategy = strategies.default;

  return {
    setFormat(name) {
      currentStrategy = strategies[name] || strategies.default;
    },
    format(data) {
      return currentStrategy(data);
    },
  };
};

const dateFormatter = createFormatter({
  default: (date) => date.toISOString(),
  short: (date) => date.toLocaleDateString(),
  long: (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  time: (date) => date.toLocaleTimeString(),
  relative: (date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  },
});

const now = new Date();
console.log(dateFormatter.format(now));

dateFormatter.setFormat("long");
console.log(dateFormatter.format(now));

dateFormatter.setFormat("relative");
console.log(dateFormatter.format(new Date(Date.now() - 86400000)));

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * STRATEGY PATTERN:
 * - Defines family of interchangeable algorithms
 * - Encapsulates each algorithm in its own object
 * - Enables runtime algorithm selection
 *
 * USE CASES:
 * - Payment processing (different payment methods)
 * - Validation (different validation rules)
 * - Sorting (different sorting algorithms)
 * - Compression (different compression formats)
 * - Authentication (different auth methods)
 * - Pricing (different pricing strategies)
 *
 * BENEFITS:
 * - Open/Closed Principle (add new strategies without modifying context)
 * - Single Responsibility (each strategy has one job)
 * - Easy testing (test each strategy independently)
 * - Runtime flexibility (switch algorithms dynamically)
 *
 * IMPLEMENTATION OPTIONS:
 * - Object literals (simplest)
 * - Classes with common interface
 * - Factory pattern combination
 * - Functional closures
 *
 * BEST PRACTICES:
 * - Keep strategies stateless when possible
 * - Use consistent interface across strategies
 * - Combine with Factory for cleaner instantiation
 * - Document strategy requirements clearly
 */
