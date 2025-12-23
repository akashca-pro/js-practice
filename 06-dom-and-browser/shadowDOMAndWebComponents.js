/**
 * TOPIC: SHADOW DOM & WEB COMPONENTS
 * DESCRIPTION:
 * Web Components is a set of web standards for creating reusable
 * custom elements. Shadow DOM provides encapsulation, preventing
 * styles and scripts from leaking in or out.
 */

// -------------------------------------------------------------------------------------------
// 1. CUSTOM ELEMENTS BASICS
// -------------------------------------------------------------------------------------------

/**
 * Custom Elements allow you to define new HTML tags.
 * Must contain a hyphen (e.g., my-component, not mycomponent).
 */

class MyButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<button>Click me</button>`;
    }
    
    connectedCallback() {
        // Called when element is added to DOM
        console.log('MyButton added to DOM');
    }
    
    disconnectedCallback() {
        // Called when element is removed from DOM
        console.log('MyButton removed from DOM');
    }
}

// Register the custom element
customElements.define('my-button', MyButton);

// Use in HTML: <my-button></my-button>

// -------------------------------------------------------------------------------------------
// 2. SHADOW DOM BASICS
// -------------------------------------------------------------------------------------------

/**
 * Shadow DOM encapsulates component internals.
 * Styles don't leak in or out.
 */

class EncapsulatedButton extends HTMLElement {
    constructor() {
        super();
        
        // Create shadow root
        const shadow = this.attachShadow({ mode: 'open' });
        
        // Add encapsulated content
        shadow.innerHTML = `
            <style>
                button {
                    background: blue;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;
                }
                button:hover {
                    background: darkblue;
                }
            </style>
            <button><slot></slot></button>
        `;
    }
}

customElements.define('encapsulated-button', EncapsulatedButton);

// Usage: <encapsulated-button>Click Me</encapsulated-button>

// -------------------------------------------------------------------------------------------
// 3. SHADOW DOM MODES
// -------------------------------------------------------------------------------------------

/**
 * mode: 'open' - shadow root accessible via element.shadowRoot
 * mode: 'closed' - shadow root is null (more encapsulated)
 */

class OpenShadow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
}
// element.shadowRoot // Works

class ClosedShadow extends HTMLElement {
    #shadow;
    constructor() {
        super();
        this.#shadow = this.attachShadow({ mode: 'closed' });
    }
}
// element.shadowRoot // Returns null

// -------------------------------------------------------------------------------------------
// 4. SLOTS - CONTENT PROJECTION
// -------------------------------------------------------------------------------------------

class CardComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .card {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 16px;
                }
                .header { font-weight: bold; margin-bottom: 10px; }
                .footer { margin-top: 10px; color: gray; }
            </style>
            <div class="card">
                <div class="header"><slot name="header">Default Header</slot></div>
                <div class="content"><slot>Default Content</slot></div>
                <div class="footer"><slot name="footer"></slot></div>
            </div>
        `;
    }
}

customElements.define('card-component', CardComponent);

// Usage:
// <card-component>
//     <span slot="header">My Title</span>
//     <p>Main content goes here</p>
//     <span slot="footer">Footer text</span>
// </card-component>

// -------------------------------------------------------------------------------------------
// 5. LIFECYCLE CALLBACKS
// -------------------------------------------------------------------------------------------

class LifecycleDemo extends HTMLElement {
    static get observedAttributes() {
        return ['value', 'disabled'];  // Attributes to watch
    }
    
    constructor() {
        super();
        console.log('1. Constructor');
    }
    
    connectedCallback() {
        console.log('2. Connected to DOM');
    }
    
    disconnectedCallback() {
        console.log('4. Disconnected from DOM');
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`3. Attribute "${name}" changed: ${oldValue} -> ${newValue}`);
    }
    
    adoptedCallback() {
        console.log('Moved to new document');
    }
}

customElements.define('lifecycle-demo', LifecycleDemo);

