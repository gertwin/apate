
import APATE from '../apate';

APATE.namespace('APATE.utilities.Array');


APATE.utilities.Array = (function () {

    // private properties
    const arString = "[object Array]";
    const ops = Object.prototype.toString;

    // private methods
    const inArray = function (haystack, needle) {
        for (var i = 0, max = haystack.length; i < max; i += 1) {
            if (haystack[i] === needle) {
                return i;
            }
        }
        return −1;
    };

    const isArray = function (a) {
        return ops.call(a) === arString;
    };

    // revealing public API
    return {
        isArray: isArray,
        indexOf: inArray
    };
}());

