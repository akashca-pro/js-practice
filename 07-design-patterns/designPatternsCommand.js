/**
 * TOPIC: DESIGN PATTERNS - COMMAND
 * DESCRIPTION:
 * Command pattern encapsulates a request as an object, allowing
 * parameterization of clients with different requests, queuing of
 * requests, and support for undoable operations. Essential for
 * undo/redo, macro recording, and transaction-like operations.
 */

// -------------------------------------------------------------------------------------------
// 1. BASIC COMMAND PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Commands encapsulate actions as objects.
 * Each command has an execute method (and optionally undo).
 */

// Command interface
class Command {
    execute() {
        throw new Error('execute() must be implemented');
    }

    undo() {
        throw new Error('undo() must be implemented');
    }
}

// Receiver - the object that performs the actual work
class Light {
    constructor(location) {
        this.location = location;
        this.isOn = false;
    }

    turnOn() {
        this.isOn = true;
        console.log(`${this.location} light is ON`);
    }

    turnOff() {
        this.isOn = false;
        console.log(`${this.location} light is OFF`);
    }
}

// Concrete Commands
class LightOnCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }

    execute() {
        this.light.turnOn();
    }

    undo() {
        this.light.turnOff();
    }
}

class LightOffCommand extends Command {
    constructor(light) {
        super();
        this.light = light;
    }

    execute() {
        this.light.turnOff();
    }

    undo() {
        this.light.turnOn();
    }
}

// Invoker
class RemoteControl {
    constructor() {
        this.history = [];
    }

    executeCommand(command) {
        command.execute();
        this.history.push(command);
    }

    undoLastCommand() {
        const command = this.history.pop();
        if (command) {
            command.undo();
        }
    }
}

// Usage
const livingRoomLight = new Light('Living Room');
const lightOn = new LightOnCommand(livingRoomLight);
const lightOff = new LightOffCommand(livingRoomLight);

const remote = new RemoteControl();
remote.executeCommand(lightOn);   // Living Room light is ON
remote.executeCommand(lightOff);  // Living Room light is OFF
remote.undoLastCommand();         // Living Room light is ON

// -------------------------------------------------------------------------------------------
// 2. TEXT EDITOR WITH UNDO/REDO
// -------------------------------------------------------------------------------------------

/**
 * Full undo/redo implementation for a text editor.
 */

class TextEditor {
    constructor() {
        this.content = '';
        this.undoStack = [];
        this.redoStack = [];
    }

    executeCommand(command) {
        command.execute();
        this.undoStack.push(command);
        this.redoStack = [];  // Clear redo stack on new action
    }

    undo() {
        const command = this.undoStack.pop();
        if (command) {
            command.undo();
            this.redoStack.push(command);
        }
    }

    redo() {
        const command = this.redoStack.pop();
        if (command) {
            command.execute();
            this.undoStack.push(command);
        }
    }

    getContent() {
        return this.content;
    }
}

class InsertTextCommand {
    constructor(editor, position, text) {
        this.editor = editor;
        this.position = position;
        this.text = text;
    }

    execute() {
        const content = this.editor.content;
        this.editor.content = 
            content.slice(0, this.position) + 
            this.text + 
            content.slice(this.position);
    }

    undo() {
        const content = this.editor.content;
        this.editor.content = 
            content.slice(0, this.position) + 
            content.slice(this.position + this.text.length);
    }
}

class DeleteTextCommand {
    constructor(editor, position, length) {
        this.editor = editor;
        this.position = position;
        this.length = length;
        this.deletedText = '';
    }

    execute() {
        const content = this.editor.content;
        this.deletedText = content.slice(this.position, this.position + this.length);
        this.editor.content = 
            content.slice(0, this.position) + 
            content.slice(this.position + this.length);
    }

    undo() {
        const content = this.editor.content;
        this.editor.content = 
            content.slice(0, this.position) + 
            this.deletedText + 
            content.slice(this.position);
    }
}

class ReplaceTextCommand {
    constructor(editor, position, length, newText) {
        this.editor = editor;
        this.position = position;
        this.length = length;
        this.newText = newText;
        this.oldText = '';
    }

    execute() {
        const content = this.editor.content;
        this.oldText = content.slice(this.position, this.position + this.length);
        this.editor.content = 
            content.slice(0, this.position) + 
            this.newText + 
            content.slice(this.position + this.length);
    }

    undo() {
        const content = this.editor.content;
        this.editor.content = 
            content.slice(0, this.position) + 
            this.oldText + 
            content.slice(this.position + this.newText.length);
    }
}

// Usage
const editor = new TextEditor();
editor.executeCommand(new InsertTextCommand(editor, 0, 'Hello'));
console.log(editor.getContent());  // Hello

editor.executeCommand(new InsertTextCommand(editor, 5, ' World'));
console.log(editor.getContent());  // Hello World

editor.undo();
console.log(editor.getContent());  // Hello

editor.redo();
console.log(editor.getContent());  // Hello World

// -------------------------------------------------------------------------------------------
// 3. MACRO COMMANDS (COMPOSITE)
// -------------------------------------------------------------------------------------------

