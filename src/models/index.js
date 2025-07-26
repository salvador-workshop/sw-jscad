"use strict"

/**
 * 2D and 3D models
 * @namespace models
 */

const modelsInit = ({ lib, swLib }) => {
    return {
        prefab: require('./prefab').init({ lib, swLib }),
        profiles: require('./profiles').init({ lib, swLib }),
    }
}

module.exports = { init: modelsInit };
