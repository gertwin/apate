
import * as math from 'mathjs';
import List from '../list';
import Pair from '../pair';


/**
 * List functions
 * @type {Object} table with character functions
 */
const ListFuncs = {

    'eq': (a, b) => {
        if (b.type === List.Type
            || b.type === Pair.Type) {
            return a.data === b.data;
        }
        return false;
    },

    'equal': (a, b) => {
        if (b.type === List.Type
            || b.type === Pair.Type) {
            if (a.data === b.data) {
                return true;
            }
            if (a.data == null || b.data == null) {
                return false;
            }
            if (a.data.length !== b.data.length) {
                return false;
            }
            // check elements in array
            for (let i = 0; i < a.data.length; ++i) {
                if (a.data[i].valueOf() !== b.data[i].valueOf()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },

    'length': (l) => {
        return l.data.length;
    },

    'cons': (a, b) => {
        if (b.type === List.Type) {
            return new List([a].concat(b.data));
        }
        return new Pair(a, b);
    },

    'car': (l) => {
        return l.data[0];
    },

    'cdr': (l) => {
        const cdr = l.data.slice(1);
        if (cdr.length === 0) {
            return null;
        }
        if (cdr.length === 1) {
            return cdr[0];
        }
        return new List(cdr);
    },

    'map': (f, ...args) => {
        // all lengths of list parameters
        const lens = [];
        args.forEach((e) => {
            if (e.type !== List.Type) {
                throw new Error('map: parameter not of type list');
            }
            lens.push(e.data.length);
        });

        if (math.max(lens) === math.min(lens)) {
            const result = [];
            const len = math.max(lens);
            for (let ix = 0; ix < len; ix++) {
                const params = [];
                // get parameters for index
                args.forEach((e) => {
                    params.push(e.data[ix]);
                });
                // call function
                result.push(f(...params));
            }
            return new List(result);
        }
        throw new Error('map: length of list parameters not equal');
    },

    'list': (...args) => {
        return new List(args);
    },

    'list-ref': (l, i) => {
        if (l.type === List.Type) {
            if (i < l.data.length) {
                return l.data[i];
            }
            throw new Error(`list-ref: ${l} index ${i} is out of bounds`);
        } else if (l.type === Pair.Type) {
            if (i < 1) {
                return l.data[i];
            }
            throw new Error(`list-ref: ${l} index ${i} is out of bounds`);
        }
        throw new Error(`list-ref: ${l} is not a list`);
    },

    'list-tail': (l, i) => {
        if (l.type === List.Type) {
            if (i < l.data.length) {
                return new List(l.data.slice(i));
            }
            return new List();
        }
        throw new Error(`list-ref: ${l} is not a list`);
    },

    'list?': (l) => {
        return l.type === List.Type && l.data !== null && l.data.length > 0;
    },

    'pair?': (p) => {
        if (typeof p === 'object') {
            return p.data !== null && p.data.length === 2;
        }
        return false;
    },

    'null?': (l) => {
        return l.type === List.Type && (!l.data || l.data.length === 0);
    },

    'append': (l, ...p) => {
        if (l.type === List.Type) {
            // pair
            if (p.type === Pair.Type) {
                // list or pair
                return new List(l.data.concat(p.data));
            }
            // list
            if (Array.isArray(p)) {
                // array of lists
                let data = l.data;
                p.forEach((pl) => {
                    data = data.concat(pl.data);
                });
                return new List(data);
            }
            // single value
            return new List(math.clone(l.data).concat(p));
        }
        throw new Error(`append: ${l} is not a list`);
    },

    'assoc': (k, l) => {
        if (k) {
            if (l.type === List.Type) {
                let result = false;
                l.data.forEach((p) => {
                    if (p.type === Pair.Type) {
                        if (p.data[0] === k) {
                            result = p;
                        }
                    }
                });
                // key nof found
                return result;
            }
            throw new Error(`assoc: ${l} is not a list`);
        }
        throw new Error('assoc: \'key\' not defined');
    },

};

export default ListFuncs;
