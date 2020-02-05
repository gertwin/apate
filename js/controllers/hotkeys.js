
import APATE from '../apate';
import i18n from '../utils/i18n';

/* globals $, document, window */

APATE.namespace('APATE.HotkeysController');


APATE.HotkeysController = (function hotkeysController() {

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(windowController, tabs, editor, settings) {
        this.windowController = windowController;
        this.tabs = tabs;
        this.editor = editor;
        this.settings = settings;

        this.ZOOM_IN_FACTOR = 9 / 8;
        this.ZOOM_OUT_FACTOR = 8 / 9;

        $(document).keydown(this.onKeydown.bind(this));
        document.addEventListener('mousewheel', this.onMouseWheel.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.HotkeysController,
        version: '1.0',

        /**
        * Handles hotkey combination if present in keydown event.
        * Some hotkeys are handled by CodeMirror directly. Among them:
        * Ctrl-C, Ctrl-V, Ctrl-X, Ctrl-Z, Ctrl-Y, Ctrl-A
        * @param {!Event} e The keydown event
        * @private
        */
        onKeydown(e) {
            if (e.ctrlKey || e.metaKey) {
                let fontSize = 0;

                switch (e.key) {
                case 'Tab':
                    if (e.shiftKey) {
                        this.tabs.previousTab();
                    } else {
                        this.tabs.nextTab();
                    }
                    return false;

                case 'f':
                case 'F':
                    document.getElementById('search-input').focus();
                    return false;

                case 'n':
                    this.tabs.newTab();
                    return false;

                case 'N':
                    this.tabs.newWindow();
                    return false;

                case 'o':
                case 'O':
                    this.tabs.openFile();
                    return false;

                case 'p':
                case 'P':
                    window.print();
                    return false;

                case 's':
                    this.tabs.save();
                    return false;

                case 'S':
                    this.tabs.saveAs();
                    return false;

                case 'w':
                    this.tabs.closeCurrent();
                    return false;

                case 'Z':
                    this.editor.redo();
                    return false;

                case '0':
                case ')':
                    this.settings.reset('fontsize');
                    return false;

                case '+':
                case '=':
                    fontSize = this.settings.get('fontsize');
                    this.settings.set('fontsize', fontSize * this.ZOOM_IN_FACTOR);
                    return false;

                case '-':
                case '_':
                    fontSize = this.settings.get('fontsize');
                    this.settings.set('fontsize', fontSize * this.ZOOM_OUT_FACTOR);
                    return false;

                default:
                    break;
                }
            } else if (e.altKey) {
                if (e.key === ' ') {
                    $('#toggle-sidebar').click();
                    return false;
                }
            }
            return true;
        },

        onMouseWheel(e) {
            if (e.ctrlKey || e.metaKey) {
                const fontSize = this.settings.get('fontsize');
                if (e.wheelDelta > 0) {
                    this.settings.set('fontsize', fontSize * this.ZOOM_IN_FACTOR);
                } else {
                    this.settings.set('fontsize', fontSize * this.ZOOM_OUT_FACTOR);
                }
            }
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.HotkeysController;
