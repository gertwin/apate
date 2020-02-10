
import List from './list';
import Pair from '../pair';
import ListFuncs from './list';


function arraysEqual(a, b) {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    // check elements in array
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Boolean functions
 * @type {Object} table with character functions
 */
const BoolFuncs = {

    'and': (a, b) => {
        return a && b;
    },

    'or': (a, b) => {
        return a || b;
    },

    'not': (a) => {
        return !a;
    },

    '>': (a, b) => {
        return a > b;
    },

    '<': (a, b) => {
        return a < b;
    },

    '>=': (a, b) => {
        return a >= b;
    },

    '<=': (a, b) => {
        return a <= b;
    },

    '=': (a, b) => {
        // == is correct
        return a == b;
    },

    'eq?': (a, b) => {
        if (a.type === List.Type ||
            a.type === Pair.Type) {
            return ListFuncs.eq(a, b);
        }
        return a === b;
    },

    'equal?': (a, b) => {
        if (a.type === List.Type ||
            a.type === Pair.Type) {
            return ListFuncs.equal(a, b);
        }
        if (Array.isArray(a)) {
            return arraysEqual(a, b);
        }
        return a === b;
    },

    'boolean?': (a) => {
        return typeof a === 'boolean';
    },

};

export default BoolFuncs;
