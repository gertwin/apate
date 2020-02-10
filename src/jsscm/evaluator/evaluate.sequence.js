
/**
 * evaluate a sequence (begin) block
 * @param  {*}      tree      token
 * @param  {*}      result result accumulator
 * @param  {object} env    environment
 * @return {*}      evaluated value
 */
const evaluateSequence = (evaluator, tree, result, env) => {
    let val;
    for (let i = 0; i < tree.length; i++) {
        val = evaluator.evaluate(tree[i], result, env);
    }
    return val;
};

export default evaluateSequence;
