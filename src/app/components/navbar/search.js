
import i18n from '../../utils/i18n';
import APATE from '../../apate';

/* globals $, document */

APATE.namespace('APATE');


APATE.SearchController = (function searchController() {

    const maxHistoryLength = 10;
    const searchHistory = [];

    const addToSearchHitory = (query) => {
        if (query && query !== searchHistory[0]) {
            if (searchHistory.length > maxHistoryLength) {
                searchHistory.pop();
            }
            searchHistory.unshift(query);
            // element
            const jElem = $('#search-history');
            // remove children
            jElem.empty();
            searchHistory.forEach((item) => {
                $('#search-history').append(`<option value="${item}">`);
            });
        }
    };

    /**
     * public API -- constructor
     */
    const fnConstructor = function fn(search) {
        this.search = search;

        document.getElementById('search-input').addEventListener('focus', () => { this.activateSearch(); });
        $('#search-input').bind('input', this.onChange.bind(this));
        $('#search-input').keydown(this.onKeydown.bind(this));
        // Prevent search deactivation when search count is clicked
        document.getElementById('search-counting').addEventListener('mousedown', (event) => {
            event.preventDefault();
        });
        $('#search-next-button').click(this.onFindNext.bind(this));
        $('#search-previous-button').click(this.onFindPrevious.bind(this));
        $('.search-container').focusout(this.deactivateSearch.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.SearchController,
        version: '1.0',

        updateSearchCount() {
            if ($('#search-input').val().length === 0) {
                $('#search-counting').text('');
                return;
            }
            const searchCount = this.search.getResultsCount();
            const searchIndex = this.search.getCurrentIndex();
            $('#search-counting').text(i18n.getMessage('searchCounting', [searchIndex, searchCount]));
            if (searchCount === 0) {
                $('#search-counting').addClass('nomatches');
            } else {
                $('#search-counting').removeClass('nomatches');
            }
        },

        findNext(optReverse) {
            if (this.search.getQuery()) {
                this.search.findNext(optReverse);
                this.updateSearchCount(optReverse);
            }
        },

        /**
        * Moves focus to the search input and shows all search UI elements.
        * @private
        */
        activateSearch() {
            this.search.clear();
            document.getElementById('search-input').select();
            $('search-count-container').show();
            $('header').addClass('search-active');
        },

        deactivateSearch(e) {
            // relatedTarget is null if the element clicked on can't receive focus
            if (!e.relatedTarget || !e.relatedTarget.closest('.search-container')) {
                $('#search-input').val('');
                $('#search-counting').text('');
                $('header').removeClass('search-active');
                $('search-count-container').show();
                addToSearchHitory(this.search.query);
                this.search.clear();
            }
        },

        onChange() {
            const searchString = $('#search-input').val();
            if (searchString === this.search.getQuery()) {
                return;
            }
            if (searchString) {
                this.search.find(searchString);
            } else {
                this.search.clear();
            }
            this.updateSearchCount();
        },

        onKeydown(e) {
            switch (e.key) {
            case 'Enter':
                e.stopPropagation();
                this.findNext(e.shiftKey /* reverse */);
                break;

            case 'Escape':
                e.stopPropagation();
                this.search.unfocus();
                break;

            default:
                break;
            }
        },

        onFindNext() {
            this.findNext();
        },

        onFindPrevious() {
            this.findNext(true /* reverse */);
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.SearchController;
