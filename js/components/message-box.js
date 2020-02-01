import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';


// import i18n from '../utils/i18n';
import APATE from '../apate';

/* globals EVENT, IDS, window, HTMLElement, document, customElements */

APATE.namespace('APATE.components');


export default APATE.components.MessageBox = class extends HTMLElement {

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
        this._messagebox = null;
        this._btnYesElem = null;
        this._btnNoElem = null;
        this._btnOkElem = null;
        this._btnCancelElem = null;
        this._initialized = false;
    }

    async connectedCallback() {
        window.EventBus.addEventListener(EVENT.TEMPLATE_LOADED, (event) => {
            if (event.detail.path === 'templates/messagebox.html') {
                // template async loaded
                this.render();
            }
        });

        window.EventBus.addEventListener(EVENT.SHOW_MESSAGEBOX, (event) => {
            this.show(event.detail.title, event.detail.message, event.detail.buttons);
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
        // messagebox
        let btnRipple = null;
        this._messagebox = new MDCDialog(document.querySelector('#message-box'));
        this._btnYesElem = document.querySelector('#msg-yes-btn');
        btnRipple = new MDCRipple(this._btnYesElem);
        this._btnYesElem.addEventListener('click', () => {
            // send event
            window.EventBus.dispatchEvent(EVENT.ON_SAVE_FILE, {
                button: IDS.YES,
            });
            this._messagebox.close();
        });
        this._btnNoElem = document.querySelector('#msg-no-btn');
        btnRipple = new MDCRipple(this._btnNoElem);
        this._btnNoElem.addEventListener('click', () => {
            // send event
            window.EventBus.dispatchEvent(EVENT.ON_SAVE_FILE, {
                button: IDS.NO,
            });
            this._messagebox.close();
        });
        this._btnOkElem = document.querySelector('#msg-ok-btn');
        btnRipple = new MDCRipple(this._btnOkElem);
        this._btnOkElem.addEventListener('click', () => {
            // send event
            window.EventBus.dispatchEvent(EVENT.ON_SAVE_FILE, {
                button: IDS.OK,
            });
            this._messagebox.close();
        });
        this._btnCancelElem = document.querySelector('#msg-cancel-btn');
        btnRipple = new MDCRipple(this._btnCancelElem);
        this._btnCancelElem.addEventListener('click', () => {
            // send event
            window.EventBus.dispatchEvent(EVENT.ON_SAVE_FILE, {
                button: IDS.CANCEL,
            });
            this._messagebox.close();
        });
    }

    /**
     * Show file open form
     * @param  {string} title [form title]
     */
    show(title, message, buttons) {
        // set title
        const titleElem = document.querySelector('#messagebox-title');
        if (title) {
            titleElem.style.display = 'block';
            titleElem.innerText = title;
        } else {
            titleElem.style.display = 'none';
        }
        // set message
        const messageElem = document.querySelector('#messagebox-message');
        messageElem.innerText = message;
        // show/hide buttons
        if (buttons.YES) {
            this._btnYesElem.style.display = 'block';
        } else {
            this._btnYesElem.style.display = 'none';
        }
        if (buttons.NO) {
            this._btnNoElem.style.display = 'block';
        } else {
            this._btnNoElem.style.display = 'none';
        }
        if (buttons.OK) {
            this._btnOkElem.style.display = 'block';
        } else {
            this._btnOkElem.style.display = 'none';
        }
        if (buttons.CANCEL) {
            this._btnCancelElem.style.display = 'block';
        } else {
            this._btnCancelElem.style.display = 'none';
        }
        // run messagebox
        try {
            this._messagebox.open();
        } catch (error) {
            console.log(error);
        }
    }

};

customElements.define('message-box', APATE.components.MessageBox);


// /* global document */

// APATE.namespace('APATE.MessageBox');


// APATE.MessageBox = (function messageBox() {
//     // button constants
//     const IDS = {
//         OK: 1,
//         CANCEL: 2,
//         YES: 3,
//         NO: 4,
//     };

//     let btnRipple = null;
//     const messagebox = new MDCDialog(document.querySelector('#message-box'));
//     const btnYesElem = document.querySelector('#msg-yes-btn');
//     btnRipple = new MDCRipple(btnYesElem);
//     btnYesElem.addEventListener('click', () => {
//         if (messagebox) {
//             messagebox.close(IDS.YES);
//         }
//     });
//     const btnNoElem = document.querySelector('#msg-no-btn');
//     btnRipple = new MDCRipple(btnNoElem);
//     btnNoElem.addEventListener('click', () => {
//         if (messagebox) {
//             messagebox.close(IDS.NO);
//         }
//     });
//     const btnOkElem = document.querySelector('#msg-ok-btn');
//     btnRipple = new MDCRipple(btnOkElem);
//     btnOkElem.addEventListener('click', () => {
//         if (messagebox) {
//             messagebox.close(IDS.OK);
//         }
//     });
//     const btnCancelElem = document.querySelector('#msg-cancel-btn');
//     btnRipple = new MDCRipple(btnCancelElem);
//     btnCancelElem.addEventListener('click', () => {
//         if (messagebox) {
//             messagebox.close(IDS.CANCEL);
//         }
//     });

//     /**
//      * public API -- constructor
//      */
//     const fnConstructor = function fn() {
//         // nothing to do
//     };

//     /**
//      * public API -- prototype
//      * @type {Object}
//      */
//     fnConstructor.prototype = {
//         constructor: APATE.MessageBox,
//         version: '1.0',

//         show(title, message, buttons) {
//             // set title
//             const titleElem = document.querySelector('#messagebox-title');
//             if (title) {
//                 titleElem.style.display = 'block';
//                 titleElem.innerText = title;
//             } else {
//                 titleElem.style.display = 'none';
//             }
//             // set message
//             const messageElem = document.querySelector('#messagebox-message');
//             messageElem.innerText = message;
//             // show/hide buttons
//             if (buttons.YES) {
//                 btnYesElem.style.display = 'block';
//             } else {
//                 btnYesElem.style.display = 'none';
//             }
//             if (buttons.NO) {
//                 btnNoElem.style.display = 'block';
//             } else {
//                 btnNoElem.style.display = 'none';
//             }
//             if (buttons.OK) {
//                 btnOkElem.style.display = 'block';
//             } else {
//                 btnOkElem.style.display = 'none';
//             }
//             if (buttons.CANCEL) {
//                 btnCancelElem.style.display = 'block';
//             } else {
//                 btnCancelElem.style.display = 'none';
//             }
//             // run messagebox
//             return new Promise((resolve, reject) => {
//                 // on closed event handler
//                 const onClosed = (e) => {
//                     messagebox.unlisten('MDCDialog:closed', onClosed);
//                     resolve({
//                         id: e.detail.action,
//                         BUTTON: IDS,
//                     });
//                 };

//                 try {
//                     messagebox.listen('MDCDialog:closed', onClosed);
//                     messagebox.open();
//                 } catch (error) {
//                     reject(error);
//                 }
//             });
//         },

//         /**
//          * show an [OK]messagebox
//          * @return {*} promise object
//          */
//         showOk(title, message) {
//             return this.show(title, message, {
//                 YES: false,
//                 NO: false,
//                 OK: true,
//                 CANCEL: false,
//             });
//         },

//         /**
//          * show an [OK][Cancel] messagebox
//          * @return {*} promise object
//          */
//         showOkCancel(title, message) {
//             return this.show(title, message, {
//                 YES: false,
//                 NO: false,
//                 OK: true,
//                 CANCEL: true,
//             });
//         },

//         /**
//          * show an [YES][NO] messagebox
//          * @return {*} promise object
//          */
//         showYesNo(title, message) {
//             return this.show(title, message, {
//                 YES: true,
//                 NO: true,
//                 OK: false,
//                 CANCEL: false,
//             });
//         },

//         /**
//          * show an [YES][NO][Cancel] messagebox
//          * @return {*} promise object
//          */
//         showYesNoCancel(title, message) {
//             return this.show(title, message, {
//                 YES: true,
//                 NO: true,
//                 OK: false,
//                 CANCEL: true,
//             });
//         },

//     };

//     // return the constructor
//     return fnConstructor;
// }());

// export default APATE.MessageBox;
