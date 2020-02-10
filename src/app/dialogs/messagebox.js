import { MDCDialog } from '@material/dialog';
import { MDCRipple } from '@material/ripple';


// import i18n from '../utils/i18n';
import APATE from '../apate';

/* global document */

APATE.namespace('APATE.MessageBox');


APATE.MessageBox = (function messageBox() {
    // button constants
    const IDS = {
        OK: 1,
        CANCEL: 2,
        YES: 3,
        NO: 4,
    };

    let btnRipple = null;
    const messagebox = new MDCDialog(document.querySelector('#message-box'));
    const btnYesElem = document.querySelector('#msg-yes-btn');
    btnRipple = new MDCRipple(btnYesElem);
    btnYesElem.addEventListener('click', () => {
        if (messagebox) {
            messagebox.close(IDS.YES);
        }
    });
    const btnNoElem = document.querySelector('#msg-no-btn');
    btnRipple = new MDCRipple(btnNoElem);
    btnNoElem.addEventListener('click', () => {
        if (messagebox) {
            messagebox.close(IDS.NO);
        }
    });
    const btnOkElem = document.querySelector('#msg-ok-btn');
    btnRipple = new MDCRipple(btnOkElem);
    btnOkElem.addEventListener('click', () => {
        if (messagebox) {
            messagebox.close(IDS.OK);
        }
    });
    const btnCancelElem = document.querySelector('#msg-cancel-btn');
    btnRipple = new MDCRipple(btnCancelElem);
    btnCancelElem.addEventListener('click', () => {
        if (messagebox) {
            messagebox.close(IDS.CANCEL);
        }
    });

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {
        // nothing to do
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.MessageBox,
        version: '1.0',

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
                btnYesElem.style.display = 'block';
            } else {
                btnYesElem.style.display = 'none';
            }
            if (buttons.NO) {
                btnNoElem.style.display = 'block';
            } else {
                btnNoElem.style.display = 'none';
            }
            if (buttons.OK) {
                btnOkElem.style.display = 'block';
            } else {
                btnOkElem.style.display = 'none';
            }
            if (buttons.CANCEL) {
                btnCancelElem.style.display = 'block';
            } else {
                btnCancelElem.style.display = 'none';
            }
            // run messagebox
            return new Promise((resolve, reject) => {
                // on closed event handler
                const onClosed = (e) => {
                    messagebox.unlisten('MDCDialog:closed', onClosed);
                    resolve({
                        id: e.detail.action,
                        BUTTON: IDS,
                    });
                };

                try {
                    messagebox.listen('MDCDialog:closed', onClosed);
                    messagebox.open();
                } catch (error) {
                    reject(error);
                }
            });
        },

        /**
         * show an [OK]messagebox
         * @return {*} promise object
         */
        showOk(title, message) {
            return this.show(title, message, {
                YES: false,
                NO: false,
                OK: true,
                CANCEL: false,
            });
        },

        /**
         * show an [OK][Cancel] messagebox
         * @return {*} promise object
         */
        showOkCancel(title, message) {
            return this.show(title, message, {
                YES: false,
                NO: false,
                OK: true,
                CANCEL: true,
            });
        },

        /**
         * show an [YES][NO] messagebox
         * @return {*} promise object
         */
        showYesNo(title, message) {
            return this.show(title, message, {
                YES: true,
                NO: true,
                OK: false,
                CANCEL: false,
            });
        },

        /**
         * show an [YES][NO][Cancel] messagebox
         * @return {*} promise object
         */
        showYesNoCancel(title, message) {
            return this.show(title, message, {
                YES: true,
                NO: true,
                OK: false,
                CANCEL: true,
            });
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.MessageBox;
