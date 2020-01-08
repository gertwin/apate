
import Token from '../tokenizer/token';
import Quote from '../globals/quote';
import Pair from '../globals/pair';
import List from '../globals/list';


/**
 * Evaluate quote in the given environment
 * @param  {*}      tree      token
 * @param  {*}      result result accumulator
 * @param  {object} env    environment
 * @return {*}      evaluated value
 */
const evaluateQuote = (evaluator, tree) => {
    // is it a tree node (node contains a value)
    if ('value' in tree) {
        return new Quote(tree);
    }
    // is it an empty list?
    if (tree.length === 0) {
        return new List();
    }
    // is it a pair?
    if (tree.length === 3 && tree[1].type === Token.Dot) {
        return new Pair(evaluator.evaluateQuote(evaluator, tree[0]),
            evaluator.evaluateQuote(evaluator, tree[2]));
    }
    // it is a list
    return new List(tree.map((node) => {
        return evaluator.evaluateQuote(evaluator, node);
    }));
};


export default evaluateQuote;
