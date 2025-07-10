"use strict"

const superPrimsRectInit = ({ lib, swLib }) => {
    const meshPrims = require('./geometry').init({ lib, swLib });

    const { cuboid, cylinder, triangle, rectangle } = lib.primitives
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate, extrudeLinear } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { maths } = swLib.core
    const { geometry } = swLib.utils

    const cornerStyles = [
        'round',
        'invRound',
        'tri45deg',
        'tri30deg',
        'triGolden',
        'triSilver',
        'triBronze',
        'triCopper',
        'bezierGolden',
        'bezierSixtyThirty',
        'bezierSilver',
        'bezierBronze',
        'bezierCopper',
        'bezierSuperGolden',
        'bezierPlastic',
        'ellipseGolden',
        'ellipseSixtyThirty',
        'ellipseSilver',
        'ellipseBronze',
        'ellipseCopper',
        'ellipseSuperGolden',
        'ellipsePlastic',
    ]

    /**
     * Frame rect
     * @memberof utils.superPrimitives
     * @param {object} opts 
     * @param {number[]} opts.size 
     * @param {number} opts.frameWidth
     * @param {object} opts.cornerOpts
     * @param {string} opts.cornerOpts.style
     * @param {string} opts.cornerOpts.size
     * @param {string} opts.cornerOpts.radius
     * @param {string} opts.cornerOpts.longAxis
     * @returns ...
     */
    const frame = ({
        size,
        frameWidth,
        cornerOpts,
    }) => {
        const totalSize = [
            frameWidth * 2 + size[0],
            frameWidth * 2 + size[1],
        ]
        const outerRect = rectangle({ totalSize })
        const innerRect = null

        return outerRect;
    }

    return {
        frame,
    }
}

module.exports = { init: superPrimsRectInit };
