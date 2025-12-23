/**
 * TOPIC: TEMPLATE LITERALS
 * DESCRIPTION:
 * Template literals (backticks) provide string interpolation,
 * multi-line strings, and tagged templates for custom processing.
 * Essential feature introduced in ES6.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC SYNTAX
// -------------------------------------------------------------------------------------------

// Template literal vs regular string
const regular = 'Hello, World!';
const template = `Hello, World!`;

// Backticks allow both quotes inside
const mixed = `He said "Hello" and she said 'Hi'`;

// -------------------------------------------------------------------------------------------
// 2. STRING INTERPOLATION
// -------------------------------------------------------------------------------------------

const name = 'Alice';
const age = 25;

// Expression interpolation with ${}
const greeting = `Hello, ${name}!`;
const info = `${name} is ${age} years old.`;

// Any expression works
const math = `2 + 2 = ${2 + 2}`;
const upper = `Name: ${name.toUpperCase()}`;
const conditional = `Status: ${age >= 18 ? 'Adult' : 'Minor'}`;

// Function calls
const now = `Time: ${new Date().toLocaleTimeString()}`;

// Object properties
const user = { name: 'Bob', email: 'bob@example.com' };
const profile = `User: ${user.name} (${user.email})`;

// -------------------------------------------------------------------------------------------
// 3. MULTI-LINE STRINGS
// -------------------------------------------------------------------------------------------

// Multi-line with template literals (preserves whitespace)
const multiLine = `
    Line 1
    Line 2
    Line 3
`;

// HTML templates
const html = `
    <div class="card">
        <h2>${name}</h2>
        <p>Age: ${age}</p>
    </div>
`;

// SQL queries
const sql = `
    SELECT * FROM users
    WHERE age > ${age}
    ORDER BY name
`;

// -------------------------------------------------------------------------------------------
// 4. ESCAPING
// -------------------------------------------------------------------------------------------

// Escape backtick
const withBacktick = `This is a backtick: \``;

// Escape dollar sign and braces
const escaped = `Price: \${99}`;  // "Price: ${99}"

// Newlines and tabs
const formatted = `Line1\nLine2\tTabbed`;

// Raw strings preserve escapes
String.raw`Line1\nLine2`;  // "Line1\\nLine2"

// -------------------------------------------------------------------------------------------
// 5. TAGGED TEMPLATES
// -------------------------------------------------------------------------------------------

/**
 * Tag functions process template literals.
 * Receive strings array and interpolated values.
 */

function tag(strings, ...values) {
    console.log('Strings:', strings);  // Array of string parts
    console.log('Values:', values);    // Array of interpolated values
    
    // Reconstruct with processing
    return strings.reduce((result, str, i) => {
        return result + str + (values[i] !== undefined ? values[i] : '');
    }, '');
}

const result = tag`Hello ${name}, you are ${age} years old.`;
// Strings: ['Hello ', ', you are ', ' years old.']
// Values: ['Alice', 25]

// -------------------------------------------------------------------------------------------
// 6. PRACTICAL TAG FUNCTIONS
// -------------------------------------------------------------------------------------------

// HTML escaping
function safeHtml(strings, ...values) {
    const escape = str => String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    
    return strings.reduce((result, str, i) => {
        const value = values[i] !== undefined ? escape(values[i]) : '';
        return result + str + value;
    }, '');
}

const userInput = '<script>alert("XSS")</script>';
const safe = safeHtml`<div>${userInput}</div>`;
// "<div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>"

// Highlight values
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i] !== undefined 
            ? `<mark>${values[i]}</mark>` 
            : '';
        return result + str + value;
    }, '');
}

// Debug logging
function debug(strings, ...values) {
    const formatted = strings.reduce((result, str, i) => {
        const value = values[i] !== undefined 
            ? JSON.stringify(values[i]) 
            : '';
        return result + str + value;
    }, '');
    console.log('[DEBUG]', formatted);
    return formatted;
}

