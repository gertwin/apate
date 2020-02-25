
import Environment from './environment';
import Scanner from './scanner/scanner';
import Tokenizer from './tokenizer/tokenizer';
import Parser from './parser/parser';
import Evaluator from './evaluator/evaluator';
import ModuleManager from './modulemanager';
import Keyword from './tokenizer/keyword';
import ValueToken from './tokenizer/valuetoken';

import CharFuncs from './globals/funcs/char';
import BoolFuncs from './globals/funcs/bool';
import StringFuncs from './globals/funcs/string';
import Quote from './globals/quote';
import Pair from './globals/pair';
import List from './globals/list';
import ListFuncs from './globals/funcs/list';
import VectorFuncs from './globals/funcs/vector';
import MatrixFuncs from './globals/funcs/matrix';

import AstPrinter from './astprinter';


export default class Interpreter {

    /**
     * set global environment
     * @param  {*} output [output object]
     */
    constructor(output) {
        this.output = output;
        // environment
        this.globalEnv = Interpreter.initEnvironment();
        // environment extention
        this.globalEnv.set('print', this.print.bind(this));
        this.globalEnv.set('println', this.println.bind(this));
        this.globalEnv.set('display', this.print.bind(this));
        this.globalEnv.set('newline', this.newline.bind(this));
        // APATE functions
    }

