import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';

import APATE from '../apate';

/* globals EVENT, window, HTMLElement, document, customElements */

APATE.namespace('APATE.components');


export default APATE.components.FormSaveElement = class extends HTMLElement {

    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._initialized) {
            return;
        }
        if (oldValue !== newValue) {
            this[name] = newValue;
        }
    }

    constructor() {
        super();
        // element references
        this._dialog = null;
        this._listElem = null;
        this._mdcList = null;
        this._textFieldFilename = null;

        // selected filename
        this._selectedFilename = null;
        this._initialized = false;
    }

    async connectedCallback() {
        window.EventBus.addEventListener(EVENT.TEMPLATE_LOADED, (event) => {
            if (event.detail.path === 'templates/form-save.html') {
                // template async loaded
                this.render();
            }
        });

        window.EventBus.addEventListener(EVENT.SHOW_FORM_SAVE, (event) => {
            this.show(event.detail.title, event.detail.filename);
        });

        this._initialized = true;
    }

    render() {
        // load template
        const template = document.querySelector('#form-save-template');
        const clone = document.importNode(template.content, true);
        this.appendChild(clone);
        // TODO: use shadow dom
        //
        // dialog
        this._textFieldFilename = document.querySelector('#text-field-filename');
        this._dialog = new MDCDialog(document.querySelector('#dialog-saveas'));
        this._textField = new MDCTextField(document.querySelector('#form-group-filename'));
        const btnSaveElem = document.querySelector('#save-btn');
        btnSaveElem.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._dialog) {
                const form = document.querySelector('#form-saveas');
                if (form.checkValidity()) {
                    // send event
                    window.EventBus.dispatchEvent(EVENT.ON_SAVE_FILE, {
                        filename: this._textFieldFilename.value,
                    });
                    this._dialog.close();
                }
            }
        });
        const btnNotSaveElem = document.querySelector('#not-save-btn');
        btnNotSaveElem.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._dialog) {
                this._dialog.close();
            }
        });
    }

    /**
     * Show file open form
     * @param  {string} title [form title]
     */
    show(title, filename) {
        // reset form
        const form = document.querySelector('#form-saveas');
        form.reset();
        this._textField.valid = true;
        // set title
        const titleElem = document.querySelector('#dialog-saveas-title');
        if (title) {
            titleElem.style.display = 'block';
            titleElem.innerText = title;
        } else {
            titleElem.style.display = 'none';
        }
        // set filename
        this._textFieldFilename.value = filename;

        try {
            this._dialog.open();
        } catch (error) {
            console.log(error);
        }
    }

};

customElements.define('form-save', APATE.components.FormSaveElement);
