import { MDCDialog } from '@material/dialog';
import { MDCList } from '@material/list';
import { MDCRipple } from '@material/ripple';
// import { MDCSwitch } from '@material/switch';

import APATE from '../apate';
import Injector from '../utils/injector';

/* global document */

APATE.namespace('APATE');


const DialogDocumentOpen = (documentStore) => {

    // button constants
    const IDS = {
        OPEN_DOCUMENT: 1,
        OPEN_MODULE: 2,
        CANCEL: 3,
    };

    // selected filename
    let selectedFilename = null;
    // dialog
    const dialog = new MDCDialog(document.querySelector('#dialog-open'));

    // const switchControl = new MDCSwitch(document.querySelector('.mdc-switch'));

    // list
    const listElem = document.querySelector('#fileopen-list');
    const mdcList = new MDCList(listElem);
    // const textFieldFilename = document.querySelector('#text-field-filename');
    const btnOpenElem = document.querySelector('#open-btn');
    btnOpenElem.addEventListener('click', (e) => {
        e.preventDefault();
        if (dialog) {
            dialog.close(IDS.OPEN);
        }
    });
    const btnCancelElem = document.querySelector('#not-open-btn');
    btnCancelElem.addEventListener('click', (e) => {
        e.preventDefault();
        if (dialog) {
            dialog.close(IDS.CANCEL);
        }
    });

    /**
     * generate a single filelist item
     * @param  {string} filename name of the file
     * @return {string}          dom node
     */
    const getFileListItem = (filename) => {
        const template = document.querySelector('#file-listitem');
        template.content.querySelector('#filename').textContent = filename;
        return document.importNode(template.content, true);
    };

    /**
     * generate a list with filenames
     */
    const getFileList = (datastore) => {
        // remove previous list
        while (listElem.firstChild) {
            listElem.removeChild(listElem.firstChild);
        }
        // get current list
        datastore.getAllDocumentNames().then((names) => {
            names.forEach((name) => {
                listElem.appendChild(getFileListItem(name));
                // new added element
                const newElem = listElem.lastElementChild;
                newElem.setAttribute('data-key', name);
                // open file event handler
                newElem.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // set filename
                    selectedFilename = name;
                    dialog.close(IDS.OPEN);
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
                            getFileList(datastore);
                        }).catch((message) => {
                            console.log(message);
                        });
                    });
                }
            });
            mdcList.listElements.map((listItemEl) => {
                return new MDCRipple(listItemEl);
            });
        });
    };

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
        constructor: APATE.DialogDocumentOpen,
        version: '1.0',

        show(title) {
            // set title
            const titleElem = document.querySelector('#dialog-open-title');
            if (title) {
                titleElem.style.display = 'block';
                titleElem.innerText = title;
            } else {
                // hide title
                titleElem.style.display = 'none';
            }
            // generate list of items
            getFileList(documentStore);
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
            return selectedFilename;
        },
    };

    // return the constructor
    return fnConstructor;
};


APATE.DialogDocumentOpen = Injector.resolve(['documentStore'], DialogDocumentOpen);
export default APATE.DialogDocumentOpen;
