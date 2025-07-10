"use strict"

/**
 * Details
 * TODO - rename to "Models"
 * @namespace details
 */

const init = ({ lib, swLib }) => {
    const details = {
        foils: require('./foils').init({ lib, swLib }),
        moulds: require('./moulds').init({ lib, swLib }),
        profiles: require('./profiles').init({ lib, swLib }),
    }
    details.frameRect = require('./frame-rect').init({ lib, swLib: { ...swLib, details } })

    return details;
}

module.exports = { init };
