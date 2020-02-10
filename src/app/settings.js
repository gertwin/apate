
import Dexie from 'dexie';
import APATE from './apate';
import CONST from './const';

/* globals $, document */

APATE.namespace('APATE.Settings');


APATE.Settings = (function settings() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {
        this.ready = false;
        // settings object
        this.settings = {};
        // add default settings
        Object.keys(CONST.SETTINGS).forEach((key) => {
            this.settings[key] = CONST.SETTINGS[key]['default'];
        });
        this.readsettings();
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Settings,
        version: '1.0',

        async readsettings() {
            // settings database
            this.storage = new Dexie('APATE.settings');
            this.storage.version(1).stores({
                common: 'key',
            });

            // read updated settings
            for (const key in CONST.SETTINGS) {
                const record = await this.storage.common.where({
                    key: key
                }).first();
                // update default value if found
                if (record) {
                    this.settings[record.key] = record.value;
                }
            }
            this.ready = true;
            $.event.trigger('settingsready');
        },

        async removeOldsettings() {
            if ('autosave' in this.settings) {
                delete this.settings['autosave'];
            }
            await this.storage.common.delete('autosave');
        },

        /**
         * @param {string} key Setting name.
         * @return {Object}
         */
        get(key) {
            return this.settings[key];
        },

        getAll() {
            return this.settings;
        },

        async set(key, value) {
            await this.storage.transaction('rw', [this.storage.common], async () => {
                // is there a previous value?
                const oldValue = await this.storage.common.where({
                    key: key
                }).first();
                // update or add new value
                if (oldValue) {
                    await this.storage.common.put({ key: key, value: value }).then(() => {
                        this.settings[key] = value;
                        console.log(`put ${key} => ${value}`);
                        $(document).trigger('settingschange', [key, value]);

                    });
                }
                else {
                    await this.storage.common.add({ key: key, value: value }).then(() => {
                        this.settings[key] = value;
                        console.log(`add ${key} => ${value}`);
                        $(document).trigger('settingschange', [key, value]);
                    });
                }
            });
        },

        reset(key) {
            const defaultValue = CONST.SETTINGS[key]['default'];
            this.set(key, defaultValue);
        },

        isReady() {
            return this.ready;
        },
    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.Settings;
