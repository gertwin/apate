
import 'core-js/stable';
import Keyword from './tokenizer/keyword';
import Token from './tokenizer/token';
import ValueToken from './tokenizer/valuetoken';
import ModuleStore from './modulestore';


/**
 * Module manager adds, removes or gets modules from local storage
 */
export default class ModuleManager {

    constructor() {
        this.error = null;
        this.moduleStorage = new ModuleStore();
    }

    /**
     * get the module name from an array
     * @param  {array} names array
     * @return {string}   module name
     */
    static getName(token) {
        if (token.type === Token.Symbol) {
            return token.value;
        }
        return token;
    }

    /**
     * Check if module with name tokens exists
     * @param  {array}  tokens name array
     * @return {*} es6 Promise object
     */
    hasModule(tokens) {
        return new Promise((resolve, reject) => {
            const name = ModuleManager.getName(tokens);
            if (name && typeof name === 'string' && name.length > 0) {
                this.moduleStorage.getData(name).then((data) => {
                    resolve(data && data.length > 0);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error('No module name'));
            }
        });
    }

    /**
     * Get the module ast from local storage
     * @param  {string} name of the module
     * @return {*} es6 Promise object
     */
    getModule(tokens) {
        const that = this;
        return new Promise((resolve, reject) => {
            const name = ModuleManager.getName(tokens);
            if (name && typeof name === 'string' && name.length > 0) {
                this.moduleStorage.getData(name).then((data) => {
                    resolve(that.jsonToAst(JSON.parse(data)));
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error('No module name'));
            }
        });
    }

    /**
     * Add the module ast under the name to local storage
     * @param {string} tokens name of the module
     * @param {array} ast module tree
     * @return {*} es6 Promise object
     */
    addModule(tokens, ast) {
        return new Promise((resolve, reject) => {
            const name = ModuleManager.getName(tokens);
            if (name && typeof name === 'string' && name.length > 0) {
                this.moduleStorage.setData(name, JSON.stringify(ast)).then(() => {
                    resolve(name);
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error('No module name'));
            }
        });
    }

    /**
     * Remove module with name from the local storage
     * @param  {string} name of the module
     * @return {*} es6 Promise object
     */
    removeModule(tokens) {
        return new Promise((resolve, reject) => {
            const name = ModuleManager.getName(tokens);
            if (name && typeof name === 'string' && name.length > 0) {
                this.moduleStorage.delData(name).then(() => {
                    resolve();
                }).catch((error) => {
                    reject(error);
                });
            } else {
                reject(new Error('No module name'));
            }
        });
    }

    /**
     * recursive conversion of an json object to an ast.
     * @param  {object} json array
     * @return {array}  the ast
     */
    jsonToAst(json) {
        if (Array.isArray(json)) {
            const subtree = [];
            for (let ix = 0; ix < json.length; ix++) {
                subtree.push(this.jsonToAst(json[ix]));
            }
            return subtree;
        }
        // convert to token
        if (json.type === 'Keyword') {
            return new Keyword(json.value);
        }
        if (json.type === 'NilToken') {
            return new Token(Token.NilToken, json.value);
        }
        if (json.type === 'Operator') {
            return new Token(Token.Operator, json.value);
        }
        if (json.type === 'Punctuation') {
            return new Token(Token.Punctuation, json.value);
        }
        if (json.type === 'OpenParenthesis') {
            return new Token(Token.OpenParenthesis, json.value);
        }
        if (json.type === 'CloseParenthesis') {
            return new Token(Token.CloseParenthesis, json.value);
        }
        if (json.type === 'Bool') {
            return new ValueToken(ValueToken.Bool, json.value);
        }
        if (json.type === 'Symbol') {
            return new Token(Token.Symbol, json.value);
        }
        if (json.type === 'Numeric') {
            return new ValueToken(ValueToken.Numeric, json.value);
        }
        if (json.type === 'String') {
            return new ValueToken(ValueToken.String, json.value);
        }
        return new Token(Token.NilToken, json.value);
    }

}