// -------------------------------------------------------------------------------------------
// 7. STYLED COMPONENTS PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Popular in CSS-in-JS libraries like styled-components.
 */

function css(strings, ...values) {
    const style = strings.reduce((result, str, i) => {
        return result + str + (values[i] || '');
    }, '');
    
    // Create style element
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    return styleEl;
}

/*
const styles = css`
    .button {
        background: ${color};
        padding: ${padding}px;
    }
`;
*/

// -------------------------------------------------------------------------------------------
// 8. SQL QUERY BUILDER
// -------------------------------------------------------------------------------------------

function sql2(strings, ...values) {
    const params = [];
    const query = strings.reduce((result, str, i) => {
        if (values[i] !== undefined) {
            params.push(values[i]);
            return result + str + `$${params.length}`;
        }
        return result + str;
    }, '');
    
    return { query, params };
}

const userId = 123;
const status = 'active';
const { query, params } = sql2`
    SELECT * FROM users 
    WHERE id = ${userId} AND status = ${status}
`;
// query: "SELECT * FROM users WHERE id = $1 AND status = $2"
// params: [123, 'active']

// -------------------------------------------------------------------------------------------
// 9. STRING.RAW
// -------------------------------------------------------------------------------------------

/**
 * String.raw preserves raw string (escape sequences not processed).
 */

// Normal
console.log(`Line1\nLine2`);       // Two lines

// Raw
console.log(String.raw`Line1\nLine2`);  // "Line1\nLine2" as-is

// Useful for regex
const pattern = String.raw`\d+\.\d+`;  // "\\d+\\.\\d+"
const regex = new RegExp(pattern);

// Windows paths
const path = String.raw`C:\Users\name\Documents`;

// -------------------------------------------------------------------------------------------
// 10. NESTED TEMPLATES
// -------------------------------------------------------------------------------------------

const items = ['Apple', 'Banana', 'Cherry'];

// Template with nested template
const list = `
    <ul>
        ${items.map(item => `<li>${item}</li>`).join('\n        ')}
    </ul>
`;

// Conditional blocks
const showDetails = true;
const card = `
    <div class="card">
        <h2>${name}</h2>
        ${showDetails ? `
            <div class="details">
                <p>Age: ${age}</p>
            </div>
        ` : ''}
    </div>
`;

// -------------------------------------------------------------------------------------------
// 11. TEMPLATE LITERAL TYPES (TYPESCRIPT)
// -------------------------------------------------------------------------------------------

/**
 * In TypeScript, template literals can define string types.
 */

/*
type Color = 'red' | 'blue' | 'green';
type Size = 'small' | 'large';
type ColoredSize = `${Size}-${Color}`;  // 'small-red' | 'small-blue' | etc.

type EventName = `on${Capitalize<string>}`;  // 'onClick', 'onSubmit', etc.
*/

// -------------------------------------------------------------------------------------------
// 12. PERFORMANCE CONSIDERATIONS
// -------------------------------------------------------------------------------------------

// Template literals are generally fast
// For heavy concatenation, array join may be faster

// Many small concatenations - template is fine
const message = `${a} and ${b} and ${c}`;

// Very large strings - consider array
const parts = [];
for (let i = 0; i < 10000; i++) {
    parts.push(`Item ${i}`);
}
const largeString = parts.join('\n');

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * TEMPLATE LITERALS:
 * - Use backticks ` instead of quotes
 * - Interpolation: ${expression}
 * - Multi-line strings preserved
 * 
 * TAGGED TEMPLATES:
 * - tag`string ${value}`
 * - Receives (strings[], ...values)
 * - Used for: HTML escaping, SQL, CSS-in-JS
 * 
 * STRING.RAW:
 * - Preserves escape sequences
 * - Good for regex, file paths
 * 
 * USE CASES:
 * - String interpolation
 * - Multi-line HTML/SQL
 * - DSL creation (styled-components)
 * - Safe string construction
 */
