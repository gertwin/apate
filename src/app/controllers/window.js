
import { MDCRipple } from '@material/ripple';
import { MDCSwitch } from '@material/switch';
import { MDCFormField } from '@material/form-field';
import { MDCRadio } from '@material/radio';

import i18n from '../utils/i18n';
import APATE from '../apate';
import Navbar from '../components/navbar/navbar';
import Editor from '../components/editor/source-editor';
import SidebarController from '../components/sidebar/sidebar-controller';
import BottombarController from '../components/bottombar/bottombar-controller';
import HotkeysController from './hotkeys';

import Executor from '../executor';
import Injector from '../utils/injector';

/* globals $, window, document, ResizeObserver */

APATE.namespace('APATE.WindowController');


const WindowController = (settings) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {

        this._editor = new Editor($('#editor')[0]);
        // this.output = params.output;
        // this.tabs = params.tabs;
        // components
        this.navbar = new Navbar();
        this.sidebar = new SidebarController();
        this.bottombar = new BottombarController();
        this.hotkeysController = new HotkeysController();

        // set references
        this.sidebar.menuController.tabs.editor = this._editor;
        this.hotkeysController.tabs = this.sidebar.menuController.tabs;
        this.hotkeysController.editor = this._editor;
        this.hotkeysController.windowController = this;
        this.navbar.searchController.search = this._editor.search;
        this.navbar.menuController = this.sidebar.menuController;

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
            this._editor.focus();
        });

        $(document).bind('bottombar-toggle', () => {
            this._editor.focus();
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

            if (settings.isReady()) {
                this.sidebar.init();
                this.bottombar.init();
            } else {
                $(document).bind('settingsready', this.sidebar.init.bind(this.sidebar));
                $(document).bind('settingsready', this.bottombar.init.bind(this.bottombar));
            }

            // setting handlers
            $(document).bind('settingsready', this.onSettingsReady.bind(this));
            $(document).bind('settingschange', this.onSettingsChanged.bind(this));


            /**
             * Run button handler
             */
            $('#button-run').bind('click', () => {
                // program from current editor
                const tab = this.sidebar.menuController.tabs.getCurrentTab();
                if (tab) {
                    const executor = new Executor(this.bottombar.output);
                    let content = tab.getSelection();
                    if (!content || content.length === 0) {
                        content = tab.getContent();
                    }
                    if (content && content.length > 0) {
                        executor.run(content);
                    }
                }
            });

        },

        /**
         * @param {string} theme
         */
        // setTheme(theme) {
        //     $('body').attr('theme', theme);
        // },

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

        setTheme() {
            const theme = settings.get('theme');
            $('body').attr('theme', theme);
            this._editor.setTheme(theme);
        },

        /**
        * Called when all the services have started and settings are loaded.
        */
        onSettingsReady() {
            this.setTheme();
            // editor settings
            this._editor.setFontSize(settings.get('fontsize'));
            this._editor.showHideLineNumbers(settings.get('linenumbers'));
            this._editor.setSmartIndent(settings.get('smartindent'));
            this._editor.replaceTabWithSpaces(settings.get('spacestab'));
            this._editor.setTabSize(settings.get('tabsize'));
            this._editor.setWrapLines(settings.get('wraplines'));
            // side- and bottombar
            this.sidebar.init();
            this.bottombar.init();
        },

        /**
        * @param {Event} e
        * @param {string} key
        * @param {*} value
        */
        onSettingsChanged(e, key, value) {
            switch (key) {
            case 'fontsize':
                this._editor.setFontSize(value);
                break;

            case 'linenumbers':
                this._editor.showHideLineNumbers(value);
                break;

            case 'smartindent':
                this._editor.setSmartIndent(value);
                break;

            case 'spacestab':
                this._editor.replaceTabWithSpaces(settings.get('spacestab'));
                break;

            case 'tabsize':
                this._editor.setTabSize(value);
                break;

            case 'theme':
                this.setTheme();
                break;

            case 'wraplines':
                this._editor.setWrapLines(value);
                break;
            default:
                break;
            }
        },

    };

    // return the constructor
    return fnConstructor;
};

APATE.WindowController = Injector.resolve(['settings'], WindowController);
export default APATE.WindowController;
