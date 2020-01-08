
import APATE from './apate';

/* globals CodeMirror */

APATE.namespace('APATE.Search');


APATE.Search = (function search() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(cm) {
        this.cm = cm;
        this.cursor = null; /* SearchCursor object from CodeMirror */
        this.query = null;
        this.index = 0;
        this.resultsCount = 0;
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.Search,
        version: '1.0',

        /**
         * @param {string} query
         * @param {CodeMirror.Pos} pos
         * Get a search cursor that is always case insensitive.
         */
        updatecursor(query, pos) {
            return this.cm.getSearchCursor(query, pos, true /* case insensitive */);
        },


        /**
         * @param {string} query
         * @return {integer}
         * Get results count for a query search.
         */
        computeresultsCount(query) {
            const lcQuery = query.toLowerCase();
            this.index = 0;
            this.resultsCount = 0;
            const cursorLine = this.cursor.pos.from.line;
            const cursorCh = this.cursor.pos.from.ch;
            const step = lcQuery.length;

            this.cm.eachLine((line) => {
                const content = line.text.toLowerCase();
                const lineNo = line.lineNo();
                let pos = 0;
                while (true) {
                    pos = content.indexOf(lcQuery, pos);
                    if (pos >= 0) {
                        this.resultsCount++;
                        if ((lineNo < cursorLine) || (lineNo === cursorLine && pos < cursorCh)) {
                            this.index++;
                        }
                        pos += step;
                    } else {
                        break;
                    }
                }
            });
        },

        /**
         * Reset selection.
         */
        resetSelection() {
            this.cm.setCursor(this.cm.getCursor('anchor'));
        },

        /**
         * Clear search.
         */
        clear() {
            this.query = null;
            this.cursor = null;
            this.resetSelection();
        },

        /**
         * @return {integer}
         * Return current search index.
         */
        getCurrentIndex() {
            return this.index;
        },

        /**
         * @return {integer}
         * Return total search results.
         */
        getResultsCount() {
            return this.resultsCount;
        },

        /**
         * @param {string} query
         * Initialize search. This is called every time the search string is updated.
         */
        find(query) {
            this.query = query;

            // If there is no selection, we start at cursor. If there is, we start at the
            // beginning of it.
            const currentPos = this.cm.getCursor('start');

            this.cursor = this.updatecursor(query, currentPos);
            this.computeresultsCount(query);

            // Actually go to the match.
            this.findNext();
        },

        /**
         * @param {boolean} opt_reverse
         * Select the next match when user presses Enter in search field or clicks on
         * "Next" and "Previous" search navigation buttons.
         */
        findNext(optReverse) {
            if (!this.cursor) {
                throw new Error('Internal error: cursor should be initialized.');
            }
            const reverse = optReverse || false;
            let isFound = this.cursor.find(reverse);
            if (!isFound) {
                const lastLine = CodeMirror.Pos(this.cm.lastLine());
                const firstLine = CodeMirror.Pos(this.cm.firstLine(), 0);
                this.cursor = this.updatecursor(this.query,
                    reverse ? lastLine : firstLine);
                isFound = this.cursor.find(reverse);
            }

            if (isFound) {
                this.cm.setSelection(this.cursor.from(), this.cursor.to());
                this.index += reverse ? -1 : 1;
                this.index = this.index % this.resultsCount;
                if (this.index === 0) {
                    this.index = this.resultsCount;
                }
            } else {
                this.resetSelection();
            }
        },

        /**
         * Get current search query.
         */
        getQuery() {
            return this.query;
        },

        /**
         * Unfocus search focus the editor.
         */
        unfocus() {
            this.cm.focus();
        },
    };

    // return the constructor
    return fnConstructor;
}());


export default APATE.Search;
