
/**
 * Scanner retrieves characters from an input string.
 */
export default class Scanner {

    /**
     * @constructor
     * @param {string} input character string
     */
    constructor(input) {
        // input character string
        this.input = input;
        // position in the strem
        this.pos = 0;
        // currect line for error reports
        this.line = 1;
        // current column for error reports
        this.col = 0;
    }

    /**
     * Get next character from the input
     * @return {char} next character on the input stream
     */
    next() {
        const ch = this.input.charAt(this.pos++);
        if (ch === '\n') {
            this.line++;
            this.col = 0;
        } else {
            this.col++;
        }
        return ch;
    }

    /**
     * Peek at the next character on the stream without removing from the stream
     * @param {object} ahead named parameter indicates number of characters to peek ahad of current
     * @return {char} next character on the input stream
     */
    peek({ ahead = 0 } = {}) {
        return this.input.charAt(this.pos+ahead);
    }

    /**
     * Is the end of the stream reached?
     * @return {bool}
     */
    eof() {
        return this.peek() === '';
    }

    /**
     * Report an error
     * @param {string} msg
     */
    error(msg) {
        // after the message, tell on wich line and column
        throw new Error(`${msg} (line: ${this.line}, col: ${this.col})`);
    }

}
