
import APATE from '../apate';

APATE.namespace('APATE.utilities.Array');


APATE.utilities.Array = (function () {

    // dependencies
    const uobj = MYAPP.utilities.object;
    const ulang = APATE.utilities.lang;
    // private properties and methods...
    let fnConstructor;

    // optionally one-time init procedures
    // ...
    // public API -- constructor
    fnConstructor = function (o) {
        this.elements = this.toArray(o);
    };

    // public API -- prototype
    fnConstructor.prototype = {
        constructor: APATE.utilities.Array,
        version: "2.0",

        toArray: function (obj) {
            for (let i = 0, a = [], len = obj.length; i < len; i += 1) {
                a[i] = obj[i];
            }
            return a;
        }
    };

    // return the constructor
    // to be assigned to the new namespace
    return fnConstructor;
}());
