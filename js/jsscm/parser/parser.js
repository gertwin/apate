
// import Tokenizer from './tokenizer';
import Keyword from '../tokenizer/keyword';
import Token from '../tokenizer/token';
import ValueToken from '../tokenizer/valuetoken';


/**
 * Parser build AST from lexer tokens.
 */
export default class Parser {

    /**
     * @constructor
     * @param {object} tokenizer Tokenizer object
     */
    constructor(tokenizer) {
        this.tokenizer = tokenizer;
    }

    /**
     * Read from the tokenizer
     * @return {object} syntax true, atom or null at eof
     */
    readFrom() {
        // check end of file
        if (!this.tokenizer.eof()) {
            let token = this.tokenizer.next();
            if (token) {
                if (token.type === Token.OpenParenthesis) {
                    const l = [];
                    let peekToken = this.tokenizer.peek();
                    // read until the CloseParenthesis
                    while (peekToken && !(peekToken.type === Token.CloseParenthesis)) {
                        l.push(this.readFrom());
                        peekToken = this.tokenizer.peek();
                    }
                    // peekToken == CloseParenthesis
                    if (peekToken) {
                        // read close ')'
                        token = this.tokenizer.next();
                        // (sub) program
                        return l;
                    }
                    this.tokenizer.error('missing ")"');
                } else if (token.type === Token.SingleQuote) {
                    const l = [];
                    // convert single-quote to a full quote
                    l.push(new Keyword('quote'));
                    l.push(this.readFrom());
                    return l;
                } else if (token.type === Token.CloseParenthesis) {
                    this.tokenizer.error('unexpected ")"');
                } else {
                    // atom
                    return token;
                }
            }
        }
        return null;
    }

    /**
     * Walk tree of x, making optimizations/fixes, and signaling SyntaxError.
     * @param  {array} input not expanded x
     * @param  {Boolean}
     * @return {array} modified x
     */
    expand(x, toplevel = true) {
        this.require(x, x !== []);
        if (!x.hasOwnProperty('length')) {
            // atom: return unchanged
            return x;
        }
        if (x[0].keywords) {
            if (x[0].kw === Keyword.quote) {
                // (quote exp)
                this.require(x, x.length === 2);
                return x;
            }
            if (x[0].kw === Keyword.if) {
                if (x.length === 3) {
                    // (if t c) => (if t c None)
                    x.push(new Token(Token.NilToken));
                }
                this.require(x, x.length === 4);
                return x.map((xi) => {
                    return this.expand(xi);
                });
            }
            if (x[0].kw === Keyword.set) {
                this.require(x, x.length === 3);
                // (set! non-var exp) => Error
                this.require(x, x[1].type === Token.Symbol, 'can only set! a symbol');
                x[2] = this.expand(x[2]);
                return x;
            }
            if (x[0].kw === Keyword.define) {
                this.require(x, x.length >= 3);
                const keyword = x[0];
                const definition = x[1];
                const body = x.slice(2);

                if (definition && Array.isArray(definition)) {
                    // (define (fname args) body)
                    const fname = definition[0].value;
                    // => (define fname (lambda (args) body))
                    const args = definition.slice(1);
                    return this.expand([keyword, new Token(Token.Symbol, fname), [new Keyword('lambda'), args, body]]);
                }
                // (define non-var/list exp) => Error
                this.require(x, x.length === 3);
                this.require(x, definition.type === Token.Symbol, 'can only define a symbol');
                const exp = this.expand(x[2]);
                return [new Keyword('define'), definition, exp]
            }
            if (x[0].kw === Keyword.begin) {
                if (x.length === 1) {
                    // (begin) => None
                    return null;
                }
                return x.map((xi) => {
                    return this.expand(xi, toplevel);
                });
            }
            if (x[0].kw === Keyword.lambda) {
                // (lambda (x) e1 e2)
                this.require(x, x.length >= 3);
                // => (lambda (x) (begin e1 e2))
                const vars = x[1];
                const body = x.slice(2);
                // check
                const symbols = Array.isArray(vars) ? vars.filter((v) => {
                    return v.type === Token.Symbol;
                }) : [];
                this.require(x, Array.isArray(vars)
                    && ((symbols.length === vars.length)
                    || (vars.type === Token.Symbol)), 'illegal lambda argument list');
                const exp = body.length === 1 ? body[0] : [new Keyword('begin'), body];
                return [new Keyword('lambda'), vars, this.expand(exp)];
            }
            if (x[0].kw === Keyword.quasiquote) {
                // 'x => expand_quasiquote(x)
                this.require(x, x.length() === 2);
                return this.expand_quasiquote(x[1]);
            }
        }
        // expand all elements in array
        return x.map((xi) => {
            return this.expand(xi, toplevel);
        });
    }

    /**
     * Signal a syntax error if predicate is false.
     * @param  {*} x
     * @param  {function} predicate function
     * @param  {String} msg error message
     */
    require(x, predicate, msg = 'wrong length') {
        if (!predicate) {
            const s = this.toString(x);
            this.tokenizer.error(`${s}: ${msg}`);
        }
    }

    /**
     * Represent x as a string
     * @return {string} string representation of x
     */
    toString(x) {
        if (x.type === ValueToken.Bool) {
            if (x.value) {
                return '#t';
            }
            return '#f';
        }
        if (x.keywords) {
            return x.value;
        }
        if (x.type === Token.Symbol) {
            return x.value;
        }
        if (x.type === ValueToken.String) {
            return x.value.replace('"', '"');
        }
        if (x.type === ValueToken.Numeric) {
            return x.value;
        }
        if (x.type === ValueToken.Operator) {
            return x.value;
        }
        if (Array.isArray(x)) {
            let str = '(';
            x.forEach((xi) => {
                str = str.length > 1 ? `${str} ${this.toString(xi)}` : `${str}${this.toString(xi)}`;
            });
            str += ')';
            return str;
        }
        return x.value;
    }

    /**
     * Run the parser
     */
    run() {
        const ast = [];
        let subAst = this.readFrom();
        while (subAst) {
            ast.push(subAst);
            subAst = this.readFrom();
        }
        // return expanded ast
        return this.expand(ast);
    }

}
