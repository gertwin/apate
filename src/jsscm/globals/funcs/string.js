
/**
 * String functions
 * @type {Object} table with character functions
 */
const StringFuncs = {

    'string': (...args) => {
        return args.join('');
    },

    'string?': (a) => {
        return typeof a === 'string';
    },

    'strlen': (a) => {
        return a.length;
    },

    'strcat': (a, b) => {
        return a.concat(b);
    },

    'substr': (str, s, l) => {
        return str.substr(s, l);
    },

    'replacestr': (str, s, t) => {
        return str.replace(new RegExp(s, 'gi'), t);
    },

    'strupper': (str) => {
        return str.toUpperCase();
    },

    'strlower': (str) => {
        return str.toLowerCase();
    },

    'to-string': (i) => {
        return `${i}`;
    },

};

export default StringFuncs;
