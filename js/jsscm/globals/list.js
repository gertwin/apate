
const DT_LIST = 0x4000002;

/**
 * List class
 */
class List {

    constructor(a, b = undefined) {
        this.type = List.Type;
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
        let str = '';
        if (this.data) {
            this.data.forEach((elem) => {
                if (elem) {
                    if (str.length > 0) {
                        str += ' ';
                    }
                    str += elem.toString();
                }
            });
        }
        return `(${str})`;
    }

}

Object.defineProperty(List, 'Type', {
    value: DT_LIST,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default List;
