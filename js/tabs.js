
import APATE from './apate';
import utils from './utils/utils';
import i18n from './utils/i18n';
import Injector from './utils/injector';
import Tab from './tab';

/* globals $, EVENT, IDS, window, document, FileReader */

APATE.namespace('APATE');


const Tabs = (documentStore) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(editor, settings) {
        this.newTabId = 0;
        this.editor = editor;
        this.settings = settings;
        this.tabs = [];
        this.currentTab = null;
        $(document).bind('docchange', this.onDocChanged.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Tabs,
        version: '1.0',

        /**
         * Add a new tab to the open tabs.
         * Or activate a existing tab if allready open
         * @param  {string} fileContent content of the opened file
         * @param  {[type]} fileName    name of the file to add
         */
        onFileNew(fileContent, fileName) {
            const filteredTabs = this.tabs.filter((tab) => {
                if (tab.name && fileName) {
                    return tab.name === fileName;
                }
                return false;
            });
            if (filteredTabs && filteredTabs.length > 0) {
                // activate existing tab
                this.showTab(filteredTabs[0].getId());
            } else {
                // create new tab
                this.newTabId++;
                const session = this.editor.newSession(fileContent);
                const lineEndings = utils.guessLineEndings(fileContent);
                // create new tab
                const tab = new Tab(this.newTabId, session, lineEndings, fileName || null);
                this.tabs.push(tab);
                $.event.trigger('newtab', tab);
                this.showTab(tab.getId());
                // set editor mode
                const fileNameExtension = tab.getExtension();
                if (fileNameExtension) {
                    this.editor.setMode(session, fileNameExtension);
                }
            }
        },

        /**
         * Select an file to open from a dialog
         */
        onFileOpen() {
            window.EventBus.dispatchEvent(EVENT.SHOW_FORM_OPEN, {
                title: i18n.getMessage('openTitle'),
            });
            // event-listner will only called once
            window.EventBus.addEventListenerOnce(EVENT.ON_OPEN_FILE, (event) => {
                // load file content
                documentStore.getDocumentData(event.detail.filename).then((result) => {
                    // open new tab
                    this.onFileNew(result.data, event.detail.filename);
                }).catch((message) => {
                    console.log(message);
                });
            });

        },

        /**
         * Save optTab, or the current tab if no optTab is passed.
         * @param {*} optTab, optional tab to save
         * @return {Promise} promise object
         */
        onFileSave(optTab) {
            return new Promise((resolve, reject) => {
                const tab = optTab || this.currentTab;
                if (tab.hasName()) {
                    tab.save(documentStore).then(() => {
                        resolve();
                    }).catch((message) => {
                        reject(message);
                    });
                } else {
                    this.onFileSaveAs(tab);
                    resolve();
                }
            });
        },

        /**
         * Save optTab as a new file, or the current tab if no optTab is passed.
         * @param {*} optTab, optional tab to save
         * @return {Promise} promise object or null
         */
        onFileSaveAs(optTab) {
            const tab = optTab || this.currentTab;
            window.EventBus.dispatchEvent(EVENT.SHOW_FORM_SAVE, {
                title: i18n.getMessage('saveAsTitle'),
                filename: tab.getName(),
            });
            // event-listner will only called once
            window.EventBus.addEventListenerOnce(EVENT.ON_SAVE_FILE, (event) => {
                tab.setName(event.detail.filename);
                tab.save(documentStore).then(() => {
                    console.log(`File ${event.detail.filename} saved.`);
                }).catch((message) => {
                    console.log(message);
                });
            });
        },

        /**
         * Close tab event handler
         * @param  {Number} tabId, id of the tab to close
         */
        onCloseFile(tabId) {
            let i = 0;
            for (i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].getId() === tabId) {
                    break;
                }
            }

            if (i >= this.tabs.length) {
                console.error('Can\'t find tab', tabId);
                return;
            }

            const tab = this.tabs[i];
            if (!tab.isSaved()) {
                const msgText = `${i18n.getMessage('saveFilePromptLine1', [tab.getName()])}
${i18n.getMessage('saveFilePromptLine2')}`;
                // show message
                window.EventBus.dispatchEvent(EVENT.SHOW_MESSAGEBOX, {
                    title: null,
                    message: msgText,
                    buttons: IDS.YES + IDS.NO + IDS.CANCEL,
                });
                // event-listner will only called once
                window.EventBus.addEventListenerOnce(EVENT.ON_RESULT, (event) => {
                    if (event.detail.button === IDS.YES) {
                        // save tab
                        this.onFileSave(tab).then(() => {
                            this.onCloseTab(tab);
                        });
                    } else if (event.detail.button === IDS.NO) {
                        // close without save
                        this.onCloseTab(tab);
                    }
                });
            } else {
                this.onCloseTab(tab);
            }
        },

        /**
         * @param {Tab} tab
         * Close tab without checking whether it needs to be saved. The safe version
         * (invoking auto-save and, if needed, SaveAs dialog) is Tabs.close().
         */
        onCloseTab(tab) {
            let i = 0;
            for (i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i] === tab) {
                    break;
                }
            }

            this.tabs.splice(i, 1);
            $.event.trigger('tabclosed', tab);

            if (tab === this.currentTab) {
                if (this.tabs.length > 0) {
                    this.nextTab();
                } else {
                    this.onFileNew();
                }
            }
        },

        /**
         * Close the current tab
         */
        onCloseFileCurrent() {
            this.onCloseFile(this.currentTab.getId());
        },



        getTabById(id) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].getId() === id) {
                    return this.tabs[i];
                }
            }
            return null;
        },

        getCurrentTab() {
            return this.currentTab;
        },

        /**
         * @param {number} oldIndex
         * @param {number} newIndex
         * Move a {Tab} from oldIndex to newIndex
         */
        reorder(oldIndex, newIndex) {
            this.tabs.splice(
                newIndex, // specifies at what position to add items
                0, // no items will be removed
                this.tabs.splice(oldIndex, 1)[0],
            ); // item to be added
        },

        getTabIndex(tab) {
            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i] === tab) {
                    return i;
                }
            }
            return -1;
        },

        previousTab() {
            const currentTabIndex = this.getTabIndex(this.currentTab);
            let previousTabIndex = currentTabIndex - 1;
            if (previousTabIndex < 0) {
                previousTabIndex = this.tabs.length - 1;
            }
            this.showTab(this.tabs[previousTabIndex].getId());
        },

        nextTab() {
            const currentTabIndex = this.getTabIndex(this.currentTab);
            let nextTabIndex = currentTabIndex + 1;
            if (nextTabIndex >= this.tabs.length) {
                nextTabIndex = 0;
            }
            this.showTab(this.tabs[nextTabIndex].getId());
        },

        showTab(tabId) {
            const tab = this.getTabById(tabId);
            if (!tab) {
                console.error('Can\'t find tab', tabId);
                return;
            }
            this.editor.setSession(tab.getSession());
            this.currentTab = tab;
            $.event.trigger('switchtab', tab);
            this.editor.focus();
        },

        /**
         * @return {Array.<FileEntry>}
         */
        getFilesToRetain() {
            const toRetain = [];

            for (let i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].getEntry()) {
                    toRetain.push(this.tabs[i].getEntry());
                }
            }
            return toRetain;
        },

        openFileEntry(fileList) {
            if (fileList && fileList.length > 0) {
                const file = fileList[0];
                // first try to activate a tab with the same filename
                for (let i = 0; i < this.tabs.length; i++) {
                    if (this.tabs[i].getName() === file.name) {
                        this.showTab(this.tabs[i].getId());
                        return;
                    }
                }
                this.readFileToNewTab(file);
            }
        },

        modeAutoSet(tab) {
            const extension = tab.getExtension();
            if (extension) {
                this.editor.setMode(tab.getSession(), extension);
            }
        },

        readFileToNewTab(file) {
            $.event.trigger('loadingfile');
            const self = this;
            const reader = new FileReader();
            reader.onerror = utils.handleFSError;
            reader.onloadend = (e) => {
                self.onFileNew(e.target.result, file.name);
                if (self.tabs.length === 2
                    && !self.tabs[0].getName()
                    && self.tabs[0].isSaved()) {
                    self.onCloseFile(self.tabs[0].getId());
                }
                // get current tab
                const tab = this.getCurrentTab();
                if (tab) {
                    // set dirty
                    tab.changed();
                }
            };
            reader.readAsText(file);
        },

        /**
         * @param {!Tab} tab
         * @param {FileEntry} entry
         * @param {function()=} callback
         */
        saveEntry(tab, entry, callback) {
            if (entry) {
                tab.setEntry(entry);
                this.onFileSave(tab, callback);
            }
        },

        onDocChanged(e, session) {
            let tab = this.currentTab;
            if (this.currentTab.getSession() !== session) {
                console.warn('Something wrong. Current session should be', this.currentTab.getSession(),
                    ', but this session was changed:', session);
                for (let i = 0; i < this.tabs; i++) {
                    if (this.tabs[i].getSession() === session) {
                        tab = this.tabs[i];
                        break;
                    }
                }

                if (tab === this.currentTab) {
                    console.error('Unknown tab changed.');
                    return;
                }
            }

            tab.changed();
        },

        /**
         * Determines whether any tabs are open.
         * @return {boolean} True if at least one tab is open.
         */
        hasOpenTab() {
            return !!this.tabs.length;
        },

    };

    // return the constructor
    return fnConstructor;
};


APATE.Tabs = Injector.resolve(['documentStore'], Tabs);
export default APATE.Tabs;
