"use strict"

/**
 * ...
 * @memberof models
 * @namespace prefab
 */
const prefabInit = ({ lib, swLib }) => {
    return {
        foils3d: require('./foils-3d').init({ lib, swLib }),
        mesh3d: require('./mesh-3d').init({ lib, swLib }),
        mouldings: require('./mouldings').init({ lib, swLib }),
        text3d: require('./text-3d').init({ lib, swLib }),
    }
}

module.exports = { prefabInit };
