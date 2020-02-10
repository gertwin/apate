
import APATE from '../../apate';
import CONST from '../../const';
import Search from '../../search';
import CodeMirror from './codemirror-global';

/* globals $ */

APATE.namespace('APATE.Editor');


APATE.Editor = (function editor() {
    const fnConstructor = function fn(editorElement, settings) {
        this.element = editorElement;
        this.settings = settings;
        this.cm = CodeMirror(editorElement, {
            value: '',
            autofocus: true,
            matchBrackets: true,
            highlightSelectionMatches: {
                minChars: 1,
                delay: 0,
                caseInsensitive: true,
            },
        });
        this.cm.setSize(null, 'auto');
        this.cm.on('change', this.onChange.bind(this));
        this.setTheme();
        this.search = new Search(this.cm);
        // Mimic Sublime behaviour there.
        this.defaultTabHandler = CodeMirror.commands.defaultTab;
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Editor,
        version: '1.0',

        /**
        * @param {string} opt_content
        * @return {EditSession}
        * Create an edit session for a new file. Each tab should have its own session.
        */
        newSession(optContent) {
            const session = new CodeMirror.Doc(optContent || '');
            return session;
        },

        /**
        * @param {EditSession} session
        * Change the current session, usually to switch to another tab.
        */
        setSession(session) {
            this.cm.swapDoc(session);
        },

        /**
        * @return {Search}
        * Return search object.
        */
        getSearch() {
            return this.search;
        },

        onChange() {
            $.event.trigger('docchange', this.cm.getDoc());
        },

        undo() {
            this.cm.undo();
        },

        redo() {
            this.cm.redo();
        },

        focus() {
            this.cm.focus();
        },

        /**
        * @param {Session} session
        * @param {string} extension
        */
        setMode(session, extension) {
            const mode = CONST.EXTENSION_TO_MODE[extension];
            if (mode) {
                let currentSession = null;
                if (session !== this.cm.getDoc()) {
                    currentSession = this.cm.swapDoc(session);
                }
                this.cm.setOption('mode', mode);
                if (currentSession !== null) {
                    this.cm.swapDoc(currentSession);
                }
            }
        },

        /**
        * @param {number} fontSize
        * Update font size from settings.
        */
        setFontSize(fontSize) {
            $('.CodeMirror').css('font-size', `${fontSize}px`);
            this.cm.refresh();
        },

        /**
        * @param {number} size
        */
        setTabSize(size) {
            this.cm.setOption('tabSize', size);
            this.cm.setOption('indentUnit', size);
            this.replaceTabWithSpaces(this.settings.get('spacestab'));
        },

        /**
        * @param {string} theme
        */
        setTheme(theme) {
            this.cm.setOption('theme', theme || 'default');
        },

        /**
        * @param {boolean} val
        */
        showHideLineNumbers(val) {
            this.cm.setOption('lineNumbers', val);
        },

        /**
        * @param {boolean} val
        */
        setWrapLines(val) {
            this.cm.setOption('lineWrapping', val);
        },

        /**
        * @param {boolean} val
        */
        setSmartIndent(val) {
            this.cm.setOption('smartIndent', val);
        },

        /**
        * @param {boolean} val
        */
        replaceTabWithSpaces(val) {
            this.cm.setOption('indentWithTabs', !val);
            if (val) {
                // Need to update this closure once the tabsize has changed. So, have to
                // call this method when it happens.
                const tabsize = this.settings.get('tabsize');

                CodeMirror.commands.defaultTab = (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        const nspaces = tabsize - (cm.getCursor().ch % tabsize);
                        const spaces = Array(nspaces + 1).join(' ');
                        cm.replaceSelection(spaces, 'end', '+input');
                    }
                };
            } else {
                CodeMirror.commands.defaultTab = this.defaultTabHandler;
            }
        },

        /**
        * Make the textarea unfocusable and hide cursor.
        */
        disable() {
            this.cm.setOption('readOnly', 'nocursor');
        },

        enable() {
            this.cm.setOption('readOnly', false);
            this.cm.focus();
        },

    };

    // return the constructor
    return fnConstructor;
}());


export default APATE.Editor;
