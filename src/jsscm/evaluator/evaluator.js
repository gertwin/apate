// evaluator functions
import evaluateAtom from './evaluate.atom';
import evaluateLet from './evaluate.let';
import evaluateQuote from './evaluate.quote';
import evaluateKeyword from './evaluate.keyword';
import evaluateSequence from './evaluate.sequence';
import evaluateDefineModule from './evaluate.define.module';


const Evaluator = function Evaluator() {
    // evaluator reference
    const evaluator = this;

    /**
     *
     * @param {*} t
     */
    evaluator.truth = (t) => {
        return Array.isArray(t) ? t.length : t;
    };

    // evaluator functions
    evaluator.evaluateAtom = evaluateAtom;
    evaluator.evaluateLet = evaluateLet;
    evaluator.evaluateQuote = evaluateQuote;
    evaluator.evaluateKeyword = evaluateKeyword;
    evaluator.evaluateSequence = evaluateSequence;
    evaluator.evaluateDefineModule = evaluateDefineModule;

    /**
     * evaluator entry function
     * @param  {array}  tree, ast (sub)tree
     * @param  {*}      result, intermediate result
     * @param  {*}      env, environmment for this evaluate function
     * @return {*}      result of the evaluation of tree
     */
    evaluator.evaluate = (tree, result, env) => {
        if (Array.isArray(tree)) {
            // keywords
            if (tree[0].keywords) {
                return evaluator.evaluateKeyword(evaluator, tree, result, env);
            }
            // (proc exp*)
            const exps = tree.map((exp) => {
                return evaluator.evaluate(exp, result, env);
            });
            const exp = exps.shift();
            // is it a function call
            if (exp && typeof exp === 'function') {
                return exp(...exps);
            }

            if (exps.length > 0) {
                return exps[exps.length - 1];
            }

            return exp;
        }

        return evaluator.evaluateAtom(evaluator, tree, result, env);
    };

    // public interface
    return {
        evaluate: evaluator.evaluate,
    };

};

export default Evaluator;
