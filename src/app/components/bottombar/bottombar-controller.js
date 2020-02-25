
import i18n from '../../utils/i18n';
import APATE from '../../apate';
import Output from './output';
import Injector from '../../utils/injector';

/* globals $, document */

APATE.namespace('APATE');


const BottombarController = (settings) => {

    // minimum bottombar heigth
    const MIN_HEIGHT = 52;

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {

        this._output = new Output($('#output')[0]);

        $('#toggle-bottombar').click(this.toggle.bind(this));
        $('#bottombar-resizer').mousedown(this.resizeStart.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.BottombarController,
        version: '1.0',

        init() {
            const bottombarHeight = settings.get('bottombarheight');
            // FIXME: move this to CSS where possible (init code)
            if (settings.get('bottombaropen')) {
                $('#bottombar').css('height', `${bottombarHeight}px`);
                $('#bottombar').css('border-top-width', '2px');
                $('#toggle-bottombar').attr('title', i18n.getMessage('closeBottombarTitle'));
            } else {
                $('#bottombar').css('height', `${MIN_HEIGHT}px`);
                $('#bottombar').css('border-top-width', '2px');
                $('#toggle-bottombar').attr('title', i18n.getMessage('openBottombarTitle'));
                $('#bottombar-resizer').hide();
            }
            $('#output-clear').attr('title', i18n.getMessage('clearOutputTitle'));
            $('#panel-container').css('height', `${bottombarHeight - 65}px`);
        },

        toggle() {
            // FIXME: Move this to css where possible (toggle code)
            if (settings.get('bottombaropen')) {
                settings.set('bottombaropen', false);
                $('#bottombar').css('height', `${MIN_HEIGHT}px`);
                $('#toggle-bottombar').attr('title', i18n.getMessage('openBottombarTitle'));
                $('#bottombar-resizer').hide();
            } else {
                settings.set('bottombaropen', true);
                $('#bottombar').css('height', `${settings.get('bottombarheight')}px`);
                // $('#bottombar').css('border-top-width', '2px');
                $('#toggle-bottombar').attr('title', i18n.getMessage('closeBottombarTitle'));
                $('#bottombar-resizer').show();
            }
            $.event.trigger('bottombar-toggle');
        },

        resizeStart(e) {
            this.resizeMouseStartY = e.clientY;
            this.resizeStartHeight = parseInt($('#bottombar').css('height'), 10);
            $(document).on('mousemove.bottombar', this.resizeOnMouseMove.bind(this));
            $(document).on('mouseup.bottombar', this.resizeFinish.bind(this));
            $(document).css('cursor', 'e-resize !important');
            $('#bottombar').css('transition', 'none');
        },

        resizeOnMouseMove(e) {
            const change = this.resizeMouseStartY - e.clientY;
            let bottombarHeight = this.resizeStartHeight + change;
            if (bottombarHeight < MIN_HEIGHT) {
                bottombarHeight = MIN_HEIGHT;
            }
            $('#bottombar').css('height', `${bottombarHeight}px`);
            return bottombarHeight;
        },

        resizeFinish(e) {
            const bottombarHeight = this.resizeOnMouseMove(e);
            settings.set('bottombarheight', bottombarHeight);
            $(document).off('mousemove.bottombar');
            $(document).off('mouseup.bottombar');
            $(document).css('cursor', 'default');
            $('#bottombar').css('transition', 'height 0.3s ease-in-out');
            $('#panel-container').css('height', `${bottombarHeight - 65}px`);
        },

        get output() {
            return this._output;
        },

    };

    // return the constructor
    return fnConstructor;
};

APATE.BottombarController = Injector.resolve(['settings'], BottombarController);
export default APATE.BottombarController;
