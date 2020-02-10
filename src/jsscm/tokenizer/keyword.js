
const TK_KEYWORD = 0x3000000;

const KW_QUOTE = 0x3000001;
const KW_IF = 0x3000002;
const KW_SET = 0x3000003;
const KW_DEFINE = 0x3000004;
const KW_DEFINE_MODULE = 0x3000005;
const KW_USE_MODULE = 0x3000006;
const KW_LAMBDA = 0x3000007;
const KW_BEGIN = 0x3000008;
const KW_DEFINEMACRO = 0x3000009;
const KW_QUASIQUOTE = 0x3000010;
const KW_UNQUOTE = 0x3000011;
const KW_UNQUOTESPLICING = 0x3000012;
const KW_WHEN = 0x3000013;
const KW_UNLESS = 0x3000014;
const KW_COND = 0x3000015;
const KW_ELSE = 0x3000016;
const KW_CASE = 0x3000017;
const KW_LET = 0x3000018;
const KW_LETS = 0x3000019;

/**
 * Keyword token class
 */
export default class Keyword {

    constructor(kw) {
        this.type = Keyword.Type;
        this.value = kw;
        this.keywords = {
            'quote': KW_QUOTE,
            'if': KW_IF,
            'when': KW_WHEN,
            'unless': KW_UNLESS,
            'cond': KW_COND,
            'else': KW_ELSE,
            'case': KW_CASE,
            'set!': KW_SET,
            'define': KW_DEFINE,
            'define-module': KW_DEFINE_MODULE,
            'use-module': KW_USE_MODULE,
            'lambda': KW_LAMBDA,
            'begin': KW_BEGIN,
            'let': KW_LET,
            'let*': KW_LETS,
            'define-macro': KW_DEFINEMACRO,
            'quasiquote': KW_QUASIQUOTE,
            'unquote': KW_UNQUOTE,
            'unquote-splicing': KW_UNQUOTESPLICING,
        };
        // undefined keyword
        this.kw = null;
        // set keyword type
        if (kw in this.keywords) {
            this.kw = this.keywords[kw];
        }
    }

    /**
     * is kw a keyword?
     * @param  {string}  kw candidate keyword
     * @return {Boolean}    true if kw is a keyword, false otherwise
     */
    isKeyword(kw) {
        return kw in this.keywords;
    }

    /**
     * Convert a keyword to json
     * @return {string} json representation of the keyword
     */
    toJSON() {
        return {
            'type': 'Keyword',
            'value': `${this.value}`,
        };
    }

}

Object.defineProperty(Keyword, 'Type', {
    value: TK_KEYWORD,
    writable: false,
    enumerable: true,
    configurable: false,
});

// keywords constants
Object.defineProperty(Keyword, 'quote', {
    value: KW_QUOTE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'if', {
    value: KW_IF,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'when', {
    value: KW_WHEN,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'unless', {
    value: KW_UNLESS,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'cond', {
    value: KW_COND,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'else', {
    value: KW_ELSE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'case', {
    value: KW_CASE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'set', {
    value: KW_SET,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'define', {
    value: KW_DEFINE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'define_module', {
    value: KW_DEFINE_MODULE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'use_module', {
    value: KW_USE_MODULE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'lambda', {
    value: KW_LAMBDA,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'begin', {
    value: KW_BEGIN,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'let', {
    value: KW_LET,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'let*', {
    value: KW_LETS,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'define_macro', {
    value: KW_DEFINEMACRO,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'quasiquote', {
    value: KW_QUASIQUOTE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'unquote', {
    value: KW_UNQUOTE,
    writable: false,
    enumerable: true,
    configurable: false,
});

Object.defineProperty(Keyword, 'unquote_splicing', {
    value: KW_UNQUOTESPLICING,
    writable: false,
    enumerable: true,
    configurable: false,
});
