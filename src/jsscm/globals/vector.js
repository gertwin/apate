
import * as math from 'mathjs';

const DT_VECTOR = 0x6000001;


/**
 * Vector
 */
class Vector {

    constructor(a = []) {
        this.type = Vector.Type;
        if (a && Array.isArray(a)) {
            this.data = a;
        } else if (math.typeof(a) === 'Matrix') {
            this.data = a.toArray();
        } else {
            this.data = [];
        }
    }

    /**
     * update value at index i to value r
     * @param  {number} i [index]
     * @param  {*}      r [value]
     */
    update(i, r) {
        this.data[i] = r;
    }

    toString() {
        return `v[${this.data.join(', ')}]`;
    }

}

Object.defineProperty(Vector, 'Type', {
    value: DT_VECTOR,
    writable: false,
    enumerable: true,
    configurable: false,
});

export default Vector;
