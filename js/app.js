
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MDCRipple } from '@material/ripple';
import APATE from './apate';
import i18n from './utils/i18n';
// import utils from './utils/utils';
import saveAs from './utils/filesaver';
import i18nTemplate from './utils/i18n-template';
// import picker from './gapi/picker';

import Settings from './settings';
import Editor from './editor/editor-cm';
import Tabs from './tabs';
import Output from './output';

import HotkeysController from './controllers/hotkeys';
import MenuController from './controllers/menu';
import SearchController from './controllers/search';
import SettingsController from './controllers/settings';
import WindowController from './controllers/window';

import Executor from './executor';

import 'material-design-icons/iconfont/material-icons.css';

/* global EVENT, IDS, window, document, $, Blob */

APATE.namespace('APATE.APATEApp');


APATE.APATEApp = (function APATEApp() {


    /**
     * public API -- constructor
     */
    const fnConstructor = function fnConstructor() {
        this.editor = null;
        this.settings = null;
        this.tabs = null;

        this.hotkeysController = null;
        this.menuController = null;
        this.searchController = null;
        this.settingsController = null;
        this.windowController = null;

        this.hasFrame = false;
        // set ripple effect on all buttons
        const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.APATEApp,
        version: '1.0',

        /**
        * Called when all the resources have loaded.
         * All initializations should be done here.
        */
        async init() {
            this.settings = new Settings();
            // components
            this.editor = new Editor($('#editor')[0], this.settings);
            this.tabs = new Tabs(this.editor, this.settings);
            this.output = new Output($('#output')[0]);
            // controllers
            this.menuController = new MenuController(this.tabs);
            this.searchController = new SearchController(this.editor.getSearch());
            this.settingsController = new SettingsController(this.settings);
            this.windowController = new WindowController({
                editor: this.editor,
                output: this.output,
                settings: this.settings,
                tabs: this.tabs,
            });
            this.hotkeysController = new HotkeysController(this.windowController,
                this.tabs,
                this.editor,
                this.settings);
            // file selection handler
            this.fileSelectorElem = document.querySelector('input[id="file-selector"]');
            if (this.fileSelectorElem) {
                this.fileSelectorElem.onchange = () => {
                    this.uploadFile(this.fileSelectorElem.files);
                };
            }
            // tool buttons
            const btnImport = document.querySelector('#btn-import');
            btnImport.addEventListener('click', this.onFileUpload.bind(this));
            const mdBtnImport = new MDCRipple(btnImport);
            mdBtnImport.unbounded = true;
            const btnExport = document.querySelector('#btn-export');
            btnExport.addEventListener('click', this.onFileDownload.bind(this));
            const mdBtnExport = new MDCRipple(btnExport);
            mdBtnExport.unbounded = true;
            const btnReport = new MDCRipple(document.querySelector('#btn-report'));
            btnReport.unbounded = true;
            // setting handlers
            $(document).bind('settingsready', this.onSettingsReady.bind(this));
            $(document).bind('settingschange', this.onSettingsChanged.bind(this));
            // init i18n
            i18n.init().then(() => {
                // translate document
                i18nTemplate.process(document);
                // TODO: google drive picker init
                // picker.init();
                // TODO: session management
                const openTabs = [];
                this.openTabs(openTabs);
            }).catch((error) => {
                // show message
                window.EventBus.dispatchEvent(EVENT.SHOW_MESSAGEBOX, {
                    title: null,
                    message: error,
                    buttons: IDS.OK,
                });
            });

            /**
             * Run button handler
             */
            $('#button-run').bind('click', () => {
                // program from current editor
                const tab = this.tabs.getCurrentTab();
                if (tab) {
                    const executor = new Executor(this.output);
                    let content = tab.getSelection();
                    if (!content || content.length === 0) {
                        content = tab.getContent();
                    }
                    executor.run(content);
                }
            });
        },

        /**
         * Trigger file selection
         */
        onFileUpload() {
            if (this.fileSelectorElem) {
                // reset preveious selected file
                this.fileSelectorElem.value = '';
                // select a new file
                this.fileSelectorElem.click();
            }
        },

        /**
         * Upload a local selected file
         */
        uploadFile(files) {
            this.tabs.openFileEntry(files);
        },

        /**
         * Download the contents under the current tab
         */
        onFileDownload() {
            const tab = this.tabs.getCurrentTab();
            if (tab) {
                const data = tab.getContent();
                const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
                let filename = tab.getName();
                // check file extension
                if (filename.indexOf('.scm') === -1) {
                    filename = `${filename}.scm`;
                }
                saveAs(blob, filename);
            }
        },

        /**
        * Open one tab per FileEntry passed or a new Untitled tab if no tabs were
        * successfully opened.
        * @param {!Array.<FileEntry>} entries The file entries to be opened.
        */
        openTabs(entries) {
            for (let i = 0; i < entries.length; i++) {
                this.tabs.openFileEntry(entries[i]);
            }

            if (!this.tabs.hasOpenTab()) {
                this.tabs.onFileNew();
            }
        },

        /**
        * @return {Array.<FileEntry>}
        */
        getFilesToRetain() {
            return this.tabs.getFilesToRetain();
        },

        setTheme() {
            const theme = this.settings.get('theme');
            this.windowController.setTheme(theme);
            this.editor.setTheme(theme);
        },

        /**
        * Called when all the services have started and settings are loaded.
        */
        onSettingsReady() {
            this.setTheme();
            // editor settings
            this.editor.setFontSize(this.settings.get('fontsize'));
            this.editor.showHideLineNumbers(this.settings.get('linenumbers'));
            this.editor.setSmartIndent(this.settings.get('smartindent'));
            this.editor.replaceTabWithSpaces(this.settings.get('spacestab'));
            this.editor.setTabSize(this.settings.get('tabsize'));
            this.editor.setWrapLines(this.settings.get('wraplines'));
        },

        /**
        * @param {Event} e
        * @param {string} key
        * @param {*} value
        */
        onSettingsChanged(e, key, value) {
            switch (key) {
            case 'fontsize':
                this.editor.setFontSize(value);
                break;

            case 'linenumbers':
                this.editor.showHideLineNumbers(value);
                break;

            case 'smartindent':
                this.editor.setSmartIndent(value);
                break;

            case 'spacestab':
                this.editor.replaceTabWithSpaces(this.settings.get('spacestab'));
                break;

            case 'tabsize':
                this.editor.setTabSize(value);
                break;

            case 'theme':
                this.setTheme();
                break;

            case 'wraplines':
                this.editor.setWrapLines(value);
                break;
            default:
                break;
            }
        },
    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.APATEApp;
