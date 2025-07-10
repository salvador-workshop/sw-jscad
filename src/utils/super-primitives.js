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
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate, extrudeLinear } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { maths } = swLib.core
    const { geometry } = swLib.utils

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
        mesh: meshPrims,
        rectangular: rectangularPrims,
    }
}

module.exports = { init: superPrimitivesInit };
