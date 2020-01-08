
import i18n from '../utils/i18n';
import APATE from '../apate';

/* globals $, document */

APATE.namespace('APATE.SidebarController');


APATE.SidebarController = (function SidebarController() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(settings) {
        this.settings = settings;
        $('#toggle-sidebar').click(this.toggle.bind(this));
        $('#sidebar-resizer').mousedown(this.resizeStart.bind(this));
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
            if (this.settings.get('sidebaropen')) {
                $('#sidebar').css('width', `${this.settings.get('sidebarwidth')}px`);
                $('#sidebar').css('border-right-width', '2px');
                $('#toggle-sidebar').attr('title', i18n.getMessage('closeSidebarButton'));
            } else {
                $('#sidebar').css('width', '0');
                $('#sidebar').css('border-right-width', '0');
                $('#toggle-sidebar').attr('title', i18n.getMessage('openSidebarButton'));
            }
        },

        toggle() {
            // FIXME: Move this to css where possible (toggle code)
            if (this.settings.get('sidebaropen')) {
                this.settings.set('sidebaropen', false);
                $('#sidebar').css('width', '0');
                $('#sidebar').css('border-right-width', '0');
                $('#toggle-sidebar').attr('title', i18n.getMessage('openSidebarButton'));
            } else {
                this.settings.set('sidebaropen', true);
                $('#sidebar').css('width', `${this.settings.get('sidebarwidth')}px`);
                $('#sidebar').css('border-right-width', '2px');
                $('#toggle-sidebar').attr('title', i18n.getMessage('closeSidebarButton'));
            }
            $.event.trigger('sidebar-toggle');
            setTimeout(() => {
                $.event.trigger('sidebar-resize');
            }, 200);
        },

        resizeStart(e) {
            this.resizeMouseStartX = e.clientX;
            this.resizeStartWidth = parseInt($('#sidebar').css('width'), 10);
            $(document).on('mousemove.sidebar', this.resizeOnMouseMove.bind(this));
            $(document).on('mouseup.sidebar', this.resizeFinish.bind(this));
            $(document).css('cursor', 'e-resize !important');
            $('#sidebar').css('transition', 'none');
        },

        resizeOnMouseMove(e) {
            const change = e.clientX - this.resizeMouseStartX;
            let sidebarWidth = this.resizeStartWidth + change;
            if (sidebarWidth < 20) {
                sidebarWidth = 20;
            }
            $('#sidebar').css('width', `${sidebarWidth}px`);
            return sidebarWidth;
        },

        resizeFinish(e) {
            const sidebarWidth = this.resizeOnMouseMove(e);
            this.settings.set('sidebarwidth', sidebarWidth);
            $(document).off('mousemove.sidebar');
            $(document).off('mouseup.sidebar');
            $(document).css('cursor', 'default');
            $('#sidebar').css('transition', 'width 0.2s ease-in-out');
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.SidebarController;
