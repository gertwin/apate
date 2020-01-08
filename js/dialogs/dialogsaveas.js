import { MDCDialog } from '@material/dialog';
import { MDCTextField } from '@material/textfield';
// import i18n from '../utils/i18n';
import APATE from '../apate';

/* global document */

APATE.namespace('APATE.DialogSaveAs');


APATE.DialogSaveAs = (function DialogSaveAs() {
    // button constants
    const IDS = {
        SAVE: 1,
        NOT_SAVE: 2,
    };

    const textFieldFilename = document.querySelector('#text-field-filename');
    const dialog = new MDCDialog(document.querySelector('#dialog-saveas'));
    const textField = new MDCTextField(document.querySelector('#form-group-filename'));
    const btnSaveElem = document.querySelector('#save-btn');
    btnSaveElem.addEventListener('click', (e) => {
        e.preventDefault();
        if (dialog) {
            const form = document.querySelector('#form-saveas');
            if (form.checkValidity()) {
                dialog.close(IDS.SAVE);
            }
        }
    });
    const btnNotSaveElem = document.querySelector('#not-save-btn');
    btnNotSaveElem.addEventListener('click', (e) => {
        e.preventDefault();
        if (dialog) {
            dialog.close(IDS.NOT_SAVE);
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
        constructor: APATE.DialogSaveAs,
        version: '1.0',

        show(title, filename) {
            // reset form
            const form = document.querySelector('#form-saveas');
            form.reset();
            textField.valid = true;
            // set title
            const titleElem = document.querySelector('#dialog-saveas-title');
            if (title) {
                titleElem.style.display = 'block';
                titleElem.innerText = title;
            } else {
                titleElem.style.display = 'none';
            }
            // set filename
            textFieldFilename.value = filename;
            // run dialog
            return new Promise((resolve, reject) => {
                // on closed event handler
                const onClosed = (e) => {
                    dialog.unlisten('MDCDialog:closed', onClosed);
                    resolve({
                        id: e.detail.action,
                        BUTTON: IDS,
                    });
                };

                try {
                    dialog.listen('MDCDialog:closed', onClosed);
                    dialog.open();
                } catch (error) {
                    reject(error);
                }
            });
        },

        get fileName() {
            return textFieldFilename.value;
        },
    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.DialogSaveAs;
