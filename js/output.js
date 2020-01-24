
import APATE from './apate';

/* globals $, document */

APATE.namespace('APATE.Output');


APATE.Output = (function output() {

    /**
     * generate a single message item
     * @param  {string} text log text
     * @return {string} dom node
     */
    const getMessageTemplate = (elemId, text) => {
        const template = document.querySelector(elemId);
        template.content.querySelector('#message').textContent = text;
        return document.importNode(template.content, true);
    };

    const fnConstructor = function fn(outputElement) {
        this.element = outputElement;
        $('#output-clear').click(this.clear.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Output,
        version: '1.0',

        /**
         * clear the output
         */
        clear() {
            while (this.element.firstChild) {
                this.element.removeChild(this.element.firstChild);
            }
        },

        /**
         * Add a line to the output
         */
        addLine(text) {
            this.element.appendChild(getMessageTemplate('#output-message', text));
        },

        /**
         * Add a error line to the output
         */
        addError(error) {
            this.element.appendChild(getMessageTemplate('#output-error', error));
        },
    };

    // return the constructor
    return fnConstructor;
}());


export default APATE.Output;
