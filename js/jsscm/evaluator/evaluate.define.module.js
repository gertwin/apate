
/**
 * Evaluate define module keyword token in the given environment
 * @param {object} tree token
 * @param {object} env environment
 */
const evaluateDefineModule = (evaluator, tree, result, env) => {
    // evaluate module to catch syntax errors
    for (let i = 2; i < tree.length; i++) {
        evaluator.evaluate(tree[i], result, env);
    }
    // return Keyword 'define_module' and Symbol 'module name'
    return [tree[0], tree[1]];
};

export default evaluateDefineModule;
