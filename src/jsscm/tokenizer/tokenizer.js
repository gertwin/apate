
import Keyword from './keyword';
import Token from './token';
import ValueToken from './valuetoken';

/**
 * Tokenizer class.
 * Get input from the scanner.
 */
export default class Tokenizer {

    /**
     * @constructor
     * @param {*} scanner scanner input stream
     */
    constructor(scanner) {
        this.scanner = scanner;
        this.current = null;
        // accepted keywords
        this.keyword = new Keyword();
    }

    /**
     * Test for a keyword
     * @param {*} x
     */
    isKeyword(x) {
        return this.keyword.isKeyword(x);
    }

    /**
     * Test for a digit
     * @param {*} ch
     */
    static isDigit(ch) {
        return /[0-9]/i.test(ch);
    }

    /**
     * Test for a identifier start
     * @param {*} ch
     */
    static isIdStart(ch) {
        return /[a-zλ_]/i.test(ch);
    }

    /**
     * Test for a identifier
     * @param {*} ch
     */
    static isId(ch) {
        return /[a-zλ_]/i.test(ch) || '?!-<>=0123456789'.indexOf(ch) >= 0;
    }

    /**
     * Test for an operator character
     * @param {*} ch
     */
    static isOpChar(ch) {
        return '+-*/%=&|<>!'.indexOf(ch) >= 0;
    }

    /**
     * Test for an character prefix
     * @param {*} ch
     */
    static isCharPrefix(ch) {
        return '#\\'.indexOf(ch) >= 0;
    }

    /**
     * Test for an boolean character
     * @param {*} ch
     */
    static isBoolChar(ch) {
        return '#tf'.indexOf(ch) >= 0;
    }

    /**
     * Test for a punctuation
     * @param {*} ch
     */
    static isPunctuation(ch) {
        return '().'.indexOf(ch) >= 0;
    }

    /**
     * Test for a whitespace
     * @param {*} ch
     */
    static isWhitespace(ch) {
        return ' \t\n'.indexOf(ch) >= 0;
    }

    /**
     * Read while predicate is true
     * @param {*} predicate
     */
    readWhile(predicate) {
        let str = '';
        while (!this.scanner.eof() && predicate(this.scanner.peek())) {
            str += this.scanner.next();
        }
        return str;
    }

    /**
     * Read a number from the scanner
     */
    readNumber() {
        let hasDot = false;
        let hasExp = false;
        const number = this.readWhile((ch) => {
            if (ch === '.') {
                if (hasDot) {
                    return false;
                }
                hasDot = true;
                return true;
            }
            if (ch === 'e' || ch === 'E') {
                if (hasExp) {
                    return false;
                }
                hasExp = true;
                return true;
            }
            return Tokenizer.isDigit(ch) || ch === '+' || ch === '-';
        });
        return new ValueToken(ValueToken.Numeric, parseFloat(number));
    }

    /**
     * Read a identifier or variable from the scanner
     */
    readIdentifier() {
        const id = this.readWhile(Tokenizer.isId);
        if (this.keyword.isKeyword(id)) {
            return new Keyword(id);
        }
        return new Token(Token.Symbol, id);
    }

    /**
     *
     * @param {*} end
     */
    readEscaped(end) {
        let escaped = false;
        let str = '';

        this.scanner.next();
        while (!this.scanner.eof()) {
            const ch = this.scanner.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch === '\\') {
                escaped = true;
            } else if (ch === end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }

    /**
     * Read a charaxter from the scanner
     * @return {string} a single character
     */
    readCharacter() {
        // read prefix #\
        this.readWhile(Tokenizer.isCharPrefix);
        // read character
        const char = this.scanner.next();
        return new ValueToken(ValueToken.Character, char);
    }

    /**
     * Read a string from the scanner
     */
    readString() {
        return new ValueToken(ValueToken.String, this.readEscaped('"'));
    }

    /**
     * @return {object} boolean token read from input
     */
    readBoolean() {
        const bool = this.readWhile(Tokenizer.isBoolChar);
        if (bool === '#f') {
            return new ValueToken(ValueToken.Bool, false);
        }
        if (bool === '#t') {
            return new ValueToken(ValueToken.Bool, true);
        }
        // error
        this.error(`Invalid boolen: '${bool}'`);
        return null;
    }

    /**
     * Read a line with comment
     */
    skipComment() {
        this.readWhile((ch) => { return ch !== '\n'; });
        this.scanner.next();
    }

    /**
     * Read next token
     */
    readNext() {
        // consume all whitespaces
        this.readWhile(Tokenizer.isWhitespace);
        // stop on end of file
        if (this.scanner.eof()) {
            return null;
        }
        // peek next character from scanner
        const ch = this.scanner.peek();
        // handle comment
        if (ch === ';') {
            this.skipComment();
            return this.readNext();
        }
        // handle a string
        if (ch === '"') {
            return this.readString();
        }
        // handle a quote character
        if (ch === '\'') {
            // read the character
            this.scanner.next();
            return new Token(Token.SingleQuote);
        }
        // handle boolean
        if (ch === '#') {
            const next = this.scanner.peek({ ahead: 1 });
            if (next === '\\') {
                return this.readCharacter();
            }
            return this.readBoolean();
        }
        // handle a number
        if (Tokenizer.isDigit(ch)) {
            return this.readNumber();
        }
        // handle signed number
        if (ch === '+' || ch === '-') {
            // peek next character
            const next = this.scanner.peek({ ahead: 1 });
            if (Tokenizer.isDigit(next)) {
                return this.readNumber();
            }
        }
        // handle identifier
        if (Tokenizer.isIdStart(ch)) {
            return this.readIdentifier();
        }
        // handle punctuation
        if (Tokenizer.isPunctuation(ch)) {
            const punc = this.scanner.next();
            if (punc === '(') {
                return new Token(Token.OpenParenthesis);
            }
            if (punc === ')') {
                return new Token(Token.CloseParenthesis);
            }
            return new Token(Token.Dot, this.scanner.next());
        }
        // handle operand
        if (Tokenizer.isOpChar(ch)) {
            return new Token(Token.Operator, this.readWhile(Tokenizer.isOpChar));
        }
        // error
        this.error(`Invalid character: ${ch}`);
        return null;
    }

    /**
     * Peek next token
     */
    peek() {
        const result = this.current || (this.current = this.readNext());
        return result;
    }

    /**
     * Read next token
     */
    next() {
        const token = this.current;
        this.current = null;
        return token || this.readNext();
    }

    /**
     * Test for end of file
     */
    eof() {
        return this.peek() == null;
    }

    /**
     * Report an error
     * @param {*} msg
     */
    error(msg) {
        this.scanner.error(msg);
    }

}
