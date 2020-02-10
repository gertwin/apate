
/* globals window, document, CustomEvent */

// eventbus event names
window.EVENT = {
    // html template loaded
    TEMPLATE_LOADED: 'template-loaded',

    // // form open
    // SHOW_FORM_OPEN: 'show-form-open',
    // SHOW_FORM_SAVE: 'show-form-save',
    // SHOW_MESSAGEBOX: 'show-messagebox',

    // // action event
    // ON_OPEN_FILE: 'on-open-file',
    // ON_SAVE_FILE: 'on-save-file',

    // // message events
    // OUTPUT_ADD_LINE: 'output-add-line',
    // OUTPUT_ADD_ERROR: 'output-add-error',
};


export default class EventBus {

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

}

// global eventbus
window.EventBus = new EventBus();
