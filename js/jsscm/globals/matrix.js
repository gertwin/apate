
const DT_MATRIX = 0x7000001;


/**
 * Matrix wrapper
 */
class Matrix {

    constructor(arr) {
        this.type = Matrix.Type;
        this.data = arr;
    }

    toString() {
        return `m${this.data.toString()}`;
    }

}

Object.defineProperty(Matrix, 'Type', {
    value: DT_MATRIX,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default Matrix;
