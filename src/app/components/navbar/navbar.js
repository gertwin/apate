import { MDCRipple } from '@material/ripple';

import i18n from '../../utils/i18n';
import APATE from '../../apate';
import saveAs from '../../utils/filesaver';
import SearchController from './search-controller';
import Injector from '../../utils/injector';

/* global $, window, document, Blob */

APATE.namespace('APATE');


const Navbar = (settings) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fnConstructor() {
        this._menuController = null;
        this._searchController = new SearchController();
        window.EventBus.addEventListener('sidebar-toggled', this.sidebarToggled);

        $('#toggle-sidebar').click(this.toggleSidebar);

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

    };

    // public API -- prototype
    fnConstructor.prototype = {
        constructor: APATE.NavBar,
        version: '1.0',

        /**
         * Toggle sidebar by sending an event
         */
        toggleSidebar() {
            window.EventBus.dispatchEvent('toggle-sidebar');
        },

        sidebarToggled(event) {
            if (event.detail.sidebarOpen) {
                $('#toggle-sidebar').attr('title', i18n.getMessage('openSidebarButton'));
            } else {
                $('#toggle-sidebar').attr('title', i18n.getMessage('closeSidebarButton'));
            }
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
            this._menuController.tabs.openFileEntry(files);
        },

        /**
         * Download the contents under the current tab
         */
        onFileDownload() {
            const tab = this._menuController.tabs.getCurrentTab();
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

        get searchController() {
            return this._searchController;
        },

        get menuController() {
            return this._menuController;
        },

        set menuController(menuController) {
            this._menuController = menuController;
        },

    };

    // return the constructor
    // to be assigned to the new namespace
    return fnConstructor;
};

APATE.Navbar = Injector.resolve(['settings'], Navbar);
export default APATE.Navbar;
