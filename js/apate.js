
const APATE = APATE || {};

/**
 * namespace creation function.
 * create a namespace from the 'ns' parameter.
 * ex: ns = 'modules.utils.datetime'
 * namepscae: modules = { utils = { datatime = { } } }
 * @param  {string}     ns namespace string representation
 * @return {object}     created namespace object
 */
APATE.namespace = function namespace(ns) {
    let parts = ns.split('.');
    let parent = APATE;

    // strip redundant leading global
    if (parts[0] === 'APATE') {
        parts = parts.slice(1);
    }

    for (let i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};


export default APATE;