// -------------------------------------------------------------------------------------------
// 6. TEMPLATES
// -------------------------------------------------------------------------------------------

/**
 * <template> holds markup that isn't rendered until used.
 * More efficient than creating innerHTML strings.
 */

// Define in HTML:
// <template id="my-template">
//     <style>...</style>
//     <div class="container">...</div>
// </template>

class TemplateComponent extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('my-template');
        const content = template.content.cloneNode(true);
        
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(content);
    }
}

// -------------------------------------------------------------------------------------------
// 7. CSS CUSTOM PROPERTIES (Styling from Outside)
// -------------------------------------------------------------------------------------------

class ThemeableButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background: var(--btn-bg, blue);
                    color: var(--btn-color, white);
                    padding: var(--btn-padding, 10px 20px);
                }
            </style>
            <button><slot></slot></button>
        `;
    }
}

customElements.define('themeable-button', ThemeableButton);

// Style from outside:
// themeable-button {
//     --btn-bg: red;
//     --btn-color: yellow;
// }

// -------------------------------------------------------------------------------------------
// 8. CSS PARTS (Styling Specific Elements)
// -------------------------------------------------------------------------------------------

class ExposedParts extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <div part="container">
                <span part="label">Label</span>
                <button part="button">Click</button>
            </div>
        `;
    }
}

customElements.define('exposed-parts', ExposedParts);

// Style from outside using ::part()
// exposed-parts::part(button) {
//     background: green;
// }

// -------------------------------------------------------------------------------------------
// 9. EVENTS IN SHADOW DOM
// -------------------------------------------------------------------------------------------

class EventComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `<button>Click</button>`;
        
        this.shadowRoot.querySelector('button').addEventListener('click', (e) => {
            // Dispatch custom event that bubbles out
            this.dispatchEvent(new CustomEvent('button-click', {
                bubbles: true,
                composed: true,  // Crosses shadow DOM boundary
                detail: { clicked: true }
            }));
        });
    }
}

customElements.define('event-component', EventComponent);

// Listen from outside:
// document.querySelector('event-component')
//     .addEventListener('button-click', (e) => console.log(e.detail));

// -------------------------------------------------------------------------------------------
// 10. EXTENDING BUILT-IN ELEMENTS
// -------------------------------------------------------------------------------------------

class FancyButton extends HTMLButtonElement {
    constructor() {
        super();
        this.style.background = 'linear-gradient(45deg, red, blue)';
        this.style.color = 'white';
    }
}

customElements.define('fancy-button', FancyButton, { extends: 'button' });

// Usage: <button is="fancy-button">Fancy!</button>

// -------------------------------------------------------------------------------------------
// 11. PRACTICAL EXAMPLE: ACCORDION
// -------------------------------------------------------------------------------------------

class AccordionItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .header { cursor: pointer; padding: 10px; background: #f0f0f0; }
                .content { padding: 10px; display: none; }
                .content.open { display: block; }
            </style>
            <div class="header"><slot name="header"></slot></div>
            <div class="content"><slot></slot></div>
        `;
        
        this.shadowRoot.querySelector('.header').addEventListener('click', () => {
            this.shadowRoot.querySelector('.content').classList.toggle('open');
        });
    }
}

customElements.define('accordion-item', AccordionItem);

// -------------------------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------------------------

/**
 * WEB COMPONENTS:
 * - Custom Elements: Define new HTML tags
 * - Shadow DOM: Style/script encapsulation
 * - Templates: Reusable markup
 * - Slots: Content projection
 * 
 * SHADOW DOM:
 * - Styles don't leak in or out
 * - mode: 'open' or 'closed'
 * - CSS custom properties for theming
 * - ::part() for specific element styling
 * 
 * LIFECYCLE:
 * - constructor: Setup
 * - connectedCallback: Added to DOM
 * - disconnectedCallback: Removed from DOM
 * - attributeChangedCallback: Attribute changed
 * 
 * EVENTS:
 * - Use composed: true to cross shadow boundary
 */
