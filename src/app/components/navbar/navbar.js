
import i18n from '../../utils/i18n';
import APATE from '../../apate';
import Injector from '../../utils/injector';

/* global $, window */

APATE.namespace('APATE');


const Navbar = (settings) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fnConstructor() {
        window.EventBus.addEventListener('sidebar-toggled', this.sidebarToggled);


        $('#toggle-sidebar').click(this.toggleSidebar);


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

    };

    // return the constructor
    // to be assigned to the new namespace
    return fnConstructor;
};

APATE.Navbar = Injector.resolve(['settings'], Navbar);
export default APATE.Navbar;
