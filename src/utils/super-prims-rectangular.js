"use strict"

const superPrimsRectInit = ({ lib, swLib }) => {
    const { cuboid, cylinder, triangle, rectangle } = lib.primitives
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate, extrudeLinear } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { position } = swLib.core
    const { geometry } = swLib.utils

    // Defining corner styles and available tag options
    const cStyleDefault = { inv: false, inset: false, offset: false }
    const cStyleRoundDef = { inv: true, offset: true }
    const cStyleRectDef = { inv: true, inset: true, offset: true }
    const cStyleEllipseDef = { ...cStyleRectDef }

    const cornerStyles = {
        round: { id: 'round', ...cStyleDefault, ...cStyleRoundDef },
        tri45deg: { id: 'tri45deg', ...cStyleDefault },
        tri30deg: { id: 'tri30deg', ...cStyleDefault },
        triGolden: { id: 'triGolden', ...cStyleDefault },
        triSilver: { id: 'triSilver', ...cStyleDefault },
        triBronze: { id: 'triBronze', ...cStyleDefault },
        triCopper: { id: 'triCopper', ...cStyleDefault },
        rectGolden: { id: 'rectGolden', ...cStyleDefault, ...cStyleRectDef },
        rectSixtyThirty: { id: 'rectSixtyThirty', ...cStyleDefault, ...cStyleRectDef },
        rectSilver: { id: 'rectSilver', ...cStyleDefault, ...cStyleRectDef },
        rectBronze: { id: 'rectBronze', ...cStyleDefault, ...cStyleRectDef },
        rectCopper: { id: 'rectCopper', ...cStyleDefault, ...cStyleRectDef },
        rectSuperGolden: { id: 'rectSuperGolden', ...cStyleDefault, ...cStyleRectDef },
        rectPlastic: { id: 'rectPlastic', ...cStyleDefault, ...cStyleRectDef },
        ellipseGolden: { id: 'ellipseGolden', ...cStyleDefault, ...cStyleEllipseDef },
        ellipseSixtyThirty: { id: 'ellipseSixtyThirty', ...cStyleDefault, ...cStyleEllipseDef },
        ellipseSilver: { id: 'ellipseSilver', ...cStyleDefault, ...cStyleEllipseDef },
        ellipseBronze: { id: 'ellipseBronze', ...cStyleDefault, ...cStyleEllipseDef },
        ellipseCopper: { id: 'ellipseCopper', ...cStyleDefault, ...cStyleEllipseDef },
        ellipseSuperGolden: { id: 'ellipseSuperGolden', ...cStyleDefault, ...cStyleEllipseDef },
        ellipsePlastic: { id: 'ellipsePlastic', ...cStyleDefault, ...cStyleEllipseDef },
        cornerBezGolden: { id: 'cornerBezGolden', ...cStyleDefault },
        cornerBezSixtyThirty: { id: 'cornerBezSixtyThirty', ...cStyleDefault },
        cornerBezSilver: { id: 'cornerBezSilver', ...cStyleDefault },
        cornerBezBronze: { id: 'cornerBezBronze', ...cStyleDefault },
        cornerBezCopper: { id: 'cornerBezCopper', ...cStyleDefault },
        cornerBezSuperGolden: { id: 'cornerBezSuperGolden', ...cStyleDefault },
        cornerBezPlastic: { id: 'cornerBezPlastic', ...cStyleDefault },
    }

    const rectangularFrameDefOpts = {
        direction: 'in',
        frameWidth: 5,
        cornerOpts: {
            style: 'round',
            radius: 2.5,
        }
    }
    rectangularFrameDefOpts.outCornerOpts = rectangularFrameDefOpts.cornerOpts

    /**
     * Frame rect
     * @memberof utils.superPrimitives
     * @param {object} opts 
     * @param {number[]} opts.size - Size of interior space
     * @param {string} opts.direction - Where ornaments are applied. Choose between "in" (default), "out", or "both"
     * @param {number} opts.frameWidth - Width of frame around interior space
     * @param {object} opts.cornerOpts - options for interior side
     * @param {string} opts.cornerOpts.style
     * @param {number} opts.cornerOpts.size
     * @param {number} opts.cornerOpts.radius
     * @param {string} opts.cornerOpts.longAxis
     * @param {string} opts.cornerOpts.opt - Option for each corner. Choose between "inv", "inset", "offset"
     * @param {object} opts.outCornerOpts - options for exterior side
     * @returns ...
     */
    const rectangularFrame = ({
        size,
        direction = rectangularFrameDefOpts.direction,
        frameWidth = rectangularFrameDefOpts.frameWidth,
        cornerOpts = rectangularFrameDefOpts.cornerOpts,
        outCornerOpts = rectangularFrameDefOpts.outCornerOpts,
    }) => {
        const specs = {
            totalSize: [
                frameWidth * 2 + size[0],
                frameWidth * 2 + size[1],
            ],
            // TODO - calculate long axis
            longAxis: cornerOpts.longAxis || 'x'
        }

        const outerRect = rectangle({ size: specs.totalSize })
        const outerRectCoords = position.getGeomCoords(outerRect)

        const innerRect = rectangle({ size })
        const innerRectCoords = position.getGeomCoords(innerRect)

        return subtract(outerRect, innerRect);
    }

    return {
        rectangularFrame,
    }
}

module.exports = { init: superPrimsRectInit };
