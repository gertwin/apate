
import Token from '../tokenizer/token';
import ValueToken from '../tokenizer/valuetoken';
import List from '../globals/list';
import Pair from '../globals/pair';


/**
 * Evaluate atom in the given environment
 * @param {object} x token
 * @param {object} env environment
 */
const evaluateAtom = (evaluator, tree, result, env) => {
    if (tree.type === Token.Symbol) {
        const localEnv = env.find(tree.value);
        if (localEnv) {
            return localEnv.find(tree.value).get(tree.value);
        }
        throw new SyntaxError(`undefined symbol '${tree.value}'`);
    }
    // operator
    if (tree.type === Token.Operator) {
        const opEnv = env.find(tree.value);
        if (opEnv) {
            return opEnv.get(tree.value);
        }
        throw new SyntaxError(`undefined operator '${tree.value}'`);
    }
    // string
    if (tree.type === ValueToken.String) {
        return tree.value;
    }
    // numeric
    if (tree.type === ValueToken.Numeric) {
        return tree.value;
    }
    // boolean
    if (tree.type === ValueToken.Bool) {
        return tree.value;
    }
    // character
    if (tree.type === ValueToken.Character) {
        return tree.value;
    }
    // pair or list
    if (tree.type === Pair.Type || tree.type === List.Type) {
        return tree.data;
    }
    // nil token
    if (tree.type === Token.NilToken) {
        return tree.value;
    }
    if (typeof tree === 'function') {
        return evaluator.evaluate(tree.call(null), result, env);
    }
    // callable
    console.log('Reached callable!');
    const callEnv = env.find(tree.value);
    if (callEnv) {
        return callEnv.get(tree.value);
    }
    return null;
};


export default evaluateAtom;
