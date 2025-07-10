"use strict"

const superPrimsRectInit = ({ lib, swLib }) => {
    const { circle, cuboid, cylinder, triangle, rectangle } = lib.primitives
    const { expand } = lib.expansions
    const { translate, rotate, align, mirror } = lib.transforms
    const { subtract, union } = lib.booleans
    const { measureBoundingBox, measureDimensions } = lib.measurements
    const { extrudeRotate, extrudeLinear } = lib.extrusions
    const { TAU } = lib.maths.constants

    const { position } = swLib.core
    const { geometry, profiles } = swLib.utils

    // Defining corner styles and available tag options
    const cStyleDefault = { inv: false, inset: false, offset: false }
    const cStRound = { inv: true, offset: true }
    const cStRect = { inv: true, inset: true, offset: true }
    const cStEllipse = { ...cStRect }

    const cornerStyleTypes = ['round', 'tri', 'rect', 'ellipse', 'cornerBez']

    const cRoundStyles = {
        round: {
            id: 'round',
            ...cStyleDefault,
            ...cStRound,
            func: ({ radius }) => {
                return circle({ radius })
            }
        },
    }

    const cTriStyles = {
        tri45deg: {
            id: 'tri45deg',
            ...cStyleDefault,
            func: profiles.triangle.right45
        },
        tri30deg: {
            id: 'tri30deg',
            ...cStyleDefault,
            func: profiles.triangle.right30
        },
        triGolden: {
            id: 'triGolden',
            ...cStyleDefault,
            func: profiles.triangle.rightGolden
        },
        triSilver: {
            id: 'triSilver',
            ...cStyleDefault,
            func: profiles.triangle.rightSilver
        },
        triBronze: {
            id: 'triBronze',
            ...cStyleDefault,
            func: profiles.triangle.rightBronze
        },
        triCopper: {
            id: 'triCopper',
            ...cStyleDefault,
            func: profiles.triangle.rightCopper
        },
    }

    const cRectStyles = {
        rectGolden: {
            id: 'rectGolden',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.golden
        },
        rectSixtyThirty: {
            id: 'rectSixtyThirty',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.sixtyThirty
        },
        rectSilver: {
            id: 'rectSilver',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.silver
        },
        rectBronze: {
            id: 'rectBronze',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.bronze
        },
        rectCopper: {
            id: 'rectCopper',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.copper
        },
        rectSuperGolden: {
            id: 'rectSuperGolden',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.superGolden
        },
        rectPlastic: {
            id: 'rectPlastic',
            ...cStyleDefault,
            ...cStRect,
            func: profiles.rectangle.plastic
        },
    }

    const cEllipseStyles = {
        ellipseGolden: {
            id: 'ellipseGolden',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.golden
        },
        ellipseSixtyThirty: {
            id: 'ellipseSixtyThirty',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.sixtyThirty
        },
        ellipseSilver: {
            id: 'ellipseSilver',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.silver
        },
        ellipseBronze: {
            id: 'ellipseBronze',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.bronze
        },
        ellipseCopper: {
            id: 'ellipseCopper',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.copper
        },
        ellipseSuperGolden: {
            id: 'ellipseSuperGolden',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.superGolden
        },
        ellipsePlastic: {
            id: 'ellipsePlastic',
            ...cStyleDefault,
            ...cStEllipse,
            func: profiles.ellipse.plastic
        },
    }

    const cCornerBezStyles = {
        cornerBezGolden: {
            id: 'cornerBezGolden',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.golden
        },
        cornerBezSixtyThirty: {
            id: 'cornerBezSixtyThirty',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.sixtyThirty
        },
        cornerBezSilver: {
            id: 'cornerBezSilver',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.silver
        },
        cornerBezBronze: {
            id: 'cornerBezBronze',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.bronze
        },
        cornerBezCopper: {
            id: 'cornerBezCopper',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.copper
        },
        cornerBezSuperGolden: {
            id: 'cornerBezSuperGolden',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.superGolden
        },
        cornerBezPlastic: {
            id: 'cornerBezPlastic',
            ...cStyleDefault,
            func: profiles.curves.rightCorner.plastic
        },
    }

    const cornerStyles = {
        ...cRoundStyles,
        ...cTriStyles,
        ...cRectStyles,
        ...cEllipseStyles,
        ...cCornerBezStyles,
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
     * @param {string} opts.cornerOpts.style - profile type, like "tri45deg", "rectSixtyThirty", "ellipseGolden", "cornerBezSilver"
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

        const inRect = rectangle({ size })
        const inRectCoords = position.getGeomCoords(inRect)
        const inRectCtrlPts = geometry.rectangle.getRectangleCtrlPoints(inRect)
        const inRectCorners = geometry.rectangle.getRectangleCorners(inRect)

        const outRect = rectangle({ size: specs.totalSize })
        const outRectCoords = position.getGeomCoords(outRect)
        const outRectCtrlPts = geometry.rectangle.getRectangleCtrlPoints(outRect)
        const outRectCorners = geometry.rectangle.getRectangleCorners(outRect)

        const inCornerPieces = Object.entries(inRectCorners).map(([cName, cPt]) => {
            if (cName == 'c1') {
                return {}
            } else if (cName == 'c2') {
                return {}
            } else if (cName == 'c3') {
                return {}
            } else {
                // defaults to c1
                return {}
            }
        })

        const outCornerPieces = Object.entries(outRectCorners).map(([cName, cPt]) => {
            if (cName == 'c1') {
                return {}
            } else if (cName == 'c2') {
                return {}
            } else if (cName == 'c3') {
                return {}
            } else {
                // defaults to c1
                return {}
            }
        })

        return subtract(outRect, inRect);
    }

    return {
        rectangularFrame,
    }
}

module.exports = { init: superPrimsRectInit };
