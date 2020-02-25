
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { MDCRipple } from '@material/ripple';
// import picker from './gapi/picker';
//
import APATE from './apate';
import i18n from './utils/i18n';
import i18nTemplate from './utils/i18n-template';
import MessageBox from './dialogs/messagebox';
import SettingsController from './components/sidebar/settings/settings-controller';
import WindowController from './controllers/window';

import Injector from './utils/injector';
// import Executor from './executor';

import 'material-design-icons/iconfont/material-icons.css';

/* global document, */

APATE.namespace('APATE');


const ApateApp = (settings) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fnConstructor() {
        this.settingsController = null;
        this.windowController = null;
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
        init() {
            // controllers
            this.settingsController = new SettingsController();
            this.windowController = new WindowController();
            // init i18n
            i18n.init().then(() => {
                // translate document
                i18nTemplate.process(document);
                // TODO: google drive picker init
                // picker.init();
                // TODO: session management
                // const openTabs = [];
                // this.openTabs(openTabs);

                // set ripple effect on all buttons
                const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));

            }).catch((error) => {
                const msg = new MessageBox();
                msg.showOk(null, error);
            });
        },

    };

    // return the constructor
    return fnConstructor;
};

APATE.ApateApp = Injector.resolve(['settings'], ApateApp);
export default APATE.ApateApp;
