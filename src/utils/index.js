"use strict"

/**
 * Utilities
 * @namespace utils
 */

const utilsInit = ({ lib, swLib }) => {
    const utils = {
        transform: require('./transform').init({ lib, swLib }),
        extras: require('./extras'),
    }

    return utils;
}

module.exports = { init: utilsInit };
