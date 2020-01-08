
/**
 * Character functions
 * @type {Object} table with character functions
 */
const CharFuncs = {

    'char?': (a) => {
        return typeof a === 'string' && a.length === 1;
    },

    'char=?': (a, b) => {
        return typeof a === 'string' && a.length === 1 && a === b;
    },

    'char<?': (a, b) => {
        return typeof a === 'string' && a.length === 1 && a < b;
    },

    'char<=?': (a, b) => {
        return typeof a === 'string' && a.length === 1 && a <= b;
    },

    'char>?': (a, b) => {
        return typeof a === 'string' && a.length === 1 && a > b;
    },

    'char>=?': (a, b) => {
        return typeof a === 'string' && a.length === 1 && a >= b;
    },
};

export default CharFuncs;
