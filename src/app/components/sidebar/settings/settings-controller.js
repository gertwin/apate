
import CONST from '../../../const';
import APATE from '../../../apate';
import Injector from '../../../utils/injector';

/* globals $, document */

APATE.namespace('APATE');


const SettingsController = (settings) => {
    /**
     * @constructor
     * @param {Settings} settings Settings service.
     */
    const fnConstructor = function fn() {
        if (settings.isReady()) {
            this.showAll();
        } else {
            $(document).bind('settingsready', this.showAll.bind(this));
        }

        $(document).bind('settingschange', this.onSettingChange.bind(this));

        this.addInputListeners();

        $('#open-settings').click(this.open.bind(this));
        $('#close-settings').click(this.close.bind(this));
    };

    /**
     * public API -- prototype
     * @type {Object}
     */
    fnConstructor.prototype = {
        constructor: APATE.SettingsController,
        version: '1.0',

        /**
        * Adds event listeners to settings inputs.
        * @private
        */
        addInputListeners() {
            Object.keys(CONST.SETTINGS).forEach((key) => {
                switch (CONST.SETTINGS[key].widget) {
                case 'checkbox':
                case 'number':
                    $(`#setting-${key}`).change(this.saveSetting.bind(this, key));
                    break;

                case 'radio':
                    Object.values(document.querySelectorAll(`input[name=setting-${key}]`)).forEach((element) => {
                        element.addEventListener('input', () => this.saveSetting(key));
                    });
                    break;

                default:
                    break;
                }
            });
        },

        open() {
            $('#sidebar').addClass('open-settings');
        },

        close() {
            $('#sidebar').removeClass('open-settings');
        },

        showAll() {
            const allSettings = settings.getAll();
            Object.keys(allSettings).forEach((key) => {
                this.show(key, allSettings[key]);
            });
        },

        /**
        * Displays a new setting value in the UI.
        * @param {string} key The unique section of the id of the switch element
        *     (after the 'setting-' prefix).
        * @param {string} value The value to set the setting to.
        * @private
        */
        show(key, value) {
            switch (CONST.SETTINGS[key].widget) {
            case 'checkbox':
                this.setSwitch(key, value);
                break;

            case 'number':
                $(`#setting-${key}`).val(parseInt(value, 10));
                break;

            case 'radio':
                document.getElementById(`setting-${key}-${value}`).setAttribute('checked', '');
                break;

            default:
                break;
            }
        },

        /**
        * Sets a switch Material Component element in the UI to active/inactive.
        * @param {string} key The unique section of the id of the switch element
        *     (after the 'setting-' prefix).
        * @param {boolean} value If true, activates the switch; if false, deactivates
        *     the switch
        * @private
        */
        setSwitch(key, value) {
            const elem = document.getElementById(`setting-${key}`);
            if (elem) {
                elem.toggleAttribute('checked', value);
                document.getElementById(`setting-${key}-switch`).classList.toggle('mdc-switch--checked', value);
            }
        },

        onSettingChange(e, key, value) {
            this.show(key, value);
        },

        /**
        * Saves the value of a setting UI widget.
        * @param {string} key The unique section of the id of the setting element
        *     (after the 'setting-' prefix).
        * @private
        */
        saveSetting(key) {
            let value;
            switch (CONST.SETTINGS[key].widget) {
            case 'checkbox':
                value = $(`#setting-${key}`).prop('checked');
                break;

            case 'number':
                value = parseInt($(`#setting-${key}`).val(), 10);
                break;

            case 'radio':
                value = document.querySelector(`input[name=setting-${key}]:checked`).getAttribute('value');
                break;

            default:
                break;
            }

            settings.set(key, value);
        },

    };

    // return the constructor
    return fnConstructor;
};

APATE.SettingsController = Injector.resolve(['settings'], SettingsController);
export default APATE.SettingsController;
