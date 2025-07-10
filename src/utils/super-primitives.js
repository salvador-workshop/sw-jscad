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
    const meshPrims = require('./geometry').init({ lib, swLib });
    const rectangularPrims = require('./geometry').init({ lib, swLib });

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
        ...rectangularPrims,
    }
}

module.exports = { init: superPrimitivesInit };