/**
 * Combine multiple commands into a single command.
 */

class MacroCommand {
    constructor(commands = []) {
        this.commands = commands;
    }

    add(command) {
        this.commands.push(command);
        return this;
    }

    execute() {
        this.commands.forEach(cmd => cmd.execute());
    }

    undo() {
        // Undo in reverse order
        [...this.commands].reverse().forEach(cmd => cmd.undo());
    }
}

// Usage: "Party Mode" macro
const kitchenLight = new Light('Kitchen');
const bedroomLight = new Light('Bedroom');

const partyModeOn = new MacroCommand()
    .add(new LightOnCommand(livingRoomLight))
    .add(new LightOnCommand(kitchenLight))
    .add(new LightOnCommand(bedroomLight));

const partyModeOff = new MacroCommand()
    .add(new LightOffCommand(livingRoomLight))
    .add(new LightOffCommand(kitchenLight))
    .add(new LightOffCommand(bedroomLight));

console.log('\n--- Party Mode ON ---');
partyModeOn.execute();

console.log('\n--- Undo Party Mode ---');
partyModeOn.undo();

// -------------------------------------------------------------------------------------------
// 4. COMMAND QUEUE / TASK QUEUE
// -------------------------------------------------------------------------------------------

/**
 * Queue commands for sequential or asynchronous execution.
 */

class CommandQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    enqueue(command) {
        this.queue.push(command);
        this.process();
    }

    async process() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const command = this.queue.shift();
            try {
                await command.execute();
            } catch (error) {
                console.error('Command failed:', error);
            }
        }

        this.isProcessing = false;
    }
}

class AsyncCommand {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
    }

    execute() {
        return new Promise(resolve => {
            console.log(`Starting: ${this.name}`);
            setTimeout(() => {
                console.log(`Completed: ${this.name}`);
                resolve();
            }, this.duration);
        });
    }
}

// Usage
const queue = new CommandQueue();
queue.enqueue(new AsyncCommand('Task A', 100));
queue.enqueue(new AsyncCommand('Task B', 50));
queue.enqueue(new AsyncCommand('Task C', 75));

// -------------------------------------------------------------------------------------------
// 5. TRANSACTION PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Use commands for transaction-like operations with rollback.
 */

class Transaction {
    constructor() {
        this.commands = [];
        this.executedCommands = [];
    }

    add(command) {
        this.commands.push(command);
        return this;
    }

    async commit() {
        try {
            for (const command of this.commands) {
                await command.execute();
                this.executedCommands.push(command);
            }
            console.log('Transaction committed successfully');
            return true;
        } catch (error) {
            console.error('Transaction failed, rolling back...');
            await this.rollback();
            return false;
        }
    }

    async rollback() {
        const toRollback = [...this.executedCommands].reverse();
        for (const command of toRollback) {
            try {
                await command.undo();
            } catch (e) {
                console.error('Rollback failed for command:', e);
            }
        }
        this.executedCommands = [];
        console.log('Rollback completed');
    }
}

// Database-like commands
class CreateRecordCommand {
    constructor(db, record) {
        this.db = db;
        this.record = record;
        this.createdId = null;
    }

    execute() {
        this.createdId = this.db.create(this.record);
        console.log(`Created record with ID: ${this.createdId}`);
    }

    undo() {
        if (this.createdId) {
            this.db.delete(this.createdId);
            console.log(`Deleted record with ID: ${this.createdId}`);
        }
    }
}

// Simple in-memory database
const simpleDB = {
    records: new Map(),
    nextId: 1,
    create(record) {
        const id = this.nextId++;
        this.records.set(id, { id, ...record });
        return id;
    },
    delete(id) {
        this.records.delete(id);
    }
};

// -------------------------------------------------------------------------------------------
// 6. FUNCTIONAL COMMAND PATTERN
// -------------------------------------------------------------------------------------------

/**
 * Commands using functions instead of classes.
 */

function createCommand(execute, undo) {
    return { execute, undo };
}

function createCalculatorCommands(calculator) {
    return {
        add: (value) => createCommand(
            () => { calculator.result += value; },
            () => { calculator.result -= value; }
        ),
        subtract: (value) => createCommand(
            () => { calculator.result -= value; },
            () => { calculator.result += value; }
        ),
        multiply: (value) => createCommand(
            () => { 
                calculator.previousResult = calculator.result;
                calculator.result *= value; 
            },
            () => { calculator.result = calculator.previousResult; }
        ),
        divide: (value) => createCommand(
            () => { 
                calculator.previousResult = calculator.result;
                calculator.result /= value; 
            },
            () => { calculator.result = calculator.previousResult; }
        )
    };
}

const calculator = { result: 0, previousResult: 0 };
const commands = createCalculatorCommands(calculator);
const history = [];

function execute(cmd) {
    cmd.execute();
    history.push(cmd);
}

function undo() {
    const cmd = history.pop();
    if (cmd) cmd.undo();
}

execute(commands.add(10));
console.log(calculator.result);  // 10

execute(commands.multiply(3));
console.log(calculator.result);  // 30

