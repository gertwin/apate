
import { MDCRipple } from '@material/ripple';
import { MDCSwitch } from '@material/switch';
import { MDCFormField } from '@material/form-field';
import { MDCRadio } from '@material/radio';

import i18n from '../utils/i18n';
import APATE from '../apate';
import SidebarController from './sidebar';
import BottombarController from './bottombar';

/* globals $, window, document, ResizeObserver */

APATE.namespace('APATE.WindowController');


APATE.WindowController = (function windowController() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(params) {
        this.editor = params.editor;
        this.output = params.output;
        this.settings = params.settings;
        this.tabs = params.tabs;
        // sidebar
        this.sidebar = new SidebarController(this.settings);
        this.bottombar = new BottombarController(this.settings);
        // rest
        $(window).bind('error', this.onError.bind(this));
        $(document).bind('filesystemerror', this.onFileSystemError.bind(this));
        $(document).bind('loadingfile', this.onLoadingFile.bind(this));
        $(document).bind('switchtab', this.onChangeTab.bind(this));
        $(document).bind('tabchange', this.onTabChange.bind(this));
        $(document).bind('tabpathchange', this.onTabPathChange.bind(this));
        $(document).bind('tabrenamed', this.onChangeTab.bind(this));
        $(document).bind('tabsave', this.onTabChange.bind(this));

        $(document).bind('sidebar-toggle', () => {
            this.editor.focus();
        });

        $(document).bind('bottombar-toggle', () => {
            this.editor.focus();
        });

        this.initUI();
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.WindowController,
        version: '1.0',

        /**
         * Performs all the required initialization for the UI.
         * @private
         */
        initUI() {
            Object.values(document.querySelectorAll('.mdc-icon-button')).forEach((element) => {
                const ripple = MDCRipple.attachTo(element);
                ripple.unbounded = true;
                // Required due to issue https://github.com/material-components/material-components-web/issues/3984
                new ResizeObserver(() => { ripple.layout(); }).observe(element);
            });

            Object.values(document.querySelectorAll('.mdc-switch')).forEach((element) => {
                new MDCSwitch(element);
            });

            Object.values(document.querySelectorAll('.mdc-radio')).forEach((element) => {
                const formField = new MDCFormField(element.parentElement);
                formField.input = new MDCRadio(element);
            });

            if (this.settings.isReady()) {
                this.sidebar.init();
                this.bottombar.init();
            } else {
                $(document).bind('settingsready', this.sidebar.init.bind(this));
                $(document).bind('settingsready', this.bottombar.init.bind(this));
            }
        },

        /**
         * @param {string} theme
         */
        setTheme(theme) {
            $('body').attr('theme', theme);
        },

        onLoadingFile(e) {
            // $('#title-filename').text(i18n.getMessage('loadingTitle'));
        },

        onFileSystemError(e) {
            // $('#title-filename').text(i18n.getMessage('errorTitle'));
        },

        onChangeTab(e, tab) {
            // $('#title-filename').text(tab.getName());
            this.onTabChange();
        },

        onTabPathChange(e, tab) {
            // $('#title-filename').attr('title', tab.getPath());
        },

        onTabChange(e, tab) {
            // if (this.tabs.getCurrentTab().isSaved()) {
            //     $('#title-filename').removeClass('unsaved');
            // } else {
            //     $('#title-filename').addClass('unsaved');
            // }
        },

        onError(event) {
            const message = event.originalEvent.message;
            const errorStack = event.originalEvent.error.stack;
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.WindowController;
