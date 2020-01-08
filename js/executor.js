
import APATE from './apate';
// import Output from './output';

/* globals $, Worker */

APATE.namespace('APATE.Executor');


APATE.Executor = (function settings() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(output) {
        this.worker = null;
        this.output = output;
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Executor,
        version: '1.0',

        /**
         * Run the program
         * @param {string} program to run
         */
        run(program) {
            // disable button
            $('#button-run').prop('disabled', true);
            // start worker
            if (this.worker === null) {
                this.worker = new Worker('jsscm-bundle.js');

                /**
                 * Message callback function
                 * @param  {object} e [event type]
                 */
                this.worker.onmessage = (e) => {
                    if (e.data === 'READY') {
                        this.output.addLine('*Ready*');
                        $('#button-run').prop('disabled', false);
                        this.worker.terminate();
                    } else if (e.data.type === 'printerr') {
                        this.output.addError(e.data.message);
                    } else if (e.data.type === 'println') {
                        this.output.addLine(e.data.message);
                    }
                };

                /**
                 * Error callback function
                 * @param  {object} e [event type]
                 */
                this.worker.onerror = (e) => {
                    this.output.addError(`Error: ${e.data}`);
                };
            }
            // post program to the worker
            this.worker.postMessage(program);
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.Executor;
