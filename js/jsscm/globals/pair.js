
const DT_PAIR = 0x4000001;

/**
 * Pair class
 */
class Pair {

    constructor(a, b = undefined) {
        this.type = Pair.Type;
        if (a !== null && typeof a !== 'undefined') {
            if (Array.isArray(a)) {
                this.data = a;
            } else {
                this.data = [a].concat(b);
            }
        } else {
            this.data = null;
        }
    }

    toString() {
        return `'(${this.data[0]} . ${this.data[1]})`;
    }

}

Object.defineProperty(Pair, 'Type', {
    value: DT_PAIR,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default Pair;
