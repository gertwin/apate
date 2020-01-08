
import axios from 'axios';
import APATE from '../apate';

/* globals window */

APATE.namespace('APATE.utils');

APATE.utils.i18n = (function i18n() {
    // string translation table
    let messages = {};

    /**
     * initialize the translation table
     */
    const init = () => {
        return new Promise((resolve, reject) => {
            const lang = window.navigator.language;
            axios.get(`/locales/${lang}/messages.json`).then((response) => {
                messages = response.data;
                resolve();
            }).catch(() => {
                axios.get(`/public/locales/${lang}/messages.json`).then((response) => {
                    messages = response.data;
                    resolve();
                }).catch((error) => {
                    // handle error
                    console.log(error);
                    reject(error);
                });
            });
        });
    };

    /**
     * get message for token from messages
     * @param  {string} token [description]
     * @return {string}       [description]
     */
    const getMessage = (...tokens) => {
        if (tokens.length > 0) {
            // first token is translation string
            const translated = messages[tokens[0]];
            if (translated) {
                if (translated.placeholders) {
                    const params = tokens[1];
                    // deep clone message before substitution
                    let message = translated.message.slice(0);
                    for (let ix = 0; ix < params.length; ix++) {
                        const placeholderName = Object.keys(translated.placeholders)[ix];
                        if (placeholderName) {
                            let paramIx = ix;
                            const placeholder = translated.placeholders[placeholderName];
                            if (placeholder && placeholder.content.length > 1) {
                                paramIx = parseInt(placeholder.content[1], 10) - 1;
                            }
                            // subtitute placeholder
                            message = message.replace(`$${placeholderName}$`, params[paramIx]);
                        }
                    }
                    return message;
                }
                return translated.message;
            }
            // return input
            return tokens[0];
        }
        return '*failed*';
    };

    return {
        init,
        getMessage,
    };
}());

export default APATE.utils.i18n;
