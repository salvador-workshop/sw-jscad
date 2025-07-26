"use strict"

/**
 * 2D and 3D models
 * @namespace models
 */

const modelsInit = ({ lib, swLib }) => {
    const models = {
        profiles: require('./profiles').init({ lib, swLib }),
    }
    models.prefab = require('./prefab').init({ lib, swLib: { ...swLib, models } })
    return models
}

module.exports = { init: modelsInit };
