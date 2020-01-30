import { MDCDialog } from '@material/dialog';
import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
// import { MDCSwitch } from '@material/switch';

import APATE from '../apate';
import Injector from '../utils/injector';

/* globals EVENT, window, HTMLElement, document, customElements */

APATE.namespace('APATE.components');

// button constants
const IDS = {
    OPEN_DOCUMENT: 1,
    OPEN_MODULE: 2,
    CANCEL: 3,
};


export default APATE.components.FormOpenElement = class extends HTMLElement {

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

        // selected filename
        this._selectedFilename = null;
        this._initialized = false;
    }

    async connectedCallback() {
        // if (this.hasAttribute('src')) {
        //     await this.setSrc();
        // }

        // if (this.hasAttribute('context')) {
        //     await this.setContext();
        // }

        window.EventBus.addEventListener(EVENT.TEMPLATE_LOADED, (event) => {
            if (event.detail.path === 'templates/form-open.html') {
                // template async loaded
                this.render();
            }
        });

        window.EventBus.addEventListener(EVENT.FORM_OPEN_SHOW, (event) => {
            this.show(event.detail.title);
        });

        this._initialized = true;
    }

    render() {
        // load template
        const template = document.querySelector('#form-open-template');
        const clone = document.importNode(template.content, true);
        this.appendChild(clone);
        // TODO: use shadow dom
        //
        // dialog
        this._dialog = new MDCDialog(document.querySelector('#form-open'));
        // list
        this._listElem = document.querySelector('#fileopen-list');
        this._mdcList = new MDCList(this._listElem);
        // const textFieldFilename = document.querySelector('#text-field-filename');
        const btnOpenElem = document.querySelector('#open-btn');
        btnOpenElem.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._dialog) {
                this._dialog.close(IDS.OPEN_DOCUMENT);
            }
        });
        const btnCancelElem = document.querySelector('#not-open-btn');
        btnCancelElem.addEventListener('click', (e) => {
            e.preventDefault();
            if (this._dialog) {
                this._dialog.close(IDS.CANCEL);
            }
        });
    }

    /**
     * Show file open form
     * @param  {string} title [form title]
     */
    show(title) {
        // set title
        const titleElem = document.querySelector('#form-open-title');
        if (title) {
            titleElem.style.display = 'block';
            titleElem.innerText = title;
        } else {
            // hide title
            titleElem.style.display = 'none';
        }
        // generate list of items
        Injector.resolve(['documentStore'], this.getFileList, this);
        // on closed event handler
        const onClosed = (e) => {
            this._dialog.unlisten('MDCDialog:closed', onClosed);
            if (e.detail.action === IDS.OPEN_DOCUMENT) {
                window.EventBus.dispatchEvent(EVENT.OPEN_FILE, { filename: this._selectedFilename });
            }
        };

        try {
            // show dialog
            this._dialog.listen('MDCDialog:closed', onClosed);
            this._dialog.open();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * generate a single filelist item
     * @param  {string} filename name of the file
     * @return {string}          dom node
     */
    static getFileListItem(filename) {
        const template = document.querySelector('#file-listitem');
        const clone = document.importNode(template.content, true);
        clone.querySelector('#filename').textContent = filename;
        return clone;
    }

    /**
     * generate a list with filenames
     */
    getFileList(datastore) {
        // remove previous list
        while (this._listElem.firstChild) {
            this._listElem.removeChild(this._listElem.firstChild);
        }
        // get current list
        datastore.getAllDocumentNames().then((names) => {
            names.forEach((name) => {
                this._listElem.appendChild(APATE.components.FormOpenElement.getFileListItem(name));
                // new added element
                const newElem = this._listElem.lastElementChild;
                newElem.setAttribute('data-key', name);
                // open file event handler
                newElem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // set filename
                    this._selectedFilename = name;
                    this._dialog.close(IDS.OPEN_DOCUMENT);
                });
                // delete file event handler
                const htmlelems = newElem.getElementsByClassName('delete');
                if (htmlelems && htmlelems.length > 0) {
                    const btnDelete = htmlelems[0];
                    btnDelete.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // delete filename from datastore
                        datastore.delDocumentData(name).then(() => {
                            // reload filelist
                            this.getFileList(datastore);
                        }).catch((message) => {
                            console.log(message);
                        });
                    });
                }
            });
            this._mdcList.listElements.map((listItemEl) => {
                return new MDCRipple(listItemEl);
            });
        });
    }

};

customElements.define('form-open', APATE.components.FormOpenElement);
