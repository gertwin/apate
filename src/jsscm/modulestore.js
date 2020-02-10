import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Dexie from 'dexie';


/**
 * ModuleStore base
 */
class ModuleStore {

    /**
     * Initialize module storage
     */
    constructor() {
        // document database
        this.storage = new Dexie('APATE.modules');
        this.storage.version(1).stores({
            documents: 'key',
        });
    }

    /**
     * Get data from the datastore
     * @param {string} name, entry key of the data
     */
    getData(name) {
        return new Promise((resolve, reject) => {
            try {
                // is there a previous value?
                this.storage.documents.where({
                    key: name,
                }).first().then((result) => {
                    resolve(result.data);
                }).catch((e) => {
                    reject(e.message);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    /**
     * Set data on the datastore
     * @param {string} name, key of the entry
     * @param {string} data of the entry
     */
    setData(name, data) {
        return new Promise((resolve, reject) => {
            try {
                // current data
                this.storage.documents.where({
                    key: name,
                }).first().then((oldData) => {
                    this.storage.transaction('rw', [this.storage.documents], () => {
                        // update or add new value
                        if (oldData) {
                            this.storage.documents.update(name, { data }).then(() => {
                                resolve(true);
                            });
                        } else {
                            this.storage.documents.add({ key: name, data }).then(() => {
                                resolve(true);
                            });
                        }
                    });
                }).catch((e) => {
                    reject(e.message);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

    async setDataSync(name, data) {
        await this.setData(name, data);
    }

    /**
     * Delete an entry from the store
     * @param {string} name, key of the entry
     */
    delData(name) {
        return new Promise((resolve, reject) => {
            this.storage.documents.delete(name).then(() => {
                resolve(true);
            }).catch((e) => {
                reject(e.message);
            });
        });
    }

    /**
     * Get the names of all entries in the store
     * @return {promise} keys promise
     */
    getAllNames() {
        return new Promise((resolve, reject) => {
            try {
                this.storage.documents.orderBy('key').keys().then((keys) => {
                    resolve(keys);
                });
            } catch (e) {
                reject(e.message);
            }
        });
    }

}

export default ModuleStore;
