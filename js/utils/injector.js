
import APATE from '../apate';

APATE.namespace('APATE.utils');


APATE.utils.Injector = (function injector() {

    // dependencies dictionary
    const dependencies = {};

    /**
     * register a dependency
     * @param  {string} key   [dependency key]
     * @param  {object} value [dependency value]
     */
    const register = (key, value) => {
        dependencies[key] = value;
    };

    /**
     * resolve dependencies for func
     * @param  {[type]} deps  [description]
     * @param  {[type]} func  [description]
     * @return {[type]}       [description]
     */
    const resolve = (deps, func, context = null) => {
        const args = [];
        deps.forEach((dep) => {
            if (dependencies[dep]) {
                args.push(dependencies[dep]);
            } else {
                throw new Error(`Can not resolve dependency: '${dep}'`);
            }
        });
        // bind context if available
        if (context) {
            const boundFunc = func.bind(context);
            return boundFunc(...args);
        }
        return func(...args);
    };

    // revealing public API
    return {
        register,
        resolve,
    };
}());

export default APATE.utils.Injector;
