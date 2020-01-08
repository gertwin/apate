/**
 * Entry worker file
 */

import Interpreter from './interpreter';

/* global postMessage, */


const printer = function printer(text) {
    postMessage(text);
};


const end = function end() {
    setTimeout(() => {
        postMessage('READY');
    });
};


onmessage = function onmessage(e) {
    if (e.data.length > 0) {
        const interpreter = new Interpreter(printer);
        interpreter.run(e.data).then(() => {
            end();
        }).catch((error) => {
            printer(error);
            end();
        });
    }
};
