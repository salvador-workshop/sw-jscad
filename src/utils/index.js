"use strict"

/**
 * Utilities
 * @namespace utils
 */

const init = ({ lib, swLib }) => {
    const utils = {
        transform: require('./transform').init({ lib }),
    }

    // Dependent on lib and core modules
    utils.geometry = require('./geometry').init({ lib, swLib: { ...swLib, utils } });
    utils.superPrimitives = require('./super-primitives').init({ lib, swLib: { ...swLib, utils } });

    return utils;
}

module.exports = { init };
