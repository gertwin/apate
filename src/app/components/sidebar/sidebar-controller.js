
import i18n from '../../utils/i18n';
import APATE from '../../apate';
import MenuController from './menu/menu-controller';
import Injector from '../../utils/injector';

/* globals $, window, document */

APATE.namespace('APATE');


const SidebarController = (settings) => {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {

        this._menuController = new MenuController();

        // $('#toggle-sidebar').click(this.toggle.bind(this));
        $('#sidebar-resizer').mousedown(this.resizeStart.bind(this));

        window.EventBus.addEventListener('toggle-sidebar', this.toggle);
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.SidebarController,
        version: '1.0',

        init() {
            // FIXME: move this to CSS where possible (init code)
            if (settings.get('sidebaropen')) {
                $('#sidebar').css('width', `${settings.get('sidebarwidth')}px`);
                $('#sidebar').css('border-right-width', '2px');
                $('#toggle-sidebar').attr('title', i18n.getMessage('closeSidebarButton'));
            } else {
                $('#sidebar').css('width', '0');
                $('#sidebar').css('border-right-width', '0');
                $('#toggle-sidebar').attr('title', i18n.getMessage('openSidebarButton'));
            }

            this._menuController.init();
        },

        toggle() {
            // FIXME: Move this to css where possible (toggle code)
            if (settings.get('sidebaropen')) {
                settings.set('sidebaropen', false);
                $('#sidebar').css('width', '0');
                $('#sidebar').css('border-right-width', '0');
                // $('#toggle-sidebar').attr('title', i18n.getMessage('openSidebarButton'));
            } else {
                settings.set('sidebaropen', true);
                $('#sidebar').css('width', `${settings.get('sidebarwidth')}px`);
                $('#sidebar').css('border-right-width', '2px');
                // $('#toggle-sidebar').attr('title', i18n.getMessage('closeSidebarButton'));
            }
            window.EventBus.dispatchEvent('sidebar-toggled', { sidebarOpen: settings.get('sidebaropen') });

            $.event.trigger('sidebar-toggle');

            setTimeout(() => {
                $.event.trigger('sidebar-resize');
            }, 200);
        },

        /**
         * Initialize resizing state
         * @param  {object} e [event object]
         */
        resizeStart(e) {
            this.resizeMouseStartX = e.clientX;
            this.resizeStartWidth = parseInt($('#sidebar').css('width'), 10);
            $(document).on('mousemove.sidebar', this.resizeOnMouseMove.bind(this));
            $(document).on('mouseup.sidebar', this.resizeFinish.bind(this));
            $(document).css('cursor', 'e-resize !important');
            $('#sidebar').css('transition', 'none');
        },

        /**
         * Resizing mouse move event
         * @param  {object} e [event object]
         */
        resizeOnMouseMove(e) {
            const change = e.clientX - this.resizeMouseStartX;
            let sidebarWidth = this.resizeStartWidth + change;
            if (sidebarWidth < 20) {
                sidebarWidth = 20;
            }
            $('#sidebar').css('width', `${sidebarWidth}px`);
            return sidebarWidth;
        },

        /**
         * Finish resizing state
         * @param  {object} e [event object]
         */
        resizeFinish(e) {
            const sidebarWidth = this.resizeOnMouseMove(e);
            settings.set('sidebarwidth', sidebarWidth);
            $(document).off('mousemove.sidebar');
            $(document).off('mouseup.sidebar');
            $(document).css('cursor', 'default');
            $('#sidebar').css('transition', 'width 0.2s ease-in-out');
        },

        get menuController() {
            return this._menuController;
        },

    };

    // return the constructor
    return fnConstructor;
};

APATE.SidebarController = Injector.resolve(['settings'], SidebarController);
export default APATE.SidebarController;
