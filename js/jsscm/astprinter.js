
// import Keyword from './tokenizer/keyword';
import Token from './tokenizer/token';
import ValueToken from './tokenizer/valuetoken';


const AstPrinter = function AstPrinter() {
    const module = this;

    module.toString = (ast) => {
        return module.toStringTree(ast, 0);
    };

    /**
     * string presention of a node
     * @param  {*} node,    node object
     * @return {string}     string presention of a node
     */
    module.toStringNode = (node) => {
        if (node.keywords) {
            return `keyword: ${node.value}`;
        }
        if (node.type === Token.Symbol) {
            return `symbol: ${node.value}`;
        }
        if (node.type === ValueToken.Numeric) {
            return `numeric: ${node.value}`;
        }
        if (node.type === ValueToken.String) {
            return `string: ${node.value}`;
        }
        if (node.type === ValueToken.Character) {
            return `character: ${node.value}`;
        }
        if (node.type === ValueToken.Bool) {
            return `boolean: ${node.value}`;
        }
        if (node.type === Token.Operator) {
            return `operator: ${node.value}`;
        }
        if (node.type === Token.Dot) {
            return `dot: ${node.value}`;
        }
        return `${node.value}`;
    };

    /**
     * Print the AST
     * @param {object} obj containing a ast (sub)tree and the print indentation
     */
    module.toStringTree = (ast, indent) => {
        const len = ast.length;
        let str = `\n${Array(indent).join(' ')}[`;
        let nodePrinted = false;
        for (let i = 0; i < len; i++) {
            if (nodePrinted) {
                str += ', ';
            }
            if (Array.isArray(ast[i])) {
                str += this.toStringTree(ast[i], indent + 4 );
            } else if (str.length === 0) {
                str += this.toStringNode(ast[i]);
                nodePrinted = true;
            } else {
                str += `${this.toStringNode(ast[i])}`;
                nodePrinted = true;
            }
        }
        str += ']';
        return str;
    };

    // public members
    return {
        toString: module.toString
    };
};

export default AstPrinter;
