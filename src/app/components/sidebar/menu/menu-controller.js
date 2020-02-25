import { MDCRipple } from '@material/ripple';

import i18n from '../../../utils/i18n';
import APATE from '../../../apate';
import Tabs from './tabs';

/* globals $, document */

APATE.namespace('APATE.MenuController');


APATE.MenuController = (function menuController() {
    /**
     * public API -- constructor
     */
    const fnConstructor = function fn() {
        this._tabs = new Tabs();
        this.dragItem = null;
        $('#file-menu-new').click(this.newTab.bind(this));
        $('#file-menu-open').click(this.open.bind(this));
        $('#file-menu-save').click(this.save.bind(this));
        $('#file-menu-saveas').click(this.saveas.bind(this));
        $(document).bind('newtab', this.addNewTab.bind(this));
        $(document).bind('switchtab', this.onSwitchTab.bind(this));
        $(document).bind('tabchange', this.onTabChange.bind(this));
        $(document).bind('tabclosed', this.onTabClosed.bind(this));
        $(document).bind('tabpathchange', this.onTabPathChange.bind(this));
        $(document).bind('tabrenamed', this.onTabRenamed.bind(this));
        $(document).bind('tabsave', this.onTabSave.bind(this));

    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.MenuController,
        version: '1.0',

        init() {
            if (!this._tabs.hasOpenTab()) {
                this._tabs.newTab();
            }
        },

        /**
        * Adds a new draggable file tab to the UI.
        * @param {!Event} e The newtab event (unused).
        * @param {!Tab} tab The new tab to be added.
        * @private
        */
        addNewTab(e, tab) {
            const id = tab.getId();
            const tabElement = document.createElement('li');
            tabElement.setAttribute('draggable', 'true');
            tabElement.id = `tab${id}`;
            const filenameElement = document.createElement('div');
            filenameElement.textContent = tab.getName();
            filenameElement.className = 'filename';
            tabElement.appendChild(filenameElement);
            const closeElement = document.createElement('button');
            closeElement.textContent = 'close';
            closeElement.setAttribute('title', i18n.getMessage('closeFileButton'));
            closeElement.classList.add('close', 'mdc-icon-button', 'material-icons');
            MDCRipple.attachTo(closeElement).unbounded = true;
            tabElement.appendChild(closeElement);
            document.getElementById('tabs-list').appendChild(tabElement);

            tabElement.addEventListener('dragstart', () => { this.onDragStart($(tabElement)); });
            tabElement.addEventListener('dragover', (event) => { this.onDragOver($(tabElement), event); });
            tabElement.addEventListener('dragend', (event) => { this.onDragEnd($(tabElement), event)});
            tabElement.addEventListener('drop', (event) => { this.onDrop(event); });
            tabElement.addEventListener('click', () => { this.tabButtonClicked(id); });
            closeElement.addEventListener('click', (event) => { this.closeTab(event, id); });
        },

        onDragStart(listItem) {
            this.dragItem = listItem;
        },

        onDragEnd(listItem, e) {
            this.dragItem = null;
            e.preventDefault();
            e.stopPropagation();
        },

        onDrop(e) {
            e.stopPropagation();
        },

        onDragOver(overItem, e) {
            e.preventDefault();
            if (!this.dragItem || overItem.attr('id') === this.dragItem.attr('id')) {
                return;
            }

            if (this.dragItem.index() < overItem.index()) {
                overItem.after(this.dragItem);
            } else {
                overItem.before(this.dragItem);
            }
            this._tabs.reorder(this.dragItem.index(), overItem.index());
        },

        onTabRenamed(e, tab) {
            $(`#tab${tab.getId()} .filename`).text(tab.getName());
            this._tabs.modeAutoSet(tab);
        },

        onTabPathChange(e, tab) {
            $(`#tab${tab.getId()} .filename`).attr('title', tab.getPath());
        },

        onTabChange(e, tab) {
            $(`#tab${tab.getId()}`).addClass('unsaved');
        },

        onTabClosed(e, tab) {
            $(`#tab${tab.getId()}`).remove();
        },

        onTabSave(e, tab) {
            $(`#tab${tab.getId()}`).removeClass('unsaved');
        },

        onSwitchTab(e, tab) {
            $('#tabs-list li.active').removeClass('active');
            $(`#tab${tab.getId()}`).addClass('active');
        },

        newTab() {
            this._tabs.newTab();
            return false;
        },

        open() {
            this._tabs.openFile();
            return false;
        },

        save() {
            this._tabs.save();
            return false;
        },

        saveas() {
            this._tabs.saveAs();
            return false;
        },

        tabButtonClicked(id) {
            this._tabs.showTab(id);
            return false;
        },

        /**
        * Closes a file tab, removing it from the UI.
        * @param {!Event} The triggering click event.
        * @param {number} The id of the tab to close.
        */
        closeTab(e, id) {
            this._tabs.close(id);
            e.stopPropagation();
        },


        get tabs() {
            return this._tabs;
        },

    };

    // return the constructor
    return fnConstructor;
}());

export default APATE.MenuController;
