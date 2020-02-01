
import APATE from '../apate';

/* globals document, CustomEvent */

APATE.namespace('APATE.utils');


export default APATE.utils.EventBus = class {

    /**
     * Initialize a new event bus instance.
     */
    constructor() {
        this.bus = document.createElement('bus-element');
    }

    /**
     * Add an event listener.
     */
    addEventListener(event, callback) {
        this.bus.addEventListener(event, callback);
    }

    /**
     * Add an event listener for a single invoke.
     */
    addEventListenerOnce(event, callback) {
        this.bus.addEventListener(event, callback, { once: true });
    }

    /**
     * Remove an event listener.
     */
    removeEventListener(event, callback) {
        this.bus.removeEventListener(event, callback);
    }

    /**
     * Dispatch an event.
     */
    dispatchEvent(event, detail = {}) {
        this.bus.dispatchEvent(new CustomEvent(event, { detail }));
    }

};
