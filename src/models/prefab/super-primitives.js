"use strict"

/**
 * ...
 * @memberof utils
 * @namespace superPrimitives
 */

//-----------
// TO-DO
//---------------------
// - Cylinders with rounded corners
//---------------------

const superPrimitivesInit = ({ lib, swLib }) => {
    const meshPrims = require('./super-prims-mesh').init({ lib, swLib });

    const { cuboid } = lib.primitives

    /**
     * Frame cuboid
     * @memberof utils.superPrimitives
     * @param {*} param0 
     * @returns ...
     */
    const frameCuboid = ({
        size,
        frameWidth,
    }) => {
        const outerCuboid = cuboid({ size });

        return outerCuboid;
    }

    return {
        frameCuboid,
        ...meshPrims,
    }
}

module.exports = { init: superPrimitivesInit };
