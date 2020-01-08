
import Environment from '../environment';
import Keyword from '../tokenizer/keyword';


/**
 * Evaluate keyword in the given environment
 * @param  {*}      tree      token
 * @param  {*}      result result accumulator
 * @param  {object} env    environment
 * @return {*}      evaluated value
 */
const evaluateKeyword = (evaluator, tree, result, env) => {
    // (quote exp)
    if (tree[0].kw === Keyword.quote) {
        // map values to a list of quotes
        return evaluator.evaluateQuote(evaluator, tree[1]);
    }
    // (if test conseq alt)
    if (tree[0].kw === Keyword.if) {
        return evaluator.evaluate(evaluator.truth(evaluator.evaluate(tree[1], result, env)) ? tree[2]
            : tree[3], result, env);
    }
    // (when test conseq)
    if (tree[0].kw === Keyword.when) {
        if (evaluator.truth(evaluator.evaluate(tree[1], result, env))) {
            return evaluator.evaluateSequence(evaluator, tree.slice(2), result, env);
        }
        return null;
    }
    // (unless not test conseq)
    if (tree[0].kw === Keyword.unless) {
        if (!evaluator.truth(evaluator.evaluate(tree[1], result, env))) {
            return evaluator.evaluateSequence(evaluator, tree.slice(2), result, env);
        }
        return null;
    }
    // (cond test conseq test conseq ...)
    if (tree[0].kw === Keyword.cond) {
        for (let b = 1; b < tree.length - 1; b++) {
            const node = tree[b];
            if (node[0].type === Keyword.Type && node[0].kw === Keyword.else) {
                throw new SyntaxError(`wrong sequence of ${node[0].value}`);
            }
        }
        for (let b = 1; b < tree.length; b++) {
            const nodes = tree[b];
            if (nodes[0].type === Keyword.Type
                && (nodes[0].kw === Keyword.else
                    || evaluator.truth(evaluator.evaluate(nodes[0], result, env)))) {
                return evaluator.evaluateSequence(evaluator, nodes.slice(1), result, env);
            }
        }
        return null;
    }
    // (case test conseq test conseq ...)
    if (tree[0].kw === Keyword.case) {
        const k = evaluator.evaluate(tree[1], result, env);
        for (let b = 1; b < tree.length - 1; b++) {
            const nodes = tree[b];
            if (nodes[0].type === Keyword.Type && nodes[0].kw === Keyword.else) {
                throw new SyntaxError(`wrong sequence of ${nodes[0].value}`);
            }
        }
        for (let b = 2; b < tree.length; b++) {
            const nodes = tree[b];
            if (nodes[0].type === Keyword.Type
                && (nodes[0].kw === Keyword.else
                    || nodes[0].filter((e) => e.value === k).length > 0)) {
                return evaluator.evaluateSequence(evaluator, nodes.slice(1), result, env);
            }
        }
        return null;
    }
    // (set! var exp)
    if (tree[0].kw === Keyword.set) {
        const localEnv = env.find(tree[1].value);
        if (localEnv) {
            localEnv.find(tree[1].value).set(tree[1].value, evaluator.evaluate(tree[2], result, env));
            return null;
        }
        throw new SyntaxError(`undefined symbol '${tree[1].value}'`);
    }
    // (define var exp)
    if (tree[0].kw === Keyword.define) {
        const key = tree[1].value;
        const value = evaluator.evaluate(tree[2], result, env);
        return env.set(key, value);
    }
    // (lambda (var*) exp)
    if (tree[0].kw === Keyword.lambda) {
        const f = (...args) => {
            return evaluator.evaluate(tree[2], result, new Environment(tree[1], args, env));
        };
        return f;
    }
    // (begin exp*)
    if (tree[0].kw === Keyword.begin) {
        return evaluator.evaluateSequence(evaluator, tree.slice(1), result, env);
    }
    // (let exp* exp*)
    if (tree[0].kw === Keyword.let) {
        return evaluator.evaluateLet(evaluator, tree.slice(1), result, env);
    }
    // (define-module (var) exp)
    if (tree[0].kw === Keyword.define_module) {
        return evaluator.evaluateDefineModule(evaluator, tree, result, env);
    }
    if (tree[0].kw === Keyword.use_module) {
        // modules are imported earlier
        return null;
    }
    // undefined keyword
    throw new SyntaxError(`undefined keyword '${tree[0].value}'`);
};


export default evaluateKeyword;
