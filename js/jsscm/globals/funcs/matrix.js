
import * as math from 'mathjs';
import Pair from '../pair';
import Vector from '../vector';
import Matrix from '../matrix';


/**
 * Array functions
 * @type {Object} table with character functions
 */
const MatrixFuncs = {

    'matrix': (...args) => {
        if (Array.isArray(args)) {
            // first allement is a list with dimensions
            const p = args.shift();
            if (p.type === Pair.Type) {
                // all elements in the list must be positive integers
                p.data.forEach((n) => {
                    if (typeof n !== 'number' || n < 1) {
                        throw new SyntaxError('matrix: dimensions must be all positive integers');
                    }
                });
                const m = p.data[0];
                const n = p.data[1];
                // check array length
                const l = m * n;
                if (args && args.length > 0) {
                    if (l === args.length) {
                        const arr = [];
                        for (let r = 0; r < m; r++) {
                            const row = [];
                            for (let c = 0; c < n; c++) {
                                row.push(args[r * n + c]);
                            }
                            arr.push(row);
                        }
                        return new Matrix(math.matrix(arr));
                    }
                    throw new SyntaxError(`matrix: number of values not equal to ${l}`);
                }
                return new Matrix(math.zeros(m, n));
            }
            throw new SyntaxError('matrix: first argument must be a pair with dimensions');
        }
        throw new SyntaxError('matrix: wrong number of arguments');
    },

    'matrix?': (m) => {
        return m.type === Matrix.Type;
    },

    'matrix-ref': (mat, r, c) => {
        if (mat.type === Matrix.Type) {
            return mat.data.get([r - 1, c - 1]);
        }
        throw new Error(`matrix-ref: ${mat} is not a matrix`);
    },

    'matrix-set!': (mat, r, c, v) => {
        if (mat.type === Matrix.Type) {
            mat.data.set([r - 1, c - 1], v);
            return;
        }
        throw new Error(`matrix-set!: ${mat} is not a matrix`);
    },

    'matrix-add': (a, b) => {
        if (a.type === Matrix.Type) {
            if (b.type === Matrix.Type) {
                return new Matrix(math.add(a.data, b.data));
            }
            return new Matrix(math.add(a.data, b));
        }
        throw new Error(`matrix-add: ${a} is not a matrix`);
    },

    'matrix-scale': (a, s) => {
        if (a.type === Matrix.Type) {
            return new Matrix(math.multiply(a.data, s));
        }
        throw new Error(`matrix-scale: ${a} is not a matrix`);
    },

    'matrix-transpose': (a) => {
        if (a.type === Matrix.Type) {
            return new Matrix(math.transpose(a.data));
        }
        throw new Error(`matrix-transpose: ${a} is not a matrix`);
    },

    'matrix-multiply': (a, b) => {
        if (a.type === Matrix.Type) {
            if (b.type === Matrix.Type) {
                return new Matrix(math.multiply(a.data, b.data));
            }
            return new Matrix(math.multiply(a.data, b));
        }
        throw new Error(`matrix-multiply: ${a} is not a matrix`);
    },

    'matrix-solve': (a, v) => {
        if (a.type === Matrix.Type) {
            if (v.type === Vector.Type) {
                const res = math.lusolve(a.data, v.data);
                return new Vector(math.flatten(res));
            }
            throw new Error(`matrix-solve: ${v} is not a vector`);
        }
        throw new Error(`matrix-solve: ${a} is not a matrix`);
    },

};

export default MatrixFuncs;