undo();
console.log(calculator.result);  // 10

// -------------------------------------------------------------------------------------------
// 7. COMMAND WITH VALIDATION
// -------------------------------------------------------------------------------------------

/**
 * Commands that validate before execution.
 */

class ValidatedCommand {
    canExecute() {
        return true;
    }

    execute() {
        if (!this.canExecute()) {
            throw new Error('Command cannot be executed');
        }
        return this.doExecute();
    }

    doExecute() {
        throw new Error('doExecute() must be implemented');
    }
}

class TransferMoneyCommand extends ValidatedCommand {
    constructor(fromAccount, toAccount, amount) {
        super();
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.amount = amount;
    }

    canExecute() {
        return (
            this.amount > 0 &&
            this.fromAccount.balance >= this.amount &&
            this.fromAccount.id !== this.toAccount.id
        );
    }

    doExecute() {
        this.fromAccount.balance -= this.amount;
        this.toAccount.balance += this.amount;
        console.log(`Transferred $${this.amount}`);
    }

    undo() {
        this.toAccount.balance -= this.amount;
        this.fromAccount.balance += this.amount;
        console.log(`Reversed transfer of $${this.amount}`);
    }
}

const accountA = { id: 1, balance: 1000 };
const accountB = { id: 2, balance: 500 };

const transfer = new TransferMoneyCommand(accountA, accountB, 200);
if (transfer.canExecute()) {
    transfer.execute();
}
console.log('Account A:', accountA.balance);  // 800
console.log('Account B:', accountB.balance);  // 700

// -------------------------------------------------------------------------------------------
// 8. LOGGING AND AUDIT TRAIL
// -------------------------------------------------------------------------------------------

/**
 * Commands with built-in logging for audit trails.
 */

class AuditableCommand {
    constructor(command, userId) {
        this.command = command;
        this.userId = userId;
        this.timestamp = null;
        this.status = 'pending';
    }

    execute() {
        this.timestamp = new Date().toISOString();
        try {
            this.command.execute();
            this.status = 'success';
            this.log('EXECUTE');
        } catch (error) {
            this.status = 'failed';
            this.log('EXECUTE_FAILED', error.message);
            throw error;
        }
    }

    undo() {
        try {
            this.command.undo();
            this.log('UNDO');
        } catch (error) {
            this.log('UNDO_FAILED', error.message);
            throw error;
        }
    }

    log(action, error = null) {
        const logEntry = {
            action,
            command: this.command.constructor.name,
            userId: this.userId,
            timestamp: this.timestamp,
            status: this.status,
            error
        };
        console.log('AUDIT:', JSON.stringify(logEntry));
    }
}

// -------------------------------------------------------------------------------------------
// 9. COMMAND DISPATCHER / HANDLER
// -------------------------------------------------------------------------------------------

/**
 * Central command dispatcher/handler pattern.
 */

class CommandDispatcher {
    constructor() {
        this.handlers = new Map();
        this.middleware = [];
    }

    register(commandType, handler) {
        this.handlers.set(commandType, handler);
    }

    use(middleware) {
        this.middleware.push(middleware);
    }

    async dispatch(command) {
        const handler = this.handlers.get(command.type);
        if (!handler) {
            throw new Error(`No handler for command: ${command.type}`);
        }

        // Run middleware
        for (const mw of this.middleware) {
            await mw(command);
        }

        return handler(command);
    }
}

const dispatcher = new CommandDispatcher();

// Logging middleware
dispatcher.use(async (cmd) => {
    console.log(`Dispatching: ${cmd.type}`);
});

// Register handlers
dispatcher.register('CREATE_USER', async (cmd) => {
    console.log('Creating user:', cmd.payload);
    return { id: 1, ...cmd.payload };
});

dispatcher.register('DELETE_USER', async (cmd) => {
    console.log('Deleting user:', cmd.payload.id);
});

// Dispatch commands
dispatcher.dispatch({
    type: 'CREATE_USER',
    payload: { name: 'Alice', email: 'alice@example.com' }
});

// -------------------------------------------------------------------------------------------
// SUMMARY & BEST PRACTICES
// -------------------------------------------------------------------------------------------

/**
 * COMMAND PATTERN:
 * - Encapsulates requests as objects
 * - Supports undo/redo operations
 * - Enables command queuing and logging
 *
 * COMPONENTS:
 * - Command: interface with execute()/undo()
 * - ConcreteCommand: implements Command
 * - Receiver: object that performs the action
 * - Invoker: triggers command execution
 * - Client: creates and configures commands
 *
 * USE CASES:
 * - Undo/Redo functionality
 * - Transaction systems
 * - Macro recording/playback
 * - Task queues
 * - Remote procedure calls
 * - Audit logging
 *
 * VARIATIONS:
 * - Macro Command (composite)
 * - Transactional Commands
 * - Validated Commands
 * - Async Commands
 * - Command Dispatcher
 *
 * BEST PRACTICES:
 * - Keep commands small and focused
 * - Store enough state for proper undo
 * - Use factories for complex command creation
 * - Consider command serialization for persistence
 * - Add validation in canExecute() methods
 */
