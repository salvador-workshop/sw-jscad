"use strict"

/**
 * Utilities
 * @namespace utils
 */

/**
 * ...
 * @memberof utils
 * @param {string} str 
 * @returns ...
 */
const camelCase = (str) => {
    // Using replace method with regEx
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

const init = ({ lib, swLib }) => {
    const utils = {
        transform: require('./transform').init({ lib, swLib }),
        camelCase,
        /**
         * ...
         * @memberof utils
         * @param {string} str 
         * @returns ...
         */
        constantToCamelCase: (str) => {
            return camelCase(str.replaceAll('_', ' ').toLowerCase())
        }
    }

    // Dependent on lib and core modules
    utils.geometry = require('./geometry').init({ lib, swLib: { ...swLib, utils } });
    utils.superPrimitives = require('./super-primitives').init({ lib, swLib: { ...swLib, utils } });

    return utils;
}

module.exports = { init };
