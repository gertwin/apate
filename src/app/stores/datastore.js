import Dexie from 'dexie';
import APATE from '../apate';


APATE.namespace('APATE.utils.Datastore');


APATE.utils.Datastore = (function settings() {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(storeName) {
        // document database
        this.storage = new Dexie(storeName);
        this.storage.version(1).stores({
            documents: 'key',
        });
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.utils.Datastore,
        version: '1.0',

        /**
         * Get data from the datastore
         * @param {string} key, entry key of the data
         */
        getDocumentData(name) {
            return new Promise((resolve, reject) => {
                try {
                    // is there a previous value?
                    this.storage.documents.where({
                        key: name,
                    }).first().then((value) => {
                        resolve(value);
                    }).catch((e) => {
                        reject(e.message);
                    });
                } catch (e) {
                    reject(e.message);
                }
            });
        },

        /**
         * Set data on the datastore
         * @param {string} name, key of the entry
         * @param {string} data of the entry
         */
        setDocumentData(name, value) {
            return new Promise((resolve, reject) => {
                // current data
                this.getDocumentData(name).then((oldValue) => {
                    this.storage.transaction('rw', [this.storage.documents], () => {
                        // update or add new value
                        if (oldValue) {
                            this.storage.documents.update(name, { data: value }).then(() => {
                                console.log(`update ${name} => ${value}`);
                                resolve();
                            });
                        } else {
                            this.storage.documents.add({ key: name, data: value }).then(() => {
                                console.log(`add ${name} => ${value}`);
                                resolve();
                            });
                        }
                    });
                }).catch((message) => {
                    reject(message);
                });
            });
        },

        /**
         * Delete an entry from the store
         * @param {string} name, key of the entry
         */
        delDocumentData(name) {
            return new Promise((resolve, reject) => {
                this.storage.documents.delete(name).then(() => {
                    resolve(true);
                }).catch((e) => {
                    reject(e.message);
                });
            });
        },

        /**
         * Get the key of all entries in the store
         * @return {promise} keys promise
         */
        getAllDocumentNames() {
            return new Promise((resolve, reject) => {
                try {
                    this.storage.documents.orderBy('key').keys().then((keys) => {
                        resolve(keys);
                    });
                } catch (e) {
                    reject(e.message);
                }
            });
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.utils.Datastore;
