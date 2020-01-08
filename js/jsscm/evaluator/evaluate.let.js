import Environment from '../environment';
import Token from '../tokenizer/token';
import ValueToken from '../tokenizer/valuetoken';


/**
 * evaluate a let block
 * @param  {*}      tree      token
 * @param  {*}      result result accumulator
 * @param  {object} env    environment
 * @return {*}      evaluated value
 */
const evaluateLet = (evaluator, tree, result, env) => {
    // create new environment for local variables
    const localEnv = new Environment(null, null, env);
    // set local variables
    const nodes = tree[0];
    if (Array.isArray(nodes)) {
        nodes.forEach((node) => {
            if (node[0].type === Token.Symbol) {
                if (node[1].type === ValueToken.Bool
                    || node[1].type === ValueToken.Numeric
                    || node[1].type === ValueToken.Character
                    || node[1].type === ValueToken.String) {
                    localEnv.set(node[0].value, node[1].value);
                } else {
                    localEnv.set(node[0].value, evaluator.evaluate(node[1], result, env));
                }
            } else {
                throw new SyntaxError(`expected an identifier, but saw a '${node[1]}'`);
            }
        });
        // valuate sequences
        return evaluator.evaluateSequence(evaluator, tree.slice(1), result, localEnv);
    }
    throw new SyntaxError(`expected a list, but saw a '${nodes}'`);
};

export default evaluateLet;
