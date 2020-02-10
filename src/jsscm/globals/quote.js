
import ValueToken from '../tokenizer/valuetoken';

const DT_QUOTE = 0x5000001;


/**
 * Quote class
 */
class Quote {

    constructor(node) {
        this.type = Quote.Type;
        this.data = node;
    }

    valueOf() {
        if (this.data.type === ValueToken.Bool
            || this.data.type === ValueToken.Numeric
            || this.data.type === ValueToken.Character
            || this.data.type === ValueToken.String) {
            return this.data.value;
        }
        return this.data;
    }

    toString() {
        return this.data.toString();
        // if (this.data.type === ValueToken.Bool ||
        //     this.data.type === ValueToken.Numeric ||
        //     this.data.type === ValueToken.Character ||
        //     this.data.type === ValueToken.String) {
        //     return `${this.data.value}`;
        // } else {
        //     return this.data.toString();
        // }
    }

}

Object.defineProperty(Quote, 'Type', {
    value: DT_QUOTE,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default Quote;
