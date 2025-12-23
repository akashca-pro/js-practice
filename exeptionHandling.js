/**
 * This is for getting uncaught error (global level), js throws errors up to each function in the callstack.
 * If there's no catch block or global error handler, the runtime will handle the error.
 * after an uncaught exception, the Node process may be in an inconsistent state. That handler is only for logging and graceful shutdown, not recovery.
 */
process.on('uncaughtException',(err)=>{
    console.error("Error caught", err);
})

function handleError(err){
    if(err instanceof ReferenceError)return true
}

async function run(){
    try {
        await Promise.reject(new Error('Async Failure'))
    } catch (error) {
        console.log(error);
    }
}

run() // Async Failure.


try{
    console.log(notDeclared); // Reference Error.
    const num = 10; 
    num(); // Type Error.
    eval("let a = ;"); //Syntax Error.
    new Array(-1); // Range Error.
    decodeURIComponent("%"); // URIError.
    throw new Error('Something went wrong'); // Other Error.
}catch(err){
    if(err instanceof ReferenceError) console.log('Reference Error');
    if(err instanceof TypeError) console.log('TypeError');
    if(err instanceof SyntaxError) console.log('Syntax Error');
    if(err instanceof RangeError) console.log('Range Error');
    console.log(err.name, err.message);
}