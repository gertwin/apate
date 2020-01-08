
import Vector from '../vector';


/**
 * Vector functions
 * @type {Object} table with character functions
 */
const VectorFuncs = {

    'vector': (...args) => {
        return new Vector(args);
    },

    'vector?': (v) => {
        return v.type === Vector.Type;
    },

    'make-vector': (l) => {
        if (l > 0) {
            return new Vector(Array(l).fill(0));
        }
        return new Vector();
    },

    'vector-ref': (v, i) => {
        if (v.type === Vector.Type) {
            if (i < v.data.length) {
                return v.data[i];
            }
            throw new Error(`vector-ref: ${v} index ${i} is out of bounds`);
        }
        throw new Error(`vector-ref: ${v} is not a Vector`);
    },

    'vector-set!': (v, i, r) => {
        if (v.type === Vector.Type) {
            if (i < v.data.length) {
                v.update(i, r);
                return;
            }
            throw new Error(`vector-set!: ${v} index ${i} is out of bounds`);
        }
        throw new Error(`vector-set!: ${v} is not a Vector`);
    },

};

export default VectorFuncs;
