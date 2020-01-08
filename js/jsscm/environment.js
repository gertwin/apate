

/**
 * Environment class
 */
export default class Environment {

    /**
     * Initialize the environment.
     * @param {*} params
     * @param {*} args
     * @param {*} outer
     */
    constructor(params, args, outer) {
        this.outer = outer;
        this.dict = Object.create(null);

        if (params && args) {
            for (let i = 0; i < params.length; ++i) {
                this.set(params[i].value, args[i]);
            }
        }
    }

    /**
     * Get an item from this environment
     * @param {*} v key to dearch for
     */
    get(v) {
        return this.dict[`$${v}`];
    }

    /**
     * Add an key + value to this environment
     * @param {*} v key to add
     * @param {*} val value to add
     */
    set(v, val) {
        this.dict[`$${v}`] = val;
    }

    /**
     * Find the dictionaury containing the requested key
     * @param {*} v
     */
    find(v) {
        // search this enviroment
        if ((`$${v}`) in this.dict) {
            return this;
        }
        // search in outer environment
        if (this.outer) {
            return this.outer.find(v);
        }
        return null;
    }

}
