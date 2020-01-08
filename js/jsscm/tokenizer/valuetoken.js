
const TK_BOOL = 0x1000001;
const TK_NUMERIC = 0x1000002;
const TK_CHARACTER = 0x100000;
const TK_STRING = 0x1000004;


/**
 * class of value tokens wich reperesent a value
 */
class ValueToken {

    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }

    /**
     * Convert a Token to json
     * @return {string} json representation of the keyword
     */
    toJSON() {
        return {
            'type': 'Token',
            'value': `${this.value}`,
        };
    }

    /**
     * string representation of this token
     * @return {*} token value
     */
    toString() {
        return `type:${this.type}, value:${this.value}`;
    }

}

Object.defineProperty(ValueToken, 'Bool', {
    value: TK_BOOL,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(ValueToken, 'Numeric', {
    value: TK_NUMERIC,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(ValueToken, 'Character', {
    value: TK_CHARACTER,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(ValueToken, 'String', {
    value: TK_STRING,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default ValueToken;
