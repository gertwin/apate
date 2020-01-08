/**
 * @fileoverview This is a simple template engine inspired by JsTemplates
 * optimized for i18n.
 *
 * It currently supports two handlers:
 *
 *   * i18n-content which sets the textContent of the element.
 *
 *     <span i18n-content="myContent"></span>
 *
 *   * i18n-values is a list of attribute-value or property-value pairs.
 *     Properties are prefixed with a '.' and can contain nested properties.
 *
 *     <span i18n-values="title:myTitle;.style.fontSize:fontSize"></span>
 *
 * This file is heavily inspired by the i18n_template_no_process.js file in chromium,
 * with minor tweaks to support chrome.i18n.
 */
import APATE from '../apate';
import i18n from './i18n';

APATE.namespace('APATE.utils');

APATE.utils.i18nTemplate = (function i18nTemplate() {
    /**
    * This provides the handlers for the templating engine. The key is used as
    * the attribute name and the value is the function that gets called for every
    * single node that has this attribute.
    * @type {Object}
    */
    const handlers = {
        /**
         * This handler sets the textContent of the element.
         * @param {HTMLElement} element The node to modify.
         * @param {string} key The name of the message in chrome.i18n.
         */
        'i18n-content': (element, key) => {
            element.textContent = i18n.getMessage(key);
        },

        /**
         * This is used to set HTML attributes and DOM properties. The syntax is:
         *   attributename:key;
         *   .domProperty:key;
         *   .nested.dom.property:key
         * @param {HTMLElement} element The node to modify.
         * @param {string} attributeAndKeys The path of the attribute to modify
         *     followed by a colon, and the name of the message in chrome.i18n.
         *     Multiple attribute/key pairs may be separated by semicolons.
         */
        'i18n-values': (element, attributeAndKeys) => {
            const parts = attributeAndKeys.replace(/\s/g, '').split(/;/);
            parts.forEach((part) => {
                if (!part) {
                    return;
                }

                const attributeAndKeyPair = part.match(/^([^:]+):(.+)$/);
                if (!attributeAndKeyPair) {
                    console.error(`malformed i18n-values: ${attributeAndKeys}`);
                    return;
                }

                const propName = attributeAndKeyPair[1];
                const propExpr = attributeAndKeyPair[2];

                const value = i18n.getMessage(propExpr);

                // Allow a property of the form '.foo.bar' to assign a value into
                // element.foo.bar.
                if (propName[0] === '.') {
                    const path = propName.slice(1).split('.');
                    let targetObject = element;
                    while (targetObject && path.length > 1) {
                        targetObject = targetObject[path.shift()];
                    }
                    if (targetObject) {
                        targetObject[path] = value;
                        // In case we set innerHTML (ignoring others) we need to
                        // recursively check the content.
                        if (path === 'innerHTML') {
                            process(element);
                        }
                    }
                } else {
                    element.setAttribute(propName, value);
                }
            });
        },

    };

    const attributeNames = Object.keys(handlers);
    const selector = `[${attributeNames.join('],[')}]`;

    /**
    * Processes a DOM tree with chrome.i18n.
    * @param {Document} node The root of the DOM tree to process.
    */
    function process(node) {
        const elements = node.querySelectorAll(selector);
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            for (let j = 0; j < attributeNames.length; j++) {
                const name = attributeNames[j];
                const attribute = element.getAttribute(name);
                if (attribute != null) {
                    handlers[name](element, attribute);
                }
            }
        }
    }

    return {
        process,
    };
}());

export default APATE.utils.i18nTemplate;

// $(document).ready(i18nTemplate.process(document));
