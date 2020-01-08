
const TK_NIL = 0x2000001;
const TK_OPERATOR = 0x2000002;
const TK_PUNCTUATION = 0x2000003;
const TK_OPENPARENTHESIS = 0x2000004;
const TK_CLOSEPARENTHESIS = 0x2000005;
const TK_DOT = 0x2000006;
const TK_SYMBOL = 0x2000007;
const TK_SINGLEQUOTE = 0x2000008;

/**
 * token class
 */
class Token {

    constructor(type, value = null) {
        this.type = type;
        this.value = value;
    }

    /**
     * Convert a Token to json
     * @return {string} json representation of the keyword
     */
    toJSON() {
        let typeName;
        switch (this.type) {

        case TK_NIL:
            typeName = 'NilToken';
            break;

        case TK_OPERATOR:
            typeName = 'Operator';
            break;

        case TK_PUNCTUATION:
            typeName = 'Punctuation';
            break;

        case TK_OPENPARENTHESIS:
            typeName = 'OpenParenthesis';
            break;

        case TK_CLOSEPARENTHESIS:
            typeName = 'CloseParenthesis';
            break;

        case TK_DOT:
            typeName = 'Dot';
            break;

        case TK_SYMBOL:
            typeName = 'Symbol';
            break;

        case TK_SINGLEQUOTE:
            typeName = 'SingleQuote';
            break;

        default:
            typeName = 'NilToken';
            break;
        }

        return {
            'type': typeName,
            'value': `${this.value}`,
        };
    }

    /**
     * string representation of this token
     * @return {*} token value
     */
    toString() {
        return this.value;
    }

}

Object.defineProperty(Token, 'NilToken', {
    value: TK_NIL,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'Operator', {
    value: TK_OPERATOR,
    writable: false,
    enumerable: true,
    configurable: false,
});


Object.defineProperty(Token, 'Punctuation', {
    value: TK_PUNCTUATION,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'OpenParenthesis', {
    value: TK_OPENPARENTHESIS,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'CloseParenthesis', {
    value: TK_CLOSEPARENTHESIS,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'Dot', {
    value: TK_DOT,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'Symbol', {
    value: TK_SYMBOL,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Token, 'SingleQuote', {
    value: TK_SINGLEQUOTE,
    writable: false,
    enumerable: true,
    configurable: false,
});


export default Token;
