
import APATE from './apate';
import i18n from './utils/i18n';
import utils from './utils/utils';
// import Datastore from './utils/datastore';
// import i18n from './utils/i18n';
// import MessageBox from './dialogs/messagebox';

/* globals $, document */

APATE.namespace('APATE');

APATE.Tab = (function tab() {

    /**
     * public API -- constructor
     * @param  {[type]} id               [description]
     * @param  {[type]} session          [description]
     * @param  {[type]} lineEndings      [description]
     * @param  {[type]} name             [description]
     */
    const fnConstructor = function fn(id, session, lineEndings, name) {
        this.id = id;
        this.session = session;
        this.lineEndings = lineEndings;
        this.name = name;
        this.saved = true;
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Tab,
        version: '1.0',

        getId() {
            return this.id;
        },

        /**
         * Does the tab have a filename?
         * @return {Boolean} true if a filename is associated with the tab, false otherwise
         */
        hasName() {
            if (this.name) {
                return true;
            }
            return false;
        },

        getName() {
            if (this.name) {
                return this.name;
            }
            return `${i18n.getMessage('untitledFile')} ${this.id}`;
        },

        /**
         * @param {string} name
         */
        setName(name) {
            const nameChanged = this.name !== name;
            this.name = name;
            if (nameChanged) {
                $.event.trigger('tabrenamed', this);
            }
        },

        /**
         * get all content of the tab
         * @return {string} tab content
         */
        getContent() {
            return this.session.getValue(this.lineEndings);
        },

        /**
         * get selection content
         * @return {string} selection content
         */
        getSelection() {
            return this.session.getSelection(this.lineEndings);
        },

        /**
         * @return {string?} Filename extension or null.
         */
        getExtension() {
            if (!this.name) {
                return null;
            }
            return utils.getExtension(this.name);
        },

        getSession() {
            return this.session;
        },

        /**
         * Save or create a document in the datastore
         */
        save(dataStore) {
            return new Promise((resolve, reject) => {
                dataStore.setDocumentData(this.name, this.getContent()).then(() => {
                    this.saved = true;
                    $(document).trigger('tabsave', this);
                    resolve();
                }).catch((message) => {
                    reject(message);
                });
            });
        },

        isSaved() {
            return this.saved;
        },

        changed() {
            if (this.saved) {
                this.saved = false;
                $.event.trigger('tabchange', this);
            }
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.Tab;
