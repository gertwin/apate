
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
        let template = document.querySelector(elemId).innerHTML;
        template = template.replace('{{text}}', text);
        return template;
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
            const item = getMessageTemplate('#output-message', text);
            this.element.insertAdjacentHTML('beforeend', item);
        },

        /**
         * Add a error line to the output
         */
        addError(error) {
            const item = getMessageTemplate('#output-error', error);
            this.element.insertAdjacentHTML('beforeend', item);
        },
    };

    // return the constructor
    return fnConstructor;
}());


export default APATE.Output;