    /**
     * initialize the global enviroment
     */
    static initEnvironment() {
        const env = new Environment();
        const globInit = {
            '+': (...args) => {
                return args.reduce((a, b) => { return a + b; });
            },

            '-': (...args) => {
                return (args.length === 1) ? -1 * args[0]
                    : args.reduce((a, b) => { return a - b; });
            },

            '*': (...args) => {
                return args.reduce((a, b) => { return a * b; });
            },

            '/': (a, b) => {
                return (b === undefined) ? 1 / a : a / b;
            },

            'apply': (f, ...args) => {
                let p = [];
                args.forEach((arg) => {
                    if (arg.type === List.Type) {
                        p = p.concat(arg.data);
                    } else if (arg.type === Pair.Type) {
                        throw new Error(`apply: expected list, given ${arg}`);
                    } else {
                        p.push(arg);
                    }
                });
                return p.reduce((a, b) => f(a, b));
            },

            'number?': (a) => {
                return typeof a === 'number';
            },

            'symbol?': (a) => {
                return typeof a === 'string';
            },

            'to-number': (s) => {
                return s * 1;
            },

        };

        // iterate over the globInit keys
        Object.keys(globInit).forEach((key) => {
            // and add to global environment
            env.set(key, globInit[key]);
        });

        // add char functions to the global environment
        Object.keys(CharFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, CharFuncs[key]);
        });

        // add boolean functions to the global environment
        Object.keys(BoolFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, BoolFuncs[key]);
        });

        // add string functions to the global environment
        Object.keys(StringFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, StringFuncs[key]);
        });

        // add list functions to the global environment
        Object.keys(ListFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, ListFuncs[key]);
        });

        // add vector functions to the global environment
        Object.keys(VectorFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, VectorFuncs[key]);
        });

        // add array functions to the global environment
        Object.keys(MatrixFuncs).forEach((key) => {
            // and add to global environment
            env.set(key, MatrixFuncs[key]);
        });

        // math function
        ['abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp',
            'floor', 'log', 'max', 'min', 'pow', 'random', 'round', 'sin',
            'sqrt', 'tan', 'PI'].forEach((n) => {
            // all symbols to lower case
            env.set(n.toLowerCase(), Math[n]);
        });
        // environment contains now default environment
        return env;
    }

    /**
     * Evaluate define module keyword token in the given environment
     * @param {object} x token
     * @param {object} env environment
     */
    evaluateUseModule(symbol) {
        const that = this;
        return new Promise((resolve, reject) => {
            const name = symbol.value;
            const moduleManager = new ModuleManager();
            moduleManager.getModule(name).then((module) => {
                if (module && Array.isArray(module)) {
                    for (let i = 0; i < module.length; i++) {
                        const form = module[0];
                        try {
                            const result = {
                                value: null,
                            };
                            const evaluator = new Evaluator();
                            evaluator.evaluate(form, result, that.globalEnv);
                            resolve();
                        } catch (e) {
                            reject(new Error(`Error: evaluating module '${name}': ${e}`));
                        }
                    }
                } else {
                    // error in module
                    reject(new Error(`Error: loading module '${name}'`));
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * Load modules
     * @param  {array} ast, program syntax tree
     * @return {*}     es6 Promise object
     */
    evaluateModules(ast) {
        return new Promise((resolve, reject) => {
            const promises = [];
            let i = 0;
            while (i < ast.length) {
                const node = ast[i];
                // check array with length property
                if (node.length
                    && node[0].keywords
                    && node[0].kw === Keyword.use_module) {
                    // import module module, name is at index 1 of node
                    promises.push(this.evaluateUseModule(node[1]));
                    // remove evaluated element from array
                    ast.splice(i, 1);
                } else {
                    i++;
                }
            }
            // wait all
            Promise.all(promises).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * evaluate toplevel forms
     * @param  {array} ast, program tree
     * @return {*}     result object
     */
    evaluateAst(ast) {
        return new Promise((resolve, reject) => {
            // load modules
            this.evaluateModules(ast).then(() => {
                const result = {
                    value: null,
                };
                const promises = [];
                // run program through the evaluator
                const evaluator = new Evaluator();
                // evaluate al forms
                for (let i = 0; i < ast.length; i++) {
                    try {
                        const form = ast[i];
                        // evaluate
                        result.value = evaluator.evaluate(form, result, this.globalEnv);
                        if (typeof result.value !== 'undefined') {
                            if (result.value instanceof Promise) {
                                // do not output
                            } else if (Array.isArray(result.value)
                                && result.value[0].keywords
                                && result.value[0].kw === Keyword.define_module) {
                                const moduleName = result.value[1];
                                // add module to storage
                                const moduleManager = new ModuleManager();
                                promises.push(moduleManager.addModule(moduleName, form.slice(2)));
                            } else if (typeof result.value === 'function') {
                                if (Array.isArray(form)) {
                                    this.println(`<procedure:${form[0].value}>`);
                                } else {
                                    this.println(`<procedure:${form.value}>`);
                                }
                            } else if (result.value.type === List.Type) {
                                this.println(`'${result.value}`);
                            } else if (result.value.type === Quote.Type) {
                                const quote = result.value;
                                if (quote.data.type === ValueToken.String) {
                                    this.println(`"${result.value}"`);
                                } else {
                                    this.println(`'${result.value.toString()}`);
                                }
                            } else {
                                this.println(result.value);
                            }
                        }
                    } catch (e) {
                        this.println(`Error: ${e.message}`);
                    }
                }
                // are there promises
                if (promises.length > 0) {
                    // wait all
                    Promise.all(promises).then(() => {
                        this.println('Module successfully added');
                        resolve();
                    }).catch((e) => {
                        reject(e);
                    });
                } else {
                    resolve();
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }

    /**
     * Parse the program
     * @param {string} program text
     */
    parse(program, showAst = false) {
        let ast = null;
        try {
            ast = new Parser(new Tokenizer(new Scanner(program))).run();
            if (showAst) {
                // show the AST in the output pane
                this.printTree(ast);
            }
        } catch (e) {
            this.printerr(e);
        } finally {
            this.println('');
        }
        return ast;
    }

    /**
     * Run the program
     * @param {string} program text
     */
    run(program, showAst = false) {
        return new Promise((resolve, reject) => {
            try {
                const ast = this.parse(program, showAst);
                // evaluate ast, run the program
                this.evaluateAst(ast).then((result) => {
                    resolve(result);
                }).catch((error) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            } finally {
                this.println('');
            }
        });
    }

    /**
     * Print the AST
     * @param {object} obj containing a ast (sub)tree and the print indentation
     */
    printTree(ast) {
        const printer = new AstPrinter();
        this.println(printer.toString(ast));
    }

    printerr(e) {
        if (this.output) {
            this.output({
                type: 'printerr',
                message: e,
            });
        }
    }

    /**
     * Write text to the output
     * @param {string} s text to write
     */
    print(s) {
        this.println(s);
    }

    /**
     * Write a line to the output
     * @param {string} l line to write
     */
    println(l) {
        if (this.output && l !== null) {
            if (typeof l === 'boolean') {
                if (l) {
                    this.println('#t');
                } else {
                    this.println('#f');
                }
            } else {
                const line = l.toString();
                if (line.length > 0) {
                    this.output({
                        type: 'println',
                        message: l.toString(),
                    });
                }
            }
        }
    }

    /**
     * Write a newline to the output
     */
    newline() {
        if (this.output) {
            this.output({
                type: 'output',
                message: '',
            });
        }
    }

}
