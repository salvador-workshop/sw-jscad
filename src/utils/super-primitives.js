"use strict"

/**
 * ...
 * @namespace utils.superPrimitives
 */

//-----------
// TO-DO
//---------------------
// - Cylinders with rounded corners
//---------------------

const superPrimitivesInit = ({ lib, swLib }) => {
    const meshPrims = require('./super-prims-mesh').init({ lib, swLib });

    const { cuboid, cylinder, triangle, rectangle } = lib.primitives

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
